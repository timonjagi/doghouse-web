import { Alert, VStack, AlertIcon, AlertTitle, AlertDescription, Spacer, Button } from "@chakra-ui/react";
import Link from "next/link";

interface EmptyViewProps {
  title: string,
  description: string,
  ctaText: string,
  ctaAction: () => void
  ctaIcon?: any
}

export const EmptyView: React.FC<EmptyViewProps> = ({ title, description, ctaText, ctaAction, ctaIcon }) => (
  <Alert
    status='info'
    variant='brand'
    flexDirection='column'
    alignItems='center'
    justifyContent='center'
    textAlign='center'
    w="full"
    mx="auto"
    borderRadius="lg"
    bgColor="bg-white"
  >
    <VStack spacing="4">
      <AlertIcon boxSize='50px' mr={0} color="brand.500" />
      <AlertTitle mt={4} mb={1} fontSize='lg'>
        {title}
      </AlertTitle>
      <AlertDescription maxWidth='sm'>
        {description}
      </AlertDescription>

      <Spacer />

      <Button
        colorScheme='brand'
        size='lg'
        w="full"
        onClick={ctaAction}
        leftIcon={ctaIcon ? ctaIcon : null}
      >
        {ctaText}
      </Button>

    </VStack>

  </Alert>
)