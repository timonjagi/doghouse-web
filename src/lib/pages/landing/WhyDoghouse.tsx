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
import { FaHeartbeat } from "react-icons/fa";
import { MdBlock, MdFindInPage } from "react-icons/md";

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
    name: "Personalized Offers",
    description:
      "Receive tailored recommendations from trusted breeders, and find your ideal furry companion with ease. Our personalized offers make the adoption process simple and stress-free.",
    icon: MdFindInPage,
  },
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
    <Box as="section" py={{ base: "6", md: "8", lg: "16" }}>
      <Container>
        <Stack
          spacing={{
            base: "8",
            md: "16",
          }}
          maxW="7xl"
        >
          <Stack spacing="3" textAlign="center">
            {/* <Text color="accent" fontWeight="semibold">
              Pricing
            </Text> */}
            <Heading
              size={useBreakpointValue({
                base: "sm",
                md: "md",
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
              Finding a quality dog breed can be difficult, but Doghouse makes
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
              maxW={{ lg: "3xl" }}
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
};

export default WhyDoghouse;
