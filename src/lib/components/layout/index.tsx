import { useRouter } from "next/router";

import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import { DashboardLayout } from "./SidebarLayout";
import { HeaderFooterLayout } from "./HeaderFooterLayout";
import AuthLayout from "./AuthLayout";
import { AuthSidebarContent } from "./AuthSidebarContent";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();

  const authRoutes: any = [
    { path: "/login", layout: "auth" },
    { path: "/signup", layout: "auth" },
    { path: "/onboarding", layout: "auth" },
  ];

  const headerFooterRoutes: any = [
    { path: "/", layout: "headerfooter" },
    { path: "/explore", layout: "headerfooter" },
    { path: "/explore/breeds/[breedName]", layout: "headerfooter" },
    { path: "/explore/breeders", layout: "headerfooter" },
    { path: "/explore/breeders/[id]", layout: "headerfooter" },
    { path: "/explore/listings", layout: "headerfooter" },
    { path: "/explore/listings/[id]", layout: "headerfooter" },
    { path: "/contact", layout: "headerfooter" },
    { path: "/faqs", layout: "headerfooter" },
    { path: "/about", layout: "headerfooter" },
    { path: "/blog", layout: "headerfooter" },
    { path: "/blog/[slug]", layout: "headerfooter" },
    { path: "/terms", layout: "headerfooter" },
    { path: "/privacy", layout: "headerfooter" },
    { path: "/partners", layout: "headerfooter" },
  ];

  const dashboardRoutes = [
    // Dashboard routes
    { path: "/dashboard", layout: "dashboard" },
    { path: "/dashboard/search", layout: "dashboard" },
    { path: "/dashboard/kennel", layout: "dashboard" },
    { path: "/dashboard/inbox", layout: "dashboard" },
    { path: "/dashboard/inbox/[conversationId]", layout: "dashboard" },
    { path: "/dashboard/breeds", layout: "dashboard" },
    { path: "/dashboard/breeds/[id]", layout: "dashboard" },
    { path: "/dashboard/breeders", layout: "dashboard" },
    { path: "/dashboard/breeders/[id]", layout: "dashboard" },
    {
      path: "/dashboard/breeders/[id]/breeds/[userBreedId]",
      layout: "dashboard",
    },
    { path: "/dashboard/listings", layout: "dashboard" },
    { path: "/dashboard/listings/[id]", layout: "dashboard" },
    { path: "/dashboard/wishlist", layout: "dashboard" },
    { path: "/dashboard/matches", layout: "dashboard" },
    { path: "/dashboard/adoptions", layout: "dashboard" },
    { path: "/dashboard/adoptions/[id]", layout: "dashboard" },
    { path: "/dashboard/account", layout: "dashboard" },
    { path: "/dashboard/account/notifications", layout: "dashboard" },
    { path: "/dashboard/account/profile", layout: "dashboard" },
    { path: "/dashboard/account/settings", layout: "dashboard" },
    { path: "/dashboard/account/billing", layout: "dashboard" },
    { path: "/dashboard/account/preferences", layout: "dashboard" },
    { path: "/dashboard/support", layout: "dashboard" },
    { path: "/dashboard/support/[id]", layout: "dashboard" },


    // Admin dashboard routes
    { path: "/dashboard/admin", layout: "dashboard" },
    { path: "/dashboard/admin/verification", layout: "dashboard" },
    { path: "/dashboard/admin/users", layout: "dashboard" },
    { path: "/dashboard/admin/listings", layout: "dashboard" },
    { path: "/dashboard/admin/analytics", layout: "dashboard" },
    { path: "/dashboard/admin/adoptions", layout: "dashboard" },
    { path: "/dashboard/admin/breeds", layout: "dashboard" },
    { path: "/dashboard/admin/breeds/[id]", layout: "dashboard" },
    { path: "/dashboard/admin/payouts", layout: "dashboard" },
    { path: "/dashboard/admin/profile", layout: "dashboard" },
  ];

  const matchedRoute = [
    ...authRoutes,
    ...headerFooterRoutes,
    ...dashboardRoutes,
  ].find((route) => {
    if (route.path.includes("[")) {
      // If the route has square brackets, treat it as a dynamic route
      const regex = new RegExp(`^${route.path.replace(/\[.*\]/, ".*")}$`);
      return router.pathname.match(regex);
    }
    return route.path === router.pathname;
  });

  if (!matchedRoute) {
    //router.replace('/404');
    return <div>Route not found</div>; // Handle not found routes
  }

  const { layout } = matchedRoute;

  // Get role from query parameters for auth routes (signup)
  const roleParam = router.query.role as string;
  const userRole = roleParam === 'breeder' ? 'breeder' : roleParam === 'seeker' ? 'seeker' : null;

  // switch case
  return (
    <Box margin="0 auto" w="full" h="100vh" transition="0.5s ease-out">
      {layout === "auth" && (
        <AuthLayout sidebarContent={matchedRoute !== 'onboarding' && <AuthSidebarContent role={userRole} />}>
          {children}
        </AuthLayout>
      )}
      {layout === "dashboard" && <DashboardLayout>{children}</DashboardLayout>}
      {layout === "headerfooter" && (
        <HeaderFooterLayout>{children}</HeaderFooterLayout>
      )}
    </Box>
  );
};

export default Layout;

// Separate layout components based on your needs
