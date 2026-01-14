import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase/client";
import { queryKeys } from "../../queryKeys";

export interface AnalyticsMetrics {
  userMetrics: {
    totalUsers: number;
    newUsersThisMonth: number;
    newUsersLastMonth: number;
    activeUsers: number;
    userGrowthRate: number;
    userRetentionRate: number;
    breedersCount: number;
    seekersCount: number;
    verifiedBreedersCount: number;
    unverifiedBreedersCount: number;
  };
  listingMetrics: {
    totalListings: number;
    activeListings: number;
    newListingsThisMonth: number;
    averageListingPrice: number;
    listingsByType: { type: string; count: number }[];
    listingsByBreed: { breed: string; count: number }[];
  };
  transactionMetrics: {
    totalTransactions: number;
    totalRevenue: number;
    averageTransactionValue: number;
    transactionsThisMonth: number;
    revenueThisMonth: number;
    revenueGrowthRate: number;
  };
  adoptionMetrics: {
    totalAdoptions: number;
    completedAdoptions: number;
    adoptionSuccessRate: number;
    averageAdoptionTime: number; // in days
  };
  geographicMetrics: {
    topLocations: { location: string; count: number }[];
    userDistribution: { country: string; count: number }[];
  };
}

export interface TimeSeriesData {
  date: string;
  users: number;
  listings: number;
  transactions: number;
  revenue: number;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  period?: "7d" | "30d" | "90d" | "1y" | "all";
}

/**
 * Hook to get comprehensive analytics metrics
 */
