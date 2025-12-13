import type { DeepPartial, Theme } from "@chakra-ui/react";

/** extend additional color here */
const extendedColors: DeepPartial<
  Record<string, Theme["colors"]["whiteAlpha"]>
> = {
  brand: {
    50: "#FDF9F4",
    100: "#DFBD99",
    200: "#D2B08C,",
    300: "#C5A47F",
    400: "#B89772",
    500: "#AC8A65",
    600: "#9F7D57",
    700: "#92714A",
    800: "#85643D",
    900: "#785730",
  },
  secondary: {
    100: "#5C6A2B",
    200: "#5C6A2B",
    300: "#5C6A2B",
    400: "#5C6A2B",
    500: "#5C6A2B",
    600: "#5C6A2B",
    700: "#5C6A2B",
    800: "#5C6A2B",
    900: "#666935",
  },
};

/** override chakra colors here */
const overridenChakraColors: DeepPartial<Theme["colors"]> = {};

/** semantic tokens */
const semanticTokens = {
  colors: {
    accent: {
      default: "brand.500",
      _dark: "brand.400",
    },
    "accent-subtle": {
      default: "brand.100",
      _dark: "brand.900",
    },
    inverted: {
      default: "white",
      _dark: "gray.900",
    },
    muted: {
      default: "gray.600",
      _dark: "gray.400",
    },
    subtle: {
      default: "gray.500",
      _dark: "gray.400",
    },
    "on-accent": {
      default: "white",
      _dark: "gray.900",
    },
    "on-accent-subtle": {
      default: "gray.600",
      _dark: "gray.400",
    },
    "on-accent-muted": {
      default: "gray.500",
      _dark: "gray.500",
    },
    "bg-accent": {
      default: "brand.500",
      _dark: "brand.900",
    },
    "bg-accent-subtle": {
      default: "brand.50",
      _dark: "brand.800",
    },
    "bg-surface": {
      default: "white",
      _dark: "gray.800",
    },
    "g-surface": {
      default: "gray.50",
      _dark: "gray.900",
    },
  },
};

export const colors = {
  ...overridenChakraColors,
  ...extendedColors,
  ...semanticTokens.colors,
};
