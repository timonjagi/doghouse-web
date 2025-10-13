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
  Button,
} from "@chakra-ui/react";
import React from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import ActivityCard from "./ActivityCard";

type ActivityCardProps = {
  activities: any;
  userProfile: any;
  isDesktop: any;
  onViewPost: any;
};

const ActivityFeedCard: React.FC<ActivityCardProps> = ({
  activities,
  onViewPost,
}) => {
  return (
    <Box bg="bg-surface" borderRadius="md" w="full" h="90vh" overflow="scroll">
      <Stack
        divider={<StackDivider />}
        spacing="1"
        flexShrink={0}
        pt="4"
        position="sticky"
        top="0"
        zIndex="4"
        bg="white"
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

            <Box>
              <Button variant="secondary" rightIcon={<FiPlus />} mx="2">
                New
              </Button>
              <IconButton icon={<FiSearch />} aria-label="Search activity" />
            </Box>
          </HStack>
        </>
        <></>
      </Stack>

      <Stack spacing="4" zIndex="1">
        {activities.map((activity) => (
          <ActivityCard
            post={activity}
            onViewPost={() => onViewPost(activity)}
          />
        ))}
      </Stack>
    </Box>
  );
};
export default ActivityFeedCard;
