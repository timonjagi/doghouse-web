import React, { useState } from "react";
import {
  StackProps,
  useColorModeValue,
  HStack,
  Icon,
  Text,
  VStack,
  Box,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";

interface RatingProps {
  score?: number;
  max?: number;
  size?: "sm" | "md" | "lg" | "xl";
  rootProps?: StackProps;
  // New interactive props
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
  readonly?: boolean;
}

export const Rating = (props: RatingProps) => {
  const {
    score = 0,
    max = 5,
    size = "md",
    rootProps,
    interactive = false,
    onChange,
    showValue = false,
    readonly = false,
  } = props;

  const [hoverRating, setHoverRating] = useState(0);

  const color = useColorModeValue("gray.200", "gray.600");
  const activeColor = useColorModeValue("yellow.400", "yellow.300");
  const displayRating = hoverRating || score;

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <HStack spacing="0.5" {...rootProps}>
      {Array.from({ length: max })
        .map((_, index) => index + 1)
        .map((index) => (
          <Icon
            key={index}
            as={FaStar}
            fontSize={size}
            color={index <= displayRating ? activeColor : color}
            fill={index <= displayRating ? activeColor : "transparent"}
            cursor={readonly ? "default" : "pointer"}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            transition="all 0.2s"
            _hover={
              !readonly
                ? {
                    transform: "scale(1.1)",
                  }
                : {}
            }
          />
        ))}
      {showValue && (
        <Text fontSize="sm" color="gray.600" ml={2}>
          {score > 0 ? `${score.toFixed(1)}/5` : "Not rated"}
        </Text>
      )}
    </HStack>
  );
};

// Rating display component for showing averages
interface RatingDisplayProps {
  rating: number;
  totalReviews?: number;
  size?: "sm" | "md" | "lg" | "xl";
  showTotal?: boolean;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  totalReviews,
  size = "md",
  showTotal = true,
}) => {
  return (
    <HStack spacing={2}>
      <Rating score={rating} readonly size={size} />
      {showTotal && totalReviews !== undefined && (
        <Text fontSize="sm" color="gray.600">
          ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
        </Text>
      )}
    </HStack>
  );
};

// Rating summary component for detailed breakdowns
interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  distribution: { [key: number]: number };
}

export const RatingSummary: React.FC<RatingSummaryProps> = ({
  averageRating,
  totalReviews,
  distribution,
}) => {
  const bgColor = useColorModeValue("gray.50", "gray.700");

  return (
    <VStack spacing={3} align="stretch" p={4} bg={bgColor} borderRadius="md">
      <HStack justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">
          {averageRating.toFixed(1)}
        </Text>
        <VStack spacing={1} align="end">
          <Rating score={averageRating} readonly size="lg" />
          <Text fontSize="sm" color="gray.600">
            {totalReviews} review{totalReviews !== 1 ? "s" : ""}
          </Text>
        </VStack>
      </HStack>

      {/* Rating distribution bars */}
      <VStack spacing={1} align="stretch">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = distribution[stars] || 0;
          const percentage =
            totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <HStack key={stars} spacing={3} align="center">
              <Text fontSize="sm" minW="20px">
                {stars} ★
              </Text>
              <Box flex={1} h={2} bg="gray.200" borderRadius="full">
                <Box
                  h="full"
                  w={`${percentage}%`}
                  bg="yellow.400"
                  borderRadius="full"
                  transition="width 0.3s ease"
                />
              </Box>
              <Text fontSize="sm" minW="30px" textAlign="right">
                {count}
              </Text>
            </HStack>
          );
        })}
      </VStack>
    </VStack>
  );
};
