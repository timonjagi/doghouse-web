import { Icon, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react'
import * as React from 'react'
import { FiSearch, FiX } from 'react-icons/fi'

interface SearchInputProps {
  value?: string
  variant?: string
  colorScheme?: string
  iconColor?: string
  placeholder?: string
  searchQuery?: string
  onClear?: () => void
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  maxW?: any
}
export const SearchInput: React.FC<SearchInputProps> = (props) => {
  return (
    <InputGroup {...props}>
      <InputLeftElement>
        <Icon as={FiSearch} color={props.iconColor || "gray.500"} fontSize="lg" />
      </InputLeftElement>
      <Input
        focusBorderColor="brand.500"
        fontSize="sm"
        width="full"
        variant={props.variant || "filled"}
        type="text"
        placeholder={props.placeholder || "What are you looking for?"}
        autoComplete="off"
        {...props}
      />
      {props.searchQuery && <InputRightElement onClick={props.onClear} >
        <Icon as={FiX} color="gray.500" fontSize="lg" cursor="pointer" />
      </InputRightElement>}
    </InputGroup>
  )
}
