import {
  Stack,
  Box,
  Text,
  Center,
  SimpleGrid,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getDocs, query, collection, or, where } from "firebase/firestore";
import { auth, fireStore } from "lib/firebase/client";
import { useAuthState } from "react-firebase-hooks/auth";
import PetCard from "./PetCard";
import breedData from "../../../data/breeds_with_group.json";

type petsProps = {
  petData: any;
};

export const Pets: React.FC<petsProps> = ({ petData }) => {
  const isVerified = false;
  const [user, loading, error] = useAuthState(auth);
  const [loadingPets, setLoadingPets] = useState(false);
  const [pets, setPets] = useState([] as any);
  const toast = useToast();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoadingPets(true);

        const querySnapshot = await getDocs(
          query(
            collection(fireStore, "pets"),
            or(
              where("ownerId", "==", user.uid),
              where("seekerId", "==", user.uid)
            )
          )
        );

        let pets = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        pets = pets.map((pet) => {
          // @ts-ignore
          const breedInfo = breedData.find((breed) => breed.name === pet.breed);
          pet["breedGroup"] = breedInfo.breedGroup;
          return pet;
        });

        if (pets.length) {
          setPets([...pets]);
        }

        setLoadingPets(false);
      } catch (error) {
        toast({
          title: "There was a problem loading pets",
          description: error.message,
          status: "error",
          isClosable: true,
        });

        setLoadingPets(false);
      }
    };

    if (!loading && user) {
      fetchPets();
    }
  }, [loading, user]);

  return (
    <Stack
      direction={{ base: "column", lg: "row" }}
      spacing={{ base: "5", lg: "6" }}
    >
      <Box flexShrink={0}>
        <Text fontSize="lg" fontWeight="medium">
          Your Pets
        </Text>
        <Text color="muted" fontSize="sm">
          Tell others about your furry friends
        </Text>
      </Box>

      <Box px={{ base: "6", md: "8" }} py="12" flex="1">
        {loadingPets ? (
          <Box flex="1" h="full">
            <Center>
              <Spinner />
            </Center>
          </Box>
        ) : (
          <Box as="section" maxW={{ base: "xs", md: "3xl" }} mx="auto">
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="6">
              {pets.map((pet) => (
                <PetCard pet={pet} />
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Box>
    </Stack>
  );
};
export default Pets;
