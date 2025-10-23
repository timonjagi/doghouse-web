import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
// import * as React from "react";

const stats = [
  {
    value: "150+",
    label: "Breeders",
  },
  {
    value: "80%",
    label: "Rehoming rate",
  },
  {
    value: "100+",
    label: "Happy customers",
  },
];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Stat = (props: any) => {
  const { label, value, ...stackProps } = props;
  return (
    <Stack spacing="3" textAlign="center" {...stackProps}>
      <Heading
        size={useBreakpointValue({
          base: "lg",
          md: "xl",
        })}
      >
        {value}
      </Heading>
      <Text fontSize="lg" fontWeight="medium" color="blue.50">
        {label}
      </Text>
    </Stack>
  );
};

export const Stats = () => (
  <Container>
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
        textAlign="center"
        align="center"
      >
        {/* /************* ✨ Windsurf Command 🌟 ************ */}
        <Heading
          size={useBreakpointValue({
            base: "sm",
            md: "md",
          })}
        >
          {" "}
          Our numbers speak for themselves
        </Heading>
        <Text
          fontSize={{
            base: "lg",
            md: "xl",
          }}
          color="muted"
          maxW="3xl"
        >
          We are proud of our large collection of reputable breeders, high
          rehoming rates and happy customers.
        </Text>
      </Stack>
      <Box
        bg="bg-accent"
        color="on-accent"
        borderRadius="2xl"
        px={{
          base: "6",
          md: "12",
          lg: "16",
        }}
        py={{
          base: "10",
          md: "12",
          lg: "16",
        }}
      >
        <SimpleGrid
          columns={{
            base: 1,
            md: 3,
          }}
          rowGap="8"
        >
          {stats.map((stat, id) => (
            // eslint-disable-next-line react/no-array-index-key
            <Stat key={id} {...stat} />
          ))}
        </SimpleGrid>
      </Box>
    </Stack>
  </Container>
);
