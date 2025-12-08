import { HStack, Wrap, WrapItem, Badge, Button, Text, useBreakpointValue } from "@chakra-ui/react";
import { SearchFilters } from "lib/services/searchService";
import * as searchService from "lib/services/searchService";
import { NextRouter } from "next/router";

interface ActiveFiltersProps {
  filters: SearchFilters;
  clearFilters: () => void;
}

export const ActiveFilters = ({ filters, clearFilters }: ActiveFiltersProps) => {

  const isMobile = useBreakpointValue({ base: true, md: false });

  return <HStack justify="space-between" >
    {/* Active Filters Display */}
    {
      (searchService.hasActiveFilters(filters)) && (
        <Wrap spacing={2}>
          <WrapItem>
            <Text fontSize="sm" color="gray.600">Active filters:</Text>
          </WrapItem>

          {filters.pet_type && (
            <WrapItem>
              <Badge colorScheme="orange" variant="subtle">
                Pet Type: {filters.pet_type}
              </Badge>
            </WrapItem>
          )}


          {filters.breed_groups && filters.breed_groups.length > 0 && (
            <WrapItem>
              <Badge colorScheme="blue" variant="subtle">
                Breed Group: {filters.breed_groups.join(', ')}
              </Badge>
            </WrapItem>
          )}

          {filters.breeds && filters.breeds.length > 0 && (
            <WrapItem>
              <Badge colorScheme="blue" variant="subtle">
                Breeds: {filters.breeds.join(', ')}
              </Badge>
            </WrapItem>
          )}
          {filters.location && (
            <WrapItem>
              <Badge colorScheme="green" variant="subtle">
                Location: {filters.location}
              </Badge>
            </WrapItem>
          )}
          {filters.price_min && (
            <WrapItem>
              <Badge colorScheme="purple" variant="subtle">
                Min: KSH {filters.price_min}
              </Badge>
            </WrapItem>
          )}
          {filters.price_max && (
            <WrapItem>
              <Badge colorScheme="purple" variant="subtle">
                Max: KSH {filters.price_max}
              </Badge>
            </WrapItem>
          )}
          {filters.listing_type && (
            <WrapItem>
              <Badge colorScheme="orange" variant="subtle">
                Listing Type: {filters.listing_type === 'litter' ? 'Litter' : 'Single Pet'}
              </Badge>
            </WrapItem>
          )}
        </Wrap>
      )
    }

    {!isMobile && searchService.hasActiveFilters(filters) && (
      <Button variant="ghost" size="sm" onClick={clearFilters}>
        Clear All Filters
      </Button>
    )
    }
  </HStack >;
}