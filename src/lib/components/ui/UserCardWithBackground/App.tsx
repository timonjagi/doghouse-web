import { Box, Heading, Text, useColorModeValue, Badge, HStack } from '@chakra-ui/react'
import * as React from 'react'
import { CardContent } from './CardContent'
import { CardWithAvatar } from './CardWithAvatar'
import { UserInfo } from './UserInfo'
import { UserCardWithBackgroundProps } from './types'

export const UserCardWithBackground: React.FC<UserCardWithBackgroundProps> = ({
  data,
  action,
  maxW = 'xl',
  backgroundColorScheme = 'blue.600',
}) => {
  const { user } = data;

  // Format member since date
  const memberSince = data.memberSince ||
    (user.created_at ? `Joined ${new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : undefined);

  // Determine display name and subtitle based on role
  const displayName = user.display_name || user.email?.split('@')[0];

  let subtitle = '';
  let additionalInfo: React.ReactNode = null;

  if (data.role === 'breeder' && data.breederProfile) {
    subtitle = data.breederProfile.kennel_name || 'Breeder';

    additionalInfo = (
      <HStack mt="2" spacing="2" justify={{ sm: 'center' }}>
        <Badge colorScheme="green" fontSize="sm">
          Breeder
        </Badge>
        {user.is_verified && (
          <Badge colorScheme="blue" fontSize="sm">
            Verified
          </Badge>
        )}
        {data.breederProfile.rating && parseFloat(data.breederProfile.rating) > 0 && (
          <Badge colorScheme="yellow" fontSize="sm">
            ⭐ {parseFloat(data.breederProfile.rating).toFixed(1)}
          </Badge>
        )}
      </HStack>
    );
  } else if (data.role === 'seeker') {
    subtitle = 'Dog Seeker';

    additionalInfo = (
      <HStack mt="2" spacing="2" justify={{ sm: 'center' }}>
        <Badge colorScheme="purple" fontSize="sm">
          Seeker
        </Badge>
        {user.is_verified && (
          <Badge colorScheme="blue" fontSize="sm">
            Verified
          </Badge>
        )}
      </HStack>
    );
  }

  return (
    <Box as="section" pt="20" pb="12" position="relative">
      <Box position="absolute" inset="0" height="32" bg={backgroundColorScheme} />
      <CardWithAvatar
        maxW={maxW}
        avatarProps={{
          src: user.profile_photo_url || undefined,
          name: displayName,
        }}
        action={action}
      >
        <CardContent>
          <Heading size="lg" fontWeight="extrabold" letterSpacing="tight">
            {displayName}
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')} mt="1">
            {subtitle}
          </Text>
          {additionalInfo}
          {user.bio && (
            <Text
              color={useColorModeValue('gray.700', 'gray.300')}
              mt="3"
              fontSize="sm"
              textAlign={{ sm: 'center' }}
            >
              {user.bio}
            </Text>
          )}
          <UserInfo
            location={user.location_text || undefined}
            memberSince={memberSince}
          />
        </CardContent>
      </CardWithAvatar>
    </Box>
  );
};

// Keep the old App export for backwards compatibility (demo purposes)
export const App = UserCardWithBackground;
