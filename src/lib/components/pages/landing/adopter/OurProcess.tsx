import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  Icon,
  Center,
  useBreakpointValue,
  Image,
} from "@chakra-ui/react";
import * as React from "react";
import { useState } from "react";
import { BsBookmarkHeartFill } from "react-icons/bs";
import { ImProfile } from "react-icons/im";
import { FaSearch } from "react-icons/fa";

export const steps = [
  {
    name: "Create your profile",
    description:
      "Tell us about your lifestyle, preferences, and what breed you're looking for to help us understand your unique needs",
    icon: ImProfile,
    image: "images/mockup.png",
  },
  {
    name: "Explore tailored matches.",
    description:
      "Discover a curated selection of pets from trusted breeders and shelters that align with your unique lifestyle and preferences. We'll help you find the perfect companion for you and your family",
    icon: FaSearch,
    image: "images/mockup.png",
  },
  {
    name: "Reserve your pet",
    description:
      "Secure your pet with a reservation fee to ensure both your commitment and the breeder's dedication to providing a loving home",
    icon: BsBookmarkHeartFill,
    image: "images/mockup.png",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProcessStep = (props: any) => {
  const { step, isActive, onClick, ...stackProps } = props;
  return (
    <Stack
      direction="row"
      spacing={{
        base: 4,
        lg: 4,
      }}
      cursor="pointer"
      onClick={onClick}
      transition="all 0.2s"
      opacity={isActive ? 1 : 0.6}
      _hover={{ opacity: 1 }}
      {...stackProps}
    >
      <Center
        color="ierted"
        flexShrink={0}
        boxSize={{
          base: 8,
          lg: 12,
        }}
        bg={isActive ? "brand.600" : "accent"}
        borderRadius="lg"
        fontSize={{
          base: "xl",
          lg: "2xl",
        }}
        transition="background-color 0.2s"
      >
        <Icon as={step.icon} fontSize="1.25rem" color="on-accent" />
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
          color={isActive ? "brand.600" : "inherit"}
          fontWeight="semibold"
        >
          {step.name}
        </Text>
        <Text color="muted" noOfLines={isActive ? undefined : 2}>{step.description}</Text>
      </Stack>
    </Stack>
  );
};

export const Process = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Box as="section" maxW="6xl">
      <Container
        pt="16"
        pb={{
          base: "16",
          md: "32",
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
              <Text color="accent" fontWeight="semibold">
                Process
              </Text>
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
              From personalized recommendations to secure reservations, we've got
              you covered at every step.
            </Text>
          </Stack>

          <Stack
            direction={{
              base: "column-reverse",
              lg: "row",
            }}
            spacing={{
              base: "12",
              lg: "24",
            }}
            w="full"
            align="center"
          >
            <Stack
              spacing={{
                base: "6",
                md: "10",
              }}
              flex="1"
            >
              {steps.map((step, id) => (
                <ProcessStep
                  key={id}
                  step={step}
                  isActive={activeStep === id}
                  onClick={() => setActiveStep(id)}
                />
              ))}
            </Stack>

            <Box flex="1" width="full" borderRadius="2xl" overflow="hidden" boxShadow="2xl">
              <Image
                src={steps[activeStep].image}
                alt={steps[activeStep].name}
                w="full"
                h="auto"
                transition="all 0.3s"
              />
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
