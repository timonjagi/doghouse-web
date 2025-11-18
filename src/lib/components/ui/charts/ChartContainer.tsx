import React from 'react';
import {
  Box,
  BoxProps,
  useColorModeValue,
  Skeleton,
} from '@chakra-ui/react';

interface ChartContainerProps extends BoxProps {
  isLoading?: boolean;
  children: React.ReactNode;
  title?: string;
  height?: string | number;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  isLoading = false,
  children,
  title,
  height = '300px',
  ...props
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (isLoading) {
    return (
      <Box
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        borderRadius="lg"
        p={4}
        {...props}
      >
        {title && (
          <Box mb={4}>
            <Skeleton height="20px" width="200px" />
          </Box>
        )}
        <Skeleton height={height} width="100%" />
      </Box>
    );
  }

  return (
    <Box
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      {...props}
    >
      {title && (
        <Box mb={4} fontSize="lg" fontWeight="semibold">
          {title}
        </Box>
      )}
      <Box height={height} width="100%">
        {children}
      </Box>
    </Box>
  );
};

export default ChartContainer;
