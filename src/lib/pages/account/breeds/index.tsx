import {
  Stack,
  Box,
  Text,
  Center,
  SimpleGrid,
  Spinner,
  useToast,
  Flex,
  Icon,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getDocs, query, collection, or, where } from "firebase/firestore";
import { BreedCard } from "./BreedCard";
import breedData from "../../../data/breeds_with_group.json";
import { FiPlus } from "react-icons/fi";
import { useSupabaseAuth } from "lib/hooks/useSupabaseAuth";

type petsProps = {
  petData: any;
};

const Pets: React.FC<petsProps> = ({ petData }) => {
  const isVerified = false;
  const { user, loading } = useSupabaseAuth();
  const [loadingBreeds, setLoadingBreeds] = useState(false);
  const [pets, setPets] = useState([] as any);
  const toast = useToast();

  const { isOpen, onToggle, onClose } = useDisclosure();

  // useEffect(() => {
  //   const fetchBreeds = async () => {
  //     try {
  //       setLoadingBreeds(true);

  //       const querySnapshot = await getDocs(
  //         query(
  //           collection(fireStore, "userBreeds"),
  //           or(
  //             where("ownerId", "==", user.uid),
  //             where("seekerId", "==", user.uid)
  //           )
  //         )
  //       );

  //       let userBreeds = querySnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));

  //       userBreeds = userBreeds.map((pet) => {
  //         // @ts-ignore
  //         const breedInfo = breedData.find((breed) => breed.name === pet.breed);
  //         pet["breedGroup"] = breedInfo.breedGroup;
  //         return pet;
  //       });

  //       if (pets.length) {
  //         setPets([...pets]);
  //         localStorage.setItem("userBreeds", JSON.stringify(pets));
  //       }

  //       setLoadingBreeds(false);
  //     } catch (error) {
  //       toast({
  //         title: "There was a problem loading breeds",
  //         description: error.message,
  //         status: "error",
  //         isClosable: true,
  //       });

  //       setLoadingBreeds(false);
  //     }
  //   };

  //   if (!loading && user) {
  //     fetchBreeds();
  //   }
  // }, [loading, user]);

  return (
    <Stack spacing={{ base: "5", lg: "6" }}>
      <Box flexShrink={0}>
        <Text fontSize="lg" fontWeight="medium">
          Your Breeds
        </Text>
        <Text color="muted" fontSize="sm">
          All about your furry friends
        </Text>
      </Box>

      <Box flex="1">
        {loadingBreeds ? (
          <Box flex="1" h="full">
            <Center>
              <Spinner />
            </Center>
          </Box>
        ) : (
          <Box as="section" maxW={{ base: "none", md: "3xl" }} mx="auto">
            <SimpleGrid
              columns={{ base: 2, lg: 3, xl: 4 }}
              gap={{ base: "4", md: "6", lg: "8" }}
            >
              {" "}
              {pets.map((pet) => (
                <BreedCard pet={pet} />
              ))}
              <Flex
                as={Button}
                _hover={{ bg: "gray.300" }}
                alignContent="center"
                justifyContent="center"
                flexWrap="wrap"
                px="4"
                py="4"
                bg="gray.200"
                boxSize="auto"
                boxSizing="content-box"
                borderRadius="md"
                onClick={onToggle}
              >
                <Icon
                  as={FiPlus}
                  aria-label="Add pet button"
                  color="gray.400"
                  boxSize="8F"
                />
              </Flex>
            </SimpleGrid>
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default Pets;
