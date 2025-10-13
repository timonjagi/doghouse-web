import { Box } from "@chakra-ui/react";
// import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CardContent = (props: any) => (
  <Box
    textAlign={{
      sm: "center",
    }}
    pt="2"
    {...props}
  />
);
