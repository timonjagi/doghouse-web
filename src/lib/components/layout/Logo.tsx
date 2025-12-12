import { HStack, Image, Text, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";

interface LogoProps {
  color: 'on-accent' | 'on-brand';
}
export const DoghouseLogo: React.FC<LogoProps> = ({ color }) => {
  const logo = useColorModeValue(
    "../../../../../images/logo_brand.png",
    "../../../../../images/logo_white.png"
  );

  return (
    <Link href="/">
      <HStack align="center">
        <Image src={logo} height={8} fallbackSrc="images/logo_brand.png" />
        <Text fontWeight="semibold" fontSize="20pt" color={useColorModeValue("gray.900", "white")}>
          pethouse
        </Text>
      </HStack>
    </Link>
  )
}


export const Logo: React.FC<LogoProps> = ({ color }) => {
  const logo = useColorModeValue(
    "../../../../../images/pethouse-logo-icon-light.png",
    "../../../../../images/pethouse-logo-icon-dark.png"
  );
  const logoTextColor = useColorModeValue("gray.900", "white");

  return (
    <Link href="/">
      <HStack align="center">
        <Image
          src={logo}
          height={12}
          fallbackSrc="../../../../../images/pethouse-logo-icon-light.png"
        />
        <Text
          fontWeight="medium"
          fontSize="12pt"
          color={logoTextColor}
          fontStyle=""
        >
          PETHOUSE
        </Text>
      </HStack>
    </Link >
  )
}
