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

export class NotificationService {
  /**
   * Send both database notification and Novu workflow trigger
   */
  static async sendNotification(
    dbPayload: NotificationPayload,
    novuPayload?: NovuNotificationPayload
  ): Promise<void> {
    const promises: Promise<any>[] = [];

    // Always insert into database
    promises.push(this.insertDatabaseNotification(dbPayload));

    // Trigger Novu workflow if provided
    if (novuPayload) {
      promises.push(this.triggerNovuWorkflow(novuPayload));
    }

    // Execute both operations in parallel
    await Promise.allSettled(promises);
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
  private static async insertDatabaseNotification(payload: NotificationPayload): Promise<void> {
    try {
      const { error } = await supabase.from('notifications').insert({
        user_id: payload.userId,
        type: payload.type,
        title: payload.title,
        body: payload.body,
        target_type: payload.targetType,
        target_id: payload.targetId,
        meta: payload.meta,
      });

      if (error) {
        console.error('Failed to insert database notification:', error);
        throw error;
      }
    } catch (error) {
      console.error('Database notification error:', error);
      // Don't throw - we don't want DB errors to break the flow
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
   * Send adoption status change notification
   */
  static async sendAdoptionStatusNotification(
    userId: string,
    status: string,
    listingTitle: string,
    adoptionId: string,
    listingId: string
  ): Promise<void> {
    const statusMessages = {
      submitted: {
        title: 'Adoption Under Review',
        body: `Your adoption application for ${listingTitle} is now being reviewed by the breeder`,
      },
      pending: {
        title: 'Adoption Under Review',
        body: `Your adoption application for ${listingTitle} is now being reviewed by the breeder`,
      },
      approved: {
        title: 'Adoption Application Approved',
        body: `Congratulations! Your adoption application for ${listingTitle} has been approved.`,
      },
      rejected: {
        title: 'Adoption Application Not Approved',
        body: `Your adoption application for ${listingTitle} was not approved at this time`,
      },
      withdrawn: {
        title: 'Adoption Application Withdrawn',
        body: `You have successfully withdrawn your application for ${listingTitle}`,
      },
      completed: {
        title: 'Adoption Completed',
        body: `Your adoption process for ${listingTitle} has been completed successfully`,
      },
    };

    const message = statusMessages[status as keyof typeof statusMessages] || {
      title: 'Adoption Status Updated',
      body: `Your adoption status for ${listingTitle} has been updated to ${status}`,
    };

    await this.sendNotification(
      {
        userId,
        type: 'adoption_status_changed',
        title: message.title,
        body: message.body,
        targetType: 'application',
        targetId: listingId,
        meta: { adoptionId, listingId, status },
      },
      {
        workflowId: 'adoption-status-changed',
        to: { subscriberId: userId },
        payload: {
          adoptionId,
          listingId,
          listingTitle,
          seekerId: userId,
          status,
          title: message.title,
          body: message.body,
        },
      }
    );
  }

  /**
   * Send payment confirmation notification
   */
  static async sendPaymentNotification(
    userId: string,
    paymentType: 'reservation' | 'final',
    listingTitle: string,
    amount: number,
    applicationId: string,
    listingId: string,
    transactionId: string
  ): Promise<void> {
    const isReservation = paymentType === 'reservation';
    const title = isReservation ? 'Reservation Payment Confirmed' : 'Final Payment Confirmed';
    const body = isReservation
      ? `Your reservation payment for ${listingTitle} has been confirmed. The listing is now reserved for you.`
      : `Your final payment for ${listingTitle} has been confirmed. Your adoption is now complete!`;

    await this.sendNotification(
      {
        userId,
        type: 'payment_completed',
        title,
        body,
        targetType: 'application',
        targetId: listingId,
        meta: { applicationId, listingId, paymentType, transactionId, amount },
      },
      {
        workflowId: 'final-payment-completed', // Use the same workflow for both
        to: { subscriberId: userId },
        payload: {
          applicationId,
          listingId,
          listingTitle,
          seekerId: userId,
          amount,
          paymentType,
        },
      }
    );
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
    await this.sendNotification(
      {
        userId: 'admin', // Send to admin
        type: 'new_user_signup',
        title: 'New User Signup',
        body: `${firstName} (${email}) has signed up as a ${role}.`,
        meta: { userId, firstName, email, role },
      },
      {
        workflowId: 'new-user-signup',
        to: { subscriberId: 'admin' },
        payload: {
          userId,
          firstName,
          email,
          role,
        },
      }
    );
  }
}