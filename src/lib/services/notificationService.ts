import { supabase } from "../supabase/client";

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
  ADOPTION_STATUS_CHANGED = "adoption_status_changed",
  PAYMENT_COMPLETED = "payment_completed",
  PAYOUT_PROCESSED = "payout_processed",
  WELCOME = "welcome",
  BREED_MATCH_FOUND = "breed_match_found",
  LISTING_CREATED = "listing_created",
  BREEDER_VERIFIED = "breeder_verified",
  PASSWORD_RESET = "password_reset",
  EMAIL_VERIFICATION = "email_verification",
  OTP_LOGIN = "otp_login",
  TICKET_CREATED = "ticket_created",
  TICKET_UPDATED = "ticket_updated",
  TICKET_RESOLVED = "ticket_resolved",
  TICKET_COMMENT_ADDED = "ticket_comment_added",
  REVIEW_REQUEST = "review_request",
}

// Action types for notifications
export enum NotificationAction {
  VIEW_ADOPTION = "view_adoption",
  VIEW_LISTING = "view_listing",
  VIEW_PAYMENT = "view_payment",
  REPLY_MESSAGE = "reply_message",
  VIEW_PROFILE = "view_profile",
  MARK_READ = "mark_read",
}

export class NotificationService {
  /**
   * Send both database notification and Novu workflow trigger
   */
  static async sendNotification(
    dbPayload: NotificationPayload,
    novuPayload?: NovuNotificationPayload
  ): Promise<string | null> {
    try {
      const response = await fetch("/api/novu/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dbPayload, novuPayload }),
      });

      const result = await response.json();
      return result.success ? result.notificationId : null;
    } catch (error) {
      console.error("Failed to send notification:", error);
      return null;
    }
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
    try {
      const response = await fetch("/api/novu/send-notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifications }),
      });

