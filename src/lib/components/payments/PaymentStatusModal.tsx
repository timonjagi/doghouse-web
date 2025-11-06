import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  Box,
  HStack,
  Icon,
  Spinner,
  Button,
  Alert,
  AlertIcon,
  Progress,
  useToast,
} from '@chakra-ui/react';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCreditCard,
  FaMobileAlt,
  FaUniversity
} from 'react-icons/fa';
import { useVerifyPayment } from '../../hooks/queries/usePayments';

interface PaymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentReference: string;
  paymentType: 'reservation' | 'final';
  expectedAmount: number;
  applicationId?: string;
}

type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export const PaymentStatusModal: React.FC<PaymentStatusModalProps> = ({
  isOpen,
  onClose,
  paymentReference,
  paymentType,
  expectedAmount,
  applicationId,
}) => {
  const [status, setStatus] = useState<PaymentStatus>('pending');
  const [pollingCount, setPollingCount] = useState(0);
  const verifyPaymentMutation = useVerifyPayment(applicationId);
  const toast = useToast();

  const maxPollingAttempts = 30; // 30 attempts = ~2.5 minutes
  const pollingInterval = 5000; // 5 seconds

  useEffect(() => {
    if (!isOpen || !paymentReference) return;

    let intervalId: NodeJS.Timeout;

    const checkPaymentStatus = async () => {
      try {
        const result = await verifyPaymentMutation.mutateAsync(paymentReference);

        if (result?.status === 'completed') {
          setStatus('completed');
          toast({
            title: 'Payment Successful!',
            description: `${paymentType === 'reservation' ? 'Reservation fee' : 'Final payment'} has been confirmed.`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          // Auto-close after success
          setTimeout(() => {
            onClose();
            //window.location.reload(); // Refresh to show updated application status
          }, 2000);
          return;
        }

        setPollingCount(prev => {
          const newCount = prev + 1;
          if (newCount >= maxPollingAttempts) {
            setStatus('failed');
            toast({
              title: 'Payment Timeout',
              description: 'Payment verification is taking longer than expected. Please check your application status.',
              status: 'warning',
              duration: 5000,
              isClosable: true,
            });
            return newCount;
          }
          return newCount;
        });

      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        toast({
          title: 'Payment Verification Failed',
          description: 'Unable to verify payment status. Please contact support if payment was made.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    // Initial check
    checkPaymentStatus();

    // Set up polling
    intervalId = setInterval(checkPaymentStatus, pollingInterval);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isOpen, paymentReference, verifyPaymentMutation.mutateAsync, toast, paymentType, onClose]);

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
      case 'processing':
        return <Spinner size="lg" color="brand.500" />;
      case 'completed':
        return <Icon as={FaCheckCircle} boxSize={8} color="green.500" />;
      case 'failed':
        return <Icon as={FaTimesCircle} boxSize={8} color="red.500" />;
      default:
        return <Icon as={FaClock} boxSize={8} color="gray.500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Checking payment status...';
      case 'processing':
        return 'Processing payment...';
      case 'completed':
        return 'Payment completed successfully!';
      case 'failed':
        return 'Payment verification failed';
      default:
        return 'Checking payment status...';
    }
  };

  const getProgressValue = () => {
    if (status === 'completed') return 100;
    if (status === 'failed') return 0;
    return Math.min((pollingCount / maxPollingAttempts) * 100, 90); // Max 90% until confirmed
  };

  const formatAmount = (amount: number) => {
    return `Ksh. ${amount.toLocaleString()}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={status === 'completed' ? undefined : onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          Payment Status
        </ModalHeader>
        {!status.includes('completed') && <ModalCloseButton />}

        <ModalBody>
          <VStack spacing={6} align="center" py={4}>
            {/* Status Icon */}
            <Box>
              {getStatusIcon()}
            </Box>

            {/* Status Text */}
            <VStack spacing={2}>
              <Text fontSize="lg" fontWeight="semibold" textAlign="center">
                {getStatusText()}
              </Text>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                {paymentType === 'reservation'
                  ? `Reservation fee: ${formatAmount(expectedAmount)}`
                  : `Final payment: ${formatAmount(expectedAmount)}`
                }
              </Text>
            </VStack>

            {/* Progress Bar */}
            {status !== 'completed' && status !== 'failed' && (
              <Box w="full">
                <Progress
                  value={getProgressValue()}
                  colorScheme="brand"
                  size="sm"
                  borderRadius="md"
                />
                <Text fontSize="xs" color="gray.500" mt={2} textAlign="center">
                  Checking payment status... ({pollingCount}/{maxPollingAttempts})
                </Text>
              </Box>
            )}

            {/* Instructions */}
            {status === 'pending' && (
              <Box textAlign="center">
                {/* <Text fontSize="sm" color="gray.600" mb={2}>
                  Complete your payment on the Paystack page that opened in a new tab.
                </Text> */}
                <Text fontSize="xs" color="gray.500">
                  This window will automatically update once payment is confirmed.
                </Text>
              </Box>
            )}

            {status === 'completed' && (
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold">Payment Confirmed!</Text>
                  <Text fontSize="sm">
                    Your {paymentType === 'reservation' ? 'reservation' : 'payment'} has been processed successfully.
                  </Text>
                </Box>
              </Alert>
            )}

            {status === 'failed' && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold">Payment Verification Issue</Text>
                  <Text fontSize="sm">
                    Unable to confirm payment. Please check your application status or contact support.
                  </Text>
                </Box>
              </Alert>
            )}

            {/* Action Buttons */}
            <HStack spacing={3} w="full" justify="center">
              {status === 'failed' && (
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              )}
              {status === 'pending' && (
                <Button variant="outline" onClick={onClose}>
                  Cancel Check
                </Button>
              )}
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
