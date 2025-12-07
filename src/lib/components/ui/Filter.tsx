import React, { useEffect, useMemo, useState } from 'react'
import { Popover, Box, Flex, HStack, SimpleGrid, Text, Stack, FormLabel, Button, Select } from '@chakra-ui/react'
import { CheckboxFilter } from './CheckboxFilter'
// import { ColorPicker } from './ColorPicker'
import { PriceRangePicker } from './PriceRangePicker'
import { formatPrice } from './PriceTag'
import { SizePicker } from './SizePicker'
import { FilterPopoverButton, FilterPopoverContent } from './FilterPopover'
import { useFilterState } from './useFilterState'
import PetTypePicker from './PetTypePicker'
import { useRouter } from 'next/router'
import * as searchService from 'lib/services/searchService'

const petTypeFilters = {
  defaultValue: 'dog',
  options: [
    { label: 'Dog', value: 'dog' },
    { label: 'Cat', value: 'cat' },
    { label: 'Rodent', value: 'rodent' },
    { label: 'Fish', value: 'fish' },
    { label: 'Reptile', value: 'reptile' },
    { label: 'Amphibian', value: 'amphibian' },
    { label: 'Bird', value: 'bird' },
    { label: 'Other', value: 'other' },
  ],
}

const breedFilters = {
  defaultValue: [],
  options: [
    { label: 'Golden Retriever', value: 'golden-retriever', count: 25 },
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
    { label: 'Toy Group', value: 'toy' },
    { label: 'Pastoral Group', value: 'pastoral' },
    { label: 'Working Group', value: 'working' },
    { label: 'Terrier Group', value: 'terrier' },
    { label: 'Gun Dog Group', value: 'gun-dog' },
    { label: 'Hound Group', value: 'hound' },
    { label: 'Hybrid Group', value: 'hybrid' },

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
  defaultValue: [0, 0],
  min: 1000,
  max: 200000,
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
    defaultValue: petTypeFilters.defaultValue,
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
    defaultValue: breedGroupFilters.defaultValue,
    onSubmit: (value) => {
      if (onFilterChange) {
        onFilterChange({ breed_groups: value });
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


  const handleReset = () => {
    const defaultFilters = searchService.getDefaultFilters()
    // retain search query and tab
    defaultFilters.q = searchService.parseSearchParams(router.query).q
    defaultFilters.tab = searchService.parseSearchParams(router.query).tab

    const queryParams = searchService.buildQueryParams(defaultFilters)

    router.push({
      pathname: '/dashboard/search',
      query: queryParams
    }, undefined, { shallow: true })
  }
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState(router.query.tab);

  useEffect(() => {
    setCurrentPath(router.query.tab);
  }, [router.query.tab]);

  const filters = useMemo(() => searchService.parseSearchParams(router.query), [router.query])

  const petTypeFilterState = useFilterState({
    defaultValue: filters.pet_type,
    onSubmit: (value) => {
      if (onFilterChange) {
        onFilterChange({ pet_type: value });
      }
    },
  });

  const breedFilterState = useFilterState({
    defaultValue: filters.breeds,
    onSubmit: (value) => {
      if (onFilterChange) {
        onFilterChange({ breeds: value });
      }
    },
  });


  const breedGroupFilterState = useFilterState({
    defaultValue: filters.breed_groups,
    onSubmit: (value) => {
      if (onFilterChange) {
        onFilterChange({ breed_groups: value });
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
      {/* Desktop filters */}
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
            {currentPath?.includes('breeds') && (
              <BreedGroupFilterPopover
                onFilterChange={(f) => onFilterChange(f)}
              />
            )}

            {currentPath?.includes('listings') && (
              <BreedFilterPopover
                onFilterChange={(f) => onFilterChange(f)}
              />
            )}
            <LocationFilterPopover onFilterChange={(f) => onFilterChange(f)} />


            {currentPath?.includes('listings') && <PriceFilterPopover onFilterChange={(f) => onFilterChange(f)} />}

            {currentPath?.includes('breeds') && <SizeFilterPopover onFilterChange={(f) => onFilterChange(f)} />}
          </SimpleGrid>
        </Stack>

        {searchService.hasActiveFilters(filters) && (
          <Button
            variant="ghost"
            color="subtle"
            size="sm"
            onClick={handleReset}
          >
            Reset Filters
          </Button>
        )}
      </Flex>

      {/* Mobile filters */}
      <Stack
        display={{ base: 'flex', md: 'none' }}
        spacing="4"
        px="8"
      >

        <PetTypePicker
          value={petTypeFilterState.value}
          onChange={petTypeFilterState.onChange}
          options={petTypeFilters.options}
        />

        <Stack>
          <Text fontWeight="semibold" fontSize="md">Breed Group</Text>
          <Select
            placeholder="All Groups"
            value={breedGroupFilterState.value}
            onChange={(v) => breedGroupFilterState.onChange([v.target.value])}
          >
            {breedGroupFilters.options.map((group) => (
              <option key={group.label} value={group.value}>
                {group.label}
              </option>
            ))}
          </Select>
        </Stack>

        {currentPath?.includes('listings') && <CheckboxFilter
          hideLabel={false}
          label="Breed"
          value={breedFilterState.value}
          onChange={(v: string[]) => breedFilterState.onChange(v)}
          options={breedFilters.options}
          spacing="4"
        />}

        {currentPath?.includes('listings') &&
          <>
            <FormLabel fontWeight="semibold" as="legend" mb="0">
              Price Range
            </FormLabel>
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
          </>}


        {currentPath?.includes('breeds') && <>
          <FormLabel fontWeight="semibold" as="legend" mb="0">
            Size
          </FormLabel>

          <SizePicker
            hideLabel
            value={sizeFilterState.value}
            onChange={sizeFilterState.onChange}
            options={sizeFilter.options}
          />
        </>}



        <FilterActionButtons
          onClickCancel={handleReset}
          onClickApply={() => {
            const mobileFilters: any = {};
            if (breedGroupFilterState.value?.length > 0) {
              mobileFilters.breed_groups = breedGroupFilterState.value;
            }
            if (breedFilterState.value?.length > 0) {
              mobileFilters.breeds = breedFilterState.value;
            }
            if (sizeFilterState.value) {
              mobileFilters.size = sizeFilterState.value;
            }
            if (priceFilterState.value && priceFilterState.value.length === 2) {
              mobileFilters.price_min = priceFilterState.value[0];
              mobileFilters.price_max = priceFilterState.value[1];
            }
            onFilterChange(mobileFilters);
          }}
        />

      </Stack>
    </Box>

  )

}


export type FilterActionButtonsProps = {
  onClickCancel?: VoidFunction
  isCancelDisabled?: boolean
  onClickApply?: VoidFunction
}

export const FilterActionButtons = (props: FilterActionButtonsProps) => {
  const { onClickApply, onClickCancel, isCancelDisabled } = props
  return (
    <HStack spacing="2" justify="space-between">
      <Button size="sm" variant="ghost" onClick={onClickCancel} isDisabled={isCancelDisabled}>
        Cancel
      </Button>
      <Button size="sm" colorScheme="brand" onClick={onClickApply}>
        Apply
      </Button>
    </HStack>
  )
}