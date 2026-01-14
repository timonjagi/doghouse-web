import React from 'react';
import { Badge } from '@chakra-ui/react';
import { useNotifications } from '@novu/react';
import { useCurrentUser } from 'lib/hooks/queries';

export const NotificationBadge: React.FC = () => {
  const { data: user } = useCurrentUser();
  // useNotifications will only work if NovuProvider is in the tree
  // which is only true when user is logged in (see NovuWrapper)
  const { notifications } = useNotifications();

  if (!user || !notifications) {
    return null;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  if (unreadCount === 0) {
    return null;
  }

  return (
    <Badge
      position="absolute"
      top="-1"
      right="-1"
      colorScheme="red"
      variant="solid"
      borderRadius="full"
      fontSize="2xs"
      minW="16px"
      h="16px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1}
    >
      {unreadCount > 9 ? '9+' : unreadCount}
    </Badge>
  );
};
