import { Box, Button, Flex, Heading, HStack, Link, Progress, Stack, Text, Image, useColorModeValue } from '@chakra-ui/react'
import React from 'react';
import SeekerExploreOverview from 'lib/components/ui/ExploreOverview';
import EthicalQuestionairreCard from 'lib/components/ui/EthicalQuestionairreCard';

const SeekerDashboardOverview: React.FC = () => {

  return (
    <Stack>
      {/* 
      <Box bg="bg-accent-subtle" px="4" py="5" borderRadius="lg">
        <Stack spacing="4">
          <Stack spacing="1">
            <Text fontSize="sm" fontWeight="medium" color="on-accent">
              Almost there
            </Text>
            <Text fontSize="sm" color="on-accent-muted">
              Fill in some more information about yourself.
            </Text>
          </Stack>
          <Progress
            value={80}
            size="sm"
            variant="on-accent"
            aria-label="Profile Update Progress"
          />
          <HStack spacing="3">
            <Button variant="link-on-accent" size="sm" color="on-accent-muted">
              Dismiss
            </Button>
            <Button variant="link-on-accent" size="sm">
              Update profile
            </Button>
          </HStack>
        </Stack>
      </Box> */}

      <Box position="relative">
        <Image
          src="/images/hero_2.png"
          alt="Lovely Image"
          objectFit="cover"
          width="100%"
          height="md"
        />
        <Box position="absolute" boxSize="full" inset="0" zIndex="1">
          <Flex
            direction="column-reverse"
            height="full"
            maxW="7xl"
            mx="auto"
            px={{ base: '4', md: '8', lg: '12' }}
            py={{ base: '6', md: '8', lg: '12' }}
          >
            <Box
              bg={useColorModeValue('white', 'gray.800')}
              alignSelf={{ md: 'start' }}
              p={{ base: '5', md: '8' }}
              minW={{ md: 'lg' }}
            >
              <Stack spacing="5">
                <Stack spacing="1">
                  <Heading size="lg" color={useColorModeValue('gray.500', 'gray.400')}>
                    Find your
                  </Heading>
                  <Heading size="lg" color={useColorModeValue('black', 'white')}>
                    perfect companion
                  </Heading>
                </Stack>
                <Link href="/dashboard/search" fontWeight="bold" textDecoration="underline">
                  Discover now
                </Link>
              </Stack>
            </Box>
          </Flex>
        </Box>
      </Box>
      <SeekerExploreOverview />

      <EthicalQuestionairreCard />
    </Stack>
  )


};

export default SeekerDashboardOverview;