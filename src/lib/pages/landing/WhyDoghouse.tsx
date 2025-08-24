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
  Link,
  useBreakpointValue,
  useColorModeValue as mode,
  AspectRatio,
  Skeleton,
  Image
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
    name: "Health Guarantee",
    description:
      "Tell us about your lifestyle, preferences, and what breed you're looking for to help us understand your unique needs",
    icon: ImProfile,
  },
  {
    name: "No Puppy Mills",
    description:
      "Explore a curated list of breeds that align perfectly with your lifestyle and preferences",
    icon: FaSearch,
  },
  {
    name: "",
    description:
      "Get personalized offers from reputable breeders based on your preferences and choose the perfect pet for your needs",
    icon: GoListOrdered,
  },
  // {
  //   name: "Reserve your pet",
  //   description:
  //     "Secure your pet with a reservation fee to ensure both your commitment and the breeder's dedication to providing a loving home",
  //   icon: BsBookmarkHeartFill,
  // },
  // {
  //   name: "Confirm your Adoption",
  //   description:
  //     "Once the details are settled, welcome your new family member into your loving home. Your journey with Doghouse begins here.",
  //   icon: BsBookmarkHeartFill,
  // },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WhyStep = (props: any) => {
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

const WhyDoghouse = () => (
  <Box as="section" py={{ base: "6", md: "8", lg: "16" }}>
    <Container
      py="sm"
    >
      <Stack
        spacing={{
          base: "8",
          md: "16",
        }}
      >
        <Stack
          spacing={{
            base: "8",
            md: "6",
          }}
        >
          <Stack spacing="3" textAlign="center">
            {/* <Text color="accent" fontWeight="semibold">
              Pricing
            </Text> */}
            <Heading
              size={useBreakpointValue({
                base: "md",
                md: "lg",
              })}
            >
              Why Choose Us?
            </Heading>

            <Text
              fontSize={{
                base: "lg",
                md: "xl",
              }}
              color="muted"

            >
              Finding a quality dog breed can be difficult, but Doghouse makes it
              easy to find the perfect pup for your needs

            </Text>
          </Stack>

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
          <Box
            position="relative"
            w="auto"
            h="auto"
            borderRadius="xl"
          >
            <Image
              src="images/breeds/golden_retriever/doghousekenya_golden_retriever_3.webp"
              alt="Golden Retriever"
              fallback={<Skeleton />}
              width="full"
              height={{
                base: "auto",
                md: "lg",
              }}
              objectFit="contain"
              borderRadius="lg"
            />

          </Box>
          <Stack
            spacing={{
              base: "8",
              md: "16",
            }}
            flex="1"
            justify="center"

          >

            {steps.map((step, id) => (
              // eslint-disable-next-line react/no-array-index-key
              <WhyStep key={id} step={step} />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  </Box>
);

export default WhyDoghouse;