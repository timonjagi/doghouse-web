import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Link,
  Flex,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { FiBell, FiCheck } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { Inbox } from '@novu/react';

import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useUnreadNotificationsCount,
} from '../../../lib/hooks/queries/useNotifications';
import { Notification, User } from '../../db/schema';
import { NotificationCard } from '../ui/NotificationCard';
interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  // Novu's Inbox handles notifications internally

  return (
    <Flex
      flex="1"
      maxW={{ base: "full", sm: "md" }}
      justify="space-between"
      width="full"
      h={{ base: "calc(100vh - 64px)", md: "full" }}
      as="nav"
      direction="column"
      overflowY="auto"
    >
      <VStack spacing={0} align="stretch" height="100%">
        {/* Content */}
        <Box flex={1} overflowY="auto">
          <Inbox
            appearance={{
              baseTheme: {
                light: {
                  colors: {
                    neutral: {
                      0: mode('white', 'gray.800'),
                      10: mode('gray.50', 'gray.700'),
                      20: mode('gray.100', 'gray.600'),
                      30: mode('gray.200', 'gray.500'),
                      40: mode('gray.300', 'gray.400'),
                      50: mode('gray.400', 'gray.300'),
                      60: mode('gray.500', 'gray.200'),
                      70: mode('gray.600', 'gray.100'),
                      80: mode('gray.700', 'gray.50'),
                      90: mode('gray.800', 'white'),
                      100: mode('gray.900', 'gray.900'),
                    },
                  },
                },
                dark: {
                  colors: {
                    neutral: {
                      0: 'gray.800',
                      10: 'gray.700',
                      20: 'gray.600',
                      30: 'gray.500',
                      40: 'gray.400',
                      50: 'gray.300',
                      60: 'gray.200',
                      70: 'gray.100',
                      80: 'gray.50',
                      90: 'white',
                      100: 'gray.900',
                    },
                  },
                },
              },
            }}
          />
        </Box>
      </VStack>
    </Flex>
  );
};
