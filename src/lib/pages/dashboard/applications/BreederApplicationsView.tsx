import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import { ApplicationWithListing, useApplicationsReceived, useUpdateApplicationStatus } from '../../../hooks/queries/useApplications';
import { User } from '../../../../../db/schema';
import { ApplicationCard } from './ApplicationCard';
import { Loader } from 'lib/components/ui/Loader';

interface BreederApplicationsViewProps {
  userProfile: User;
}

export const BreederApplicationsView: React.FC<BreederApplicationsViewProps> = ({ userProfile }) => {
  const { data: applications, isLoading, error } = useApplicationsReceived(userProfile.id);
  const toast = useToast();
  const [selectedTab, setSelectedTab] = useState(0);

  const [groupedApplications, setGroupedApplications] = React.useState<{ new: ApplicationWithListing[], pending: ApplicationWithListing[], reviewed: ApplicationWithListing[] }>({ new: [], pending: [], reviewed: [] });
  const updateStatusMutation = useUpdateApplicationStatus();

  useEffect(() => {
    if (applications?.length) {
      setGroupedApplications({
        new: applications.filter(app => app.status === 'submitted'),
        pending: applications.filter(app => app.status === 'pending'),
        reviewed: applications.filter(app => ['approved', 'rejected'].includes(app.status)),
      });

    }
  }, [applications]);

  const handleQuickApprove = async (application: ApplicationWithListing) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: application.id,
        status: 'approved',
      });

      toast({
        title: 'Application approved',
        description: 'The application has been approved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating application',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleQuickReject = async (application: ApplicationWithListing) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: application.id,
        status: 'rejected',
      });

      toast({
        title: 'Application rejected',
        description: 'The application has been rejected',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating application',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Loader />
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <Box>
          <Text fontWeight="bold">Error loading applications</Text>
          <Text fontSize="sm">{error.message}</Text>
        </Box>
      </Alert>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <Box textAlign="center" py={12}>
        <Heading size="sm" color="gray.600" mb={4}>
          No Applications Yet
        </Heading>
        <Text color="gray.500" mb={6}>
          Applications from potential adopters will appear here when they express interest in your listings.
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Applications Overview */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
        <Card>
          <CardBody textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color="blue.500">
              {applications.length}
            </Text>
            <Text color="gray.600">Total Received</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color="yellow.500">
              {groupedApplications.new.length}
            </Text>
            <Text color="gray.600">New Applications</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color="green.500">
              {applications.filter(app => app.status === 'approved').length}
            </Text>
            <Text color="gray.600">Approved</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color="purple.500">
              {groupedApplications.pending.length}
            </Text>
            <Text color="gray.600">Pending Review</Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Applications Tabs */}
      <Card>
        <CardHeader>
          <Tabs index={selectedTab} onChange={setSelectedTab} colorScheme="brand">
            <TabList>
              <Tab>
                New ({groupedApplications.new.length})
              </Tab>
              <Tab>
                Pending ({groupedApplications.pending.length})
              </Tab>
              <Tab>
                Reviewed ({groupedApplications.reviewed.length})
              </Tab>
              <Tab>
                All ({applications.length})
              </Tab>
            </TabList>
          </Tabs>
        </CardHeader>

        <CardBody>
          <Tabs index={selectedTab} onChange={setSelectedTab} colorScheme="brand">
            <TabPanels>
              <TabPanel px={0}>
                {groupedApplications.new.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Text color="gray.500">No new applications</Text>
                  </Box>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {groupedApplications.new.map((application) => (
                      <ApplicationCard
                        key={application.id}
                        application={application}
                        userRole="breeder"
                        onQuickApprove={handleQuickApprove}
                        onQuickReject={handleQuickReject}
                      />
                    ))}
                  </VStack>
                )}
              </TabPanel>

              <TabPanel px={0}>
                {groupedApplications.pending.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Text color="gray.500">No pending applications</Text>
                  </Box>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {groupedApplications.pending.map((application) => (
                      <ApplicationCard
                        key={application.id}
                        application={application}
                        userRole="breeder"
                        onQuickApprove={handleQuickApprove}
                        onQuickReject={handleQuickReject}
                      />
                    ))}
                  </VStack>
                )}
              </TabPanel>

              <TabPanel px={0}>
                {groupedApplications.reviewed.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Text color="gray.500">No reviewed applications</Text>
                  </Box>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {groupedApplications.reviewed.map((application) => (
                      <ApplicationCard
                        key={application.id}
                        application={application}
                        userRole="breeder"
                        onQuickApprove={handleQuickApprove}
                        onQuickReject={handleQuickReject}
                      />
                    ))}
                  </VStack>
                )}
              </TabPanel>

              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  {applications.map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      userRole="breeder"
                      onQuickApprove={handleQuickApprove}
                      onQuickReject={handleQuickReject}
                    />
                  ))}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </VStack>
  );
};
