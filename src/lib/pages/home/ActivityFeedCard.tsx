import {
  Stack,
  Text,
  Box,
  StackDivider,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import React from "react";
import Post from "./Post";
import { FiSearch } from "react-icons/fi";

type ActivityCardProps = {
  activity: any;
  userProfile: any;
  isDesktop: any;
  onViewPost: any;
  onOpen: any;
};

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  userProfile,
  isDesktop,
  onViewPost,
  onOpen,
}) => {
  return (
    <Box py="4" bg="bg-surface" borderRadius="md" w="full">
      <Stack
        divider={<StackDivider />}
        spacing="1"
        flexShrink={0}
        px="4"
        pt="2"
        pb="4"
      >
        <>
          <HStack justify="space-between">
            <Box pb="4">
              <Text fontSize="lg" fontWeight="medium">
                Activity feed
              </Text>
              <Text color="muted" fontSize="sm">
                All updates show up here
              </Text>
            </Box>

            <IconButton icon={<FiSearch />} aria-label="Search activity" />
          </HStack>
        </>
        <></>
      </Stack>

      <Stack spacing="4">
        {activity.map((act) => (
          <Post
            post={act}
            userProfile={userProfile}
            onViewPost={() => (isDesktop ? onViewPost(act) : onOpen)}
          />
        ))}
      </Stack>
    </Box>
  );
};
export default ActivityCard;
