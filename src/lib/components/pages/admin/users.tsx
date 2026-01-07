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
} from "@chakra-ui/react";
import {
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiUser,
  FiShield,
  FiUserCheck,
  FiUserX,
  FiEdit,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";
import { useUserProfile } from "../../../hooks/queries";
import {
  useAdminUsers,
  useUserStats,
  useAdminUserDetails,
  useAdminUserActions,
  useUserActivityLogs,
} from "../../../hooks/queries/useAdminUsers";
import { NextSeo } from "next-seo";
import { Loader } from "../../ui/Loader";

const AdminUsersPage: React.FC = () => {
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: userStats, isLoading: statsLoading } = useUserStats();
  const toast = useToast();

  // Filters and pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "seeker" | "breeder" | "admin" | ""
  >("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "">(
    ""
  );
  const [verificationFilter, setVerificationFilter] = useState<
    "verified" | "unverified" | ""
  >("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

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
      role: roleFilter || undefined,
      is_active:
        statusFilter === "active"
          ? true
          : statusFilter === "inactive"
          ? false
          : undefined,
      verified:
        verificationFilter === "verified"
          ? true
          : verificationFilter === "unverified"
          ? false
          : undefined,
      search: searchTerm || undefined,
    }),
    [roleFilter, statusFilter, verificationFilter, searchTerm]
  );

  const {
    data: usersData,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useAdminUsers(filters, currentPage, 20);

  const { data: selectedUserDetails, isLoading: detailsLoading } =
    useAdminUserDetails(selectedUser || "");
  const { data: userActivity } = useUserActivityLogs(selectedUser || "", 5);
  const adminUserActions = useAdminUserActions();

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
    return `$${amount.toLocaleString()}`;
  };

  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case "admin":
        return "red";
      case "breeder":
        return "blue";
      case "seeker":
        return "green";
      default:
        return "gray";
    }
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? "green" : "red";
  };

  const handleUserAction = async (
    userId: string,
    action: string,
    data?: any
  ) => {
    try {
      await adminUserActions.mutateAsync({
        userId,
        action: action as any,
        data,
      });

      toast({
        title: "Action completed",
        description: `User ${action.replace("_", " ")} successfully updated.`,
        status: "success",
        duration: 3000,
      });

      refetchUsers();
      onActionClose();
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

  const openUserDetails = (userId: string) => {
    setSelectedUser(userId);
    onDetailsOpen();
  };

  const totalPages = Math.ceil((usersData?.total || 0) / 20);

  return (
    <>
      <NextSeo title="User Management - Admin Dashboard" />

      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="lg" mb={2}>
              User Management
            </Heading>
            <Text color="gray.600">
              Monitor and manage all platform users, their roles, and account
              status.
            </Text>
          </Box>

          {/* Stats Overview */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Users</StatLabel>
                  <StatNumber>{userStats?.totalUsers || 0}</StatNumber>
                  <StatHelpText>
                    <HStack>
                      <FiTrendingUp color="green" />
                      <Text>
                        +{userStats?.newUsersThisMonth || 0} this month
                      </Text>
                    </HStack>
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Active Users</StatLabel>
                  <StatNumber>{userStats?.activeUsers || 0}</StatNumber>
                  <StatHelpText>Signed in last 30 days</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Breeders</StatLabel>
                  <StatNumber>{userStats?.breedersCount || 0}</StatNumber>
                  <StatHelpText>
                    {userStats?.verifiedBreedersCount || 0} verified
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Seekers</StatLabel>
                  <StatNumber>{userStats?.seekersCount || 0}</StatNumber>
                  <StatHelpText>Pet adopters</StatHelpText>
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
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>

                <Select
                  placeholder="All Roles"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  maxW="150px"
                >
                  <option value="seeker">Seekers</option>
                  <option value="breeder">Breeders</option>
                  <option value="admin">Admins</option>
                </Select>

                <Select
                  placeholder="All Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  maxW="150px"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>

                <Select
                  placeholder="Verification"
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value as any)}
                  maxW="150px"
                >
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </Select>

                <Button
                  leftIcon={<FiFilter />}
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setRoleFilter("");
                    setStatusFilter("");
                    setVerificationFilter("");
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </HStack>
            </CardBody>
          </Card>

          {/* Users Table */}
          <Card>
            <CardBody>
              {usersLoading ? (
                <Box textAlign="center" py={8}>
                  <Spinner size="lg" />
                  <Text mt={4}>Loading users...</Text>
                </Box>
              ) : usersData?.users.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <FiUsers size={48} color="gray" />
                  <Text fontSize="lg" color="gray.500" mt={4}>
                    No users found
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
                        <Th>User</Th>
                        <Th>Role</Th>
                        <Th>Status</Th>
                        <Th>Verification</Th>
                        <Th>Last Active</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {usersData?.users.map((user) => (
                        <Tr key={user.id}>
                          <Td>
                            <HStack>
                              <Avatar
                                size="sm"
                                src={user.profile_photo_url || undefined}
                                name={user.display_name || user.email}
                              />
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="medium">
                                  {user.display_name || "No name"}
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                  {user.email}
                                </Text>
                              </VStack>
                            </HStack>
                          </Td>
                          <Td>
                            <Badge colorScheme={getRoleBadgeColor(user.role)}>
                              {user.role || "No role"}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={getStatusBadgeColor(user.is_active)}
                            >
                              {user.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </Td>
                          <Td>
                            {user.role === "breeder" ? (
                              user.breeder_profiles?.[0]?.verified ? (
                                <Badge colorScheme="green">Verified</Badge>
                              ) : (
                                <Badge colorScheme="yellow">Unverified</Badge>
                              )
                            ) : (
                              <Text color="gray.400">-</Text>
                            )}
                          </Td>
                          <Td>
                            {user.last_sign_in_at ? (
                              <Text fontSize="sm">
                                {new Date(
                                  user.last_sign_in_at
                                ).toLocaleDateString()}
                              </Text>
                            ) : (
                              <Text color="gray.400">Never</Text>
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
                                  onClick={() => openUserDetails(user.id)}
                                >
                                  View Details
                                </MenuItem>
                                <MenuItem
                                  icon={<FiEdit />}
                                  onClick={() => {
                                    setSelectedUser(user.id);
                                    onActionOpen();
                                  }}
                                >
                                  Edit User
                                </MenuItem>
                                <MenuItem
                                  icon={
                                    user.is_active ? (
                                      <FiUserX />
                                    ) : (
                                      <FiUserCheck />
                                    )
                                  }
                                  onClick={() =>
                                    handleUserAction(user.id, "toggle_status", {
                                      is_active: !user.is_active,
                                    })
                                  }
                                >
                                  {user.is_active ? "Deactivate" : "Activate"}
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

      {/* User Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {detailsLoading ? (
              <Box textAlign="center" py={8}>
                <Spinner />
                <Text mt={4}>Loading user details...</Text>
              </Box>
            ) : selectedUserDetails ? (
              <Tabs>
                <TabList>
                  <Tab>Profile</Tab>
                  <Tab>Activity</Tab>
                  <Tab>Verification</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <HStack>
                        <Avatar
                          size="lg"
                          src={
                            selectedUserDetails.profile_photo_url || undefined
                          }
                          name={
                            selectedUserDetails.display_name ||
                            selectedUserDetails.email
                          }
                        />
                        <VStack align="start">
                          <Heading size="md">
                            {selectedUserDetails.display_name || "No name"}
                          </Heading>
                          <Text color="gray.600">
                            {selectedUserDetails.email}
                          </Text>
                          <HStack>
                            <Badge
                              colorScheme={getRoleBadgeColor(
                                selectedUserDetails.role
                              )}
                            >
                              {selectedUserDetails.role || "No role"}
                            </Badge>
                            <Badge
                              colorScheme={getStatusBadgeColor(
                                selectedUserDetails.is_active
                              )}
                            >
                              {selectedUserDetails.is_active
                                ? "Active"
                                : "Inactive"}
                            </Badge>
                          </HStack>
                        </VStack>
                      </HStack>

                      <SimpleGrid columns={2} spacing={4}>
                        <Box>
                          <Text fontWeight="bold">Phone</Text>
                          <Text>
                            {selectedUserDetails.phone || "Not provided"}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">Location</Text>
                          <Text>
                            {selectedUserDetails.location_text ||
                              "Not provided"}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">Joined</Text>
                          <Text>
                            {new Date(
                              selectedUserDetails.created_at
                            ).toLocaleDateString()}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">Last Sign In</Text>
                          <Text>
                            {selectedUserDetails.last_sign_in_at
                              ? new Date(
                                  selectedUserDetails.last_sign_in_at
                                ).toLocaleDateString()
                              : "Never"}
                          </Text>
                        </Box>
                      </SimpleGrid>
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <Heading size="sm">Recent Activity</Heading>
                      {userActivity?.length === 0 ? (
                        <Text color="gray.500">No recent activity</Text>
                      ) : (
                        userActivity?.map((activity: any) => (
                          <HStack
                            key={activity.id}
                            p={3}
                            bg="gray.50"
                            borderRadius="md"
                          >
                            <Box>
                              <Text fontWeight="medium">
                                {activity.description}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                {new Date(activity.timestamp).toLocaleString()}
                              </Text>
                            </Box>
                            <Badge colorScheme="blue">{activity.status}</Badge>
                          </HStack>
                        ))
                      )}
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      {selectedUserDetails.role === "breeder" &&
                      selectedUserDetails.breeder_profiles?.[0] ? (
                        <VStack align="stretch" spacing={4}>
                          <Box>
                            <Text fontWeight="bold">Business Name</Text>
                            <Text>
                              {selectedUserDetails.breeder_profiles[0]
                                .business_name || "Not provided"}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontWeight="bold">License Number</Text>
                            <Text>
                              {selectedUserDetails.breeder_profiles[0]
                                .license_number || "Not provided"}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontWeight="bold">Verification Status</Text>
                            <HStack>
                              {selectedUserDetails.breeder_profiles[0]
                                .verified ? (
                                <Badge colorScheme="green">Verified</Badge>
                              ) : (
                                <Badge colorScheme="yellow">
                                  Pending Verification
                                </Badge>
                              )}
                              {selectedUserDetails.breeder_profiles[0]
                                .verified_at && (
                                <Text fontSize="sm" color="gray.600">
                                  on{" "}
                                  {new Date(
                                    selectedUserDetails.breeder_profiles[0].verified_at
                                  ).toLocaleDateString()}
                                </Text>
                              )}
                            </HStack>
                          </Box>
                        </VStack>
                      ) : selectedUserDetails.role === "seeker" &&
                        selectedUserDetails.seeker_profiles?.[0] ? (
                        <VStack align="stretch" spacing={4}>
                          <Box>
                            <Text fontWeight="bold">Experience Level</Text>
                            <Text>
                              {selectedUserDetails.seeker_profiles[0]
                                .experience_level || "Not specified"}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontWeight="bold">Living Situation</Text>
                            <Text>
                              {selectedUserDetails.seeker_profiles[0]
                                .living_situation || "Not specified"}
                            </Text>
                          </Box>
                          <HStack>
                            <Text fontWeight="bold">Has Children:</Text>
                            <Badge
                              colorScheme={
                                selectedUserDetails.seeker_profiles[0]
                                  .has_children
                                  ? "green"
                                  : "red"
                              }
                            >
                              {selectedUserDetails.seeker_profiles[0]
                                .has_children
                                ? "Yes"
                                : "No"}
                            </Badge>
                          </HStack>
                          <HStack>
                            <Text fontWeight="bold">Has Allergies:</Text>
                            <Badge
                              colorScheme={
                                selectedUserDetails.seeker_profiles[0]
                                  .has_allergies
                                  ? "red"
                                  : "green"
                              }
                            >
                              {selectedUserDetails.seeker_profiles[0]
                                .has_allergies
                                ? "Yes"
                                : "No"}
                            </Badge>
                          </HStack>
                        </VStack>
                      ) : (
                        <Text color="gray.500">
                          No profile information available
                        </Text>
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
    </>
  );
};

export default AdminUsersPage;
