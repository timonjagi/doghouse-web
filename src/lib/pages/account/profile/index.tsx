import { Box, Center, Spinner, Stack, Text, useToast } from "@chakra-ui/react";
import * as React from "react";
import { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, fireStore, storage } from "lib/firebase/client";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import image from "next/image";

const Profile = () => {
  const [selectedFiles, setSelectedFiles] = useState([] as any);
  const toast = useToast();
  const [user, loading, error] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState({} as any);

  const [firstName, setUserFirstName] = useState("");
  const [lastName, setUserLastName] = useState("");
  const [location, setUserLocation] = useState("");

  const [loadingUserProfile, setLoadingUserProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchUserProfile = async () => {
    setLoadingUserProfile(true);
    try {
      const userDocRef = doc(fireStore, "users", user.uid as string);

      const userDoc = await getDoc(userDocRef);
      const userProfile = userDoc.data();
      setUserProfile({ id: userDoc.id, ...userDoc.data() });
      setUserFirstName(userProfile.name.split(" ")[0]);
      setUserLastName(userProfile.name.split(" ")[1]);
      setUserLocation(userProfile.location);
    } catch (error) {
      toast({
        title: "Error loading profile",
        description: error.message,
        status: "error",
      });
    }

    setLoadingUserProfile(false);
  };

  useEffect(() => {
    if (!loading && user) {
      fetchUserProfile();
    }
  }, [user, loading]);

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
        // get user doc ref

        // store images in firebase/storage
        const imageRef = ref(storage, `users/${userDocRef.id}/profilePhoto`);
        await uploadString(imageRef, selectedFiles[0], "data_url");

        // get download url from stroage
        downloadUrl = await getDownloadURL(imageRef);
      }
      // update pet doc by adding image urls
      await updateDoc(userDocRef, {
        name: `${firstName} ${lastName}`,
        location: location,
        profilePhotoUrl: downloadUrl
          ? downloadUrl
          : userProfile.profilePhotoUrl,
      });

      toast({
        title: "Profile updated successfully",
        status: "success",
      });
      // reset image  and reload profile
      setSelectedFiles([]);
      fetchUserProfile();
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
      justify="space-between"
    >
      <Box flexShrink={0}>
        <Text fontSize="lg" fontWeight="medium">
          Your Profile
        </Text>
        <Text color="muted" fontSize="sm">
          Tell others who you are
        </Text>
      </Box>

      <ProfileCard
        loading={loadingUserProfile}
        saving={saving}
        userProfile={userProfile}
        firstName={firstName}
        lastName={lastName}
        location={location}
        setFirstName={setUserFirstName}
        setLastName={setUserLastName}
        setLocation={setUserLocation}
        selectedFiles={selectedFiles}
        onSelectImage={onSelectImage}
        onRemoveImage={onRemoveImage}
        onSubmit={onSubmit}
        maxW={{ lg: "3xl" }}
      />
    </Stack>
  );
};

export default Profile;
