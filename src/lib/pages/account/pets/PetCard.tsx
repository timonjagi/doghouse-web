import {
  Flex,
  useColorModeValue,
  Avatar,
  VStack,
  HStack,
  Icon,
  Button,
  Box,
  Text,
  Spacer,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaTransgender } from "react-icons/fa";
import { HiBadgeCheck, HiUsers } from "react-icons/hi";

type PetCardProps = {
  pet: any;
  onToggle: any;
  setSelectedPet: any;
};

const PetCard: React.FC<PetCardProps> = ({ pet, onToggle, setSelectedPet }) => {
  const isVerified = false;

  const onViewPet = () => {
    setSelectedPet(pet);
    onToggle();
  };
  return (
    <Flex
      direction="column"
      alignItems="center"
      rounded="md"
      padding="8"
      position="relative"
      bg={useColorModeValue("white", "gray.700")}
      shadow={{ md: "base" }}
    >
      <Box
        position="absolute"
        inset="0"
        height="20"
        bg="brand.600"
        roundedTop="inherit"
      />
      <Avatar size="xl" src={pet.petImageUrl} />
      <VStack spacing="2" flex="1">
        <HStack textAlign="center">
          <Text fontWeight="bold" textTransform="capitalize">
            {pet.breed}
          </Text>
          {isVerified && (
            <Icon
              as={HiBadgeCheck}
              color="blue.300"
              verticalAlign="text-bottom"
            />
          )}
        </HStack>
        <Text
          fontSize="sm"
          textAlign="center"
          noOfLines={2}
          color={useColorModeValue("gray.600", "gray.400")}
        >
          {pet.age}
        </Text>

        <HStack
          spacing="1"
          fontSize="sm"
          color={useColorModeValue("gray.600", "gray.400")}
        >
          <Icon as={FaTransgender} />
          <Text>{pet.sex}</Text>
        </HStack>

        <Spacer />
        <Button
          variant="primary"
          colorScheme="brand"
          rounded="full"
          size="sm"
          width="full"
          onClick={onViewPet}
        >
          View Pet
        </Button>
      </VStack>
    </Flex>
  );
};
export default PetCard;
