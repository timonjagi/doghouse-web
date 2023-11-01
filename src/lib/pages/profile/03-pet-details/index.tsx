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

import breedData from "../../../data/breeds.json";
import { transform } from "next/dist/build/swc";

interface Breed {
  id: string;
  name: string;
  description: string;
  weight: string;
  height: string;
  lifeSpan: string;
  image: string;
}

interface RadioButtonGroupProps<T>
  extends Omit<ButtonGroupProps, "onChange" | "variant" | "isAttached"> {
  name?: string;
  value?: T;
  defaultValue?: string;
  onChange?: (value: T) => void;
}

export const RadioButtonGroup = <T extends string>(
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
      <input {...inputProps} aria-labelledby="radion-button" />
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
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [selectedFiles, setSelectedFile] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedSex, setSelectedSex] = useState("");
  const [selectedAge, setSelectedAge] = useState("");

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
    }
  }, []);

  // eslint-disable-next-line
  const onSelectBreed = (selectedBreed: any) => {
    setSelectedBreed(selectedBreed.value);
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
          selectedRole.includes("dog_owner")
            ? {
                breed: selectedBreed,
                images: selectedFiles,
              }
            : {
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
            {selectedRole.includes("dog_seeker") ? " ideal " : ""} furry friend.
          </Heading>

          <Stack spacing={{ base: 6, md: 9 }}>
            <FormControl>
              <FormLabel htmlFor="breeds">Breed</FormLabel>
              <Select
                colorScheme="brand"
                options={breeds}
                onChange={onSelectBreed}
              />
            </FormControl>

            {selectedRole.includes("dog_seeker") && (
              <>
                <FormControl>
                  <FormLabel htmlFor="breeds">Age</FormLabel>

                  <RadioButtonGroup key="md" defaultValue="left" size="md">
                    <RadioButton value="left">
                      <Text fontWeight="normal">Puppy</Text>
                    </RadioButton>
                    <RadioButton value="center">
                      <Text fontWeight="normal">Adolescent</Text>
                    </RadioButton>
                    <RadioButton value="right">
                      <Text fontWeight="normal">Adult</Text>
                    </RadioButton>
                  </RadioButtonGroup>
                </FormControl>

                <Wrap align="baseline" spacing={{ base: 6, md: 9 }}>
                  <WrapItem>
                    <FormControl>
                      <FormLabel htmlFor="breeds">Sex</FormLabel>

                      <RadioButtonGroup key="md" defaultValue="left" size="md">
                        <RadioButton value="male">
                          <Text fontWeight="normal">Male</Text>
                        </RadioButton>
                        <RadioButton value="female">
                          <Text fontWeight="normal">Female</Text>
                        </RadioButton>
                      </RadioButtonGroup>
                    </FormControl>
                  </WrapItem>

                  <WrapItem>
                    <FormControl>
                      <FormLabel htmlFor="breeds">
                        Spayed or Neutered?
                      </FormLabel>

                      <RadioButtonGroup key="md" defaultValue="left" size="md">
                        <RadioButton value="male">
                          <Text fontWeight="normal">Yes</Text>
                        </RadioButton>
                        <RadioButton value="female">
                          <Text fontWeight="normal">No</Text>
                        </RadioButton>
                      </RadioButtonGroup>
                    </FormControl>
                  </WrapItem>
                </Wrap>
              </>
            )}

            {selectedRole.includes("dog_owner") && (
              <FormControl id="file">
                <FormLabel>Upload photo(s)</FormLabel>
                <Dropzone
                  selectedFiles={selectedFiles}
                  onRemove={onRemoveImage}
                  onChange={onSelectImage}
                  maxUploads={4}
                />
              </FormControl>
            )}

            <Text fontSize="sm" color="subtle" textAlign="center">
              {userProfile.roles?.includes("dog_owner") ? "Have" : "Want"}{" "}
              multiple breeds? That's awesome. You can create additional{" "}
              {userProfile.roles?.includes("dog_owner")
                ? "pet profiles"
                : "listings"}{" "}
              later.
            </Text>
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
              isDisabled={
                selectedRole.includes("dog_owner")
                  ? !selectedBreed || !selectedFiles.length
                  : !selectedBreed || !selectedSex || !selectedAge
              }
              variant="primary"
            >
              Finish
            </Button>
          </ButtonGroup>
        </Stack>
      )}
    </>
  );
};
