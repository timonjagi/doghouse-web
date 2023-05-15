import { HStack, Image, Text } from "@chakra-ui/react";
import Link from "next/link";

export const Logo = () => (
  <Link href="/">
    <HStack>
      <Image src="images/logo_white.png" height={8} />
      <Text fontWeight="semibold" fontSize="20pt">
        doghouse
      </Text>
    </HStack>
  </Link>
);
