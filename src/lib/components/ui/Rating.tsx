import { StackProps, useColorModeValue, HStack, Icon } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";

interface RatingProps {
  score?: number;
  max?: number;
  size?: "sm" | "md" | "lg" | "xl";
  rootProps?: StackProps;
}

export const Rating = (props: RatingProps) => {
  const { score = 0, max = 5, size = "md", rootProps } = props;
  const color = useColorModeValue("gray.200", "gray.600");
  const activeColor = useColorModeValue("brand.500", "brand.200");
  return (
    <HStack spacing="0.5" {...rootProps}>
      {Array.from({ length: max })
        .map((_, index) => index + 1)
        .map((index) => (
          <Icon
            key={index}
            as={FaStar}
            fontSize={size}
            color={index <= score ? activeColor : color}
          />
        ))}
    </HStack>
  );
};