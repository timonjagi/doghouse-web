import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  useColorModeValue,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { FiMessageSquare, FiClock, FiAlertCircle } from "react-icons/fi";
import moment from "moment";
import { SupportTicket } from "../../db/schema";

interface SupportTicketListProps {
  tickets: (SupportTicket & {
    support_categories?: {
      id: string;
      name: string;
    };
    _count?: {
      support_ticket_comments: number;
    };
  })[];
  onTicketClick?: (ticket: SupportTicket) => void;
  isLoading?: boolean;
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

const getPriorityIcon = (priority: string) => {
  if (priority === "urgent" || priority === "high") {
    return FiAlertCircle;
  }
  return null;
};

export const SupportTicketList: React.FC<SupportTicketListProps> = ({
  tickets,
  onTicketClick,
  isLoading = false,
}) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (isLoading) {
    return (
      <VStack spacing={4} align="stretch">
        {[1, 2, 3].map((i) => (
          <Card key={i} bg={cardBg} borderColor={borderColor} borderWidth="1px">
            <CardBody>
              <Box height="100px" bg="gray.100" borderRadius="md" />
            </CardBody>
          </Card>
        ))}
      </VStack>
    );
  }

  if (tickets.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Icon as={FiMessageSquare} boxSize={12} color="gray.400" mb={4} />
        <Text fontSize="lg" color="gray.600">
          No support tickets found
        </Text>
        <Text fontSize="sm" color="gray.500">
          Create a ticket if you need assistance
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {tickets.map((ticket) => {
        const PriorityIcon = getPriorityIcon(ticket.priority);
        const commentCount = ticket._count?.support_ticket_comments || 0;

        return (
          <Card
            key={ticket.id}
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            cursor={onTicketClick ? "pointer" : "default"}
            _hover={
              onTicketClick ? { shadow: "md", borderColor: "blue.300" } : {}
            }
            onClick={() => onTicketClick?.(ticket)}
          >
            <CardHeader pb={2}>
              <HStack justify="space-between" align="start">
                <VStack align="start" spacing={1} flex={1}>
                  <HStack spacing={2}>
                    <Text fontSize="sm" color="gray.500">
                      #{ticket.ticket_number}
                    </Text>
                    {ticket.support_categories && (
                      <Badge variant="subtle" colorScheme="blue">
                        {ticket.support_categories.name}
                      </Badge>
                    )}
                  </HStack>
                  <Heading size="md" lineHeight="tight">
                    {ticket.subject}
                  </Heading>
                </VStack>

                <VStack align="end" spacing={1}>
                  <HStack spacing={2}>
                    {PriorityIcon && (
                      <Icon
                        as={PriorityIcon}
                        color={`${getPriorityColor(ticket.priority)}.500`}
                      />
                    )}
                    <Badge
                      colorScheme={getPriorityColor(ticket.priority)}
                      variant="subtle"
                    >
                      {ticket.priority}
                    </Badge>
                    <Badge
                      colorScheme={getStatusColor(ticket.status)}
                      variant="subtle"
                    >
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  </HStack>
                </VStack>
              </HStack>
            </CardHeader>

            <CardBody pt={0}>
              <VStack align="start" spacing={3}>
                <Text color="gray.600" noOfLines={2} fontSize="sm">
                  {ticket.description}
                </Text>

                <Divider />

                <HStack justify="space-between" w="full">
                  <HStack spacing={4}>
                    <HStack spacing={1}>
                      <Icon as={FiMessageSquare} boxSize={4} color="gray.500" />
                      <Text fontSize="sm" color="gray.500">
                        {commentCount}{" "}
                        {commentCount === 1 ? "reply" : "replies"}
                      </Text>
                    </HStack>

                    <HStack spacing={1}>
                      <Icon as={FiClock} boxSize={4} color="gray.500" />
                      <Text fontSize="sm" color="gray.500">
                        {moment(ticket.created_at).fromNow()}
                      </Text>
                    </HStack>
                  </HStack>

                  {ticket.last_reply_at && (
                    <Text fontSize="xs" color="gray.500">
                      Last reply {moment(ticket.last_reply_at).fromNow()}
                    </Text>
                  )}
                </HStack>

                {onTicketClick && (
                  <Button
                    size="sm"
                    variant="outline"
                    alignSelf="flex-end"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTicketClick(ticket);
                    }}
                  >
                    View Details
                  </Button>
                )}
              </VStack>
            </CardBody>
          </Card>
        );
      })}
    </VStack>
  );
};
