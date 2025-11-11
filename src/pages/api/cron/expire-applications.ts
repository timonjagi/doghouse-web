import { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

interface ExpiredApplication {
  id: string;
  listing_id: string;
  seeker_id: string;
  created_at: string;
  listings?: Array<{
    title: string;
    owner_id: string;
    status: string;
  }>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests (for Vercel cron) or GET requests (for manual testing)
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  // For Vercel cron, verify the authorization header
  if (req.method === 'POST') {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
  }

  try {
    const supabase = createPagesServerClient({ req, res });

    // Calculate the cutoff time (24 hours ago)
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - 24);

    console.log(`Checking for expired applications before: ${cutoffTime.toISOString()}`);

    // Find expired applications
    // Applications that are submitted, reservation not paid, and older than 24 hours
    const { data: expiredApplications, error: fetchError } = await supabase
      .from('applications')
      .select(`
        id,
        listing_id,
        seeker_id,
        created_at,
        listings (
          title,
          owner_id,
          status
        )
      `)
      .eq('status', 'submitted')
      .eq('reservation_paid', false)
      .lt('created_at', cutoffTime.toISOString())
      .not('listings.status', 'eq', 'completed') // Don't expire if listing is already completed
      .not('listings.status', 'eq', 'sold'); // Don't expire if listing is already sold

    if (fetchError) {
      console.error('Error fetching expired applications:', fetchError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch expired applications',
        error: fetchError.message,
      });
    }

    if (!expiredApplications || expiredApplications.length === 0) {
      console.log('No expired applications found');
      return res.status(200).json({
        success: true,
        message: 'No expired applications to process',
        processed: 0,
      });
    }

    console.log(`Found ${expiredApplications.length} expired applications`);

    let processedCount = 0;
    let errorCount = 0;
    const results = [];

    // Process each expired application
    for (const application of expiredApplications as ExpiredApplication[]) {
      try {
        const applicationId = application.id;
        const listingId = application.listing_id;
        const seekerId = application.seeker_id;
        const breederId = application.listings?.[0]?.owner_id;
        const listingTitle = application.listings?.[0]?.title || 'Unknown Listing';
        const listingStatus = application.listings?.[0]?.status;

        console.log(`Processing expired application ${applicationId} for listing ${listingTitle}`);

        // Update application status to expired
        const { error: appUpdateError } = await supabase
          .from('applications')
          .update({
            status: 'expired',
            updated_at: new Date().toISOString(),
          })
          .eq('id', applicationId);

        if (appUpdateError) {
          console.error(`Failed to update application ${applicationId}:`, appUpdateError);
          errorCount++;
          results.push({
            applicationId,
            success: false,
            error: appUpdateError.message,
          });
          continue;
        }

        // Update listing status back to available if it was reserved
        let listingUpdated = false;
        if (listingStatus === 'reserved') {
          const { error: listingUpdateError } = await supabase
            .from('listings')
            .update({
              status: 'available',
              updated_at: new Date().toISOString(),
            })
            .eq('id', listingId);

          if (listingUpdateError) {
            console.error(`Failed to update listing ${listingId}:`, listingUpdateError);
            // Continue processing - listing update failure shouldn't stop notifications
          } else {
            listingUpdated = true;
            console.log(`Released listing ${listingId} back to available status`);
          }
        }

        // Send notification to seeker
        const { error: seekerNotificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: seekerId,
            type: 'application_expired',
            title: 'Application Expired',
            body: `Your application for "${listingTitle}" has expired because the reservation fee was not paid within 24 hours. The listing is now available for other applicants.`,
            target_type: 'application',
            target_id: applicationId,
            meta: {
              applicationId,
              listingId,
              listingTitle,
              expiredAt: new Date().toISOString(),
              reason: 'reservation_fee_unpaid',
            },
          });

        if (seekerNotificationError) {
          console.error(`Failed to send seeker notification for application ${applicationId}:`, seekerNotificationError);
        }

        // Send notification to breeder
        if (breederId) {
          const { error: breederNotificationError } = await supabase
            .from('notifications')
            .insert({
              user_id: breederId,
              type: 'application_expired',
              title: 'Application Expired',
              body: `An application for your listing "${listingTitle}" has expired due to unpaid reservation fee. ${listingUpdated ? 'The listing has been released and is now available again.' : ''}`,
              target_type: 'listing',
              target_id: listingId,
              meta: {
                applicationId,
                listingId,
                listingTitle,
                seekerId,
                expiredAt: new Date().toISOString(),
                listingReleased: listingUpdated,
                reason: 'reservation_fee_unpaid',
              },
            });

          if (breederNotificationError) {
            console.error(`Failed to send breeder notification for application ${applicationId}:`, breederNotificationError);
          }
        }

        // Log the expiry action
        const { error: logError } = await supabase
          .from('activity_logs')
          .insert({
            action: 'application_expired',
            description: `Application ${applicationId} expired due to unpaid reservation fee`,
            context: {
              applicationId,
              listingId,
              listingTitle,
              seekerId,
              breederId,
              listingReleased: listingUpdated,
              originalListingStatus: listingStatus,
              expiredAt: new Date().toISOString(),
            },
          });

        if (logError) {
          console.error(`Failed to log expiry for application ${applicationId}:`, logError);
        }

        processedCount++;
        results.push({
          applicationId,
          listingId,
          seekerId,
          breederId,
          listingTitle,
          listingReleased: listingUpdated,
          success: true,
        });

        console.log(`Successfully processed expired application ${applicationId}`);

      } catch (error) {
        console.error(`Unexpected error processing application ${application.id}:`, error);
        errorCount++;
        results.push({
          applicationId: application.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    console.log(`Cron job completed: ${processedCount} processed, ${errorCount} errors`);

    return res.status(200).json({
      success: true,
      message: `Processed ${processedCount} expired applications with ${errorCount} errors`,
      processed: processedCount,
      errors: errorCount,
      results,
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
