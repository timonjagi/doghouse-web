import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  List,
  ListItem,
  ListIcon,
  useDisclosure,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';
import {
  AdoptionWithListing,
  getAvailableAdoptionActions,
  useAdoptionTimelineLogic,
} from '../../../hooks/queries/useAdoptions';
import AdoptionActionDialog from './AdoptionActionDialog';
import { PaymentStatusModal } from '../payments/PaymentStatusModal';
import { InfoIcon } from '@chakra-ui/icons';

interface AdoptionActionListProps {
  adoption: AdoptionWithListing;
  userProfile: any;
  transactions?: any[];
  variant?: 'banner' | 'timeline' | 'inline';
}

export const AdoptionActionList: React.FC<AdoptionActionListProps> = ({
  adoption,
  userProfile,
  transactions = [],
  variant = 'timeline',
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isStatusOpen,
    onOpen: onStatusOpen,
    onClose: onStatusClose
  } = useDisclosure();

  const [pendingAction, setPendingAction] = useState<any>(null);
  const [statusCheckData, setStatusCheckData] = useState<any>(null);

  const { currentStep } = useAdoptionTimelineLogic({
    adoption,
    userProfile,
    transactions,
  });

  const availableActions = getAvailableAdoptionActions({
    adoption,
    userProfile,
    transactions,
  });

  const handleActionClick = (action: any) => {
    if (action.type.startsWith('check_payment_status')) {
      const type = action.type === 'check_payment_status_reservation' ? 'reservation' : 'final';
      setStatusCheckData({
        reference: action.payload?.reference,
        type,
        amount: type === 'reservation'
          ? Number(adoption.listings.reservation_fee)
          : Number(adoption.listings.price) - Number(adoption.listings.reservation_fee)
      });
      onStatusOpen();
      return;
    }
    setPendingAction(action);
    onOpen();
  };

  if (!currentStep) return null;

  const title = currentStep.title;
  const description = currentStep.description;
  const info = currentStep.info || [];

  const renderButtons = (size: string = 'md') => (
    <HStack spacing={2} justifyContent="flex-end" w="full" pt={2}>
      {availableActions.map((action, index) => (
        <Button
          key={index}
          size={size}
          variant={action.variant || 'solid'}
          colorScheme={action.colorScheme || 'blue'}
          leftIcon={action.icon ? <Icon as={action.icon} /> : undefined}
          onClick={() => handleActionClick(action)}
        >
          {action.buttonLabel || action.label}
        </Button>
      ))}
    </HStack>
  );

  if (variant === 'banner') {
    return (
      <Box w="full">
        <Alert
          status="info"
          variant="subtle"
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems={{ base: 'start', md: 'center' }}
          justifyContent="space-between"
          textAlign="left"
          borderRadius="lg"
          py={4}
          px={6}
          bg={useColorModeValue('blue.50', 'blue.900')}
          borderWidth="1px"
          borderColor={useColorModeValue('blue.100', 'blue.600')}
        >
          <HStack spacing={4} align="start" flex={1}>
            <AlertIcon mt={1} />
            <Box>
              <AlertTitle fontSize="md" fontWeight="bold" mb={1}>
                {title}
              </AlertTitle>
              <AlertDescription fontSize="sm" display="block">
                {description}
              </AlertDescription>
              {info.length > 0 && (
                <List spacing={1} mt={3}>
                  {info.map((item, idx) => (
                    <ListItem key={idx} fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')} display="flex" alignItems="start">
                      <ListIcon as={InfoIcon} color={useColorModeValue('blue.400', 'blue.600')} mt={1} />
                      {item}
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </HStack>
          <Box mt={{ base: 4, md: 0 }} ml={{ base: 0, md: 4 }} w={{ base: 'full', md: 'auto' }}>
            {renderButtons('sm')}
          </Box>
        </Alert>

        <AdoptionActionDialog
          isOpen={isOpen}
          onClose={onClose}
          pendingAction={pendingAction}
          setPendingAction={setPendingAction}
          adoption={adoption}
          userProfile={userProfile}
        />
      </Box>
    );
  }

  // Timeline variant
  return (
    <Box w="full">
      <VStack align="start" spacing={3}>
        <Alert
          status="info"
          variant="left-accent"
          borderRadius="md"
          bg="white"
          boxShadow="sm"
          borderWidth="1px"
          borderColor="gray.100"
          p={4}
        >
          <Box w="full">
            <AlertDescription fontSize="sm" color="gray.700" display="block" mb={2}>
              {description}
            </AlertDescription>
            {info.length > 0 && (
              <List spacing={1.5}>
                {info.map((item, idx) => (
                  <ListItem key={idx} fontSize="xs" color="gray.600" display="flex" alignItems="start">
                    <ListIcon as={InfoIcon} color="blue.400" mt={1} />
                    {item}
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Alert>
        {renderButtons('sm')}
      </VStack>

      <AdoptionActionDialog
        isOpen={isOpen}
        onClose={onClose}
        pendingAction={pendingAction}
        setPendingAction={setPendingAction}
        userProfile={userProfile}
      />

      {statusCheckData && (
        <PaymentStatusModal
          isOpen={isStatusOpen}
          onClose={onStatusClose}
          paymentReference={statusCheckData.reference}
          paymentType={statusCheckData.type}
          expectedAmount={statusCheckData.amount}
          adoptionId={adoption.id}
        />
      )}
    </Box>
  );
};
