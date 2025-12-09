import { Box, Stack, Progress, HStack, Button, Text } from "@chakra-ui/react"

interface CompleteProfileCardProps {
  onUpdateProfileClick: () => void
}
const CompleteProfileCard = (props: CompleteProfileCardProps) => {

  return (
    <Box bg="bg-subtle" px="4" py="5" borderRadius="lg">
      <Stack spacing="4">
        <Stack spacing="1">
          <Text fontSize="sm" fontWeight="medium">
            Almost there
          </Text>
          <Text fontSize="sm" color="muted">
            Fill in some more information about you to complete your profile.
          </Text>
        </Stack>
        <Progress value={80} size="sm" aria-label="Profile Update Progress" />
        <HStack spacing="3">
          <Button variant="link" size="sm">
            Dismiss
          </Button>
          <Button variant="link" size="sm" colorScheme="brand" onClick={props.onUpdateProfileClick}>
            Update profile
          </Button>
        </HStack>
      </Stack>
    </Box>
  )
}

export default CompleteProfileCard
