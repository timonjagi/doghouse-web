import React, { useState, useMemo } from "react";
import {
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Box,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Select,
  Alert,
  AlertIcon,
  Spinner,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiList,
  FiDollarSign,
  FiTarget,
  FiMapPin,
  FiBarChart,
  FiDownload,
  FiCalendar,
  FiRefreshCw,
} from "react-icons/fi";
import { useUserProfile } from "../../../hooks/queries";
import {
  useAnalyticsMetrics,
  useAnalyticsTimeSeries,
} from "../../../hooks/queries/useAdminAnalytics";
import { NextSeo } from "next-seo";
import { Loader } from "../../ui/Loader";

const AdminAnalyticsPage: React.FC = () => {
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const toast = useToast();

  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">(
    "30d"
  );

  const filters = useMemo(
    () => ({
      period: timeRange,
    }),
    [timeRange]
  );

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    refetch: refetchAnalytics,
  } = useAnalyticsMetrics(filters);

  const { data: timeSeriesData, isLoading: timeSeriesLoading } =
    useAnalyticsTimeSeries(filters);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (profileLoading || analyticsLoading) {
    return <Loader />;
  }

  if (!userProfile || userProfile.role !== "admin") {
    return (
      <Container maxW="7xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <Text>Access denied. Admin privileges required.</Text>
        </Alert>
      </Container>
    );
  }

  const formatCurrency = (amount: number) => {
    return `Ksh. ${amount.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your analytics report is being prepared for download.",
      status: "info",
      duration: 3000,
    });
    // In a real implementation, this would trigger a download
  };

  const handleRefresh = () => {
    refetchAnalytics();
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated.",
      status: "success",
      duration: 2000,
    });
  };

  return (
    <>
      <NextSeo title="Platform Analytics - Admin Dashboard" />

      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="start">
            <Box>
              <Heading size="lg" mb={2}>
                Platform Analytics
              </Heading>
              <Text color="gray.600">
                Monitor platform performance, user engagement, and key metrics.
                Track adoption success rates and platform growth.
              </Text>
            </Box>
            <HStack>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                maxW="150px"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </Select>
              <Button
                leftIcon={<FiRefreshCw />}
                variant="outline"
                onClick={handleRefresh}
                isLoading={analyticsLoading}
              >
                Refresh
              </Button>
              <Button
                leftIcon={<FiDownload />}
                colorScheme="blue"
                onClick={handleExport}
              >
                Export Report
              </Button>
            </HStack>
          </HStack>

          {/* Key Metrics Overview */}
          {analyticsData && (
            <>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                <Card>
                  <CardBody>
                    <Stat>
                      <StatLabel>User Growth</StatLabel>
                      <StatNumber>
                        {formatPercentage(
                          analyticsData.userMetrics.userGrowthRate
                        )}
                      </StatNumber>
                      <StatHelpText>
                        <HStack>
                          <StatArrow
                            type={
                              analyticsData.userMetrics.userGrowthRate >= 0
                                ? "increase"
                                : "decrease"
                            }
                          />
                          <Text>
                            {analyticsData.userMetrics.newUsersThisMonth} new
                            this month
                          </Text>
                        </HStack>
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <Stat>
                      <StatLabel>Revenue Growth</StatLabel>
                      <StatNumber>
                        {formatPercentage(
                          analyticsData.transactionMetrics.revenueGrowthRate
                        )}
                      </StatNumber>
                      <StatHelpText>
                        <HStack>
                          <StatArrow
                            type={
                              analyticsData.transactionMetrics
                                .revenueGrowthRate >= 0
                                ? "increase"
                                : "decrease"
                            }
                          />
                          <Text>
                            {formatCurrency(
                              analyticsData.transactionMetrics.revenueThisMonth
                            )}{" "}
                            this month
                          </Text>
                        </HStack>
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <Stat>
                      <StatLabel>Adoption Success</StatLabel>
                      <StatNumber>
                        {analyticsData.adoptionMetrics.adoptionSuccessRate.toFixed(
                          1
                        )}
                        %
                      </StatNumber>
                      <StatHelpText>
                        {analyticsData.adoptionMetrics.completedAdoptions} of{" "}
                        {analyticsData.adoptionMetrics.totalAdoptions} completed
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <Stat>
                      <StatLabel>Avg. Transaction</StatLabel>
                      <StatNumber>
                        {formatCurrency(
                          Math.round(
                            analyticsData.transactionMetrics
                              .averageTransactionValue
                          )
                        )}
                      </StatNumber>
                      <StatHelpText>Per successful transaction</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              </SimpleGrid>

              <Tabs>
                <TabList>
                  <Tab>Overview</Tab>
                  <Tab>Users</Tab>
                  <Tab>Listings</Tab>
                  <Tab>Revenue</Tab>
                  <Tab>Geography</Tab>
                </TabList>

                <TabPanels>
                  {/* Overview Tab */}
                  <TabPanel>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      <Card>
                        <CardHeader>
                          <Heading size="md">User Engagement</Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={4} align="stretch">
                            <Box>
                              <HStack justify="space-between">
                                <Text fontSize="sm">Active Users</Text>
                                <Text fontSize="sm" fontWeight="bold">
                                  {analyticsData.userMetrics.activeUsers}
                                </Text>
                              </HStack>
                              <Progress
                                value={
                                  (analyticsData.userMetrics.activeUsers /
                                    analyticsData.userMetrics.totalUsers) *
                                  100
                                }
                                colorScheme="blue"
                                size="sm"
                                mt={2}
                              />
                            </Box>
                            <Box>
                              <HStack justify="space-between">
                                <Text fontSize="sm">User Retention</Text>
                                <Text fontSize="sm" fontWeight="bold">
                                  {analyticsData.userMetrics.userRetentionRate}%
                                </Text>
                              </HStack>
                              <Progress
                                value={
                                  analyticsData.userMetrics.userRetentionRate
                                }
                                colorScheme="green"
                                size="sm"
                                mt={2}
                              />
                            </Box>
                          </VStack>
                        </CardBody>
                      </Card>

                      <Card>
                        <CardHeader>
                          <Heading size="md">Listing Performance</Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={4} align="stretch">
                            <Box>
                              <HStack justify="space-between">
                                <Text fontSize="sm">Active Listings</Text>
                                <Text fontSize="sm" fontWeight="bold">
                                  {analyticsData.listingMetrics.activeListings}
                                </Text>
                              </HStack>
                              <Progress
                                value={
                                  (analyticsData.listingMetrics.activeListings /
                                    analyticsData.listingMetrics
                                      .totalListings) *
                                  100
                                }
                                colorScheme="orange"
                                size="sm"
                                mt={2}
                              />
                            </Box>
                            <Box>
                              <HStack justify="space-between">
                                <Text fontSize="sm">Avg. Price</Text>
                                <Text fontSize="sm" fontWeight="bold">
                                  {formatCurrency(
                                    Math.round(
                                      analyticsData.listingMetrics
                                        .averageListingPrice
                                    )
                                  )}
                                </Text>
                              </HStack>
                            </Box>
                          </VStack>
                        </CardBody>
                      </Card>

                      <Card>
                        <CardHeader>
                          <Heading size="md">Revenue Breakdown</Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={4} align="stretch">
                            <Box>
                              <HStack justify="space-between">
                                <Text fontSize="sm">Total Revenue</Text>
                                <Text fontSize="sm" fontWeight="bold">
                                  {formatCurrency(
                                    analyticsData.transactionMetrics
                                      .totalRevenue
                                  )}
                                </Text>
                              </HStack>
                            </Box>
                            <Box>
                              <HStack justify="space-between">
                                <Text fontSize="sm">Transactions</Text>
                                <Text fontSize="sm" fontWeight="bold">
                                  {
                                    analyticsData.transactionMetrics
                                      .totalTransactions
                                  }
                                </Text>
                              </HStack>
                            </Box>
                          </VStack>
                        </CardBody>
                      </Card>
                    </SimpleGrid>
                  </TabPanel>

                  {/* Users Tab */}
                  <TabPanel>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <Card>
                        <CardHeader>
                          <Heading size="md">User Statistics</Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={4} align="stretch">
                            <Box>
                              <HStack justify="space-between">
                                <Text>Total Users</Text>
                                <Badge colorScheme="blue" fontSize="md">
                                  {analyticsData.userMetrics.totalUsers}
                                </Badge>
                              </HStack>
                            </Box>
                            <Box>
                              <HStack justify="space-between">
                                <Text>New Users (This Month)</Text>
                                <Badge colorScheme="green" fontSize="md">
                                  {analyticsData.userMetrics.newUsersThisMonth}
                                </Badge>
                              </HStack>
                            </Box>
                            <Box>
                              <HStack justify="space-between">
                                <Text>Active Users</Text>
                                <Badge colorScheme="purple" fontSize="md">
                                  {analyticsData.userMetrics.activeUsers}
                                </Badge>
                              </HStack>
                            </Box>
                          </VStack>
                        </CardBody>
                      </Card>

                      <Card>
                        <CardHeader>
                          <Heading size="md">User Distribution</Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={4} align="stretch">
                            <Text fontSize="sm" color="gray.600">
                              User types across the platform
                            </Text>
                            <Box>
                              <HStack justify="space-between" mb={2}>
                                <Text fontSize="sm">Breeders</Text>
                                <Text fontSize="sm" fontWeight="bold">
                                  {analyticsData.userMetrics.breedersCount}
                                </Text>
                              </HStack>
                              <Progress
                                value={
                                  (analyticsData.userMetrics.breedersCount /
                                    analyticsData.userMetrics.totalUsers) *
                                  100
                                }
                                colorScheme="blue"
                                size="sm"
                              />
                            </Box>
                            <Box>
                              <HStack justify="space-between" mb={2}>
                                <Text fontSize="sm">Seekers</Text>
                                <Text fontSize="sm" fontWeight="bold">
                                  {analyticsData.userMetrics.seekersCount}
                                </Text>
                              </HStack>
                              <Progress
                                value={
                                  (analyticsData.userMetrics.seekersCount /
                                    analyticsData.userMetrics.totalUsers) *
                                  100
                                }
                                colorScheme="green"
                                size="sm"
                              />
                            </Box>
                          </VStack>
                        </CardBody>
                      </Card>
                    </SimpleGrid>
                  </TabPanel>

                  {/* Listings Tab */}
                  <TabPanel>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <Card>
                        <CardHeader>
                          <Heading size="md">Listing Statistics</Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={4} align="stretch">
                            <Box>
                              <HStack justify="space-between">
                                <Text>Total Listings</Text>
                                <Badge colorScheme="blue" fontSize="md">
                                  {analyticsData.listingMetrics.totalListings}
                                </Badge>
                              </HStack>
                            </Box>
                            <Box>
                              <HStack justify="space-between">
                                <Text>Active Listings</Text>
                                <Badge colorScheme="green" fontSize="md">
                                  {analyticsData.listingMetrics.activeListings}
                                </Badge>
                              </HStack>
                            </Box>
                            <Box>
                              <HStack justify="space-between">
                                <Text>New This Month</Text>
                                <Badge colorScheme="purple" fontSize="md">
                                  {
                                    analyticsData.listingMetrics
                                      .newListingsThisMonth
                                  }
                                </Badge>
                              </HStack>
                            </Box>
                          </VStack>
                        </CardBody>
                      </Card>

                      <Card>
                        <CardHeader>
                          <Heading size="md">Top Breeds</Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={3} align="stretch">
                            {analyticsData.listingMetrics.listingsByBreed
                              .slice(0, 5)
                              .map((item, index) => (
                                <HStack
                                  key={item.breed}
                                  justify="space-between"
                                >
                                  <HStack>
                                    <Badge colorScheme="gray" fontSize="xs">
                                      #{index + 1}
                                    </Badge>
                                    <Text fontSize="sm">{item.breed}</Text>
                                  </HStack>
                                  <Badge colorScheme="blue" variant="subtle">
                                    {item.count}
                                  </Badge>
                                </HStack>
                              ))}
                          </VStack>
                        </CardBody>
                      </Card>
                    </SimpleGrid>
                  </TabPanel>

                  {/* Revenue Tab */}
                  <TabPanel>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <Card>
                        <CardHeader>
                          <Heading size="md">Revenue Overview</Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={4} align="stretch">
                            <Box>
                              <HStack justify="space-between">
                                <Text>Total Revenue</Text>
                                <Text fontWeight="bold" fontSize="lg">
                                  {formatCurrency(
                                    analyticsData.transactionMetrics
                                      .totalRevenue
                                  )}
                                </Text>
                              </HStack>
                            </Box>
                            <Box>
                              <HStack justify="space-between">
                                <Text>This Month</Text>
                                <Text fontWeight="bold" color="green.600">
                                  {formatCurrency(
                                    analyticsData.transactionMetrics
                                      .revenueThisMonth
                                  )}
                                </Text>
                              </HStack>
                            </Box>
                            <Box>
                              <HStack justify="space-between">
                                <Text>Average Transaction</Text>
                                <Text fontWeight="bold">
                                  {formatCurrency(
                                    Math.round(
                                      analyticsData.transactionMetrics
                                        .averageTransactionValue
                                    )
                                  )}
                                </Text>
                              </HStack>
                            </Box>
                            <Box>
                              <HStack justify="space-between">
                                <Text>Transactions</Text>
                                <Badge colorScheme="blue" fontSize="md">
                                  {
                                    analyticsData.transactionMetrics
                                      .totalTransactions
                                  }
                                </Badge>
                              </HStack>
                            </Box>
                          </VStack>
                        </CardBody>
                      </Card>

                      <Card>
                        <CardHeader>
                          <Heading size="md">Revenue Trend</Heading>
                        </CardHeader>
                        <CardBody>
                          {timeSeriesLoading ? (
                            <Spinner />
                          ) : (
                            <VStack spacing={3} align="stretch">
                              <Text fontSize="sm" color="gray.600">
                                Daily revenue for selected period
                              </Text>
                              {timeSeriesData?.slice(-7).map((day) => (
                                <HStack key={day.date} justify="space-between">
                                  <Text fontSize="sm">
                                    {new Date(day.date).toLocaleDateString()}
                                  </Text>
                                  <Text fontSize="sm" fontWeight="bold">
                                    {formatCurrency(day.revenue)}
                                  </Text>
                                </HStack>
                              ))}
                            </VStack>
                          )}
                        </CardBody>
                      </Card>
                    </SimpleGrid>
                  </TabPanel>

                  {/* Geography Tab */}
                  <TabPanel>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <Card>
                        <CardHeader>
                          <Heading size="md">Top Locations</Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={3} align="stretch">
                            {analyticsData.geographicMetrics.topLocations.map(
                              (location, index) => (
                                <HStack
                                  key={location.location}
                                  justify="space-between"
                                >
                                  <HStack>
                                    <Icon as={FiMapPin} color="gray.400" />
                                    <Text>{location.location}</Text>
                                  </HStack>
                                  <Badge colorScheme="blue">
                                    {location.count}
                                  </Badge>
                                </HStack>
                              )
                            )}
                          </VStack>
                        </CardBody>
                      </Card>

                      <Card>
                        <CardHeader>
                          <Heading size="md">
                            User Distribution by Country
                          </Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={3} align="stretch">
                            {analyticsData.geographicMetrics.userDistribution.map(
                              (country) => (
                                <Box key={country.country}>
                                  <HStack justify="space-between" mb={1}>
                                    <Text fontSize="sm">{country.country}</Text>
                                    <Text fontSize="sm" fontWeight="bold">
                                      {country.count}
                                    </Text>
                                  </HStack>
                                  <Progress
                                    value={
                                      (country.count /
                                        analyticsData.userMetrics.totalUsers) *
                                      100
                                    }
                                    colorScheme="green"
                                    size="sm"
                                  />
                                </Box>
                              )
                            )}
                          </VStack>
                        </CardBody>
                      </Card>
                    </SimpleGrid>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </>
          )}
        </VStack>
      </Container>
    </>
  );
};

export default AdminAnalyticsPage;
