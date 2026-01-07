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
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
  FiAlertTriangle,
  FiTrendingUp,
  FiUsers,
  FiFlag,
  FiMessageSquare,
  FiCalendar,
  FiDollarSign,
} from "react-icons/fi";
import { useUserProfile } from "../../../hooks/queries";
import {
  useAdminAdoptions,
  useAdoptionStats,
  useAdminAdoptionDetails,
  useAdoptionInterventions,
  useDisputedAdoptions,
} from "../../../hooks/queries/useAdminAdoptions";
import { NextSeo } from "next-seo";
import { Loader } from "../../ui/Loader";

const AdminAdoptionsPage: React.FC = () => {
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: adoptionStats, isLoading: statsLoading } = useAdoptionStats();
  const { data: disputedAdoptions } = useDisputedAdoptions(5);
  const toast = useToast();

  // Filters and pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "submitted" | "approved" | "completed" | "cancelled" | "disputed" | ""
  >("");
  const [typeFilter, setTypeFilter] = useState<"litter" | "pet" | "">("");
  const [flaggedFilter, setFlaggedFilter] = useState<
    "flagged" | "unflagged" | ""
  >("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdoption, setSelectedAdoption] = useState<string | null>(null);
  const [actionType, setActionType] = useState<
    | "resolve_dispute"
    | "force_complete"
    | "flag"
    | "unflag"
    | "update_status"
    | "add_note"
    | null
  >(null);
  const [actionNotes, setActionNotes] = useState("");
  const [newStatus, setNewStatus] = useState<
    "submitted" | "approved" | "completed" | "cancelled" | "disputed"
  >("submitted");

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
      flagged:
        flaggedFilter === "flagged"
          ? true
          : flaggedFilter === "unflagged"
          ? false
          : undefined,
      search: searchTerm || undefined,
    }),
    [statusFilter, flaggedFilter, searchTerm]
  );

  const {
    data: adoptionsData,
    isLoading: adoptionsLoading,
    refetch: refetchAdoptions,
  } = useAdminAdoptions(filters, currentPage, 20);

  const { data: selectedAdoptionDetails, isLoading: detailsLoading } =
    useAdminAdoptionDetails(selectedAdoption || "");
  const adoptionInterventions = useAdoptionInterventions();

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

  const formatCurrency = (amount: number) => {
    return `Ksh. ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "green";
      case "approved":
        return "blue";
      case "submitted":
        return "yellow";
      case "cancelled":
        return "red";
      case "disputed":
        return "orange";
      default:
        return "gray";
    }
  };

  const handleAdoptionAction = async (
    adoptionId: string,
    action:
      | "resolve_dispute"
      | "force_complete"
      | "flag"
      | "unflag"
      | "update_status"
      | "add_note"
  ) => {
    try {
      const actionData =
        action === "flag"
          ? { reason: actionNotes }
          : action === "update_status"
          ? { status: newStatus }
          : action === "resolve_dispute"
          ? { resolution: "completed", notes: actionNotes }
          : { notes: actionNotes };

      await adoptionInterventions.mutateAsync({
        adoptionId,
        action,
        data: actionData,
      });

      toast({
        title: "Action completed",
        description: `Adoption ${action.replace("_", " ")} successfully.`,
        status:
          action === "force_complete" || action === "resolve_dispute"
            ? "success"
            : "info",
        duration: 3000,
      });

      refetchAdoptions();
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

  const openAdoptionDetails = (adoptionId: string) => {
    setSelectedAdoption(adoptionId);
    onDetailsOpen();
  };

  const openActionModal = (
    adoptionId: string,
    action:
      | "resolve_dispute"
      | "force_complete"
      | "flag"
      | "unflag"
      | "update_status"
      | "add_note"
  ) => {
    setSelectedAdoption(adoptionId);
    setActionType(action);
    onActionOpen();
  };

  const totalPages = Math.ceil((adoptionsData?.total || 0) / 20);

  return (
    <>
      <NextSeo title="Adoption Management - Admin Dashboard" />

      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="lg" mb={2}>
              Adoption Management
            </Heading>
            <Text color="gray.600">
              Oversee adoption processes, resolve disputes, and ensure smooth
              transactions between breeders and seekers.
            </Text>
          </Box>

          {/* Stats Overview */}
          {adoptionStats && (
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Total Adoptions</StatLabel>
                    <StatNumber>{adoptionStats.totalAdoptions}</StatNumber>
                    <StatHelpText>All time</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Completed</StatLabel>
                    <StatNumber>{adoptionStats.completedAdoptions}</StatNumber>
                    <StatHelpText>
                      <HStack>
                        <FiCheckCircle color="green" />
                        <Text>Successful adoptions</Text>
                      </HStack>
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Pending Review</StatLabel>
                    <StatNumber>{adoptionStats.pendingAdoptions}</StatNumber>
                    <StatHelpText>
                      <HStack>
                        <FiAlertTriangle color="orange" />
                        <Text>Awaiting action</Text>
                      </HStack>
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Disputed</StatLabel>
                    <StatNumber>{adoptionStats.disputedAdoptions}</StatNumber>
                    <StatHelpText>
                      <HStack>
                        <FiXCircle color="red" />
                        <Text>Need resolution</Text>
                      </HStack>
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>
          )}

          {/* Disputed Adoptions Alert */}
          {disputedAdoptions && disputedAdoptions.length > 0 && (
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">
                  {disputedAdoptions.length} disputed adoptions require
                  attention
                </Text>
                <Text fontSize="sm">
                  These adoptions have reported issues that need admin
                  intervention.
                </Text>
              </Box>
            </Alert>
          )}

          {/* Filters and Search */}
          <Card>
            <CardBody>
              <HStack spacing={4} wrap="wrap">
                <InputGroup maxW="300px">
                  <InputLeftElement>
                    <FiSearch />
                  </InputLeftElement>
                  <Input
                    placeholder="Search adoptions..."
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
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="disputed">Disputed</option>
                </Select>

                <Select
                  placeholder="All Types"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  maxW="150px"
                >
                  <option value="litter">Litters</option>
                  <option value="pet">Pets</option>
                </Select>

                <Select
                  placeholder="All Adoptions"
                  value={flaggedFilter}
                  onChange={(e) => setFlaggedFilter(e.target.value as any)}
                  maxW="150px"
                >
                  <option value="flagged">Flagged Only</option>
                  <option value="unflagged">Unflagged Only</option>
                </Select>

                <Button
                  leftIcon={<FiFilter />}
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setTypeFilter("");
                    setFlaggedFilter("");
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </HStack>
            </CardBody>
          </Card>

          {/* Adoptions Table */}
          <Card>
            <CardBody>
              {adoptionsLoading ? (
                <Box textAlign="center" py={8}>
                  <Spinner size="lg" />
                  <Text mt={4}>Loading adoptions...</Text>
                </Box>
              ) : adoptionsData?.adoptions.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <FiUsers size={48} color="gray" />
                  <Text fontSize="lg" color="gray.500" mt={4}>
                    No adoptions found
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
                        <Th>Seeker</Th>
                        <Th>Breeder</Th>
                        <Th>Listing</Th>
                        <Th>Status</Th>
                        <Th>Amount</Th>
                        <Th>Created</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {adoptionsData?.adoptions.map((adoption) => (
                        <Tr key={adoption.id}>
                          <Td>
                            <HStack>
                              <Avatar
                                size="sm"
                                src={
                                  adoption.seeker_user?.profile_photo_url ||
                                  undefined
                                }
                                name={
                                  adoption.seeker_user?.display_name ||
                                  adoption.seeker_user?.email
                                }
                              />
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="medium">
                                  {adoption.seeker_user?.display_name ||
                                    "No name"}
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                  {adoption.seeker_user?.email}
                                </Text>
                              </VStack>
                            </HStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="medium">
                                {adoption.breeder_user?.display_name ||
                                  "No name"}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                {adoption.breeder_user?.email}
                              </Text>
                            </VStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="medium" noOfLines={1}>
                                {adoption.listings?.title}
                              </Text>
                              <Badge colorScheme="blue" fontSize="xs">
                                {adoption.listings?.type}
                              </Badge>
                            </VStack>
                          </Td>
                          <Td>
                            <HStack>
                              <Badge
                                colorScheme={getStatusBadgeColor(
                                  adoption.status
                                )}
                              >
                                {adoption.status}
                              </Badge>
                              {adoption.flagged && (
                                <Badge colorScheme="red">Flagged</Badge>
                              )}
                            </HStack>
                          </Td>
                          <Td>
                            {adoption.listings?.price
                              ? formatCurrency(adoption.listings.price)
                              : "N/A"}
                          </Td>
                          <Td>
                            <Text fontSize="sm">
                              {formatDate(adoption.created_at)}
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
                                  onClick={() =>
                                    openAdoptionDetails(adoption.id)
                                  }
                                >
                                  View Details
                                </MenuItem>
                                {adoption.status === "disputed" && (
                                  <MenuItem
                                    icon={<FiCheckCircle />}
                                    onClick={() =>
                                      openActionModal(
                                        adoption.id,
                                        "resolve_dispute"
                                      )
                                    }
                                  >
                                    Resolve Dispute
                                  </MenuItem>
                                )}
                                {!adoption.flagged && (
                                  <MenuItem
                                    icon={<FiFlag />}
                                    onClick={() =>
                                      openActionModal(adoption.id, "flag")
                                    }
                                  >
                                    Flag Adoption
                                  </MenuItem>
                                )}
                                {adoption.flagged && (
                                  <MenuItem
                                    icon={<FiCheckCircle />}
                                    onClick={() =>
                                      handleAdoptionAction(
                                        adoption.id,
                                        "unflag"
                                      )
                                    }
                                  >
                                    Unflag Adoption
                                  </MenuItem>
                                )}
                                <MenuItem
                                  icon={<FiCheckCircle />}
                                  onClick={() =>
                                    openActionModal(
                                      adoption.id,
                                      "force_complete"
                                    )
                                  }
                                >
                                  Force Complete
                                </MenuItem>
                                <MenuItem
                                  icon={<FiMessageSquare />}
                                  onClick={() =>
                                    openActionModal(adoption.id, "add_note")
                                  }
                                >
                                  Add Admin Note
                                </MenuItem>
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

      {/* Adoption Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adoption Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {detailsLoading ? (
              <Box textAlign="center" py={8}>
                <Spinner />
                <Text mt={4}>Loading adoption details...</Text>
              </Box>
            ) : selectedAdoptionDetails ? (
              <VStack spacing={6} align="stretch">
                {/* Status and Progress */}
                <Box>
                  <HStack justify="space-between" mb={4}>
                    <Badge
                      colorScheme={getStatusBadgeColor(
                        selectedAdoptionDetails.status
                      )}
                      fontSize="md"
                    >
                      {selectedAdoptionDetails.status}
                    </Badge>
                    {selectedAdoptionDetails.flagged && (
                      <Badge colorScheme="red" fontSize="md">
                        Flagged
                      </Badge>
                    )}
                  </HStack>

                  {/* Progress based on status */}
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      Adoption Progress
                    </Text>
                    <Progress
                      value={
                        selectedAdoptionDetails.status === "completed"
                          ? 100
                          : selectedAdoptionDetails.status === "approved"
                          ? 75
                          : selectedAdoptionDetails.status === "submitted"
                          ? 25
                          : 0
                      }
                      colorScheme="green"
                      size="sm"
                    />
                  </Box>
                </Box>

                {/* Parties Involved */}
                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Seeker
                    </Text>
                    <HStack>
                      <Avatar
                        size="sm"
                        src={
                          selectedAdoptionDetails.seeker_user
                            ?.profile_photo_url || undefined
                        }
                        name={
                          selectedAdoptionDetails.seeker_user?.display_name ||
                          selectedAdoptionDetails.seeker_user?.email
                        }
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="medium">
                          {selectedAdoptionDetails.seeker_user?.display_name ||
                            "No name"}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {selectedAdoptionDetails.seeker_user?.email}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Breeder
                    </Text>
                    <HStack>
                      <Avatar
                        size="sm"
                        src={
                          selectedAdoptionDetails.breeder_user
                            ?.profile_photo_url || undefined
                        }
                        name={
                          selectedAdoptionDetails.breeder_user?.display_name ||
                          selectedAdoptionDetails.breeder_user?.email
                        }
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="medium">
                          {selectedAdoptionDetails.breeder_user?.display_name ||
                            "No name"}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {selectedAdoptionDetails.breeder_user?.email}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                </SimpleGrid>

                {/* Listing Details */}
                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Listing Information
                  </Text>
                  <VStack align="start" spacing={2}>
                    <Text>
                      <strong>Title:</strong>{" "}
                      {selectedAdoptionDetails.listings?.title}
                    </Text>
                    <Text>
                      <strong>Type:</strong>{" "}
                      {selectedAdoptionDetails.listings?.type}
                    </Text>
                    <Text>
                      <strong>Price:</strong>{" "}
                      {selectedAdoptionDetails.listings?.price
                        ? formatCurrency(selectedAdoptionDetails.listings.price)
                        : "N/A"}
                    </Text>
                    {selectedAdoptionDetails.listings?.breeds &&
                      selectedAdoptionDetails.listings.breeds.length > 0 && (
                        <Text>
                          <strong>Breed:</strong>{" "}
                          {selectedAdoptionDetails.listings.breeds[0].name}
                        </Text>
                      )}
                  </VStack>
                </Box>

                {/* Timeline */}
                <Box>
                  <Text fontWeight="bold" mb={3}>
                    Adoption Timeline
                  </Text>
                  <VStack align="start" spacing={3}>
                    <HStack>
                      <FiCalendar />
                      <Text fontSize="sm">
                        <strong>Created:</strong>{" "}
                        {formatDate(selectedAdoptionDetails.created_at)}
                      </Text>
                    </HStack>
                    {selectedAdoptionDetails.updated_at !==
                      selectedAdoptionDetails.created_at && (
                      <HStack>
                        <FiCalendar />
                        <Text fontSize="sm">
                          <strong>Last Updated:</strong>{" "}
                          {formatDate(selectedAdoptionDetails.updated_at)}
                        </Text>
                      </HStack>
                    )}
                  </VStack>
                </Box>

                {/* Admin Notes */}
                {selectedAdoptionDetails.admin_notes && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Admin Notes
                    </Text>
                    <Text
                      fontSize="sm"
                      p={3}
                      bg="gray.50"
                      borderRadius="md"
                      whiteSpace="pre-wrap"
                    >
                      {selectedAdoptionDetails.admin_notes}
                    </Text>
                  </Box>
                )}
              </VStack>
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
            {actionType === "resolve_dispute"
              ? "Resolve Dispute"
              : actionType === "force_complete"
              ? "Force Complete Adoption"
              : actionType === "flag"
              ? "Flag Adoption"
              : actionType === "unflag"
              ? "Unflag Adoption"
              : actionType === "update_status"
              ? "Update Status"
              : "Add Admin Note"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text>
                {actionType === "resolve_dispute"
                  ? "Resolve this adoption dispute with the specified outcome."
                  : actionType === "force_complete"
                  ? "Force complete this adoption process."
                  : actionType === "flag"
                  ? "Flag this adoption for special attention."
                  : actionType === "unflag"
                  ? "Remove the flag from this adoption."
                  : actionType === "update_status"
                  ? "Update the adoption status."
                  : "Add an administrative note to this adoption."}
              </Text>

              {(actionType === "flag" ||
                actionType === "add_note" ||
                actionType === "resolve_dispute") && (
                <FormControl>
                  <FormLabel>
                    {actionType === "flag"
                      ? "Reason for flagging"
                      : actionType === "resolve_dispute"
                      ? "Resolution notes"
                      : "Admin note"}
                  </FormLabel>
                  <Textarea
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder={
                      actionType === "flag"
                        ? "Please explain why this adoption is being flagged..."
                        : actionType === "resolve_dispute"
                        ? "Please describe how this dispute was resolved..."
                        : "Add your administrative note..."
                    }
                    rows={4}
                  />
                </FormControl>
              )}

              {actionType === "update_status" && (
                <FormControl>
                  <FormLabel>New Status</FormLabel>
                  <Select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                  >
                    <option value="submitted">Submitted</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="disputed">Disputed</option>
                  </Select>
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
                actionType === "resolve_dispute" ||
                actionType === "force_complete"
                  ? "green"
                  : actionType === "flag"
                  ? "red"
                  : actionType === "unflag"
                  ? "blue"
                  : "blue"
              }
              onClick={() =>
                selectedAdoption &&
                actionType &&
                handleAdoptionAction(selectedAdoption, actionType)
              }
              isLoading={adoptionInterventions.isPending}
              isDisabled={
                (actionType === "flag" ||
                  actionType === "add_note" ||
                  actionType === "resolve_dispute") &&
                !actionNotes.trim()
              }
            >
              {actionType === "resolve_dispute"
                ? "Resolve Dispute"
                : actionType === "force_complete"
                ? "Force Complete"
                : actionType === "flag"
                ? "Flag Adoption"
                : actionType === "unflag"
                ? "Unflag Adoption"
                : actionType === "update_status"
                ? "Update Status"
                : "Add Note"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AdminAdoptionsPage;