      const result = await response.json();
      if (!result.success) {
        console.error("Failed to send notifications:", result.error);
      }
    } catch (error) {
      console.error("Failed to send notifications:", error);
    }
  }

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
      case "submitted":
        // Notify breeder of new application
        notifications.push(
          {
            db: {
              userId: breederId,
              type: "application_received",
              title: "New Adoption Application Received",
              body: `A new adoption application has been submitted for your listing "${listingTitle}".`,
              targetType: "adoption",
              targetId: adoptionId,
              meta: { adoptionId, listingId, seekerId },
            },
            novu: {
              workflowId: "adoption-submitted",
              to: { subscriberId: breederId },
              payload: {
                adoptionId,
                listingId,
                listingTitle,
                seekerId,
                seekerName: "Seeker", // Will be overridden by hook
                seekerAvatar: null,
              },
            },
          },
          // Notify seeker that application is under review
          {
            db: {
              userId: seekerId,
              type: "application_received",
              title: "Adoption Under Review",
              body: `Your adoption application for ${listingTitle} is now being reviewed by breeder`,
              targetType: "application",
              targetId: adoptionId,
              meta: { adoptionId, listingId, status },
            },
            novu: {
              workflowId: "adoption-submitted",
              to: { subscriberId: seekerId },
              payload: {
                adoptionId,
                listingId,
                listingTitle,
                seekerId,
                status,
                title: "Adoption Under Review",
                body: `Your adoption application for ${listingTitle} is now being reviewed by the breeder`,
              },
            },
          }
        );

        // Notify admin via broadcast (separate from the array)
        await this.sendAdminBroadcastMessage(
          "Adoption Application Submitted",
          `A new adoption application has been submitted for "${listingTitle}" and is now under review`,
          {
            category: "user",
            details: [
              { label: "Listing", value: listingTitle },
              { label: "Application ID", value: adoptionId },
              { label: "Seeker ID", value: seekerId },
              { label: "Breeder ID", value: breederId },
            ],
          }
        );
        break;

      case "approved":
        // Notify seeker of approval
        notifications.push({
          db: {
            userId: seekerId,
            type: "adoption_status_changed",
            title: "Adoption Application Approved",
            body: `Congratulations! Your adoption application for ${listingTitle} has been approved.`,
            targetType: "application",
            targetId: adoptionId,
            meta: { adoptionId, listingId, status },
          },
          novu: {
            workflowId: "adoption-status-changed",
            to: { subscriberId: seekerId },
            payload: {
              adoptionId,
              listingId,
              listingTitle,
              seekerId,
              status,
              title: "Adoption Application Approved",
              body: `Congratulations! Your adoption application for ${listingTitle} has been approved.`,
            },
          },
        });

        // Notify admin via broadcast (separate from the array)
        await this.sendAdminBroadcastMessage(
          "Adoption Status: Approved",
          `Adoption application for "${listingTitle}" has been approved`,
          {
            category: "user",
            details: [
              { label: "Listing", value: listingTitle },
              { label: "Application ID", value: adoptionId },
              { label: "Seeker ID", value: seekerId },
              { label: "Breeder ID", value: breederId },
            ],
          }
        );
        break;

      case "rejected":
        // Notify seeker of rejection
        notifications.push({
          db: {
            userId: seekerId,
            type: "adoption_status_changed",
            title: "Adoption Application Not Approved",
            body: `Your adoption application for ${listingTitle} was not approved at this time`,
            targetType: "application",
            targetId: adoptionId,
            meta: { adoptionId, listingId, status },
          },
          novu: {
            workflowId: "adoption-status-changed",
            to: { subscriberId: seekerId },
            payload: {
              adoptionId,
              listingId,
              listingTitle,
              seekerId,
              status,
              title: "Adoption Application Not Approved",
              body: `Your adoption application for ${listingTitle} was not approved at this time`,
            },
          },
        });

        // Notify admin via broadcast (separate from the array)
        await this.sendAdminBroadcastMessage(
          "Adoption Status: Rejected",
          `Adoption application for "${listingTitle}" has been rejected`,
          {
            category: "user",
            details: [
              { label: "Listing", value: listingTitle },
              { label: "Application ID", value: adoptionId },
              { label: "Seeker ID", value: seekerId },
              { label: "Breeder ID", value: breederId },
            ],
          }
        );
        break;

      case "withdrawn":
        // Notify breeder that seeker withdrew
        if (breederId) {
          notifications.push({
            db: {
              userId: breederId,
              type: "adoption_status_changed",
              title: "Adoption Application Withdrawn",
              body: `The seeker has withdrawn their application for "${listingTitle}".`,
              targetType: "application",
              targetId: adoptionId,
              meta: { adoptionId, listingId, status, seekerId },
            },
            novu: {
              workflowId: "adoption-status-changed",
              to: { subscriberId: breederId },
              payload: {
                adoptionId,
                listingId,
                listingTitle,
                seekerId,
                breederId,
                status,
                title: "Adoption Application Withdrawn",
                body: `The seeker has withdrawn their application for "${listingTitle}".`,
              },
            },
          });

          // Notify admin via broadcast (separate from the array)
          await this.sendAdminBroadcastMessage(
            "Adoption Status: Withdrawn",
            `Adoption application for "${listingTitle}" has been withdrawn by seeker`,
            {
              category: "user",
              details: [
                { label: "Listing", value: listingTitle },
                { label: "Application ID", value: adoptionId },
                { label: "Seeker ID", value: seekerId },
                { label: "Breeder ID", value: breederId },
              ],
            }
          );
        }
        break;

      case "completed":
        // Notify seeker of completion
        notifications.push({
          db: {
            userId: seekerId,
            type: "adoption_status_changed",
            title: "Adoption Completed",
            body: `Your adoption process for ${listingTitle} has been completed successfully`,
            targetType: "application",
            targetId: adoptionId,
            meta: { adoptionId, listingId, status },
          },
          novu: {
            workflowId: "adoption-status-changed",
            to: { subscriberId: seekerId },
            payload: {
              adoptionId,
              listingId,
              listingTitle,
              seekerId,
              status,
              title: "Adoption Completed",
              body: `Your adoption process for ${listingTitle} has been completed successfully`,
            },
          },
        });

        // Send review request notification to seeker
        await this.sendReviewRequestNotification(
          seekerId,
          "the breeder", // We could get the actual breeder name if needed
          listingTitle,
          adoptionId,
          listingId
        );

        // Notify admin via broadcast (separate from the array)
        await this.sendAdminBroadcastMessage(
          "Adoption Status: Completed",
          `Adoption process for "${listingTitle}" has been completed`,
          {
            category: "user",
            details: [
              { label: "Listing", value: listingTitle },
              { label: "Application ID", value: adoptionId },
              { label: "Seeker ID", value: seekerId },
              { label: "Breeder ID", value: breederId },
            ],
          }
        );
        break;

      default:
        // Generic notification for other statuses
        notifications.push({
          db: {
            userId: seekerId,
            type: "adoption_status_changed",
            title: "Adoption Status Updated",
            body: `Your adoption status for ${listingTitle} has been updated to ${status}`,
            targetType: "application",
            targetId: adoptionId,
            meta: { adoptionId, listingId, status },
          },
          novu: {
            workflowId: "adoption-status-changed",
            to: { subscriberId: seekerId },
            payload: {
              adoptionId,
              listingId,
              listingTitle,
              seekerId,
              status,
              title: "Adoption Status Updated",
              body: `Your adoption status for ${listingTitle} has been updated to ${status}`,
            },
          },
        });
    }

    // Send all notifications
    for (const notification of notifications) {
      await this.sendNotification(notification.db, notification.novu);
    }
  }

  /**
   * Send payment confirmation notifications to all relevant parties
   */
  static async sendPaymentNotification(
    seekerId: string,
    breederId: string,
    paymentType: "reservation" | "final",
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

    const isReservation = paymentType === "reservation";
    const commissionFee = amount * 0.1; // 10% commission
    const earnings = amount - commissionFee;

    // Notify seeker of payment confirmation
    notifications.push({
      db: {
        userId: seekerId,
        type: "payment_completed",
        title: isReservation
          ? "Reservation Payment Confirmed"
          : "Final Payment Confirmed",
        body: isReservation
          ? `Your reservation payment for ${listingTitle} has been confirmed. The listing is now reserved for you.`
          : `Your final payment for ${listingTitle} has been confirmed. Your adoption is now complete!`,
        targetType: "application",
        targetId: applicationId,
        meta: { applicationId, listingId, paymentType, transactionId, amount },
      },
      novu: {
        workflowId: "final-payment-completed", // Use the same workflow for both payment types
        to: { subscriberId: seekerId },
        payload: {
          applicationId,
          listingId,
          listingTitle,
          seekerId,
          amount,
          paymentType,
        },
      },
    });

    // Notify breeder of payment received
    notifications.push({
      db: {
        userId: breederId,
        type: "payment_received",
        title: isReservation
          ? "Reservation Payment Received"
          : "Final Payment Received",
        body: isReservation
          ? `You have received a reservation payment of ₦${amount}. The listing is now reserved.`
          : `You have received the final payment of ₦${amount}. Payout will be processed soon.`,
        targetType: "application",
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
        workflowId: isReservation
          ? "reservation-fee-paid"
          : "final-payment-completed",
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
      },
    });

    // Notify admin of payment via broadcast (separate from the array)
    await this.sendAdminBroadcastMessage(
      isReservation
        ? "Reservation Payment Processed"
        : "Final Payment Processed",
      isReservation
        ? `Reservation payment of ₦${amount} processed for "${listingTitle}".`
        : `Final payment of ₦${amount} processed for "${listingTitle}".`,
      {
        category: "user",
        details: [
          { label: "Application ID", value: applicationId },
          { label: "Listing", value: listingTitle },
          { label: "Amount", value: `₦${amount}` },
          { label: "Seeker ID", value: seekerId },
          { label: "Breeder ID", value: breederId },
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
        type: "payout_processed",
        title: "Payout Processed",
        body: `Your payout of ₦${amount} has been processed successfully.`,
        meta: { amount, transferReference },
      },
      {
        workflowId: "payout-processed",
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
  static async sendWelcomeNotification(
    userId: string,
    firstName: string,
    email: string
  ): Promise<void> {
    await this.sendNotification(
      {
        userId,
        type: "welcome",
        title: "Welcome to Pethouse!",
        body: `Welcome to Pethouse, ${firstName}! We're excited to have you join our community.`,
        meta: { firstName, email },
      },
      {
        workflowId: "welcome-user",
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
    await this.sendAdminBroadcastMessage(
      "New User Signup",
      `${firstName} (${email}) has signed up as a ${role}.`,
      {
        category: "user",
        details: [
          { label: "User ID", value: userId },
          { label: "Name", value: firstName },
          { label: "Email", value: email },
          { label: "Role", value: role },
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
      const response = await fetch("/api/novu/create-subscriber", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriberId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          data: userData.data,
        }),
      });

      // if (!response.ok) {
      //   throw new Error('Subscriber creation failed');
      // }
    } catch (error) {
      console.error("Failed to create subscriber:", error);
      // Don't throw - subscriber creation is not critical for onboarding
    }
  }

  /**
   * Send admin notification for listing creation
   */
  static async sendListingCreatedNotification(
    listingId: string,
    listingTitle: string,
    listingType: string,
    breederId: string,
    breederName: string
  ): Promise<void> {
    await this.sendAdminBroadcastMessage(
      "New Listing Created",
      `${breederName} created a new ${listingType} listing: ${listingTitle}`,
      {
        category: "user",
        details: [
          { label: "Listing ID", value: listingId },
          { label: "Listing Title", value: listingTitle },
          { label: "Listing Type", value: listingType },
          { label: "Breeder ID", value: breederId },
          { label: "Breeder Name", value: breederName },
        ],
      }
    );
  }

  /**
   * Send breeder notification for listing creation
   */
  static async sendListingCreatedToBreederNotification(
    listingId: string,
    listingTitle: string,
    listingType: string,
    breederId: string,
    breederName: string
  ): Promise<void> {
    await this.sendNotification(
      {
        userId: breederId,
        type: "listing_created",
        title: "Listing Created Successfully",
        body: `Your ${listingType} listing "${listingTitle}" has been created and is now live.`,
        targetType: "listing",
        targetId: listingId,
        meta: {
          listingId,
          listingTitle,
          listingType,
          breederId,
          breederName,
        },
      },
      {
        workflowId: "listing-created",
        to: { subscriberId: breederId },
        payload: {
          listingId,
          listingTitle,
          listingType,
          breederId,
          breederName,
        },
      }
    );
  }

  /**
   * Subscribe user to breed interest topic (wishlist)
   * Uses server-side API route for topic subscription
   */
  static async subscribeToBreedInterest(
    subscriberId: string,
    breedId: string,
    breedName: string
  ): Promise<void> {
    try {
      const response = await fetch("/api/novu/subscribe-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriberId,
          topicKey: `breed-${breedId}-interested`,
          topicName: `breed-${breedId}-interested`,
        }),
      });

      // if (!response.ok) {
      //   throw new Error('Breed interest subscription failed');
      // }

      console.log(
        `Successfully subscribed ${subscriberId} to breed interest: ${breedName}`
      );
    } catch (error) {
      console.error(
        `Failed to subscribe ${subscriberId} to breed interest ${breedName}:`,
        error
      );
      // Don't throw - topic subscription is not critical for core functionality
    }
  }

  /**
   * Subscribe user to breeder activity topic
   * Uses server-side API route for topic subscription
   */
  static async subscribeToBreeder(
    subscriberId: string,
    breederId: string,
    breederName: string
  ): Promise<void> {
    try {
      const response = await fetch("/api/novu/subscribe-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriberId,
          topicKey: `breeder-${breederId}-subscribers`,
          topicName: `breeder-${breederId}-subscribers`,
        }),
      });

      // if (!response.ok) {
      //   throw new Error('Breeder subscription failed');
      // }

      console.log(
        `Successfully subscribed ${subscriberId} to breeder: ${breederName}`
      );
    } catch (error) {
      console.error(
        `Failed to subscribe ${subscriberId} to breeder ${breederName}:`,
        error
      );
      // Don't throw - topic subscription is not critical for core functionality
    }
  }

  /**
   * Unsubscribe user from breeder activity topic
   * Uses server-side API route for topic unsubscription
   */
  static async unsubscribeFromBreeder(
    subscriberId: string,
    breederId: string
  ): Promise<void> {
    try {
      const response = await fetch("/api/novu/unsubscribe-topic", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriberId,
          topicKey: `breeder-${breederId}-subscribers`,
        }),
      });

      // if (!response.ok) {
      //   throw new Error('Breeder unsubscription failed');
      // }

      console.log(
        `Successfully unsubscribed ${subscriberId} from breeder: ${breederId}`
      );
    } catch (error) {
      console.error(
        `Failed to unsubscribe ${subscriberId} from breeder ${breederId}:`,
        error
      );
      // Don't throw - topic unsubscription is not critical for core functionality
    }
  }

  /**
   * Unsubscribe user from breed interest topic
   * Uses server-side API route for topic unsubscription
   */
  static async unsubscribeFromBreedInterest(
    subscriberId: string,
    breedId: string
  ): Promise<void> {
    try {
      const response = await fetch("/api/novu/unsubscribe-topic", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriberId,
          topicKey: `breed-${breedId}-interested`,
        }),
      });

      // if (!response.ok) {
      //   throw new Error('Breed interest unsubscription failed');
      // }

      console.log(
        `Successfully unsubscribed ${subscriberId} from breed interest: ${breedId}`
      );
    } catch (error) {
      console.error(
        `Failed to unsubscribe ${subscriberId} from breed interest ${breedId}:`,
        error
      );
      // Don't throw - topic unsubscription is not critical for core functionality
    }
  }

  /**
   * Send notification to user breed interest topic (when new listings match preferences)
   */
  static async sendUserBreedMatchNotification(
    userBreedId: string,
    breedName: string,
    listingTitle: string,
    breederName: string,
    listingId: string
  ): Promise<void> {
    try {
      const response = await fetch("/api/novu/send-topic-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: "breed-interest-broadcast",
          topicKey: `user-breed-${userBreedId}-interested`,
          payload: {
            userBreedId,
            breedName,
            listingTitle,
            breederName,
            listingId,
            title: `New ${breedName} Available!`,
            message: `Check out this new ${breedName} listing from ${breederName}`,
          },
        }),
      });

      // if (!response.ok) {
      //   throw new Error('User breed match notification failed');
      // }
    } catch (error) {
      console.error("Failed to send user breed match notification:", error);
    }
  }

  /**
   * Send notification to user breed interest topic for new breeder
   */
  static async sendNewUserBreedNotification(
    userBreedId: string,
    breedName: string,
    breederName: string
  ): Promise<void> {
    try {
      const response = await fetch("/api/novu/send-topic-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: "breed-interest-broadcast",
          topicKey: `user-breed-${userBreedId}-interested`,
          payload: {
            userBreedId,
            breedName,
            breederName,
            title: `New ${breedName} Breeder!`,
            message: `A new breeder for ${breedName} has joined: ${breederName}`,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("New user breed notification failed");
      }
    } catch (error) {
      console.error("Failed to send new user breed notification:", error);
    }
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
      data?: Record<string, any>;
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
    promises.push(
      this.subscribeToBreedInterest(
        userId,
        preferences.preferredBreedId,
        preferences.preferredBreedName
      )
    );

    // Send welcome notification
    promises.push(
      this.sendWelcomeNotification(userId, userData.firstName, userData.email)
    );

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
      data?: Record<string, any>;
    }
  ): Promise<void> {
    const promises: Promise<void>[] = [];

    // Create subscriber in Novu
    promises.push(this.createSubscriber(userId, userData));

    // Send welcome notification
    promises.push(
      this.sendWelcomeNotification(userId, userData.firstName, userData.email)
    );

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
      const response = await fetch("/api/novu/send-topic-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: "breed-interest-broadcast",
          topicKey: `breed-${breedId}-interested`,
          payload: {
            breedId,
            breedName,
            listingTitle,
            breederName,
            listingId,
            title: `New ${breedName} Available!`,
            message: `Check out this new ${breedName} listing from ${breederName}`,
          },
        }),
      });

      // if (!response.ok) {
      //   throw new Error('Breed match notification failed');
      // }
    } catch (error) {
      console.error("Failed to send breed match notification:", error);
    }
  }

  /**
   * Send notification to breed interest topic for new breeder
   */
  static async sendNewBreederNotification(
    breedId: string,
    breedName: string,
    breederName: string,
    userBreedId: string
  ): Promise<void> {
    try {
      const response = await fetch("/api/novu/send-topic-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: "breed-interest-broadcast",
          topicKey: `breed-${breedId}-interested`,
          payload: {
            breedId,
            breedName,
            breederName,
            userBreedId,
            title: `New ${breedName} Breeder!`,
            message: `A new breeder for ${breedName} has joined: ${breederName}`,
          },
        }),
      });

      // if (!response.ok) {
      //   throw new Error('New breeder notification failed');
      // }
    } catch (error) {
      console.error("Failed to send new breeder notification:", error);
    }
  }

  /**
   * Send broadcast message to admin users using topics
   */
  static async sendAdminBroadcastMessage(
    title: string,
    message: string,
    options?: {
      priority?: "low" | "normal" | "high" | "urgent";
      category?: "general" | "user" | "breeder" | "system" | "security";
      actionUrl?: string;
      actionLabel?: string;
      details?: Array<{ label: string; value: string }>;
      footerContent?: string;
    }
  ): Promise<void> {
    try {
      const response = await fetch("/api/novu/send-topic-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicKey: "admin-users",
          title,
          message,
          options,
        }),
      });

      // if (!response.ok) {
      //   throw new Error('Broadcast failed');
      // }
    } catch (error) {
      console.error("Failed to send broadcast message:", error);
    }
  }

  /**
   * Send notification to breeder subscribers (when breeder adds new content)
   * This method orchestrates all breeder-related notifications in a clean hierarchy
   */
  static async sendBreederActivityNotification(
    breederId: string,
    breederName: string,
    activityType: "listing" | "breed",
    activityData: {
      title: string;
      id: string;
      breed_id?: string;
      user_breed_id?: string;
    }
  ): Promise<void> {
    try {
      // 1. Send admin broadcast notification
      await this.sendAdminBroadcastMessage(
        "New Content Added",
        `${breederName} added new ${activityType}: "${activityData.title}"`,
        {
          category: "user",
          details: [
            { label: "Breeder ID", value: breederId },
            { label: "Breeder Name", value: breederName },
            { label: "Activity Type", value: activityType },
            { label: "Content ID", value: activityData.id },
            { label: "Content Title", value: activityData.title },
            { label: "Breed ID", value: activityData.breed_id || "N/A" },
            {
              label: "User Breed ID",
              value: activityData.user_breed_id || "N/A",
            },
          ],
        }
      );

      // 2. Send breeder-specific notification
      await this.sendNotification(
        {
          userId: breederId,
          type: "content_created",
          title: "Content Created Successfully",
          body: `Your new ${activityType} "${activityData.title}" has been created and is now live.`,
          targetType: activityType,
          targetId: activityData.id,
          meta: {
            activityType,
            activityId: activityData.id,
            activityTitle: activityData.title,
            breederId,
            breederName,
            breed_id: activityData.breed_id,
            user_breed_id: activityData.user_breed_id,
          },
        },
        {
          workflowId:
            activityType === "listing" ? "listing-created" : "breed-added",
          to: { subscriberId: breederId },
          payload: {
            activityType,
            activityId: activityData.id,
            activityTitle: activityData.title,
            breederId,
            breederName,
            breed_id: activityData.breed_id,
            user_breed_id: activityData.user_breed_id,
          },
        }
      );

      // 3. Send breed match notifications based on activity type
      if (activityType === "listing") {
        // For listings, notify both general breed and user breed subscribers
        if (activityData.breed_id) {
          const { data: breed } = await supabase
            .from("breeds")
            .select("name")
            .eq("id", activityData.breed_id)
            .single();

          const breedName = breed?.name || "Unknown Breed";

          // Notify general breed interest subscribers
          await this.sendBreedMatchNotification(
            activityData.breed_id,
            breedName,
            activityData.title,
            breederName,
            activityData.id
          );
        }

        if (activityData.user_breed_id) {
          const { data: userBreed } = await supabase
            .from("user_breeds")
            .select("breeds (name)")
            .eq("id", activityData.user_breed_id)
            .single();

          const breedName = userBreed?.breeds?.[0]?.name || "Unknown Breed";

          // Notify user breed interest subscribers
          await this.sendUserBreedMatchNotification(
            activityData.user_breed_id,
            breedName,
            activityData.title,
            breederName,
            activityData.id
          );
        }
      } else if (activityType === "breed") {
        // For new breeds, notify general breed interest subscribers
        if (activityData.breed_id) {
          const { data: breed } = await supabase
            .from("breeds")
            .select("name")
            .eq("id", activityData.breed_id)
            .single();

          const breedName = breed?.name || "Unknown Breed";

          // Notify general breed interest subscribers
          await this.sendNewBreederNotification(
            activityData.breed_id,
            breedName,
            breederName,
            activityData.user_breed_id || ""
          );

          // Notify user breed interest subscribers
          if (activityData.user_breed_id) {
            await this.sendNewUserBreedNotification(
              activityData.user_breed_id,
              breedName,
              breederName
            );
          }
        }
      }

      // 4. Send breeder activity notifications to direct subscribers
      const activityTitles = {
        listing: "New Listing Added",
        breed: "New Breed Added",
      };

      const activityMessages = {
        listing: `${breederName} added a new listing: "${activityData.title}"`,
        breed: `${breederName} added a new breed: "${activityData.title}"`,
      };

      const response = await fetch("/api/novu/send-topic-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: "breeder-activity-broadcast",
          topicKey: `breeder-${breederId}-subscribers`,
          payload: {
            breederId,
            breederName,
            activityType,
            activityId: activityData.id,
            activityTitle: activityData.title,
            title: activityTitles[activityType],
            message: activityMessages[activityType],
          },
        }),
      });

      // if (!response.ok) {
      //   throw new Error('Breeder activity notification failed');
      // }
    } catch (error) {
      console.error("Failed to send breeder activity notification:", error);
    }
  }

  /**
   * Send notification when a support ticket is created
   */
  static async sendTicketCreatedNotification(
    ticketId: string,
    subject: string,
    priority: string,
    userId: string
  ): Promise<void> {
    const isUrgent = priority === "urgent";
    const isHigh = priority === "high";

    // Send notification to ticket creator
    await this.sendNotification(
      {
        userId,
        type: NotificationType.TICKET_CREATED,
        title: "Support Ticket Created",
        body: `Your support ticket "${subject}" has been created successfully. We'll respond as soon as possible.`,
        targetType: "ticket",
        targetId: ticketId,
        meta: { ticketId, subject, priority },
      },
      {
        workflowId: "ticket-created",
        to: { subscriberId: userId },
        payload: {
          ticketId,
          subject,
          priority,
          title: "Support Ticket Created",
          message: `Your support ticket "${subject}" has been created successfully.`,
        },
      }
    );

    // Send admin alert for urgent/high priority tickets
    if (isUrgent || isHigh) {
      await this.sendAdminBroadcastMessage(
        "Urgent Support Ticket",
        `${isUrgent ? "URGENT" : "High Priority"} support ticket: "${subject}"`,
        {
          category: "user",
          priority: isUrgent ? "urgent" : "high",
          details: [
            { label: "Ticket ID", value: ticketId },
            { label: "Subject", value: subject },
            { label: "Priority", value: priority },
            { label: "User ID", value: userId },
          ],
        }
      );
    }
  }

  /**
   * Send notification when ticket status is updated
   */
  static async sendTicketStatusNotification(
    ticketId: string,
    subject: string,
    newStatus: string,
    oldStatus: string,
    userId: string,
    updatedBy?: string
  ): Promise<void> {
    if (newStatus === oldStatus) return; // No change

    const statusMessages = {
      open: "Your ticket has been opened",
      in_progress: "We're working on your ticket",
      waiting_for_user: "We need more information to help resolve your ticket",
      resolved: "Your ticket has been resolved",
      closed: "Your ticket has been closed",
    };

    const isResolution = newStatus === "resolved" || newStatus === "closed";

    await this.sendNotification(
      {
        userId,
        type: isResolution
          ? NotificationType.TICKET_RESOLVED
          : NotificationType.TICKET_UPDATED,
        title: isResolution ? "Ticket Resolved" : "Ticket Status Updated",
        body: `${
          statusMessages[newStatus as keyof typeof statusMessages] ||
          `Status changed to ${newStatus}`
        }. Ticket: "${subject}"`,
        targetType: "ticket",
        targetId: ticketId,
        meta: { ticketId, subject, newStatus, oldStatus, updatedBy },
      },
      {
        workflowId: isResolution ? "ticket-resolved" : "ticket-updated",
        to: { subscriberId: userId },
        payload: {
          ticketId,
          subject,
          newStatus,
          oldStatus,
          title: isResolution ? "Ticket Resolved" : "Ticket Status Updated",
          message: `${
            statusMessages[newStatus as keyof typeof statusMessages] ||
            `Status changed to ${newStatus}`
          }`,
        },
      }
    );
  }

  /**
   * Send notification when a comment is added to a ticket
   */
  static async sendTicketCommentNotification(
    ticketId: string,
    commentId: string,
    subject: string,
    commenterId: string,
    recipientId: string,
    isAdminComment: boolean = false
  ): Promise<void> {
    // Don't notify if user is commenting on their own ticket
    if (commenterId === recipientId) return;

    const notificationType = isAdminComment ? "Admin Response" : "New Comment";
    const message = isAdminComment
      ? `Admin responded to your ticket "${subject}"`
      : `New comment on your ticket "${subject}"`;

    await this.sendNotification(
      {
        userId: recipientId,
        type: NotificationType.TICKET_COMMENT_ADDED,
        title: notificationType,
        body: message,
        targetType: "ticket",
        targetId: ticketId,
        meta: { ticketId, commentId, subject, commenterId, isAdminComment },
      },
      {
        workflowId: "ticket-comment-added",
        to: { subscriberId: recipientId },
        payload: {
          ticketId,
          commentId,
          subject,
          commenterId,
          isAdminComment,
          title: notificationType,
          message,
        },
      }
    );
  }

  /**
   * Send admin notification for ticket assignment
   */
  static async sendTicketAssignedNotification(
    ticketId: string,
    subject: string,
    assignedTo: string,
    assignedBy: string
  ): Promise<void> {
    await this.sendNotification(
      {
        userId: assignedTo,
        type: NotificationType.TICKET_UPDATED,
        title: "Ticket Assigned",
        body: `You have been assigned to ticket: "${subject}"`,
        targetType: "ticket",
        targetId: ticketId,
        meta: { ticketId, subject, assignedBy },
      },
      {
        workflowId: "ticket-assigned",
        to: { subscriberId: assignedTo },
        payload: {
          ticketId,
          subject,
          assignedBy,
          title: "Ticket Assigned",
          message: `You have been assigned to ticket: "${subject}"`,
        },
      }
    );
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
      promises.push(
        this.updateDatabaseNotificationReadStatus(dbNotificationId, true)
      );
    }

    await Promise.allSettled(promises);
  }

  /**
   * Update notification read status in database
   */
  private static async updateDatabaseNotificationReadStatus(
    notificationId: string,
    read: boolean
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: read })
        .eq("id", notificationId);

      if (error) {
        console.error("Database notification read status update error:", error);
      }
    } catch (error) {
      console.error("Database notification read status update error:", error);
    }
  }

  /**
   * Send review request notification when adoption is completed
   */
  static async sendReviewRequestNotification(
    seekerId: string,
    breederName: string,
    listingTitle: string,
    adoptionId: string,
    listingId: string
  ): Promise<void> {
    await this.sendNotification(
      {
        userId: seekerId,
        type: NotificationType.REVIEW_REQUEST,
        title: "Share Your Experience",
        body: `Congratulations on completing your adoption! Please share your experience with ${breederName} to help other pet seekers.`,
        targetType: "adoption",
        targetId: adoptionId,
        meta: { adoptionId, listingId, breederName, listingTitle },
      },
      {
        workflowId: "review-request",
        to: { subscriberId: seekerId },
        payload: {
          adoptionId,
          listingId,
          breederName,
          listingTitle,
          title: "Share Your Experience",
          message: `Congratulations on completing your adoption! Please share your experience with ${breederName} to help other pet seekers.`,
        },
      }
    );
  }
}
