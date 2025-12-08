import { Box, Button, HStack, Progress, Stack, Text } from '@chakra-ui/react'
import React from 'react';
import SeekerExploreOverview from 'lib/components/ui/SeekerExploreOverview';
import EthicalQuestionairreCard from 'lib/components/ui/EthicalQuestionairreCard';

const SeekerDashboardOverview: React.FC = () => {

  return (
    <Stack>

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
      </Box>
      <SeekerExploreOverview />

      <EthicalQuestionairreCard />
    </Stack>
  )


};

export default SeekerDashboardOverview;