import React, { useState } from 'react';
import {
  Container,
  Heading,
  Text,
  VStack,
  Card,
  CardBody,
  CardHeader,
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
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
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiDownload,
  FiCreditCard,
} from 'react-icons/fi';
import { useUserProfile } from 'lib/hooks/queries';
import { useTransactions } from 'lib/hooks/queries/useTransactions';
import { NextSeo } from 'next-seo';
import { Loader } from 'lib/components/ui/Loader';

const TransactionsPage: React.FC = () => {
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const { data: transactions, isLoading: transactionsLoading } = useTransactions({
    status: statusFilter || undefined,
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (profileLoading || transactionsLoading) {
    return <Loader />;
  }

  if (!userProfile) {
    return (
      <Container maxW="7xl" py={8}>
        <Text>Access denied. Please log in to view transactions.</Text>
      </Container>
    );
  }

  const userTransactions = transactions || [];

  // Filter transactions based on search term
  const filteredTransactions = userTransactions.filter((transaction: any) => {
    const listingTitle = transaction.applications?.listings?.title || '';
    const matchesSearch = listingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return `Ksh. ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  const getTransactionType = (transaction: any) => {
    const isSeeker = transaction.seeker_id === userProfile.id;
    const meta = transaction.meta as any;

    if (isSeeker) {
      if (meta?.payment_type === 'reservation') {
        return 'Reservation Fee';
      } else if (meta?.payment_type === 'final') {
        return 'Final Payment';
      }
      return 'Payment Made';
    } else {
      return 'Earnings Received';
    }
  };

  const getAmountDisplay = (transaction: any) => {
    const isSeeker = transaction.seeker_id === userProfile.id;

    if (isSeeker) {
      return (
        <Text color="red.600" fontWeight="semibold">
          -{formatCurrency(transaction.amount)}
        </Text>
      );
    } else {
      // Breeder: show earnings after commission
      const earnings = transaction.amount - transaction.commission_fee;
      return (
        <Text color="green.600" fontWeight="semibold">
          +{formatCurrency(earnings)}
        </Text>
      );
    }
  };

  const totalTransactions = userTransactions.length;
  const completedTransactions = userTransactions.filter((t: any) => t.status === 'completed').length;
  const pendingTransactions = userTransactions.filter((t: any) => t.status === 'pending').length;

  const totalAmount = userTransactions
    .filter((t: any) => t.status === 'completed')
    .reduce((sum: number, t: any) => {
      const isSeeker = t.seeker_id === userProfile.id;
      if (isSeeker) {
        return sum - t.amount;
      } else {
        return sum + (t.amount - t.commission_fee);
      }
    }, 0);

  return (
    <>
      <NextSeo title="Transaction History - DogHouse Kenya" />

      <Container maxW="7xl" py={{ base: '4', md: '0' }}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading size={{ base: 'sm', lg: 'md' }} mb={2}>Transaction History</Heading>
            <Text color="gray.600">
              Complete overview of all your transactions and financial activity
            </Text>
          </Box>

          {/* Stats Overview */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Transactions</StatLabel>
                  <StatNumber>{totalTransactions}</StatNumber>
                  <StatHelpText>
                    All time
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Completed</StatLabel>
                  <StatNumber>{completedTransactions}</StatNumber>
                  <StatHelpText>
                    Successful transactions
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Pending</StatLabel>
                  <StatNumber>{pendingTransactions}</StatNumber>
                  <StatHelpText>
                    In progress
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Net Balance</StatLabel>
                  <StatNumber color={totalAmount >= 0 ? 'green.600' : 'red.600'}>
                    {formatCurrency(Math.abs(totalAmount))}
                  </StatNumber>
                  <StatHelpText>
                    {totalAmount >= 0 ? 'Earnings' : 'Spent'}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Filters */}
          <Card>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FiSearch} />
                  </InputLeftElement>
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>

                <Select
                  placeholder="Filter by status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </Select>

                <Button leftIcon={<FiDownload />} variant="outline" alignSelf="start">
                  Export CSV
                </Button>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <Heading size="xs">All Transactions</Heading>
            </CardHeader>
            <CardBody>
              {filteredTransactions.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Icon as={FiCreditCard} boxSize={12} color="gray.400" mb={4} />
                  <Text fontSize="lg" color="gray.500">
                    No transactions found
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    {searchTerm || statusFilter ? 'Try adjusting your filters' : 'Your transactions will appear here'}
                  </Text>
                </Box>
              ) : (
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Date</Th>
                        <Th>Type</Th>
                        <Th>Description</Th>
                        <Th>Amount</Th>
                        <Th>Payment</Th>
                        <Th>Payout</Th>
                        <Th>Reference</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredTransactions.map((transaction: any) => (
                        <Tr key={transaction.id}>
                          <Td>{formatDate(transaction.created_at)}</Td>
                          <Td>
                            <Badge
                              colorScheme={transaction.seeker_id === userProfile.id ? 'red' : 'green'}
                              variant="subtle"
                            >
                              {getTransactionType(transaction)}
                            </Badge>
                          </Td>
                          <Td>
                            <Text fontWeight="medium">
                              {transaction.applications?.listings?.title || 'Unknown Transaction'}
                            </Text>
                            {transaction.seeker_id !== userProfile.id && (
                              <Text fontSize="xs" color="gray.600">
                                Commission: {formatCurrency(transaction.commission_fee)}
                              </Text>
                            )}
                          </Td>
                          <Td>{getAmountDisplay(transaction)}</Td>
                          <Td>
                            <Badge colorScheme={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={transaction.payout_status === 'completed' ? 'green' :
                                transaction.payout_status === 'pending' ? 'yellow' :
                                  transaction.payout_status === 'processing' ? 'blue' : 'red'}
                              variant="subtle"
                            >
                              {transaction.payout_status || 'pending'}
                            </Badge>
                          </Td>
                          <Td fontSize="xs" color="gray.600">
                            {transaction.id.slice(-8)}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </CardBody>
          </Card>

          {/* Transaction Information */}
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Transaction Information</Text>
              <Text fontSize="sm">
                All transactions are processed securely through Paystack. Completed transactions are final and non-refundable except in exceptional circumstances.
              </Text>
            </Box>
          </Alert>
        </VStack>
      </Container>
    </>
  );
};

export default TransactionsPage;
