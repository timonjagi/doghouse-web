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
  const { loading, setLocation } = props;

  const onSubmit = (event) => {
    // check location
    // navigate to next step if location accepted
    // show error modal if not with option to add phone number to get notified when we expand to the area
    event.preventDefault();
    return false;
  };

  return (
    <Stack
      spacing="12"
      as="form"
      px={useBreakpointValue({ base: "8", lg: "16", xl: "32" })}
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
            required
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
