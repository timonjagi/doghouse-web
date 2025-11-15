import type { StackProps } from "@chakra-ui/react";
import {
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { BiCheckShield, BiPackage } from "react-icons/bi";
import { FaStar } from "react-icons/fa";
import { Ri24HoursLine } from "react-icons/ri";

import { Share } from "lib/components/ui/Share";
import type { Breed } from "lib/models/breed";

interface RatingProps {
  score?: number;
  max?: number;
  size?: "sm" | "md" | "lg" | "xl";
  rootProps?: StackProps;
}

export const Rating = (props: RatingProps) => {
  const { score = 0, max = 5, size = "md", rootProps } = props;
  const color = useColorModeValue("gray.200", "gray.600");
  const activeColor = useColorModeValue("blue.500", "blue.200");
  return (
    <HStack spacing="0.5" {...rootProps}>
      {Array.from({ length: max })
        .map((_, index) => index + 1)
        .map((index) => (
          <Icon
            key={index}
            as={FaStar}
            fontSize={size}
            color={index <= score ? activeColor : color}
          />
        ))}
    </HStack>
  );
};

export const BreedInfo = ({ breed }: { breed: Breed }) => {
  const breedTraits = [
    {
      icon: BiPackage,
      text: `${breed.breedGroup} Group`,
    },
    {
      icon: BiPackage,
      text: breed.height,
    },
    {
      icon: BiCheckShield,
      text: breed.weight,
    },
    {
      icon: Ri24HoursLine,
      text: breed.lifeSpan,
    },
  ];

  const color = useColorModeValue("gray.600", "gray.300");
  return (
    <Stack flex="1" spacing="6">
      <HStack justifyContent="space-between">
        <Stack>
          <Heading
            size={useBreakpointValue({ base: "sm", md: "md" })}
            textTransform="capitalize"
          >
            {breed.name}
          </Heading>
        </Stack>
        <Share />
      </HStack>

      <Text color={color}>{breed.description}</Text>

      <Text
        fontSize={{
          base: "lg",
          lg: "xl",
        }}
        fontWeight="semibold"
      >
        Breed Info
      </Text>

      <Stack spacing="4" px="6" bg={useColorModeValue("gray.50", "gray.700")}>
        {breedTraits.map((trait) => (
          <HStack key={trait.text} spacing="3" color={color}>
            <Icon as={trait.icon} fontSize="xl" />
            <Text>{trait.text}</Text>
          </HStack>
        ))}
      </Stack>

      <Text
        fontSize={{
          base: "lg",
          lg: "xl",
        }}
        fontWeight="semibold"
      >
        Characteristics
      </Text>

      <Stack spacing="2" px="6" bg={useColorModeValue("gray.50", "gray.700")}>
        {breed.traits &&
          breed.traits.map((group) => (
            <HStack
              flex={1}
              justifyContent="space-between"
              alignItems="center"
              key={group.name}
            >
              <Text fontSize={{ base: "sm", md: "md" }} color={color}>
                {group.name}
              </Text>
              <HStack gap="$2" alignItems="center">
                <Rating score={group.score} />
              </HStack>
            </HStack>
          ))}
      </Stack>
    </Stack>
  );
};
