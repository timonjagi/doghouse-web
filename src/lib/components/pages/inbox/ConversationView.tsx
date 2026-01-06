import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Textarea,
  Button,
  useColorModeValue,
  Spinner,
  useToast,
  Badge,
  Progress,
  SimpleGrid,
  Alert,
  AlertIcon,
  Flex,
  useDisclosure,
  IconButton,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  ChatIcon,
  AttachmentIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import { IoSend } from "react-icons/io5";
import {
  useConversation,
  useSendMessage,
  useMarkConversationAsRead,
} from "../../../hooks/queries/useConversations";
import { useConversationWithContext } from "../../../hooks/queries/useContextConversations";
import { useRealtimeMessaging } from "../../../hooks/queries/useRealtimeMessaging";
import { useCurrentUser } from "../../../hooks/queries/useAuth";
import {
  useTypingIndicator,
  useTypingUsers,
  useTypingSubscription,
} from "../../../hooks/queries/useTypingIndicator";
import { AdoptionActionList } from "../adoptions/AdoptionActionList";
import {
  getPriorityAdoptionAction,
  useAdoption,
} from "../../../hooks/queries/useAdoptions";
import FileAttachmentComponent from "../../ui/FileAttachment";

interface ContextualInfoProps {
  contextData: any;
}

