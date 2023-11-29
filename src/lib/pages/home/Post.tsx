import {
  Stack,
  HStack,
  Avatar,
  AvatarBadge,
  Box,
  Text,
  useColorModeValue,
  Button,
  Divider,
  Flex,
  Icon,
  Spacer,
  useBreakpointValue,
} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { FiHeart, FiMapPin, FiMoreVertical, FiTrash2 } from "react-icons/fi";

type PostProps = {
  post: any;
  userProfile: any;
};

const Post: React.FC<PostProps> = ({ post, userProfile }) => {
  const isMobile = useBreakpointValue({
    base: true,
    sm: false,
  });

  function getHighlightedText(text, highlight) {
    // Split text on highlight term, include term itself into parts, ignore case
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part) =>
          part.toLowerCase() === highlight?.toLowerCase() ? (
            <b>
              <a style={{ color: "#AC8A65" }} href={`/breeds/${post.petBreed}`}>
                {part}
              </a>
            </b>
          ) : (
            part
          )
        )}
      </span>
    );
  }

  return (
    <Box
      bg="bg-surface"
      boxShadow={useColorModeValue("sm", "sm-dark")}
      borderRadius="lg"
    >
      <Stack key={post.id} fontSize="sm" p="4" spacing="4">
        <Stack direction="row" justify="space-between" spacing="2">
          <HStack spacing="3">
            <Avatar src={userProfile?.profilePhotoUrl} boxSize="10">
              <AvatarBadge boxSize="4" bg="postive" />
            </Avatar>
            <Box>
              <Text fontWeight="medium" color="emphasized">
                {post.userName}
              </Text>
              <Text color="muted">
                {post.userId ? "" : post.ownerId ? "Pet Owner" : "Pet Seeker"}
              </Text>
            </Box>
          </HStack>
          <Text color="muted">{moment(post.createdAt).fromNow()}</Text>
        </Stack>
        <Text
          color="muted"
          sx={{
            "-webkit-box-orient": "vertical",
            "-webkit-line-clamp": "2",
            overflow: "hidden",
            display: "-webkit-box",
          }}
        >
          {getHighlightedText(post.description, post.petBreed)}
        </Text>

        <Divider />

        <Flex direction="row-reverse">
          {[post.userId, post.ownerId, post.seekerId].includes(
            userProfile.id
          ) && (
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              colorScheme="danger"
              mx="2"
            >
              <FiTrash2 />
              {!isMobile && "Delete"}
            </Button>
          )}
          <Button type="submit" size="sm" variant="primary">
            Make Offer
          </Button>
          <Button type="submit" size="sm" variant="outline" mx="2">
            <FiHeart /> {isMobile ? "" : "Like"}
          </Button>
          <Spacer />
          <HStack>
            <Icon as={FiMapPin} color="subtle" />
            <Text color="subtle">{userProfile.location}</Text>
          </HStack>
        </Flex>
      </Stack>
    </Box>
  );
};
export default Post;
