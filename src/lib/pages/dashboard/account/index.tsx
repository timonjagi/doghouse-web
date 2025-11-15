import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Stack,
  StackDivider,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
// import * as React from "react";

import { CardContent } from "./CardContent";
import { CardWithAvatar } from "./CardWithAvatar";

import { useSupabaseAuth } from "lib/hooks/useSupabaseAuth";
import { Loader } from "lib/components/ui/Loader";
import { UserInfo } from "./UserInfo";
import { useUserProfile } from "lib/hooks/queries/useUserProfile";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useSignOut } from "lib/hooks/queries/useAuth";
import { FiLogOut, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

const AccountPage = () => {
  const { user, loading } = useSupabaseAuth();
  const router = useRouter();

  const toast = useToast();
  const { data: userProfile, isLoading, error } = useUserProfile();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
  const signOut = useSignOut();
  const onLogout = async () => {

    try {
      await signOut.mutateAsync();
      toast({
        title: "Logged out successfully",
        description: "",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      router.replace("/login");

    } catch (error) {
      toast({
        title: error?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    return 0;
  };
  // Show loading state while fetching user profile
  if (isLoading) {
    return <Loader />;
  }

  if (error || !userProfile) {
    return (
      <Container maxW="6xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Error loading applications</Text>
            <Text fontSize="sm">
              {error?.message || 'Unable to load user profile'}
            </Text>
          </Box>
        </Alert>
      </Container>
    );
  }

  // eslint-disable-next-line
  // Role-specific routes
  const getRoleSpecificRoutes = () => {
    if (userProfile?.role === 'seeker') {
      return [
        {
          name: "Preferences",
          description: "Update your adoption preferences",
          href: "/dashboard/account/preferences",
        }
      ];
    } else if (userProfile?.role === 'breeder') {
      return [
        {
          name: "Kennel",
          description: "Manage your kennel details",
          href: "/dashboard/account/kennel",
        }
      ];
    }
    return [];
  };

  const routes = [
    {
      name: "Profile",
      description: "Update your profile details",
      href: "/dashboard/account/profile",
    },
    ...getRoleSpecificRoutes(),
    {
      name: "Billing",
      description: "Update your billing details",
      href: "/dashboard/account/billing",
    },
    {
      name: "Notifications",
      description: "Manage your notifications",
      href: "/dashboard/account/notifications",
    },
    {
      name: "Settings",
      description: "Manage your account settings",
      href: "/dashboard/account/settings",
    }
  ]

  return (
    <>
      <Container
        maxW="7xl"
        py={{ base: '4', md: '8 ' }}
        justifyContent="center"
      >
        <Box as="section" pt="20" pb="12" position="relative">
          <Box position="absolute" inset="0" height="32" bg="brand.600" />

          <CardWithAvatar
            maxW="2xl"
            mb={4}
            avatarProps={{
              src: userProfile?.profile_photo_url,
              name: userProfile?.display_name,
            }}
            action={
              <Button
                variant="primary"
                size="sm"
                rightIcon={<FiLogOut />}
                onClick={onOpen}
              >
                Log Out
              </Button>
            }
          >
            <CardContent>
              <Heading size="md" fontWeight="bold" letterSpacing="tight">
                {userProfile && userProfile?.display_name}
              </Heading>
              <Text color={useColorModeValue("gray.600", "gray.400")}>
                {user && user?.email}
              </Text>

              <UserInfo
                location={userProfile?.location_text}
                website="esther.com"
                memberSince={new Date(
                  user?.created_at
                ).toDateString()}
              />
            </CardContent>
          </CardWithAvatar>


          <Box
            bg="bg-surface"
            boxShadow={useColorModeValue("sm", "sm-dark")}
            borderRadius="lg"
            p={{
              base: "6",
              md: "8",
            }}
            maxW="2xl"
            mx="auto"
          >
            <Stack spacing="5" divider={<StackDivider />}>
              {routes.map((route, id) => (
                <Stack
                  key={id}
                  justify="space-between"
                  direction="row"
                  spacing="4"
                >
                  <Stack spacing="0.5" fontSize="sm">
                    <Text color="emphasized" fontWeight="medium">
                      {route.name}
                    </Text>
                    <Text color="muted">{route.description}</Text>
                  </Stack>

                  <IconButton
                    variant="ghost"
                    size="sm"
                    href={route.href}
                    as={Link}
                    icon={<ArrowForwardIcon />}
                    aria-label="Go to page"
                  />
                </Stack>
              ))}
            </Stack>
          </Box>

          <Flex my={4} w="auto" justify="center">
            <Button
              variant="ghost"
              color="red"
              size="sm"
              w="auto"
              leftIcon={<FiTrash2 />}
              onClick={() => { }}
            >
              Delete Account
            </Button>
          </Flex>

        </Box>

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={undefined}
          onClose={onClose}
          isCentered
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Log Out
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to log out?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={undefined} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="brand"
                  onClick={onLogout}
                  ml={3}
                >
                  Log Out
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <AlertDialog
          isCentered
          isOpen={isDeleteOpen}
          leastDestructiveRef={undefined}
          onClose={onCloseDelete}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Account
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={undefined} onClick={onCloseDelete}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => { }}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>            </AlertDialogContent>
          </AlertDialogOverlay>        </AlertDialog>

      </Container >

    </>
  );
};
export default AccountPage;
