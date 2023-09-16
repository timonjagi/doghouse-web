import {
  Box,
  Container,
  Heading,
  Stack,
  HStack,
  Text,
  Button,
  Circle,
  Icon,
  SimpleGrid,
  StackDivider,
  Center,
  useBreakpointValue,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
// import * as React from "react";
import { BsBookmarkHeartFill, BsCheckCircleFill } from "react-icons/bs";
import { ImProfile } from "react-icons/im";
import { FaSearch } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import { GoListOrdered } from "react-icons/go";

export const steps = [
  {
    name: "Create your profile",
    description:
      "Tell us about your lifestyle, preferences, and what breed you're looking for to help us understand your unique needs",
    icon: ImProfile,
  },
  {
    name: "Explore tailored matches.",
    description:
      "Explore a curated list of breeds that align perfectly with your lifestyle and preferences",
    icon: FaSearch,
  },
  {
    name: "Connect with breeders",
    description:
      "Get personalized offers from reputable breeders based on your preferences and choose the perfect pet for your needs",
    icon: GoListOrdered,
  },
  {
    name: "Reserve your pet",
    description:
      "Secure your pet with a reservation fee to ensure both your commitment and the breeder's dedication to providing a loving home",
    icon: BsBookmarkHeartFill,
  },
  // {
  //   name: "Confirm your Adoption",
  //   description:
  //     "Once the details are settled, welcome your new family member into your loving home. Your journey with Doghouse begins here.",
  //   icon: BsBookmarkHeartFill,
  // },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProcessStep = (props: any) => {
  const { step, ...stackProps } = props;
  return (
    <Stack
      direction="row"
      spacing={{
        base: 4,
        lg: 4,
      }}
      {...stackProps}
    >
      <Center
        color="inverted"
        flexShrink={0}
        boxSize={{
          base: 8,
          lg: 12,
        }}
        bg="accent"
        borderRadius="lg"
        fontSize={{
          base: "xl",
          lg: "2xl",
        }}
      >
        <Icon as={step.icon} fontSize="1.25rem" />
      </Center>
      <Stack
        spacing={{
          base: "1",
          lg: "2",
        }}
      >
        <Text
          fontSize={{
            base: "lg",
            lg: "xl",
          }}
          fontWeight="semibold"
        >
          {step.name}
        </Text>
        <Text color="muted">{step.description}</Text>
      </Stack>
    </Stack>
  );
};

const features = [
  "Breed Recommendations",
  "Tailored Matches",
  "Personalized Offers",
  "Secure Reservations",
  "Exclusive Network",
  "Community Support",
  "Expert Advice",
  "24/7 Customer Support",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FeatureCard = (props: any) => {
  const router = useRouter();
  return (
    <Box
      bg="bg-surface"
      borderRadius="2xl"
      boxShadow={mode("lg", "lg-dark")}
      maxW={{
        lg: "576px",
      }}
      py={{
        base: "6",
        lg: "8",
      }}
      {...props}
    >
      <Stack
        spacing={{
          base: "4",
          lg: "8",
        }}
        justify="space-between"
        align={{
          base: "start",
          lg: "center",
        }}
        px={{
          base: "6",
          md: "8",
        }}
      >
        {/* <Stack spacing="1">
          <Heading size="xs">Welcome Your New Family Member</Heading>

          <Text color="muted">
            Our community is here to support you every step of the way as you
            embark on this exciting journey together.
          </Text>
        </Stack> */}

        <Stack spacing="8" divider={<StackDivider />}>
          <Stack spacing="6">
            <Stack spacing="1">
              <Text
                fontSize={{
                  base: "lg",
                  lg: "xl",
                }}
                fontWeight="semibold"
              >
                What&apos;s included
              </Text>
              <Text color="muted">
                Personalized assistance to help you find your perfect dog and
                make all necessary arrangements, with a satisfaction guarantee
              </Text>
            </Stack>
            <SimpleGrid
              as="ul"
              columns={{
                base: 1,
                lg: 2,
              }}
              columnGap="8"
              rowGap="4"
              pb="2"
            >
              {features.map((feature, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <HStack key={index} as="li" spacing="3">
                  <Circle size="6" bg={mode("blue.50", "whiteAlpha.50")}>
                    <Icon as={FiCheck} color="accent" />
                  </Circle>
                  <Text color="muted">{feature}</Text>
                </HStack>
              ))}
            </SimpleGrid>
          </Stack>

          <Box
            px={{
              base: "6",
              md: "8",
            }}
            pb="2"
          >
            <Button
              variant="primary"
              size="lg"
              width="full"
              rounded="full"
              onClick={() => router.push("/breeds")}
            >
              Get started
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export const Process = () => (
  <Box as="section">
    <Container
      py={{
        base: "8",
        md: "16",
      }}
    >
      <Stack
        spacing={{
          base: "8",
          md: "16",
        }}
      >
        <Stack
          spacing={{
            base: "4",
            md: "6",
          }}
        >
          <Stack spacing="3">
            {/* <Text color="accent" fontWeight="semibold">
              Pricing
            </Text> */}
            <Heading
              size={useBreakpointValue({
                base: "md",
                md: "lg",
              })}
            >
              How it works
            </Heading>
          </Stack>
          <Text
            fontSize={{
              base: "lg",
              md: "xl",
            }}
            color="muted"
            maxW="3xl"
          >
            {/* Finding a quality dog breed can be difficult, but Doghouse makes it
            easy to find the perfect pup for your needs */}
            We connect you with responsible breeders who are passionate about
            matching you with the right pet. From personalized recommendations
            to secure reservations, we've got you covered at every step.
          </Text>
        </Stack>
        <Stack
          direction={{
            base: "column",
            md: "row",
          }}
          spacing={{
            base: "12",
            lg: "24",
          }}
        >
          <Stack
            spacing={{
              base: "4",
              md: "8",
            }}
            flex="1"
            justify="center"
          >
            {steps.map((step, id) => (
              // eslint-disable-next-line react/no-array-index-key
              <ProcessStep key={id} step={step} />
            ))}
          </Stack>
          <FeatureCard flex="1" />
        </Stack>
      </Stack>
    </Container>
  </Box>
);
