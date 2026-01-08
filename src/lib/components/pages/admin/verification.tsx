import React, { useState, useMemo } from "react";
import {
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Box,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Avatar,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Progress,
  useColorModeValue,
  Textarea,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiTrendingUp,
  FiClock,
  FiShield,
  FiAlertTriangle,
  FiFileText,
  FiUser,
  FiCalendar,
} from "react-icons/fi";
import { useUserProfile } from "../../../hooks/queries";
import {
  usePendingVerifications,
  useVerificationStats,
  useVerificationDetails,
  useVerificationActions,
  useVerificationHistory,
} from "../../../hooks/queries/useAdminVerifications";
import { NextSeo } from "next-seo";
import { Loader } from "../../ui/Loader";

const AdminVerificationPage: React.FC = () => {
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: verificationStats, isLoading: statsLoading } =
    useVerificationStats();
  const toast = useToast();

  // Filters and pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "verified" | "rejected" | ""
  >("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [actionType, setActionType] = useState<
    "approve" | "reject" | "request_info" | null
  >(null);
  const [actionNotes, setActionNotes] = useState("");

  // Modal states
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure();
  const {
    isOpen: isActionOpen,
    onOpen: onActionOpen,
    onClose: onActionClose,
  } = useDisclosure();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Build filters object
  const filters = useMemo(
    () => ({
      status: statusFilter || undefined,
      search: searchTerm || undefined,
    }),
    [statusFilter, searchTerm]
  );

  const {
    data: verificationsData,
    isLoading: verificationsLoading,
    refetch: refetchVerifications,
  } = usePendingVerifications(filters, currentPage, 20);

  const { data: selectedRequestDetails, isLoading: detailsLoading } =
    useVerificationDetails(selectedRequest || "");
  const { data: verificationHistory } = useVerificationHistory(
    selectedRequest || ""
  );
  const verificationActions = useVerificationActions();

  if (profileLoading || statsLoading) {
    return <Loader />;
  }

  if (!userProfile || userProfile.role !== "admin") {
    return (
      <Container maxW="7xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <Text>Access denied. Admin privileges required.</Text>
        </Alert>
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeColor = (status: boolean, rejected?: boolean) => {
    if (rejected) return "red";
    return status ? "green" : "yellow";
  };

  const getStatusText = (request: any) => {
    if (request.verification_docs?.rejected) return "Rejected";
    return request.verified ? "Verified" : "Pending";
  };

  const handleVerificationAction = async (
    requestId: string,
    action: "approve" | "reject" | "request_info"
  ) => {
    try {
      await verificationActions.mutateAsync({
        requestId,
        action,
        notes: actionNotes,
      });

      toast({
        title: "Action completed",
        description: `Verification request ${action.replace(
          "_",
          " "
        )} successfully.`,
        status:
          action === "approve"
            ? "success"
            : action === "reject"
            ? "warning"
            : "info",
        duration: 3000,
      });

      refetchVerifications();
      onActionClose();
      setActionNotes("");
      setActionType(null);
    } catch (error) {
      toast({
        title: "Action failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        status: "error",
        duration: 3000,
      });
    }
  };

  const openRequestDetails = (requestId: string) => {
    setSelectedRequest(requestId);
    onDetailsOpen();
  };

  const openActionModal = (
    requestId: string,
    action: "approve" | "reject" | "request_info"
  ) => {
    setSelectedRequest(requestId);
    setActionType(action);
    onActionOpen();
  };

  const totalPages = Math.ceil((verificationsData?.total || 0) / 20);

  return (
    <>
      <NextSeo title="Breeder Verification - Admin Dashboard" />

      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="lg" mb={2}>
              Breeder Verification
            </Heading>
            <Text color="gray.600">
              Review and approve breeder verification requests. Ensure breeders
              meet platform standards before they can list pets.
            </Text>
          </Box>

          {/* Stats Overview */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Pending Reviews</StatLabel>
                  <StatNumber>
                    {verificationStats?.totalPending || 0}
                  </StatNumber>
                  <StatHelpText>
                    <HStack>
                      <FiClock color="orange" />
                      <Text>Awaiting review</Text>
                    </HStack>
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Verified Breeders</StatLabel>
                  <StatNumber>
                    {verificationStats?.totalVerified || 0}
                  </StatNumber>
                  <StatHelpText>
                    <HStack>
                      <FiCheckCircle color="green" />
                      <Text>Approved</Text>
                    </HStack>
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Rejected</StatLabel>
                  <StatNumber>
                    {verificationStats?.totalRejected || 0}
                  </StatNumber>
                  <StatHelpText>
                    <HStack>
                      <FiXCircle color="red" />
                      <Text>Did not meet criteria</Text>
                    </HStack>
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Avg. Processing Time</StatLabel>
                  <StatNumber>
                    {verificationStats?.averageProcessingTime
                      ? `${Math.round(
                          verificationStats.averageProcessingTime
                        )}d`
                      : "N/A"}
                  </StatNumber>
                  <StatHelpText>From submission to decision</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Filters and Search */}
          <Card>
            <CardBody>
              <HStack spacing={4} wrap="wrap">
                <InputGroup maxW="300px">
                  <InputLeftElement>
                    <FiSearch />
                  </InputLeftElement>
                  <Input
                    placeholder="Search breeders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>

                <Select
                  placeholder="All Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  maxW="150px"
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </Select>

                <Button
                  leftIcon={<FiFilter />}
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </HStack>
            </CardBody>
          </Card>

          {/* Verification Requests Table */}
          <Card>
            <CardBody>
              {verificationsLoading ? (
                <Box textAlign="center" py={8}>
                  <Spinner size="lg" />
                  <Text mt={4}>Loading verification requests...</Text>
                </Box>
              ) : verificationsData?.requests.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <FiShield size={48} color="gray" />
                  <Text fontSize="lg" color="gray.500" mt={4}>
                    No verification requests found
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    Try adjusting your search filters
                  </Text>
                </Box>
              ) : (
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Breeder</Th>
                        <Th>Business</Th>
                        <Th>Status</Th>
                        <Th>Submitted</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {verificationsData?.requests.map((request) => (
                        <Tr key={request.id}>
                          <Td>
                            <HStack>
                              <Avatar
                                size="sm"
                                src={
                                  request.users?.profile_photo_url || undefined
                                }
                                name={
                                  request.users?.display_name ||
                                  request.users?.email
                                }
                              />
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="medium">
                                  {request.users?.display_name || "No name"}
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                  {request.users?.email}
                                </Text>
                              </VStack>
                            </HStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="medium">
                                {request.kennel_name || "No kennel name"}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                Breeds:{" "}
                                {request.user_breeds?.filter(
                                  (b) => b.is_verified
                                ).length || 0}{" "}
                                verified / {request.user_breeds?.length || 0}{" "}
                                total
                              </Text>
                            </VStack>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={getStatusBadgeColor(
                                request.verified,
                                request.verification_docs?.rejected
                              )}
                            >
                              {getStatusText(request)}
                            </Badge>
                          </Td>
                          <Td>
                            <Text fontSize="sm">
                              {formatDate(request.created_at)}
                            </Text>
                          </Td>
                          <Td>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<FiMoreVertical />}
                                variant="ghost"
                                size="sm"
                              />
                              <MenuList>
                                <MenuItem
                                  icon={<FiEye />}
                                  onClick={() => openRequestDetails(request.id)}
                                >
                                  View Details
                                </MenuItem>
                                {!request.verified &&
                                  !request.verification_docs?.rejected && (
                                    <>
                                      <MenuItem
                                        icon={<FiCheckCircle />}
                                        onClick={() =>
                                          openActionModal(request.id, "approve")
                                        }
                                      >
                                        Approve
                                      </MenuItem>
                                      <MenuItem
                                        icon={<FiXCircle />}
                                        onClick={() =>
                                          openActionModal(request.id, "reject")
                                        }
                                      >
                                        Reject
                                      </MenuItem>
                                      <MenuItem
                                        icon={<FiAlertTriangle />}
                                        onClick={() =>
                                          openActionModal(
                                            request.id,
                                            "request_info"
                                          )
                                        }
                                      >
                                        Request More Info
                                      </MenuItem>
                                    </>
                                  )}
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <HStack justify="center" mt={6}>
                  <Button
                    leftIcon={<FiChevronLeft />}
                    isDisabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    size="sm"
                  >
                    Previous
                  </Button>
                  <Text>
                    Page {currentPage} of {totalPages}
                  </Text>
                  <Button
                    rightIcon={<FiChevronRight />}
                    isDisabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    size="sm"
                  >
                    Next
                  </Button>
                </HStack>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>

      {/* Request Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Verification Request Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {detailsLoading ? (
              <Box textAlign="center" py={8}>
                <Spinner />
                <Text mt={4}>Loading request details...</Text>
              </Box>
            ) : selectedRequestDetails ? (
              <Tabs>
                <TabList>
                  <Tab>Details</Tab>
                  <Tab>Documents</Tab>
                  <Tab>History</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <VStack spacing={6} align="stretch">
                      <HStack>
                        <Avatar
                          size="lg"
                          src={
                            selectedRequestDetails.users?.profile_photo_url ||
                            undefined
                          }
                          name={
                            selectedRequestDetails.users?.display_name ||
                            selectedRequestDetails.users?.email
                          }
                        />
                        <VStack align="start">
                          <Heading size="md">
                            {selectedRequestDetails.users?.display_name ||
                              "No name"}
                          </Heading>
                          <Text color="gray.600">
                            {selectedRequestDetails.users?.email}
                          </Text>
                          <Badge
                            colorScheme={getStatusBadgeColor(
                              selectedRequestDetails.verified,
                              selectedRequestDetails.verification_docs?.rejected
                            )}
                          >
                            {getStatusText(selectedRequestDetails)}
                          </Badge>
                        </VStack>
                      </HStack>

                      <SimpleGrid columns={2} spacing={4}>
                        <Box>
                          <Text fontWeight="bold">Kennel Name</Text>
                          <Text>
                            {selectedRequestDetails.kennel_name ||
                              "Not provided"}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">Kennel Location</Text>
                          <Text>
                            {selectedRequestDetails.kennel_location ||
                              "Not provided"}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">Breeds</Text>
                          <Text>
                            {selectedRequestDetails.user_breeds?.filter(
                              (b) => b.is_verified
                            ).length || 0}{" "}
                            verified /{" "}
                            {selectedRequestDetails.user_breeds?.length || 0}{" "}
                            total
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">Phone</Text>
                          <Text>
                            {selectedRequestDetails.users?.phone ||
                              "Not provided"}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">Location</Text>
                          <Text>
                            {selectedRequestDetails.users?.location_text ||
                              "Not provided"}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">Submitted</Text>
                          <Text>
                            {formatDate(selectedRequestDetails.created_at)}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">Last Updated</Text>
                          <Text>
                            {formatDate(selectedRequestDetails.updated_at)}
                          </Text>
                        </Box>
                      </SimpleGrid>
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <Heading size="sm">Verification Documents</Heading>
                      {selectedRequestDetails.verification_docs ? (
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={4}>
                            Documents submitted for verification review
                          </Text>
                          {/* Display verification documents here */}
                          <Alert status="info">
                            <AlertIcon />
                            <Text>
                              Document display functionality would be
                              implemented here
                            </Text>
                          </Alert>
                        </Box>
                      ) : (
                        <Text color="gray.500">No documents submitted</Text>
                      )}
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <Heading size="sm">Verification History</Heading>
                      {verificationHistory?.length === 0 ? (
                        <Text color="gray.500">No history available</Text>
                      ) : (
                        verificationHistory?.map((event: any) => (
                          <HStack
                            key={event.id}
                            p={3}
                            bg="gray.50"
                            borderRadius="md"
                          >
                            <Box flex="1">
                              <Text fontWeight="medium">{event.title}</Text>
                              <Text fontSize="sm" color="gray.600">
                                {new Date(event.timestamp).toLocaleString()}
                              </Text>
                              {event.description && (
                                <Text fontSize="sm" mt={1}>
                                  {event.description}
                                </Text>
                              )}
                            </Box>
                            <Badge colorScheme="blue">{event.status}</Badge>
                          </HStack>
                        ))
                      )}
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDetailsClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Action Modal */}
      <Modal isOpen={isActionOpen} onClose={onActionClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {actionType === "approve"
              ? "Approve Verification"
              : actionType === "reject"
              ? "Reject Verification"
              : "Request Additional Information"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text>
                {actionType === "approve"
                  ? "Are you sure you want to approve this verification request?"
                  : actionType === "reject"
                  ? "Please provide a reason for rejecting this verification request."
                  : "Please specify what additional information is needed from the breeder."}
              </Text>

              {(actionType === "reject" || actionType === "request_info") && (
                <FormControl>
                  <FormLabel>
                    {actionType === "reject"
                      ? "Rejection Reason"
                      : "Information Requested"}
                  </FormLabel>
                  <Textarea
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder={
                      actionType === "reject"
                        ? "Please explain why this request is being rejected..."
                        : "Please specify what additional information is needed..."
                    }
                    rows={4}
                  />
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onActionClose}>
              Cancel
            </Button>
            <Button
              colorScheme={
                actionType === "approve"
                  ? "green"
                  : actionType === "reject"
                  ? "red"
                  : "blue"
              }
              onClick={() =>
                selectedRequest &&
                actionType &&
                handleVerificationAction(selectedRequest, actionType)
              }
              isLoading={verificationActions.isPending}
              isDisabled={
                (actionType === "reject" || actionType === "request_info") &&
                !actionNotes.trim()
              }
            >
              {actionType === "approve"
                ? "Approve"
                : actionType === "reject"
                ? "Reject"
                : "Request Information"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AdminVerificationPage;
