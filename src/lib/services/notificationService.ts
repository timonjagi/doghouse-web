import { supabase } from '../supabase/client';
import novu from '../novu';

export interface NotificationPayload {
  userId: string;
  type: string;
  title: string;
  body: string;
  targetType?: string;
  targetId?: string;
  meta?: Record<string, any>;
}

export interface NovuNotificationPayload {
  workflowId: string;
  to: {
    subscriberId: string;
  };
  payload: Record<string, any>;
}

// Notification types for better type safety
export enum NotificationType {
  ADOPTION_STATUS_CHANGED = 'adoption_status_changed',
  PAYMENT_COMPLETED = 'payment_completed',
  PAYOUT_PROCESSED = 'payout_processed',
  WELCOME = 'welcome',
  BREED_MATCH_FOUND = 'breed_match_found',
  LISTING_CREATED = 'listing_created',
  BREEDER_VERIFIED = 'breeder_verified',
  PASSWORD_RESET = 'password_reset',
  EMAIL_VERIFICATION = 'email_verification',
  OTP_LOGIN = 'otp_login'
}

// Action types for notifications
export enum NotificationAction {
  VIEW_ADOPTION = 'view_adoption',
  VIEW_LISTING = 'view_listing',
  VIEW_PAYMENT = 'view_payment',
  REPLY_MESSAGE = 'reply_message',
  VIEW_PROFILE = 'view_profile',
  MARK_READ = 'mark_read'
}

export class NotificationService {
  /**
   * Send both database notification and Novu workflow trigger
   */
  static async sendNotification(
    dbPayload: NotificationPayload,
    novuPayload?: NovuNotificationPayload
  ): Promise<string | null> {
    let dbNotificationId: string | null = null;

    // Always insert into database first to get the ID
    try {
      dbNotificationId = await this.insertDatabaseNotification(dbPayload);
    } catch (error) {
      console.error('Failed to insert database notification:', error);
    }

    // Trigger Novu workflow if provided, include DB ID in payload
    if (novuPayload) {
      if (dbNotificationId) {
        // Store the DB notification ID in Novu payload for correlation
        novuPayload.payload.dbNotificationId = dbNotificationId;
      }
      try {
        await this.triggerNovuWorkflow(novuPayload);
      } catch (error) {
        console.error('Novu notification error:', error);
      }
    }

    return dbNotificationId;
  }

