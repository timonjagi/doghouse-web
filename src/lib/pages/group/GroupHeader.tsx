import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";
import { FaReddit } from "react-icons/fa";
import { Group } from "../../../atoms/groupsAtom";
import useGroupData from "../../../hooks/useGroupData";

type HeaderProps = {
  groupData: Group;
};

const Header: React.FC<HeaderProps> = ({ groupData }) => {
  const { groupStateValue, onJoinOrLeaveGroup, loading } = useGroupData();

  const isJoined = !!groupStateValue.userGroups.find(
    (group) => group.groupId === groupData.id
  );

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="brand.600" />
      <Flex justify="center" bg="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          <Icon
            as={Image}
            src="/images/logo_white.png"
            boxSize={16}
            p={1}
            bg="brand.500"
            fontSize={64}
            position="relative"
            top={-3}
            color="blue.500"
            border="4px solid white"
            borderRadius="50%"
          />

          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={600} fontSize="16pt">
                {groupData.name} Group
              </Text>
              <Text fontWeight={600} fontSize="10pt" color="gray.400">
                {groupData.shortDesc}
              </Text>
            </Flex>

            <Button
              variant={isJoined ? "outline" : "solid"}
              height="30px"
              pr={6}
              pl={6}
              onClick={() => onJoinOrLeaveGroup(groupData, isJoined)}
              isLoading={loading}
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Header;
