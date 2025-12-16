import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  CloseButton,
  Flex,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';

interface NotificationTwoLinksIconProps {
  title: string;
  description: string;
  icon?: React.ComponentType<any>;
  onSkip?: () => void;
  onUpdate?: () => void;
  onClose?: () => void;
}

export const NotificationTwoLinksIcon: React.FC<NotificationTwoLinksIconProps> = ({
  title,
  description,
  icon: IconComponent = FiInfo,
  onSkip,
  onUpdate,
  onClose,
}) => {
  return (
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      width={{ base: 'full', sm: 'md' }}
      boxShadow={useColorModeValue('md', 'md-dark')}
      bg="bg-surface"
      borderRadius="lg"
      overflow="hidden"
    >
      <Center display={{ base: 'none', sm: 'flex' }} bg="bg-accent" px="5">
        <Icon as={IconComponent} boxSize="10" color="on-accent" />
      </Center>
      <Stack direction="row" p="4" spacing="3" flex="1">
        <Stack spacing="2.5" flex="1">
          <Stack spacing="1">
            <Text fontSize="sm" fontWeight="medium">
              {title}
            </Text>
            <Text fontSize="sm" color="muted">
              {description}
            </Text>
          </Stack>
          <ButtonGroup variant="link" size="sm" spacing="3">
            <Button onClick={onSkip}>Skip</Button>
            <Button colorScheme="blue" onClick={onUpdate}>
              Update
            </Button>
          </ButtonGroup>
        </Stack>
        <CloseButton transform="translateY(-6px)" onClick={onClose} />
      </Stack>
    </Flex>
  );
};