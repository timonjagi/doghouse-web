import {
  Stack,
  Heading,
  useBreakpointValue,
  HStack,
  InputGroup,
  InputLeftElement,
  Icon,
  Input,
  Button,
  useBreakpoint,
} from "@chakra-ui/react";
import { MdLocationPin, MdOutlineChevronRight } from "react-icons/md";

export const LocationCheck = (props) => {
  const { loading, setLocation, onSubmit } = props;

  return (
    <Stack
      spacing="12"
      as="form"
      px={useBreakpointValue({ base: "8", md: "16", xl: "32" })}
      onSubmit={onSubmit}
    >
      <Heading size={useBreakpointValue({ base: "lg", lg: "xl" })}>
        First let's make sure we serve your area
      </Heading>

      <HStack>
        <InputGroup size="lg">
          <InputLeftElement pointerEvents="none" color="brand.500">
            <Icon as={MdLocationPin} h="6" w="6" />
          </InputLeftElement>
          <Input
            placeholder="Enter your location"
            onChange={(event) => setLocation(event?.target.value)}
          />
          {/* <InputRightAddon children=".com" /> */}
        </InputGroup>

        <Button size="lg" isLoading={loading} type="submit" variant="primary">
          <Icon as={MdOutlineChevronRight} w="8" h="8" />
        </Button>
      </HStack>
    </Stack>
  );
};
