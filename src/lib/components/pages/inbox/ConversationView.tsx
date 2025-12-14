import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
  Badge,
  IconButton,
  Textarea,
  useToast,
  Image,
  Progress,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react';
import { ArrowBackIcon, TimeIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { IoSend } from 'react-icons/io5';
import { useRouter } from 'next/router';
import { useConversation, useSendMessage, useMarkConversationAsRead } from '../../../hooks/queries/useConversations';
import { useConversationWithContext } from '../../../hooks/queries/useContextConversations';
import { useRealtimeMessaging } from '../../../hooks/queries/useRealtimeMessaging';
import { useCurrentUser } from '../../../hooks/queries/useAuth';
import { useTypingIndicator, useTypingUsers, useTypingSubscription } from '../../../hooks/queries/useTypingIndicator';
import { useAdoptionActions, useAdoptionTimelineLogic, AdoptionWithListing } from '../../../hooks/queries/useAdoptions';
import FileAttachmentComponent from '../../ui/FileAttachment';
import { Banner } from '../../ui/Banner';
import AdoptionActionDialog from '../adoptions/AdoptionActionDialog';

interface ConversationViewProps {
  conversationId: string;
}

const ConversationView: React.FC<ConversationViewProps> = ({ conversationId }) => {
  const { data: user } = useCurrentUser();
  const { data: conversation, isLoading, error } = useConversation(conversationId);
  const { data: contextData } = useConversationWithContext(conversationId);
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkConversationAsRead();


  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();

  // Adoption Action State
  const [updateForm, setUpdateForm] = useState({
    status: '',
    response_message: '',
  });

  const [pendingAction, setPendingAction] = useState<{
    type: 'withdraw' | 'approve' | 'reject' | 'complete' | null;
    status: string;
    title: string;
    message: string;
    confirmText: string;
    colorScheme: string;
  } | null>(null);


  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const toast = useToast();

  // Enable real-time updates for conversations
  useRealtimeMessaging({ userId: user?.id, conversationId });

  // Typing indicators
  const { handleTyping } = useTypingIndicator(conversationId, user?.id);
  const { data: typingUsers } = useTypingUsers(conversationId);
  useTypingSubscription(conversationId);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  // Mark conversation as read when viewed
  useEffect(() => {
    if (conversation && user?.id) {
      markAsReadMutation.mutate({ conversationId, userId: user.id });
    }
  }, [conversation, user?.id, conversationId]);

  const handleSendMessage = async () => {
    if ((!messageText.trim() && attachments.length === 0) || !user?.id) return;

    try {
      await sendMessageMutation.mutateAsync({
        conversationId,
        senderId: user.id,
        content: messageText.trim() || null,
        attachments: attachments.length > 0 ? attachments : null,
      });

      setMessageText('');
      setAttachments([]);
      toast({
        title: 'Message sent',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to send message',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper to open confirmation dialog
  // Initialize timeline logic for enriched dialog bodies
  const timelineLogic = useAdoptionTimelineLogic({
    adoption: contextData?.contextData?.adoption,
    userProfile: user,
    transactions: contextData?.contextData?.transactions || []
  });

  const { updateAdoption, isLoading: isUpdatingAdoption, availableActions } = useAdoptionActions({
    adoption: contextData?.contextData?.adoption,
    userProfile: user,
    transactions: contextData?.contextData?.transactions || [],
    actions: {
      onPayReservation: () => router.push(`/dashboard/adoptions/${contextData?.contextData?.adoption?.id}?payment=reservation`),
      onSignContract: () => router.push(`/dashboard/adoptions/${contextData?.contextData?.adoption?.id}?action=contract`),
      onCompletePayment: () => router.push(`/dashboard/adoptions/${contextData?.contextData?.adoption?.id}?payment=final`),
      onLeaveReview: () => console.log('Leave review'),
      onContactSupport: () => console.log('Contact support'),
      onContactBreeder: () => router.push(`/inbox?userId=${contextData?.contextData?.adoption?.listings?.owner_id}`),
      onCheckPaymentStatus: (reference, type) => {
        console.log('Check payment status:', reference, type);
      },
    }
  });

  const handleActionClick = (action: any) => {
    // if (['withdraw', 'approve', 'reject', 'complete'].includes(action.type)) {
    // Enrich dialogBody with current step information
    const enrichedAction = { ...action };
    if (timelineLogic.currentStep?.info && timelineLogic.currentStep.info.length > 0) {
      enrichedAction.dialogBody = `${action.dialogBody}\n\n${timelineLogic.currentStep.info.map(info => `• ${info}`).join('\n')}`;
    }
    setPendingAction(enrichedAction);
    setUpdateForm({ status: action.status, response_message: '' });
    onUpdateOpen();
    // return;
    // } 

    const startUrl = `/dashboard/adoptions/${contextData?.contextData?.adoption?.id}`;

    switch (action.type) {
      case 'pay_reservation':
        router.push(`${startUrl}?payment=reservation`);
        break;
      case 'sign_contract':
        router.push(`${startUrl}?action=contract`);
        break;
      case 'complete_payment':
        router.push(`${startUrl}?payment=final`);
        break;
      case 'leave_review':
        router.push(`${startUrl}?action=review`);

        console.log('Leave review');
        break;
      case 'contact_support':
        router.push(`${startUrl}?action=support`);

      case 'contact_breeder':
        router.push(`${startUrl}?action=contact_breeder`);

        // Handle contact logic
        break;
      default:
        console.warn('Unknown action:', action.type);
    }
  };

  const hydratedActions = availableActions.map((action: any) => ({
    ...action,
    onClick: () => handleActionClick(action)
  }));

  // Handle the actual update from the dialog
  const handleStatusUpdate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const adoptionId = contextData?.contextData?.adoption?.id;
    if (!pendingAction || !adoptionId) return;

    try {
      await updateAdoption({
        id: adoptionId,
        updates: {
          status: pendingAction.status,
          application_data: {
            ...contextData.contextData.adoption.application_data,
            response_message: updateForm.response_message || pendingAction.message,
          }
        }
      });

      toast({
        title: pendingAction.title,
        description: pendingAction.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setUpdateForm({ status: '', response_message: '' });
      setPendingAction(null);
      onUpdateClose();

    } catch (error) {
      toast({
        title: `Error processing request`,
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };


  const getContextIcon = (contextType?: string) => {
    switch (contextType) {
      case 'adoption': return '🏠';
      case 'listing': return '🐕';
      case 'support': return '🆘';
      default: return '💬';
    }
  };

  const getContextColor = (contextType?: string) => {
    switch (contextType) {
      case 'adoption': return 'green';
      case 'listing': return 'blue';
      case 'support': return 'red';
      default: return 'gray';
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  // Determine Adoption Banner Logic
  let adoptionBannerProps = null;
  if (contextData?.contextData?.adoption && user) {
    const { adoption } = contextData.contextData;
    // Re-use logic from timeline
    const { getStatusBannerProps } = useAdoptionTimelineLogic({
      adoption,
      userProfile: user
    });
    const banner = getStatusBannerProps();
    if (banner) {
      adoptionBannerProps = {
        ...banner,
        buttons: hydratedActions || []
      };
    }
  }


  if (isLoading) {
    return (
      <Box p={8} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading conversation...</Text>
      </Box>
    );
  }

  if (error || !conversation) {
    return (
      <Box p={8}>
        <Alert status="error">
          <AlertIcon />
          Failed to load conversation. It may not exist or you may not have access.
        </Alert>
        <Button mt={4} onClick={() => router.push('/dashboard/inbox')}>
          Back to Inbox
        </Button>
      </Box>
    );
  }

  const participants = conversation.participants as string[];
  const showBanner = adoptionBannerProps && conversation.context_type === 'adoption';

  return (
    <>
      <VStack h="100vh" spacing={0} bg={useColorModeValue('gray.50', 'gray.900')}>
        {/* Header */}
        <Box
          w="full"
          bg={useColorModeValue('white', 'gray.800')}
          borderBottom="1px"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
          p={4}
          position="sticky"
          top={0}
          zIndex={10}
        >
          <HStack spacing={3}>
            <IconButton
              aria-label="Back to inbox"
              icon={<ArrowBackIcon />}
              variant="ghost"
              onClick={() => router.push('/dashboard/inbox')}
            />

            <Avatar
              size="sm"
              name={conversation.title || 'Conversation'}
              bg={`${getContextColor(conversation.context_type)}.500`}
            >
              {getContextIcon(conversation.context_type)}
            </Avatar>

            <VStack align="start" spacing={0} flex={1}>
              <HStack>
                <Text fontWeight="semibold" fontSize="md">
                  {conversation.title || 'Conversation'}
                </Text>
                {conversation.context_type && (
                  <Badge
                    size="sm"
                    colorScheme={getContextColor(conversation.context_type)}
                    variant="subtle"
                  >
                    {conversation.context_type}
                  </Badge>
                )}
              </HStack>
              <Text fontSize="xs" color="gray.500">
                {participants.length} participants
              </Text>
            </VStack>
          </HStack>

          {/* Helper Banner for Adoptions */}
          {showBanner && (
            <Box mt={4}>
              <Banner
                title={adoptionBannerProps.title}
                description={adoptionBannerProps.description}
                buttons={adoptionBannerProps.buttons}
              />
            </Box>
          )}
        </Box>

        {/* Contextual Information */}
        {contextData?.contextData && (
          <Box
            w="full"
            bg={useColorModeValue('gray.50', 'gray.700')}
            borderBottom="1px"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            p={4}
          >
            <ContextualInfo contextData={contextData.contextData} />
          </Box>
        )}

        {/* Messages */}
        <Box flex={1} overflowY="auto" w="full" p={4}>
          <VStack spacing={4} align="stretch" maxW="4xl" mx="auto">
            {conversation.messages?.map((message: any, index: number) => {
              const isOwnMessage = message.sender_id === user?.id;
              const showAvatar = !isOwnMessage && (
                index === 0 ||
                conversation.messages[index - 1].sender_id !== message.sender_id
              );

              return (
                <Box
                  key={message.id}
                  alignSelf={isOwnMessage ? 'flex-end' : 'flex-start'}
                  maxW="70%"
                >
                  <HStack
                    spacing={2}
                    align="start"
                    flexDirection={isOwnMessage ? 'row-reverse' : 'row'}
                  >
                    {showAvatar && (
                      <Avatar
                        size="sm"
                        name={message.users?.display_name || 'User'}
                        src={message.users?.profile_photo_url}
                      />
                    )}
                    {!showAvatar && !isOwnMessage && <Box w="32px" />}

                    <VStack align={isOwnMessage ? 'flex-end' : 'flex-start'} spacing={1}>
                      <Box
                        bg={isOwnMessage
                          ? useColorModeValue('blue.500', 'blue.600')
                          : useColorModeValue('white', 'gray.700')
                        }
                        color={isOwnMessage ? 'white' : 'inherit'}
                        px={4}
                        py={2}
                        borderRadius="lg"
                        border={isOwnMessage ? 'none' : '1px solid'}
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        shadow="sm"
                      >
                        {!isOwnMessage && showAvatar && (
                          <Text fontSize="xs" fontWeight="semibold" mb={1}>
                            {message.users?.display_name || 'User'}
                          </Text>
                        )}
                        <Text whiteSpace="pre-wrap">{message.content}</Text>
                      </Box>
                      <Text fontSize="xs" color="gray.500" px={2}>
                        {formatMessageTime(message.created_at)}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              );
            })}

            {(!conversation.messages || conversation.messages.length === 0) && (
              <Box textAlign="center" py={12}>
                <Text color="gray.500">
                  No messages yet. Start the conversation!
                </Text>
              </Box>
            )}

            {/* Typing Indicators */}
            {typingUsers && typingUsers.length > 0 && (
              <Box alignSelf="flex-start" maxW="70%">
                <HStack spacing={2} align="start">
                  <Box w="32px" />
                  <VStack align="flex-start" spacing={1}>
                    <Box
                      bg={useColorModeValue('gray.100', 'gray.600')}
                      px={4}
                      py={2}
                      borderRadius="lg"
                      shadow="sm"
                    >
                      <Text fontSize="sm" color="gray.600">
                        {typingUsers.length === 1
                          ? `${typingUsers[0].displayName} is typing...`
                          : `${typingUsers.length} people are typing...`
                        }
                      </Text>
                    </Box>
                  </VStack>
                </HStack>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </VStack>
        </Box>

        {/* Message Input */}
        <Box
          w="full"
          bg={useColorModeValue('white', 'gray.800')}
          borderTop="1px"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
          p={4}
          position="sticky"
          bottom={0}
          zIndex={10}
        >
          <VStack spacing={3} maxW="4xl" mx="auto">
            {/* File Attachments */}
            <FileAttachmentComponent
              attachments={attachments}
              onAttachmentsChange={setAttachments}
              maxFiles={5}
              maxSize={10}
            />

            {/* Message Input */}
            <HStack spacing={3} w="full">
              <Textarea
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                  handleTyping();
                }}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                resize="none"
                rows={1}
                maxLength={1000}
                bg={useColorModeValue('gray.50', 'gray.700')}
                borderColor={useColorModeValue('gray.300', 'gray.600')}
                _focus={{
                  borderColor: 'blue.500',
                  boxShadow: '0 0 0 1px blue.500',
                }}
              />
              <Button
                colorScheme="blue"
                onClick={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                disabled={!messageText.trim() && attachments.length === 0}
                size="md"
                px={6}
              >
                <IoSend style={{ marginRight: '8px' }} />
                Send
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>

      {/* Status Update Modal */}
      <AdoptionActionDialog
        form={updateForm}
        setForm={setUpdateForm}
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        pendingAction={pendingAction}
        setPendingAction={setPendingAction}
        onSubmit={handleStatusUpdate}
        isLoading={isUpdatingAdoption}
      />
    </>
  );
};

// Contextual Information Component
interface ContextualInfoProps {
  contextData: any;
}

const ContextualInfo: React.FC<ContextualInfoProps> = ({ contextData }) => {
  if (contextData.type === 'adoption') {
    const { adoption, status, timeline, pet, seeker, breeder, price, reservation_fee } = contextData;

    return (
      <VStack spacing={3} align="stretch">
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={1}>
            <HStack>
              <Text fontWeight="semibold" fontSize="lg">
                {pet.name || 'Pet'}
              </Text>
              <Badge colorScheme={status === 'completed' ? 'green' : status === 'approved' ? 'blue' : 'yellow'}>
                {status}
              </Badge>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              {pet.breed} • {pet.age} • {pet.gender}
            </Text>
          </VStack>

          <VStack align="end" spacing={1}>
            <Text fontWeight="semibold" fontSize="lg">
              KES {price?.toLocaleString()}
            </Text>
            {reservation_fee && (
              <Text fontSize="sm" color="gray.600">
                Reservation: KES {reservation_fee.toLocaleString()}
              </Text>
            )}
          </VStack>
        </HStack>

        {/* Adoption Progress */}
        <Box>
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" fontWeight="medium">Adoption Progress</Text>
            <HStack spacing={2}>
              {timeline.submitted && <CheckCircleIcon color="green.500" />}
              {timeline.reserved && <CheckCircleIcon color="blue.500" />}
              {timeline.paid && <CheckCircleIcon color="purple.500" />}
              {timeline.completed && <CheckCircleIcon color="green.500" />}
            </HStack>
          </HStack>
          <Progress
            value={
              timeline.completed ? 100 :
                timeline.paid ? 75 :
                  timeline.reserved ? 50 :
                    timeline.submitted ? 25 : 0
            }
            colorScheme="blue"
            size="sm"
          />
        </Box>

        {/* Participants */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <HStack>
            <Avatar size="sm" name={seeker?.display_name} src={seeker?.profile_photo_url} />
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" fontWeight="medium">{seeker?.display_name}</Text>
              <Text fontSize="xs" color="gray.600">Seeker</Text>
            </VStack>
          </HStack>

          <HStack>
            <Avatar size="sm" name={breeder?.display_name} src={breeder?.profile_photo_url} />
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" fontWeight="medium">{breeder?.display_name}</Text>
              <Text fontSize="xs" color="gray.600">
                {breeder?.breeder_profiles?.kennel_name || 'Breeder'}
              </Text>
            </VStack>
          </HStack>
        </SimpleGrid>
      </VStack>
    );
  }

  if (contextData.type === 'listing') {
    const { listing, title, pet, price, status, location, photos, breeder, available_date } = contextData;

    return (
      <VStack spacing={3} align="stretch">
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={1}>
            <HStack>
              <Text fontWeight="semibold" fontSize="lg">
                {title}
              </Text>
              <Badge colorScheme={status === 'available' ? 'green' : 'gray'}>
                {status}
              </Badge>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              {pet?.breed} • {pet?.age} • {pet?.gender}
            </Text>
          </VStack>

          <VStack align="end" spacing={1}>
            <Text fontWeight="semibold" fontSize="lg">
              KES {price?.toLocaleString()}
            </Text>
            <Text fontSize="sm" color="gray.600">
              📍 {location}
            </Text>
          </VStack>
        </HStack>

        {/* Listing Photos */}
        {photos && photos.length > 0 && (
          <HStack spacing={2} overflowX="auto">
            {photos.slice(0, 3).map((photo: string, index: number) => (
              <Image
                key={index}
                src={photo}
                alt={`${title} ${index + 1}`}
                boxSize="60px"
                objectFit="cover"
                borderRadius="md"
              />
            ))}
            {photos.length > 3 && (
              <Box
                boxSize="60px"
                bg="gray.200"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="xs" fontWeight="medium">
                  +{photos.length - 3}
                </Text>
              </Box>
            )}
          </HStack>
        )}

        {/* Breeder Info */}
        <HStack>
          <Avatar size="sm" name={breeder?.display_name} src={breeder?.profile_photo_url} />
          <VStack align="start" spacing={0}>
            <Text fontSize="sm" fontWeight="medium">{breeder?.display_name}</Text>
            <Text fontSize="xs" color="gray.600">
              {breeder?.breeder_profiles?.kennel_name || 'Breeder'}
            </Text>
          </VStack>
        </HStack>

        {available_date && (
          <HStack>
            <TimeIcon />
            <Text fontSize="sm">
              Available: {new Date(available_date).toLocaleDateString()}
            </Text>
          </HStack>
        )}
      </VStack>
    );
  }

  if (contextData.type === 'support') {
    const { subject, priority, category, ticket_id } = contextData;

    return (
      <VStack spacing={3} align="stretch">
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Text fontWeight="semibold" fontSize="lg">
              Support Ticket
            </Text>
            <Text fontSize="sm" color="gray.600">
              {subject}
            </Text>
          </VStack>

          <VStack align="end" spacing={1}>
            <Badge colorScheme={
              priority === 'urgent' ? 'red' :
                priority === 'high' ? 'orange' :
                  priority === 'normal' ? 'blue' : 'gray'
            }>
              {priority}
            </Badge>
            <Text fontSize="xs" color="gray.600">
              {category}
            </Text>
          </VStack>
        </HStack>

        {ticket_id && (
          <Text fontSize="sm" color="gray.600">
            Ticket ID: {ticket_id}
          </Text>
        )}
      </VStack>
    );
  }

  return null;
};

export default ConversationView;
