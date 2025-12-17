import {
  Box,
  Container,
  Heading,
  Icon,
  SimpleGrid,
  Square,
  Stack,
  Text,
} from "@chakra-ui/react";
import { BsShieldShaded } from "react-icons/bs";
import { GiFamilyHouse } from "react-icons/gi";
import { MdApartment, MdSick } from "react-icons/md";

const features = [
  {
    name: "Apartment Pets",
    description: "Perfect for apartment living with calm temperaments and low space requirements.",
    icon: MdApartment,
  },
  {
    name: "Family Pets",
    description: "Gentle and patient companions ideal for households with children.",
    icon: GiFamilyHouse,
  },
  {
    name: "Protective Pets",
    description: "Naturally vigilant and protective, great for security and companionship.",
    icon: BsShieldShaded,
  },
  {
    name: "Hypoallergenic Pets",
    description: "Low-shedding or hairless breeds perfect for people with allergies.",
    icon: MdSick,
  },
];

export default function BreedTraits() {
  return (
    <Box as="section" maxW="5xl">
      <Container
        py={{
          base: "8",
          md: "16",
        }}
      >
        <Stack
          spacing={{
            base: "12",
            md: "16",
          }}
        >
          <Stack
            spacing={{
              base: "4",
              md: "5",
            }}
            align="center"
            textAlign="center"
          >
            <Stack spacing="3">
              <Text
                fontSize={{
                  base: "sm",
                  md: "md",
                }}
                fontWeight="semibold"
                color="accent"
              >
                Pet Traits
              </Text>
              <Heading size={{ base: "sm", md: "md" }}>
                Find Your Perfect Pet Match
              </Heading>
            </Stack>
            <Text
              color="muted"
              fontSize={{
                base: "lg",
                md: "xl",
              }}
              maxW="3xl"
            >
              We are passionate about matching you with the right pet, whether
              you're looking for a calm apartment companion or an energetic family friend.
            </Text>
          </Stack>
          <SimpleGrid
            columns={{
              base: 2,
              lg: 4,
            }}
            columnGap={{ base: 8, md: 16 }}
            rowGap={{
              base: 10,
              md: 16,
              lg: 24
            }}
          >
            {features.map((feature) => (
              <Stack
                key={feature.name}
                spacing={{
                  base: "4",
                  md: "5",
                }}
                align="center"
                textAlign="center"
              >
                <Square
                  size={{
                    base: "32",
                    lg: "48",
                  }}
                  bg="accent"
                  color="inverted"
                  borderRadius="lg"
                >
                  <Icon
                    as={feature.icon}
                    boxSize={{
                      base: "16",
                      lg: "24",
                    }}
                  />
                </Square>
                <Stack
                  spacing={{
                    base: "2",
                    md: "2",
                  }}
                >
                  <Text
                    fontSize={{
                      base: "lg",
                      lg: "xl",
                    }}
                    fontWeight="semibold"
                  >
                    {feature.name}
                  </Text>
                  <Text color="muted">{feature.description}</Text>
                </Stack>
              </Stack>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}
