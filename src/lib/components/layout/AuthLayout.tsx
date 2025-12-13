import { Box, useBreakpointValue } from '@chakra-ui/react';
import React, { ReactNode } from 'react'
import Footer from './Footer';
import Header from './Header';

type LayoutProps = {
  children: ReactNode;
};
function AuthLayout({ children }: LayoutProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <>
      {isMobile && <Header />}

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
  )
}

export default AuthLayout