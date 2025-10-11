import {
  Box,
  ButtonGroup,
  Container,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

import { Logo } from "./Logo";
import { BsTiktok } from "react-icons/bs";

const Footer = () => (
  <Box bg="bg-accent" color="on-accent">
    <Container as="footer" role="contentinfo" py={{ base: "12", md: "16" }}>
      <Stack spacing={{ base: "4", md: "5" }}>
        <Stack justify="space-between" direction="row" align="center">
          <Logo />
          <ButtonGroup variant="ghost-on-accent">
            <IconButton
              as="a"
              href="https://www.facebook.com/profile.php?id=100012765483528"
              aria-label="Facebook"
              icon={<FaFacebook fontSize="1.25rem" />}
            />
            <IconButton
              as="a"
              href="https://instagram.com/doghousekenya"
              aria-label="Instagram"
              icon={<FaInstagram fontSize="1.25rem" />}
            />
            <IconButton
              as="a"
              href="https://twitter.com/doghousekenya"
              aria-label="Twitter"
              icon={<FaTwitter fontSize="1.25rem" />}
            />
            <IconButton
              as="a"
              href="https://tiktok.com/@doghousekenya"
              aria-label="Tiktok"
              icon={<BsTiktok fontSize="1.25rem" />}
            />
          </ButtonGroup>
        </Stack>
        <Text fontSize="sm" color="on-accent-subtle">
          &copy; {new Date().getFullYear()} Doghouse Kenya. All rights reserved.
        </Text>
      </Stack>
    </Container>
  </Box>
);

export default Footer;
