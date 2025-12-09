import { HStack, Image, Text } from "@chakra-ui/react";
import Link from "next/link";

interface LogoProps {
  color: 'on-accent' | 'on-brand';
}
export const DoghouseLogo: React.FC<LogoProps> = ({ color }) => {

  const logo = color === 'on-accent' ? "../../../../../images/logo_white.png" : "../../../../../images/logo_brand.png";

  return (
    <Link href="/">
      <HStack align="center">
        <Image src={logo} height={8} fallbackSrc="images/logo_brand.png" />
        {color === 'on-accent' && <Text fontWeight="semibold" fontSize="20pt" color="white">
          pethouse
        </Text>
        }
      </HStack>
    </Link>
  )
}


export const Logo: React.FC<LogoProps> = ({ color }) => {
  const logo = color === 'on-accent' ? "../../../../../images/pethouse-logo-icon-dark.png" : "../../../../../images/pethouse-logo-icon-light.png";
  const logoText = color === 'on-accent' ? "white" : "";
  return (
    <Link href="/">
      <HStack align="center">
        <Image
          src={logo}
          height={12}
          fallbackSrc={logo}
        />
        <Text
          fontWeight="medium"
          fontSize="12pt"
          color={logoText}
          fontStyle=""

        >
          PETHOUSE
        </Text>
      </HStack>
    </Link >
  )
}