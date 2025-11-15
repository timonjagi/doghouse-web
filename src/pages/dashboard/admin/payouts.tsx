import React, { useState } from 'react';
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
  Alert,
  AlertIcon,
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  RadioGroup,
  Radio,
  Stack,
} from '@chakra-ui/react';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiCreditCard,
  FiDollarSign,
  FiDownload,
  FiRefreshCw,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import { useUserProfile } from '../../../lib/hooks/queries';
import {
  usePendingPayouts,
  usePayoutStats,
  useProcessAllPayouts,
  useProcessBreederPayout,
} from '../../../lib/hooks/queries/usePayouts';
import { NextSeo } from 'next-seo';
import { Loader } from '../../../lib/components/ui/Loader';

const AdminPayoutsPage: React.FC = () => {
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: pendingPayouts, isLoading: payoutsLoading } = usePendingPayouts();
  const { data: payoutStats, isLoading: statsLoading } = usePayoutStats();
  const processAllPayoutsMutation = useProcessAllPayouts();
  const processBreederPayoutMutation = useProcessBreederPayout();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBreeder, setSelectedBreeder] = useState<string | null>(null);
  const [payoutMethod, setPayoutMethod] = useState<'mobile_money' | 'bank'>('mobile_money');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (profileLoading || payoutsLoading || statsLoading) {
    return <Loader />;
  }

  if (!userProfile || userProfile.role !== 'admin') {
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

  const handleProcessAllPayouts = async () => {
    try {
      const result = await processAllPayoutsMutation.mutateAsync();

      toast({
        title: 'Payout Processing Complete',
        description: `Processed ${result.processed} payouts, ${result.failed} failed. Total: ${formatCurrency(result.totalAmount)}`,
        status: result.success ? 'success' : result.failed > 0 ? 'warning' : 'success',
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: 'Payout Processing Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleProcessBreederPayout = async (breederId: string) => {
    try {
      const payoutOptions = {
        method: payoutMethod,
        recipientPhone: payoutMethod === 'mobile_money' ? recipientPhone : undefined,
        bankCode: payoutMethod === 'bank' ? bankCode : undefined,
        accountNumber: payoutMethod === 'bank' ? accountNumber : undefined,
      };

      const result = await processBreederPayoutMutation.mutateAsync({
        breederId,
        payoutOptions,
      });

      toast({
        title: result.success ? 'Payout Processed' : 'Payout Failed',
        description: result.message,
        status: result.success ? 'success' : 'error',
        duration: 3000,
      });

      if (result.success) {
        onClose();
        // Reset form state
        setPayoutMethod('mobile_money');
        setRecipientPhone('');
        setBankCode('');
        setAccountNumber('');
      }
    } catch (error) {
      toast({
        title: 'Payout Processing Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Group payouts by breeder
  const breederPayouts = pendingPayouts?.reduce((groups, tx) => {
    if (!groups[tx.breeder_id]) {
      groups[tx.breeder_id] = {
        breederId: tx.breeder_id,
        breederName: tx.users?.[0]?.display_name || 'Unknown Breeder',
        breederEmail: tx.users?.[0]?.email || '',
        transactions: [],
        totalAmount: 0,
        totalCommission: 0,
        payoutAmount: 0,
      };
    }

    groups[tx.breeder_id].transactions.push(tx);
    groups[tx.breeder_id].totalAmount += tx.amount;
    groups[tx.breeder_id].totalCommission += tx.commission_fee;
    groups[tx.breeder_id].payoutAmount = groups[tx.breeder_id].totalAmount - groups[tx.breeder_id].totalCommission;

    return groups;
  }, {} as Record<string, any>) || {};

  const breederPayoutList = Object.values(breederPayouts);

  return (
    <>
      <NextSeo title="Payout Management - Admin Dashboard" />

      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="lg" mb={2}>Payout Management</Heading>
            <Text color="gray.600">
              Manage breeder payouts and commission processing
            </Text>
          </Box>

          {/* Stats Overview */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Pending Payouts</StatLabel>
                  <StatNumber>{payoutStats?.totalPendingAmount ? formatCurrency(payoutStats.totalPendingAmount) : 'Ksh. 0'}</StatNumber>
                  <StatHelpText>
                    Ready for processing
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Breeders Waiting</StatLabel>
                  <StatNumber>{payoutStats?.uniqueBreeders || 0}</StatNumber>
                  <StatHelpText>
                    Unique breeders
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Transactions</StatLabel>
                  <StatNumber>{payoutStats?.totalTransactions || 0}</StatNumber>
                  <StatHelpText>
                    Pending payout
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Average Payout</StatLabel>
                  <StatNumber>{payoutStats?.averagePayout ? formatCurrency(Math.round(payoutStats.averagePayout)) : 'Ksh. 0'}</StatNumber>
                  <StatHelpText>
                    Per breeder
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Action Buttons */}
          <Card>
            <CardBody>
              <HStack spacing={4}>
                <Button
                  leftIcon={<FiRefreshCw />}
                  colorScheme="blue"
                  onClick={handleProcessAllPayouts}
                  isLoading={processAllPayoutsMutation.isPending}
                  loadingText="Processing..."
                  isDisabled={breederPayoutList.length === 0}
                >
                  Process All Pending Payouts
                </Button>

                <Button
                  leftIcon={<FiDownload />}
                  variant="outline"
                  isDisabled={breederPayoutList.length === 0}
                >
                  Export Payout Report
                </Button>
              </HStack>
            </CardBody>
          </Card>

          {/* Payouts by Breeder */}
          <Card>
            <CardHeader>
              <Heading size="md">Pending Payouts by Breeder</Heading>
            </CardHeader>
            <CardBody>
              {breederPayoutList.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Icon as={FiCreditCard} boxSize={12} color="gray.400" mb={4} />
                  <Text fontSize="lg" color="gray.500">
                    No pending payouts
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    All breeder payouts have been processed
                  </Text>
                </Box>
              ) : (
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Breeder</Th>
                        <Th>Transactions</Th>
                        <Th>Total Amount</Th>
                        <Th>Commission</Th>
                        <Th>Payout Amount</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {breederPayoutList.map((breeder: any) => (
                        <Tr key={breeder.breederId}>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium">
                                {breeder.breederName}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                {breeder.breederEmail}
                              </Text>
                            </VStack>
                          </Td>
                          <Td>{breeder.transactions.length}</Td>
                          <Td>{formatCurrency(breeder.totalAmount)}</Td>
                          <Td>{formatCurrency(breeder.totalCommission)}</Td>
                          <Td fontWeight="semibold" color="green.600">
                            {formatCurrency(breeder.payoutAmount)}
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Button
                                size="sm"
                                colorScheme="green"
                                leftIcon={<FiCheck />}
                                onClick={() => {
                                  setSelectedBreeder(breeder.breederId);
                                  onOpen();
                                }}
                                isLoading={processBreederPayoutMutation.isPending}
                              >
                                Process
                              </Button>
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

          {/* Commission Information */}
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Commission & Payout Information</Text>
              <Text fontSize="sm">
                Platform charges 10% commission on all transactions. Payouts are processed weekly via Paystack transfers to breeder M-Pesa accounts. Minimum payout threshold is Ksh. 5,000.
              </Text>
            </Box>
          </Alert>
        </VStack>
      </Container>

      {/* Process Breeder Payout Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Process Breeder Payout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <Text>
                Configure payout details for this breeder. Review and modify the payout method and recipient information as needed.
              </Text>

              {/* Payout Method Selection */}
              <FormControl>
                <FormLabel fontWeight="semibold">Payout Method</FormLabel>
                <RadioGroup value={payoutMethod} onChange={(value: 'mobile_money' | 'bank') => setPayoutMethod(value)}>
                  <Stack direction="row">
                    <Radio value="mobile_money">M-Pesa Mobile Money</Radio>
                    <Radio value="bank">Bank Transfer</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              {/* Mobile Money Fields */}
              {payoutMethod === 'mobile_money' && (
                <FormControl>
                  <FormLabel>M-Pesa Phone Number</FormLabel>
                  <Input
                    type="tel"
                    placeholder="254712345678"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                  />
                  <Text fontSize="sm" color="gray.600">
                    Enter the phone number in international format (e.g., 254712345678)
                  </Text>
                </FormControl>
              )}

              {/* Bank Transfer Fields */}
              {payoutMethod === 'bank' && (
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Bank Code</FormLabel>
                    <Select
                      placeholder="Select bank"
                      value={bankCode}
                      onChange={(e) => setBankCode(e.target.value)}
                    >
                      <option value="044">KCB Bank Kenya</option>
                      <option value="057">Cooperative Bank</option>
                      <option value="07000">Equity Bank</option>
                      <option value="011">Standard Chartered Bank</option>
                      <option value="030">Absa Bank Kenya</option>
                      <option value="049">Bank of Africa</option>
                      <option value="050">Consolidated Bank</option>
                      <option value="043">National Bank of Kenya</option>
                      <option value="065">Oriental Commercial Bank</option>
                      <option value="071">Stanbic Bank Kenya</option>
                      <option value="023">Standard Bank Kenya</option>
                      <option value="063">Barclays Bank Kenya</option>
                      <option value="014">NIC Bank</option>
                      <option value="061">Diamond Trust Bank</option>
                      <option value="068">I&M Bank</option>
                      <option value="066">Paramount Universal Bank</option>
                      <option value="069">Development Bank of Kenya</option>
                      <option value="067">Guardian Bank</option>
                      <option value="064">Investments & Mortgages Bank</option>
                      <option value="062">Housing Finance Bank</option>
                      <option value="054">Giro Commercial Bank</option>
                      <option value="053">Family Bank</option>
                      <option value="052">Uchumi Commercial Bank</option>
                      <option value="051">Credit Bank</option>
                      <option value="048">Middle East Bank Kenya</option>
                      <option value="047">UBA Kenya Bank</option>
                      <option value="046">Prime Bank</option>
                      <option value="045">Chase Bank</option>
                      <option value="042">Citibank N.A. Kenya</option>
                      <option value="041">Bank of Baroda</option>
                      <option value="040">Bank of India</option>
                      <option value="039">Habib Bank AG Zurich</option>
                      <option value="038">Habib Bank</option>
                      <option value="037">Eco Bank</option>
                      <option value="036">Fidelity Commercial Bank</option>
                      <option value="035">Imperial Bank</option>
                      <option value="034">Victoria Commercial Bank</option>
                      <option value="033">Jamii Bora Bank</option>
                      <option value="032">Mayfair Bank</option>
                      <option value="031">Spire Bank</option>
                      <option value="029">Trans National Bank</option>
                      <option value="028">Sidian Bank</option>
                      <option value="027">Kingdom Bank</option>
                      <option value="026">First Community Bank</option>
                      <option value="025">Rafiki Microfinance Bank</option>
                      <option value="024">KWFT Microfinance Bank</option>
                      <option value="022">M Oriental Bank</option>
                      <option value="021">Centenary Bank</option>
                      <option value="020">Post Bank Kenya</option>
                      <option value="019">K-Rep Bank</option>
                      <option value="018">Mwalimu National Sacco</option>
                      <option value="017">Stima Sacco</option>
                      <option value="016">Kenya Police Sacco</option>
                      <option value="015">Gurandai Sacco</option>
                      <option value="013">SMEP Microfinance Bank</option>
                      <option value="012">Apex Consulting Sacco</option>
                      <option value="010">Caritas Microfinance Bank</option>
                      <option value="009">Sumac Microfinance Bank</option>
                      <option value="008">Faulu Microfinance Bank</option>
                      <option value="007">Uwezo Microfinance Bank</option>
                      <option value="006">Yako Credit & Savings Sacco</option>
                      <option value="005">United Women Sacco</option>
                      <option value="004">Akiba Commercial Bank</option>
                      <option value="003">DIB Bank</option>
                      <option value="002">Commercial Bank of Africa</option>
                      <option value="001">Kenya Commercial Bank</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Account Number</FormLabel>
                    <Input
                      placeholder="Enter account number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </FormControl>
                </VStack>
              )}

              {/* Payout Summary */}
              <Box p={4} bg="gray.50" borderRadius="md">
                <Text fontWeight="semibold" mb={2}>Payout Summary</Text>
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm">
                    <strong>Breeder:</strong> {breederPayoutList.find(b => b.breederId === selectedBreeder)?.breederName}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Transactions:</strong> {breederPayoutList.find(b => b.breederId === selectedBreeder)?.transactions.length}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Payout Amount:</strong> {formatCurrency(breederPayoutList.find(b => b.breederId === selectedBreeder)?.payoutAmount || 0)}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Method:</strong> {payoutMethod === 'mobile_money' ? 'M-Pesa' : 'Bank Transfer'}
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="green"
              onClick={() => selectedBreeder && handleProcessBreederPayout(selectedBreeder)}
              isLoading={processBreederPayoutMutation.isPending}
              isDisabled={
                (payoutMethod === 'mobile_money' && !recipientPhone) ||
                (payoutMethod === 'bank' && (!bankCode || !accountNumber))
              }
            >
              Process Payout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AdminPayoutsPage;
