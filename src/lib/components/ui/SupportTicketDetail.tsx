import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Avatar,
  Textarea,
  Badge,
  useToast,
  Alert,
  AlertIcon,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { FiSend, FiPaperclip, FiDownload } from "react-icons/fi";
import { format } from "date-fns";
import {
  SupportTicket,
  SupportTicketComment,
  SupportTicketAttachment,
} from "../../db/schema";
import {
  useTicketComments,
  useTicketAttachments,
  useAddTicketComment,
} from "../../hooks/queries/useSupportTickets";
import { useCurrentUser } from "../../hooks/queries/useAuth";

type CommentWithUser = SupportTicketComment & {
  users?: {
    id: string;
    display_name?: string;
    email: string;
    role?: string;
    profile_photo_url?: string;
  };
};

interface SupportTicketDetailProps {
  ticket: SupportTicket & {
    support_categories?: {
      id: string;
      name: string;
    };
  };
  onClose?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "green";
    case "in_progress":
      return "blue";
    case "waiting_for_user":
      return "yellow";
    case "resolved":
      return "purple";
    case "closed":
      return "gray";
    default:
      return "gray";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "red";
    case "high":
      return "orange";
    case "normal":
      return "blue";
    case "low":
      return "gray";
    default:
      return "gray";
  }
};

export const SupportTicketDetail: React.FC<SupportTicketDetailProps> = ({
  ticket,
  onClose,
}) => {
  const toast = useToast();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: currentUser } = useCurrentUser();
  const { data: commentsData = [], isLoading: commentsLoading } =
    useTicketComments(ticket.id);
  const comments = commentsData as CommentWithUser[];
  const { data: attachments = [] } = useTicketAttachments(ticket.id);
  const addComment = useAddTicketComment();

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment.mutateAsync({
        ticketId: ticket.id,
        content: newComment,
      });

      setNewComment("");
      toast({
        title: "Comment added",
        status: "success",
        duration: 2000,
      });
    } catch (error: any) {
      toast({
        title: "Failed to add comment",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadAttachment = (attachment: SupportTicketAttachment) => {
    // In a real app, this would download from Supabase storage
    window.open(attachment.file_path, "_blank");
  };

  const canComment = ticket.status !== "closed" && currentUser;

  return (
    <VStack spacing={6} align="stretch">
      {/* Ticket Header */}
      <Card>
        <CardHeader>
          <VStack align="start" spacing={3}>
            <HStack justify="space-between" w="full">
              <HStack spacing={3}>
                <Text fontSize="lg" fontWeight="bold">
                  Ticket #{ticket.ticket_number}
                </Text>
                <Badge
                  colorScheme={getStatusColor(ticket.status)}
                  variant="subtle"
                >
                  {ticket.status.replace("_", " ")}
                </Badge>
                <Badge
                  colorScheme={getPriorityColor(ticket.priority)}
                  variant="subtle"
                >
                  {ticket.priority}
                </Badge>
              </HStack>
              {onClose && (
                <Button variant="ghost" onClick={onClose}>
                  Close
                </Button>
              )}
            </HStack>

            <VStack align="start" spacing={1}>
              <Text fontSize="xl" fontWeight="semibold">
                {ticket.subject}
              </Text>
              {ticket.support_categories && (
                <Badge variant="outline">
                  {ticket.support_categories.name}
                </Badge>
              )}
            </VStack>

            <HStack spacing={4} fontSize="sm" color="gray.600">
              <Text>
                Created{" "}
                {format(new Date(ticket.created_at), "MMM d, yyyy 'at' h:mm a")}
              </Text>
              {ticket.last_reply_at && (
                <Text>
                  Last reply{" "}
                  {format(
                    new Date(ticket.last_reply_at),
                    "MMM d, yyyy 'at' h:mm a"
                  )}
                </Text>
              )}
            </HStack>
          </VStack>
        </CardHeader>

        <CardBody pt={0}>
          <Text whiteSpace="pre-wrap">{ticket.description}</Text>

          {attachments.length > 0 && (
            <VStack align="start" spacing={2} mt={4}>
              <Text fontSize="sm" fontWeight="semibold">
                Attachments:
              </Text>
              {attachments.map((attachment) => (
                <HStack key={attachment.id} spacing={2}>
                  <Icon as={FiPaperclip} />
                  <Text fontSize="sm">{attachment.original_filename}</Text>
                  <Button
                    size="xs"
                    variant="ghost"
                    leftIcon={<FiDownload />}
                    onClick={() => downloadAttachment(attachment)}
                  >
                    Download
                  </Button>
                </HStack>
              ))}
            </VStack>
          )}
        </CardBody>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold">
            Conversation
          </Text>
        </CardHeader>

        <CardBody>
          {commentsLoading ? (
            <Box textAlign="center" py={4}>
              <Spinner />
            </Box>
          ) : comments.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={4}>
              No comments yet
            </Text>
          ) : (
            <VStack spacing={4} align="stretch">
              {comments.map((comment) => (
                <Box key={comment.id}>
                  <HStack spacing={3} align="start">
                    <Avatar
                      size="sm"
                      name={comment.users?.display_name || "Unknown User"}
                      src={comment.users?.profile_photo_url}
                    />
                    <VStack align="start" spacing={1} flex={1}>
                      <HStack spacing={2}>
                        <Text fontWeight="semibold" fontSize="sm">
                          {comment.users?.display_name || "Unknown User"}
                        </Text>
                        {comment.users?.role === "admin" && (
                          <Badge
                            colorScheme="red"
                            variant="subtle"
                            fontSize="xs"
                          >
                            Admin
                          </Badge>
                        )}
                        <Text fontSize="xs" color="gray.500">
                          {format(
                            new Date(comment.created_at),
                            "MMM d, yyyy 'at' h:mm a"
                          )}
                        </Text>
                      </HStack>
                      <Text whiteSpace="pre-wrap" fontSize="sm">
                        {comment.content}
                      </Text>
                    </VStack>
                  </HStack>
                  <Divider mt={4} />
                </Box>
              ))}
            </VStack>
          )}

          {/* Add Comment */}
          {canComment && (
            <VStack spacing={3} mt={6} align="stretch">
              <Text fontWeight="semibold">Add a comment</Text>
              <Textarea
                placeholder="Type your message here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                resize="vertical"
              />
              <HStack justify="flex-end">
                <Button
                  colorScheme="blue"
                  leftIcon={<FiSend />}
                  onClick={handleAddComment}
                  isLoading={isSubmitting}
                  loadingText="Sending..."
                  isDisabled={!newComment.trim()}
                >
                  Send Comment
                </Button>
              </HStack>
            </VStack>
          )}

          {!canComment && ticket.status === "closed" && (
            <Alert status="info" mt={4}>
              <AlertIcon />
              This ticket is closed. If you need further assistance, please
              create a new ticket.
            </Alert>
          )}
        </CardBody>
      </Card>
    </VStack>
  );
};
