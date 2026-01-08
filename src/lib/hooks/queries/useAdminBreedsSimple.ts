// Temporary simple version
export const useAdminBreeds = () => ({
  data: { breeds: [], total: 0 },
  isLoading: false,
});
export const useBreedStats = () => ({
  data: { totalBreeds: 0, userBreedsCount: 0, listingsCount: 0 },
  isLoading: false,
});
export const useAdminBreedDetails = () => ({ data: null, isLoading: false });
export const useAdminBreedUserBreeds = () => ({
  data: { userBreeds: [], total: 0 },
  isLoading: false,
});
