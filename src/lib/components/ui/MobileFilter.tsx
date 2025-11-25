import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react'
import * as React from 'react'
import { MdFilterList } from 'react-icons/md'
import { SortbySelect } from './SortBySelect'

interface MobileFilterProps {
  onToggle: () => void
}
export const MobileFilter: React.FC<MobileFilterProps> = ({ onToggle }) => {
  return (
    <Flex width="full" justify="space-between" display={{ base: 'flex', md: 'none' }} py="4">
      <HStack
        as="button"
        fontSize="sm"
        type="button"
        px="3"
        py="1"
        borderWidth="1px"
        rounded="md"
        _hover={{ bg: 'gray.50' }}
        onClick={onToggle}
      >
        <Icon as={MdFilterList} />
        <Text>Filters</Text>
      </HStack>

      <SortbySelect maxW="140px" />

    </Flex>
  )
}
