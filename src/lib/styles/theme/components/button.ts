import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Button: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: "full",
  },
  variants: {
    primary: {
      bg: "brand.500",
      _hover: {
        bg: "brand.600",
        _dark: {
          bg: "brand.400",
        },
      },
      _dark: {
        bg: "brand.600",
        color: "white",
      },
    },
    secondary: {
      bg: "gray.100",
      color: "gray.800",
      _hover: {
        bg: "gray.200",
        _dark: {
          bg: "gray.600",
          color: "white",
        },
      },
      _dark: {
        bg: "gray.700",
        color: "white",
      },
    },
  },
};
