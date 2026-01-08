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
  Image,
  Grid,
  useColorModeValue,
  Textarea,
  FormControl,
  FormLabel,
  Checkbox,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiEye,
  FiFlag,
  FiCheckCircle,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
  FiAlertTriangle,
  FiTrendingUp,
  FiList,
  FiImage,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
} from "react-icons/fi";
import { useUserProfile } from "../../../hooks/queries";
import {
  useAdminListings,
  useListingStats,
  useAdminListingDetails,
  useListingModeration,
  useFlaggedListings,
} from "../../../hooks/queries/useAdminListings";
import { NextSeo } from "next-seo";
import { Loader } from "../../ui/Loader";

const AdminListingsPage: React.FC = () => {
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: listingStats, isLoading: statsLoading } = useListingStats();
  const { data: flaggedListings } = useFlaggedListings(5);
  const toast = useToast();

  // Filters and pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "available" | "pending" | "sold" | "withdrawn" | ""
  >("");
  const [typeFilter, setTypeFilter] = useState<"litter" | "pet" | "">("");
  const [flaggedFilter, setFlaggedFilter] = useState<
    "flagged" | "unflagged" | ""
  >("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [actionType, setActionType] = useState<
    "flag" | "unflag" | "approve" | "reject" | "update_status" | null
  >(null);
  const [actionNotes, setActionNotes] = useState("");
  const [newStatus, setNewStatus] = useState<
    "available" | "pending" | "sold" | "withdrawn"
  >("available");

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
      type: typeFilter || undefined,
      flagged:
        flaggedFilter === "flagged"
          ? true
          : flaggedFilter === "unflagged"
          ? false
          : undefined,
      search: searchTerm || undefined,
    }),
    [statusFilter, typeFilter, flaggedFilter, searchTerm]
  );

  const {
    data: listingsData,
    isLoading: listingsLoading,
    refetch: refetchListings,
  } = useAdminListings(filters, currentPage, 20);

  const { data: selectedListingDetails, isLoading: detailsLoading } =
    useAdminListingDetails(selectedListing || "");
  const listingModeration = useListingModeration();

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
      case "available":
        return "green";
      case "pending":
        return "yellow";
      case "sold":
        return "blue";
      case "withdrawn":
        return "red";
      default:
        return "gray";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    return type === "litter" ? "purple" : "orange";
  };

  const handleListingAction = async (
    listingId: string,
    action: "flag" | "unflag" | "approve" | "reject" | "update_status"
  ) => {
    try {
      const actionData =
        action === "flag"
          ? { reason: actionNotes }
          : action === "update_status"
          ? { status: newStatus }
          : undefined;

      await listingModeration.mutateAsync({
        listingId,
        action,
        data: actionData,
      });

      toast({
        title: "Action completed",
        description: `Listing ${action.replace("_", " ")} successfully.`,
        status:
          action === "approve"
            ? "success"
            : action === "reject"
            ? "warning"
            : "info",
        duration: 3000,
      });

      refetchListings();
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

  const openListingDetails = (listingId: string) => {
    setSelectedListing(listingId);
    onDetailsOpen();
  };

  const openActionModal = (
    listingId: string,
    action: "flag" | "unflag" | "approve" | "reject" | "update_status"
  ) => {
    setSelectedListing(listingId);
    setActionType(action);
    onActionOpen();
  };

  const totalPages = Math.ceil((listingsData?.total || 0) / 20);

  return (
    <>
      <NextSeo title="Listings Management - Admin Dashboard" />

      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="lg" mb={2}>
              Listings Management
            </Heading>
            <Text color="gray.600">
              Oversee all listings on the platform. Monitor litter and pet
              listings, ensure quality, and manage platform content.
            </Text>
          </Box>

          {/* Stats Overview */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Listings</StatLabel>
                  <StatNumber>{listingStats?.totalListings || 0}</StatNumber>
                  <StatHelpText>All time</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Active Listings</StatLabel>
                  <StatNumber>{listingStats?.activeListings || 0}</StatNumber>
                  <StatHelpText>
                    <HStack>
                      <FiTrendingUp color="green" />
                      <Text>Available now</Text>
                    </HStack>
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Flagged Listings</StatLabel>
                  <StatNumber>{listingStats?.flaggedListings || 0}</StatNumber>
                  <StatHelpText>
                    <HStack>
                      <FiAlertTriangle color="red" />
                      <Text>Need attention</Text>
                    </HStack>
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Average Price</StatLabel>
                  <StatNumber>
                    {listingStats?.averagePrice
                      ? formatCurrency(Math.round(listingStats.averagePrice))
                      : "Ksh. 0"}
                  </StatNumber>
                  <StatHelpText>Per listing</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Flagged Listings Alert */}
          {flaggedListings && flaggedListings.length > 0 && (
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">
                  {flaggedListings.length} listings flagged for review
                </Text>
                <Text fontSize="sm">
                  These listings require immediate attention from moderators.
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
                    placeholder="Search listings..."
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
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                  <option value="withdrawn">Withdrawn</option>
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
                  placeholder="All Listings"
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

          {/* Listings Table */}
          <Card>
            <CardBody>
              {listingsLoading ? (
                <Box textAlign="center" py={8}>
                  <Spinner size="lg" />
                  <Text mt={4}>Loading listings...</Text>
                </Box>
              ) : listingsData?.listings.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <FiList size={48} color="gray" />
                  <Text fontSize="lg" color="gray.500" mt={4}>
                    No listings found
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
                        <Th>Listing</Th>
                        <Th>Type</Th>
                        <Th>Status</Th>
                        <Th>Price</Th>
                        <Th>Owner</Th>
                        <Th>Created</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {listingsData?.listings.map((listing) => (
                        <Tr key={listing.id}>
                          <Td>
                            <HStack>
                              {listing.photos && listing.photos.length > 0 ? (
                                <Image
                                  src={listing.photos[0]}
                                  alt={listing.title}
                                  boxSize="40px"
                                  objectFit="cover"
                                  borderRadius="md"
                                />
                              ) : (
                                <Box
                                  boxSize="40px"
                                  bg="gray.200"
                                  borderRadius="md"
                                />
                              )}
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="medium" noOfLines={1}>
                                  {listing.title}
                                </Text>
                                {listing.breeds &&
                                  listing.breeds.length > 0 && (
                                    <Text fontSize="sm" color="gray.600">
                                      {listing.breeds[0].name}
                                    </Text>
                                  )}
                              </VStack>
                            </HStack>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={getTypeBadgeColor(listing.type)}
                            >
                              {listing.type}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack>
                              <Badge
                                colorScheme={getStatusBadgeColor(
                                  listing.status
                                )}
                              >
                                {listing.status}
                              </Badge>
                              {listing.flagged && (
                                <Badge colorScheme="red">Flagged</Badge>
                              )}
                            </HStack>
                          </Td>
                          <Td>
                            {listing.price
                              ? formatCurrency(listing.price)
                              : "N/A"}
                          </Td>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm" fontWeight="medium">
                                {listing.users?.[0]?.display_name || "Unknown"}
                              </Text>
                              <Text fontSize="xs" color="gray.600">
                                {listing.users?.[0]?.email}
                              </Text>
                            </VStack>
                          </Td>
                          <Td>
                            <Text fontSize="sm">
                              {formatDate(listing.created_at)}
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
                                  onClick={() => openListingDetails(listing.id)}
                                >
                                  View Details
                                </MenuItem>
                                {!listing.flagged && (
                                  <MenuItem
                                    icon={<FiFlag />}
                                    onClick={() =>
                                      openActionModal(listing.id, "flag")
                                    }
                                  >
                                    Flag Listing
                                  </MenuItem>
                                )}
                                {listing.flagged && (
                                  <MenuItem
                                    icon={<FiCheckCircle />}
                                    onClick={() =>
                                      handleListingAction(listing.id, "unflag")
                                    }
                                  >
                                    Unflag Listing
                                  </MenuItem>
                                )}
                                <MenuItem
                                  icon={<FiCheckCircle />}
                                  onClick={() =>
                                    openActionModal(listing.id, "approve")
                                  }
                                >
                                  Approve
                                </MenuItem>
                                <MenuItem
                                  icon={<FiXCircle />}
                                  onClick={() =>
                                    openActionModal(listing.id, "reject")
                                  }
                                >
                                  Reject
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

      {/* Listing Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Listing Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {detailsLoading ? (
              <Box textAlign="center" py={8}>
                <Spinner />
                <Text mt={4}>Loading listing details...</Text>
              </Box>
            ) : selectedListingDetails ? (
              <VStack spacing={6} align="stretch">
                {/* Photos */}
                {selectedListingDetails.photos &&
                selectedListingDetails.photos.length > 0 ? (
                  <Grid
                    templateColumns="repeat(auto-fill, minmax(150px, 1fr))"
                    gap={4}
                  >
                    {selectedListingDetails.photos.map((photo, index) => (
                      <Image
                        key={index}
                        src={photo}
                        alt={`${selectedListingDetails.title} - Photo ${
                          index + 1
                        }`}
                        borderRadius="md"
                        objectFit="cover"
                        h="150px"
                        w="full"
                      />
                    ))}
                  </Grid>
                ) : (
                  <Box textAlign="center" py={8} bg="gray.50" borderRadius="md">
                    <FiImage size={48} color="gray" />
                    <Text mt={2} color="gray.500">
                      No photos available
                    </Text>
                  </Box>
                )}

                {/* Basic Info */}
                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text fontWeight="bold">Title</Text>
                    <Text>{selectedListingDetails.title}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Type</Text>
                    <Badge
                      colorScheme={getTypeBadgeColor(
                        selectedListingDetails.type
                      )}
                    >
                      {selectedListingDetails.type}
                    </Badge>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Status</Text>
                    <HStack>
                      <Badge
                        colorScheme={getStatusBadgeColor(
                          selectedListingDetails.status
                        )}
                      >
                        {selectedListingDetails.status}
                      </Badge>
                      {selectedListingDetails.flagged && (
                        <Badge colorScheme="red">Flagged</Badge>
                      )}
                    </HStack>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Price</Text>
                    <Text>
                      {selectedListingDetails.price
                        ? formatCurrency(selectedListingDetails.price)
                        : "N/A"}
                    </Text>
                  </Box>
                  {selectedListingDetails.breeds &&
                    selectedListingDetails.breeds.length > 0 && (
                      <Box>
                        <Text fontWeight="bold">Breed</Text>
                        <Text>{selectedListingDetails.breeds[0].name}</Text>
                      </Box>
                    )}
                  <Box>
                    <Text fontWeight="bold">Location</Text>
                    <HStack>
                      <FiMapPin />
                      <Text>
                        {selectedListingDetails.location_text ||
                          "Not specified"}
                      </Text>
                    </HStack>
                  </Box>
                </SimpleGrid>

                {/* Description */}
                {selectedListingDetails.description && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Description
                    </Text>
                    <Text>{selectedListingDetails.description}</Text>
                  </Box>
                )}

                {/* Owner Info */}
                {selectedListingDetails.users &&
                  selectedListingDetails.users.length > 0 && (
                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        Owner Information
                      </Text>
                      <HStack>
                        <Avatar
                          size="sm"
                          src={
                            selectedListingDetails.users[0].profile_photo_url ||
                            undefined
                          }
                          name={
                            selectedListingDetails.users[0].display_name ||
                            selectedListingDetails.users[0].email
                          }
                        />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">
                            {selectedListingDetails.users[0].display_name ||
                              "No name"}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {selectedListingDetails.users[0].email}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  )}

                {/* Flagged Info */}
                {selectedListingDetails.flagged &&
                  selectedListingDetails.flagged_reason && (
                    <Alert status="warning">
                      <AlertIcon />
                      <Box>
                        <Text fontWeight="bold">Flagged Reason</Text>
                        <Text>{selectedListingDetails.flagged_reason}</Text>
                        {selectedListingDetails.flagged_at && (
                          <Text fontSize="sm" mt={1}>
                            Flagged on{" "}
                            {formatDate(selectedListingDetails.flagged_at)}
                          </Text>
                        )}
                      </Box>
                    </Alert>
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
            {actionType === "flag"
              ? "Flag Listing"
              : actionType === "unflag"
              ? "Unflag Listing"
              : actionType === "approve"
              ? "Approve Listing"
              : actionType === "reject"
              ? "Reject Listing"
              : "Update Listing Status"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text>
                {actionType === "flag"
                  ? "Please provide a reason for flagging this listing."
                  : actionType === "unflag"
                  ? "Are you sure you want to unflag this listing?"
                  : actionType === "approve"
                  ? "Are you sure you want to approve this listing?"
                  : actionType === "reject"
                  ? "Are you sure you want to reject this listing?"
                  : "Update the listing status."}
              </Text>

              {actionType === "flag" && (
                <FormControl>
                  <FormLabel>Reason for flagging</FormLabel>
                  <Textarea
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="Please explain why this listing is being flagged..."
                    rows={3}
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
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                    <option value="withdrawn">Withdrawn</option>
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
                actionType === "approve"
                  ? "green"
                  : actionType === "reject" || actionType === "flag"
                  ? "red"
                  : actionType === "unflag"
                  ? "blue"
                  : "blue"
              }
              onClick={() =>
                selectedListing &&
                actionType &&
                handleListingAction(selectedListing, actionType)
              }
              isLoading={listingModeration.isPending}
              isDisabled={actionType === "flag" && !actionNotes.trim()}
            >
              {actionType === "flag"
                ? "Flag Listing"
                : actionType === "unflag"
                ? "Unflag Listing"
                : actionType === "approve"
                ? "Approve"
                : actionType === "reject"
                ? "Reject"
                : "Update Status"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AdminListingsPage;
