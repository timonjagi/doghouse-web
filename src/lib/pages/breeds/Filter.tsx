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
  Stack,
  StackDivider,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
// import * as React from "react";
import { useState } from "react";
import { MdFilterList } from "react-icons/md";
// import { useRefinementList } from "react-instantsearch-hooks-web";

import { RefinementList } from "./RefinementList";
import { SortbySelect } from "./SortBySelect";

export const Filter = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
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
          fontSize="sm"
          type="button"
          px="3"
          py="1"
          onClick={onOpen}
          borderWidth="1px"
          rounded="md"
        >
          <Icon as={MdFilterList} />
          <Text>Filters</Text>
        </HStack>
        <SortbySelect
          width="120px"
          defaultValue="23"
          placeholder="Sort"
          size="sm"
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
        isFullHeight
        isOpen={isOpen}
        onClose={onClose}
        blockScrollOnMount={false}
        trapFocus={false}
      >
        <DrawerContent h="auto" maxH="70vh">
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
                items={[]}
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
