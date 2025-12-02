import React, { useEffect, useState } from 'react'
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
import PetTypePicker from './PetTypePicker'
import { useRouter } from 'next/router'

const breedFilters = {
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

// Breed filter options for dog breeds
const breedGroupFilters = {
  defaultValue: [],
  options: [
    { label: 'Toy Group', value: 'toy-group' },
    // pastoral, working, terrier, gun dog, hound,  hybrid
    { label: 'Pastoral Group', value: 'pastoral-group' },
    { label: 'Working Group', value: 'working-group' },
    { label: 'Terrier Group', value: 'terrier-group' },
    { label: 'Gun Dog Group', value: 'gun-dog-group' },
    { label: 'Hound Group', value: 'hound-group' },
    { label: 'Hybrid Group', value: 'hybrid-group' },

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

export const PetTypeFilterPopover = ({ onFilterChange }: { onFilterChange?: (filters: any) => void }) => {

  const state = useFilterState({
    defaultValue: '',
    onSubmit: (value) => {
      if (onFilterChange) {
        onFilterChange({ pet_type: value });
      }
    },
  });

  return (
    <Popover placement="bottom-start" colorScheme='brand'>
      <FilterPopoverButton label="Pet Type" selected={!!state.value} />
      <FilterPopoverContent
        isCancelDisabled={!state.canCancel}
        onClickApply={state.onSubmit}
        onClickCancel={state.onReset}
      >
        <PetTypePicker
          hideLabel
          value={state.value}
          onChange={state.onChange}
        />
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

      <FilterPopoverButton label="Breed Group" selected={state.value && state.value.length > 0} />
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
        />
      </FilterPopoverContent>
    </Popover>
  );
};

export const BreedFilterPopover = ({ onFilterChange }: { onFilterChange?: (filters: any) => void }) => {
  const state = useFilterState({
    defaultValue: [],
    onSubmit: (value) => {
      if (onFilterChange) {
        onFilterChange({ tab: 'listings', breeds: value });
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
          options={breedFilters.options}
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
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState(router.pathname);

  useEffect(() => {
    // console.log('Current path:', router.pathname);

    const {
      q: searchQuery,
      tab,
      sort,
      breed,
      featured,
      rescue,
      training,
      care,
      ...otherQueries
    } = router.query;

    setCurrentPath(tab as string || '');
  }, [router.query]);

  const breedFilterState = useFilterState({
    defaultValue: [],
    onSubmit: (value) => {
      if (onFilterChange) {
        onFilterChange({ breeds: value });
      }
    },
  });


  const breedGroupFilterState = useFilterState({
    defaultValue: [],
    onSubmit: (value) => {
      if (onFilterChange) {
        onFilterChange({ group: value });
      }
    },
  });

  const priceFilterState = useFilterState({
    defaultValue: priceFilter.defaultValue,
    onSubmit: (value) => {
      if (onFilterChange) {
        onFilterChange({ price_min: value[0], price_max: value[1] });
      }
    },
  });

  const sizeFilterState = useFilterState({
    defaultValue: '',
    onSubmit: (value) => {
      if (onFilterChange) {
        onFilterChange({ size: value });
      }
    },
  });

  return (
    <Box py="4">
      <Flex
        justify={{ base: 'center', md: 'space-between' }}
        align="center"
        display={{ base: 'none', md: 'flex' }}
      >
        <Stack
          spacing="6"
          direction={{ base: 'column', md: 'row' }}
          align="center"
        >
          <Text fontWeight="medium" fontSize="sm">
            Filter by
          </Text>


          <SimpleGrid
            display="inline-grid"
            spacing="4"
            columns={{ base: 1, md: 4 }}
          >
            <PetTypeFilterPopover
              onFilterChange={(f) => onFilterChange && onFilterChange(f)}
            />
            {currentPath.includes('breeds') && (
              <BreedGroupFilterPopover
                onFilterChange={(f) => onFilterChange(f)}
              />
            )}

            {currentPath.includes('listings') && (
              <BreedFilterPopover
                onFilterChange={(f) => onFilterChange(f)}
              />
            )}
            <LocationFilterPopover onFilterChange={(f) => onFilterChange(f)} />


            {currentPath.includes('listings') && <PriceFilterPopover onFilterChange={(f) => onFilterChange(f)} />}

            {currentPath.includes('breeds') && <SizeFilterPopover onFilterChange={(f) => onFilterChange(f)} />}
          </SimpleGrid>
        </Stack>

        <SortbySelect maxW="150px" />

      </Flex>


      <Stack display={{ base: 'flex', md: 'none' }}
      >
        <PetTypePicker onFilterChange={(f) => onFilterChange(f)} />

        <CheckboxFilter
          hideLabel
          value={breedGroupFilterState.value}
          onChange={(v: string[]) => breedGroupFilterState.onChange(v)}
          options={breedGroupFilters.options}
        />

        <CheckboxFilter
          hideLabel
          value={breedFilterState.value}
          onChange={(v: string[]) => breedFilterState.onChange(v)}
          options={breedFilters.options}
        />

        <Box px="2" pt="2">
          <PriceRangePicker
            step={1000}
            min={priceFilter.min}
            max={priceFilter.max}
            value={priceFilterState.value}
            onChange={priceFilterState.onChange}
          />
          <Box as="output" mt="2" fontSize="sm">
            {priceFilterState.value?.map((v: number) => formatPrice(v, { currency: 'KES' })).join(' — ')}
          </Box>
        </Box>


        <SizePicker
          hideLabel
          value={sizeFilterState.value}
          onChange={sizeFilterState.onChange}
          options={sizeFilter.options}
        />



      </Stack>
    </Box>

  )

} 
