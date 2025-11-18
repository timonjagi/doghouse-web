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
import { FiSearch, FiClipboard, FiTarget, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { useRouter } from 'next/router';

import { useSeekerDashboardStats } from '../../../hooks/queries/useSeekerDashboardStats';
import { MetricCard } from '../../../components/ui/charts/MetricCard';
import { LineChart } from '../../../components/ui/charts/LineChart';
import { PieChart } from '../../../components/ui/charts/PieChart';
import { useUserProfile } from 'lib/hooks/queries/useUserProfile';
import { Loader } from 'lib/components/ui/Loader';

const SeekerDashboardOverview: React.FC = () => {
  const router = useRouter();
  const { data: stats, isLoading } = useSeekerDashboardStats();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'browse-listings':
        router.push('/dashboard/listings');
        break;
      case 'view-applications':
        router.push('/dashboard/applications');
        break;
      case 'find-matches':
        router.push('/dashboard/matches');
        break;
      case 'update-preferences':
        router.push('/dashboard/account/preferences');
        break;
    }
  };

  // Prepare application status data for pie chart
  const applicationStatusData = React.useMemo(() => {
    if (!stats?.activeApplications && !stats?.completedApplications) return [];

    return [
      {
        name: 'Active',
        value: stats.activeApplications || 0,
      },
      {
        name: 'Completed',
        value: stats.completedApplications || 0,
      },
    ].filter(item => item.value > 0);
  }, [stats]);

  if (isLoading) {
    return (
      <Loader />
    );
  }

  return (
    <Box p={6} bg={bgColor} minH="100vh">
      <VStack spacing={8} align="stretch">
        {/* Welcome Header */}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            Welcome back, {profile?.display_name}!
          </Text>
          <Text color="gray.600" fontSize="lg">
            Find your perfect companion. Here's your application progress.
          </Text>
        </Box>

        {/* Key Metrics */}
        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
          <MetricCard
            title="Active Applications"
            value={stats?.activeApplications || 0}
            icon={FiClipboard}
            colorScheme="blue"
          />
          <MetricCard
            title="Completed Adoptions"
            value={stats?.completedApplications || 0}
            icon={FiTarget}
            colorScheme="green"
          />
          <MetricCard
            title="Total Spent"
            value={`$${stats?.totalSpent?.toLocaleString() || 0}`}
            change={{
              value: stats?.spendingChange || 0,
              type: (stats?.spendingChange || 0) >= 0 ? 'increase' : 'decrease',
            }}
            icon={FiTrendingUp}
            colorScheme="purple"
          />
          <MetricCard
            title="Application Rate"
            value={`${stats?.applicationTrend?.[stats.applicationTrend.length - 1]?.applications || 0}/month`}
            icon={FiTrendingDown}
            colorScheme="orange"
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
          <PieChart
            data={applicationStatusData}
            title="Application Status"
            height="300px"
          />
        </Grid>

        {/* Recommended Listings */}
        {stats?.recommendedListings && stats.recommendedListings.length > 0 && (
          <Box>
            <Text fontSize="xl" fontWeight="semibold" mb={4}>
              Recommended for You
            </Text>
            <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={4}>
              {stats.recommendedListings.map((listing) => (
                <Box
                  key={listing.id}
                  p={4}
                  bg="white"
                  borderRadius="lg"
                  shadow="md"
                  border="1px"
                  borderColor="gray.200"
                  cursor="pointer"
                  onClick={() => router.push(`/dashboard/listings/${listing.id}`)}
                  _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                  transition="all 0.2s"
                >
                  <HStack spacing={3} mb={3}>
                    <Box
                      w="60px"
                      h="60px"
                      borderRadius="md"
                      bg="gray.200"
                      bgImage={listing.photos[0] ? `url(${listing.photos[0]})` : undefined}
                      bgSize="cover"
                      bgPosition="center"
                    />
                    <Box flex={1}>
                      <Text fontWeight="semibold" fontSize="md" noOfLines={1}>
                        {listing.title}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {listing.breed} • {listing.location}
                      </Text>
                      <HStack spacing={2} mt={1}>
                        <Text fontSize="sm" color="green.600" fontWeight="medium">
                          {listing.matchScore}% match
                        </Text>
                        {listing.price && (
                          <Text fontSize="sm" color="gray.500">
                            ${listing.price}
                          </Text>
                        )}
                      </HStack>
                    </Box>
                  </HStack>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                    width="full"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/listings/${listing.id}`);
                    }}
                  >
                    View Details
                  </Button>
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
              leftIcon={<FiSearch />}
              colorScheme="blue"
              variant="outline"
              size="lg"
              height="60px"
              onClick={() => handleQuickAction('browse-listings')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s"
            >
              Browse Listings
            </Button>
            <Button
              leftIcon={<FiClipboard />}
              colorScheme="orange"
              variant="outline"
              size="lg"
              height="60px"
              onClick={() => handleQuickAction('view-applications')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s"
            >
              My Applications
            </Button>
            <Button
              leftIcon={<FiTarget />}
              colorScheme="green"
              variant="outline"
              size="lg"
              height="60px"
              onClick={() => handleQuickAction('find-matches')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s"
            >
              Find Matches
            </Button>
            <Button
              leftIcon={<FiTrendingUp />}
              colorScheme="purple"
              variant="outline"
              size="lg"
              height="60px"
              onClick={() => handleQuickAction('update-preferences')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s"
            >
              Update Preferences
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
                          : activity.status === 'submitted'
                            ? 'blue.100'
                            : 'gray.100'
                    }
                    color={
                      activity.status === 'pending'
                        ? 'orange.800'
                        : activity.status === 'approved'
                          ? 'green.800'
                          : activity.status === 'submitted'
                            ? 'blue.800'
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

export default SeekerDashboardOverview;
