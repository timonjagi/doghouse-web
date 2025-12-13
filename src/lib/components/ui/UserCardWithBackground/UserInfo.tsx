import { HStack, Icon, Stack, StackProps, Text, useColorModeValue } from '@chakra-ui/react'
import * as React from 'react'
import { HiCalendar, HiLink, HiLocationMarker } from 'react-icons/hi'

interface UserInfoProps extends StackProps {
  location?: string
  website?: string
  memberSince?: string
  kennelName?: string
  rating?: string
}

export const UserInfo = (props: UserInfoProps) => {
  const { location, website, memberSince, kennelName, rating, ...stackProps } = props
  return (
    <Stack
      direction={{ base: 'column', sm: 'row' }}
      spacing={{ base: '1', sm: '6' }}
      mt="4"
      fontSize="sm"
      fontWeight="medium"
      color={useColorModeValue('blue.600', 'blue.300')}
      {...stackProps}
    >
      {location && (
        <HStack>
          <Icon as={HiLocationMarker} />
          <Text>{location}</Text>
        </HStack>
      )}
      {/* {website && (
        <HStack>
          <Icon as={HiLink} />
          <Text>{website}</Text>
        </HStack>
      )} */}
      {memberSince && (
        <HStack>
          <Icon as={HiCalendar} />
          <Text>{memberSince}</Text>
        </HStack>
      )}
    </Stack>
  )
}
