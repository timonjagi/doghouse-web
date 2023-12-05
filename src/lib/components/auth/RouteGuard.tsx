// components/PrivateRoute.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase/client";
import { Box, Center, Flex, Spinner } from "@chakra-ui/react";
import { Loader } from "../Loader";
import AuthErrorPage from "./AuthErrorPage";

const RouteGuard = ({ children, ...rest }) => {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const protectedRoutes = ["/home", "profile", "account"];
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

  return loading && !error ? (
    <Loader />
  ) : !loading && !error && isAuthorized ? (
    <Box {...rest}>{children}</Box>
  ) : (
    <AuthErrorPage error={error} />
  );
};

export default RouteGuard;
