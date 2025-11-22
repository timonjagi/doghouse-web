import { useQuery } from '@tanstack/react-query';
import { useUserProfile } from './useUserProfile';
import { useListings } from './useListings';
import { useApplicationsReceived } from './useApplications';
import { useTransactions } from './useTransactions';
import { supabase } from '../../supabase/client';

export interface BreederDashboardStats {
  activeLitters: number;
  pendingApplications: number;
  totalEarnings: number;
  earningsChange: number;
  applicationTrend: Array<{ month: string; applications: number }>;
  earningsTrend: Array<{ month: string; earnings: number }>;
  potentialMatches: Array<{
    id: string;
    name: string;
    location: string;
    preferredBreeds: string[];
    lastViewed: string;
    matchScore: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'application' | 'payment' | 'listing';
    title: string;
    timestamp: string;
    status?: string;
  }>;
}

export const useBreederDashboardStats = () => {
  const { data: profile } = useUserProfile();

  // Get breeder's listings
  const { data: listings = [] } = useListings({
    owner_id: profile?.id,
    status: 'active',
  });

  // Get applications for breeder's listings
  const { data: applications = [] } = useApplicationsReceived(profile?.id);

  // Get transactions for breeder (useTransactions automatically filters for current user)
  const { data: transactions = [] } = useTransactions();

  return useQuery({
    queryKey: ['breeder-dashboard-stats', profile?.id],
    queryFn: async (): Promise<BreederDashboardStats> => {
      if (!profile?.id) {
        return {
          activeLitters: 0,
          pendingApplications: 0,
          totalEarnings: 0,
          earningsChange: 0,
          applicationTrend: [],
          earningsTrend: [],
          potentialMatches: [],
          recentActivity: [],
        };
      }

      // Calculate metrics
      const activeLitters = listings.filter(listing => listing.status === 'active').length;
      const pendingApplications = applications.filter(app => app.status === 'pending').length;

      // Calculate earnings (sum of completed transactions)
      const completedTransactions = transactions.filter(t => t.status === 'completed');
      const totalEarnings = completedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

      // Calculate earnings change (compare last 30 days vs previous 30 days)
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const recentEarnings = completedTransactions
        .filter(t => new Date(t.created_at) >= thirtyDaysAgo)
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const previousEarnings = completedTransactions
        .filter(t => {
          const date = new Date(t.created_at);
          return date >= sixtyDaysAgo && date < thirtyDaysAgo;
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const earningsChange = previousEarnings > 0
        ? ((recentEarnings - previousEarnings) / previousEarnings) * 100
        : 0;

      // Generate application trend (last 6 months)
      const applicationTrend = generateMonthlyTrend(applications, 6, 'created_at');

      // Generate earnings trend (last 6 months)
      const earningsTrend = generateMonthlyTrend(
        completedTransactions,
        6,
        'created_at',
        'amount'
      );

      // Generate potential matches (seekers who recently viewed breeder's listings)
      const potentialMatches = await generatePotentialMatches(profile, listings);

      // Generate recent activity
      const recentActivity = generateRecentActivity(applications, transactions, listings);

      return {
        activeLitters,
        pendingApplications,
        totalEarnings,
        earningsChange,
        applicationTrend,
        earningsTrend,
        potentialMatches,
        recentActivity,
      };
    },
    enabled: !!profile?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

function generateMonthlyTrend(
  items: any[],
  months: number,
  dateField: string,
  valueField?: string
) {
  const now = new Date();
  const trend = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });

    const monthItems = items.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate.getMonth() === date.getMonth() &&
        itemDate.getFullYear() === date.getFullYear();
    });

    const value = valueField
      ? monthItems.reduce((sum, item) => sum + (item[valueField] || 0), 0)
      : monthItems.length;

    trend.push({
      month: monthName,
      [valueField ? valueField.replace('amount', 'earnings') : 'applications']: value,
    });
  }

  return trend;
}

