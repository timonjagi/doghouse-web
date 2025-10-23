import type {
  ButtonGroupProps,
  ButtonProps,
  UseRadioProps,
} from "@chakra-ui/react";
import { useRadioGroup, ButtonGroup } from "@chakra-ui/react";
import React from "react";

interface RadioButtonGroupProps<T>
  extends Omit<ButtonGroupProps, "onChange" | "variant" | "isAttached"> {
  name?: string;
  value?: T;
  defaultValue?: string;
  onChange?: (value: T) => void;
}

interface RadioButtonProps extends ButtonProps {
  value: string;
  radioProps?: UseRadioProps;
}

export const RadioButtonGroup = <T extends string>(
  props: RadioButtonGroupProps<T>
) => {
  const { children, name, defaultValue, value, onChange, isDisabled, ...rest } =
    props;
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    defaultValue,
    value,
    onChange,
  });

  const buttons = React.useMemo(
    () =>
      React.Children.toArray(children)
        .filter<React.ReactElement<RadioButtonProps>>(React.isValidElement)
        .map((button, index, array) => {
          const { isDisabled: isButtonDisabled, value: buttonValue } =
            button.props;
          const isFirstItem = index === 0;
          const isLastItem = array.length === index + 1;

          const styleProps = {
            ...(isFirstItem && !isLastItem ? { borderRightRadius: 0 } : {}),
            ...(!isFirstItem && isLastItem ? { borderLeftRadius: 0 } : {}),
            ...(!isFirstItem && !isLastItem ? { borderRadius: 0 } : {}),
            ...(!isLastItem ? { mr: "-px" } : {}),
          };

          return React.cloneElement(button, {
            ...styleProps,
            radioProps: getRadioProps({
              value: buttonValue,
              disabled: isDisabled || isButtonDisabled,
            }),
          });
        }),
    [children, getRadioProps, isDisabled]
  );
  return (
    <ButtonGroup isAttached variant="outline" {...getRootProps(rest)}>
      {buttons}
    </ButtonGroup>
  );
};
