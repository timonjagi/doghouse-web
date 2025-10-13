import {
  Stack,
  Button,
  ButtonGroup,
  Spacer,
  Text,
  Heading,
  useToast,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { setDoc, doc, addDoc, collection, updateDoc } from "firebase/firestore";
import { fireStore, storage } from "lib/firebase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router.js";
import { RadioButton } from "lib/components/ui/RadioButton";
import { RadioButtonGroup } from "lib/components/ui/RadioButtonGroup";
import { Dropzone } from "lib/components/ui/Dropzone";
import { useDropZone } from "lib/hooks/useDropZone";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export const PetDetails = ({ currentStep, setStep, onClose }) => {
  const [userProfile, setUserProfile] = useState({} as any);
  const [userBreed, setUserBreed] = useState({} as any);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  const toast = useToast();
  const router = useRouter();

  const [selectedImages, setSelectedImages] = useState([] as any);
  const [selectedAge, setSelectedAge] = useState<string>("");
  const [spayedOrNeutered, setSpayedOrNeutered] = useState("");

  const { onSelectImage, onRemoveImage } = useDropZone({
    selectedImages,
    setSelectedImages,
  });

  useEffect(() => {
    setLoadingProfile(true);

    const profile = JSON.parse(localStorage.getItem("profile"));

    if (profile) {
      setLoadingProfile(false);
      setUserProfile(profile);
      setUserBreed(profile.user_breeds[0]);
    }
  }, []);

  // const getBreedGroupDoc = async () => {
  //   try {
  //     console.log(userBreed.breed);
  //     const breedGroup = breedGroups.find(
  //       (group) => group.slug === userBreed?.breed?.breedGroup
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
    console.log(userBreed);
    // creat user profile
    // create pet profile
    // join group
    // create post

    try {
      setSaving(true);

      //await Promise.all([createUserProfile(), createuserBreed()]);
      const payload = {
        ...userProfile,
        ...(userProfile.role === "dog_owner" ?
          { user_breeds: [{ ...userBreed, images: selectedImages }] }
          :
          {
            preferences: {
              ...userProfile.preferences,
              ...userProfile.preferences,
              age: selectedAge,
              spayedOrNeutered: spayedOrNeutered,
            }
          }),
      };

      localStorage.setItem("profile", JSON.stringify(payload));

      setStep(currentStep + 1);

      setSaving(false);

      // localStorage.removeItem("profile");
      toast({
        title: "Profile created successfully",
        status: "success",
      });

      // router.push("/account/profile");
    } catch (error) {
      toast({
        title: "Error saving profile",
        description: error.messsage,
        status: "error",
      });
      setSaving(false);
    }
  };

  const createUserProfile = async () => {
    const userPayload = {
      ...userProfile,
      groups: [userBreed.breed.breedGroup],
    };

    userPayload.breeds = userPayload.userBreeds.reduce((acc, profile) => {
      const breed: string = profile.breed.name;
      acc.push(breed);
      return acc;
    }, []);

    delete userPayload.userBreeds;

    await setDoc(doc(fireStore, "users", userProfile.userId), userPayload);
  };

  const createUserBreeds = async () => {
    const petPayload = userProfile.roles.includes("dog_seeker")
      ? {
        breed: userBreed.breed.name,
        sex: userBreed.sex || "",
        age: selectedAge || "",
        spayedOrNeutered: spayedOrNeutered,
        [userProfile.roles.includes("dog_owner") ? "ownerId" : "seekerId"]:
          userProfile.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      : {
        breed: userBreed.breed.name,
        sex: userBreed.sex || "",
        [userProfile.roles.includes("dog_owner") ? "ownerId" : "seekerId"]:
          userProfile.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

    // const petDocRef = await addDoc(collection(fireStore, "pets"), petPayload);

    // if (selectedImages.length) {
    //   const downloadUrls = [];
    //   // store images in firebase/storage
    //   selectedImages.map(async (image, index) => {
    //     const imageRef = ref(storage, `pets/${petDocRef.id}/image${index + 1}`);
    //     await uploadString(imageRef, image, "data_url");
    //     // get download url from stroage
    //     const downloadUrl = await getDownloadURL(imageRef);
    //     console.log("downloadUrl", downloadUrl);
    //     downloadUrls.push(downloadUrl);
    //   });

    //   if (downloadUrls.length) {
    //     console.log("updating pet doc with image urls");
    //     // update pet doc by adding image urls
    //     await updateDoc(petDocRef, { images: [...downloadUrls] });
    //   }

    //   onClose();
    // }
  };

  return (
    <>
      {!loadingProfile && (
        <Stack as="form" spacing="8" onSubmit={(event) => onSubmit(event)}>
          <Heading size="md">
            We love{" "}
            <span style={{ textTransform: "capitalize" }}>
              {userBreed?.breed?.name}s!
            </span>{" "}
            {userProfile?.roles?.includes("dog_owner")
              ? "Let's see some pics 📷"
              : "Give us some more details"}
          </Heading>

          {userProfile?.roles?.includes("dog_seeker") && (
            <Stack spacing="4">
              <FormControl>
                <FormLabel htmlFor="breeds" fontWeight="semibold">
                  Ideal Age
                </FormLabel>

                <RadioButtonGroup
                  key="age"
                  size="md"
                  value={selectedAge}
                  onChange={setSelectedAge}
                >
                  <RadioButton value="puppy">
                    <Text
                      fontWeight={
                        selectedAge === "puppy" ? "semibold" : "normal"
                      }
                    >
                      Puppy
                    </Text>
                  </RadioButton>
                  <RadioButton value="adolescent">
                    <Text
                      fontWeight={
                        selectedAge === "adolescent" ? "semibold" : "normal"
                      }
                    >
                      Adolescent
                    </Text>
                  </RadioButton>
                  <RadioButton value="adult">
                    <Text
                      fontWeight={
                        selectedAge === "adult" ? "semibold" : "normal"
                      }
                    >
                      Adult
                    </Text>
                  </RadioButton>
                </RadioButtonGroup>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="breeds" fontWeight="semibold">
                  Spayed / Neutered
                </FormLabel>

                <RadioButtonGroup
                  key="age"
                  size="md"
                  value={spayedOrNeutered}
                  onChange={setSpayedOrNeutered}
                >
                  <RadioButton value="yes">
                    <Text
                      fontWeight={
                        selectedAge === "puppy" ? "semibold" : "normal"
                      }
                    >
                      Yes
                    </Text>
                  </RadioButton>
                  <RadioButton value="no">
                    <Text
                      fontWeight={
                        spayedOrNeutered === "no" ? "semibold" : "normal"
                      }
                    >
                      No
                    </Text>
                  </RadioButton>
                </RadioButtonGroup>
              </FormControl>
            </Stack>
          )}

          {userProfile?.roles?.includes("dog_owner") && (
            <Dropzone
              selectedFiles={selectedImages}
              onChange={onSelectImage}
              onRemove={onRemoveImage}
              maxUploads={2}
            />
          )}

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
