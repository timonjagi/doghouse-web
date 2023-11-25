import {
  Stack,
  Button,
  ButtonGroup,
  Spacer,
  useColorModeValue,
  Box,
  HStack,
  Icon,
  Text,
  Heading,
  useToast,
} from "@chakra-ui/react";
import {
  setDoc,
  doc,
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import useGroupData from "hooks/useGroupData";
import { fireStore, storage } from "lib/firebase/client";
import { useEffect, useState } from "react";
import { IoImagesOutline, IoLocationOutline } from "react-icons/io5";
import { PiDog, PiGenderIntersex } from "react-icons/pi";
import { useRouter } from "next/router.js";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

export const Confirm = ({ currentStep, setStep }) => {
  const [userProfile, setUserProfile] = useState({} as any);
  const [petProfile, setPetProfile] = useState({} as any);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    setLoadingProfile(true);

    const profile = JSON.parse(localStorage.getItem("profile"));

    if (profile) {
      setLoadingProfile(false);
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
      setSaving(true);

      await Promise.allSettled([
        createUserProfile(),
        createPetProfile(),
        createPost(),
      ]);

      setSaving(false);

      localStorage.removeItem("profile");
      toast({
        title: "Profile created successfully",
        status: "success",
      });

      router.push("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  const createUserProfile = async () => {
    try {
      const userPayload = {
        ...userProfile,
        groups: [petProfile.breed.breedGroup],
      };

      delete userPayload.pet_profiles;

      await setDoc(doc(fireStore, "users", userProfile.userId), userPayload);

      // eslint-disable-next-line
    } catch (err: any) {
      toast({
        title: "Error creating user profile",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const createPetProfile = async () => {
    try {
      const petPayload = {
        breed: petProfile.breed.name,
        age: petProfile.age || "",
        sex: petProfile.breed.sex || "",
        [userProfile.roles.includes("dog_owner") ? "ownerId" : "seekerId"]:
          userProfile.userId,
      };

      await addDoc(collection(fireStore, "pets"), petPayload);
    } catch (error) {
      toast({
        title: "Error creating pet profile",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // const joinBreedGroup = () => {
  //   const breedGroup = breedGroups.find(
  //     (group) => group.slug === petProfile?.breed?.breedGroup
  //   );

  //   const groupData = {
  //     name: breedGroup.name,
  //     id: breedGroup.slug,
  //     slug: breedGroup.slug,
  //     userId: userProfile.userId,
  //   };

  //   onJoinOrLeaveGroup(groupData, false);
  // };

  const createPost = async () => {
    const newPost: any = {
      creatorId: userProfile.userId,
      creatorDisplayName: userProfile.name,
      title: petProfile.breed.name,
      body: petProfile,
      numberOfComments: 0,
      voteCount: 0,
      createdAt: serverTimestamp() as Timestamp,
    };

    // remove images from payload
    delete newPost.body.images;

    try {
      // store post in db
      const postDocRef = await addDoc(collection(fireStore, "posts"), newPost);

      // check for selected file
      if (userProfile.roles.includes("dog_owner")) {
        // store image in firebase/storage
        const downloadUrls = [];
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        for (const image of petProfile.images) {
          await uploadString(imageRef, image, "data_url");
          // get download url from stroage
          const downloadUrl = await getDownloadURL(imageRef);
          downloadUrls.push(downloadUrl);
        }

        // update post doc by adding image url
        await updateDoc(postDocRef, { imageUrls: downloadUrls });
      }
    } catch (error: any) {
      toast({
        title: "Error creating post",
        description: error,
        status: "error",
      });
      console.log("HandleCreatePost error", error.message);
    }
  };

  return (
    <>
      {!loadingProfile && (
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
                        {petProfile.age?.toLowerCase() || ""}
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
                  ? "An announcement will be made"
                  : "A listing will be added"}
                to notify members about your{" "}
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
            <Button isLoading={saving} type="submit" variant="primary">
              Confirm
            </Button>
          </ButtonGroup>
        </Stack>
      )}
    </>
  );
};
