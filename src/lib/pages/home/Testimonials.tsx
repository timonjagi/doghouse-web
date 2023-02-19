import {
  Box,
  HStack,
  Grid,
  Heading,
  Text,
  Flex,
  Img,
  Stack,
  useColorModeValue as mode,
} from "@chakra-ui/react";
// import * as React from "react";
import { FaStar } from "react-icons/fa";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Rating = (props: any) => {
  const { value = 5, ...rest } = props;
  return (
    <HStack {...rest}>
      {Array.from({
        length: 5,
      }).map((_, i) => {
        const fade = i + 1 > value;
        return (
          <Box
            as={FaStar}
            color={fade ? "whiteAlpha.500" : "yellow.400"}
            fontSize="xl"
            // eslint-disable-next-line react/no-array-index-key
            key={i}
          />
        );
      })}
    </HStack>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Testimonial = (props: any) => {
  const { image, company, name, children, ...rest } = props;
  return (
    <Stack
      spacing={6}
      h="100%"
      rounded="2xl"
      shadow="sm"
      py={{
        base: "6",
        md: "12",
      }}
      px={{
        base: "6",
        md: "14",
      }}
      bg={mode("white", "gray.900")}
      color={mode("gray.800", "gray.300")}
      {...rest}
    >
      <Box
        fontSize={{
          base: "md",
          md: "lg",
        }}
        flex="1"
      >
        {children}
      </Box>
      <HStack
        spacing={{
          base: 3,
          md: 5,
        }}
      >
        <Img objectFit="cover" rounded="full" boxSize={14} src={image} />
        <Flex direction="column">
          <Text fontWeight="bold">{name}</Text>
          <Text fontSize="sm" fontWeight="medium" opacity={0.7}>
            {company}
          </Text>
        </Flex>
      </HStack>
    </Stack>
  );
};

export const Testimonials = () => {
  return (
    <Box as="section" bg="bg-accent" color="white" py="6rem" w="full">
      <Box
        maxW={{
          base: "xl",
          md: "7xl",
        }}
        mx="auto"
        px={{
          base: "6",
          md: "8",
        }}
        py="10"
      >
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "460px 1fr",
          }}
          gap={{
            base: "10",
            lg: "8",
          }}
        >
          <Box>
            <Text
              textTransform="uppercase"
              fontWeight="semibold"
              color="yellow.400"
              letterSpacing="wide"
            >
              Trusted by 1500+ dog lovers
            </Text>
            <Heading as="h3" size="3xl" mt="7" lineHeight="shorter">
              Hear from our customers
            </Heading>
            <Rating mt="10" value={4} />
            {/* <Text mt="4">
              <b>4.0/5</b> on <Link>Play Store</Link>
            </Text> */}
          </Box>
          <Box
            maxW={{
              base: "unset",
              lg: "37.5rem",
            }}
            mx="auto"
          >
            <Testimonial
              name="Joel"
              company="Nairobi, Kenya"
              image="https://images.unsplash.com/photo-1603610515737-193e0b423983?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mjk4fHxsYWR5JTIwaGVhZHNob3QlMjBzbWlsaW5nfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
            >
              Sed sed risus pretium quam vulputate dignissim. Ornare quam
              viverra orci sagittis. Integer vitae justo eget magna fermentum
              iaculis eu non diam
            </Testimonial>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};
