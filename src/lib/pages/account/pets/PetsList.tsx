import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  VStack,
  Text,
  useColorModeValue,
  SimpleGrid,
  useToast,
  Center,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { HiBadgeCheck } from "react-icons/hi";
import PetCard from "./PetCard";
import { getDocs, query, collection, or, where } from "firebase/firestore";
import { auth, fireStore } from "lib/firebase/client";
import { useAuthState } from "react-firebase-hooks/auth";

type PetsListProps = {};

const PetsList: React.FC<PetsListProps> = () => {
  const isVerified = false;
  const [user, loading, error] = useAuthState(auth);
  const [loadingPets, setLoadingPets] = useState(false);
  const [pets, setPets] = useState([] as any);
  const toast = useToast();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(fireStore, "pets"),
            or(
              where("ownerId", "==", user.uid),
              where("seekerId", "==", user.uid)
            )
          )
        );

        const pets = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (pets.length) {
          setPets([...pets]);
        }
      } catch (error) {
        toast({
          title: "There was a problem loading pets",
          description: error.message,
          status: "error",
          isClosable: true,
        });
      }
    };

    if (!loading && user) {
      fetchPets();
    }
  }, [loading, user]);

  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.800")}
      px={{ base: "6", md: "8" }}
      py="12"
    >
      {loading ? (
        <Box flex="1" h="full">
          <Center>
            <Spinner />
          </Center>
        </Box>
      ) : (
        <Box as="section" maxW={{ base: "xs", md: "3xl" }} mx="auto">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing="6">
            {pets.map((pet) => (
              <PetCard pet={pet} />
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
};
export default PetsList;
