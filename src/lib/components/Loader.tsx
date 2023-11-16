import { Center, Flex, Spinner } from "@chakra-ui/react";

export const Loader = () => {
  return (
    <Flex h="100%" w="full" align="center" justify="center">
      <Center>
        <Spinner size="lg" />
      </Center>
    </Flex>
  );
};
