import { Card, CardBody, Stack, HStack, Avatar, VStack, Badge, Button, Text, Icon } from "@chakra-ui/react";
import Link from "next/link";
import { FiShield } from "react-icons/fi";
import { LuDog } from "react-icons/lu";
import { MdLocationOn, MdStar, MdVerifiedUser } from "react-icons/md";

interface BreederCardProps {
  breeder: any;
}

export const BreederCard: React.FC<BreederCardProps> = ({ breeder }) => {
  const user = breeder;
  const breederProfile = user?.breeder_profiles ? user.breeder_profiles[0] : user;

  //if (!user) return null;

  return (
    <Card variant="outline" _hover={{ shadow: "md", transform: "translateY(-2px)" }} transition="all 0.2s">
      <CardBody>
        <Stack spacing={4}>
          <Stack spacing={4} direction={{ base: "row", md: "row" }} justifyContent={{ base: "center", md: "start" }}>
            <Avatar
              src={user?.profile_photo_url}
              name={breederProfile?.kennel_name || user?.display_name}
              size="lg"
            />

            <VStack align="start" spacing={1} flex={1}>
              <HStack>

                <Text fontWeight="semibold" fontSize="lg" noOfLines={2}>
                  {breederProfile?.kennel_name || user?.display_name}
                </Text>

                <Badge colorScheme={breederProfile?.verified_at ? 'green' : 'gray'} size="sm">
                  <HStack>
                    <Icon as={breederProfile?.verified_at ? MdVerifiedUser : FiShield} />
                    <Text fontSize="sm">{breederProfile?.verified_at ? 'Verified' : 'Not verified'}</Text>
                  </HStack>
                </Badge>
              </HStack>



              {user?.pet_type && (
                <Text color="gray.600" fontSize="sm">
                  {user?.pet_type}
                </Text>
              )}
              {breederProfile?.kennel_location && (
                <HStack>
                  <MdLocationOn size={16} />
                  <Text fontSize="sm" color="gray.600" noOfLines={1}>
                    {breederProfile.kennel_location}
                  </Text>
                </HStack>
              )}
            </VStack>

          </Stack>

          <HStack spacing={2} flexWrap="wrap">
            <Badge colorScheme="yellow" size="sm">
              <HStack>
                <Icon as={MdStar} color="gold" />
                <Text fontSize="sm">{breederProfile.rating?.toFixed(1)}</Text>
              </HStack>
            </Badge>



            {breeder.userBreedsCount && <Badge colorScheme="blue" size="sm">
              <HStack>
                <Icon as={LuDog} />
                <Text fontSize="sm">
                  {breeder.userBreedsCount} breed{breeder.userBreedsCount !== 1 ? 's' : ''}
                </Text>
              </HStack>
            </Badge>}
          </HStack>

          <HStack wrap="nowrap" overflowY="scroll" css={{ scrollbarWidth: 'none' }}>
            {breeder.breedNames?.map((breedName: string) => (
              <Badge colorScheme="brand" size="sm" key={breedName}>
                {breedName}
              </Badge>
            ))}
          </HStack>

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