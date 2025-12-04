import { useBreakpointValue, useDisclosure, Flex, Box } from "@chakra-ui/react";
import { useUserProfile } from "lib/stores/useAppStore";
import RouteGuard from "../auth/RouteGuard";
import { TopBanner } from "../ui/TopBanner";
import DashboardHeader from "./DashboardHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { ReactNode } from "react";
import { useSupabaseAuth } from "lib/hooks/useSupabaseAuth";
import { useUserProfileById } from "lib/hooks/queries/useUserProfile";

type LayoutProps = {
  children: ReactNode;
};

export const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { onClose } = useDisclosure();
  const { user } = useSupabaseAuth();
  const { data: profile } = useUserProfileById(user?.id)

  return (
    <>
      {isMobile && profile?.role === 'seeker' && <TopBanner label="Welcome to Pethouse! Find your perfect furry friend today." />}

      {isMobile && <DashboardHeader />}
      <Flex
        as="section"
        direction={{ base: "column", md: "row" }}
        bg="bg-canvas"
        overflow="auto"
        h={{ base: profile?.role === 'seeker' ? "calc(100dvh - 230px)" : "calc(100dvh - 128px)", md: "100vh" }}
        w="100vw"
        maxW="100vw"
      >
        {isDesktop &&
          // user &&
          // ['breeder, admin'].includes(user.user_metadata?.role) &&
          <Sidebar onClose={onClose} />
        }

        <Box bg="bg-canvas" flex="1" overflow="auto" w="full">
          <Box height="full">
            {/* {isDesktop && <TopBanner label="Welcome to Pethouse! Find your perfect furry friend today." mb="4" />} */}
            {isDesktop && <DashboardHeader />}
            <RouteGuard>{children}</RouteGuard>
          </Box>
        </Box>
      </Flex>
      {isMobile && <MobileBottomNav />}
    </>
  );
};
