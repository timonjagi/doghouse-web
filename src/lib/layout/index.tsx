import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

import Header from "./Header";

type LayoutProps = {
  children: ReactNode;
};

interface RouteConfig {
  path: string;
  layout: React.ComponentType<LayoutProps>;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box margin="0 auto" w="full" h="100vh" transition="0.5s ease-out">
      <Box h="full">
        <Header />
        <Box as="main" h={{ base: "calc(100vh - 64px)", md: "100vh" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