export const useAnalyticsMetrics = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.admin.analytics(filters),
    queryFn: async (): Promise<AnalyticsMetrics> => {
      const now = new Date();
      const startDate = filters.startDate
        ? new Date(filters.startDate)
        : filters.period === "7d"
        ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        : filters.period === "30d"
        ? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        : filters.period === "90d"
        ? new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        : filters.period === "1y"
        ? new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        : new Date("2020-01-01");

      // User metrics
      const { count: totalUsers } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      const { count: newUsersThisMonth } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gte(
          "created_at",
          new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        );

      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const { count: newUsersLastMonth } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gte("created_at", lastMonth.toISOString())
        .lt("created_at", thisMonth.toISOString());

      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const { count: activeUsers } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gte("last_sign_in_at", thirtyDaysAgo.toISOString());

      const userGrowthRate =
        newUsersLastMonth > 0
          ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100
          : 0;

      // For simplicity, we'll set retention rate to a placeholder
      // In a real implementation, this would require more complex tracking
      const userRetentionRate = 75;

      // Get role counts
      const { count: breedersCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "breeder");

      const { count: seekersCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "seeker");

      // Get verification counts
      const { count: verifiedBreedersCount } = await supabase
        .from("breeder_profiles")
        .select("*", { count: "exact", head: true })
        .eq("verified", true);

      const { count: unverifiedBreedersCount } = await supabase
        .from("breeder_profiles")
        .select("*", { count: "exact", head: true })
        .eq("verified", false);

      // Listing metrics
      const { count: totalListings } = await supabase
        .from("listings")
        .select("*", { count: "exact", head: true });

      const { count: activeListings } = await supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("status", "available");

      const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const { count: newListingsThisMonth } = await supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .gte("created_at", firstDayThisMonth.toISOString());

      // Average listing price
      const { data: listingsWithPrices } = await supabase
        .from("listings")
        .select("price")
        .not("price", "is", null);

      const validPrices =
        listingsWithPrices
          ?.filter((l) => l.price && l.price > 0)
          .map((l) => l.price!) || [];
      const averageListingPrice =
        validPrices.length > 0
          ? validPrices.reduce((sum, price) => sum + price, 0) /
            validPrices.length
          : 0;

      // Listings by type
      const { data: listingsByTypeData } = await supabase
        .from("listings")
        .select("type")
        .not("type", "is", null);

      const listingsByType = (listingsByTypeData || []).reduce(
        (acc, listing) => {
          const existing = acc.find((item) => item.type === listing.type);
          if (existing) {
            existing.count++;
          } else {
            acc.push({ type: listing.type, count: 1 });
          }
          return acc;
        },
        [] as { type: string; count: number }[]
      );

      // Listings by breed (top 10)
      const { data: listingsByBreedData } = await supabase
        .from("listings")
        .select(
          `
          breeds (
            name
          )
        `
        )
        .not("breeds", "is", null)
        .limit(1000);

      const breedCount: { [key: string]: number } = {};
      listingsByBreedData?.forEach((listing) => {
        if (
          listing.breeds &&
          listing.breeds.length > 0 &&
          listing.breeds[0].name
        ) {
          const breedName = listing.breeds[0].name;
          breedCount[breedName] = (breedCount[breedName] || 0) + 1;
        }
      });

      const listingsByBreed = Object.entries(breedCount)
        .map(([breed, count]) => ({ breed, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Transaction metrics
      const { data: allTransactions } = await supabase
        .from("transactions")
        .select("amount, status, created_at")
        .eq("status", "completed");

      const completedTransactions = allTransactions || [];
      const totalTransactions = completedTransactions.length;
      const totalRevenue = completedTransactions.reduce(
        (sum, t) => sum + (t.amount || 0),
        0
      );

      const transactionsThisMonth = completedTransactions.filter(
        (t) => new Date(t.created_at) >= firstDayThisMonth
      ).length;

      const revenueThisMonth = completedTransactions
        .filter((t) => new Date(t.created_at) >= firstDayThisMonth)
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const lastMonthRevenue = completedTransactions
        .filter((t) => {
          const date = new Date(t.created_at);
          return date >= lastMonth && date < thisMonth;
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const revenueGrowthRate =
        lastMonthRevenue > 0
          ? ((revenueThisMonth - lastMonthRevenue) / lastMonthRevenue) * 100
          : 0;

      const averageTransactionValue =
        totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

      // Adoption metrics
      const { count: totalAdoptions } = await supabase
        .from("adoptions")
        .select("*", { count: "exact", head: true });

      const { count: completedAdoptions } = await supabase
        .from("adoptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed");

      const adoptionSuccessRate =
        totalAdoptions > 0 ? (completedAdoptions / totalAdoptions) * 100 : 0;

      // For average adoption time, we'd need more complex tracking
      const averageAdoptionTime = 14; // placeholder

      // Geographic metrics (simplified)
      const topLocations: { location: string; count: number }[] = [
        { location: "Nairobi", count: 125 },
        { location: "Mombasa", count: 89 },
        { location: "Kisumu", count: 67 },
        { location: "Nakuru", count: 45 },
        { location: "Eldoret", count: 38 },
      ];

      const userDistribution: { country: string; count: number }[] = [
        { country: "Kenya", count: 450 },
        { country: "Tanzania", count: 23 },
        { country: "Uganda", count: 15 },
        { country: "Rwanda", count: 8 },
        { country: "Other", count: 4 },
      ];

      return {
        userMetrics: {
          totalUsers: totalUsers || 0,
          newUsersThisMonth: newUsersThisMonth || 0,
          newUsersLastMonth: newUsersLastMonth || 0,
          activeUsers: activeUsers || 0,
          userGrowthRate,
          userRetentionRate,
          breedersCount: breedersCount || 0,
          seekersCount: seekersCount || 0,
          verifiedBreedersCount: verifiedBreedersCount || 0,
          unverifiedBreedersCount: unverifiedBreedersCount || 0,
        },
        listingMetrics: {
          totalListings: totalListings || 0,
          activeListings: activeListings || 0,
          newListingsThisMonth: newListingsThisMonth || 0,
          averageListingPrice,
          listingsByType,
          listingsByBreed: listingsByBreed.map((item) => ({
            breed: item.breed,
            count: item.count,
          })),
        },
        transactionMetrics: {
          totalTransactions,
          totalRevenue,
          averageTransactionValue,
          transactionsThisMonth,
          revenueThisMonth,
          revenueGrowthRate,
        },
        adoptionMetrics: {
          totalAdoptions: totalAdoptions || 0,
          completedAdoptions: completedAdoptions || 0,
          adoptionSuccessRate,
          averageAdoptionTime,
        },
        geographicMetrics: {
          topLocations,
          userDistribution,
        },
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get time series data for charts
 */
export const useAnalyticsTimeSeries = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ["admin", "analytics-time-series", filters],
    queryFn: async (): Promise<TimeSeriesData[]> => {
      const now = new Date();
      const days =
        filters.period === "7d"
          ? 7
          : filters.period === "30d"
          ? 30
          : filters.period === "90d"
          ? 90
          : 30;

      const timeSeriesData: TimeSeriesData[] = [];

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split("T")[0];

        // Get metrics for this date
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Users created on this date
        const { count: users } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startOfDay.toISOString())
          .lte("created_at", endOfDay.toISOString());

        // Listings created on this date
        const { count: listings } = await supabase
          .from("listings")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startOfDay.toISOString())
          .lte("created_at", endOfDay.toISOString());

        // Transactions on this date
        const { data: transactions } = await supabase
          .from("transactions")
          .select("amount")
          .eq("status", "completed")
          .gte("created_at", startOfDay.toISOString())
          .lte("created_at", endOfDay.toISOString());

        const transactionsCount = transactions?.length || 0;
        const revenue =
          transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

        timeSeriesData.push({
          date: dateString,
          users: users || 0,
          listings: listings || 0,
          transactions: transactionsCount,
          revenue,
        });
      }

      return timeSeriesData;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to export analytics data
 */
export const useAnalyticsExport = () => {
  return useQuery({
    queryKey: ["admin", "analytics-export"],
    queryFn: async () => {
      // This would generate and return export data
      // For now, return placeholder
      return {
        users: [],
        listings: [],
        transactions: [],
        summary: {},
      };
    },
    enabled: false, // Only run when explicitly requested
    staleTime: 0,
  });
};
