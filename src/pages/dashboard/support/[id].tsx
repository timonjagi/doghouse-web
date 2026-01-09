import React from "react";
import {
  Box,
  Container,
  VStack,
  Button,
  Badge,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import Head from "next/head";
import { useRouter } from "next/router";
import { PageHeaderWithTwoButtons } from "../../../../lib/components/ui/PageHeaderWithTwoButtons";
import { SupportTicketDetail } from "../../../../lib/components/ui/SupportTicketDetail";
import { useSupportTicket } from "../../../../lib/hooks/queries/useSupportTickets";
import { useCurrentUser } from "../../../../lib/hooks/queries/useAuth";
import { Loader } from "../../../../lib/components/ui/Loader";

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

const SupportTicketPage: React.FC = () => {
  const router = useRouter();
  const ticketId = router.query.id as string;

  const { data: currentUser } = useCurrentUser();
  const { data: ticket, isLoading, error } = useSupportTicket(ticketId);

  if (isLoading) {
    return <Loader />;
  }

  if (error || !ticket) {
    return (
      <Container maxW="6xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Support ticket not found or you don't have permission to view it.
        </Alert>
      </Container>
    );
  }

  if (!currentUser) {
    return (
      <Container maxW="6xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Please sign in to view support tickets.
        </Alert>
      </Container>
    );
  }

  // Check if user can view this ticket (must be the ticket owner or an admin)
  const canViewTicket = ticket.user_id === currentUser.id || currentUser.role === 'admin';
  if (!canViewTicket) {
    return (
      <Container maxW="6xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          You don't have permission to view this support ticket.
        </Alert>
      </Container>
    );
  }

  const statusBadge = (
    <Badge
      colorScheme={getStatusColor(ticket.status)}
      variant="subtle"
      textTransform="capitalize"
    >
      {ticket.status.replace("_", " ")}
    </Badge>
  );

  const priorityBadge = (
    <Badge
      colorScheme={getPriorityColor(ticket.priority)}
      variant="subtle"
      textTransform="capitalize"
    >
      {ticket.priority} Priority
    </Badge>
  );

  const categoryBadge = (ticket as any).support_categories ? (
    <Badge colorScheme="blue" variant="subtle">
      {(ticket as any).support_categories.name}
    </Badge>
  ) : null;

  const badges = [statusBadge, priorityBadge, categoryBadge].filter(Boolean);

  return (
    <>
      <Head>
        <title>Ticket #{ticket.ticket_number} - Support - Pethouse</title>
        <meta
          name="description"
          content={`View support ticket #${ticket.ticket_number}: ${ticket.subject}`}
        />
      </Head>

      <Container maxW="6xl" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <PageHeaderWithTwoButtons
            title={`Ticket #${ticket.ticket_number}`}
            description={ticket.subject}
            badges={badges}
            actions={
              <Button
                variant="ghost"
                leftIcon={<FiArrowLeft />}
                onClick={() => router.push("/dashboard/support")}
              >
                Back to Tickets
              </Button>
            }
            flexDir={{ base: "column", md: "row" }}
          />

          {/* Ticket Detail */}
          <SupportTicketDetail ticket={ticket} />
        </VStack>
      </Container>
    </>
  );
};

export default SupportTicketPage;
