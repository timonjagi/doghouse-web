import { theme as proTheme } from "@chakra-ui/pro-theme";
import { extendTheme, theme as baseTheme } from "@chakra-ui/react";

import { colors } from "./colors";
import { components } from "./components";
import { config } from "./config";
import { fonts } from "./fonts";

const customTheme = extendTheme(
  {
    // colors: { ...baseTheme.colors, brand: baseTheme.colors.blue },
    colors,
    fonts,
    config,
    components,
  },
  proTheme
);

export default customTheme;
