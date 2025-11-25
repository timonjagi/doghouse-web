import { useColorModeValue, Select, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { RadioButton } from "./RadioButton";
import { RadioButtonGroup } from "./RadioButtonGroup";

const PetTypePicker = (state) => {
  return (
    <RadioGroup
      value={state.value}
      onChange={state.onChange}
      size="md"
      colorScheme="brand"
    >
      <Stack>
        <Radio value="dog">
          Dogs</Radio>
        <Radio value="cat">Cats</Radio>
      </Stack>


    </RadioGroup>
  )
};
export default PetTypePicker;