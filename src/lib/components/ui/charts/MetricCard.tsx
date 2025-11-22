import React from 'react';
import {
  Box,
  Flex,
  Text,
  Icon,
  useColorModeValue,
  Skeleton,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: IconType;
  isLoading?: boolean;
  colorScheme?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  isLoading = false,
  colorScheme = 'blue',
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'increase':
        return 'green.500';
      case 'decrease':
        return 'red.500';
      default:
        return 'gray.500';
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'increase':
        return '↗';
      case 'decrease':
        return '↘';
      default:
        return '→';
    }
  };

  if (isLoading) {
    return (
      <Box
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        borderRadius="lg"
        p={6}
      >
        <Skeleton height="20px" width="120px" mb={2} />
        <Skeleton height="32px" width="80px" mb={2} />
        <Skeleton height="16px" width="100px" />
      </Box>
    );
  }

  return (
    <Box
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      transition="all 0.2s"
      _hover={{ shadow: 'md', transform: 'translateY(-1px)' }}
    >
      <Flex justify="space-between" align="flex-start" mb={4}>
        <Box>
          <Text fontSize="sm" color={textColor} fontWeight="medium">
            {title}
          </Text>
          <Text fontSize="3xl" fontWeight="bold" color={`${colorScheme}.500`}>
            {value}
          </Text>
        </Box>
        {icon && (
          <Box
            p={3}
            bg={`${colorScheme}.50`}
            borderRadius="lg"
            color={`${colorScheme}.500`}
          >
            <Icon as={icon} boxSize={6} />
          </Box>
        )}
      </Flex>

      {change && (
        <Flex align="center" fontSize="sm">
          <Text color={getChangeColor(change.type)} mr={1}>
            {getChangeIcon(change.type)}
          </Text>
          <Text color={getChangeColor(change.type)} fontWeight="medium">
            {Math.abs(change.value)}%
          </Text>
          <Text color={textColor} ml={1}>
            from last month
          </Text>
        </Flex>
      )}
    </Box>
  );
};

