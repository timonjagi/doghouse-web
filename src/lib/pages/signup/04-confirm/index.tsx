import {
  Stack,
  Button,
  ButtonGroup,
  Spacer,
  Image,
  useColorModeValue,
  Box,
  Wrap,
  WrapItem,
  HStack,
  Icon,
  Text,
  Heading,
  Badge,
  Avatar,
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import { auth } from "firebase-admin";
import { setDoc, doc, addDoc, getDoc } from "firebase/firestore";
import useGroupData from "hooks/useGroupData";
import { fireStore } from "lib/firebase/client";
import { useEffect, useState } from "react";
import { IoImagesOutline, IoLocationOutline } from "react-icons/io5";
import { PiDog, PiGenderIntersex } from "react-icons/pi";
import safeJsonStringify from "safe-json-stringify";
import { breedGroups } from "../../../data/breed_groups.js";
import { Group } from "atoms/groupsAtom.js";
import { useRouter } from "next/router.js";

export const Confirm = ({ currentStep, setStep }) => {
  const [userProfile, setUserProfile] = useState({} as any);
  const [petProfile, setPetProfile] = useState({} as any);
  const { groupStateValue, onJoinOrLeaveGroup } = useGroupData();

  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);

    const profile = JSON.parse(localStorage.getItem("profile"));

    if (profile) {
      setLoading(false);
      setUserProfile(profile);
      setPetProfile(profile.pet_profiles[0]);
    }
  }, []);

  // const getBreedGroupDoc = async () => {
  //   try {
  //     console.log(petProfile.breed);
  //     const breedGroup = breedGroups.find(
  //       (group) => group.slug === petProfile?.breed?.breedGroup
  //     );
  //     console.log(breedGroup);

  //     const groupDocRef = doc(fireStore, "groups", breedGroup?.slug as string);

  //     const groupDoc = await getDoc(groupDocRef);
  //     const groupData = { ...groupDoc.data(), id: groupDoc.id };
  //     return;
  //   } catch (error) {
  //     console.log("get breed error", error);
  //     throw error;
  //   }
  // };

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(userProfile);
    console.log(petProfile);
    // creat user profile
    // create pet profile
    // join group
    // create post

    try {
      setLoading(true);

      await Promise.allSettled([
        createUserProfile(),
        joinBreedGroup(),
        createPost(),
      ]);

      setLoading(false);
      toast({
        title: "Profile created successfully",
        status: "success",
      });

      router.push("/dashboard");
    } catch (error) {}
  };

  const createUserProfile = async () => {
    try {
      const userPayload = { ...userProfile };
      delete userPayload.pet_profiles;

      await setDoc(doc(fireStore, "users", userProfile.userId), userPayload);

      // eslint-disable-next-line
    } catch (err: any) {
      toast({
        title: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const joinBreedGroup = () => {
    const breedGroup = breedGroups.find(
      (group) => group.slug === petProfile?.breed?.breedGroup
    );
    console.log(breedGroup);
    const groupData = {
      name: breedGroup.name,
      id: breedGroup.slug,
      slug: breedGroup.slug,
      description: breedGroup.description,
    };

    onJoinOrLeaveGroup(groupData, false);
  };

  const createPost = () => {};

  return (
    <>
      {!loading && (
        <Stack as="form" spacing="4" onSubmit={(event) => onSubmit(event)}>
          <Heading size="md">
            Almost there! Let's confirm your details ⌛
          </Heading>

          <Box
            borderWidth="1px"
            borderRadius="lg"
            w="full"
            px="6"
            py="6"
            bg={useColorModeValue("white", "gray.800")}
          >
            <Stack pb="4">
              <HStack align="center">
                <Stack spacing="1">
                  <HStack></HStack>
                </Stack>
              </HStack>

              <Stack
                w="100%"
                p="4"
                spacing="4"
                bg={useColorModeValue("gray.50", "gray.700")}
              >
                <HStack>
                  {/* <Image
                        src={`images/breed_groups/${petProfile.breed.breedGroup.replace(
                          " dogs",
                          ""
                        )}`}
                        fallbackSrc="/images/logo_white.png"
                        fallbackStrategy="beforeLoadOrError"
                        bg="bg-subtle"
                        w="50%"
                      /> */}

                  <Stack>
                    <Heading size="xs">{userProfile.name}</Heading>
                    <Text
                      textTransform="capitalize"
                      fontSize="sm"
                      fontWeight="semibold"
                      lineHeight="1rem"
                      borderRadius="base"
                    >
                      {userProfile.roles[0].replace("_", " ")}
                    </Text>
                    <HStack spacing="3">
                      <Icon
                        fontSize="xl"
                        as={IoLocationOutline}
                        color="muted"
                      />
                      <Text textTransform="capitalize" fontSize="sm">
                        {userProfile.location}
                      </Text>
                    </HStack>

                    <HStack spacing="3">
                      <Icon fontSize="xl" as={PiDog} />
                      <Text textTransform="capitalize" fontSize="sm">
                        {petProfile.breed.name}{" "}
                        {petProfile.age.toLowerCase() || ""}
                      </Text>
                    </HStack>

                    {userProfile.roles.includes("dog_owner") && (
                      <HStack spacing="3">
                        <Icon fontSize="xl" as={IoImagesOutline} />
                        <Text textTransform="capitalize" fontSize="sm">
                          {petProfile.images.length} photo
                          {petProfile.images.length > 1 ? "s" : ""}{" "}
                        </Text>
                      </HStack>
                    )}
                    {userProfile.roles.includes("dog_seeker") && (
                      <>
                        <HStack spacing="3">
                          <Icon fontSize="xl" as={PiGenderIntersex} />
                          <Text textTransform="capitalize" fontSize="sm">
                            {petProfile.sex}
                          </Text>
                        </HStack>
                      </>
                    )}
                  </Stack>
                </HStack>
              </Stack>

              <Text fontSize="xs" color="subtle" textAlign="start">
                {userProfile.roles?.includes("dog_owner") ? "Have" : "Want"}{" "}
                multiple breeds? That's awesome! You can create additional{" "}
                {userProfile.roles?.includes("dog_owner")
                  ? "pet profiles"
                  : "listings"}{" "}
                later.
                {userProfile.roles.includes("dog_owner")
                  ? "An announcement will be made on "
                  : "A listing will be added on the "}{" "}
                {petProfile.breed.breedGroup} group to notify members about your{" "}
                {userProfile.roles.includes("dog_owner")
                  ? "membership"
                  : "request"}
                .
              </Text>
            </Stack>
          </Box>

          <Text fontSize="sm" color="subtle" textAlign="center"></Text>

          <ButtonGroup width="100%" mb="4">
            <Button
              onClick={() => setStep(currentStep - 1)}
              isDisabled={currentStep === 0}
              variant="ghost"
            >
              Back
            </Button>
            <Spacer />
            <Button isLoading={loading} type="submit" variant="primary">
              Confirm
            </Button>
          </ButtonGroup>
        </Stack>
      )}
    </>
  );
};
