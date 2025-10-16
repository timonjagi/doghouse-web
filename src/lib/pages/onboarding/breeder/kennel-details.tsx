import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  ButtonGroup,
  Button,
  Spacer,
  useToast,
  InputGroup,
  InputLeftElement,
  Icon,
  Heading,
  Select,
  Center,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdOutlineLocationOn, MdBusiness, MdHome, MdApartment } from "react-icons/md";
import { useCurrentUser } from "../../../hooks/queries";
import { useBreederProfile, useUpsertBreederProfile } from "../../../hooks/queries/useBreederProfile";
import { supabase } from "../../../supabase/client";
import { Loader } from "lib/components/ui/Loader";

type PageProps = {
  currentStep: number;
  setStep: (step: number) => void;
};

export const BreederKennelDetails: React.FC<PageProps> = ({ currentStep, setStep }) => {
  const { data: user } = useCurrentUser();
  const { data: breederProfile, isLoading: breederProfileLoading } = useBreederProfile(user?.id);
  const upsertBreederProfile = useUpsertBreederProfile();
  const toast = useToast();

  const [kennelName, setKennelName] = useState("");
  const [kennelLocation, setKennelLocation] = useState("");
  const [facilityType, setFacilityType] = useState("");
  const [loading, setLoading] = useState(false);

  const facilityOptions = [
    { value: "home_based", label: "Home-based", icon: MdHome },
    { value: "dedicated_facility", label: "Dedicated Facility", icon: MdBusiness },
    { value: "mixed", label: "Mixed", icon: MdApartment },
  ];

  const onBack = () => {
    setStep(currentStep - 1);
  };

  useEffect(() => {
    if (breederProfile) {
      console.log(breederProfile);
      setKennelName(breederProfile.kennel_name || "");
      setKennelLocation(breederProfile.kennel_location || "");
      setFacilityType(breederProfile.facility_type || "");
    }
  }, [breederProfile]);
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      // Save kennel-specific data to breeder_profiles table
      await upsertBreederProfile.mutateAsync({
        kennel_name: kennelName,
        kennel_location: kennelLocation,
        facility_type: facilityType,
      });

      setStep(currentStep + 1);
    } catch (err: any) {
      toast({
        title: "Error saving kennel information",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setLoading(false);
  };


  // if (breederProfileLoading) {
  //   return (
  //     <Center h="100%">
  //       <Loader />
  //     </Center>
  //   );
  // }

  return (
    <>
      {breederProfileLoading && <Center h="100%" flex="1" position="absolute" bg="white">
        <Loader />
      </Center>
      }

      <Stack as="form" spacing="9" onSubmit={onSubmit}>
        <Heading size={{ base: "sm", lg: "md" }}>
          Great! Now let's set up your kennel.
        </Heading>

        <Stack spacing="4">
          <FormControl id="kennelName">
            <FormLabel htmlFor="kennelName">Kennel Name</FormLabel>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none">
                <Icon as={MdBusiness} color="gray.300" boxSize={5} />
              </InputLeftElement>
              <Input
                size="lg"
                required
                id="kennelName"
                name="kennelName"
                type="text"
                placeholder="Your kennel's name"
                value={kennelName}
                onChange={(e) => setKennelName(e.target.value)}
              />
            </InputGroup>
          </FormControl>

          <FormControl id="kennelLocation">
            <FormLabel htmlFor="kennelLocation">Kennel Location</FormLabel>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none">
                <Icon as={MdOutlineLocationOn} color="gray.300" boxSize={5} />
              </InputLeftElement>
              <Input
                size="lg"
                required
                id="kennelLocation"
                name="kennelLocation"
                placeholder="City, Country"
                value={kennelLocation}
                onChange={(e) => setKennelLocation(e.target.value)}
              />
            </InputGroup>
          </FormControl>

          <FormControl id="facilityType">
            <FormLabel htmlFor="facilityType">Facility Type</FormLabel>
            <Select
              size="lg"
              placeholder="Select your facility type"
              value={facilityType}
              onChange={(e) => setFacilityType(e.target.value)}
            >
              {facilityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <ButtonGroup width="100%">
          <Button onClick={onBack} variant="ghost">
            Back
          </Button>
          <Spacer />
          <Button
            isLoading={loading}
            type="submit"
            variant="primary"
            isDisabled={!kennelName || !kennelLocation || !facilityType}
          >
            Next
          </Button>
        </ButtonGroup>
      </Stack>


    </>


  );
};
