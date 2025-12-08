import { Select, Stack, FormLabel } from "@chakra-ui/react";

interface PetTypePickerProps {
  value: any;
  onChange: any;
  options?: any;
}

const PetTypePicker = (value: any, onChange: any, options?: any) => {
  return (

    <Stack>
      <FormLabel fontWeight="semibold" as="legend" mb="0">
        Pet Type
      </FormLabel>
      <Select
        placeholder="Select Pet Type"
        value={value}
        onChange={(v) => onChange([v.target.value])}
      >
        {options?.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </Stack>
  )
};
export default PetTypePicker;