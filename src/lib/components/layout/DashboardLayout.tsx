import {
  useBreakpointValue,
  Flex,
  Box,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import RouteGuard from "../auth/RouteGuard";
import { TopBanner } from "../ui/TopBanner";
import HeaderWithSearch from "./HeaderWithSearch";
import { HeaderWithTitle } from "./HeaderWithTitle";
import { MobileBottomNav } from "./MobileBottomNav";
import { Sidebar } from "./Sidebar";
import { ReactNode } from "react";
import { useSupabaseAuth } from "lib/hooks/useSupabaseAuth";
import { useUserProfileById } from "lib/hooks/queries/useUserProfile";

type LayoutProps = {
  children: ReactNode;
};

// Detail page routes contain dynamic segments like [id], [chatId], [slug]
const DETAIL_PAGE_PATTERNS = [
  "/dashboard/inbox/[chatId]",
  "/dashboard/breeds/[breedName]",
  "/dashboard/breeds/[id]",
  "/dashboard/breeders/[id]",
  "/dashboard/listings/[id]",
  "/dashboard/adoptions/[id]",
  "/dashboard/breeders/[id]/breeds/[userBreedId]",
];

export const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const { user } = useSupabaseAuth();
  const { data: profile } = useUserProfileById(user?.id);
  const [mainIsScrolled, setMainIsScrolled] = useState(false);

  const breedName = router.query.breedName;

  // Check if current route is a detail page
  const isDetailPage = DETAIL_PAGE_PATTERNS.some(
    (pattern) => router.pathname === pattern
  );

  return (
    <RouteGuard>
      {isMobile && profile?.role === "seeker" && (
        <TopBanner label="Welcome to Pethouse! Find your perfect furry friend today." />
      )}

      {isMobile && !isDetailPage && <HeaderWithSearch />}
      {isMobile && isDetailPage && (
        <HeaderWithTitle
          title={breedName as string ||
            router.pathname.includes('breeds') ? 'Breed Details' :
            router.pathname.includes('breeders') ? 'Breeder Details' :
              router.pathname.includes('listings') ? 'Listing Details' :
                router.pathname.includes('adoptions') ? 'Adoption Details' :
                  router.pathname.includes('inbox') ? 'Inbox Chat' :
                    'Details'
          }
          isScrolled={mainIsScrolled} />
      )}
      <Flex height={{ base: "auto", lg: "100vh" }}>
        {/* Primary Navigation Sidebar - Desktop only */}
        <Box
          h={{ base: "calc(100dvh - 64px)", lg: "full" }}
          width={{
            lg: "14rem",
            xl: "18rem",
          }}
          display={{
            base: "none",
            lg: "initial",
          }}
          overflowY="auto"
          borderRightWidth="1px"
        >
          <Sidebar onClose={() => { }} />
        </Box>

        {/* Main Content Area - Children control inner sidebar + main */}
        <Box
          flex="1"
          h={{
            base: profile?.role === "seeker" && !isDetailPage
              ? "calc(100dvh - 230px)"
              : "calc(100dvh - 128px)",
            lg: "full"
          }}
          overflowY="auto"
          display="flex"
          flexDirection="column"
          onScroll={(e) => setMainIsScrolled(e.currentTarget.scrollTop > 32)}
        >
          {/* Conditionally render header based on page type */}
          {isDesktop && !isDetailPage && <HeaderWithSearch />}
          {isDesktop && isDetailPage && (
            <HeaderWithTitle
              title={breedName as string ||
                router.pathname.includes('breeds') ? 'Breed Details' :
                router.pathname.includes('breeders') ? 'Breeder Details' :
                  router.pathname.includes('listings') ? 'Listing Details' :
                    router.pathname.includes('adoptions') ? 'Adoption Details' :
                      router.pathname.includes('inbox') ? 'Inbox Chat' :
                        'Details'
              }

              isScrolled={mainIsScrolled}
            />
          )}
          {children}
        </Box>
      </Flex>

      {isMobile && <MobileBottomNav />}
    </RouteGuard>
  );
};
