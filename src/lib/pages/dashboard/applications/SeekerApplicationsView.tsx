import React, { useState } from 'react';
import {
  Box,
  VStack,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Button,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  SimpleGrid,
} from '@chakra-ui/react';
import { useApplicationsByUser } from '../../../hooks/queries/useApplications';
import { User } from '../../../../../db/schema';
import { ApplicationCard } from './ApplicationCard';
import { Loader } from 'lib/components/ui/Loader';
import Link from 'next/link';

interface SeekerApplicationsViewProps {
  userProfile: User;
}

export const SeekerApplicationsView: React.FC<SeekerApplicationsViewProps> = ({ userProfile }) => {
  const { data: applications, isLoading, error } = useApplicationsByUser(userProfile.id);
  const [selectedTab, setSelectedTab] = useState(0);

  const groupedApplications = {
    active: applications?.filter(app => ['submitted', 'pending', 'approved'].includes(app.status)) || [],
    completed: applications?.filter(app => ['rejected', 'completed'].includes(app.status)) || [],
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
          Start browsing listings and submit your first application to adopt your perfect companion.
        </Text>
        <Button colorScheme="brand" size="lg" as={Link} href="/dashboard/listings">
          Browse Listings
        </Button>
      </Box>
    );
  }



  return (
    <VStack spacing={6} align="stretch">
      {/* Applications Overview */}
      {/* <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Card>
          <CardBody textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color="blue.500">
              {applications.length}
            </Text>
            <Text color="gray.600">Total Applications</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color="yellow.500">
              {groupedApplications.active.length}
            </Text>
            <Text color="gray.600">Active Applications</Text>
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
      </SimpleGrid> */}

      {/* Applications Tabs */}

      <Tabs variant='soft-rounded' index={selectedTab} onChange={setSelectedTab} colorScheme="brand">
        <TabList>
          <Tab>
            Active ({groupedApplications.active.length})
          </Tab>
          <Tab>
            Completed ({groupedApplications.completed.length})
          </Tab>
          <Tab>
            All ({applications.length})
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            {groupedApplications.active.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Text color="gray.500">No active applications</Text>
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} >
                {groupedApplications.active.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    userRole="seeker"
                  />
                ))}
              </SimpleGrid>
            )}
          </TabPanel>

          <TabPanel px={0}>
            {groupedApplications.completed.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Text color="gray.500">No completed applications</Text>
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} >
                {groupedApplications.completed.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    userRole="seeker"
                  />
                ))}
              </SimpleGrid>
            )}
          </TabPanel>

          <TabPanel px={0}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} >
              {applications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  userRole="seeker"
                />
              ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};
