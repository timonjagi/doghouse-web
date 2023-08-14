import {
  CheckboxGroup,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

// eslint-disable-next-line
export const RefinementList = (props: any) => {
  const {
    items,
    label,
    hideLabel,
    spacing = "2",
    showSearch,
    setSelectedBreedGroups,
    ...rest
  } = props;

  // eslint-disable-next-line
  const onSelectBreedGroup = (event: any) => {
    // console.log("event", event);
    setSelectedBreedGroups([...event]);
  };
  return (
    <Stack as="fieldset" spacing={spacing}>
      {!hideLabel && (
        <FormLabel fontWeight="semibold" as="legend" mb="0">
          {label}
        </FormLabel>
      )}
      {showSearch && (
        <InputGroup size="md" pb="1">
          <Input
            placeholder="Search..."
            rounded="md"
            focusBorderColor={mode("blue.500", "blue.200")}
          />
          <InputRightElement
            pointerEvents="none"
            color="gray.400"
            fontSize="lg"
          >
            <FiSearch />
          </InputRightElement>
        </InputGroup>
      )}
      <CheckboxGroup {...rest} onChange={(event) => onSelectBreedGroup(event)}>
        {/* {items.map((option: any) => (
          <Checkbox key={option.value} value={option.value}>
            <span>{option.label}</span>
            {option.count != null && (
              <Box as="span" color="gray.500" fontSize="sm">
                {" "}
                ({option.count})
              </Box>
            )}
          </Checkbox>
        ))} */}
      </CheckboxGroup>
    </Stack>
  );
};
