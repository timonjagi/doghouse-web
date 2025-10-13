import {
  Box,
  Button,
  CloseButton,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Flex,
  HStack,
  Icon,
<<<<<<< HEAD
  Stack,
  StackDivider,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
// import * as React from "react";
import { useState } from "react";
import { MdFilterList } from "react-icons/md";
// import { useRefinementList } from "react-instantsearch-hooks-web";
=======
  IconButton,
  Stack,
  StackDivider,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
// import * as React from "react";
import { useEffect, useState } from "react";
import { MdFilterList } from "react-icons/md";
import { useRefinementList } from "react-instantsearch-hooks-web";
>>>>>>> parent of b0357f4 (feat(components): Remove app features)

import { RefinementList } from "./RefinementList";
import { SortbySelect } from "./SortBySelect";

export const Filter = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
<<<<<<< HEAD
  // const { items, refine } = useRefinementList({
  //   attribute: "breedGroup",
  //   sortBy: ["name:asc"],
  // });

  const [, setSelectedBreedGroups] = useState([]);

  // useEffect(() => {
  //   if (selectedBreedGroups) {
  //     // console.log(selectedBreedGroups.join(","));
  //     refine(selectedBreedGroups.join(" "));
  //   }
  // }, [selectedBreedGroups, setSelectedBreedGroups, refine]);

  return (
    <>
      <Flex
        width="full"
        justify="space-between"
        display={{ base: "flex", md: "none" }}
      >
        <HStack
          as="button"
=======
  const { items, refine } = useRefinementList({
    attribute: "breedGroup",
    sortBy: ["name:asc"],
  });

  const [selectedBreedGroups, setSelectedBreedGroups] = useState([]);

  useEffect(() => {
    if (selectedBreedGroups) {
      // console.log(selectedBreedGroups.join(","));
      refine(selectedBreedGroups.join(" "));
    }
  }, [selectedBreedGroups, setSelectedBreedGroups, refine]);

  return (
    <>
      <Flex width="auto" justify="space-between">
        <IconButton
          icon={<MdFilterList />}
          aria-label="Filter breeds"
>>>>>>> parent of b0357f4 (feat(components): Remove app features)
          fontSize="sm"
          type="button"
          px="3"
          py="1"
          onClick={onOpen}
          borderWidth="1px"
          rounded="md"
        >
          <Icon as={MdFilterList} />
<<<<<<< HEAD
          <Text>Filters</Text>
        </HStack>
        <SortbySelect
=======
          {/* <Text>Filters</Text> */}
        </IconButton>
        {/* <SortbySelect
>>>>>>> parent of b0357f4 (feat(components): Remove app features)
          width="120px"
          defaultValue="23"
          placeholder="Sort"
          size="sm"
<<<<<<< HEAD
        />
      </Flex>

      <Box display={{ base: "none", md: "flex" }}>
        <RefinementList
          items={[]}
          label="Filter"
          spacing={4}
          setSelectedBreedGroups={setSelectedBreedGroups}
        />
      </Box>
      <Drawer
        placement="bottom"
=======
        /> */}
      </Flex>

      <Drawer
        placement={useBreakpointValue({ base: "bottom", md: "start" })}
>>>>>>> parent of b0357f4 (feat(components): Remove app features)
        isFullHeight
        isOpen={isOpen}
        onClose={onClose}
        blockScrollOnMount={false}
        trapFocus={false}
      >
<<<<<<< HEAD
        <DrawerContent h="auto" maxH="70vh">
=======
        <DrawerContent h={{ base: "auto", md: "full" }}>
>>>>>>> parent of b0357f4 (feat(components): Remove app features)
          <DrawerHeader px="4" borderBottomWidth="1px">
            <Flex justify="space-between" align="center">
              <CloseButton onClick={onClose} />
              <Text fontWeight="semibold" fontSize="md">
                Filter by
              </Text>
              <HStack spacing="4">
                <Button
                  as="button"
                  textDecor="underline"
                  fontSize="sm"
                  onClick={() => {}}
                  color="on-accent-subtle"
                >
                  Clear
                </Button>
              </HStack>
            </Flex>
          </DrawerHeader>
          <DrawerBody padding="6">
            <Stack spacing="6" divider={<StackDivider />}>
              <RefinementList
<<<<<<< HEAD
                items={[]}
=======
                items={items}
>>>>>>> parent of b0357f4 (feat(components): Remove app features)
                setSelectedBreedGroups={setSelectedBreedGroups}
              />
            </Stack>
          </DrawerBody>
          <DrawerFooter px="4" borderTopWidth="1px">
            <Button
              width="full"
              size="lg"
              fontSize="md"
              color="on-accent-subtle"
              onClick={() => {
                onClose();
              }}
            >
              Show results
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
