import { Box, VStack, Heading, HStack, IconButton, Text } from "@chakra-ui/react"
import { BsTiktok } from "react-icons/bs"
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"

export const Socials = () => {
  return (
    <Box p={{ base: 6, md: 8 }} borderRadius="lg" shadow="sm">
      <VStack spacing={6} align="stretch">
        <Heading size={{ base: "md", md: "lg" }} textAlign="center">
          Connect With Us
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="muted" textAlign="center">
          Follow us on social media for the latest updates, adorable puppy photos, and helpful tips
        </Text>

        <HStack spacing={4} justify="center">
          <IconButton
            as="a"
            href="https://www.facebook.com/profile.php?id=100012765483528"
            aria-label="Facebook"
            icon={<FaFacebook />}
            size="lg"
            colorScheme="facebook"
            variant="outline"
            _hover={{ transform: "scale(1.1)" }}
            transition="all 0.2s"
          />
          <IconButton
            as="a"
            href="https://instagram.com/doghousekenya"
            aria-label="Instagram"
            icon={<FaInstagram />}
            size="lg"
            colorScheme="pink"
            variant="outline"
            _hover={{ transform: "scale(1.1)" }}
            transition="all 0.2s"
          />
          <IconButton
            as="a"
            href="https://twitter.com/doghousekenya"
            aria-label="Twitter"
            icon={<FaTwitter />}
            size="lg"
            colorScheme="twitter"
            variant="outline"
            _hover={{ transform: "scale(1.1)" }}
            transition="all 0.2s"
          />
          <IconButton
            as="a"
            href="https://tiktok.com/@doghousekenya"
            aria-label="TikTok"
            icon={<BsTiktok />}
            size="lg"
            colorScheme="gray"
            variant="outline"
            _hover={{ transform: "scale(1.1)" }}
            transition="all 0.2s"
          />
        </HStack>
      </VStack>
    </Box>
  )
}