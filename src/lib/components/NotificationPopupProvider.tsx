import React, { useEffect, useState } from 'react';
import { useNotifications } from '@novu/react';
import { useToast } from '@chakra-ui/react';
import { NotificationAvatar } from './ui/NotificationAvatar';
import { NotificationSplitButtons } from './ui/NotificationSplitButtons';
import { NotificationTwoLinksIcon } from './ui/NotificationTwoLinksIcon';

interface NotificationPopupProviderProps {
  children: React.ReactNode;
}

export const NotificationPopupProvider: React.FC<NotificationPopupProviderProps> = ({ children }) => {
  const { notifications } = useNotifications();
  const toast = useToast();
  const [shownNotificationIds, setShownNotificationIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    notifications.forEach((notification) => {
      if (!shownNotificationIds.has(notification.id)) {
        // Determine which component to use based on notification type or content
        let Component: React.ComponentType<any>;
        let props: any = {};

        // Use data property for payload, content for rendered text
        const data = (notification as any).data || (notification as any).payload || {};
        const content = (notification as any).content || {};

        // Example logic - adjust based on your notification types
        if (data.avatarSrc || data.seekerName || data.breederName) {
          Component = NotificationAvatar;
          props = {
            name: data.seekerName || data.breederName || data.senderName || 'Sender',
            message: data.body || content.body || '',
            avatarSrc: data.avatarSrc || data.seekerAvatar,
            onReply: () => {
              // Handle reply action - could navigate to chat or something
              console.log('Reply clicked for notification:', notification.id);
            },
          };
        } else if (data.type === 'update' || data.hasActions || content.subject?.includes('Available')) {
          Component = NotificationSplitButtons;
          props = {
            title: content.subject || data.title || 'Update',
            description: content.body || data.body || '',
            onUpdate: () => {
              // Handle update action
              console.log('Update clicked for notification:', notification.id);
            },
            onClose: () => {
              toast.closeAll();
            },
          };
        } else {
          Component = NotificationTwoLinksIcon;
          props = {
            title: content.subject || data.title || 'Notification',
            description: content.body || data.body || '',
            onUpdate: () => {
              // Handle primary action
              console.log('Primary action clicked for notification:', notification.id);
            },
            onSkip: () => {
              // Handle skip action
              console.log('Skip clicked for notification:', notification.id);
            },
            onClose: () => {
              toast.closeAll();
            },
          };
        }

        toast({
          position: 'top-right',
          duration: 10000,
          isClosable: true,
          render: () => <Component {...props} />,
        });

        setShownNotificationIds((prev) => new Set(prev).add(notification.id));
      }
    });
  }, [notifications, toast, shownNotificationIds]);

  return <>{children}</>;
};