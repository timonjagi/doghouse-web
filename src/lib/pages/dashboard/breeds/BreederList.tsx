import { Card, CardHeader, Heading, CardBody, Center, Alert, AlertIcon, SimpleGrid, HStack, Avatar, VStack, Icon, Button, Text, Stack } from "@chakra-ui/react";
import { Loader } from "lib/components/ui/Loader";
import { useBreedersForBreed } from "lib/hooks/queries/useUserBreeds";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { BreederCard } from "../../../components/ui/BreederCard";
import { use, useEffect, useState } from "react";
import { useCurrentUser } from "lib/hooks/queries/useAuth";

interface BreedersListProps {
  breed: any;
  userRole?: string;
}
export const BreedersList: React.FC<BreedersListProps> = ({ breed, userRole }) => {
  const { data: breedersForBreed, isLoading: isLoadingBreeders, error } = useBreedersForBreed(breed?.id);

  if (isLoadingBreeders) {
    return (
      <Loader />
    );
  }


  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading breeders data. Please try again later.
        {error.message}
      </Alert>
    );
  }


  if (breedersForBreed?.length === 0) {
    return (
      <Alert status="warning">
        <AlertIcon />
        No breeders found for this breed.
      </Alert>
    );
  }


  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
      {breedersForBreed?.map((breeder) => (
        <BreederCard key={breeder?.id} breeder={breeder} />
      ))}
    </SimpleGrid>
  )
}
