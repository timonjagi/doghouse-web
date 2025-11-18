import { useQuery } from '@tanstack/react-query';
import { useUserProfile } from './useUserProfile';
import { useApplicationsByUser } from './useApplications';
import { useTransactions } from './useTransactions';
import { useListings } from './useListings';
import { supabase } from 'lib/supabase/client';

export interface SeekerDashboardStats {
  activeApplications: number;
  completedApplications: number;
  totalSpent: number;
  spendingChange: number;
  applicationTrend: Array<{ month: string; applications: number }>;
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
    type: 'application' | 'payment' | 'match';
    title: string;
    timestamp: string;
    status?: string;
  }>;
}

export const useSeekerDashboardStats = () => {
  const { data: profile } = useUserProfile();

  // Get seeker's applications
  const { data: applications = [] } = useApplicationsByUser(profile?.id);

  // Get transactions for seeker (useTransactions automatically filters for current user)
  const { data: transactions = [] } = useTransactions();

  return useQuery({
    queryKey: ['seeker-dashboard-stats', profile?.id],
    queryFn: async (): Promise<SeekerDashboardStats> => {
      if (!profile?.id) {
        return {
          recommendedListings: [],
          activeApplications: 0,
          completedApplications: 0,
          totalSpent: 0,
          spendingChange: 0,
          applicationTrend: [],
          spendingTrend: [],
          recentActivity: [],
        };
      }

      // Calculate metrics
      const activeApplications = applications.filter(app =>
        ['submitted', 'pending', 'approved'].includes(app.status)
      ).length;

      const completedApplications = applications.filter(app =>
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

      // Generate application trend (last 6 months)
      const applicationTrend = generateMonthlyTrend(applications, 6, 'created_at');

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
      const recentActivity = generateRecentActivity(applications, transactions);

      return {
        activeApplications,
        completedApplications,
        totalSpent,
        spendingChange,
        applicationTrend,
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
      [valueField ? valueField.replace('amount', 'spending') : 'applications']: value,
    });
  }

  return trend;
}

function generateRecentActivity(applications: any[], transactions: any[]) {
  const activities = [];

  // Add recent applications
  applications.slice(0, 3).forEach(app => {
    activities.push({
      id: `app-${app.id}`,
      type: 'application' as const,
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
        location,
        status,
        breeds(name)
      `)
      .eq('status', 'active')
      .neq('breeder_id', profile.id); // Don't show own listings

    // Filter by preferred breeds if seeker has preferences
    if (preferredBreeds.length > 0) {
      query = query.in('breed_id', userBreeds?.map(ub => ub.breed_id) || []);
    }

    // Filter by location proximity (same city/country for now)
    if (profile.location) {
      query = query.ilike('location', `%${profile.location}%`);
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
      if (profile.location && listing.location?.toLowerCase().includes(profile.location.toLowerCase())) {
        matchScore += 20;
      }

      return {
        id: listing.id,
        title: listing.title,
        price: listing.price,
        photos: listing.photos || [],
        // @ts-ignore
        breed: listing.breeds?.name || 'Unknown',
        location: listing.location || 'Unknown',
        matchScore: Math.min(matchScore, 100), // Cap at 100
      };
    }).sort((a, b) => b.matchScore - a.matchScore) || [];

    return recommendedListings.slice(0, 4); // Return top 4 matches
  } catch (error) {
    console.error('Error generating recommended listings:', error);
    return [];
  }
}
