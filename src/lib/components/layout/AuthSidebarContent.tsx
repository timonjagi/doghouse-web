import {
  Avatar,
  AvatarGroup,
  Box,
  DarkMode,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
  Button,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { Logo } from "./Logo";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { BsTiktok } from "react-icons/bs";

interface AuthSidebarContentProps {
  role?: 'breeder' | 'seeker' | null;
}

export const AuthSidebarContent: React.FC<AuthSidebarContentProps> = ({ role }) => {
  if (role === 'breeder') {
    return <BreederSidebarContent />;
  }

  if (role === 'seeker') {
    return <SeekerSidebarContent />;
  }

  // Default content (no specific role)
  return <DefaultSidebarContent />;
};

const DefaultSidebarContent = () => {
  return (
    <DarkMode>
      <Flex direction="column" height="full" color="on-accent">
        <Flex flex="1" align="center">
          <Stack spacing="8">
            <Stack spacing="6">
              <Heading size={useBreakpointValue({ md: "lg", xl: "xl" })}>
                Find your perfect match
              </Heading>
              <Text fontSize="lg" maxW="md" fontWeight="medium">
                Create an account and get connected to our network of
                reputable breeders.
              </Text>
            </Stack>
            <HStack spacing="4">
              <AvatarGroup
                size="md"
                max={useBreakpointValue({ base: 2, lg: 5 })}
                borderColor="on-accent"
              >
                <Avatar
                  name="Ryan Florence"
                  src="https://bit.ly/ryan-florence"
                />
                <Avatar
                  name="Segun Adebayo"
                  src="https://bit.ly/sage-adebayo"
                />
                <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                <Avatar
                  name="Prosper Otemuyiwa"
                  src="https://bit.ly/prosper-baba"
                />
                <Avatar
                  name="Christian Nwamba"
                  src="https://bit.ly/code-beast"
                />
              </AvatarGroup>
              <Text fontWeight="medium">Join 1000+ users</Text>
            </HStack>
          </Stack>
        </Flex>
        <Flex align="center" h="24">
          <Text color="on-accent-subtle" fontSize="sm">
            © {new Date().getFullYear()} Pethouse Kenya. All rights reserved.
          </Text>
        </Flex>
      </Flex>
    </DarkMode>
  );
};

const BreederSidebarContent = () => {
  return (
    <DarkMode>
      <Flex direction="column" height="full" color="on-accent">
        <Logo color="on-accent" />

        <Flex flex="1" align="center">
          <Stack spacing="8">
            <Stack spacing="6">
              <Heading size={useBreakpointValue({ md: "lg", xl: "xl" })}>
                Start Your Breeding Journey
              </Heading>
              <Text fontSize="lg" maxW="md" fontWeight="medium">
                Join our network of verified breeders and connect with pet seekers
                looking for quality companions from your kennel.
              </Text>
            </Stack>

            <VStack spacing="4" align="start">
              <Text fontWeight="semibold">What you'll get:</Text>
              <VStack spacing="2" align="start">
                <Text>• Verified breeder status</Text>
                <Text>• Direct access to pet seekers</Text>
                <Text>• Secure payment processing</Text>
                <Text>• Marketing tools and support</Text>
              </VStack>
            </VStack>

            <HStack spacing="4">
              <AvatarGroup
                size="md"
                max={useBreakpointValue({ base: 2, lg: 3 })}
                borderColor="on-accent"
              >
                <Avatar name="Sarah K." src="https://bit.ly/sage-adebayo" />
                <Avatar name="Mike T." src="https://bit.ly/kent-c-dodds" />
                <Avatar name="Anna R." src="https://bit.ly/prosper-baba" />
              </AvatarGroup>
              <Text fontWeight="medium">500+ Verified Breeders</Text>
            </HStack>
          </Stack>
        </Flex>

        <Flex align="center" h="24">
          <Text color="on-accent-subtle" fontSize="sm">
            © {new Date().getFullYear()} Pethouse Kenya. All rights reserved.
          </Text>
        </Flex>
      </Flex>
    </DarkMode>
  );
};

const SeekerSidebarContent = () => {
  return (
    <DarkMode>
      <Flex direction="column" height="full" color="on-accent">
        <Logo color="on-accent" />

        <Flex flex="1" align="center">
          <Stack spacing="8">
            <Stack spacing="6">
              <Heading size={useBreakpointValue({ md: "lg", xl: "xl" })}>
                Find Your Perfect Pet Companion
              </Heading>
              <Text fontSize="lg" maxW="md" fontWeight="medium">
                Discover your ideal furry friend from our network of trusted
                breeders and shelters. Every pet is health-checked and ready for adoption.
              </Text>
            </Stack>

            <VStack spacing="4" align="start">
              <Text fontWeight="semibold">Why choose Pethouse:</Text>
              <VStack spacing="2" align="start">
                <Text>• Health-guaranteed pets</Text>
                <Text>• Direct breeder connections</Text>
                <Text>• Secure adoption process</Text>
                <Text>• Ongoing support</Text>
              </VStack>
            </VStack>

            <HStack spacing="4">
              <AvatarGroup
                size="md"
                max={useBreakpointValue({ base: 2, lg: 5 })}
                borderColor="on-accent"
              >
                <Avatar name="Emma W." src="https://bit.ly/ryan-florence" />
                <Avatar name="James L." src="https://bit.ly/sage-adebayo" />
                <Avatar name="Lisa M." src="https://bit.ly/kent-c-dodds" />
                <Avatar name="David K." src="https://bit.ly/prosper-baba" />
                <Avatar name="Maria S." src="https://bit.ly/code-beast" />
              </AvatarGroup>
              <Text fontWeight="medium">1000+ Happy Pet Parents</Text>
            </HStack>
          </Stack>
        </Flex>

        <Flex align="center" h="24">
          <Text color="on-accent-subtle" fontSize="sm">
            © {new Date().getFullYear()} Pethouse Kenya. All rights reserved.
          </Text>
        </Flex>
      </Flex>
    </DarkMode>
  );
};
