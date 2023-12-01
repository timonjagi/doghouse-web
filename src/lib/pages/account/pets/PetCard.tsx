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
      <VStack spacing="1" flex="1">
        <HStack>
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
      </VStack>{" "}
      <HStack
        spacing="1"
        fontSize="sm"
        color={useColorModeValue("gray.600", "gray.400")}
      >
        <Icon as={HiUsers} />
        <Text>{pet.breed}</Text>
      </HStack>
      <Button
        variant="primary"
        colorScheme="brand"
        rounded="full"
        size="sm"
        width="full"
        as={Link}
        href={`/account/pets/${pet.id}`}
      >
        View Profile
      </Button>
    </Flex>
  );
};
export default PetCard;
