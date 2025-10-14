import { BoxProps, UseRadioProps, useRadio, useId, useStyleConfig, Box, Stack, Circle, Icon, createIcon } from "@chakra-ui/react";

export interface RadioCardProps extends BoxProps {
  value: string;
  radioProps?: UseRadioProps;
}

export const RadioCard = (props: RadioCardProps) => {
  const { radioProps, children, ...rest } = props;
  const { getInputProps, getLabelProps, state } = useRadio(radioProps);
  const id = useId(undefined, "radio-button");
  const styles = useStyleConfig("RadioCard", props);
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
      <input {...inputProps} aria-labelledby={id} />
      <Box sx={styles} {...rest}>
        <Stack direction="row">
          <Box flex="1">{children}</Box>
          {state.isChecked ? (
            <Circle bg="accent" size="4">
              <Icon as={CheckIcon} boxSize="2.5" color="inverted" />
            </Circle>
          ) : (
            <Circle borderWidth="2px" size="4" />
          )}
        </Stack>
      </Box>
    </Box>
  );
};

const CheckIcon = createIcon({
  displayName: "CheckIcon",
  viewBox: "0 0 12 10",
  path: (
    <polyline
      fill="none"
      strokeWidth="2px"
      stroke="currentColor"
      strokeDasharray="16px"
      points="1.5 6 4.5 9 10.5 1"
    />
  ),
});