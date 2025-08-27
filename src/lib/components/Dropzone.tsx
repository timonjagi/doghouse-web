import {
  Button,
  Center,
  HStack,
  Icon,
  Square,
  Text,
  useColorModeValue,
  VStack,
  Image,
  Box,
  Flex,
  IconButton,
  Stack,
  SimpleGrid,
} from "@chakra-ui/react";
import { useRef } from "react";
// import React from "react";
import { FiUploadCloud } from "react-icons/fi";
import { BiImageAdd } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";

export const Dropzone = ({ selectedFiles, onChange, onRemove, maxUploads }) => {
  const selectedFileRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {selectedFiles.length ? (
        <Flex>
          <Flex
            w="full"
            alignContent="center"
            flexWrap="wrap"
            px="4"
            py="4"
            bg={useColorModeValue("white", "gray.800")}
            boxSizing="content-box"
          >
            <SimpleGrid columns={{ base: 2 }} gap="4" w="full">
              {selectedFiles.map((selectedFile) => (
                <Box h="full" w="full" position="relative">
                  <Image
                    width="100%"
                    height="100%"
                    borderRadius="lg"
                    objectFit="cover"
                    src={selectedFile}
                    alt={selectedFile.name}
                    bg="bg-subtle"
                  />
                  <IconButton
                    position="absolute"
                    aria-label="remove-image"
                    icon={<IoMdClose />}
                    variant="outline"
                    height="28px"
                    left="40%"
                    top="40%"
                    onClick={() => onRemove(selectedFile)}
                  ></IconButton>
                </Box>
              ))}
              {selectedFiles.length !== maxUploads && (
                <Box>
                  <Square
                    as={Button}
                    w="full"
                    h="full"
                    bg="bg-subtle"
                    borderRadius="lg"
                    onClick={() => selectedFileRef.current?.click()}
                  >
                    <Icon as={BiImageAdd} boxSize="8" color="muted" />
                  </Square>
                </Box>
              )}
            </SimpleGrid>
          </Flex>
        </Flex>
      ) : (
        <Center
          width="full"
          borderWidth="1px"
          borderRadius="lg"
          px="6"
          py="4"
          bg={useColorModeValue("white", "gray.800")}
        >
          <Stack spacing="3">
            <Square size="10" bg="bg-subtle" borderRadius="lg">
              <Icon as={FiUploadCloud} boxSize="5" color="muted" />
            </Square>
            <Stack spacing="1">
              <HStack spacing="1" whiteSpace="nowrap">
                <Button
                  variant="link"
                  colorScheme="brand"
                  size="sm"
                  onClick={() => selectedFileRef.current?.click()}
                >
                  Click to upload
                </Button>
                {/* <Text fontSize="sm" color="muted">
                or drag and drop
              </Text> */}
              </HStack>
              <Text fontSize="xs" color="muted">
                PNG, JPG or GIF up to 2MB
              </Text>
            </Stack>
          </Stack>
        </Center>
      )}

      <input
        ref={selectedFileRef}
        type="file"
        accept="image/jpeg, image/png, image/webp"
        hidden
        multiple
        onChange={onChange}
      ></input>
    </>
  );
};
