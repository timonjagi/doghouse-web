import { supabase } from "lib/supabase/client";

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
    // Implementation for sending multiple notifications
    // This method is not fully implemented in the codebase
  }

  /**
   * Subscribe user to breed interest topic
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
   * Send adoption status notification to seeker and breeder
   */
  static async sendAdoptionStatusNotification(
    seekerId: string,
    breederId: string,
    status: string,
    listingTitle: string,
    adoptionId: string,
    listingId: string
  ): Promise<void> {
    try {
      // Create database notifications
      await this.sendNotification({
        userId: seekerId,
        type: "adoption_status_update",
        title: `Adoption Status Update`,
        body: `Your adoption application for "${listingTitle}" has been ${status}.`,
        targetType: "adoption",
        targetId: adoptionId,
        meta: {
          status,
          listingTitle,
          adoptionId,
          listingId,
        },
      });

      await this.sendNotification({
        userId: breederId,
        type: "adoption_status_update",
        title: `Adoption Status Update`,
        body: `Adoption application for "${listingTitle}" has been ${status}.`,
        targetType: "adoption",
        targetId: adoptionId,
        meta: {
          status,
          listingTitle,
          adoptionId,
          listingId,
        },
      });

      // Send Novu notifications
      const novuResponse = await fetch("/api/novu/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: "adoption-status-changed",
          to: [
            { subscriberId: seekerId },
            { subscriberId: breederId },
            { subscriberId: process.env.NEXT_PUBLIC_ADMIN_USER_ID || "admin" },
          ],
          payload: {
            status,
            listingTitle,
            adoptionId,
            listingId,
          },
        }),
      });

      if (!novuResponse.ok) {
        console.error("Failed to send Novu adoption status notification");
      }
    } catch (error) {
      console.error("Failed to send adoption status notification:", error);
    }
  }

  /**
   * Send payment notification to all parties
   */
  static async sendPaymentNotification(
    seekerId: string,
    breederId: string,
    paymentType: string,
    itemType: string,
    amount: number,
    applicationId: string,
    listingId?: string,
    transactionId?: string
  ): Promise<void> {
    try {
      // Create database notifications
      await this.sendNotification({
        userId: seekerId,
        type: "payment_completed",
        title: `Payment Completed`,
        body: `Your ${paymentType} payment of $${amount} for ${itemType} has been processed.`,
        targetType: "application",
        targetId: applicationId,
        meta: {
          paymentType,
          itemType,
          amount,
          applicationId,
        },
      });

      await this.sendNotification({
        userId: breederId,
        type: "payment_completed",
        title: `Payment Received`,
        body: `You have received a ${paymentType} payment of $${amount} for ${itemType}.`,
        targetType: "application",
        targetId: applicationId,
        meta: {
          paymentType,
          itemType,
          amount,
          applicationId,
        },
      });

      // Send Novu notifications
      const novuResponse = await fetch("/api/novu/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: "payment-completed",
          to: [
            { subscriberId: seekerId },
            { subscriberId: breederId },
            { subscriberId: process.env.NEXT_PUBLIC_ADMIN_USER_ID || "admin" },
          ],
          payload: {
            paymentType,
            itemType,
            amount,
            applicationId,
          },
        }),
      });

      if (!novuResponse.ok) {
        console.error("Failed to send Novu payment notification");
      }
    } catch (error) {
      console.error("Failed to send payment notification:", error);
    }
  }

  /**
   * Send payout notification to breeder
   */
  static async sendPayoutNotification(
    breederId: string,
    amount: number,
    transferReference: string
  ): Promise<void> {
    try {
      // Create database notification
      await this.sendNotification({
        userId: breederId,
        type: "payout_completed",
        title: `Payout Processed`,
        body: `Your payout of $${amount} has been processed (Ref: ${transferReference}).`,
        targetType: "payout",
        targetId: transferReference,
        meta: {
          amount,
          transferReference,
        },
      });

      // Send Novu notification
      const novuResponse = await fetch("/api/novu/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: "payout-completed",
          to: [{ subscriberId: breederId }],
          payload: {
            amount,
            transferReference,
          },
        }),
      });

      if (!novuResponse.ok) {
        console.error("Failed to send Novu payout notification");
      }
    } catch (error) {
      console.error("Failed to send payout notification:", error);
    }
  }

  /**
   * Send welcome notification to new user
   */
  static async sendWelcomeNotification(
    userId: string,
    displayName: string,
    email: string
  ): Promise<void> {
    try {
      // Create database notification
      await this.sendNotification({
        userId,
        type: "welcome",
        title: `Welcome to Pethouse, ${displayName}!`,
        body: `Thank you for joining Pethouse. We're excited to help you find your perfect pet companion.`,
        targetType: "welcome",
        targetId: userId,
        meta: {
          displayName,
          email,
        },
      });

      // Send Novu notification
      const novuResponse = await fetch("/api/novu/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: "welcome-user",
          to: [{ subscriberId: userId }],
          payload: {
            displayName,
            email,
          },
        }),
      });

      if (!novuResponse.ok) {
        console.error("Failed to send Novu welcome notification");
      }
    } catch (error) {
      console.error("Failed to send welcome notification:", error);
    }
  }

  /**
   * Send new user signup notification to admin
   */
  static async sendNewUserSignupNotification(
    userId: string,
    displayName: string,
    email: string,
    role?: string
  ): Promise<void> {
    try {
      // Create database notification for admin
      await this.sendNotification({
        userId: process.env.NEXT_PUBLIC_ADMIN_USER_ID || "admin",
        type: "new_user_signup",
        title: `New User Signup: ${displayName}`,
        body: `${displayName} (${email}) has joined Pethouse.`,
        targetType: "user",
        targetId: userId,
        meta: {
          userId,
          displayName,
          email,
        },
      });

      // Send Novu notification to admin
      const novuResponse = await fetch("/api/novu/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: "new-user-signup",
          to: [
            { subscriberId: process.env.NEXT_PUBLIC_ADMIN_USER_ID || "admin" },
          ],
          payload: {
            userId,
            displayName,
            email,
          },
        }),
      });

      if (!novuResponse.ok) {
        console.error("Failed to send Novu new user signup notification");
      }
    } catch (error) {
      console.error("Failed to send new user signup notification:", error);
    }
  }

  /**
   * Create subscriber in Novu system
   */
  static async createSubscriber(userId: string, userData: any): Promise<void> {
    try {
      // This method should create/update subscriber in Novu
      // Implementation depends on Novu setup
      console.log(`Creating/updating subscriber ${userId} in Novu`);
    } catch (error) {
      console.error("Failed to create subscriber:", error);
    }
  }
}
