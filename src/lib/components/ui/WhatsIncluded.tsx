import {
  Box,
  Container,
  Stack,
  Text,
  Icon,
  Center,
  Button,
  Circle,
  HStack,
  Link,
  SimpleGrid,
  StackDivider,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { FaHeartbeat } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import { MdBlock, MdHighQuality } from "react-icons/md";

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
    name: "Quality Pedigree",
    description:
      "We have a strong pedigree and are committed to providing quality puppies with a clean bill of health. We're dedicated to providing you with a happy and healthy companion.",
    icon: MdHighQuality,
  },
];

const features = [
  "Up-to-date Vaccinations",
  "Up-to-date Dewormings",
  "Health Certificate",
  "Expert Advice",
  "24/7 Customer Support",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FeatureCard = (props: any) => {
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
      px={{
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
                We are here to support you every step of the way as you embark
                on this exciting journey.
              </Text>
            </Stack>
            <SimpleGrid
              as="ul"
              columns={{
                base: 1,
                lg: 1,
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
              as={Link}
              href="/signup"
            >
              Start Your Journey
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WhatsIncludedStep = (props: any) => {
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

const WhatsIncluded = () => {
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
            <Stack
              spacing={{
                base: "4",
                md: "8",
              }}
              justify="center"
              maxW={{ lg: "xl" }}
            >
              {steps.map((step, id) => (
                // eslint-disable-next-line react/no-array-index-key
                <WhatsIncludedStep key={id} step={step} />
              ))}
            </Stack>

            <FeatureCard />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default WhatsIncluded;
