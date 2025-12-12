import { useBreakpointValue, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Header from "./Header";
import { ReactNode } from "react";
import Footer from "./Footer";


type LayoutProps = {
  children: ReactNode;
};
export const HeaderFooterLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const headerHeight = useBreakpointValue({ base: "56px", md: "64px" });

  return (
    <>
      {(!["/login", "/signup", "/onboarding"].includes(router.pathname) || isMobile) && <Header />}
      <Box as="main" h={{ base: `calc(100dvh - ${headerHeight})`, md: "100dvh" }}
        pb={{ base: "64px", md: "0" }} overflow="auto"
      >
        {children}
      </Box>
      <Footer />


    </>
  );
};
