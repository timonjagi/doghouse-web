// import React from 'react';

import {
  Stack,
  FormControl,
  FormLabel,
  Box,
  Flex,
  Text,
  useToast,
  Button,
  ButtonGroup,
  Spacer,
  Heading,
  ButtonGroupProps,
  ButtonProps,
  useRadio,
  useRadioGroup,
  UseRadioProps,
  HStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Dropzone } from "lib/components/Dropzone";
import React from "react";
import { useEffect, useState } from "react";
import { Select } from "chakra-react-select";

import breedData from "../../../data/breeds_with_group.json";
interface RadioButtonGroupProps<T>
  extends Omit<ButtonGroupProps, "onChange" | "variant" | "isAttached"> {
  name?: string;
  value?: T;
  defaultValue?: string;
  onChange?: (value: T) => void;
}

const RadioButtonGroup = <T extends string>(
  props: RadioButtonGroupProps<T>
) => {
  const { children, name, defaultValue, value, onChange, ...rest } = props;
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
          const isFirstItem = index === 0;
          const isLastItem = array.length === index + 1;

          const styleProps = Object.assign({
            ...(isFirstItem && !isLastItem ? { borderRightRadius: 0 } : {}),
            ...(!isFirstItem && isLastItem ? { borderLeftRadius: 0 } : {}),
            ...(!isFirstItem && !isLastItem ? { borderRadius: 0 } : {}),
            ...(!isLastItem ? { mr: "-px" } : {}),
          });

          return React.cloneElement(button, {
            ...styleProps,
            radioProps: getRadioProps({
              value: button.props.value,
              disabled: props.isDisabled || button.props.isDisabled,
            }),
          });
        }),
    [children, getRadioProps, props.isDisabled]
  );
  return (
    <ButtonGroup isAttached variant="outline" {...getRootProps(rest)}>
      {buttons}
    </ButtonGroup>
  );
};

interface RadioButtonProps extends ButtonProps {
  value: string;
  radioProps?: UseRadioProps;
}

const RadioButton = (props: RadioButtonProps) => {
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

// eslint-disable-next-line
export const PetDetails = ({ currentStep, setStep }: any) => {
  const [userProfile, setUserProfile] = useState({} as any);
  const [breeds, setBreeds] = useState([] as any[]);

  const [selectedBreed, setSelectedBreed] = useState<any>({} as any);
  const [selectedFiles, setSelectedFile] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedSex, setSelectedSex] = useState<string>("");
  const [selectedAge, setSelectedAge] = useState<string>("");

  const [loading, setLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    setLoading(true);

    setBreeds(
      breedData.map((breed) => ({
        label: breed.name,
        value: breed.name,
      }))
    );

    const profile = JSON.parse(localStorage.getItem("profile"));

    if (profile) {
      setLoading(false);
      setUserProfile(profile);
      setSelectedRole(profile.roles[0]);

      if (profile.pet_profiles) {
        const petProfile = profile.pet_profiles[0];
        setSelectedBreed(petProfile.breed);
        setSelectedAge(petProfile.age);
        setSelectedSex(petProfile.sex);
        setSelectedFile(petProfile.images);
      }
    }
  }, []);

  // eslint-disable-next-line
  const onSelectBreed = (selectedBreed: any) => {
    const breed = breedData.find((breed) => breed.name === selectedBreed.value);
    if (breed) {
      setSelectedBreed(breed);
    }
  };

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    const reader = new FileReader();

    if (files?.length) {
      reader.readAsDataURL(files[0]);

      reader.onload = (readerEvent) => {
        const newFile = readerEvent.target?.result;
        if (newFile) {
          if (selectedFiles.includes(newFile)) {
            return toast({
              title: "Image already selected",
              description: "Please select a different image",
              status: "error",
              duration: 4000,
            });
          }
          setSelectedFile([...selectedFiles, newFile]);
        }
      };
    }
  };

  const onRemoveImage = (file) => {
    const files = selectedFiles.filter((selectedFile) => selectedFile !== file);
    setSelectedFile(files);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      const payload = {
        ...userProfile,
        pet_profiles: [
          {
            breed: selectedBreed,
            sex: selectedSex,
            age: selectedAge,
          },
        ],
      };

      localStorage.setItem("profile", JSON.stringify(payload));

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
    <>
      {!loading && (
        <Stack
          as="form"
          spacing={{ base: 6, md: 9 }}
          onSubmit={(event) => onSubmit(event)}
        >
          <Heading size="md">
            Awesome! Tell us about your
            {selectedRole.includes("dog_seeker") ? " ideal " : ""} furry friend
            🐶
          </Heading>

          <Stack spacing={{ base: 3, md: 9 }}>
            <FormControl>
              <FormLabel htmlFor="breeds" fontWeight="semibold">
                Breed
              </FormLabel>
              <Select
                placeholder="Select breed..."
                colorScheme="brand"
                options={breeds}
                value={{ label: selectedBreed.name, value: selectedBreed.name }}
                onChange={onSelectBreed}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="breeds" fontWeight="semibold">
                Age
              </FormLabel>

              <RadioButtonGroup
                key="age"
                size="md"
                value={selectedAge}
                onChange={setSelectedAge}
              >
                <RadioButton value="puppy">
                  <Text
                    fontWeight={selectedAge === "puppy" ? "semibold" : "normal"}
                  >
                    Puppy
                  </Text>
                </RadioButton>
                <RadioButton value="adolescent">
                  <Text
                    fontWeight={
                      selectedAge === "adolescent" ? "semibold" : "normal"
                    }
                  >
                    Adolescent
                  </Text>
                </RadioButton>
                <RadioButton value="adult">
                  <Text
                    fontWeight={selectedAge === "adult" ? "semibold" : "normal"}
                  >
                    Adult
                  </Text>
                </RadioButton>
              </RadioButtonGroup>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="sex" fontWeight="semibold">
                Sex/Gender
              </FormLabel>

              <RadioButtonGroup
                key="sex"
                size="md"
                value={selectedSex}
                onChange={setSelectedSex}
              >
                <RadioButton value="male">
                  <Text
                    fontWeight={selectedSex === "male" ? "semibold" : "normal"}
                  >
                    Male
                  </Text>
                </RadioButton>
                <RadioButton value="female">
                  <Text
                    fontWeight={
                      selectedSex === "female" ? "semibold" : "normal"
                    }
                  >
                    Female
                  </Text>
                </RadioButton>
              </RadioButtonGroup>
            </FormControl>
          </Stack>

          <ButtonGroup width="100%" mb="4">
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
              isDisabled={!selectedBreed || !selectedSex || !selectedAge}
              variant="primary"
            >
              Next
            </Button>
          </ButtonGroup>
        </Stack>
      )}
    </>
  );
};
