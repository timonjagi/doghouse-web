import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  Icon,
  Center,
  useBreakpointValue,
} from "@chakra-ui/react";
import * as React from "react";
import { useState, useEffect } from "react";
import { BsBookmarkHeartFill, BsCheckCircleFill } from "react-icons/bs";
import { ImProfile } from "react-icons/im";
import { FaSearch } from "react-icons/fa";
import { GalleryWithVerticalCarousel } from "../../../ui/GalleryWithVerticalCarousel/GalleryWithVerticalCarousel";

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
      "Discover a curated selection of pets from trusted breeders and shelters that align with your unique lifestyle and preferences. We'll help you find the perfect companion for you and your family",
    icon: FaSearch,
  },
  {
    name: "Reserve your pet",
    description:
      "Secure your pet with a reservation fee to ensure both your commitment and the breeder's dedication to providing a loving home",
    icon: BsBookmarkHeartFill,
  },
];

// Process step images for carousel
const processImages = [
  {
    id: "01",
    src: "images/mockup.png",
    alt: "Profile creation interface",
  },
  {
    id: "02",
    src: "images/mockup.png",
    alt: "Pet matching results",
  },
  {
    id: "03",
    src: "images/mockup.png",
    alt: "Pet reservation process",
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
      _hover={{ opacity: 0.8 }}
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
          fontWeight="semibold"
        >
          {step.name}
        </Text>
        <Text color="muted">{step.description}</Text>
      </Stack>
    </Stack>
  );
};

export const Process = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

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
              base: "column",
              lg: "row",
            }}
            spacing={{
              base: "12",
              lg: "24",
            }}
            w="full"
          >
            <Stack
              spacing={{
                base: "4",
                md: "8",
              }}
              justify="center"
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

            <Box width="full" overflow="hidden">
              <GalleryWithVerticalCarousel
                images={processImages}
                rootProps={{
                  spacing: { base: "4", md: "6" },
                  direction: { base: "column-reverse", md: "row" },
                }}
              />
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
