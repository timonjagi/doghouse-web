import { Select, SelectProps, useColorModeValue } from '@chakra-ui/react'
import * as React from 'react'

const sortByOptions = {
  defaultValue: 'relevance',
  options: [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Price: Low to High', value: 'price-low-high' },
    { label: 'Price: High to Low', value: 'price-high-low' },
    { label: 'Newest First', value: 'newest' },
    { label: 'Rating', value: 'rating' },
  ],
}

export const SortbySelect = (props: SelectProps) => (
  <Select
    size="sm"
    aria-label="Sort by"
    defaultValue={sortByOptions.defaultValue}
    focusBorderColor={useColorModeValue('blue.500', 'blue.200')}
    rounded="md"
    {...props}
  >
    {sortByOptions.options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </Select>
)
