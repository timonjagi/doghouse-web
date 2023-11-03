import {
  Stack,
  Button,
  ButtonGroup,
  Spacer,
  Image,
  useColorModeValue,
  Box,
  Wrap,
  WrapItem,
  HStack,
  Icon,
  Text,
  Heading,
  Badge,
  Avatar,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoImagesOutline, IoLocationOutline } from "react-icons/io5";
import { PiDog, PiGenderIntersex } from "react-icons/pi";

export const Confirm = ({ currentStep, setStep }) => {
  const [userProfile, setUserProfile] = useState({} as any);
  const [petProfile, setPetProfile] = useState({} as any);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const profile = JSON.parse(localStorage.getItem("profile"));

    if (profile) {
      setLoading(false);
      setUserProfile(profile);
      setPetProfile(profile.pet_profiles[0]);
      console.log(petProfile.breed);
    }
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    console.log(userProfile);
  };

  return (
    <>
      {!loading && (
        <Stack
          as="form"
          spacing={{ base: 6, md: 9 }}
          onSubmit={(event) => onSubmit(event)}
        >
          <Heading size="md">Almost there. Let's confirm your details</Heading>

          <Box
            borderWidth="1px"
            borderRadius="lg"
            w="full"
            px="6"
            py="6"
            bg={useColorModeValue("white", "gray.800")}
          >
            <Wrap>
              <WrapItem></WrapItem>

              <WrapItem>
                <Stack pb="4">
                  <HStack align="center">
                    <Stack spacing="1">
                      <HStack>
                        <Heading size="xs">{userProfile.name}</Heading>
                        <Badge
                          textTransform="none"
                          fontSize="sm"
                          fontWeight="semibold"
                          lineHeight="1rem"
                          borderRadius="base"
                        >
                          {userProfile.roles[0].replace("_", " ")}
                        </Badge>
                      </HStack>

                      <HStack spacing="3">
                        <Icon
                          fontSize="lg"
                          as={IoLocationOutline}
                          color="muted"
                        />
                        <Text textTransform="capitalize" color="muted">
                          {userProfile.location}
                        </Text>
                      </HStack>
                    </Stack>
                  </HStack>

                  <Stack
                    w="100%"
                    p="4"
                    spacing="4"
                    bg={useColorModeValue("gray.50", "gray.700")}
                  >
                    <HStack>
                      <Image
                        src={`images/breed_groups/${petProfile.breed.breedGroup.replace(
                          " dogs",
                          ""
                        )}`}
                        fallbackSrc="/images/logo_white.png"
                        fallbackStrategy="beforeLoadOrError"
                        bg="bg-subtle"
                        w="50%"
                      />

                      <Stack>
                        <HStack spacing="3">
                          <Icon fontSize="xl" as={PiDog} />
                          <Text textTransform="capitalize" fontSize="sm">
                            {petProfile.breed.name} {petProfile.age || ""}
                          </Text>
                        </HStack>

                        {userProfile.roles.includes("dog_owner") && (
                          <HStack spacing="3">
                            <Icon fontSize="xl" as={IoImagesOutline} />
                            <Text textTransform="capitalize" fontSize="sm">
                              {petProfile.images.length} photo
                              {petProfile.images.length > 1 ? "s" : ""}{" "}
                            </Text>
                          </HStack>
                        )}
                        {userProfile.roles.includes("dog_seeker") && (
                          <>
                            <HStack spacing="3">
                              <Icon fontSize="xl" as={PiGenderIntersex} />
                              <Text textTransform="capitalize" fontSize="sm">
                                {petProfile.sex}
                              </Text>
                            </HStack>
                          </>
                        )}
                      </Stack>
                    </HStack>
                  </Stack>
                </Stack>
              </WrapItem>
            </Wrap>
          </Box>

          <Text fontSize="sm" color="subtle" textAlign="center">
            {userProfile.roles?.includes("dog_owner") ? "Have" : "Want"}{" "}
            multiple breeds? That's awesome. You can create additional{" "}
            {userProfile.roles?.includes("dog_owner")
              ? "pet profiles"
              : "listings"}{" "}
            later.
          </Text>

          <ButtonGroup width="100%" mb="4">
            <Button
              onClick={() => setStep(currentStep - 1)}
              isDisabled={currentStep === 0}
              variant="ghost"
            >
              Back
            </Button>
            <Spacer />
            <Button isLoading={loading} type="submit" variant="primary">
              Confirm
            </Button>
          </ButtonGroup>
        </Stack>
      )}
    </>
  );
};
