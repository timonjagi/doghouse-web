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
    100: "#5C6A2B",
    200: "#5C6A2B",
    300: "#5C6A2B",
    400: "#5C6A2B",
    500: "#5C6A2B",
    600: "#5C6A2B",
    700: "#5C6A2B",
    800: "#5C6A2B",
    900: "#666935"
  }
};

/** override chakra colors here */
const overridenChakraColors: DeepPartial<Theme["colors"]> = {};

export const colors = {
  ...overridenChakraColors,
  ...extendedColors,
};
