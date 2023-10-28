import {
  Box,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { User } from "firebase/auth";
import { useRouter } from "next/router";
// import * as React from "react";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { HiPencilAlt } from "react-icons/hi";

import { auth } from "lib/firebase/client";

import { CardContent } from "./CardContent";
import { CardWithAvatar } from "./CardWithAvatar";
import { Settings } from "./Settings";
import { UserInfo } from "./UserInfo";

const Account = () => {
  const [user, loading, error] = useAuthState(auth);
  // eslint-disable-next-line
  const [isBreeder, setIsBreeder] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || error)) {
      router.push("/login");
      return;
    }

    const getClaims = async (authUser: User) => {
      const tokenResult = await authUser.getIdTokenResult(true);
      if (tokenResult) {
        const { claims } = tokenResult;
        setIsBreeder(claims.isBreeder);
      }
    };

    if (user) {
      getClaims(user);
    }
  }, [user, loading, error, router]);

  return (
    <Box as="section" pt="20" pb="12" position="relative">
      <Box position="absolute" inset="0" height="32" bg="brand.600" />
      <CardWithAvatar
        maxW="2xl"
        avatarProps={{
          src: user?.photoURL,
          name: user.displayName,
        }}
        action={
          <Button variant="primary" size="sm" leftIcon={<HiPencilAlt />}>
            Edit
          </Button>
        }
      >
        <CardContent>
          <Heading size="md" fontWeight="bold" letterSpacing="tight">
            {user && user?.displayName}
          </Heading>
          <Text color={useColorModeValue("gray.600", "gray.400")}>
            {user && user.phoneNumber}
          </Text>
          <UserInfo
            location={"Nairobi, Kenya"}
            website="esther.com"
            memberSince={new Date(user.metadata.creationTime).toDateString()}
          />
        </CardContent>
      </CardWithAvatar>

      <Settings />
    </Box>
  );
};
export default Account;
