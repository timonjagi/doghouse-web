/**
 * Centralized query key factory for React Query
 * Provides type-safe and consistent query keys throughout the application
 */

// Base query keys for main entities
export const queryKeys = {
  // User related queries
  users: {
    all: (): readonly string[] => ["users"] as const,
    lists: (): readonly string[] => ["users", "list"] as const,
    list: (filters?: Record<string, unknown>): readonly string[] =>
      ["users", "list", filters].filter(Boolean) as any,
    details: (): readonly string[] => ["users", "detail"] as const,
    detail: (id: string): readonly string[] => ["users", "detail", id] as const,
    profile: (id?: string): readonly string[] =>
      ["users", "detail", "profile", id].filter(Boolean) as any,
    currentProfile: (userId?: string): readonly string[] =>
      ["users", "current-profile", userId].filter(Boolean) as any,
    seekerProfile: (userId?: string): readonly string[] =>
      ["users", "seeker-profile", userId].filter(Boolean) as any,
    breederProfile: (userId?: string): readonly string[] =>
      ["users", "breeder-profile", userId].filter(Boolean) as any,
    featured: (limit?: number, petType?: string): readonly string[] =>
      ["users", "featured", limit, petType].filter(Boolean) as any,
  },

  // Breed related queries
  breeds: {
    all: (): readonly string[] => ["breeds"] as const,
    lists: (petType?: string): readonly string[] =>
      ["breeds", "list", petType].filter(Boolean) as any,
    list: (filters?: Record<string, unknown>): readonly string[] =>
      ["breeds", "list", filters].filter(Boolean) as any,
    details: (): readonly string[] => ["breeds", "detail"] as const,
    detail: (id: string): readonly string[] =>
      ["breeds", "detail", id] as const,
    userBreeds: (userId?: string): readonly string[] =>
      ["breeds", "user-breeds", userId].filter(Boolean) as any,
    available: (options?: Record<string, unknown>): readonly string[] =>
      ["breeds", "available", options].filter(Boolean) as any,
    breedBreeders: (breedId: string): readonly string[] =>
      ["breeds", "breed-breeders", breedId] as const,
    categories: (limit?: number): readonly string[] =>
      ["breeds", "categories", limit].filter(Boolean) as any,
    popular: (limit?: number, petType?: string): readonly string[] =>
      ["breeds", "popular", limit, petType].filter(Boolean) as any,
  },

  // Listing related queries (unified litters + wanted listings)
  listings: {
    all: (): readonly string[] => ["listings"] as const,
    lists: (): readonly string[] => ["listings", "list"] as const,
    list: (filters?: Record<string, unknown>): readonly string[] =>
      ["listings", "list", filters].filter(Boolean) as any,
    details: (): readonly string[] => ["listings", "detail"] as const,
    detail: (id: string): readonly string[] =>
      ["listings", "detail", id] as const,
    byOwner: (ownerId: string): readonly string[] =>
      ["listings", "owner", ownerId] as const,
    featured: (): readonly string[] => ["listings", "featured"] as const,
    popular: (limit?: number, petType?: string): readonly string[] =>
      ["listings", "popular", limit, petType].filter(Boolean) as any,
    new: (limit?: number, petType?: string): readonly string[] =>
      ["listings", "new", limit, petType].filter(Boolean) as any,
    byType: (type: string): readonly string[] =>
      ["listings", "type", type] as const,
    byBreed: (breedId: string): readonly string[] =>
      ["listings", "breed", breedId] as const,
  },

  // Legacy litter queries (for backward compatibility)
  litters: {
    all: (): readonly string[] => ["litters"] as const,
    lists: (): readonly string[] => ["litters", "list"] as const,
    list: (filters?: Record<string, unknown>): readonly string[] =>
      ["litters", "list", filters].filter(Boolean) as any,
    details: (): readonly string[] => ["litters", "detail"] as const,
    detail: (id: string): readonly string[] =>
      ["litters", "detail", id] as const,
    byBreeder: (breederId: string): readonly string[] =>
      ["litters", "breeder", breederId] as const,
    userLitters: (userId?: string): readonly string[] =>
      ["litters", "user-litters", userId].filter(Boolean) as any,
  },

  // Adoption related queries
  adoptions: {
    all: (): readonly string[] => ["adoptions"] as const,
    lists: (): readonly string[] => ["adoptions", "list"] as const,
    list: (filters?: Record<string, unknown>): readonly string[] =>
      ["adoptions", "list", filters].filter(Boolean) as any,
    details: (): readonly string[] => ["adoptions", "detail"] as const,
    detail: (id: string): readonly string[] =>
      ["adoptions", "detail", id] as const,
    byLitter: (litterId: string): readonly string[] =>
      ["adoptions", "litter", litterId] as const,
    byListing: (listingId: string): readonly string[] =>
      ["adoptions", "listing", listingId] as const,
    byUser: (userId?: string): readonly string[] =>
      ["adoptions", "user", userId].filter(Boolean) as any,
    received: (breederId?: string): readonly string[] =>
      ["adoptions", "received", breederId].filter(Boolean) as any,
    userAdoptions: (userId?: string): readonly string[] =>
      ["adoptions", "user-adoptions", userId].filter(Boolean) as any,
  },

  // Authentication related queries
  auth: {
    all: (): readonly string[] => ["auth"] as const,
    session: (): readonly string[] => ["auth", "session"] as const,
    user: (): readonly string[] => ["auth", "user"] as const,
  },

  // Transaction related queries
  transactions: {
    all: (): readonly string[] => ["transactions"] as const,
    lists: (): readonly string[] => ["transactions", "list"] as const,
    list: (filters?: Record<string, unknown>): readonly string[] =>
      ["transactions", "list", filters].filter(Boolean) as any,
    details: (): readonly string[] => ["transactions", "detail"] as const,
    detail: (id: string): readonly string[] =>
      ["transactions", "detail", id] as const,
    byUser: (userId: string): readonly string[] =>
      ["transactions", "user", userId] as const,
    billing: (userId?: string): readonly string[] =>
      ["transactions", "billing", userId].filter(Boolean) as any,
    stats: (userId?: string): readonly string[] =>
      ["transactions", "stats", userId].filter(Boolean) as any,
  },

  // Payout related queries
  payouts: {
    all: (): readonly string[] => ["payouts"] as const,
    pending: (): readonly string[] => ["payouts", "pending"] as const,
    calculation: (breederId: string): readonly string[] =>
      ["payouts", "calculation", breederId] as const,
    stats: (): readonly string[] => ["payouts", "stats"] as const,
  },

  // Notification related queries
  notifications: {
    all: (): readonly string[] => ["notifications"] as const,
    lists: (): readonly string[] => ["notifications", "list"] as const,
    list: (filters?: Record<string, unknown>): readonly string[] =>
      ["notifications", "list", filters].filter(Boolean) as any,
    unread: (): readonly string[] => ["notifications", "unread"] as const,
    unreadCount: (userId?: string): readonly string[] =>
      ["notifications", "unread-count", userId].filter(Boolean) as any,
  },

  // Conversation related queries
  conversations: {
    all: (): readonly string[] => ["conversations"] as const,
    lists: (): readonly string[] => ["conversations", "list"] as const,
    list: (filters?: Record<string, unknown>): readonly string[] =>
      ["conversations", "list", filters].filter(Boolean) as any,
    details: (): readonly string[] => ["conversations", "detail"] as const,
    detail: (id: string): readonly string[] =>
      ["conversations", "detail", id] as const,
    withContext: (id: string): readonly string[] =>
      ["conversations", "detail", "with-context", id] as const,
    unreadCount: (userId?: string): readonly string[] =>
      ["conversations", "unread-count", userId].filter(Boolean) as any,
    typingUsers: (conversationId: string): readonly string[] =>
      ["conversations", "typing-users", conversationId] as const,
    byContext: (contextType: string, contextId?: string): readonly string[] =>
      ["conversations", "context", contextType, contextId].filter(
        Boolean
      ) as any,
  },

  // Admin related queries
  admin: {
    users: (filters?: any, page?: number, limit?: number): readonly string[] =>
      ["admin", "users", filters, page, limit].filter(Boolean) as any,
    userStats: (): readonly string[] => ["admin", "user-stats"] as const,
    userDetails: (userId: string): readonly string[] =>
      ["admin", "user-details", userId] as const,
    userActivity: (userId: string, limit?: number): readonly string[] =>
      ["admin", "user-activity", userId, limit].filter(Boolean) as any,
    verifications: (
      filters?: any,
      page?: number,
      limit?: number
    ): readonly string[] =>
      ["admin", "verifications", filters, page, limit].filter(Boolean) as any,
    verificationDetails: (requestId: string): readonly string[] =>
      ["admin", "verification-details", requestId] as const,
    verificationStats: (): readonly string[] =>
      ["admin", "verification-stats"] as const,
    listings: (
      filters?: any,
      page?: number,
      limit?: number
    ): readonly string[] =>
      ["admin", "listings", filters, page, limit].filter(Boolean) as any,
    adoptions: (filters?: any): readonly string[] =>
      ["admin", "adoptions", filters].filter(Boolean) as any,
    analytics: (filters?: any): readonly string[] =>
      ["admin", "analytics", filters].filter(Boolean) as any,
    breeds: (filters?: any, page?: number, limit?: number): readonly string[] =>
      ["admin", "breeds", filters, page, limit].filter(Boolean) as any,
    breedStats: (): readonly string[] => ["admin", "breed-stats"] as const,
    breedDetails: (breedId: string): readonly string[] =>
      ["admin", "breed-details", breedId] as const,
    breedUserBreeds: (
      breedId: string,
      page?: number,
      limit?: number
    ): readonly string[] =>
      ["admin", "breed-user-breeds", breedId, page, limit].filter(
        Boolean
      ) as any,
  },

  // Support system queries
  support: {
    faqs: {
      all: (): readonly string[] => ["support", "faqs"] as const,
      lists: (): readonly string[] => ["support", "faqs", "list"] as const,
      list: (filters?: Record<string, unknown>): readonly string[] =>
        ["support", "faqs", "list", filters].filter(Boolean) as any,
      detail: (id: string): readonly string[] =>
        ["support", "faqs", "detail", id] as const,
      categories: (): readonly string[] =>
        ["support", "faqs", "categories"] as const,
      search: (query: string): readonly string[] =>
        ["support", "faqs", "search", query] as const,
    },
    tickets: {
      all: (): readonly string[] => ["support", "tickets"] as const,
      lists: (): readonly string[] => ["support", "tickets", "list"] as const,
      list: (filters?: Record<string, unknown>): readonly string[] =>
        ["support", "tickets", "list", filters].filter(Boolean) as any,
      detail: (id: string): readonly string[] =>
        ["support", "tickets", "detail", id] as const,
      user: (userId: string): readonly string[] =>
        ["support", "tickets", "user", userId] as const,
      comments: (ticketId: string): readonly string[] =>
        ["support", "tickets", "comments", ticketId] as const,
      attachments: (ticketId: string): readonly string[] =>
        ["support", "tickets", "attachments", ticketId] as const,
    },
    categories: {
      all: (): readonly string[] => ["support", "categories"] as const,
      active: (): readonly string[] =>
        ["support", "categories", "active"] as const,
    },
  },
} as const;

// Helper function to create custom query keys with consistent structure
export const createQueryKey = (
  baseKey: readonly string[],
  ...additionalKeys: (string | number | Record<string, unknown> | undefined)[]
): readonly string[] => {
  return [...baseKey, ...additionalKeys.filter(Boolean)] as any;
};

// Type helpers for better TypeScript support
export type QueryKey = readonly string[];
