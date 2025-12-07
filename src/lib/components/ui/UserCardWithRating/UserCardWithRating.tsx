import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  Stack,
  Tag,
  Text,
  useColorModeValue,
  Wrap,
} from '@chakra-ui/react'
import * as React from 'react'
import { HiCash, HiLocationMarker, HiShieldCheck } from 'react-icons/hi'
import { Card } from './Card'
import { CustomerReviews } from './CustomerReviews'
import { LuDog } from 'react-icons/lu'

export const UserCardWithRating = ({
  data,
  action,
}: {
  data: any
  action: any
}) => (
  <Card>
    <Stack
      spacing={{ base: '3', md: '10' }}
      align="flex-start"
    >
      <Stack spacing="4">
        <Avatar
          size="2xl"
          src={data.profile_photo_url}
          name={data.display_name}
        />
        {/* <Button width="full" colorScheme="brand" display={{ base: 'none', md: 'initial' }}>
            View Profile
          </Button> */}
      </Stack>
      <Box>
        <Stack spacing={{ base: '1', md: '2' }}>
          <Text as="h2" fontWeight="bold" fontSize="xl">
            {data.display_name}
          </Text>
          <HStack fontSize={{ base: 'md', md: 'lg' }}>
            <Text as="span" color={useColorModeValue('gray.500', 'gray.300')} lineHeight="1">
              @{data.username}
            </Text>
            <Icon as={HiShieldCheck} color="green.500" />
          </HStack>
        </Stack>
        <Text mt="2">{data.bio}</Text>
        <Stack shouldWrapChildren my="4" spacing="4">
          <HStack>
            <CustomerReviews reviewCount={data.review_count} rating={data.rating} />
            <HStack>
              <Icon as={LuDog} fontSize="xl" color="gray.400" />
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={useColorModeValue('gray.600', 'gray.300')}
              >
                <b>{data.adoption_count}</b> pets rehomed
              </Text>
            </HStack>
          </HStack>
          <HStack spacing="1">
            <Icon as={HiLocationMarker} color="gray.400" />
            <Text
              fontSize="sm"
              fontWeight="medium"
              color={useColorModeValue('gray.600', 'gray.300')}
            >
              {data.location_text}
            </Text>
          </HStack>
        </Stack>
        <Box fontSize="sm" noOfLines={2}>
          {data.bio || `Hi, I am a professional ${data.role} with 5+ years of experience.`}
        </Box>
        <Wrap shouldWrapChildren mt="5" color={useColorModeValue('gray.600', 'gray.300')}>
          {data.tags.map((tag: string) => (
            <Tag key={tag} color="inherit" px="3">
              {tag}
            </Tag>
          ))}
        </Wrap>
      </Box>
    </Stack>
    <Button mt="8" width="full" colorScheme="brand" onClick={action}>
      View Profile
    </Button>
  </Card>
)
