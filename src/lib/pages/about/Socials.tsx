import { Box, VStack, Heading, HStack, IconButton, Text, Center, useBreakpointValue } from "@chakra-ui/react"
import { BsTiktok } from "react-icons/bs"
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa"

export const Socials = () => {
  const socials = [
    {
      name: "Whatsapp",
      icon: <FaWhatsapp size={24} />,
      href: "https://www.facebook.com/profile.php?id=100012765483528"
    },
    {
      name: "Facebook",
      icon: <FaFacebook size={24} />,
      href: "https://www.facebook.com/profile.php?id=100012765483528"
    },
    {
      name: "Instagram",
      icon: <FaInstagram size={24} />,
      href: "https://instagram.com/doghousekenya"
    },
    {
      name: "(X) Twitter",
      icon: <FaTwitter size={24} />,
      href: "https://x.com/doghousekenya"
    },
    {
      name: "TikTok",
      icon: <BsTiktok size={24} />,
      href: "https://www.tiktok.com/@doghousekenya"
    }
  ]
  return (
    <Box p={{ base: 6, md: 8 }} borderRadius="lg" shadow="sm">
      <VStack spacing={6} align="stretch">
        <Heading size={useBreakpointValue({ base: "md", md: "lg" })} textAlign="center">
          Connect With Us
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="muted" textAlign="center">
          Follow us on social media for the latest updates, adorable puppy photos, and helpful tips
        </Text>

        <HStack spacing={4} justify="center">
          {socials.map((social) => (
            <IconButton
              key={social.name}
              as="a"
              href={social.href}
              aria-label="Facebook"
              icon={social.icon}
              _hover={{ transform: "scale(1.1)" }}
              transition="all 0.2s"
              bg="accent"
              borderRadius="lg"
              colorScheme="brand"
              size="xl"
            />
          ))}

        </HStack>
      </VStack>
    </Box>
  )
}