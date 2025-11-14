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
  Flex,
  Spacer,
  Divider,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiCreditCard,
  FiDollarSign,
  FiCalendar,
  FiDownload,
  FiInfo,
} from 'react-icons/fi';
import { useUserProfile } from 'lib/hooks/queries';
import { useBillingHistory, useTransactionStats } from 'lib/hooks/queries/useTransactions';
import { NextSeo } from 'next-seo';
import { Loader } from 'lib/components/ui/Loader';

const PaymentsPage: React.FC = () => {
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: billingHistory, isLoading: billingLoading } = useBillingHistory();
  const { data: stats, isLoading: statsLoading } = useTransactionStats();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (profileLoading || billingLoading || statsLoading) {
    return <Loader />;
  }

  if (!userProfile || userProfile.role !== 'seeker') {
    return (
      <Container maxW="7xl" py={8}>
        <Text>Access denied. This page is for seekers only.</Text>
      </Container>
    );
  }

  const payments = billingHistory?.payments || [];
  const totalPaid = stats?.totalPaid || 0;
  const pendingPayments = stats?.pendingPayments || 0;

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

  const getPaymentType = (payment: any) => {
    const meta = payment.meta as any;
    if (meta?.payment_type === 'reservation') {
      return 'Reservation Fee';
    } else if (meta?.payment_type === 'final') {
      return 'Final Payment';
    }
    return 'Payment';
  };

  return (
    <VStack spacing={8} align="stretch">
      {/* Header */}
      <Box>
        <Heading size={{ base: 'sm', lg: 'md' }} mb={2}>Payment History</Heading>
        <Text color="gray.600">
          Track all your payments and adoption expenses
        </Text>
      </Box>

      {/* Stats Overview */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Paid</StatLabel>
              <StatNumber>{formatCurrency(totalPaid)}</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                For all completed adoptions
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Pending Payments</StatLabel>
              <StatNumber>{pendingPayments}</StatNumber>
              <StatHelpText>
                Payments in progress
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        {/* <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Active Adoptions</StatLabel>
                  <StatNumber>{payments.filter(p => p.status === 'completed').length}</StatNumber>
                  <StatHelpText>
                    Successfully completed
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card> */}
      </SimpleGrid>

      {/* Payment Information Alert */}
      {/* <Alert status="info" borderRadius="md">
        <AlertIcon />
        <Box>
          <Text fontWeight="bold">Payment Information</Text>
          <Text fontSize="sm">
            Reservation fees are deducted from your final payment. All payments are processed securely through Paystack.
          </Text>
        </Box>
      </Alert> */}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <HStack justify="space-between" wrap="wrap" spacing="2">
            <Box>
              <Heading size={{ base: 'xs', lg: 'sm' }}>Payment History</Heading>
              <Text fontSize="sm" color="gray.600">
                All your adoption payments and transactions
              </Text>
            </Box>
            <Button leftIcon={<FiDownload />} variant="outline" size="sm">
              Export Report
            </Button>
          </HStack>
        </CardHeader>
        <CardBody>
          {payments.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Icon as={FiCreditCard} boxSize={12} color="gray.400" mb={4} />
              <Text fontSize="lg" color="gray.500">
                No payments yet
              </Text>
              <Text fontSize="sm" color="gray.400">
                Your adoption payments will appear here
              </Text>
            </Box>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Type</Th>
                    <Th>Listing</Th>
                    <Th>Amount</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {payments.map((payment: any) => (
                    <Tr key={payment.id}>
                      <Td>{formatDate(payment.created_at)}</Td>
                      <Td>
                        <Badge
                          colorScheme={(payment.meta as any)?.payment_type === 'reservation' ? 'blue' : 'green'}
                          variant="subtle"
                        >
                          {getPaymentType(payment)}
                        </Badge>
                      </Td>
                      <Td>
                        <Text fontWeight="medium">
                          {payment.applications?.listings?.title || 'Unknown Listing'}
                        </Text>
                      </Td>
                      <Td fontWeight="semibold">
                        {formatCurrency(payment.amount)}
                      </Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          {payment.status === 'completed' && (
                            <Button size="sm" variant="outline" leftIcon={<FiDownload />}>
                              Receipt
                            </Button>
                          )}
                          {payment.status === 'pending' && (
                            <Button size="sm" variant="outline" colorScheme="blue">
                              Check Status
                            </Button>
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Payment Methods */}
      <Card>
        {/* <CardHeader>
              <Heading size={{ base: 'xs', lg: 'sm' }}></Heading>
            </CardHeader> */}
        <CardBody>
          <VStack spacing={4} align="start">
            {/* <Box>
                  <Text fontWeight="semibold" mb={4}>Accepted Payment Methods</Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <HStack spacing={3}>
                      <Icon as={FiCreditCard} color="blue.500" />
                      <Box>
                        <Text fontWeight="medium">Credit/Debit Cards</Text>
                        <Text fontSize="sm" color="gray.600">Visa, Mastercard, and other cards</Text>
                      </Box>
                    </HStack>
                    <HStack spacing={3}>
                      <Icon as={FiDollarSign} color="green.500" />
                      <Box>
                        <Text fontWeight="medium"> Mobile Money</Text>
                        <Text fontSize="sm" color="gray.600">Pay with your mobile money</Text>
                      </Box>
                    </HStack>
                  </SimpleGrid>
                </Box>

                <Divider /> */}

            <Box>
              <Text fontWeight="semibold" mb={2}>Security & Refunds</Text>
              <VStack align="start" spacing={2} fontSize="sm" color="gray.600">
                <Text>• All payments are processed securely through Paystack</Text>
                <Text>• Refunds are processed within 5-7 business days</Text>
                <Text>• Contact support for refund requests</Text>
              </VStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default PaymentsPage;
