import { Box, Stack, StackDivider, SimpleGrid, HStack, Circle, Icon, Button, Text, useColorModeValue as mode } from "@chakra-ui/react";
import { features } from "lib/components/ui/WhatsIncluded2";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiCheck } from "react-icons/fi";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
}

export const FeatureCard = (props: FeatureCardProps) => {
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
                {props.title}
              </Text>
              <Text color="muted">
                {props.description}
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
              {props.features.length && props.features.map((feature, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <HStack key={index} as="li" spacing="3">
                  <Circle size="6" bg={mode("brand.50", "whiteAlpha.50")}>
                    <Icon as={props.icon} color="accent" />
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