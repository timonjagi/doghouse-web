import {
  Box,
  Container,
  Stack,
  Image,
  Heading,
  Card,
  AspectRatio,
  Text,
} from "@chakra-ui/react";
import { Group } from "atoms/groupsAtom";
import React from "react";

type GroupSidebarProps = {
  groupData: Group;
};

const GroupSidebar: React.FC<GroupSidebarProps> = ({ groupData }) => {
  console.log(groupData);
  return (
    <Container w="full">
      <Card p="4">
        <Stack>
          <Image src={`/${groupData.imageUrl}`} w="100%"></Image>

          <Text color="gray.900">{groupData.longDesc}</Text>
        </Stack>
      </Card>
    </Container>
  );
};
export default GroupSidebar;
