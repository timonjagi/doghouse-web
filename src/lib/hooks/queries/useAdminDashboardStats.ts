import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';

export interface AdminDashboardStats {
  totalUsers: number;
  pendingVerifications: number;
  activeListings: number;
  totalRevenue: number;
  revenueChange: number;
  userGrowthTrend: Array<{ month: string; users: number }>;
  revenueTrend: Array<{ month: string; revenue: number }>;
  recentActivity: Array<{
    id: string;
    type: 'user' | 'verification' | 'listing' | 'payment';
    title: string;
    timestamp: string;
    status?: string;
  }>;
}

export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async (): Promise<AdminDashboardStats> => {
      // Get total users count
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get pending verifications
      const { count: pendingVerifications } = await supabase
        .from('breeder_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('verified', false);

      // Get active listings count
      const { count: activeListings } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available');

      // Get all transactions for revenue calculation
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, status, created_at')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      // Calculate total revenue and revenue change
      const completedTransactions = transactions || [];
      const totalRevenue = completedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

      // Calculate revenue change (compare last 30 days vs previous 30 days)
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const recentRevenue = completedTransactions
        .filter(t => new Date(t.created_at) >= thirtyDaysAgo)
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const previousRevenue = completedTransactions
        .filter(t => {
          const date = new Date(t.created_at);
          return date >= sixtyDaysAgo && date < thirtyDaysAgo;
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const revenueChange = previousRevenue > 0
        ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

      // Get user registration trend (last 6 months)
      const { data: users } = await supabase
        .from('users')
        .select('created_at')
        .order('created_at', { ascending: false });

      const userGrowthTrend = generateMonthlyTrend(users || [], 6, 'created_at');

      // Generate revenue trend (last 6 months)
      const revenueTrend = generateMonthlyTrend(
        completedTransactions,
        6,
        'created_at',
        'amount'
      );

      // Generate recent activity
      const recentActivity = await generateRecentActivity();

      return {
        totalUsers: totalUsers || 0,
        pendingVerifications: pendingVerifications || 0,
        activeListings: activeListings || 0,
        totalRevenue,
        revenueChange,
        userGrowthTrend,
        revenueTrend,
        recentActivity,
      };
    },
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
      [valueField ? valueField.replace('amount', 'revenue') : 'users']: value,
    });
  }

  return trend;
}

async function generateRecentActivity() {
  const activities = [];

  // Get recent user registrations
  const { data: recentUsers } = await supabase
    .from('users')
    .select('id, display_name, created_at')
    .order('created_at', { ascending: false })
    .limit(2);

  recentUsers?.forEach(user => {
    activities.push({
      id: `user-${user.id}`,
      type: 'user' as const,
      title: `New user: ${user.display_name}`,
      timestamp: user.created_at,
    });
  });

  // Get recent breeder verification requests
  const { data: pendingVerifications } = await supabase
    .from('breeder_profiles')
    .select(`
      id,
      created_at,
      users (
        display_name
      )
    `)
    .eq('verified', false)
    .order('created_at', { ascending: false })
    .limit(2);

  pendingVerifications?.forEach(profile => {
    activities.push({
      id: `verification-${profile.id}`,
      type: 'verification' as const,
      // @ts-ignore
      title: `Verification request: ${profile.users?.display_name}`,
      timestamp: profile.created_at,
      status: 'pending',
    });
  });

  // Get recent listings
  const { data: recentListings } = await supabase
    .from('listings')
    .select('id, title, created_at')
    .order('created_at', { ascending: false })
    .limit(2);

  recentListings?.forEach(listing => {
    activities.push({
      id: `listing-${listing.id}`,
      type: 'listing' as const,
      title: `New listing: ${listing.title}`,
      timestamp: listing.created_at,
    });
  });

  // Get recent transactions
  const { data: recentTransactions } = await supabase
    .from('transactions')
    .select('id, amount, created_at')
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(2);

  recentTransactions?.forEach(transaction => {
    activities.push({
      id: `payment-${transaction.id}`,
      type: 'payment' as const,
      title: `Payment completed: $${transaction.amount}`,
      timestamp: transaction.created_at,
    });
  });

  // Sort by timestamp and take most recent 5
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
}
