import { Select, useColorModeValue } from '@chakra-ui/react'
import * as React from 'react'

export const CurrencySelect = () => (
  <Select
    border="0"
    color={useColorModeValue('gray.600', 'gray.300')}
    focusBorderColor={useColorModeValue('brand.500', 'brand.200')}
    fontWeight="medium"
    fontSize="sm"
    aria-label="Select Currency"
  >
    <option value="KES">KES</option>
    <option value="UGSH">TZSH</option>
    <option value="TSH">UGSH</option>
  </Select>
)