  /**
   * Send multiple notifications (useful for broadcasting to multiple users)
   */
  static async sendNotifications(
    notifications: Array<{
      db: NotificationPayload;
      novu?: NovuNotificationPayload;
    }>
  ): Promise<void> {
    const promises: Promise<any>[] = [];

    notifications.forEach(({ db, novu }) => {
      promises.push(this.insertDatabaseNotification(db));
      if (novu) {
        promises.push(this.triggerNovuWorkflow(novu));
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Insert notification into Supabase database
   */
  private static async insertDatabaseNotification(payload: NotificationPayload): Promise<string | null> {
    try {
      const { data, error } = await supabase.from('notifications').insert({
        user_id: payload.userId,
        type: payload.type,
        title: payload.title,
        body: payload.body,
        target_type: payload.targetType,
        target_id: payload.targetId,
        meta: payload.meta,
      }).select('id').single();

      if (error) {
        console.error('Failed to insert database notification:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Database notification error:', error);
      return null;
    }
  }

  /**
   * Trigger Novu workflow
   */
  private static async triggerNovuWorkflow(payload: NovuNotificationPayload): Promise<void> {
    try {
      await novu.trigger(payload);
    } catch (error) {
      console.error('Novu notification error:', error);
      // Don't throw - we don't want Novu errors to break the flow
    }
  }

  // Convenience methods for common notification types

  /**
   * Send adoption status change notifications to relevant parties
   */
  static async sendAdoptionStatusNotification(
    seekerId: string,
    breederId: string,
    status: string,
    listingTitle: string,
    adoptionId: string,
    listingId: string
  ): Promise<void> {
    const notifications: Array<{
      db: NotificationPayload;
      novu?: NovuNotificationPayload;
    }> = [];

    switch (status) {
      case 'submitted':
        // Notify breeder of new application
        notifications.push(
          {
            db: {
              userId: breederId,
              type: 'application_received',
              title: 'New Adoption Application Received',
              body: `A new adoption application has been submitted for your listing "${listingTitle}".`,
              targetType: 'adoption',
              targetId: listingId,
              meta: { adoptionId, listingId, seekerId },
            },
            novu: {
              workflowId: 'adoption-submitted',
              to: { subscriberId: breederId },
              payload: {
                adoptionId,
                listingId,
                listingTitle,
                seekerId,
                seekerName: 'Seeker', // Will be overridden by hook
                seekerAvatar: null,
              },
            }
          },
          // Notify seeker that application is under review
          {
            db: {
              userId: seekerId,
              type: 'application_received',
              title: 'Adoption Under Review',
              body: `Your adoption application for ${listingTitle} is now being reviewed by the breeder`,
              targetType: 'application',
              targetId: listingId,
              meta: { adoptionId, listingId, status },
            },
            novu: {
              workflowId: 'adoption-submitted',
              to: { subscriberId: seekerId },
              payload: {
                adoptionId,
                listingId,
                listingTitle,
                seekerId,
                status,
                title: 'Adoption Under Review',
                body: `Your adoption application for ${listingTitle} is now being reviewed by the breeder`,
              },
            }
          }
        );

        // Notify admin via broadcast (separate from the array)
        await this.sendBroadcastMessage(
          'Adoption Application Submitted',
          `A new adoption application has been submitted for "${listingTitle}" and is now under review`,
          {
            category: 'user',
            details: [
              { label: 'Listing', value: listingTitle },
              { label: 'Application ID', value: adoptionId },
              { label: 'Seeker ID', value: seekerId },
              { label: 'Breeder ID', value: breederId },
            ],
          }
        );
        break;

      case 'approved':
        // Notify seeker of approval
        notifications.push({
          db: {
            userId: seekerId,
            type: 'adoption_status_changed',
            title: 'Adoption Application Approved',
            body: `Congratulations! Your adoption application for ${listingTitle} has been approved.`,
            targetType: 'application',
            targetId: listingId,
            meta: { adoptionId, listingId, status },
          },
          novu: {
            workflowId: 'adoption-status-changed',
            to: { subscriberId: seekerId },
            payload: {
              adoptionId,
              listingId,
              listingTitle,
              seekerId,
              status,
              title: 'Adoption Application Approved',
              body: `Congratulations! Your adoption application for ${listingTitle} has been approved.`,
            },
          }
        });

        // Notify admin via broadcast (separate from the array)
        await this.sendBroadcastMessage(
          'Adoption Status: Approved',
          `Adoption application for "${listingTitle}" has been approved`,
          {
            category: 'user',
            details: [
              { label: 'Listing', value: listingTitle },
              { label: 'Application ID', value: adoptionId },
              { label: 'Seeker ID', value: seekerId },
              { label: 'Breeder ID', value: breederId },
            ],
          }
        );
        break;

      case 'rejected':
        // Notify seeker of rejection
        notifications.push({
          db: {
            userId: seekerId,
            type: 'adoption_status_changed',
            title: 'Adoption Application Not Approved',
            body: `Your adoption application for ${listingTitle} was not approved at this time`,
            targetType: 'application',
            targetId: listingId,
            meta: { adoptionId, listingId, status },
          },
          novu: {
            workflowId: 'adoption-status-changed',
            to: { subscriberId: seekerId },
            payload: {
              adoptionId,
              listingId,
              listingTitle,
              seekerId,
              status,
              title: 'Adoption Application Not Approved',
              body: `Your adoption application for ${listingTitle} was not approved at this time`,
            },
          }
        });

        // Notify admin via broadcast (separate from the array)
        await this.sendBroadcastMessage(
          'Adoption Status: Rejected',
          `Adoption application for "${listingTitle}" has been rejected`,
          {
            category: 'user',
            details: [
              { label: 'Listing', value: listingTitle },
              { label: 'Application ID', value: adoptionId },
              { label: 'Seeker ID', value: seekerId },
              { label: 'Breeder ID', value: breederId },
            ],
          }
        );
        break;

      case 'withdrawn':
        // Notify breeder that seeker withdrew
        if (breederId) {
          notifications.push({
            db: {
              userId: breederId,
              type: 'adoption_status_changed',
              title: 'Adoption Application Withdrawn',
              body: `The seeker has withdrawn their application for "${listingTitle}".`,
              targetType: 'application',
              targetId: listingId,
              meta: { adoptionId, listingId, status, seekerId },
            },
            novu: {
              workflowId: 'adoption-status-changed',
              to: { subscriberId: breederId },
              payload: {
                adoptionId,
                listingId,
                listingTitle,
                seekerId,
                breederId,
                status,
                title: 'Adoption Application Withdrawn',
                body: `The seeker has withdrawn their application for "${listingTitle}".`,
              },
            }
          });

          // Notify admin via broadcast (separate from the array)
          await this.sendBroadcastMessage(
            'Adoption Status: Withdrawn',
            `Adoption application for "${listingTitle}" has been withdrawn by seeker`,
            {
              category: 'user',
              details: [
                { label: 'Listing', value: listingTitle },
                { label: 'Application ID', value: adoptionId },
                { label: 'Seeker ID', value: seekerId },
                { label: 'Breeder ID', value: breederId },
              ],
            }
          );
        }
        break;

      case 'completed':
        // Notify seeker of completion
        notifications.push({
          db: {
            userId: seekerId,
            type: 'adoption_status_changed',
            title: 'Adoption Completed',
            body: `Your adoption process for ${listingTitle} has been completed successfully`,
            targetType: 'application',
            targetId: listingId,
            meta: { adoptionId, listingId, status },
          },
          novu: {
            workflowId: 'adoption-status-changed',
            to: { subscriberId: seekerId },
            payload: {
              adoptionId,
              listingId,
              listingTitle,
              seekerId,
              status,
              title: 'Adoption Completed',
              body: `Your adoption process for ${listingTitle} has been completed successfully`,
            },
          }
        });

        // Notify admin via broadcast (separate from the array)
        await this.sendBroadcastMessage(
          'Adoption Status: Completed',
          `Adoption process for "${listingTitle}" has been completed`,
          {
            category: 'user',
            details: [
              { label: 'Listing', value: listingTitle },
              { label: 'Application ID', value: adoptionId },
              { label: 'Seeker ID', value: seekerId },
              { label: 'Breeder ID', value: breederId },
            ],
          }
        );
        break;

      default:
        // Generic notification for other statuses
        notifications.push({
          db: {
            userId: seekerId,
            type: 'adoption_status_changed',
            title: 'Adoption Status Updated',
            body: `Your adoption status for ${listingTitle} has been updated to ${status}`,
            targetType: 'application',
            targetId: listingId,
            meta: { adoptionId, listingId, status },
          },
          novu: {
            workflowId: 'adoption-status-changed',
            to: { subscriberId: seekerId },
            payload: {
              adoptionId,
              listingId,
              listingTitle,
              seekerId,
              status,
              title: 'Adoption Status Updated',
              body: `Your adoption status for ${listingTitle} has been updated to ${status}`,
            },
          }
        });
    }

    // Send all notifications
    await this.sendNotifications(notifications);
  }

  /**
   * Send payment confirmation notifications to all relevant parties
   */
  static async sendPaymentNotification(
    seekerId: string,
    breederId: string,
    paymentType: 'reservation' | 'final',
    listingTitle: string,
    amount: number,
    applicationId: string,
    listingId: string,
    transactionId: string
  ): Promise<void> {
    const notifications: Array<{
      db: NotificationPayload;
      novu?: NovuNotificationPayload;
    }> = [];

    const isReservation = paymentType === 'reservation';
    const commissionFee = amount * 0.1; // 10% commission
    const earnings = amount - commissionFee;

    // Notify seeker of payment confirmation
    notifications.push({
      db: {
        userId: seekerId,
        type: 'payment_completed',
        title: isReservation ? 'Reservation Payment Confirmed' : 'Final Payment Confirmed',
        body: isReservation
          ? `Your reservation payment for ${listingTitle} has been confirmed. The listing is now reserved for you.`
          : `Your final payment for ${listingTitle} has been confirmed. Your adoption is now complete!`,
        targetType: 'application',
        targetId: listingId,
        meta: { applicationId, listingId, paymentType, transactionId, amount },
      },
      novu: {
        workflowId: 'final-payment-completed', // Use the same workflow for both payment types
        to: { subscriberId: seekerId },
        payload: {
          applicationId,
          listingId,
          listingTitle,
          seekerId,
          amount,
          paymentType,
        },
      }
    });

    // Notify breeder of payment received
    notifications.push({
      db: {
        userId: breederId,
        type: 'payment_received',
        title: isReservation ? 'Reservation Payment Received' : 'Final Payment Received',
        body: isReservation
          ? `You have received a reservation payment of ₦${amount}. The listing is now reserved.`
          : `You have received the final payment of ₦${amount}. Payout will be processed soon.`,
        targetType: 'application',
        targetId: applicationId,
        meta: {
          applicationId,
          paymentType,
          transactionId,
          amount,
          earnings,
        },
      },
      novu: {
        workflowId: isReservation ? 'reservation-fee-paid' : 'final-payment-completed',
        to: { subscriberId: breederId },
        payload: {
          applicationId,
          listingId,
          listingTitle,
          seekerId,
          breederId,
          amount,
          earnings,
          paymentType,
        },
      }
    });

    // Notify admin of payment via broadcast (separate from the array)
    await this.sendBroadcastMessage(
      isReservation ? 'Reservation Payment Processed' : 'Final Payment Processed',
      isReservation
        ? `Reservation payment of ₦${amount} processed for "${listingTitle}".`
        : `Final payment of ₦${amount} processed for "${listingTitle}".`,
      {
        category: 'user',
        details: [
          { label: 'Application ID', value: applicationId },
          { label: 'Listing', value: listingTitle },
          { label: 'Amount', value: `₦${amount}` },
          { label: 'Seeker ID', value: seekerId },
          { label: 'Breeder ID', value: breederId },
        ],
      }
    );

    // Send all notifications
    await this.sendNotifications(notifications);
  }

  /**
   * Send payout processed notification
   */
  static async sendPayoutNotification(
    breederId: string,
    amount: number,
    transferReference: string
  ): Promise<void> {
    await this.sendNotification(
      {
        userId: breederId,
        type: 'payout_processed',
        title: 'Payout Processed',
        body: `Your payout of ₦${amount} has been processed successfully.`,
        meta: { amount, transferReference },
      },
      {
        workflowId: 'payout-processed',
        to: { subscriberId: breederId },
        payload: {
          amount,
          transferReference,
          breederId,
        },
      }
    );
  }

  /**
   * Send welcome notification for new users
   */
  static async sendWelcomeNotification(userId: string, firstName: string, email: string): Promise<void> {
    await this.sendNotification(
      {
        userId,
        type: 'welcome',
        title: 'Welcome to Pethouse!',
        body: `Welcome to Pethouse, ${firstName}! We're excited to have you join our community.`,
        meta: { firstName, email },
      },
      {
        workflowId: 'welcome-user',
        to: { subscriberId: userId },
        payload: {
          userId,
          firstName,
          email,
        },
      }
    );
  }

  /**
   * Send admin notification for new user signup
   */
  static async sendNewUserSignupNotification(
    userId: string,
    firstName: string,
    email: string,
    role: string
  ): Promise<void> {
    // Send broadcast message to all admin users
    await this.sendBroadcastMessage(
      'New User Signup',
      `${firstName} (${email}) has signed up as a ${role}.`,
      {
        category: 'user',
        details: [
          { label: 'User ID', value: userId },
          { label: 'Name', value: firstName },
          { label: 'Email', value: email },
          { label: 'Role', value: role },
        ],
      }
    );
  }

  /**
   * Create a subscriber in Novu during onboarding
   */
  static async createSubscriber(
    subscriberId: string,
    userData: {
      firstName: string;
      lastName?: string;
      email: string;
      phone?: string;
      data?: Record<string, any>;
    }
  ): Promise<void> {
    try {
      // Trigger a workflow to auto-create the subscriber
      await novu.trigger({
        workflowId: 'welcome-user', // Use existing workflow to create subscriber
        to: {
          subscriberId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          data: userData.data,
        },
        payload: {
          userId: subscriberId,
          firstName: userData.firstName,
          email: userData.email,
        },
      });
    } catch (error) {
      console.error('Failed to create subscriber:', error);
      // Don't throw - subscriber creation is not critical for onboarding
    }
  }

  /**
   * Subscribe user to breed interest topic (wishlist)
   * Note: Topic subscriptions will be implemented when Novu API is available
   */
  static async subscribeToBreedInterest(
    subscriberId: string,
    breedId: string,
    breedName: string
  ): Promise<void> {
    // TODO: Implement when Novu topic subscription API is available
    console.log(`TODO: Subscribe ${subscriberId} to breed interest topic: ${breedName}`);
    // For now, just log - actual subscription will be handled later
  }

  /**
   * Subscribe user to breeder activity topic
   * Note: Topic subscriptions will be implemented when Novu API is available
   */
  static async subscribeToBreeder(
    subscriberId: string,
    breederId: string,
    breederName: string
  ): Promise<void> {
    // TODO: Implement when Novu topic subscription API is available
    console.log(`TODO: Subscribe ${subscriberId} to breeder: ${breederName}`);
    // For now, just log - actual subscription will be handled later
  }

  /**
   * Unsubscribe user from breeder activity topic
   * Note: Topic subscriptions will be implemented when Novu API is available
   */
  static async unsubscribeFromBreeder(
    subscriberId: string,
    breederId: string
  ): Promise<void> {
    // TODO: Implement when Novu topic subscription API is available
    console.log(`TODO: Unsubscribe ${subscriberId} from breeder: ${breederId}`);
    // For now, just log - actual unsubscription will be handled later
  }

  /**
   * Handle seeker onboarding completion with subscriber creation and subscriptions
   */
  static async completeSeekerOnboarding(
    userId: string,
    userData: {
      firstName: string;
      lastName?: string;
      email: string;
      phone?: string;
    },
    preferences: {
      preferredBreedId: string;
      preferredBreedName: string;
      preferredAge: string;
      preferredSex: string;
      spayNeuterPreference: string;
      activityLevel: string;
    }
  ): Promise<void> {
    const promises: Promise<void>[] = [];

    // Create subscriber in Novu
    promises.push(this.createSubscriber(userId, userData));

    // Subscribe to breed interest topic (wishlist)
    promises.push(this.subscribeToBreedInterest(userId, preferences.preferredBreedId, preferences.preferredBreedName));

    // Send welcome notification
    promises.push(this.sendWelcomeNotification(userId, userData.firstName, userData.email));

    // Wait for all operations to complete
    await Promise.allSettled(promises);

    console.log(`Completed onboarding setup for seeker: ${userId}`);
  }

  /**
   * Handle breeder onboarding completion
   */
  static async completeBreederOnboarding(
    userId: string,
    userData: {
      firstName: string;
      lastName?: string;
      email: string;
      phone?: string;
    }
  ): Promise<void> {
    const promises: Promise<void>[] = [];

    // Create subscriber in Novu
    promises.push(this.createSubscriber(userId, userData));

    // Send welcome notification
    promises.push(this.sendWelcomeNotification(userId, userData.firstName, userData.email));

    // Wait for all operations to complete
    await Promise.allSettled(promises);

    console.log(`Completed onboarding setup for breeder: ${userId}`);
  }

  /**
   * Send notification to breed interest topic (when new listings match preferences)
   */
  static async sendBreedMatchNotification(
    breedId: string,
    breedName: string,
    listingTitle: string,
    breederName: string,
    listingId: string
  ): Promise<void> {
    try {
      await novu.trigger({
        workflowId: 'breed-interest-broadcast',
        to: { type: "Topic", topicKey: `breed-${breedId}-interested` },
        payload: {
          breedId,
          breedName,
          listingTitle,
          breederName,
          listingId,
          title: `New ${breedName} Available!`,
          message: `Check out this new ${breedName} listing from ${breederName}`,
        },
      });
    } catch (error) {
      console.error('Failed to send breed match notification:', error);
    }
  }

  /**
   * Send broadcast message to admin users using topics
   */
  static async sendBroadcastMessage(
    title: string,
    message: string,
    options?: {
      priority?: 'low' | 'normal' | 'high' | 'urgent';
      category?: 'general' | 'user' | 'breeder' | 'system' | 'security';
      actionUrl?: string;
      actionLabel?: string;
      details?: Array<{ label: string; value: string }>;
      footerContent?: string;
    }
  ): Promise<void> {
    try {
      await novu.trigger({
        workflowId: 'admin-broadcast',
        to: { type: "Topic", topicKey: "admin-users" },
        payload: {
          title,
          message,
          priority: options?.priority || 'normal',
          category: options?.category || 'general',
          actionUrl: options?.actionUrl,
          actionLabel: options?.actionLabel,
          details: options?.details,
          footerContent: options?.footerContent,
        },
      });
    } catch (error) {
      console.error('Failed to send broadcast message:', error);
    }
  }

  /**
   * Send notification to breeder subscribers (when breeder adds new content)
   */
  static async sendBreederActivityNotification(
    breederId: string,
    breederName: string,
    activityType: 'listing' | 'breed',
    activityData: {
      title: string;
      id: string;
    }
  ): Promise<void> {
    try {
      const activityTitles = {
        listing: 'New Listing Added',
        breed: 'New Breed Added',
      };

      const activityMessages = {
        listing: `${breederName} added a new listing: "${activityData.title}"`,
        breed: `${breederName} added a new breed: "${activityData.title}"`,
      };

      await novu.trigger({
        workflowId: 'breeder-activity-broadcast',
        to: { type: "Topic", topicKey: `breeder-${breederId}-subscribers` },
        payload: {
          breederId,
          breederName,
          activityType,
          activityId: activityData.id,
          activityTitle: activityData.title,
          title: activityTitles[activityType],
          message: activityMessages[activityType],
        },
      });
    } catch (error) {
      console.error('Failed to send breeder activity notification:', error);
    }
  }

  /**
   * Mark a notification as read in both database and Novu
   */
  static async markNotificationAsRead(notification: any): Promise<void> {
    const promises: Promise<any>[] = [];

    // Mark as read in Novu
    promises.push(notification.markAsRead());

    // Mark as read in database using the stored DB notification ID
    const dbNotificationId = notification.data?.dbNotificationId;
    if (dbNotificationId) {
      promises.push(this.updateDatabaseNotificationReadStatus(dbNotificationId, true));
    }

    await Promise.allSettled(promises);
  }

  /**
   * Update notification read status in database
   */
  private static async updateDatabaseNotificationReadStatus(notificationId: string, read: boolean): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: read })
        .eq('id', notificationId);

      if (error) {
        console.error('Database notification read status update error:', error);
      }
    } catch (error) {
      console.error('Database notification read status update error:', error);
    }
  }
}
