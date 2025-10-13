import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import * as React from "react";
import { useEffect, useState } from "react";
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";
import { auth, fireStore, storage } from "lib/firebase/client";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/router";
import { Dropzone } from "lib/components/ui/Dropzone";

const Profile = ({ userProfile, onClose }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");

  const [selectedFiles, setSelectedFiles] = useState([] as any);
  const toast = useToast();
  const [user, loading, error] = useAuthState(auth);
  const [updateProfile] = useUpdateProfile(auth);

  const [saving, setSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setFirstName(userProfile.name.split(" ")[0]);
    setLastName(userProfile.name.split(" ")[1]);
    setLocation(userProfile.location);
  }, [userProfile]);

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    const reader = new FileReader();

    if (files?.length) {
      reader.readAsDataURL(files[0]);

      reader.onload = (readerEvent) => {
        const newFile = readerEvent.target?.result;
        if (newFile) {
          if (selectedFiles.includes(newFile)) {
            return toast({
              title: "Image already selected",
              description: "Please select a different image",
              status: "error",
              duration: 4000,
            });
          }
          setSelectedFiles([...selectedFiles, newFile]);
        }
      };
    }
  };

  const onRemoveImage = (file) => {
    const files = selectedFiles.filter((selectedFile) => selectedFile !== file);
    setSelectedFiles(files);
  };

  const onSubmit = async () => {
    setSaving(true);

    try {
      const userDocRef = doc(fireStore, "users", user.uid as string);

      let downloadUrl = "";
      if (selectedFiles.length) {
        try {
          // store images in firebase/storage
          const imageRef = ref(storage, `users/${userDocRef.id}/profilePhoto`);
          await uploadString(imageRef, selectedFiles[0], "data_url");

          // get download url from stroage
          downloadUrl = await getDownloadURL(imageRef);

          await updateProfile({ photoURL: downloadUrl });
        } catch (error) {
          toast({
            title: "Error saving profile",
            description: error.message,
            status: "error",
          });
          setSaving(false);
        }
        // get user doc ref
      }
      // update pet doc by adding image urls
      await updateDoc(userDocRef, {
        name: `${firstName} ${lastName}`,
        location: location,
        profilePhotoUrl: downloadUrl
          ? downloadUrl
          : userProfile.profilePhotoUrl || "",
      });

      toast({
        title: "Profile updated successfully",
        status: "success",
      });
      // reset image  and reload profile
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      toast({
        title: "Error saving profile",
        description: error.message,
        status: "error",
      });
      setSaving(false);
    }

    setSaving(false);
  };

  return (
    <Stack
      direction={{ base: "column", lg: "row" }}
      spacing={{ base: "5", lg: "8" }}
      justify="center"
      maxW="2xl"
    >
      {/* <Box flexShrink={0}>
        <Text fontSize="lg" fontWeight="medium">
          Your Profile
        </Text>
        <Text color="muted" fontSize="sm">
          Tell others who you are
        </Text>
      </Box> */}

      <>
        {loading ? (
          <Box flex="1" h="full">
            <Center>
              <Spinner />
            </Center>
          </Box>
        ) : (
          <Box borderRadius="lg" flex="1">
            <Stack
              spacing="5"
              px={{ base: "4", md: "6" }}
              py={{ base: "5", md: "6" }}
            >
              {/* <Alert status="info">
              <AlertIcon />
              Upload profile photo to continue
            </Alert> */}
              <Stack spacing="6" direction={{ base: "column", md: "row" }}>
                <FormControl id="firstName">
                  <FormLabel>First Name</FormLabel>
                  <Input
                    defaultValue=""
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                </FormControl>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    defaultValue=""
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </FormControl>
              </Stack>
              <FormControl id="street">
                <FormLabel>Location</FormLabel>
                <Input
                  defaultValue=""
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                />
              </FormControl>

              <FormControl id="picture">
                <FormLabel>Picture</FormLabel>
                <Stack spacing={{ base: "3", md: "5" }} direction="row">
                  <Avatar
                    size="lg"
                    name={userProfile.name}
                    src={userProfile.profilePhotoUrl}
                  />
                  <Dropzone
                    selectedFiles={selectedFiles}
                    onRemove={onRemoveImage}
                    onChange={onSelectImage}
                    maxUploads={1}
                  />
                </Stack>
              </FormControl>
            </Stack>
            <Divider />
            <Flex direction="row-reverse" py="4" px={{ base: "4", md: "6" }}>
              <Button
                type="submit"
                variant="primary"
                onClick={onSubmit}
                isLoading={saving}
              >
                Save
              </Button>
            </Flex>
          </Box>
        )}
      </>
    </Stack>
  );
};

export default Profile;
