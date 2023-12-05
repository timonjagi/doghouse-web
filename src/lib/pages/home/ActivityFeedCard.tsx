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
import { FiArrowRight, FiPlus, FiSearch } from "react-icons/fi";

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
  const onAddNew = () => {};
  return (
    <Box
      py="4"
      bg="bg-surface"
      borderRadius="md"
      w={{ base: "full", lg: "sm" }}
    >
      <Stack
        divider={<StackDivider />}
        spacing="1"
        flexShrink={0}
        px="4"
        pt="2"
        pb="4"
        position="sticky"
        top="0"
        zIndex="1"
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

            {/* {isDesktop && (
              <InputGroup maxW={{ sm: "xs" }}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="muted" boxSize="5" />
                </InputLeftElement>
                <Input placeholder="Search" />
              </InputGroup>
            )} */}

            <Box as={HStack} onClick={onAddNew}>
              <Button rightIcon={<FiPlus />} variant="secondary">
                New
              </Button>
              <IconButton icon={<FiSearch />} aria-label="Search activity" />
            </Box>
          </HStack>
        </>
        <></>
      </Stack>

      <Stack spacing="4" zIndex="2">
        {activity.map((act) => (
          <ActivityCard
            activity={activity}
            userProfile={userProfile}
            isDesktop={isDesktop}
            onViewPost={onViewPost}
            onOpen={onOpen}
          />
        ))}
      </Stack>
    </Box>
  );
};
export default ActivityCard;
