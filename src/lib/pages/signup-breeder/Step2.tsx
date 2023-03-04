import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  ButtonGroup,
  Button,
  Spacer,
} from "@chakra-ui/react";
import { useState } from "react";

export const Step2 = ({ currentStep, setStep }: any) => {
  const [kennelName, setKennelName] = useState("");
  const [kennelLocation, setKennelLocation] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Stack as="form" spacing="5" mt="5" onSubmit={}>
      <Stack spacing="3">
        <FormControl id="name">
          <FormLabel htmlFor="name">Kennel Name</FormLabel>
          <Input
            required
            id="kennelName"
            name="kennelName"
            type="text"
            placeholder="Enter your kennel name"
            onChange={(e) => setKennelName(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="phone">Phone</FormLabel>
          <Input
            required
            id="location"
            name="location"
            placeholder="Enter you kennel's location"
            type="string"
            onChange={(event) => setKennelLocation(event?.target.value)}
          />
        </FormControl>
      </Stack>

      <ButtonGroup width="100%">
        <Button
          onClick={() => setStep(currentStep - 1)}
          isDisabled={currentStep === 0}
          variant="ghost"
        >
          Back
        </Button>
        <Spacer />
        <Button
          isLoading={loading}
          type="submit"
          isDisabled={currentStep >= 3}
          variant="primary"
        >
          Next
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
