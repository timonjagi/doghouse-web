import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Card,
  CardBody,
  Text,
  Button,
  Badge,
  Avatar,
  Image,
  Grid,
  GridItem,
  Flex,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  CalendarIcon,
  CheckCircleIcon,
  WarningIcon,
  TimeIcon,
  PhoneIcon,
  EmailIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import { ApplicationWithListing } from '../../../hooks/queries/useApplications';
import { useRouter } from 'next/router';

interface ApplicationCardProps {
  application: ApplicationWithListing;
  userRole: 'seeker' | 'breeder';
  onQuickApprove?: (application: ApplicationWithListing) => void;
  onQuickReject?: (application: ApplicationWithListing) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  userRole,
  onQuickApprove,
  onQuickReject,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString as string).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleViewDetails = () => {
    router.push(`/dashboard/applications/${application.id}`);
  };

  const primaryImage = userRole === 'seeker'
    ? application.listings.photos?.[0] || '/images/doggo.png'
    : application.users.profile_photo_url || undefined;

  const breedName = application.listings.breeds?.name || 'Unknown Breed';
  const displayName = userRole === 'seeker'
    ? application.listings.title
    : application.users.display_name;

  const subTitle = userRole === 'seeker'
    ? `${application.listings.type === 'litter' ? 'Litter' : 'Pet'} • ${breedName}`
    : application.users.email;

  const priceText = application.listings.price
    ? `KSH ${application.listings.price.toLocaleString()}`
    : 'Contact for Price';

  return (
    <Card shadow="md" border="1px" borderColor="gray.200" _hover={{ shadow: 'lg' }}>
      <CardBody p={0}>
        <Grid templateColumns="120px 1fr" gap={0}>
          {/* Left Image/Avatar */}
          <GridItem>
            {userRole === 'seeker' ? (
              <Image
                src={primaryImage}
                alt={application.listings.title}
                width="120px"
                height="120px"
                objectFit="cover"
                borderLeftRadius="md"
              />
            ) : (
              <Avatar
                src={primaryImage}
                name={application.users.display_name}
                size="lg"
                borderLeftRadius="md"
              />
            )}
          </GridItem>

          {/* Application Details */}
          <GridItem p={4}>
            <VStack align="stretch" spacing={2}>
              {/* Header Row */}
              <Flex align="center">
                <Box>
                  <HStack spacing={2} mb={1}>
                    <Text fontSize="sm" color="gray.600">
                      {subTitle}
                    </Text>
                    <Badge
                      colorScheme={getStatusColor(application.status)}
                      variant="solid"
                      px={2}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                    >
                      {formatStatus(application.status)}
                    </Badge>
                  </HStack>
                  <Text fontSize="md" fontWeight="bold" color="gray.800">
                    {displayName}
                  </Text>
                  {userRole === 'breeder' && (
                    <Text fontSize="sm" color="gray.500">
                      {application.users.email}
                    </Text>
                  )}
                </Box>
                <Spacer />
                {userRole === 'breeder' && (
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<ChevronDownIcon />}
                      variant="outline"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem icon={<ViewIcon />} onClick={handleViewDetails}>
                        View Details
                      </MenuItem>
                      <MenuItem icon={<EmailIcon />}>
                        Contact Applicant
                      </MenuItem>
                      {application.status === 'submitted' && onQuickApprove && onQuickReject && (
                        <>
                          <MenuItem icon={<CheckCircleIcon />} onClick={() => onQuickApprove(application)}>
                            Approve
                          </MenuItem>
                          <MenuItem icon={<WarningIcon />} onClick={() => onQuickReject(application)}>
                            Reject
                          </MenuItem>
                        </>
                      )}
                    </MenuList>
                  </Menu>
                )}
              </Flex>

              {/* Listing Title (for breeders) */}
              {userRole === 'breeder' && (
                <Text fontWeight="medium" color="blue.600">
                  {application.listings.title}
                </Text>
              )}

              {/* Price and Date */}
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold" color="green.600">
                  {priceText}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Applied {formatDate(application.created_at.toString())}
                </Text>
              </HStack>

              {/* Application Message Preview (for seekers) */}
              //@ts-ignore
              {userRole === 'seeker' && application.application_data?.message && (
                <Box>
                  <Text fontSize="sm" color="gray.600" fontStyle="italic">
                    //@ts-ignore
                    "{application.application_data.message.substring(0, 100)}
                    //@ts-ignore
                    {application.application_data.message.length > 100 ? '...' : ''}"
                  </Text>
                </Box>
              )}

              {/* Action Buttons */}
              <HStack justify="flex-end" pt={2}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewDetails}
                >
                  {userRole === 'seeker' ? 'View Details' : 'Review'}
                </Button>
                {userRole === 'seeker' && application.status === 'submitted' && (
                  <Button variant="ghost" size="sm" color="red.500">
                    Withdraw
                  </Button>
                )}
                {userRole === 'breeder' && application.status === 'submitted' && onQuickApprove && (
                  <Button colorScheme="green" size="sm" onClick={() => onQuickApprove(application)}>
                    Quick Approve
                  </Button>
                )}
              </HStack>
            </VStack>
          </GridItem>
        </Grid>
      </CardBody>
    </Card>
  );
};
