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
  Textarea,
  Checkbox,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiPlus,
  FiEdit,
  FiEye,
  FiTrash2,
  FiStar,
  FiMessageSquare,
  FiTrendingUp,
} from "react-icons/fi";
import { useUserProfile } from "../../../hooks/queries";
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  useReviews,
  useBreederReviewStats,
  useMarkReviewHelpful,
} from "../../../hooks/queries/useReviews";
import { NextSeo } from "next-seo";
import { Loader } from "../../ui/Loader";
import { Rating } from "../../ui/Rating";

const AdminTestimonialsPage: React.FC = () => {
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const toast = useToast();

  // Filters and state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "">(
    ""
  );
  const [featuredFilter, setFeaturedFilter] = useState<
    "featured" | "not_featured" | ""
  >("");
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);

  // Modal states
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Build filters object
  const filters = useMemo(
    () => ({
      is_featured:
        featuredFilter === "featured"
          ? true
          : featuredFilter === "not_featured"
            ? false
            : undefined,
      is_active:
        statusFilter === "active"
          ? true
          : statusFilter === "inactive"
            ? false
            : undefined,
      search: searchTerm || undefined,
    }),
    [featuredFilter, statusFilter, searchTerm]
  );

  const {
    data: testimonialsData,
    isLoading: testimonialsLoading,
    refetch: refetchTestimonials,
  } = useTestimonials(filters);

  // Reviews data for moderation
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = useReviews();

  // Review analytics
  const [selectedBreeder, setSelectedBreeder] = useState<string | null>(null);
  const { data: breederStats, isLoading: statsLoading } = useBreederReviewStats(
    selectedBreeder || ""
  );

  const markHelpfulMutation = useMarkReviewHelpful();

  const createTestimonialMutation = useCreateTestimonial();
  const updateTestimonialMutation = useUpdateTestimonial();
  const deleteTestimonialMutation = useDeleteTestimonial();

  // Check if user is admin
  if (profileLoading) {
    return <Loader />;
  }

  if (!userProfile || userProfile.role !== "admin") {
    return (
      <Container maxW="7xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <Text>You don't have permission to access this page.</Text>
        </Alert>
      </Container>
    );
  }

  const handleCreateTestimonial = async (data: any) => {
    try {
      await createTestimonialMutation.mutateAsync(data);
      toast({
        title: "Testimonial created",
        description: "The testimonial has been created successfully.",
        status: "success",
        duration: 3000,
      });
      onCreateClose();
      refetchTestimonials();
    } catch (error) {
      toast({
        title: "Failed to create testimonial",
        description: "Please try again.",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleUpdateTestimonial = async (data: any) => {
    try {
      await updateTestimonialMutation.mutateAsync(data);
      toast({
        title: "Testimonial updated",
        description: "The testimonial has been updated successfully.",
        status: "success",
        duration: 3000,
      });
      onEditClose();
      refetchTestimonials();
    } catch (error) {
      toast({
        title: "Failed to update testimonial",
        description: "Please try again.",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      await deleteTestimonialMutation.mutateAsync(id);
      toast({
        title: "Testimonial deleted",
        description: "The testimonial has been deleted successfully.",
        status: "success",
        duration: 3000,
      });
      onDeleteClose();
      refetchTestimonials();
    } catch (error) {
      toast({
        title: "Failed to delete testimonial",
        description: "Please try again.",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <>
      <NextSeo
        title="Testimonials Management - Admin"
        description="Manage landing page testimonials and user feedback"
      />

      <Container maxW="7xl" py={8}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between" align="center">
            <Box>
              <Heading size="lg" mb={2}>
                Reviews & Testimonials Management
              </Heading>
              <Text color="gray.600">
                Manage testimonials and moderate user reviews
              </Text>
            </Box>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="brand"
              onClick={onCreateOpen}
            >
              Add Testimonial
            </Button>
          </HStack>

          <Tabs variant="soft-rounded" colorScheme="brand">
            <TabList>
              <Tab>Testimonials</Tab>
              <Tab>Reviews Moderation</Tab>
              <Tab>Analytics</Tab>
            </TabList>

            <TabPanels>
              {/* Testimonials Tab */}
              <TabPanel px={0}>
                {/* Stats Cards */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
                  <Card>
                    <CardBody>
                      <Stat>
                        <StatLabel>Total Testimonials</StatLabel>
                        <StatNumber>{testimonialsData?.length || 0}</StatNumber>
                        <StatHelpText>All testimonials</StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <Stat>
                        <StatLabel>Featured Testimonials</StatLabel>
                        <StatNumber>
                          {testimonialsData?.filter(t => t.is_featured).length || 0}
                        </StatNumber>
                        <StatHelpText>Shown on landing page</StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <Stat>
                        <StatLabel>Active Testimonials</StatLabel>
                        <StatNumber>
                          {testimonialsData?.filter(t => t.is_active).length || 0}
                        </StatNumber>
                        <StatHelpText>Currently visible</StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </SimpleGrid>

          {/* Filters */}
          <Card>
            <CardBody>
              <HStack spacing={4}>
                <InputGroup maxW="300px">
                  <InputLeftElement>
                    <FiSearch />
                  </InputLeftElement>
                  <Input
                    placeholder="Search testimonials..."
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
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>

                <Select
                  placeholder="All Featured"
                  value={featuredFilter}
                  onChange={(e) => setFeaturedFilter(e.target.value as any)}
                  maxW="150px"
                >
                  <option value="">All Featured</option>
                  <option value="featured">Featured</option>
                  <option value="not_featured">Not Featured</option>
                </Select>
              </HStack>
            </CardBody>
          </Card>

          {/* Testimonials Table */}
          <Card>
            <CardBody p={0}>
              {testimonialsLoading ? (
                <Box p={8} textAlign="center">
                  <Spinner size="lg" />
                  <Text mt={4}>Loading testimonials...</Text>
                </Box>
              ) : testimonialsData && testimonialsData.length > 0 ? (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Author</Th>
                      <Th>Content</Th>
                      <Th>Rating</Th>
                      <Th>Status</Th>
                      <Th>Featured</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {testimonialsData.map((testimonial) => (
                      <Tr key={testimonial.id}>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium">
                              {testimonial.author_name}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {testimonial.author_role}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>
                          <Text noOfLines={2} maxW="300px">
                            {testimonial.content}
                          </Text>
                        </Td>
                        <Td>
                          {testimonial.rating && (
                            <Rating
                              score={testimonial.rating}
                              readonly
                              size="sm"
                            />
                          )}
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={
                              testimonial.is_active ? "green" : "gray"
                            }
                          >
                            {testimonial.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </Td>
                        <Td>
                          {testimonial.is_featured && (
                            <Badge colorScheme="yellow">
                              <HStack spacing={1}>
                                <FiStar size={12} />
                                <Text>Featured</Text>
                              </HStack>
                            </Badge>
                          )}
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
                                onClick={() => {
                                  setSelectedTestimonial(testimonial);
                                  onViewOpen();
                                }}
                              >
                                View Details
                              </MenuItem>
                              <MenuItem
                                icon={<FiEdit />}
                                onClick={() => {
                                  setSelectedTestimonial(testimonial);
                                  onEditOpen();
                                }}
                              >
                                Edit
                              </MenuItem>
                              <MenuItem
                                icon={<FiTrash2 />}
                                color="red.500"
                                onClick={() => {
                                  setSelectedTestimonial(testimonial);
                                  onDeleteOpen();
                                }}
                              >
                                Delete
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <Box p={8} textAlign="center">
                  <FiMessageSquare size={48} color="gray" />
                  <Text mt={4} fontSize="lg" color="gray.600">
                    No testimonials found
                  </Text>
                  <Text color="gray.500">
                    {searchTerm || statusFilter || featuredFilter
                      ? "Try adjusting your filters"
                      : "Get started by adding your first testimonial"}
                  </Text>
                </Box>
              )}
                </CardBody>
              </Card>
              </TabPanel>

              {/* Reviews Moderation Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="stretch">
                  {/* Reviews Stats */}
                  <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                    <Card>
                      <CardBody>
                        <Stat>
                          <StatLabel>Total Reviews</StatLabel>
                          <StatNumber>{reviewsData?.length || 0}</StatNumber>
                          <StatHelpText>All reviews</StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody>
                        <Stat>
                          <StatLabel>Average Rating</StatLabel>
                          <StatNumber>
                            {reviewsData && reviewsData.length > 0
                              ? (reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length).toFixed(1)
                              : "0.0"}
                          </StatNumber>
                          <StatHelpText>Out of 5 stars</StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody>
                        <Stat>
                          <StatLabel>Flagged Reviews</StatLabel>
                          <StatNumber>
                            {reviewsData?.filter(r => r.flagged).length || 0}
                          </StatNumber>
                          <StatHelpText>Need moderation</StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody>
                        <Stat>
                          <StatLabel>Helpful Votes</StatLabel>
                          <StatNumber>
                            {reviewsData?.reduce((sum, r) => sum + (r.helpful_votes || 0), 0) || 0}
                          </StatNumber>
                          <StatHelpText>Total helpful votes</StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                  </SimpleGrid>

                  {/* Reviews Table */}
                  <Card>
                    <CardBody p={0}>
                      {reviewsLoading ? (
                        <Box p={8} textAlign="center">
                          <Spinner size="lg" />
                          <Text mt={4}>Loading reviews...</Text>
                        </Box>
                      ) : reviewsData && reviewsData.length > 0 ? (
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Review</Th>
                              <Th>Rating</Th>
                              <Th>Author</Th>
                              <Th>Breeder</Th>
                              <Th>Status</Th>
                              <Th>Actions</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {reviewsData.map((review) => (
                              <Tr key={review.id}>
                                <Td>
                                  <VStack align="start" spacing={1}>
                                    {review.title && (
                                      <Text fontWeight="medium" fontSize="sm">
                                        {review.title}
                                      </Text>
                                    )}
                                    <Text fontSize="sm" noOfLines={2}>
                                      {review.comment}
                                    </Text>
                                  </VStack>
                                </Td>
                                <Td>
                                  <Rating score={review.rating} readonly size="sm" />
                                </Td>
                                <Td>
                                  <Text fontSize="sm">
                                    {review.is_anonymous ? "Anonymous" : review.reviewer.display_name}
                                  </Text>
                                </Td>
                                <Td>
                                  <Text fontSize="sm">{review.breeder.display_name}</Text>
                                </Td>
                                <Td>
                                  <HStack>
                                    {review.flagged && (
                                      <Badge colorScheme="red" size="sm">
                                        Flagged
                                      </Badge>
                                    )}
                                    <Badge
                                      colorScheme={review.is_featured ? "yellow" : "gray"}
                                      size="sm"
                                    >
                                      {review.is_featured ? "Featured" : "Regular"}
                                    </Badge>
                                  </HStack>
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
                                        onClick={() => {
                                          setSelectedTestimonial(review);
                                          onViewOpen();
                                        }}
                                      >
                                        View Details
                                      </MenuItem>
                                      <MenuItem
                                        icon={<FiStar />}
                                        onClick={() => {
                                          markHelpfulMutation.mutate(review.id);
                                        }}
                                        isDisabled={markHelpfulMutation.isPending}
                                      >
                                        Mark as Helpful
                                      </MenuItem>
                                      <MenuItem
                                        color="red.500"
                                        onClick={() => {
                                          // Handle flagging review
                                          console.log("Flag review:", review.id);
                                        }}
                                      >
                                        Flag Review
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Box p={8} textAlign="center">
                          <FiMessageSquare size={48} color="gray" />
                          <Text mt={4} fontSize="lg" color="gray.600">
                            No reviews found
                          </Text>
                        </Box>
                      )}
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>

              {/* Analytics Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="stretch">
                  <Heading size="md">Review Analytics</Heading>

                  {/* Breeder Selection */}
                  <Card>
                    <CardBody>
                      <FormControl>
                        <FormLabel>Select Breeder for Detailed Analytics</FormLabel>
                        <Select
                          placeholder="Choose a breeder"
                          value={selectedBreeder || ""}
                          onChange={(e) => setSelectedBreeder(e.target.value || null)}
                        >
                          {reviewsData
                            ?.reduce((unique, review) => {
                              if (!unique.find(b => b.id === review.breeder.id)) {
                                unique.push(review.breeder);
                              }
                              return unique;
                            }, [] as any[])
                            .map((breeder) => (
                              <option key={breeder.id} value={breeder.id}>
                                {breeder.display_name}
                              </option>
                            ))}
                        </Select>
                      </FormControl>
                    </CardBody>
                  </Card>

                  {/* Breeder Stats */}
                  {selectedBreeder && breederStats && (
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      <Card>
                        <CardBody>
                          <Stat>
                            <StatLabel>Reviews Count</StatLabel>
                            <StatNumber>{breederStats.total_reviews}</StatNumber>
                            <StatHelpText>Total reviews received</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card>
                        <CardBody>
                          <Stat>
                            <StatLabel>Average Rating</StatLabel>
                            <StatNumber>{breederStats.average_rating}</StatNumber>
                            <StatHelpText>Out of 5 stars</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card>
                        <CardBody>
                          <Stat>
                            <StatLabel>Rating Distribution</StatLabel>
                            <StatNumber>
                              {breederStats.rating_distribution[5]} ★★★★★
                            </StatNumber>
                            <StatHelpText>5-star reviews</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                    </SimpleGrid>
                  )}

                  {/* Overall Platform Stats */}
                  <Card>
                    <CardBody>
                      <Heading size="sm" mb={4}>Platform Overview</Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <VStack align="start" spacing={3}>
                          <Text fontWeight="bold">Rating Distribution</Text>
                          {reviewsData && (
                            <>
                              {[5, 4, 3, 2, 1].map((stars) => {
                                const count = reviewsData.filter(r => r.rating === stars).length;
                                const percentage = reviewsData.length > 0 ? (count / reviewsData.length) * 100 : 0;
                                return (
                                  <HStack key={stars} w="full" justify="space-between">
                                    <Text fontSize="sm">{stars} stars</Text>
                                    <HStack spacing={2} flex={1} ml={4}>
                                      <Box
                                        h={2}
                                        bg="gray.200"
                                        flex={1}
                                        borderRadius="full"
                                      >
                                        <Box
                                          h="full"
                                          w={`${percentage}%`}
                                          bg="yellow.400"
                                          borderRadius="full"
                                        />
                                      </Box>
                                      <Text fontSize="sm" minW="40px" textAlign="right">
                                        {count}
                                      </Text>
                                    </HStack>
                                  </HStack>
                                );
                              })}
                            </>
                          )}
                        </VStack>

                        <VStack align="start" spacing={3}>
                          <Text fontWeight="bold">Review Insights</Text>
                          <Text fontSize="sm">
                            Total Reviews: {reviewsData?.length || 0}
                          </Text>
                          <Text fontSize="sm">
                            Flagged Reviews: {reviewsData?.filter(r => r.flagged).length || 0}
                          </Text>
                          <Text fontSize="sm">
                            Featured Reviews: {reviewsData?.filter(r => r.is_featured).length || 0}
                          </Text>
                          <Text fontSize="sm">
                            Average Rating: {
                              reviewsData && reviewsData.length > 0
                                ? (reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length).toFixed(1)
                                : "0.0"
                            }
                          </Text>
                        </VStack>
                      </SimpleGrid>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>

      {/* Create Testimonial Modal */}
      <TestimonialModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onSubmit={handleCreateTestimonial}
        title="Create Testimonial"
      />

      {/* Edit Testimonial Modal */}
      <TestimonialModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        onSubmit={handleUpdateTestimonial}
        testimonial={selectedTestimonial}
        title="Edit Testimonial"
      />

      {/* View Testimonial Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Testimonial Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTestimonial && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Author
                  </Text>
                  <Text>{selectedTestimonial.author_name}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {selectedTestimonial.author_role}
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Content
                  </Text>
                  <Text>{selectedTestimonial.content}</Text>
                </Box>

                {selectedTestimonial.rating && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Rating
                    </Text>
                    <Rating score={selectedTestimonial.rating} readonly />
                  </Box>
                )}

                <HStack spacing={4}>
                  <Badge
                    colorScheme={
                      selectedTestimonial.is_active ? "green" : "gray"
                    }
                  >
                    {selectedTestimonial.is_active ? "Active" : "Inactive"}
                  </Badge>
                  {selectedTestimonial.is_featured && (
                    <Badge colorScheme="yellow">Featured</Badge>
                  )}
                </HStack>

                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Created
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {new Date(selectedTestimonial.created_at).toLocaleString()}
                  </Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Testimonial</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete this testimonial? This action
              cannot be undone.
            </Text>
            {selectedTestimonial && (
              <Box mt={4} p={3} bg="gray.50" borderRadius="md">
                <Text fontWeight="medium">
                  {selectedTestimonial.author_name}
                </Text>
                <Text fontSize="sm" noOfLines={2}>
                  {selectedTestimonial.content}
                </Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => handleDeleteTestimonial(selectedTestimonial?.id)}
              isLoading={deleteTestimonialMutation.isPending}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

// Testimonial Modal Component
interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  testimonial?: any;
  title: string;
}

const TestimonialModal: React.FC<TestimonialModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  testimonial,
  title,
}) => {
  const [formData, setFormData] = useState({
    author_name: "",
    author_role: "",
    author_location: "",
    content: "",
    rating: 0,
    is_featured: false,
    sort_order: 0,
    is_active: true,
  });

  React.useEffect(() => {
    if (testimonial) {
      setFormData({
        author_name: testimonial.author_name || "",
        author_role: testimonial.author_role || "",
        author_location: testimonial.author_location || "",
        content: testimonial.content || "",
        rating: testimonial.rating || 0,
        is_featured: testimonial.is_featured || false,
        sort_order: testimonial.sort_order || 0,
        is_active: testimonial.is_active !== false,
      });
    } else {
      setFormData({
        author_name: "",
        author_role: "",
        author_location: "",
        content: "",
        rating: 0,
        is_featured: false,
        sort_order: 0,
        is_active: true,
      });
    }
  }, [testimonial, isOpen]);

  const handleSubmit = () => {
    const data = testimonial ? { id: testimonial.id, ...formData } : formData;
    onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Author Name</FormLabel>
              <Input
                value={formData.author_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    author_name: e.target.value,
                  }))
                }
                placeholder="John Doe"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Author Role</FormLabel>
              <Select
                value={formData.author_role}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    author_role: e.target.value,
                  }))
                }
              >
                <option value="">Select role</option>
                <option value="seeker">Pet Seeker</option>
                <option value="breeder">Breeder</option>
                <option value="verified_breeder">Verified Breeder</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Author Location</FormLabel>
              <Input
                value={formData.author_location}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    author_location: e.target.value,
                  }))
                }
                placeholder="Nairobi, Kenya"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Content</FormLabel>
              <Textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Share your testimonial..."
                rows={4}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Rating (Optional)</FormLabel>
              <Rating
                score={formData.rating}
                interactive
                onChange={(rating) =>
                  setFormData((prev) => ({ ...prev, rating }))
                }
                size="md"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Sort Order</FormLabel>
              <NumberInput
                value={formData.sort_order}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    sort_order: parseInt(value) || 0,
                  }))
                }
                min={0}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <HStack spacing={4}>
              <Checkbox
                isChecked={formData.is_featured}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_featured: e.target.checked,
                  }))
                }
              >
                Featured on landing page
              </Checkbox>

              <Checkbox
                isChecked={formData.is_active}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: e.target.checked,
                  }))
                }
              >
                Active
              </Checkbox>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleSubmit}
            isDisabled={
              !formData.author_name.trim() || !formData.content.trim()
            }
          >
            {testimonial ? "Update" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdminTestimonialsPage;
