// components/PrivateRoute.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase/client";
import { Box, Center, Flex, Spinner } from "@chakra-ui/react";
import { Loader } from "../Loader";

const RouteGuard = ({ children }) => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const protectedRoutes = ["/dashoard", "profile", "account"];
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

  return loading ? <Loader /> : isAuthorized ? children : null;
};

export default RouteGuard;
