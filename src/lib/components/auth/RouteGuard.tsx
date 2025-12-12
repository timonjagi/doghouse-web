// components/PrivateRoute.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Center, Flex, Spinner, useToast } from "@chakra-ui/react";
import { Loader } from "../ui/Loader";
import { useCurrentUser } from "lib/hooks/queries";

const RouteGuard = ({ children, ...rest }) => {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const protectedRoutes = ["onboarding", "dashboard", "profile", "account"];
  const toast = useToast();

  useEffect(() => {
    if (!isLoading) {
      // If the authentication state is loaded
      if (!user && protectedRoutes.find((route) => router.pathname.includes(route))) {
        router.replace("/signup");

        /// fullroute with query params
        localStorage.setItem('previousRoute', router.asPath);

        toast({
          title: "Please log in to continue",
          description: "You must be logged in to access this page",
          status: "warning",
          duration: 5000,
          isClosable: true,
        })
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, isLoading, router]);

  return isLoading ? (
    <Loader />

  ) : isAuthorized ? (
    <Box {...rest}>{children}</Box>
  ) : null;
};

export default RouteGuard;
