import type { ButtonProps, UseRadioProps } from "@chakra-ui/react";
import { useRadio, Button, Box } from "@chakra-ui/react";

interface RadioButtonProps extends ButtonProps {
  value: string;
  radioProps?: UseRadioProps;
}

export const RadioButton = (props: RadioButtonProps) => {
  const { radioProps, ...rest } = props;
  const { getInputProps, getLabelProps } = useRadio(radioProps);

  const inputProps = getInputProps();
  const labelProps = getLabelProps();

  return (
    <Box
      as="label"
      cursor="pointer"
      {...labelProps}
      sx={{
        ".focus-visible + [data-focus]": {
          boxShadow: "outline",
          zIndex: 1,
        },
      }}
    >
      <input {...inputProps} aria-labelledby="radio-button" />
      <Button
        id="radio-button"
        as="div"
        _focus={{ boxShadow: "none" }}
        {...rest}
      />
    </Box>
  );
};
