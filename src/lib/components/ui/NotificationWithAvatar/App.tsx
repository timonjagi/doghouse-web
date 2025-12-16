import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  StackDivider,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react'
import * as React from 'react'

export const App = () => (
  <Box
    as="section"
    pt={{ base: '4', md: '8' }}
    pb={{ base: '12', md: '24' }}
    px={{ base: '4', md: '8' }}
  >
    <Flex direction="row-reverse">
      <Box
        width={{ base: 'full', sm: 'md' }}
        boxShadow={useColorModeValue('md', 'md-dark')}
        bg="bg-surface"
        borderRadius="lg"
      >
        <HStack divider={<StackDivider />} spacing="0">
          <HStack spacing="4" p="4" flex="1">
            {useBreakpointValue({ base: false, sm: true }) && (
              <Avatar src="https://tinyurl.com/yhkm2ek8" name="Christoph Winston" boxSize="10" />
            )}
            <Box>
              <Text fontWeight="medium" fontSize="sm">
                Christoph Winston
              </Text>
              <Text color="muted" fontSize="sm">
                Hey buddy. You are awesome.
              </Text>
            </Box>
          </HStack>

          <Center p="4">
            <Button colorScheme="blue" variant="link" size="sm">
              Reply
            </Button>
          </Center>
        </HStack>
      </Box>
    </Flex>
  </Box>
)
