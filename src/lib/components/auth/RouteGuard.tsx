// components/PrivateRoute.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Center, Flex, Spinner } from "@chakra-ui/react";
import { Loader } from "../ui/Loader";
import { useSupabaseAuth } from "lib/hooks/useSupabaseAuth";

const RouteGuard = ({ children, ...rest }) => {
  const router = useRouter();
  const { user, loading } = useSupabaseAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const protectedRoutes = ["onboarding", "/dashboard", "profile", "account"];
  useEffect(() => {
    if (!loading) {
      // If the authentication state is loaded
      if (!user && protectedRoutes.includes[router.pathname]) {
        router.push("/login");
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
