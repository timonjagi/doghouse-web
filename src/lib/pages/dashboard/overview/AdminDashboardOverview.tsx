import React from 'react';
import {
  Box,
  Grid,
  VStack,
  HStack,
  Text,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiUsers, FiList, FiDollarSign, FiShield, FiTrendingUp, FiBarChart } from 'react-icons/fi';
import { useRouter } from 'next/router';

import { useAdminDashboardStats } from '../../../hooks/queries/useAdminDashboardStats';
import { MetricCard } from '../../../components/ui/charts/MetricCard';
import { LineChart } from '../../../components/ui/charts/LineChart';
import { BarChart } from '../../../components/ui/charts/BarChart';

const AdminDashboardOverview: React.FC = () => {
  const router = useRouter();
  const { data: stats, isLoading } = useAdminDashboardStats();

  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'verify-breeders':
        router.push('/dashboard/admin/verification');
        break;
      case 'manage-users':
        router.push('/dashboard/admin/users');
        break;
      case 'view-analytics':
        router.push('/dashboard/admin/analytics');
        break;
      case 'process-payouts':
        router.push('/dashboard/admin/payouts');
        break;
    }
  };

  if (isLoading) {
    return (
      <Box p={6}>
        <VStack spacing={6} align="stretch">
          <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
            {[...Array(4)].map((_, i) => (
              <MetricCard key={i} isLoading title="" value="" />
            ))}
          </Grid>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={6} bg={bgColor} minH="100vh">
      <VStack spacing={8} align="stretch">
        {/* Welcome Header */}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            Platform Administration
          </Text>
          <Text color="gray.600" fontSize="lg">
            Monitor platform health and manage operations.
          </Text>
        </Box>

        {/* Key Metrics */}
        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
          <MetricCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={FiUsers}
            colorScheme="blue"
          />
          <MetricCard
            title="Pending Verifications"
            value={stats?.pendingVerifications || 0}
            icon={FiShield}
            colorScheme="orange"
          />
          <MetricCard
            title="Active Listings"
            value={stats?.activeListings || 0}
            icon={FiList}
            colorScheme="green"
          />
          <MetricCard
            title="Total Revenue"
            value={`$${stats?.totalRevenue?.toLocaleString() || 0}`}
            change={{
              value: stats?.revenueChange || 0,
              type: (stats?.revenueChange || 0) >= 0 ? 'increase' : 'decrease',
            }}
            icon={FiDollarSign}
            colorScheme="purple"
          />
        </Grid>

        {/* Charts Section */}
        <Grid templateColumns="repeat(auto-fit, minmax(400px, 1fr))" gap={6}>
          <LineChart
            data={stats?.userGrowthTrend || []}
            xKey="month"
            yKey="users"
            title="User Growth"
            color="#3182ce"
            height="300px"
          />
          <BarChart
            data={stats?.revenueTrend || []}
            xKey="month"
            yKey="revenue"
            title="Revenue Trends"
            color="#805ad5"
            height="300px"
          />
        </Grid>

        {/* Quick Actions */}
        <Box>
          <Text fontSize="xl" fontWeight="semibold" mb={4}>
            Administrative Actions
          </Text>
          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
            <Button
              leftIcon={<FiShield />}
              colorScheme="orange"
              variant="outline"
              size="lg"
              height="60px"
              onClick={() => handleQuickAction('verify-breeders')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s"
            >
              Verify Breeders
            </Button>
            <Button
              leftIcon={<FiUsers />}
              colorScheme="blue"
              variant="outline"
              size="lg"
              height="60px"
              onClick={() => handleQuickAction('manage-users')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s"
            >
              Manage Users
            </Button>
            <Button
              leftIcon={<FiBarChart />}
              colorScheme="purple"
              variant="outline"
              size="lg"
              height="60px"
              onClick={() => handleQuickAction('view-analytics')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s"
            >
              View Analytics
            </Button>
            <Button
              leftIcon={<FiDollarSign />}
              colorScheme="green"
              variant="outline"
              size="lg"
              height="60px"
              onClick={() => handleQuickAction('process-payouts')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s"
            >
              Process Payouts
            </Button>
          </Grid>
        </Box>

        {/* Recent Activity */}
        <Box>
          <Text fontSize="xl" fontWeight="semibold" mb={4}>
            Recent Platform Activity
          </Text>
          <VStack spacing={3} align="stretch">
            {stats?.recentActivity?.map((activity) => (
              <HStack
                key={activity.id}
                p={4}
                bg="white"
                borderRadius="md"
                shadow="sm"
                border="1px"
                borderColor="gray.200"
              >
                <Box flex={1}>
                  <Text fontWeight="medium">{activity.title}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </Text>
                </Box>
                {activity.status && (
                  <Text
                    fontSize="sm"
                    px={2}
                    py={1}
                    borderRadius="sm"
                    bg={
                      activity.status === 'pending'
                        ? 'orange.100'
                        : activity.status === 'completed'
                          ? 'green.100'
                          : 'gray.100'
                    }
                    color={
                      activity.status === 'pending'
                        ? 'orange.800'
                        : activity.status === 'completed'
                          ? 'green.800'
                          : 'gray.800'
                    }
                  >
                    {activity.status}
                  </Text>
                )}
              </HStack>
            )) || []}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default AdminDashboardOverview;
