import { HStack, Image, Text } from "@chakra-ui/react";
import Link from "next/link";

interface LogoProps {
  color: 'on-accent' | 'on-brand';
}
export const Logo: React.FC<LogoProps> = ({ color }) => (
  <Link href="/">
    <HStack align="center">
      <Image src={color === 'on-accent' ? "/images/logo_white.png" : "images/logo_brand.png"} height={8} />
      {color === 'on-accent' && <Text fontWeight="semibold" fontSize="20pt" color="white">
        doghouse
      </Text>
      }
    </HStack>
  </Link>
);


const PethouseLogo: React.FC<LogoProps> = ({ color }) => {
  return (
    <Link href="/">
      <HStack align="center">
        <Image
          src={color === 'on-accent' ? "/images/pethouse-logo-icon-dark.png" : "images/pethouse-logo-icon-light.png"}
          height={12}
        />
        <Text
          fontWeight="semibold"
          fontSize="16pt"
          color={color === 'on-accent' ? "white" : ""}
          fontStyle=""

        >
          PETHOUSE
        </Text>
      </HStack>
    </Link >
  )
}