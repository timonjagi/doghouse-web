import {
  Box,
  Button,
  Divider,
  Flex,
  Spacer,
  Text,
  Stack,
  useBreakpointValue,
  Avatar,
  AvatarBadge,
  HStack,
  Icon,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { FiCalendar, FiImage, FiMapPin, FiTrash2 } from "react-icons/fi";
import { IoLocationOutline, IoImagesOutline } from "react-icons/io5";
import { PiDog, PiGenderIntersex } from "react-icons/pi";

type PostDetailsProps = {
  selectedPost: any;
  userProfile: any;
};

const PostDetails: React.FC<PostDetailsProps> = ({
  selectedPost,
  userProfile,
}) => {
  const ownPost = [
    selectedPost.userId,
    selectedPost.ownerId,
    selectedPost.seekerId,
  ].includes(userProfile.userId);

  const isMobile = useBreakpointValue({
    base: true,
    sm: false,
  });

  return (
    <Box
      as="section"
      pb={{ base: "12", md: "24" }}
      bg="bg-surface"
      mx="4"
      w="full"
    >
      <Stack p="4">
        <HStack>
          <Text textTransform="capitalize" fontSize="lg" fontWeight="medium">
            {selectedPost.petBreed}
          </Text>

          <Spacer />

          <Stack>
            <Text size="sm">
              {selectedPost.title === "Pet added" ? "Listing" : "Request"}
            </Text>
          </Stack>
        </HStack>

        <Divider />
        <Stack
          w="100%"
          p="4"
          spacing="4"
          bg={useColorModeValue("gray.50", "gray.700")}
        >
          <HStack>
            <Stack>
              <HStack spacing="3">
                <Icon fontSize="xl" as={PiGenderIntersex} />
                <Text textTransform="capitalize" fontSize="sm">
                  {selectedPost.petSex}
                </Text>
              </HStack>

              <HStack spacing="3">
                <Icon fontSize="xl" as={FiCalendar} />
                <Text textTransform="capitalize" fontSize="sm">
                  {selectedPost.petAge}
                </Text>
              </HStack>

              <HStack spacing="3">
                <Icon fontSize="xl" as={FiImage} />
                <Text textTransform="capitalize" fontSize="sm">
                  {selectedPost.images?.length} photo
                  {selectedPost.images?.length > 1 ? "s" : ""}{" "}
                </Text>
              </HStack>
            </Stack>
          </HStack>
        </Stack>

        <Spacer />

        <Stack direction="row" justify="space-between" spacing="2">
          <HStack spacing="3">
            <Avatar src={selectedPost.userProfilePhotoUrl} boxSize="10">
              <AvatarBadge boxSize="4" bg="postive" />
            </Avatar>
            <Box>
              <Text fontWeight="medium" color="emphasized">
                {selectedPost.userName}
              </Text>
              <HStack>
                <Icon as={FiMapPin} color="subtle" />
                <Text color="subtle">{selectedPost.userLocation}</Text>
              </HStack>
            </Box>
          </HStack>
          <Text color="muted">{moment(selectedPost.createdAt).fromNow()}</Text>
        </Stack>
        <Divider />
        <Flex direction="row-reverse">
          {ownPost && (
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              colorScheme="danger"
            >
              <FiTrash2 />
              {!isMobile && <Text ml="2">Delete</Text>}
            </Button>
          )}

          <Spacer />

          {!ownPost && (
            <Button type="submit" size="sm" variant="primary">
              Make Offer
            </Button>
          )}
        </Flex>
      </Stack>
    </Box>
  );
};
export default PostDetails;
