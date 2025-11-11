/**
 * Centralized query key factory for React Query
 * Provides type-safe and consistent query keys throughout the application
 */

// Base query keys for main entities
export const queryKeys = {
  // User related queries
  users: {
    all: (): readonly string[] => ['users'] as const,
    lists: (): readonly string[] => ['users', 'list'] as const,
    list: (filters?: Record<string, unknown>): readonly string[] => ['users', 'list', filters].filter(Boolean) as any,
    details: (): readonly string[] => ['users', 'detail'] as const,
    detail: (id: string): readonly string[] => ['users', 'detail', id] as const,
    profile: (id?: string): readonly string[] => ['users', 'detail', 'profile', id].filter(Boolean) as any,
    currentProfile: (): readonly string[] => ['users', 'current-profile'] as const,
  },

  // Breed related queries
  breeds: {
    all: (): readonly string[] => ['breeds'] as const,
    lists: (): readonly string[] => ['breeds', 'list'] as const,
    list: (filters?: Record<string, unknown>): readonly string[] => ['breeds', 'list', filters].filter(Boolean) as any,
    details: (): readonly string[] => ['breeds', 'detail'] as const,
    detail: (id: string): readonly string[] => ['breeds', 'detail', id] as const,
    userBreeds: (userId?: string): readonly string[] => ['breeds', 'user-breeds', userId].filter(Boolean) as any,
    available: (): readonly string[] => ['breeds', 'available'] as const,
    breedBreeders: (breedId: string): readonly string[] => ['breeds', 'breed-breeders', breedId] as const,
  },

  // Listing related queries (unified litters + wanted listings)
  listings: {
    all: (): readonly string[] => ['listings'] as const,
    lists: (): readonly string[] => ['listings', 'list'] as const,
    list: (filters?: Record<string, unknown>): readonly string[] => ['listings', 'list', filters].filter(Boolean) as any,
    details: (): readonly string[] => ['listings', 'detail'] as const,
    detail: (id: string): readonly string[] => ['listings', 'detail', id] as const,
    byOwner: (ownerId: string): readonly string[] => ['listings', 'owner', ownerId] as const,
    featured: (): readonly string[] => ['listings', 'featured'] as const,
    byType: (type: string): readonly string[] => ['listings', 'type', type] as const,
    byBreed: (breedId: string): readonly string[] => ['listings', 'breed', breedId] as const,
  },

  // Legacy litter queries (for backward compatibility)
  litters: {
    all: (): readonly string[] => ['litters'] as const,
    lists: (): readonly string[] => ['litters', 'list'] as const,
    list: (filters?: Record<string, unknown>): readonly string[] => ['litters', 'list', filters].filter(Boolean) as any,
    details: (): readonly string[] => ['litters', 'detail'] as const,
    detail: (id: string): readonly string[] => ['litters', 'detail', id] as const,
    byBreeder: (breederId: string): readonly string[] => ['litters', 'breeder', breederId] as const,
    userLitters: (userId?: string): readonly string[] => ['litters', 'user-litters', userId].filter(Boolean) as any,
  },

  // Application related queries
  applications: {
    all: (): readonly string[] => ['applications'] as const,
    lists: (): readonly string[] => ['applications', 'list'] as const,
    list: (filters?: Record<string, unknown>): readonly string[] => ['applications', 'list', filters].filter(Boolean) as any,
    details: (): readonly string[] => ['applications', 'detail'] as const,
    detail: (id: string): readonly string[] => ['applications', 'detail', id] as const,
    byLitter: (litterId: string): readonly string[] => ['applications', 'litter', litterId] as const,
    byListing: (listingId: string): readonly string[] => ['applications', 'listing', listingId] as const,
    byUser: (userId?: string): readonly string[] => ['applications', 'user', userId].filter(Boolean) as any,
    received: (breederId?: string): readonly string[] => ['applications', 'received', breederId].filter(Boolean) as any,
    userApplications: (userId?: string): readonly string[] => ['applications', 'user-applications', userId].filter(Boolean) as any,
  },

  // Authentication related queries
  auth: {
    all: (): readonly string[] => ['auth'] as const,
    session: (): readonly string[] => ['auth', 'session'] as const,
    user: (): readonly string[] => ['auth', 'user'] as const,
  },

  // Transaction related queries
  transactions: {
    all: (): readonly string[] => ['transactions'] as const,
    lists: (): readonly string[] => ['transactions', 'list'] as const,
    list: (filters?: Record<string, unknown>): readonly string[] => ['transactions', 'list', filters].filter(Boolean) as any,
    details: (): readonly string[] => ['transactions', 'detail'] as const,
    detail: (id: string): readonly string[] => ['transactions', 'detail', id] as const,
    byUser: (userId: string): readonly string[] => ['transactions', 'user', userId] as const,
    billing: (userId: string): readonly string[] => ['transactions', 'billing', userId] as const,
  },

  // Payout related queries
  payouts: {
    all: (): readonly string[] => ['payouts'] as const,
    pending: (): readonly string[] => ['payouts', 'pending'] as const,
    calculation: (breederId: string): readonly string[] => ['payouts', 'calculation', breederId] as const,
    stats: (): readonly string[] => ['payouts', 'stats'] as const,
  },

  // Notification related queries
  notifications: {
    all: (): readonly string[] => ['notifications'] as const,
    lists: (): readonly string[] => ['notifications', 'list'] as const,
    list: (filters?: Record<string, unknown>): readonly string[] => ['notifications', 'list', filters].filter(Boolean) as any,
    unread: (): readonly string[] => ['notifications', 'unread'] as const,
    unreadCount: (): readonly string[] => ['notifications', 'unread-count'] as const,
  },
} as const;

// Helper function to create custom query keys with consistent structure
export const createQueryKey = (baseKey: readonly string[], ...additionalKeys: (string | number | Record<string, unknown> | undefined)[]): readonly string[] => {
  return [...baseKey, ...additionalKeys.filter(Boolean)] as any;
};

// Type helpers for better TypeScript support
export type QueryKey = readonly string[];
