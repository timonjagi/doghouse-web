import {
  Stack,
  Heading,
  Box,
  BoxProps,
  Circle,
  createIcon,
  Icon,
  StackProps,
  useId,
  useRadio,
  useRadioGroup,
  UseRadioProps,
  useStyleConfig,
  Text,
  Button,
  ButtonGroup,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { auth } from "lib/firebase/client";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

interface RadioCardGroupProps<T> extends Omit<StackProps, "onChange"> {
  name?: string;
  value?: T;
  defaultValue?: string;
  onChange?: (value: T) => void;
}

const RadioCardGroup = <T extends string>(props: RadioCardGroupProps<T>) => {
  const { children, name, defaultValue, value, onChange, ...rest } = props;
  console.log(defaultValue);
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    defaultValue,
    value,
    onChange,
  });

  const cards = React.useMemo(
    () =>
      React.Children.toArray(children)
        .filter<React.ReactElement<RadioCardProps>>(React.isValidElement)
        .map((card) => {
          return React.cloneElement(card, {
            radioProps: getRadioProps({
              value: card.props.value,
            }),
          });
        }),
    [children, getRadioProps]
  );

  return <Stack {...getRootProps(rest)}>{cards}</Stack>;
};

interface RadioCardProps extends BoxProps {
  value: string;
  radioProps?: UseRadioProps;
}

const RadioCard = (props: RadioCardProps) => {
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

// eslint-disable-next-line
export const SelectPath = ({ currentStep, setStep, user }: any) => {
  const [userProfile, setUserProfile] = useState({} as any);

  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const options = [
    {
      label: "Dog Seeker",
      description: "I'm looking to adopt a dog",
      slug: "dog_seeker",
    },
    {
      label: "Dog Owner",
      description: "I'm looking to rehome my dogs",
      slug: "dog_owner",
    },
    // {
    //   label: "Dog Professional ",
    //   description: "I'm looking to provide care for dogs 🐾",
    //   slug: "dog_professional",
    // },
  ];

  const onBack = () => {
    setStep(currentStep - 1);
  };

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("profile"));
    setUserProfile(profile);
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      const profile = { ...userProfile, roles: [selectedRole] };
      localStorage.setItem("profile", JSON.stringify(profile));

      setStep(currentStep + 1);
      // eslint-disable-next-line
    } catch (err: any) {
      toast({
        title: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  return (
    <Stack as="form" spacing="9" onSubmit={(event) => onSubmit(event)}>
      <Heading size="md">
        Nice to meet you, {userProfile?.name}. Choose your path.
      </Heading>
      <RadioCardGroup
        defaultValue={selectedRole}
        spacing="3"
        onChange={setSelectedRole}
      >
        {options.map((option) => (
          <RadioCard key={option.label} value={option.slug}>
            <Text color="emphasized" fontWeight="medium" fontSize="sm">
              {option.label}
            </Text>
            <Text color="muted" fontSize="sm">
              {option.description}
            </Text>
          </RadioCard>
        ))}
      </RadioCardGroup>

      <ButtonGroup width="100%">
        <Button onClick={onBack} variant="ghost">
          Back
        </Button>
        <Spacer />
        <Button
          isLoading={loading}
          type="submit"
          isDisabled={!selectedRole}
          variant="primary"
        >
          Next
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
