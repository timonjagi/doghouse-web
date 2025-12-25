import { Select, Stack, FormLabel } from "@chakra-ui/react";

interface PetTypePickerProps {
  value: string | string[];
  onChange: (value: any) => void;
  options?: { label: string; value: string }[];
  label?: string;
  hideLabel?: boolean;
}

const DEFAULT_PET_TYPES = [
  { label: 'Dogs', value: 'dog' },
  { label: 'Cats', value: 'cat' },
  { label: 'Rabbits', value: 'rabbit' },
  { label: 'Hamsters', value: 'hamster' },
  { label: 'Guinea Pigs', value: 'guinea_pig' },
  { label: 'Parrots', value: 'parrot' },
  { label: 'Other', value: 'other' },
];

export const PetTypePicker = ({ value, onChange, options = DEFAULT_PET_TYPES, label = "Pet Type", hideLabel = false }: PetTypePickerProps) => {

  // Handle both single string and array values
  const displayValue = Array.isArray(value) ? value[0] : value;

  return (
    <Stack spacing={2}>
      {!hideLabel && (
        <FormLabel fontWeight="semibold" mb="0">
          {label}
        </FormLabel>
      )}
      <Select
        placeholder="Select Pet Type"
        value={displayValue}
        onChange={(e) => {
          const val = e.target.value;
          // If the original value was an array, return an array
          onChange(Array.isArray(value) ? (val ? [val] : []) : val);
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </Stack>
  );
};

