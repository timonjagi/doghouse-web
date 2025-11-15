import { calc, Center, Flex, Spinner } from "@chakra-ui/react";

export const Loader = () => {
  return (
    <Flex
      h={{ base: 'calc(100dvh - 128px)', md: 'calc(100vh - 104px)' }}
      w="full"
      align="center"
      justify="center">
      <Center>
        <Spinner
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
