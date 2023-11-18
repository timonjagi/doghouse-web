import type { DeepPartial, Theme } from "@chakra-ui/react";

/** extend additional color here */
const extendedColors: DeepPartial<
  Record<string, Theme["colors"]["whiteAlpha"]>
> = {
  brand: {
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
    100: "#2C5C92",
    200: "#2C5C92",
    300: "#2C5C92",
    400: "#2C5C92",
    500: "#2C5C92",
    600: "#2C5C92",
    700: "#2C5C92",
    800: "#2C5C92",
    900: "#2C5C92"
  }
};

/** override chakra colors here */
const overridenChakraColors: DeepPartial<Theme["colors"]> = {};

export const colors = {
  ...overridenChakraColors,
  ...extendedColors,
};
