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
    name: "Apartment Dogs",
    description: "Breeds well-suited for apartment living due to their calm nature and low exercise needs.",
    icon: MdApartment,
  },
  {
    name: "Family Dogs",
    description: "Breeds perfect for families with children as they are gentle, loving, and patient.",
    icon: GiFamilyHouse,
  },
  {
    name: "Guard Dogs",
    description: "Breeds naturally protective of their family and territory, making them great watchdogs.",
    icon: BsShieldShaded,
  },

  {
    name: "Hypoallergenic Dogs",
    description: "Breeds with low-shedding or single-layered coats, making them ideal for people with allergies.",
    icon: MdSick,
  },
];

export default function BreedTraits() {
  return (
    <Box as="section">
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
                Breeds
              </Text>
              <Heading size={{ base: "sm", md: "md" }}>
                Choose From 100+ Dog Breeds
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
              you&apos;re looking for an obedient family pet or a guard dog.
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
