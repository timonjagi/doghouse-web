import React from 'react'
import { Popover, Box, Flex, HStack, SimpleGrid, Text, useColorMode as mode, Stack } from '@chakra-ui/react'
import { CheckboxFilter } from './CheckboxFilter'
// import { ColorPicker } from './ColorPicker'
import { PriceRangePicker } from './PriceRangePicker'
import { formatPrice } from './PriceTag'
import { SizePicker } from './SizePicker'
import { FilterPopoverButton, FilterPopoverContent } from './FilterPopover'
import { useFilterState } from './useFilterState'
import { MobileFilter } from './MobileFilter'
import { SortbySelect } from './SortBySelect'

// Breed filter options for dog breeds
const breedGroupFilters = {
  defaultValue: [],
  options: [
    { label: '', value: 'golden-retriever', count: 25 },
    { label: 'Labrador Retriever', value: 'labrador-retriever', count: 30 },
    { label: 'German Shepherd', value: 'german-shepherd', count: 15 },
    { label: 'Bulldog', value: 'bulldog', count: 12 },
    { label: 'Poodle', value: 'poodle', count: 18 },
    { label: 'Beagle', value: 'beagle', count: 10 },
  ],
}

// Size filter options for dogs
const sizeFilter = {
  defaultValue: '',
  options: [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
    { label: 'Extra Large', value: 'extra-large' },
  ],
}

// Price filter for dog listings
const priceFilter = {
  formatOptions: {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  },
  defaultValue: [5000, 100000],
  min: 1000,
  max: 500000,
}

export const SizeFilterPopover = ({ onFilterChange }: { onFilterChange?: (filters: any) => void }) => {
  const state = useFilterState({
    defaultValue: '',
    onSubmit: (value) => {
      if (onFilterChange) {
        onFilterChange({ size: value });
      }
    },
  });

  return (
    <Popover placement="bottom-start">
      <FilterPopoverButton label="Size" selected={!!state.value} />
      <FilterPopoverContent
        isCancelDisabled={!state.canCancel}
        onClickApply={state.onSubmit}
        onClickCancel={state.onReset}
      >
        <Box px="2" pt="2">
          <SizePicker
            hideLabel
            value={state.value}
            onChange={state.onChange}
            options={sizeFilter.options}
          />
        </Box>
      </FilterPopoverContent>
    </Popover>
  );
};

export const PriceFilterPopover = ({ onFilterChange }: { onFilterChange?: (filters: any) => void }) => {
  const state = useFilterState({
    defaultValue: priceFilter.defaultValue,
    onSubmit: (value) => {
      if (onFilterChange) {
        onFilterChange({ price_min: value[0], price_max: value[1] });
      }
    },
  });

  return (
    <Popover placement="bottom-start">
      <FilterPopoverButton label="Price" selected={state.value && state.value.length === 2} />
      <FilterPopoverContent
        isCancelDisabled={!state.canCancel}
        onClickApply={state.onSubmit}
        onClickCancel={state.onReset}
      >
        <Box px="2" pt="2">
          <PriceRangePicker
            step={1000}
            min={priceFilter.min}
            max={priceFilter.max}
            value={state.value}
            onChange={state.onChange}
          />
          <Box as="output" mt="2" fontSize="sm">
            {state.value?.map((v: number) => formatPrice(v, { currency: 'KES' })).join(' — ')}
          </Box>
        </Box>
      </FilterPopoverContent>
    </Popover>
  );
};

export const BreedGroupFilterPopover = ({ onFilterChange }: { onFilterChange?: (filters: any) => void }) => {
  const state = useFilterState({
    defaultValue: [],
    onSubmit: (value) => {
      if (onFilterChange) {
        onFilterChange({ breeds: value });
      }
    },
  });

  return (
    <Popover placement="bottom-start">
      <FilterPopoverButton label="Breed" selected={state.value && state.value.length > 0} />
      <FilterPopoverContent
        isCancelDisabled={!state.canCancel}
        onClickApply={state.onSubmit}
        onClickCancel={state.onReset}
      >
        <CheckboxFilter
          hideLabel
          value={state.value}
          onChange={(v: string[]) => state.onChange(v)}
          options={breedGroupFilters.options}
          showSearch
        />
      </FilterPopoverContent>
    </Popover>
  );
};

export const LocationFilterPopover = ({ onFilterChange }: { onFilterChange?: (filters: any) => void }) => {
  const state = useFilterState({
    defaultValue: '',
    onSubmit: (value) => {
      if (onFilterChange) {
        onFilterChange({ location: value });
      }
    },
  });

  return (
    <Popover placement="bottom-start">
      <FilterPopoverButton label="Location" selected={!!state.value} />
      <FilterPopoverContent
        isCancelDisabled={!state.canCancel}
        onClickApply={state.onSubmit}
        onClickCancel={state.onReset}
      >
        <Box px="2" pt="2">
          <Box fontWeight="semibold" mb="2">
            Location
          </Box>
          <Box>
            <input
              type="text"
              placeholder="e.g., Nairobi, Kenya"
              value={state.value}
              onChange={(e) => state.onChange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #E2E8F0',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </Box>
        </Box>
      </FilterPopoverContent>
    </Popover>
  );
};

// Alias for backward compatibility and clarity
export const CheckboxFilterPopover = BreedGroupFilterPopover;

export const Filter: React.FC<{ onFilterChange: (filters: any) => void }> = ({ onFilterChange }) => {
  return (
    <Box py="4">
      <Flex
        justify={{ base: 'center', md: 'space-between' }}
        align="center"
        display={{ base: 'none', md: 'flex' }}
      >
        <Stack spacing="6" direction={{ base: 'column', md: 'row' }} align="center"
        >
          <Text fontWeight="medium" fontSize="sm">
            Filter by
          </Text>
          <SimpleGrid
            display="inline-grid"
            spacing="4"
            columns={{ base: 1, md: 4 }}
          >
            <BreedGroupFilterPopover onFilterChange={(f) => onFilterChange(f)} />
            <SizeFilterPopover onFilterChange={(f) => onFilterChange(f)} />
            <PriceFilterPopover onFilterChange={(f) => onFilterChange(f)} />

            <LocationFilterPopover onFilterChange={(f) => onFilterChange(f)} />
          </SimpleGrid>
        </Stack>

        <SortbySelect maxW="200px" />

      </Flex>


    </Box>

  )

} 
