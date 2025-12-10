import { useQuery } from '@tanstack/react-query';
import { useUserProfile } from './useUserProfile';
import { useAdoptionsByUser } from './useAdoptions';
import { useTransactions } from './useTransactions';
import { useListings } from './useListings';
import { supabase } from 'lib/supabase/client';

export interface SeekerDashboardStats {
  activeAdoptions: number;
  completedAdoptions: number;
  totalSpent: number;
  spendingChange: number;
  adoptionTrend: Array<{ month: string; adoptions: number }>;
  spendingTrend: Array<{ month: string; spending: number }>;
  recommendedListings: Array<{
    id: string;
    title: string;
    price: number | null;
    photos: string[];
    breed: string;
    location: string;
    matchScore: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'adoption' | 'payment' | 'match';
    title: string;
    timestamp: string;
    status?: string;
  }>;
}

export const useSeekerDashboardStats = () => {
  const { data: profile } = useUserProfile();

  // Get seeker's adoptions
  const { data: adoptions = [] } = useAdoptionsByUser(profile?.id);

  // Get transactions for seeker (useTransactions automatically filters for current user)
  const { data: transactions = [] } = useTransactions();

  return useQuery({
    queryKey: ['seeker-dashboard-stats', profile?.id],
    queryFn: async (): Promise<SeekerDashboardStats> => {
      if (!profile?.id) {
        return {
          recommendedListings: [],
          activeAdoptions: 0,
          completedAdoptions: 0,
          totalSpent: 0,
          spendingChange: 0,
          adoptionTrend: [],
          spendingTrend: [],
          recentActivity: [],
        };
      }

      // Calculate metrics
      const activeAdoptions = adoptions.filter(app =>
        ['submitted', 'pending', 'approved'].includes(app.status)
      ).length;

      const completedAdoptions = adoptions.filter(app =>
        app.status === 'completed'
      ).length;

      // Calculate total spent (sum of completed transactions)
      const completedTransactions = transactions.filter(t => t.status === 'completed');
      const totalSpent = completedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

      // Calculate spending change (compare last 30 days vs previous 30 days)
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const recentSpending = completedTransactions
        .filter(t => new Date(t.created_at) >= thirtyDaysAgo)
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const previousSpending = completedTransactions
        .filter(t => {
          const date = new Date(t.created_at);
          return date >= sixtyDaysAgo && date < thirtyDaysAgo;
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const spendingChange = previousSpending > 0
        ? ((recentSpending - previousSpending) / previousSpending) * 100
        : 0;

      // Generate adoption trend (last 6 months)
      const adoptionTrend = generateMonthlyTrend(adoptions, 6, 'created_at');

      // Generate spending trend (last 6 months)
      const spendingTrend = generateMonthlyTrend(
        completedTransactions,
        6,
        'created_at',
        'amount'
      );

      // Generate recommended listings based on seeker's preferences
      const recommendedListings = await generateRecommendedListings(profile);

      // Generate recent activity
      const recentActivity = generateRecentActivity(adoptions, transactions);

      return {
        activeAdoptions,
        completedAdoptions,
        totalSpent,
        spendingChange,
        adoptionTrend,
        spendingTrend,
        recommendedListings,
        recentActivity,
      };
    },
    enabled: !!profile?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

function generateMonthlyTrend(
  items: any[],
  months: number,
  dateField: string,
  valueField?: string
) {
  const now = new Date();
  const trend = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });

    const monthItems = items.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate.getMonth() === date.getMonth() &&
        itemDate.getFullYear() === date.getFullYear();
    });

    const value = valueField
      ? monthItems.reduce((sum, item) => sum + (item[valueField] || 0), 0)
      : monthItems.length;

    trend.push({
      month: monthName,
      [valueField ? valueField.replace('amount', 'spending') : 'adoptions']: value,
    });
  }

  return trend;
}

function generateRecentActivity(adoptions: any[], transactions: any[]) {
  const activities = [];

  // Add recent adoptions
  adoptions.slice(0, 3).forEach(app => {
    activities.push({
      id: `app-${app.id}`,
      type: 'adoption' as const,
      title: `Applied for ${app.listings?.title || 'listing'}`,
      timestamp: app.created_at,
      status: app.status,
    });
  });

  // Add recent payments
  transactions.slice(0, 2).forEach(transaction => {
    activities.push({
      id: `payment-${transaction.id}`,
      type: 'payment' as const,
      title: `Payment made: $${transaction.amount}`,
      timestamp: transaction.created_at,
    });
  });

  // Sort by timestamp and take most recent 5
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
}

async function generateRecommendedListings(profile: any) {
  try {
    // Get seeker's preferences from user_breeds table
    const { data: userBreeds } = await supabase
      .from('user_breeds')
      .select('breed_id, breeds(name)')
      .eq('user_id', profile.id);

    // @ts-ignore
    const preferredBreeds = userBreeds?.map(ub => ub.breeds?.name).filter(Boolean) || [];

    // Get listings that match seeker's preferred breeds and location
    let query = supabase
      .from('listings')
      .select(`
        id,
        title,
        price,
        photos,
        location_text,
        status,
        breeds(name)
      `)
      .eq('status', 'active')
      .neq('owner_id', profile.id); // Don't show own listings

    // Filter by preferred breeds if seeker has preferences
    if (preferredBreeds.length > 0) {
      query = query.in('breed_id', userBreeds?.map(ub => ub.breed_id) || []);
    }

    // Filter by location proximity (same city/country for now)
    if (profile.location_text) {
      query = query.ilike('location_text', `%${profile.location_text}%`);
    }

    const { data: listings } = await query.limit(6);

    // Calculate match scores and format listings
    const recommendedListings = listings?.map(listing => {
      let matchScore = 50; // Base score

      // Higher score for exact breed matches
      // @ts-ignore
      if (preferredBreeds.includes(listing.breeds?.name)) {
        matchScore += 30;
      }

      // Higher score for location matches
      if (profile.location_text && listing.location_text?.toLowerCase().includes(profile.location_text.toLowerCase())) {
        matchScore += 20;
      }

      return {
        id: listing.id,
        title: listing.title,
        price: listing.price,
        photos: listing.photos || [],
        // @ts-ignore
        breed: listing.breeds?.name || 'Unknown',
        location: listing.location_text || 'Unknown',
        matchScore: Math.min(matchScore, 100), // Cap at 100
      };
    }).sort((a, b) => b.matchScore - a.matchScore) || [];

    return recommendedListings.slice(0, 4); // Return top 4 matches
  } catch (error) {
    console.error('Error generating recommended listings:', error);
    return [];
  }
}
