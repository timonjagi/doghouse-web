import {
  Stack,
  Heading,
  useBreakpointValue,
  HStack,
  Button,
  Box,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { FiDownloadCloud } from "react-icons/fi";

type indexProps = {};

const Services: React.FC<indexProps> = () => {
  return (
    <Stack spacing={{ base: "8", lg: "6" }} height="full">
      <Stack
        spacing="4"
        direction={{ base: "column", lg: "row" }}
        justify="space-between"
        align={{ base: "start", lg: "center" }}
      >
        <Stack spacing="1">
          <Heading
            size={useBreakpointValue({ base: "xs", lg: "sm" })}
            fontWeight="medium"
          >
            Dashboard
          </Heading>
          <Text color="muted">All important metrics at a glance</Text>
        </Stack>
        <HStack spacing="3">
          <Button
            variant="secondary"
            leftIcon={<FiDownloadCloud fontSize="1.25rem" />}
          >
            Download
          </Button>
          <Button variant="primary">Create</Button>
        </HStack>
      </Stack>
      <Box bg="bg-surface" borderRadius="lg" borderWidth="1px" height="full" />
    </Stack>
  );
};
export default Services;
