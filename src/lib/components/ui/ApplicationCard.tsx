import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Image,
  Skeleton,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import {
  CheckCircleIcon,
  WarningIcon,
  TimeIcon,
  CalendarIcon,
} from '@chakra-ui/icons';
import { ApplicationWithListing } from '../../hooks/queries/useApplications';
import { useRouter } from 'next/router';
import { FiUser } from 'react-icons/fi';
import { PriceTag } from './PriceTag';

interface ApplicationCardProps {
  application: ApplicationWithListing;
  userRole: 'seeker' | 'breeder';
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  userRole,
}) => {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'blue';
      case 'pending': return 'yellow';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'completed': return 'purple';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon />;
      case 'rejected': return <WarningIcon />;
      case 'submitted':
      case 'pending': return <TimeIcon />;
      case 'completed': return <CheckCircleIcon color="purple.500" />;
      default: return <CalendarIcon />;
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };


  const handleViewDetails = () => {
    router.push(`/dashboard/applications/${application.id}`);
  };

  const breedName = application.listings.breeds?.name || 'Unknown Breed';
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      key={application.id}
      overflow="hidden"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      cursor="pointer"
      onClick={handleViewDetails}
      transition="all 0.2s"
      _hover={{
        transform: "translateY(-2px)",
        shadow: "md",
        borderColor: "gray.200"
      }}
    >
      {/* Main Photo */}
      <Box position="relative" height="200px" overflow="hidden">
        <Image
          src={application.listings.photos?.[0]}
          alt={breedName}
          objectFit="cover"
          w="full"
          h="200px"
          fallback={<Skeleton width="100%" height="100%" />}
          fallbackSrc='/images/logo_white.png'
          loading="lazy"
        />

        <HStack position="absolute" top={2} right={2} spacing={2}>
          <Badge colorScheme={getStatusColor(application.status)}>
            {formatStatus(application.status)}
          </Badge>
        </HStack>
      </Box>

      <VStack spacing={2} align="stretch" p={4}>
        <Text fontSize="lg" fontWeight="semibold" noOfLines={2}>
          {application.listings.title}
        </Text>

        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {`${application.listings.type === 'litter' ? 'Litter' : 'Pet'} • ${breedName}`}
        </Text>

        {userRole === 'breeder' && application.users && (
          <HStack align="center" spacing={1}>
            <Icon as={FiUser} boxSize={4} color="gray.500" />
            <Text fontSize="sm" color="gray.500">
              {application.users.display_name}
            </Text>

          </HStack>
        )}

        <PriceTag price={application.listings.price} currency='KES' />

      </VStack>
    </Box>
  );
};
