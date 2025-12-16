import React from 'react';
import {
  Box,
  VStack,
  Flex,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { Inbox } from '@novu/react';

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
              variables: {
                colorBackground: mode('white', 'gray.800'),
                colorForeground: mode('gray.900', 'white'),
              },
            }}
          />
        </Box>
      </VStack>
    </Flex>
  );
};
