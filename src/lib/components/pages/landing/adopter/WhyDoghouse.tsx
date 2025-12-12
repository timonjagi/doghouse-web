import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  Icon,
  Center,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaHeartbeat } from "react-icons/fa";
import { MdBlock, } from "react-icons/md";
import { GrUserExpert } from "react-icons/gr";
import { FeatureCard } from "./FeatureCard";
import { FiCheck } from "react-icons/fi";

export const steps = [
  {
    name: "Health Guarantee",
    description:
      "Our health guarantee ensures that every puppy is thoroughly vetted and comes with a clean bill of health. We're committed to providing you with a happy and healthy companion.",
    icon: FaHeartbeat,
  },
  {
    name: "No Puppy Mills",
    description:
      "We're dedicated to animal welfare and only work with reputable breeders who prioritize the health and well-being of their puppies. No puppy mills or irresponsible breeding practices here!",
    icon: MdBlock,
  },
  {
    name: "Expert Advice",
    description:
      "Our expert team of dog experts will provide you with personalized advice on the best breed for you, your lifestyle, and your needs. We're here to guide you every step of the way.",
    icon: GrUserExpert,
  },
];

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

const WhyDoghouse = () => {
  return (
    <Box as="section" py={{ base: "6", md: "8", lg: "16" }} maxW="6xl">
      <Container pt="16"
        pb={{
          base: "16",
          md: "32",
        }}>
        <Stack
          spacing={{
            base: "8",
            md: "16",
          }}
          maxW="7xl"
        >
          <Stack spacing="3" textAlign="center">
            <Text color="accent" fontWeight="semibold">
              Benefits
            </Text>
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
              maxW="3xl"
            >
              Finding a quality dog breed can be difficult, but Pethouse makes
              it easy to find the perfect pup for your needs
            </Text>
          </Stack>
          <Stack
            direction={{
              base: "column",
              md: "row",
            }}
            spacing={{
              base: "0",
              lg: "24",
            }}
            justify="center"
          >
            {/* <Gallery rootProps={{ overflow: 'hidden', }} images={images} /> */}

            <Stack
              spacing={{
                base: "4",
                md: "8",
              }}
              justify="center"
              maxW="xl"
            >
              {steps.map((step, id) => (
                // eslint-disable-next-line react/no-array-index-key
                <WhyStep key={id} step={step} />
              ))}
            </Stack>

            <FeatureCard
              title="What's Included"
              description="Personalized assistance to help you find your perfect dog and make all necessary arrangements, with a satisfaction guarantee"
              icon={FiCheck}
              features={features}
            /
            >

          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default WhyDoghouse;
