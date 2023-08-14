import { HStack, Icon, Stack, Text, useColorModeValue } from "@chakra-ui/react";
// import * as React from "react";
// eslint-disable-next-line
import { HiCalendar, HiLink, HiLocationMarker } from "react-icons/hi";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserInfo = (props: any) => {
  // eslint-disable-next-line
  const { location, website, memberSince, ...stackProps } = props;
  return (
    <Stack
      direction={{
        base: "column",
        sm: "row",
      }}
      spacing={{
        base: "1",
        sm: "6",
      }}
      mt="4"
      fontSize="sm"
      fontWeight="medium"
      color={useColorModeValue("brand.600", "brand.300")}
      {...stackProps}
    >
      <HStack>
        <Icon as={HiLocationMarker} />
        <Text>{location}</Text>
      </HStack>
      {/* <HStack>
        <Icon as={HiLink} />
        <Text>{website}</Text>
      </HStack> */}
      <HStack>
        <Icon as={HiCalendar} />
        <Text>{memberSince}</Text>
      </HStack>
    </Stack>
  );
};
