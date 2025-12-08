import React from 'react';
import {
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  CardHeader,
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Badge,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  Divider,
} from '@chakra-ui/react';
import {
  FiCreditCard,
  FiCalendar,
  FiDownload,
} from 'react-icons/fi';
import { useUserProfile } from 'lib/hooks/queries';
import { useBillingHistory, useTransactionStats } from 'lib/hooks/queries/useTransactions';
import { Loader } from 'lib/components/ui/Loader';

const EarningsPage: React.FC = () => {
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: billingHistory, isLoading: billingLoading } = useBillingHistory();
  const { data: stats, isLoading: statsLoading } = useTransactionStats();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (profileLoading || billingLoading || statsLoading) {
    return <Loader />;
  }

  if (!userProfile || userProfile.role !== 'breeder') {
    return (
      <Container maxW="7xl" py={8}>
        <Text>Access denied. This page is for breeders only.</Text>
      </Container>
    );
  }

  const earnings = billingHistory?.earnings || [];
  const totalEarned = stats?.totalEarned || 0;
  const pendingPayouts = earnings.filter(e => e.payout_status === 'pending').length;

  const formatCurrency = (amount: number) => {
    return `Ksh. ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'yellow';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  return (
    <VStack spacing={8} align="stretch">
      {/* Header */}
      <Box>
        <Heading size={{ base: 'sm', lg: 'md' }} mb={2} >Your Earnings</Heading>
        <Text color="gray.600">
          Track your earnings, payouts, and commission history
        </Text>
      </Box>

      {/* Stats Overview */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Earned</StatLabel>
              <StatNumber>{formatCurrency(totalEarned)}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                From all completed transactions
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Pending Payouts</StatLabel>
              <StatNumber>{pendingPayouts}</StatNumber>
              <StatHelpText>
                Transactions awaiting payout
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Commission Rate</StatLabel>
              <StatNumber>10%</StatNumber>
              <StatHelpText>
                Platform fee per transaction
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Earnings History */}
      <Card>
        <CardHeader>
          <HStack justify="space-between">
            <Box>
              <Heading size="xs">Earnings History</Heading>
              <Text fontSize="sm" color="gray.600">
                All your completed transactions and earnings
              </Text>
            </Box>
            <Button leftIcon={<FiDownload />} variant="outline" size="sm">
              Export Report
            </Button>
          </HStack>
        </CardHeader>
        <CardBody>
          {earnings.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Icon as={FiCreditCard} boxSize={12} color="gray.400" mb={4} />
              <Text fontSize="lg" color="gray.500">
                No earnings yet
              </Text>
              <Text fontSize="sm" color="gray.400">
                Your earnings from completed adoptions will appear here
              </Text>
            </Box>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Listing</Th>
                    <Th>Amount</Th>
                    <Th>Commission</Th>
                    <Th>You Earn</Th>
                    <Th>Payment</Th>
                    <Th>Payout</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {earnings.map((earning: any) => (
                    <Tr key={earning.id}>
                      <Td>{formatDate(earning.created_at)}</Td>
                      <Td>
                        <Text fontWeight="medium">
                          {earning.applications?.listings?.title || 'Unknown Listing'}
                        </Text>
                      </Td>
                      <Td>{formatCurrency(earning.amount)}</Td>
                      <Td>{formatCurrency(earning.commission_fee)}</Td>
                      <Td fontWeight="semibold" color="green.600">
                        {formatCurrency(earning.amount - earning.commission_fee)}
                      </Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(earning.status)}>
                          {earning.status}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={earning.payout_status === 'completed' ? 'green' :
                            earning.payout_status === 'pending' ? 'yellow' :
                              earning.payout_status === 'processing' ? 'blue' : 'red'}
                          variant="subtle"
                        >
                          {earning.payout_status || 'pending'}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Payout Information */}
      <Card>
        <CardHeader>
          <Heading size="xs">Payout Information</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="start">
            <Box>
              <Text fontWeight="semibold" mb={2}>How Payouts Work</Text>
              <VStack align="start" spacing={2} fontSize="sm" color="gray.600">
                <Text>• Earnings are paid out weekly for completed transactions</Text>
                <Text>• Minimum payout threshold: Ksh. 5,000</Text>
                <Text>• Payouts are processed via M-Pesa or bank transfer</Text>
                <Text>• Processing time: 1-3 business days</Text>
              </VStack>
            </Box>

            <Divider />

            <Box>
              <Text fontWeight="semibold" mb={2}>Next Payout</Text>
              <HStack spacing={4}>
                <Icon as={FiCalendar} />
                <Text>Friday, December 13, 2024</Text>
                <Badge colorScheme="blue">Estimated</Badge>
              </HStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default EarningsPage;
