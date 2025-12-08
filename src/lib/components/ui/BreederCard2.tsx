import { Card, CardBody, Stack, HStack, Avatar, VStack, Badge, Button, Text } from "@chakra-ui/react";
import Link from "next/link";
import { MdLocationOn, MdStar } from "react-icons/md";

interface BreederCardProps {
  breeder: any;
}

export const BreederCard: React.FC<BreederCardProps> = ({ breeder }) => {
  const user = breeder.userBreed.users;
  const breederProfile = user?.breeder_profiles;

  //if (!user) return null;

  return (
    <Card variant="outline" _hover={{ shadow: "md", transform: "translateY(-2px)" }} transition="all 0.2s">
      <CardBody>
        <Stack spacing={4}>
          <HStack spacing={4}>
            <Avatar
              src={user?.profile_photo_url}
              name={breederProfile?.kennel_name || user?.display_name}
              size="lg"
            />
            <VStack align="start" spacing={1} flex={1}>
              <Text fontWeight="semibold" fontSize="lg">
                {breederProfile?.kennel_name || user?.display_name}
              </Text>
              {breederProfile?.kennel_name && (
                <Text color="gray.600" fontSize="sm">
                  {user?.display_name}
                </Text>
              )}
              {breederProfile?.kennel_location && (
                <HStack>
                  <MdLocationOn size={16} />
                  <Text fontSize="sm" color="gray.600">
                    {breederProfile.kennel_location}
                  </Text>
                </HStack>
              )}
            </VStack>
          </HStack>

          <HStack spacing={2} flexWrap="wrap">
            {breederProfile?.rating && (
              <HStack>
                <MdStar color="gold" />
                <Text fontSize="sm">{breederProfile.rating.toFixed(1)}</Text>
              </HStack>
            )}
            {breederProfile?.verified_at && (
              <Badge colorScheme="green" size="sm">Verified</Badge>
            )}
            <Badge colorScheme="blue" size="sm">
              {breeder.breeds.length} breed{breeder.breeds.length !== 1 ? 's' : ''}
            </Badge>
          </HStack>

          <Text fontSize="sm" color="gray.600" noOfLines={2}>
            Specializing in: {breeder.breeds.map(b => b.breeds?.name).filter(Boolean).join(', ')}
          </Text>

          <Link href={`/dashboard/breeders/${breeder.id}`} passHref>
            <Button colorScheme="brand" size="sm" w="full" as="a">
              View Profile
            </Button>
          </Link>
        </Stack>
      </CardBody>
    </Card>
  );
};