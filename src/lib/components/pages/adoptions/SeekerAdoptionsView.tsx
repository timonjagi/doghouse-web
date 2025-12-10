import React, { useState } from 'react';
import {
  Box,
  VStack,
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
  SimpleGrid,
  Container,
} from '@chakra-ui/react';
import { useAdoptionsByUser } from '../../../hooks/queries/useAdoptions';
import { Loader } from 'lib/components/ui/Loader';
import Link from 'next/link';
import { AdoptionCard } from 'lib/components/ui/AdoptionCard';
import { useUserProfile } from 'lib/hooks/queries/useUserProfile';
import { NextSeo } from 'next-seo';

interface SeekerAdoptionsViewProps {
}

const SeekerAdoptionsView: React.FC<SeekerAdoptionsViewProps> = () => {
  const { data: userProfile, isLoading: profileLoading, error: profileError } = useUserProfile();

  const { data: adoptions, isLoading, error } = useAdoptionsByUser(userProfile?.id);
  const [selectedTab, setSelectedTab] = useState(0);

  const groupedAdoptions = {
    active: adoptions?.filter(app => ['submitted', 'pending', 'approved', 'reserved'].includes(app.status)) || [],
    completed: adoptions?.filter(app => ['rejected', 'completed'].includes(app.status)) || [],
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
          <Text fontWeight="bold">Error loading adoptions</Text>
          <Text fontSize="sm">{error.message}</Text>
        </Box>
      </Alert>
    );
  }

  if (!adoptions || adoptions.length === 0) {
    return (

      <Box textAlign="center" py={12}>
        <Heading size="sm" color="gray.600" mb={4}>
          No Adoptions Yet
        </Heading>
        <Text color="gray.500" mb={6}>
          Start browsing listings and submit your first adoption request to adopt your perfect companion.
        </Text>
        <Button colorScheme="brand" size="lg" as={Link} href="/dashboard/listings">
          Browse Listings
        </Button>
      </Box>
    );
  }

  return (
    <>

      <NextSeo title="Adoptions - DogHouse Kenya" />

      <Container maxW="6xl" py={{ base: 4, md: 0 }} >
        <VStack spacing={8} align="stretch">
          {/* Page Header */}
          <Box>
            <Heading size={{ base: 'sm', lg: 'md' }}>
              Adoptions
            </Heading>
            <Text color="gray.600" mt={2}>
              View your adoptions and track their status
            </Text>
          </Box>

          {/* Adoptions Tabs */}

          <Tabs variant='soft-rounded' index={selectedTab} onChange={setSelectedTab} colorScheme="brand">
            <TabList
              overflowY="hidden"
              whiteSpace="nowrap"
              css={{
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                scrollbarWidth: 'none',
              }}
            >
              <Tab>
                Active ({groupedAdoptions.active.length})
              </Tab>
              <Tab>
                Completed ({groupedAdoptions.completed.length})
              </Tab>
              <Tab>
                All ({adoptions.length})
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>
                {groupedAdoptions.active.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Text color="gray.500">No active adoptions</Text>
                  </Box>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} >
                    {groupedAdoptions.active.map((adoption) => (
                      <AdoptionCard
                        key={adoption.id}
                        adoption={adoption}
                        userRole="seeker"
                      />
                    ))}
                  </SimpleGrid>
                )}
              </TabPanel>

              <TabPanel px={0}>
                {groupedAdoptions.completed.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Text color="gray.500">No completed adoptions</Text>
                  </Box>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} >
                    {groupedAdoptions.completed.map((adoption) => (
                      <AdoptionCard
                        key={adoption.id}
                        adoption={adoption}
                        userRole="seeker"
                      />
                    ))}
                  </SimpleGrid>
                )}
              </TabPanel>

              <TabPanel px={0}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} >
                  {adoptions.map((adoption) => (
                    <AdoptionCard
                      key={adoption.id}
                      adoption={adoption}
                      userRole="seeker"
                    />
                  ))}
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>

        </VStack>
      </Container>
    </>
  );
};

export default SeekerAdoptionsView;