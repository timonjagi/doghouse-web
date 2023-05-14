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
import { BsCheckCircleFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import { GoListOrdered } from "react-icons/go";

export const features = [
  {
    name: "Select your breed",
    description:
      "Choose from over 200 breeds to find the right fit for you and your family's lifestyle.",
    icon: FaSearch,
  },
  {
    name: "Specify your needs & budget.",
    description:
      "Tell us what you're looking for in terms of size, age or temperament, as well as how much you're willing to spend on a new pup",
    icon: GoListOrdered,
  },
  {
    name: "Choose the right dog for you",
    description:
      "We'll send you offers from  reputable sellers with verified credentials that meet your criteria",
    icon: BsCheckCircleFill,
  },
];
export const product = {
  name: "Premium Service",
  price: "999",
  description: "We'll take care of everything",
  features: [
    "Priority listing",
    "Exclusive network",
    "Personalized recommendations",
    "Exclusive network",
    "Expert assistance",
    "Home delivery (where possible)",
  ],
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PricingCard = (props: any) => {
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
      <Stack spacing="8" divider={<StackDivider />}>
        <Stack
          spacing="6"
          px={{
            base: "6",
            md: "8",
          }}
        >
          <Stack spacing="1">
            <Text fontWeight="semibold">What&apos;s included</Text>
            <Text color="muted">
              Personalized assistance to help you find your perfect dog breed
              and make all necessary arrangements, with a satisfaction guarantee
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
            {product.features.map((feature, index) => (
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
    </Box>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PricingFeature = (props: any) => {
  const { feature, ...stackProps } = props;
  return (
    <Stack
      direction="row"
      spacing={{
        base: 4,
        lg: 5,
      }}
      {...stackProps}
    >
      <Center
        color="inverted"
        flexShrink={0}
        boxSize={{
          base: 10,
          lg: 12,
        }}
        bg="accent"
        borderRadius="lg"
        fontSize={{
          base: "xl",
          lg: "2xl",
        }}
      >
        <Icon as={feature.icon} fontSize="1.25rem" />
      </Center>
      <Stack
        spacing={{
          base: "1",
          lg: "2",
        }}
        pt={{
          base: "1.5",
          md: "2.5",
        }}
      >
        <Text
          fontSize={{
            base: "lg",
            lg: "xl",
          }}
          fontWeight="medium"
        >
          {feature.name}
        </Text>
        <Text color="muted">{feature.description}</Text>
      </Stack>
    </Stack>
  );
};

export const Pricing = () => (
  <Box as="section">
    <Container
      py={{
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
            Finding a quality dog breed can be difficult, but Doghouse makes it
            easy to find the perfect pup for your needs
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
              base: "10",
              md: "12",
            }}
            flex="1"
            justify="center"
          >
            {features.map((feature, id) => (
              // eslint-disable-next-line react/no-array-index-key
              <PricingFeature key={id} feature={feature} />
            ))}
          </Stack>
          <PricingCard flex="1" />
        </Stack>
      </Stack>
    </Container>
  </Box>
);
