// import {
//   Stack,
//   Box,
//   Text,
//   Center,
//   SimpleGrid,
//   Spinner,
//   useToast,
//   Flex,
//   useColorModeValue,
//   Icon,
//   Square,
//   Button,
//   Modal,
//   ModalBody,
//   ModalCloseButton,
//   ModalContent,
//   ModalOverlay,
//   useDisclosure,
//   useSteps,
// } from "@chakra-ui/react";
// import React, { useEffect, useState } from "react";
// import {
//   getDocs,
//   query,
//   collection,
//   or,
//   where,
//   addDoc,
//   doc,
//   updateDoc,
// } from "firebase/firestore";
// import { auth, fireStore, storage } from "lib/firebase/client";
// import { useAuthState } from "react-firebase-hooks/auth";
// import PetCard from "./PetCard";
// import breedData from "../../data/breeds_with_group.json";
// import { FiPlus } from "react-icons/fi";
// import PetProfileEdit from "./pet-detail/PetProfileEdit";
// import { ref, uploadString, getDownloadURL } from "firebase/storage";
// import { useRouter } from "next/router";

// type petsProps = {
//   petData: any;
// };

// export const Pets: React.FC<petsProps> = ({ petData }) => {
//   const isVerified = false;
//   const [user, loading, error] = useAuthState(auth);
//   const [loadingPets, setLoadingPets] = useState(false);
//   const [pets, setPets] = useState([] as any);
//   const toast = useToast();

//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [selectedSex, setSex] = useState<string>("");
//   const [selectedAge, setAge] = useState<string>("");
//   const [selectedBreed, setBreed] = useState<any>({} as any);
//   const [selectedVaccinations, setVaccinations] = useState([] as any);

//   const [saving, setSaving] = useState(false);

//   const steps = [
//     { title: "Select Breed" },
//     { title: "Choose age" },
//     { title: "Choose sex/gender" },
//     { title: "Select vaccinations" },
//     { title: "Upload photos" },
//   ];

//   const { activeStep, setActiveStep } = useSteps({
//     index: 0,
//     count: steps.length,
//   });

//   const onSelectBreed = (selectedBreed: any) => {
//     const breed = breedData.find((breed) => breed.name === selectedBreed.value);
//     if (breed) {
//       setBreed(breed);
//     }
//   };

//   const onSelectVaccination = (selectedVaccinations) => {
//     console.log(selectedVaccinations);
//     setVaccinations(selectedVaccinations);
//   };

//   const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const {
//       target: { files },
//     } = event;
//     const reader = new FileReader();

//     if (files?.length) {
//       reader.readAsDataURL(files[0]);

//       reader.onload = (readerEvent) => {
//         const newFile = readerEvent.target?.result;
//         if (newFile) {
//           if (selectedFiles.includes(newFile)) {
//             return toast({
//               title: "Image already selected",
//               description: "Please select a different image",
//               status: "error",
//               duration: 4000,
//             });
//           }
//           setSelectedFiles([...selectedFiles, newFile]);
//         }
//       };
//     }
//   };

//   const onRemoveImage = (file) => {
//     const files = selectedFiles.filter((selectedFile) => selectedFile !== file);
//     setSelectedFiles(files);
//   };

//   const onSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     setSaving(true);

//     try {
//       // update pet doc by adding image urls

//       const newPetDocRef = await addDoc(collection(fireStore, "pets"), {
//         breed: selectedBreed.name,
//         age: selectedAge,
//         sex: selectedSex,
//         vaccinations: selectedVaccinations.map(
//           (vaccination) => vaccination.value
//         ),
//       });

//       let downloadUrls = [];

//       selectedFiles.length
//         ? selectedFiles.forEach(async (file, index) => {
//             // store images in firebase/storage
//             const imageRef = ref(
//               storage,
//               `pets/${newPetDocRef.id}/image${index + 1}`
//             );
//             await uploadString(imageRef, file, "data_url");

