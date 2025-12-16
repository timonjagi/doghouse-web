import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useNotifications } from '@novu/react';
import { useToast } from '@chakra-ui/react';
import { NotificationAvatar } from './ui/NotificationAvatar';
import { NotificationSplitButtons } from './ui/NotificationSplitButtons';
import { NotificationTwoLinksIcon } from './ui/NotificationTwoLinksIcon';
import { NotificationService, NotificationType, NotificationAction } from '../services/notificationService';

interface NotificationPopupProviderProps {
  children: React.ReactNode;
}

export const NotificationPopupProvider: React.FC<NotificationPopupProviderProps> = ({ children }) => {
  const { notifications } = useNotifications();
  const toast = useToast();
  const router = useRouter();
  const [shownNotificationIds, setShownNotificationIds] = useState<Set<string>>(new Set());
  const [currentNotification, setCurrentNotification] = useState<any>(null);
  const [notificationQueue, setNotificationQueue] = useState<any[]>([]);

  // Helper function to determine notification type and actions
  const getNotificationConfig = (notification: any) => {
    const data = notification.data || notification.payload || {};
    const content = notification.content || {};

    // Determine notification type from payload data
    const notificationType = data.type || data.workflowId;

    switch (notificationType) {
      case 'message-received':
      case 'message_received':
        return {
          component: NotificationAvatar,
          props: {
            name: data.senderName || 'Sender',
            message: data.messageContent || content.body || 'New message received',
            avatarSrc: data.senderAvatar,
            onReply: () => handleViewConversation(notification, data.conversationId),
          }
        };

      case 'adoption-status-changed':
        return {
          component: NotificationSplitButtons,
          props: {
            title: content.subject || data.title || 'Adoption Update',
            description: content.body || data.body || '',
            onUpdate: () => handleViewAdoption(notification, data.adoptionId),
            onClose: () => handleDismissNotification(notification),
          }
        };

      case 'final-payment-completed':
      case 'reservation-fee-paid':
        return {
          component: NotificationSplitButtons,
          props: {
            title: content.subject || data.title || 'Payment Confirmed',
            description: content.body || data.body || '',
            onUpdate: () => handleViewPayment(notification, data.applicationId),
            onClose: () => handleDismissNotification(notification),
          }
        };

      case 'welcome-user':
        return {
          component: NotificationTwoLinksIcon,
          props: {
            title: content.subject || data.title || 'Welcome!',
            description: content.body || data.body || '',
            onUpdate: () => handleViewProfile(notification),
            onSkip: () => handleDismissNotification(notification),
            onClose: () => handleDismissNotification(notification),
          }
        };

      case 'breed-match-found':
        return {
          component: NotificationSplitButtons,
          props: {
            title: content.subject || data.title || 'Breed Match Found',
            description: content.body || data.body || '',
            onUpdate: () => handleViewListing(notification, data.listingId),
            onClose: () => handleDismissNotification(notification),
          }
        };

      default:
        // Generic notification
        return {
          component: NotificationTwoLinksIcon,
          props: {
            title: content.subject || data.title || 'Notification',
            description: content.body || data.body || '',
            onUpdate: () => handleGenericAction(notification),
            onSkip: () => handleDismissNotification(notification),
            onClose: () => handleDismissNotification(notification),
          }
        };
    }
  };

  // Action handlers
  const handleViewConversation = async (notification: any, conversationId: string) => {
    await NotificationService.markNotificationAsRead(notification);
    toast.closeAll();
    // Navigate to conversation
    router.push(`/dashboard/inbox/${conversationId}`);
  };

  const handleViewAdoption = async (notification: any, adoptionId: string) => {
    await NotificationService.markNotificationAsRead(notification);
    toast.closeAll();
    // Navigate to adoption details
    router.push(`/dashboard/adoptions/${adoptionId}`);
  };

  const handleViewPayment = async (notification: any, applicationId: string) => {
    await NotificationService.markNotificationAsRead(notification);
    toast.closeAll();
    // Navigate to payment/transaction details
    router.push(`/dashboard/payments/${applicationId}`);
  };

  const handleViewListing = async (notification: any, listingId: string) => {
    await NotificationService.markNotificationAsRead(notification);
    toast.closeAll();
    // Navigate to listing details
    router.push(`/listings/${listingId}`);
  };

  const handleViewProfile = async (notification: any) => {
    await NotificationService.markNotificationAsRead(notification);
    toast.closeAll();
    // Navigate to profile/dashboard
    router.push('/dashboard');
  };

  const handleGenericAction = async (notification: any) => {
    await NotificationService.markNotificationAsRead(notification);
    toast.closeAll();
    // Generic action - could navigate to notifications page
    router.push('/dashboard/notifications');
  };

  const handleDismissNotification = async (notification: any) => {
    await NotificationService.markNotificationAsRead(notification);
    toast.closeAll();
    // Show next notification in queue
    showNextNotification();
  };

  // Queue management
  const showNextNotification = () => {
    if (notificationQueue.length > 0) {
      const nextNotification = notificationQueue[0];
      setNotificationQueue(prev => prev.slice(1));
      displayNotification(nextNotification);
    } else {
      setCurrentNotification(null);
    }
  };

  const displayNotification = (notification: any) => {
    const config = getNotificationConfig(notification);
    const { component: Component, props } = config;

    setCurrentNotification(notification);

    toast({
      position: 'top-right',
      duration: 15000, // 15 seconds
      isClosable: true,
      render: () => <Component {...(props as any)} />,
    });
  };

  useEffect(() => {
    // Filter unread notifications that haven't been shown
    const unreadNotifications = notifications.filter(
      notification => !notification.read && !shownNotificationIds.has(notification.id)
    );

    if (unreadNotifications.length > 0) {
      // Add new notifications to queue
      setNotificationQueue(prev => [...prev, ...unreadNotifications]);

      // Mark these as shown
      setShownNotificationIds(prev => {
        const newSet = new Set(prev);
        unreadNotifications.forEach(notification => newSet.add(notification.id));
        return newSet;
      });
    }
  }, [notifications, shownNotificationIds]);

  // Display notifications from queue one at a time
  useEffect(() => {
    if (notificationQueue.length > 0 && !currentNotification) {
      const nextNotification = notificationQueue[0];
      setNotificationQueue(prev => prev.slice(1));
      displayNotification(nextNotification);
    }
  }, [notificationQueue, currentNotification, toast]);

  return <>{children}</>;
};
