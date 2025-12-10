import { Card, CardBody, Stack, HStack, Avatar, VStack, Badge, Button, Text, Icon, ButtonGroup } from "@chakra-ui/react";
import Link from "next/link";
import { FiArrowRight, FiBell, FiShield } from "react-icons/fi";
import { LuDog } from "react-icons/lu";
import { MdLocationOn, MdStar, MdVerifiedUser } from "react-icons/md";
import { useToast } from "@chakra-ui/react";

interface BreederCardProps {
  breeder: any;
}

export const BreederCard: React.FC<BreederCardProps> = ({ breeder }) => {
  const user = breeder;
  const breederProfile = user?.breeder_profiles ? user.breeder_profiles[0] : user;
  const toast = useToast();
  //if (!user) return null;

  const handleSubscribe = () => {
    toast({
      title: "Subscribed",
      description: "You have successfully subscribed to this breeder.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleUnsubscribe = () => {
    useToast({
      title: "Unsubscribed",
      description: "You have successfully unsubscribed from this breeder.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Card variant="outline" _hover={{ shadow: "md", transform: "translateY(-2px)" }} transition="all 0.2s">
      <CardBody>
        <Stack spacing={6}>
          <Stack
            spacing={4}
            justifyContent="flex-start"
            alignItems="center"
            direction="row"
          >
            <Avatar
              src={user?.profile_photo_url}
              name={breederProfile?.kennel_name || user?.display_name}
              size="lg"
            />

            <VStack align="start" spacing={1}>

              <HStack w="full" justifyContent="space-between">
                <Text fontWeight="semibold" fontSize="lg" noOfLines={2}>
                  {breederProfile?.kennel_name || user?.display_name}
                </Text>



                <Badge colorScheme="yellow" size="sm">
                  <HStack>
                    <Icon as={MdStar} color="gold" />
                    <Text fontSize="sm">{breederProfile.rating?.toFixed(1)}</Text>
                  </HStack>
                </Badge>
              </HStack>

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
            <Badge colorScheme="blue" size="sm">
              <HStack>
                <Icon as={LuDog} />
                <Text fontSize="sm">
                  {breeder.userBreedsCount} breed{breeder.userBreedsCount !== 1 ? 's' : ''}
                </Text>
              </HStack>
            </Badge>

            <Badge colorScheme={breederProfile?.verified_at ? 'green' : 'gray'} size="sm">
              <HStack>
                <Icon as={breederProfile?.verified_at ? MdVerifiedUser : FiShield} />
                <Text fontSize="sm">{breederProfile?.verified_at ? 'Verified' : 'Not verified'}</Text>
              </HStack>
            </Badge>




          </HStack>

          <HStack wrap="nowrap" overflowY="scroll" css={{ scrollbarWidth: 'none' }}>
            {breeder.breedNames?.map((breedName: string) => (
              <Badge colorScheme="brand" size="sm" key={breedName}>
                {breedName}
              </Badge>
            ))}
          </HStack>

          <ButtonGroup>


            <Button
              variant="secondary"
              colorScheme="gr"
              size="sm"
              w="full"
              onClick={handleSubscribe}
              rightIcon={<Icon as={FiBell} />}
            >
              Subscribe
            </Button>

            <Button
              colorScheme="brand"
              size="sm"
              w="full"
              as={Link}
              href={`/dashboard/breeders/${breeder.id}`}
              rightIcon={<Icon as={FiArrowRight} />}
            >
              View Profile
            </Button>

          </ButtonGroup>
        </Stack>
      </CardBody>
    </Card>
  );
};