import { Center, Flex, Spinner } from "@chakra-ui/react";

export const Loader = () => {
  return (
    <Flex h="100%" w="full" align="center" justify="center">
      <Center>
        <Spinner
          position="absolute"
          thickness="4px"
          emptyColor="gray.200"
          color="brand.500"
          size="xl"
          zIndex={2}
        />
      </Center>
    </Flex>
  );
};
