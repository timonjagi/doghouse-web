// components/PrivateRoute.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Center, Flex, Spinner, useToast } from "@chakra-ui/react";
import { Loader } from "../ui/Loader";
import { useSupabaseAuth } from "lib/hooks/useSupabaseAuth";

const RouteGuard = ({ children, ...rest }) => {
  const router = useRouter();
  const { user, loading } = useSupabaseAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const protectedRoutes = ["onboarding", "dashboard", "profile", "account"];
  const toast = useToast();

  useEffect(() => {
    if (!loading) {
      // If the authentication state is loaded
      if (!user && protectedRoutes.find((route) => router.pathname.includes(route))) {
        router.push("/login");
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
  }, [user, loading, router]);

  return loading ? (
    <Loader />

  ) : isAuthorized ? (
    <Box {...rest}>{children}</Box>
  ) : null;
};

export default RouteGuard;
