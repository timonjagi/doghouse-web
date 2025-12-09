import { useBreakpointValue, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Header from "./Header";
import { ReactNode } from "react";
import { useUserProfile } from "lib/hooks/queries/useUserProfile";

type LayoutProps = {
  children: ReactNode;
};
export const HeaderFooterLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      {(!["/login", "/signup", "/onboarding"].includes(router.pathname) || isMobile) && <Header />}
      <Box as="main" h={{ base: "calc(100dvh - 64px)", md: "100dvh" }} overflow="auto"
      >
        {children}{" "}
      </Box>
    </>
  );
};