const ContextualInfo: React.FC<ContextualInfoProps> = ({ contextData }) => {
  const router = useRouter();
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  if (contextData.type === "adoption") {
    const {
      status,
      timeline,
      pet,
      seeker,
      breeder,
      price,
      reservation_fee,
      adoption,
    } = contextData;
    const { data: adoptionDetail, isLoading: adoptionDetailLoading } =
      useAdoption(adoption);

    return (
      <VStack spacing={3} align="stretch">
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={1}>
            <Text fontWeight="semibold" fontSize="lg">
              {pet.name || "Pet"}
            </Text>
            <Badge
              colorScheme={
                status === "completed"
                  ? "green"
                  : status === "approved"
                  ? "blue"
                  : "yellow"
              }
            >
              {status}
            </Badge>
            {!adoptionDetail && adoption && (
              <Button
                as="a"
                href={`/dashboard/adoptions/${adoption}`}
                size="xs"
                variant="ghost"
                colorScheme="blue"
                mt={1}
              >
                View Adoption Details
              </Button>
            )}
          </VStack>

          <VStack align="end" spacing={1}>
            <Text
              fontWeight="semibold"
              fontSize="lg"
              color={useColorModeValue("gray.600", "gray.400")}
            >
              KES {price?.toLocaleString()}
            </Text>
            {reservation_fee && (
              <Text
                fontSize="sm"
                color={useColorModeValue("gray.600", "gray.400")}
              >
                Reservation: KES {reservation_fee.toLocaleString()}
              </Text>
            )}
          </VStack>
        </HStack>

        <Box>
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" fontWeight="medium">
              Adoption Progress
            </Text>
            <HStack spacing={2}>
              {timeline.submitted && <CheckCircleIcon color="green.500" />}
              {timeline.reserved && <CheckCircleIcon color="blue.500" />}
              {timeline.paid && <CheckCircleIcon color="purple.500" />}
              {timeline.completed && <CheckCircleIcon color="green.500" />}
            </HStack>
          </HStack>
          <Progress
            value={
              timeline.completed
                ? 100
                : timeline.paid
                ? 75
                : timeline.reserved
                ? 50
                : timeline.submitted
                ? 25
                : 0
            }
            colorScheme="blue"
            size="sm"
          />
        </Box>

        {/* <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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
        </SimpleGrid> */}
      </VStack>
    );
  }

  if (contextData.type === "support") {
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
            <Badge
              colorScheme={
                priority === "urgent"
                  ? "red"
                  : priority === "high"
                  ? "orange"
                  : priority === "normal"
                  ? "blue"
                  : "gray"
              }
            >
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

interface ConversationViewProps {
  conversationId: string;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  conversationId,
}) => {
  // All hooks must be called before any conditional returns
  const router = useRouter();
  const toast = useToast();

  const { data: user } = useCurrentUser();
  const {
    data: conversation,
    isLoading,
    error,
  } = useConversation(conversationId);
  const { data: contextData } = useConversationWithContext(conversationId);
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkConversationAsRead();

  const [messageText, setMessageText] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isOpen: isAttachmentOpen,
    onOpen: onAttachmentOpen,
    onClose: onAttachmentClose,
  } = useDisclosure();

  useRealtimeMessaging({ userId: user?.id, conversationId });

  const { handleTyping } = useTypingIndicator(conversationId, user?.id);
  const { data: typingUsers } = useTypingUsers(conversationId);
  useTypingSubscription(conversationId);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages, scrollToBottom]);

  useEffect(() => {
    if (conversation && user?.id) {
      markAsReadMutation.mutate({ conversationId, userId: user.id });
    }
  }, [conversation, user?.id, conversationId]);

  const handleSendMessage = useCallback(async () => {
    if ((!messageText.trim() && attachments.length === 0) || !user?.id) return;

    try {
      await sendMessageMutation.mutateAsync({
        conversationId,
        senderId: user.id,
        content: messageText.trim() || null,
        attachments: attachments.length > 0 ? attachments : null,
      });

      setMessageText("");
      setAttachments([]);
      toast({
        title: "Message sent",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again",
        status: "error",
        duration: 3000,
      });
    }
  }, [
    messageText,
    attachments,
    user?.id,
    conversationId,
    sendMessageMutation,
    toast,
  ]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const formatMessageTime = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  }, []);

  // Memoize computed values
  const showContextualInfo = useMemo(() => {
    if (!contextData?.contextData?.adoption || !user) return false;
    const { adoption } = contextData.contextData;
    return ["submitted", "pending", "approved", "reserved"].includes(
      adoption.status
    );
  }, [contextData?.contextData?.adoption, user]);

  const showAdoptionActions = useMemo(() => {
    return showContextualInfo && conversation?.context_type === "adoption";
  }, [showContextualInfo, conversation?.context_type]);

  const priorityAction = useMemo(() => {
    if (!contextData?.contextData?.adoption) return null;
    return getPriorityAdoptionAction(
      contextData.contextData.adoption,
      user,
      contextData.contextData.transactions || []
    );
  }, [
    contextData?.contextData?.adoption,
    user,
    contextData?.contextData?.transactions,
  ]);

  // Now handle loading and error states after all hooks
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
          Failed to load conversation. It may not exist or you may not have
          access.
        </Alert>
        <Button mt={4} onClick={() => router.push("/dashboard/inbox")}>
          Back to Inbox
        </Button>
      </Box>
    );
  }

  return (
    <Flex direction="column" flex="1" w="full" h="full" overflow="hidden">
      {/* Contextual Info - Fixed at top */}
      {showContextualInfo && contextData?.contextData && (
        <Box
          w="full"
          bg={useColorModeValue("white", "gray.800")}
          borderBottom="1px"
          borderColor={useColorModeValue("gray.200", "gray.600")}
          p={4}
        >
          <Box maxW="6xl" mx="auto">
            <ContextualInfo contextData={contextData.contextData} />
          </Box>
        </Box>
      )}

      {/* Scrollable Messages Area */}
      <Box
        flex={1}
        w="full"
        overflowY="auto"
        bg={useColorModeValue("gray.50", "gray.900")}
        p={4}
      >
        <VStack spacing={4} align="stretch" maxW="6xl" mx="auto">
          {conversation.messages?.map((message: any, index: number) => {
            const isOwnMessage = message.sender_id === user?.id;
            const showAvatar =
              !isOwnMessage &&
              (index === 0 ||
                conversation.messages[index - 1].sender_id !==
                  message.sender_id);

            return (
              <Box
                key={message.id}
                alignSelf={isOwnMessage ? "flex-end" : "flex-start"}
                maxW="70%"
              >
                <HStack
                  spacing={2}
                  align="start"
                  flexDirection={isOwnMessage ? "row-reverse" : "row"}
                >
                  {showAvatar && (
                    <Avatar
                      size="sm"
                      name={message.users?.display_name || "User"}
                      src={message.users?.profile_photo_url}
                    />
                  )}
                  {!showAvatar && !isOwnMessage && <Box w="32px" />}

                  <VStack
                    align={isOwnMessage ? "flex-end" : "flex-start"}
                    spacing={1}
                  >
                    <Box
                      bg={
                        isOwnMessage
                          ? useColorModeValue("blue.500", "blue.600")
                          : useColorModeValue("white", "gray.700")
                      }
                      color={isOwnMessage ? "white" : "inherit"}
                      px={4}
                      py={2}
                      borderRadius="lg"
                      border={isOwnMessage ? "none" : "1px solid"}
                      borderColor={useColorModeValue("gray.200", "gray.600")}
                      shadow="sm"
                    >
                      {!isOwnMessage && showAvatar && (
                        <Text fontSize="xs" fontWeight="semibold" mb={1}>
                          {message.users?.display_name || "User"}
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

          {typingUsers && typingUsers.length > 0 && (
            <Box alignSelf="flex-start" maxW="70%">
              <HStack spacing={2} align="start">
                <Box w="32px" />
                <VStack align="flex-start" spacing={1}>
                  <Box
                    bg={useColorModeValue("gray.100", "gray.600")}
                    px={4}
                    py={2}
                    borderRadius="lg"
                    shadow="sm"
                  >
                    <Text fontSize="sm" color="gray.600">
                      {typingUsers.length === 1
                        ? `${typingUsers[0].displayName} is typing...`
                        : `${typingUsers.length} people are typing...`}
                    </Text>
                  </Box>
                </VStack>
              </HStack>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Adoption Actions - Fixed above input */}
      {showAdoptionActions && contextData?.contextData?.adoption && (
        <Box
          w="full"
          px={4}
          py={2}
          bg={useColorModeValue("white", "gray.800")}
          borderTop="1px"
          borderColor={useColorModeValue("gray.200", "gray.600")}
        >
          <Box maxW="6xl" mx="auto">
            <AdoptionActionList
              adoption={contextData.contextData.adoption}
              userProfile={user}
              transactions={contextData.contextData.transactions || []}
              variant="banner"
            />
          </Box>
        </Box>
      )}

      {/* Message Input - Fixed at bottom */}
      <Box
        w="full"
        bg={useColorModeValue("white", "gray.800")}
        borderTop="1px"
        borderColor={useColorModeValue("gray.200", "gray.600")}
        p={4}
      >
        <VStack spacing={3} maxW="6xl" mx="auto">
          {attachments.length > 0 && (
            <HStack w="full" spacing={2} overflowX="auto" py={2}>
              {attachments.map((att) => (
                <Badge
                  key={att.id}
                  colorScheme="blue"
                  variant="subtle"
                  px={2}
                  py={1}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                >
                  <Text maxW="100px" isTruncated fontSize="xs">
                    {att.name}
                  </Text>
                  <IconButton
                    aria-label="Remove"
                    icon={<CloseIcon fontSize="8px" />}
                    size="xs"
                    variant="ghost"
                    ml={1}
                    onClick={() =>
                      setAttachments((prev) =>
                        prev.filter((a) => a.id !== att.id)
                      )
                    }
                  />
                </Badge>
              ))}
            </HStack>
          )}
          <HStack spacing={3} w="full">
            <Box position="relative">
              <IconButton
                aria-label="Attach files"
                icon={<AttachmentIcon />}
                onClick={onAttachmentOpen}
                variant="ghost"
                color={attachments.length > 0 ? "blue.500" : "gray.500"}
              />
              {attachments.length > 0 && (
                <Badge
                  position="absolute"
                  top="-1"
                  right="-1"
                  colorScheme="red"
                  variant="solid"
                  borderRadius="full"
                  fontSize="2xs"
                  minW="16px"
                  h="16px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {attachments.length}
                </Badge>
              )}
            </Box>
            <Tooltip
              label={
                priorityAction
                  ? "Please complete the pending action in the adoption details above before messaging"
                  : undefined
              }
              hasArrow
            >
              <Textarea
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                }}
                onKeyUp={handleKeyPress}
                placeholder={
                  priorityAction
                    ? "Please complete a pending action above..."
                    : "Type your message..."
                }
                resize="none"
                rows={1}
                maxLength={1000}
                bg={useColorModeValue("gray.50", "gray.700")}
                borderColor={useColorModeValue("gray.300", "gray.600")}
                isDisabled={!!priorityAction}
              />
            </Tooltip>
            <Button
              colorScheme="blue"
              onClick={handleSendMessage}
              isLoading={sendMessageMutation.isPending}
              isDisabled={
                !!priorityAction ||
                (!messageText.trim() && attachments.length === 0)
              }
              size="md"
              px={6}
            >
              <IoSend style={{ marginRight: "8px" }} />
              Send
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* File Attachment Drawer */}
      <Drawer
        isOpen={isAttachmentOpen}
        placement="bottom"
        onClose={onAttachmentClose}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Attach Files</DrawerHeader>

          <DrawerBody>
            <Box py={4}>
              <FileAttachmentComponent
                attachments={attachments}
                onAttachmentsChange={setAttachments}
                maxFiles={5}
                maxSize={10}
              />
            </Box>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onAttachmentClose}>
              Done
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default ConversationView;
