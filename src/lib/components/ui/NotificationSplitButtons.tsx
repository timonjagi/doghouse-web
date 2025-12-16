import React from 'react';
import { Box, Button, Flex, Stack, StackDivider, Text, useColorModeValue } from '@chakra-ui/react';

interface NotificationSplitButtonsProps {
  title: string;
  description: string;
  onUpdate?: () => void;
  onClose?: () => void;
}

export const NotificationSplitButtons: React.FC<NotificationSplitButtonsProps> = ({
  title,
  description,
  onUpdate,
  onClose,
}) => {
  return (
    <Box
      bg="bg-surface"
      width={{ base: 'full', sm: 'md' }}
      boxShadow={useColorModeValue('md', 'md-dark')}
      borderRadius="lg"
    >
      <Stack direction="row" divider={<StackDivider />} spacing="0">
        <Box p="4">
          <Stack spacing="1">
            <Text fontSize="sm" fontWeight="medium">
              {title}
            </Text>
            <Text fontSize="sm" color="muted">
              {description}
            </Text>
          </Stack>
        </Box>
        <Stack justify="space-evenly" minW="24" divider={<StackDivider />} spacing="0">
          <Button variant="link" size="sm" colorScheme="blue" onClick={onUpdate}>
            Update
          </Button>
          <Button variant="link" size="sm" onClick={onClose}>
            Close
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};