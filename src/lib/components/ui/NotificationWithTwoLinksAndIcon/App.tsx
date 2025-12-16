import {
  Box,
  Button,
  ButtonGroup,
  Center,
  CloseButton,
  Flex,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import * as React from 'react'
import { FiInfo } from 'react-icons/fi'

export const App = () => (
  <Box
    as="section"
    pt={{ base: '4', md: '8' }}
    pb={{ base: '12', md: '24' }}
    px={{ base: '4', md: '8' }}
  >
    <Flex direction="row-reverse">
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        width={{ base: 'full', sm: 'md' }}
        boxShadow={useColorModeValue('md', 'md-dark')}
        bg="bg-surface"
        borderRadius="lg"
        overflow="hidden"
      >
        <Center display={{ base: 'none', sm: 'flex' }} bg="bg-accent" px="5">
          <Icon as={FiInfo} boxSize="10" color="on-accent" />
        </Center>
        <Stack direction="row" p="4" spacing="3" flex="1">
          <Stack spacing="2.5" flex="1">
            <Stack spacing="1">
              <Text fontSize="sm" fontWeight="medium">
                Updates Available
              </Text>
              <Text fontSize="sm" color="muted">
                Hoorray. A new version is available.
              </Text>
            </Stack>
            <ButtonGroup variant="link" size="sm" spacing="3">
              <Button>Skip</Button>
              <Button colorScheme="blue">Update</Button>
            </ButtonGroup>
          </Stack>
          <CloseButton transform="translateY(-6px)" />
        </Stack>
      </Flex>
    </Flex>
  </Box>
)
