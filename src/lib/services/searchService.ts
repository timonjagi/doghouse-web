import router from 'next/router'
import { ParsedUrlQuery } from 'querystring'

/**
 * Search filter state interface
 */
export interface SearchFilters {
  q?: string
  tab?: string
  sort?: string
  breed?: string
  breeds?: string[]
  breed_groups?: string[]
  size?: string
  price_min?: string
  price_max?: string
  location?: string
  featured?: string
  pet_type?: string
  listing_type?: string
  rescue?: string
  training?: string
  care?: string
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/**
 * Search type enum
 */
export enum SearchType {
  ALL = 'all',
  LISTINGS = 'listings',
  BREEDS = 'breeds',
  BREEDERS = 'breeders',
  SHELTERS = 'shelters',
  VETS = 'vets',
}

/**
 * Parse URL query parameters into internal filter state
 */
export const parseSearchParams = (query: ParsedUrlQuery): SearchFilters => {
  const filters: SearchFilters = {
    q: query.q?.toString() || '',
    tab: query.tab?.toString() || SearchType.ALL,
    sort: query.sort?.toString() || '',
    breed: query.breed?.toString() || '',
    breeds: query.breeds as string[],
    breed_groups: query.breed_groups as string[],
    size: query.size?.toString() || '',
    price_min: query.price_min?.toString() || '',
    price_max: query.price_max?.toString() || '',
    location: query.location?.toString() || '',
    featured: query.featured?.toString() || '',
    rescue: query.rescue?.toString() || '',
    training: query.training?.toString() || '',
    care: query.care?.toString() || '',
    pet_type: query.pet_type?.toString() || '',
    listing_type: query.listing_type?.toString() || '',
  }

  // Parse array parameters
  if (query.breeds) {
    filters.breeds = typeof query.breeds === 'string'
      ? query.breeds.split(',')
      : query.breeds as string[]
  } else {
    filters.breeds = []
  }

  if (query.breed_groups) {
    filters.breed_groups = typeof query.breed_groups === 'string'
      ? query.breed_groups.split(',')
      : query.breed_groups as string[]
  } else {
    filters.breed_groups = []
  }

  return filters
}

/**
 * Build URL query parameters from filter state
 */
export const buildQueryParams = (filters: SearchFilters): Record<string, string> => {
  const params: Record<string, string> = {}

  // Add simple string parameters
  if (filters.q) params.q = filters.q
  if (filters.tab && filters.tab !== SearchType.ALL) params.tab = filters.tab
  if (filters.sort) params.sort = filters.sort
  if (filters.breed) params.breed = filters.breed
  if (filters.size) params.size = filters.size
  if (filters.price_min) params.price_min = filters.price_min
  if (filters.price_max) params.price_max = filters.price_max
  if (filters.location) params.location = filters.location
  if (filters.featured) params.featured = filters.featured
  if (filters.rescue) params.rescue = filters.rescue
  if (filters.training) params.training = filters.training
  if (filters.care) params.care = filters.care
  if (filters.pet_type) params.pet_type = filters.pet_type
  if (filters.listing_type) params.listing_type = filters.listing_type

  // Add array parameters
  if (filters.breeds && filters.breeds.length > 0) {
    params.breeds = filters.breeds.join(',')
  }
  if (filters.breed_groups && filters.breed_groups.length > 0) {
    params.breed_groups = filters.breed_groups.join(',')
  }

  return params
}

/**
 * Map filters to useListings hook parameters
 */
export const mapFiltersToListingsParams = (
  filters: SearchFilters,
  pagination: PaginationParams
) => {
  const params: any = {
    // status: 'available',
    // owner_type: 'breeder',
    page: pagination.page,
    pageSize: pagination.pageSize,
  }

  if (filters.q) params.search = filters.q
  if (filters.sort) params.sort = filters.sort
  if (filters.breed) params.breed_id = filters.breed
  if (filters.size) params.size = filters.size
  if (filters.price_min) params.price_min = filters.price_min
  if (filters.price_max) params.price_max = filters.price_max
  if (filters.location) params.location = filters.location
  if (filters.breeds && filters.breeds.length > 0) {
    params.breed_ids = filters.breeds
  }

  return params
}

/**
 * Map filters to useAllAvailableUserBreeds hook parameters
 */
export const mapFiltersToBreedParams = (
  filters: SearchFilters,
  pagination: PaginationParams
) => {
  const params: any = {
    page: pagination.page,
    pageSize: pagination.pageSize,
  }

  if (filters.q) params.search = filters.q
  if (filters.breeds && filters.breeds.length > 0) {
    params.breed_ids = filters.breeds
  }
  if (filters.breed_groups && filters.breed_groups.length > 0) {
    params.breed_groups = filters.breed_groups
  }
  if (filters.size) params.size = filters.size

  return params
}

/**
 * Map filters to useBreeders hook parameters
 */
export const mapFiltersToBreederParams = (
  filters: SearchFilters,
  pagination: PaginationParams
) => {
  const params: any = {
    page: pagination.page,
    pageSize: pagination.pageSize,
  }

  if (filters.q) params.search = filters.q
  if (filters.location) params.location = filters.location

  return params
}

/**
 * Get default empty filters (for reset functionality)
 */
export const getDefaultFilters = (): SearchFilters => ({
  q: '',
  tab: SearchType.ALL,
  sort: '',
  breed: '',
  breeds: [],
  breed_groups: [],
  pet_type: '',
  listing_type: '',
  size: '',
  price_min: '',
  price_max: '',
  location: '',
  featured: '',
  rescue: '',
  training: '',
  care: '',
})

/**
 * Get default pagination parameters
 */
export const getDefaultPagination = (): PaginationParams => ({
  page: 0,
  pageSize: 12,
})

/**
 * Check if any filters are active (excluding tab and q)
 */
export const hasActiveFilters = (filters: SearchFilters): boolean => {
  return !!(
    filters.q ||
    filters.sort ||
    filters.breed ||
    filters.size ||
    filters.price_min ||
    filters.price_max ||
    filters.location ||
    filters.featured ||
    filters.rescue ||
    filters.training ||
    filters.care ||
    (filters.breeds && filters.breeds.length > 0) ||
    (filters.breed_groups && filters.breed_groups.length > 0)
  )
}

/**
 * Get tab-specific filter keys that should be preserved when switching tabs
 */
export const getRelevantFiltersForTab = (
  filters: SearchFilters,
  tab: SearchType
): SearchFilters => {
  const baseFilters = {
    q: filters.q,
    tab,
  }

  switch (tab) {
    case SearchType.LISTINGS:
      return {
        ...baseFilters,
        sort: filters.sort,
        breed: filters.breed,
        breeds: filters.breeds,
        size: filters.size,
        price_min: filters.price_min,
        price_max: filters.price_max,
        location: filters.location,
      }

    case SearchType.BREEDS:
      return {
        ...baseFilters,
        breeds: filters.breeds,
        breed_groups: filters.breed_groups,
      }

    case SearchType.BREEDERS:
      return {
        ...baseFilters,
        location: filters.location,
      }

    default:
      return baseFilters
  }
}

export const clearSearchParams = (currentFilters: SearchFilters) => {
  const queryParams = buildQueryParams({ ...currentFilters, q: '' })

  router.push({
    pathname: '/dashboard/search',
    query: queryParams
  }, undefined, { shallow: true })
}

export const resetFilters = (currentFilters: SearchFilters) => {

  const defaultFilters = getDefaultFilters()
  // retain search query and tab
  defaultFilters.q = parseSearchParams(router.query).q
  defaultFilters.tab = parseSearchParams(router.query).tab

  const queryParams = buildQueryParams(defaultFilters)

  router.push({
    pathname: '/dashboard/search',
    query: queryParams
  }, undefined, { shallow: true })
}

export const resetSearchAndFilters = () => {
  const defaultFilters = getDefaultFilters()
  const queryParams = buildQueryParams(defaultFilters)

  router.push({
    pathname: '/dashboard/search',
    query: queryParams
  }, undefined, { shallow: true })
}
