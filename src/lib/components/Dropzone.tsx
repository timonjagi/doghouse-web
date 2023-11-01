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
            {selectedFiles.map((selectedFile) => (
              <Box p="2">
                <Square size={{ base: "24", lg: "32" }}>
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
                    onClick={() => onRemove(selectedFile)}
                  ></IconButton>
                </Square>
              </Box>
            ))}

            {selectedFiles.length !== maxUploads && (
              <Box p="2">
                <Square
                  as={Button}
                  size={{ base: "24", lg: "32" }}
                  bg="bg-subtle"
                  borderRadius="lg"
                  onClick={() => selectedFileRef.current?.click()}
                >
                  <Icon as={BiImageAdd} boxSize="8" color="muted" />
                </Square>
              </Box>
            )}
          </Flex>
        </Flex>
      ) : (
        <Center
          borderWidth="1px"
          borderRadius="lg"
          px="6"
          py="4"
          bg={useColorModeValue("white", "gray.800")}
        >
          <VStack spacing="3">
            <Square size="10" bg="bg-subtle" borderRadius="lg">
              <Icon as={FiUploadCloud} boxSize="5" color="muted" />
            </Square>
            <VStack spacing="1">
              <HStack spacing="1" whiteSpace="nowrap">
                <Button
                  variant="link"
                  colorScheme="blue"
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
            </VStack>
          </VStack>
        </Center>
      )}

      <input
        ref={selectedFileRef}
        type="file"
        accept="image/jpeg, image/png"
        hidden
        onChange={onChange}
      ></input>
    </>
  );
};