//             // get download url from stroage
//             const downloadUrl = await getDownloadURL(imageRef);
//             downloadUrls.push(downloadUrl);
//           })
//         : null;

//       // update doc with image urls
//       await updateDoc(newPetDocRef, {
//         images: downloadUrls,
//       });

//       setSaving(false);
//       onClose();

//       // eslint-disable-next-line
//     } catch (err: any) {
//       toast({
//         title: err.message,
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//       });

//       setSaving(false);
//     }
//   };

//   const { isOpen, onToggle, onClose } = useDisclosure();

//   useEffect(() => {
//     const fetchPets = async () => {
//       try {
//         setLoadingPets(true);

//         const querySnapshot = await getDocs(
//           query(
//             collection(fireStore, "pets"),
//             or(
//               where("ownerId", "==", user.uid),
//               where("seekerId", "==", user.uid)
//             )
//           )
//         );

//         let pets = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         pets = pets.map((pet) => {
//           // @ts-ignore
//           const breedInfo = breedData.find((breed) => breed.name === pet.breed);
//           pet["breedGroup"] = breedInfo.breedGroup;
//           return pet;
//         });

//         if (pets.length) {
//           setPets([...pets]);
//         }

//         setLoadingPets(false);
//       } catch (error) {
//         toast({
//           title: "There was a problem loading pets",
//           description: error.message,
//           status: "error",
//           isClosable: true,
//         });

//         setLoadingPets(false);
//       }
//     };

//     if (!loading && user) {
//       fetchPets();
//     }
//   }, [loading, user]);

//   return (
//     <Stack
//       direction={{ base: "column", lg: "row" }}
//       spacing={{ base: "5", lg: "6" }}
//     >
//       <Box flexShrink={0}>
//         <Text fontSize="lg" fontWeight="medium">
//           Your Pets
//         </Text>
//         <Text color="muted" fontSize="sm">
//           Info about your furry friends
//         </Text>
//       </Box>

//       <Box px={{ base: "6", md: "8" }} py="12" flex="1">
//         {loadingPets ? (
//           <Box flex="1" h="full">
//             <Center>
//               <Spinner />
//             </Center>
//           </Box>
//         ) : (
//           <Box as="section" maxW={{ base: "xs", md: "3xl" }} mx="auto">
//             <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="6">
//               {pets.map((pet) => (
//                 <PetCard pet={pet} />
//               ))}

//               <Flex
//                 as={Button}
//                 _hover={{ bg: "gray.300" }}
//                 alignContent="center"
//                 justifyContent="center"
//                 flexWrap="wrap"
//                 px="4"
//                 py="4"
//                 bg="gray.200"
//                 boxSize="48"
//                 boxSizing="content-box"
//                 borderRadius="md"
//                 onClick={onToggle}
//               >
//                 <Icon
//                   as={FiPlus}
//                   aria-label="Add pet button"
//                   color="gray.400"
//                   boxSize="8F"
//                 />
//               </Flex>
//             </SimpleGrid>
//           </Box>
//         )}
//       </Box>

//       <Modal onClose={onClose} isOpen={isOpen} size={{ base: "xs", md: "sm" }}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalCloseButton />
//           <ModalBody>
//             {/* <PetProfileEdit
//               activeStep={activeStep}
//               onClose={onClose}
//               setBreed={setBreed}
//               setSex={setSex}
//               setAge={setAge}
//               setVaccinations={setVaccinations}
//               setSelectedFiles={setSelectedFiles}
//               selectedBreed={selectedBreed}
//               selectedSex={selectedSex}
//               selectedAge={selectedAge}
//               selectedFiles={selectedFiles}
//               selectedVaccinations={selectedVaccinations}
//               onSelectBreed={onSelectBreed}
//               onSelectVaccination={onSelectVaccination}
//               onSelectImage={onSelectImage}
//               onRemoveImage={onRemoveImage}
//             /> */}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </Stack>
//   );
// };
// export default Pets;