function generateRecentActivity(applications: any[], transactions: any[], listings: any[]) {
  const activities = [];

  // Add recent applications
  applications.slice(0, 3).forEach(app => {
    activities.push({
      id: `app-${app.id}`,
      type: 'application' as const,
      title: `New application for ${app.listing?.title || 'listing'}`,
      timestamp: app.created_at,
      status: app.status,
    });
  });

  // Add recent payments
  transactions.slice(0, 2).forEach(transaction => {
    activities.push({
      id: `payment-${transaction.id}`,
      type: 'payment' as const,
      title: `Payment received: $${transaction.amount}`,
      timestamp: transaction.created_at,
    });
  });

  // Add recent listings
  listings.slice(0, 2).forEach(listing => {
    activities.push({
      id: `listing-${listing.id}`,
      type: 'listing' as const,
      title: `New listing: ${listing.title}`,
      timestamp: listing.created_at,
    });
  });

  // Sort by timestamp and take most recent 5
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
}

async function generatePotentialMatches(profile: any, listings: any[]) {
  try {
    if (listings.length === 0) return [];

    const listingIds = listings.map(l => l.id);

    // Get seekers who have viewed breeder's listings recently (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // For now, we'll simulate this with seekers who have applied to listings
    // In a real implementation, you'd have a listing_views table
    const { data: recentSeekers } = await supabase
      .from('applications')
      .select(`
        seeker_id,
        created_at,
        users!inner(
          id,
          name,
          location
        )
      `)
      .in('listing_id', listingIds)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (!recentSeekers?.length) return [];

    // Get unique seekers and their preferred breeds
    const uniqueSeekers = recentSeekers.reduce((acc, app) => {
      const seekerId = app.seeker_id;
      if (!acc[seekerId]) {
        acc[seekerId] = {
          id: seekerId,
          name: (app.users as any)?.name || 'Unknown',
          location: (app.users as any)?.location || 'Unknown',
          lastViewed: app.created_at,
          preferredBreeds: [] as string[],
        };
      }
      // Keep the most recent view date
      if (new Date(app.created_at) > new Date(acc[seekerId].lastViewed)) {
        acc[seekerId].lastViewed = app.created_at;
      }
      return acc;
    }, {} as Record<string, any>);

    // Get preferred breeds for these seekers
    const seekerIds = Object.keys(uniqueSeekers);
    if (seekerIds.length > 0) {
      const { data: userBreeds } = await supabase
        .from('user_breeds')
        .select('user_id, breeds(name)')
        .in('user_id', seekerIds);

      // Add preferred breeds to seekers
      userBreeds?.forEach(ub => {
        if (uniqueSeekers[ub.user_id]) {
          // @ts-ignore
          uniqueSeekers[ub.user_id].preferredBreeds.push(ub.breeds?.name);
        }
      });
    }

    // Calculate match scores based on breed matches with breeder's listings
    const breederBreeds = [...new Set(listings.map(l => l.breeds?.name).filter(Boolean))];

    const potentialMatches = Object.values(uniqueSeekers).map((seeker: any) => {
      let matchScore = 50; // Base score

      // Higher score for breed matches
      const breedMatches = seeker.preferredBreeds.filter((breed: string) =>
        breederBreeds.includes(breed)
      ).length;

      if (breedMatches > 0) {
        matchScore += breedMatches * 15; // +15 points per matching breed
      }

      // Higher score for location proximity
      if (profile.location && seeker.location?.toLowerCase().includes(profile.location.toLowerCase())) {
        matchScore += 20;
      }

      return {
        id: seeker.id,
        name: seeker.name,
        location: seeker.location,
        preferredBreeds: seeker.preferredBreeds,
        lastViewed: seeker.lastViewed,
        matchScore: Math.min(matchScore, 100), // Cap at 100
      };
    }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 4); // Return top 4 matches

    return potentialMatches;
  } catch (error) {
    console.error('Error generating potential matches:', error);
    return [];
  }
}
