import {
  useColorModeValue,
  Card,
  Stack,
  Icon,
  Flex,
  Heading,
  HStack,
  Wrap,
  Tag,
  Text,
  Box,
  Square,
  Image,
  Button,
  useDisclosure,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Avatar,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaArrowLeft, FaRegCalendarTimes, FaTransgender } from "react-icons/fa";
import { FiCalendar, FiEdit, FiTrash2 } from "react-icons/fi";
import { PiGenderIntersexBold } from "react-icons/pi";
import { RiHealthBookLine } from "react-icons/ri";
import PetProfileEdit from "./PetProfileEdit";
import { IoMdClose } from "react-icons/io";

type PetDetailProps = {
  pet: any;
};

export const PetDetail: React.FC<PetDetailProps> = ({ pet }) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const onDeleteImage = (image) => {};

  return (
    <Box as="section" bg={useColorModeValue("gray.100", "gray.800")}>
      <Card p="8">
        <HStack justify="space-between">
          <HStack as={Link} href="/account/pets">
            <Icon as={FaArrowLeft} color="subtle" fontSize="12px" />
            <Text fontWeight="medium" fontSize="sm" color="subtle">
              Back to Pets
            </Text>
          </HStack>

          <Box>
            <IconButton
              icon={<FiEdit />}
              aria-label="Edit Pet Profile"
              type="submit"
              variant="ghost"
              onClick={onToggle}
            ></IconButton>
            <IconButton
              icon={<FiTrash2 />}
              aria-label="Delete Pet Profile"
              type="submit"
              variant="ghost"
              colorScheme="danger"
              mx="2"
            ></IconButton>
          </Box>
        </HStack>

        <Stack spacing={{ base: "4", md: "8" }}>
          <Stack width="full">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading
                size="md"
                fontWeight="extrabold"
                letterSpacing="tight"
                marginEnd="6"
                textTransform="capitalize"
              >
                {pet.breed}
              </Heading>
            </Flex>

            {/* <Text mt="1" fontWeight="medium" textTransform="capitalize">
              {pet.breedGroup} Group
            </Text> */}

            <Stack spacing="1" mt="2">
              <HStack spacing="3">
                <Icon fontSize="xl" as={FaTransgender} color="subtle" />
                <Text textTransform="capitalize" fontSize="sm">
                  {pet.sex}
                </Text>
              </HStack>

              <HStack spacing="3">
                <Icon fontSize="xl" as={FaRegCalendarTimes} color="subtle" />
                <Text textTransform="capitalize" fontSize="sm">
                  {pet.age}
                </Text>
              </HStack>
            </Stack>

            <Text fontWeight="semibold" mt="8" mb="2">
              Vaccinations
            </Text>
            <Wrap shouldWrapChildren>
              <Tag>Parvo</Tag>
              <Tag>Distemper</Tag>
              <Tag>Rabies</Tag>
              <Tag>Leptovirus</Tag>
            </Wrap>

            <Text fontWeight="semibold" mt="8" mb="2">
              Photos
            </Text>

            {pet.images && pet.images.length ? (
              <>
                {pet.images.map((image) => {
                  <Box p="2">
                    <Square size={{ base: "24", lg: "32" }}>
                      <Image
                        width="100%"
                        height="100%"
                        borderRadius="lg"
                        objectFit="cover"
                        src={image}
                        alt={image}
                        bg="bg-subtle"
                      />
                      <IconButton
                        position="absolute"
                        aria-label="remove-image"
                        icon={<IoMdClose />}
                        variant="outline"
                        height="28px"
                        onClick={() => onDeleteImage(image)}
                      ></IconButton>
                    </Square>
                  </Box>;
                })}
              </>
            ) : (
              <Text color="muted" fontSize="sm">
                No photos uploaded
              </Text>
            )}
          </Stack>
        </Stack>

        <Flex direction="row-reverse" py="4"></Flex>
      </Card>

      <Modal onClose={onClose} isOpen={isOpen} size={{ base: "sm", sm: "md" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <PetProfileEdit pet={pet} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
