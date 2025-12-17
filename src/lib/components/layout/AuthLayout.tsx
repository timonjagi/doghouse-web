import { Box, useBreakpointValue, Flex } from '@chakra-ui/react';
import React, { ReactNode } from 'react'
import Footer from './Footer';
import Header from './Header';

type AuthLayoutProps = {
  children: ReactNode;
  sidebarContent?: ReactNode;
  showSidebar?: boolean;
};

function AuthLayout({ children, sidebarContent, showSidebar = true }: AuthLayoutProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (isMobile) {
    return (
      <>
        <Header />
        <Box
          as="main"
          h="full"
          pb=""
          overflow="auto"
        >
          {children}
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <Flex h="100vh">
      {/* Main content */}
      <Box flex="1" overflow="auto" bg="white">
        <Flex justify="center" align="center" h="full">
          {children}
        </Flex>
      </Box>

      {/* Sidebar */}
      {showSidebar && sidebarContent && (
        <Box
          flex="1"
          bg="brand.600"
          color="white"
          display={{ base: "none", md: "block" }}
        >
          <Flex direction="column" h="full" px={{ base: "4", md: "8" }}>
            {sidebarContent}
          </Flex>
        </Box>
      )}
    </Flex>
  );
}

export default AuthLayout
