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
import { GiDogHouse } from "react-icons/gi";
import { FiUserCheck, FiCreditCard } from "react-icons/fi";

export const steps = [
  {
    name: "Kennel & Shelter Management",
    description:
      "All-in-one platform to manage your listings, adoptions, and communications with ease.",
    icon: GiDogHouse,
  },
  {
    name: "Verified Seekers",
    description:
      "We pre-screen and verify potential adopters to ensure your pets are going to responsible, loving homes.",
    icon: FiUserCheck,
  },
  {
    name: "Secure Transactions",
    description:
      "Our secure payment system handles deposits and Final payments, protecting both you and the adopter.",
    icon: FiCreditCard,
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
              Whether you're a professional breeder or a dedicated shelter, Pethouse provides the tools you need to manage your animals and find them the perfect homes.
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

            <Box width="full" overflow="hidden">
              <Image
                maxW="100%"
                minH={{ base: '100%', lg: '560px' }}
                objectFit="cover"
                src="images/breeds/doghousekenya_curly_coated_retriever_1.jpg"
                alt="Pethouse"
              />
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default WhyDoghouse;
