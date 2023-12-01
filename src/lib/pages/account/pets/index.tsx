import { Stack, Box, Text } from "@chakra-ui/react";
import React from "react";
import PetsList from "./PetsList";

type petsProps = {
  petData: any;
};

export const Pets: React.FC<petsProps> = ({ petData }) => {
  return (
    <Stack
      direction={{ base: "column", lg: "row" }}
      spacing={{ base: "5", lg: "8" }}
      justify="space-between"
    >
      <Box flexShrink={0}>
        <Text fontSize="lg" fontWeight="medium">
          Your Pets
        </Text>
        <Text color="muted" fontSize="sm">
          Tell others about your furry friends
        </Text>

        <PetsList />
      </Box>
    </Stack>
  );
};
export default Pets;
