import {
  Box,
  Container,
  Heading,
  Icon,
  SimpleGrid,
  Square,
  Stack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { FaDog, FaCat, FaDove } from "react-icons/fa";
import { GiRabbit } from "react-icons/gi";

const features = [
  {
    name: "Dogs",
    description: "Loyal companions for all lifestyles, from active protectors to gentle family friends.",
    icon: FaDog,
  },
  {
    name: "Cats",
    description: "Independent yet affectionate friends, perfect for apartment living and cozy homes.",
    icon: FaCat,
  },
  {
    name: "Rodents",
    description: "Small, low-maintenance pets highlighting unique personalities and gentle temperaments.",
    icon: GiRabbit,
  },
  {
    name: "Birds",
    description: "Intelligent and vibrant companions that bring melody and charm to your home.",
    icon: FaDove,
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
                  bg={mode("accent", "brand.500")}
                  color={mode("white", "white")}
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
