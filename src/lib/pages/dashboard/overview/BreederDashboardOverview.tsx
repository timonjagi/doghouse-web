import React from 'react';
import {
  Box,
  Grid,
  GridItem,
  VStack,
  HStack,
  Text,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiTrendingUp, FiTrendingDown, FiPlus, FiEye, FiUsers, FiDollarSign } from 'react-icons/fi';
import { useRouter } from 'next/router';

import { useBreederDashboardStats } from '../../../hooks/queries/useBreederDashboardStats';
import { MetricCard } from '../../../components/ui/charts/MetricCard';
import { LineChart } from '../../../components/ui/charts/LineChart';
import { BarChart } from '../../../components/ui/charts/BarChart';

const BreederDashboardOverview: React.FC = () => {
  const router = useRouter();
  const { data: stats, isLoading } = useBreederDashboardStats();

  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-litter':
        router.push('/dashboard/listings');
        break;
      case 'view-applications':
        router.push('/dashboard/applications');
        break;
      case 'manage-breeds':
        router.push('/dashboard/breeds');
        break;
      case 'view-earnings':
        router.push('/dashboard/account/billing');
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
            Welcome back, Breeder!
          </Text>
          <Text color="gray.600" fontSize="lg">
            Here's what's happening with your listings and applications.
          </Text>
        </Box>

        {/* Key Metrics */}
        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
          <MetricCard
            title="Active Litters"
            value={stats?.activeLitters || 0}
            icon={FiUsers}
            colorScheme="blue"
          />
          <MetricCard
            title="Pending Applications"
            value={stats?.pendingApplications || 0}
            icon={FiEye}
            colorScheme="orange"
          />
          <MetricCard
            title="Total Earnings"
            value={`$${stats?.totalEarnings?.toLocaleString() || 0}`}
            change={{
              value: stats?.earningsChange || 0,
              type: (stats?.earningsChange || 0) >= 0 ? 'increase' : 'decrease',
            }}
            icon={FiDollarSign}
            colorScheme="green"
          />
          <MetricCard
            title="Application Rate"
            value={`${stats?.applicationTrend?.[stats.applicationTrend.length - 1]?.applications || 0}/month`}
            icon={FiTrendingUp}
            colorScheme="purple"
          />
        </Grid>

        {/* Charts Section */}
        <Grid templateColumns="repeat(auto-fit, minmax(400px, 1fr))" gap={6}>
          <LineChart
            data={stats?.applicationTrend || []}
            xKey="month"
            yKey="applications"
            title="Application Trends"
            color="#3182ce"
            height="300px"
          />
          <BarChart
            data={stats?.earningsTrend || []}
            xKey="month"
            yKey="earnings"
            title="Earnings Trends"
            color="#38a169"
            height="300px"
          />
        </Grid>

        {/* Potential Matches */}
        {stats?.potentialMatches && stats.potentialMatches.length > 0 && (
          <Box>
            <Text fontSize="xl" fontWeight="semibold" mb={4}>
              Potential Matches
            </Text>
            <Text color="gray.600" mb={4}>
              Seekers who recently viewed your listings and may be interested
            </Text>
            <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={4}>
              {stats.potentialMatches.map((match) => (
                <Box
                  key={match.id}
                  p={4}
                  bg="white"
                  borderRadius="lg"
                  shadow="md"
                  border="1px"
                  borderColor="gray.200"
                  _hover={{ shadow: 'lg' }}
                  transition="all 0.2s"
                >
                  <VStack spacing={3} align="stretch">
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text fontWeight="semibold" fontSize="md">
                          {match.name}
                        </Text>
                        <Text fontSize="sm" color="green.600" fontWeight="medium">
                          {match.matchScore}% match
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        📍 {match.location}
                      </Text>
                      {match.preferredBreeds.length > 0 && (
                        <Box>
                          <Text fontSize="sm" color="gray.700" fontWeight="medium" mb={1}>
                            Interested in:
                          </Text>
                          <HStack spacing={1} flexWrap="wrap">
                            {match.preferredBreeds.slice(0, 3).map((breed, index) => (
                              <Text
                                key={index}
                                fontSize="xs"
                                px={2}
                                py={1}
                                bg="blue.50"
                                color="blue.700"
                                borderRadius="sm"
                              >
                                {breed}
                              </Text>
                            ))}
                            {match.preferredBreeds.length > 3 && (
                              <Text fontSize="xs" color="gray.500">
                                +{match.preferredBreeds.length - 3} more
                              </Text>
                            )}
                          </HStack>
                        </Box>
                      )}
                    </Box>
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        flex={1}
                        onClick={() => router.push(`/dashboard/inbox?contact=${match.id}`)}
                      >
                        Message
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="green"
                        variant="outline"
                        flex={1}
                        onClick={() => router.push('/dashboard/listings')}
                      >
                        View Listings
                      </Button>
                    </HStack>
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      Last viewed {new Date(match.lastViewed).toLocaleDateString()}
                    </Text>
                  </VStack>
                </Box>
              ))}
            </Grid>
          </Box>
        )}

        {/* Quick Actions */}
        <Box>
          <Text fontSize="xl" fontWeight="semibold" mb={4}>
            Quick Actions
          </Text>
          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              variant="outline"
              size="lg"
              height="60px"
              onClick={() => handleQuickAction('add-litter')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s"
            >
              Add New Litter
            </Button>
            <Button
              leftIcon={<FiEye />}
              colorScheme="orange"
              variant="outline"
              size="lg"
              height="60px"
              onClick={() => handleQuickAction('view-applications')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s"
            >
              View Applications
            </Button>
            <Button
              leftIcon={<FiUsers />}
              colorScheme="purple"
              variant="outline"
              size="lg"
              height="60px"
              onClick={() => handleQuickAction('manage-breeds')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s"
            >
              Manage Breeds
            </Button>
            <Button
              leftIcon={<FiDollarSign />}
              colorScheme="green"
              variant="outline"
              size="lg"
              height="60px"
              onClick={() => handleQuickAction('view-earnings')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s"
            >
              View Earnings
            </Button>
          </Grid>
        </Box>

        {/* Recent Activity */}
        <Box>
          <Text fontSize="xl" fontWeight="semibold" mb={4}>
            Recent Activity
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
                        : activity.status === 'approved'
                          ? 'green.100'
                          : 'gray.100'
                    }
                    color={
                      activity.status === 'pending'
                        ? 'orange.800'
                        : activity.status === 'approved'
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

export default BreederDashboardOverview;
