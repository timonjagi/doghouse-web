import {
  Box,
  Container,
  Heading,
  Icon,
  SimpleGrid,
  Square,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import * as React from "react";
import { BsChatFill } from "react-icons/bs";
import { GiDogHouse } from "react-icons/gi";
import { MdNotificationsActive } from "react-icons/md";

const features = [
  {
    name: "200+ Breeders",
    description:
      "Thousands of high-quality dogs from hundreds of reputable dog breeders near you.",
    icon: GiDogHouse,
  },
  {
    name: "Instant Notifications",
    description:
      "Get notified instantly when breeders send you a personalized offers that match what you're looking for",
    icon: MdNotificationsActive,
  },
  {
    name: "In-app Chat",
    description:
      "Talk directly with local dog breeders who are offering their puppies at competitive prices",
    icon: BsChatFill,
  },

  // {
  //   name: 'Themeable',
  //   description:
  //     "Your style. Your blue. Customize the components as you need them. It's that simple.",
  //   icon: FaPaintBrush,
  // },
  // {
  //   name: 'Fully Responsive',
  //   description:
  //     'Responsive components that look great on mobile, tablet and desktop.',
  //   icon: FaExpandAlt,
  // },
  // {
  //   name: 'Accessible',
  //   description:
  //     "Accessibility first. That's why we pay attention to accessibility right from the start.",
  //   icon: FaAccessibleIcon,
  // },
];

export default function Features() {
  return (
    <Box as="section">
      <Container
        pt={{
          base: "16",
          md: "24",
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
              {/* <Text
                fontSize={{
                  base: "sm",
                  md: "md",
                }}
                fontWeight="semibold"
                color="accent"
              >
                Features
              </Text> */}
              <Heading
                size={useBreakpointValue({
                  base: "sm",
                  md: "md",
                })}
              >
                Find your perfect match
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
              Whether you're looking for an obedient family pet or a guard dog,
              find your perfect match on our app by selecting the type of breed
              that suits you best.
            </Text>
          </Stack>
          <SimpleGrid
            columns={{
              base: 1,
              md: 2,
              lg: 3,
            }}
            columnGap={8}
            rowGap={{
              base: 10,
              md: 16,
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
                    base: "10",
                    md: "12",
                  }}
                  bg="accent"
                  color="inverted"
                  borderRadius="lg"
                >
                  <Icon
                    as={feature.icon}
                    boxSize={{
                      base: "5",
                      md: "6",
                    }}
                  />
                </Square>
                <Stack
                  spacing={{
                    base: "1",
                    md: "2",
                  }}
                >
                  <Text
                    fontSize={{
                      base: "lg",
                      md: "xl",
                    }}
                    fontWeight="medium"
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
