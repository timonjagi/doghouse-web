import { Icon, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import * as React from 'react'
import { FiSearch } from 'react-icons/fi'

export const SearchInput = (props) => {
  return (
    <InputGroup>
      <InputLeftElement>
        <Icon as={FiSearch} color="gray.500" fontSize="lg" />
      </InputLeftElement>
      <Input
        focusBorderColor="blue.500"
        width="full"
        fontSize="sm"
        variant="filled"
        type="text"
        placeholder="What are you looking for?"
        autoComplete="off"
        {...props}
      />
    </InputGroup>
  )
}
