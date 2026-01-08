import React, { useState } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Badge,
  Icon,
} from "@chakra-ui/react";
import {
  FiPlus,
  FiMessageSquare,
  FiHelpCircle,
  FiFileText,
} from "react-icons/fi";
import Head from "next/head";
import { SupportTicketList } from "../../../lib/components/ui/SupportTicketList";
import { SupportTicketDetail } from "../../../lib/components/ui/SupportTicketDetail";
import { SupportTicketForm } from "../../../lib/components/ui/SupportTicketForm";
import { SupportFAQ } from "../../../lib/components/ui/SupportFAQ";
import { useSupportTickets } from "../../../lib/hooks/queries/useSupportTickets";
import {
  useSupportFAQs,
  useFeaturedFAQs,
} from "../../../lib/hooks/queries/useSupportFAQs";
import { useCurrentUser } from "../../../lib/hooks/queries/useAuth";

const DashboardSupportPage = () => {
  const {
    isOpen: isTicketModalOpen,
    onOpen: onTicketModalOpen,
    onClose: onTicketModalClose,
  } = useDisclosure();
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showTicketSuccess, setShowTicketSuccess] = useState(false);

  const { data: currentUser } = useCurrentUser();
  const { data: userTickets = [] } = useSupportTickets(currentUser?.id);
  const { data: allFAQs = [] } = useSupportFAQs();
  const { data: featuredFAQs = [] } = useFeaturedFAQs();

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket(ticket);
  };

  const handleTicketCreated = () => {
    setShowTicketSuccess(true);
    setTimeout(() => setShowTicketSuccess(false), 5000);
    onTicketModalClose();
  };

  const handleBackToList = () => {
    setSelectedTicket(null);
  };

  if (!currentUser) {
    return (
      <Container maxW="6xl" py={8}>
        <Box textAlign="center">
          <Text>Please sign in to access support</Text>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>Support - Dashboard - Pethouse</title>
        <meta
          name="description"
          content="Manage your support tickets and access help resources"
        />
      </Head>

      <Container maxW="6xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center">
            <Box>
              <Text fontSize="3xl" fontWeight="bold" mb={2}>
                Support Center
              </Text>
              <Text color="gray.600">
                Get help with your account and manage support tickets
              </Text>
            </Box>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              size="lg"
              onClick={onTicketModalOpen}
            >
              Create Support Ticket
            </Button>
          </HStack>

          {/* Success Message */}
          {showTicketSuccess && (
            <Box
              p={4}
              bg="green.50"
              border="1px solid"
              borderColor="green.200"
              borderRadius="md"
              color="green.800"
            >
              <Text fontWeight="semibold">
                Support ticket created successfully!
              </Text>
              <Text fontSize="sm" mt={1}>
                Our team will get back to you within 24 hours. Check your
                notifications for updates.
              </Text>
            </Box>
          )}

          {/* Main Content */}
          {selectedTicket ? (
            <SupportTicketDetail
              ticket={selectedTicket}
              onClose={handleBackToList}
            />
          ) : (
            <Tabs variant="enclosed" colorScheme="blue">
              <TabList>
                <Tab>
                  <HStack spacing={2}>
                    <Icon as={FiFileText} />
                    <Text>My Tickets</Text>
                    {userTickets.length > 0 && (
                      <Badge colorScheme="blue" borderRadius="full" px={2}>
                        {userTickets.length}
                      </Badge>
                    )}
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={2}>
                    <Icon as={FiHelpCircle} />
                    <Text>Help & FAQs</Text>
                  </HStack>
                </Tab>
              </TabList>

              <TabPanels>
                {/* Tickets Tab */}
                <TabPanel px={0}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Text fontSize="xl" fontWeight="semibold" mb={4}>
                        Your Support Tickets
                      </Text>

                      <SupportTicketList
                        tickets={userTickets}
                        onTicketClick={handleTicketClick}
                      />

                      {userTickets.length === 0 && (
                        <Box textAlign="center" py={12}>
                          <Icon
                            as={FiFileText}
                            boxSize={12}
                            color="gray.400"
                            mb={4}
                          />
                          <Text fontSize="lg" color="gray.600" mb={2}>
                            No support tickets yet
                          </Text>
                          <Text fontSize="sm" color="gray.500" mb={4}>
                            Need help? Create your first support ticket to get
                            assistance from our team.
                          </Text>
                          <Button
                            leftIcon={<FiPlus />}
                            colorScheme="blue"
                            onClick={onTicketModalOpen}
                          >
                            Create Your First Ticket
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </VStack>
                </TabPanel>

                {/* FAQs Tab */}
                <TabPanel px={0}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Text fontSize="xl" fontWeight="semibold" mb={4}>
                        Frequently Asked Questions
                      </Text>

                      <Text color="gray.600" mb={6}>
                        Browse our most popular questions and answers. Can't
                        find what you're looking for? Create a support ticket.
                      </Text>

                      {featuredFAQs.length > 0 ? (
                        <VStack spacing={4} align="stretch">
                          {featuredFAQs.map((faq) => (
                            <SupportFAQ
                              key={faq.id}
                              faq={faq}
                              showCategory={true}
                              showVotes={true}
                              showViewCount={true}
                            />
                          ))}
                        </VStack>
                      ) : (
                        <Box textAlign="center" py={8}>
                          <Icon
                            as={FiHelpCircle}
                            boxSize={8}
                            color="gray.400"
                            mb={4}
                          />
                          <Text color="gray.600">
                            No featured FAQs available at the moment
                          </Text>
                        </Box>
                      )}

                      {allFAQs.length > featuredFAQs.length && (
                        <Box mt={6} textAlign="center">
                          <Text fontSize="sm" color="gray.500" mb={3}>
                            Need more help? Browse all FAQs or create a support
                            ticket.
                          </Text>
                          <HStack spacing={3} justify="center">
                            <Button
                              variant="outline"
                              onClick={() => window.open("/support", "_blank")}
                            >
                              Browse All FAQs
                            </Button>
                            <Button
                              leftIcon={<FiMessageSquare />}
                              colorScheme="blue"
                              onClick={onTicketModalOpen}
                            >
                              Create Ticket
                            </Button>
                          </HStack>
                        </Box>
                      )}
                    </Box>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </VStack>
      </Container>

      {/* Support Ticket Modal */}
      <SupportTicketForm
        isOpen={isTicketModalOpen}
        onClose={onTicketModalClose}
        onSuccess={handleTicketCreated}
      />
    </>
  );
};

export default DashboardSupportPage;
