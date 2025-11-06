import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Box,
  HStack,
  Icon,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { FaCreditCard, FaMobileAlt } from 'react-icons/fa';
import { useInitiatePayment } from '../../hooks/queries/usePayments';
import { ApplicationWithListing } from '../../hooks/queries/useApplications';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationWithListing;
  paymentType: 'reservation' | 'final';
  onPaymentSuccess?: (reference: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  application,
  paymentType,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('mpesa');
  const initiatePaymentMutation = useInitiatePayment();
  const toast = useToast();

  // Calculate payment amount and description
  const getPaymentDetails = () => {
    const listing = application.listings;
    if (paymentType === 'reservation') {
      return {
        amount: Number(listing.reservation_fee) || 0,
        description: `Reservation fee for ${listing.title}`,
      };
    } else {
      // Final payment: total price minus reservation fee
      const finalAmount = Number(listing.price) - Number(listing.reservation_fee);
      return {
        amount: Math.max(finalAmount, 0), // Ensure non-negative
        description: `Final payment for ${listing.title}`,
      };
    }
  };

  const { amount, description } = getPaymentDetails();

  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: FaMobileAlt,
      description: 'Pay with your M-Pesa mobile money',
      color: 'green.500',
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: FaCreditCard,
      description: 'Visa, Mastercard, and other cards',
      color: 'blue.500',
    },
    // {
    //   id: 'bank',
    //   name: 'Bank Transfer',
    //   icon: FaUniversity,
    //   description: 'Direct bank transfer',
    //   color: 'purple.500',
    // },
  ];

  const handlePayment = async () => {
    try {
      const result = await initiatePaymentMutation.mutateAsync({
        amount,
        type: paymentType,
        applicationId: application.id,
        description,
        application, // Pass application data to avoid redundant fetch
      });

      if (result?.data?.authorization_url) {
        // Close modal and redirect to Paystack checkout
        // Success handling will be done via callback URL redirect
        window.location.href = result.data.authorization_url;

        onClose();
        onPaymentSuccess?.(result.data.reference);

      } else {
        throw new Error('Payment initialization failed');
      }
    } catch (error) {
      toast({
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'Failed to initialize payment',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Payment initiation error:', error);
    }
  };

  const formatAmount = (amount: number) => {
    return `Ksh. ${amount.toLocaleString()}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {paymentType === 'reservation' ? 'Pay Reservation Fee' : 'Complete Payment'}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Payment Summary */}
            <Box p={4} bg="gray.50" borderRadius="md">
              <VStack spacing={2} align="start">
                <Text fontSize="lg" fontWeight="semibold">
                  {description}
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                  {formatAmount(amount)}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {paymentType === 'reservation'
                    ? 'This amount will be deducted from your final payment'
                    : 'Final payment amount (reservation fee already deducted)'
                  }
                </Text>
              </VStack>
            </Box>

            {/* Payment Methods */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                Choose Payment Method
              </Text>
              <VStack spacing={3} align="stretch">
                {paymentMethods.map((method) => (
                  <Box
                    key={method.id}
                    p={4}
                    border="2px solid"
                    borderColor={selectedMethod === method.id ? 'brand.500' : 'gray.200'}
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => setSelectedMethod(method.id)}
                    _hover={{ borderColor: 'brand.300' }}
                    transition="all 0.2s"
                  >
                    <HStack spacing={4}>
                      <Icon as={method.icon} boxSize={6} color={method.color} />
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontWeight="semibold">{method.name}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {method.description}
                        </Text>
                      </VStack>
                      <Box
                        w={4}
                        h={4}
                        border="2px solid"
                        borderColor={selectedMethod === method.id ? 'brand.500' : 'gray.300'}
                        borderRadius="full"
                        bg={selectedMethod === method.id ? 'brand.500' : 'transparent'}
                      />
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Box>

            <Divider />

            {/* Payment Info */}
            <Box>
              <Text fontSize="sm" color="gray.600" mb={2}>
                What happens next?
              </Text>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm">• You'll be redirected to Paystack's secure payment page</Text>
                <Text fontSize="sm">• Complete payment using your selected method</Text>
                <Text fontSize="sm">• You'll be redirected back once payment is confirmed</Text>
                <Text fontSize="sm">• Your application status will update automatically</Text>
              </VStack>
            </Box>

            {/* Error handling is done through the hook's onPaymentError callback */}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            onClick={handlePayment}
            isLoading={initiatePaymentMutation.isPending}
            loadingText="Initializing Payment..."
          >
            Pay {formatAmount(amount)}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
