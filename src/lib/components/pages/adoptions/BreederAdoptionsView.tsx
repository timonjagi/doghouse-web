import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
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
import { AdoptionWithListing, useAdoptionsReceived } from '../../../hooks/queries/useAdoptions';
import { Loader } from 'lib/components/ui/Loader';
import { AdoptionCard } from 'lib/components/ui/AdoptionCard';
import { useUserProfile } from 'lib/hooks/queries/useUserProfile';
import { NextSeo } from 'next-seo';

interface BreederAdoptionsViewProps {
}

const BreederAdoptionsView: React.FC<BreederAdoptionsViewProps> = () => {

  const { data: userProfile, isLoading: isLoadingUser, error: errorUser } = useUserProfile();

  const { data: adoptions, isLoading, error } = useAdoptionsReceived(userProfile?.id);
  const [selectedTab, setSelectedTab] = useState(0);

  const [groupedAdoptions, setGroupedAdoptions] = React.useState<{ new: AdoptionWithListing[], pending: AdoptionWithListing[], reviewed: AdoptionWithListing[] }>({ new: [], pending: [], reviewed: [] });

  useEffect(() => {
    if (adoptions?.length) {
      setGroupedAdoptions({
        new: adoptions.filter(app => app.status === 'submitted'),
        pending: adoptions.filter(app => app.status === 'pending'),
        reviewed: adoptions.filter(app => ['approved', 'reserved'].includes(app.status)),
      });

    }
  }, [adoptions]);


  if (isLoading || isLoadingUser) {
    return (
      <Loader />
    );
  }

  if (error || errorUser) {
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
          Adoptions from potential adopters will appear here when they express interest in your listings.
        </Text>
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
          <Tabs
            index={selectedTab}
            onChange={setSelectedTab}
            colorScheme="brand"
            variant='soft-rounded'
          >
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
              <Tab

              >
                New ({groupedAdoptions.new.length})
              </Tab>
              <Tab >
                Pending ({groupedAdoptions.pending.length})
              </Tab>
              <Tab >
                Reviewed ({groupedAdoptions.reviewed.length})
              </Tab>
              <Tab >
                All ({adoptions.length})
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>
                {groupedAdoptions.new.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Text color="gray.500">No new adoptions</Text>
                  </Box>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} >
                    {groupedAdoptions.new.map((adoption) => (
                      <AdoptionCard
                        key={adoption.id}
                        adoption={adoption}
                        userRole="breeder"
                      />
                    ))}
                  </SimpleGrid>
                )}
              </TabPanel>

              <TabPanel px={0}>
                {groupedAdoptions.pending.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Text color="gray.500">No pending adoptions</Text>
                  </Box>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} >
                    {groupedAdoptions.pending.map((adoption) => (
                      <AdoptionCard
                        key={adoption.id}
                        adoption={adoption}
                        userRole="breeder"
                      />
                    ))}
                  </SimpleGrid>
                )}
              </TabPanel>

              <TabPanel px={0}>
                {groupedAdoptions.reviewed.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Text color="gray.500">No reviewed adoptions</Text>
                  </Box>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} >
                    {groupedAdoptions.reviewed.map((adoption) => (
                      <AdoptionCard
                        key={adoption.id}
                        adoption={adoption}
                        userRole="breeder"
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
                      userRole="breeder"
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

export default BreederAdoptionsView;