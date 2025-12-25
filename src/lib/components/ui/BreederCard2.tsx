import { Card, CardBody, Stack, HStack, Avatar, VStack, Badge, Button, Text, Icon, ButtonGroup, useColorModeValue, Tooltip } from "@chakra-ui/react";
import Link from "next/link";
import { FiArrowRight, FiBell, FiShield } from "react-icons/fi";
import { LuDog } from "react-icons/lu";
import { MdLocationOn, MdStar, MdVerifiedUser } from "react-icons/md";
import { useToast } from "@chakra-ui/react";
import { AddToWishlistButton } from "lib/components/ui/AddToWishlistButton";
import { useCurrentUser } from "lib/hooks/queries/useAuth";
import { NotificationService } from "lib/services/notificationService";

interface BreederCardProps {
  breeder: any;
  showActions?: boolean;
}

export const BreederCard: React.FC<BreederCardProps> = ({ breeder, showActions = true }) => {
  const user = breeder;
  const breederProfile = user?.breeder_profiles ? user.breeder_profiles[0] : user;
  const toast = useToast();
  const { data: currentUser } = useCurrentUser();

  // Try to get userBreedId from breeder object (assuming first breed if multiple)
  const userBreedId = breeder.user_breeds?.[0]?.id;

  // Color mode values for dark mode support
  const textColor = useColorModeValue("gray.600", "gray.400");
  const starColor = useColorModeValue("gold", "yellow.400");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");

  const onSubscribe = async () => {
    if (!currentUser) return;

    try {
      await NotificationService.subscribeToBreeder(
        currentUser.id,
        breeder.id,
        breederProfile?.kennel_name || user?.display_name
      );
      toast({
        title: "Subscribed to breeder updates",
        description: `You will be notified when ${breederProfile?.kennel_name || user?.display_name} posts new content.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }
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

            <VStack align="start" spacing={1} flex="1">

              <HStack w="full" justifyContent="space-between">
                <Text fontWeight="semibold" fontSize="lg" noOfLines={2}>
                  {breederProfile?.kennel_name || user?.display_name}
                </Text>

                <Badge colorScheme="yellow" size="sm">
                  <HStack>
                    <Icon as={MdStar} color={starColor} />
                    <Text fontSize="sm">{breederProfile.rating?.toFixed(1)}</Text>
                  </HStack>
                </Badge>
              </HStack>

              {breederProfile?.kennel_location && (
                <HStack>
                  <MdLocationOn size={16} />
                  <Text fontSize="sm" color={textColor} noOfLines={1}>
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

          {showActions && (
            <ButtonGroup>

              <Tooltip label="Get notified when this breeder posts new content">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<FiBell />}
                  isDisabled={!currentUser}
                  title={!currentUser ? "Sign in to subscribe" : "Subscribe to breeder updates"}
                  onClick={onSubscribe}
                >
                  Subscribe
                </Button>
              </Tooltip>

              <Button
                size="sm"
                variant="primary"
                w="full"
                as={Link}
                href={`/dashboard/breeders/${breeder.id}`}
                rightIcon={<Icon as={FiArrowRight} />}
              >
                View Profile
              </Button>
            </ButtonGroup>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
};
