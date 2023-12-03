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
import { HiBadgeCheck, HiUsers } from "react-icons/hi";

type PetCardProps = {
  pet: any;
};

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const isVerified = false;
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
          {pet.age} {pet.sex}
        </Text>
        {/* 
        <HStack
          spacing="1"
          fontSize="sm"
          color={useColorModeValue("gray.600", "gray.400")}
        >
          <Icon as={HiUsers} />
          <Text>{pet.breedGroup} group</Text>
        </HStack> */}

        <Spacer />
        <Button
          variant="primary"
          colorScheme="brand"
          rounded="full"
          size="sm"
          width="full"
          as={Link}
          href={`/account/pets/${pet.id}`}
        >
          View Pet
        </Button>
      </VStack>
    </Flex>
  );
};
export default PetCard;
