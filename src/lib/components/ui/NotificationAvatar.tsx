import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  StackDivider,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';

interface NotificationAvatarProps {
  avatarSrc?: string;
  name: string;
  message: string;
  onReply?: () => void;
}

export const NotificationAvatar: React.FC<NotificationAvatarProps> = ({
  avatarSrc,
  name,
  message,
  onReply,
}) => {
  const showAvatar = useBreakpointValue({ base: false, sm: true });

  return (
    <Box
      width={{ base: 'full', sm: 'md' }}
      boxShadow={useColorModeValue('md', 'md-dark')}
      bg="bg-surface"
      borderRadius="lg"
    >
      <HStack divider={<StackDivider />} spacing="0">
        <HStack spacing="4" p="4" flex="1">
          {showAvatar && (
            <Avatar src={avatarSrc} name={name} boxSize="10" />
          )}
          <Box>
            <Text fontWeight="medium" fontSize="sm">
              {name}
            </Text>
            <Text color="muted" fontSize="sm">
              {message}
            </Text>
          </Box>
        </HStack>

        <Center p="4">
          <Button colorScheme="blue" variant="link" size="sm" onClick={onReply}>
            Reply
          </Button>
        </Center>
      </HStack>
    </Box>
  );
};