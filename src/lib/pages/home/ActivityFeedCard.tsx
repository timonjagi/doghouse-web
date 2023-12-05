import {
  Stack,
  Text,
  Box,
  StackDivider,
  IconButton,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import React from "react";
import Post from "./Activity";
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
    <Box
      py="4"
      bg="bg-surface"
      borderRadius="md"
      w="full"
      h="lg"
      overflow="scroll"
    >
      <Stack
        divider={<StackDivider />}
        spacing="1"
        flexShrink={0}
        pt="2"
        pb="4"
        position="sticky"
        top="0"
        zIndex="4"
      >
        <>
          <HStack justify="space-between" px="6">
            <Box pb="4">
              <Text fontSize="lg" fontWeight="medium">
                Activity feed
              </Text>
              <Text color="muted" fontSize="sm">
                All updates show up here
              </Text>
            </Box>

            {/* {isDesktop && (
              <InputGroup maxW={{ sm: "xs" }}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="muted" boxSize="5" />
                </InputLeftElement>
                <Input placeholder="Search" />
              </InputGroup>
            )} */}

            <IconButton icon={<FiSearch />} aria-label="Search activity" />
          </HStack>
        </>
        <></>
      </Stack>

      <Stack spacing="4" zIndex="1">
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
