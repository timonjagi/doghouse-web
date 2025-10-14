import {
  Stack,
  Text,
  useToast,
  Button,
  ButtonGroup,
  Spacer,
  Heading,
  VStack,
  HStack,
  Icon,
  Box,
  Badge,
  Textarea,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { MdFavorite, MdCheckCircle } from "react-icons/md";
import { useCurrentUser } from "../../../hooks/queries";
import { useUpdateUserProfile } from "../../../hooks/queries";
import { supabase } from "../../../supabase/client";

type PageProps = {
  currentStep: number;
  setStep: (step: number) => void;
  onClose: () => void;
};

export const WantedListing: React.FC<PageProps> = ({ currentStep, setStep, onClose }) => {
  const { data: user } = useCurrentUser();
  const updateUserProfile = useUpdateUserProfile();
  const toast = useToast();

  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<any>(null);

  useEffect(() => {
    // Load preferences from sessionStorage
    const savedPreferences = sessionStorage.getItem("seekerPreferences");
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const onBack = () => {
    setStep(currentStep - 1);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user || !preferences) {
      toast({
        title: "Missing information",
        description: "Please complete the preferences step first",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      // Get breed name for the wanted listing
      const { data: breed } = await supabase
        .from('breeds')
        .select('name')
        .eq('id', preferences.selectedBreed)
        .single();

      // Create wanted listing with preferences
      const { error: wantedListingError } = await supabase
        .from('wanted_listings')
        .insert({
          seeker_id: user.id,
          pet_type: 'dog',
          preferred_breed: breed?.name || '',
          preferred_age: preferences.preferredAge,
          preferred_sex: preferences.preferredSex,
          spay_neuter_preference: preferences.spayNeuterPreference,
          activity_level: preferences.activityLevel,
          has_allergies: preferences.hasAllergies,
          has_children: preferences.hasChildren,
          has_other_pets: preferences.hasOtherPets,
          notes: notes,
          is_active: true, // Active by default as requested
        });

      if (wantedListingError) throw wantedListingError;

      // Mark onboarding as complete
      await updateUserProfile.mutateAsync({
        onboarding_completed: true,
      });

      // Clear stored preferences
      sessionStorage.removeItem("seekerPreferences");

      toast({
        title: "Profile created successfully! 🎉",
        description: "Welcome to DogHouse Kenya! Your wanted listing is now active and breeders can find you.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Move to success step instead of closing modal
      setStep(currentStep + 1);

    } catch (error: any) {
      toast({
        title: "Error creating wanted listing",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  if (!preferences) {
    return (
      <Stack spacing="8" textAlign="center">
        <Heading size="md">Loading preferences...</Heading>
        <Text>Please complete the preferences step first.</Text>
      </Stack>
    );
  }

  return (
    <Stack as="form" spacing="8" onSubmit={onSubmit}>
      <VStack spacing={6} textAlign="center">
        <Icon as={MdFavorite} boxSize={16} color="red.500" />
        <Heading size="md">
          Create your wanted listing ❤️
        </Heading>

        <Text fontSize="lg" color="gray.600">
          Based on your preferences, we'll create an active wanted listing that breeders can see.
        </Text>
      </VStack>

      <Box p={6} bg="gray.50" borderRadius="lg" w="full">
        <VStack spacing={4} align="start">
          <Text fontWeight="bold" fontSize="lg">Your Preferences Summary:</Text>

          <HStack>
            <Text fontWeight="medium">Breed:</Text>
            <Badge colorScheme="blue">
              {preferences.selectedBreed && (
                // Get breed name from ID (simplified for now)
                <Text>Breed ID: {preferences.selectedBreed}</Text>
              )}
            </Badge>
          </HStack>

          <HStack>
            <Text fontWeight="medium">Age:</Text>
            <Badge colorScheme="green">{preferences.preferredAge}</Badge>
          </HStack>

          <HStack>
            <Text fontWeight="medium">Sex:</Text>
            <Badge colorScheme="purple">{preferences.preferredSex}</Badge>
          </HStack>

          <HStack>
            <Text fontWeight="medium">Activity Level:</Text>
            <Badge colorScheme="orange">{preferences.activityLevel}</Badge>
          </HStack>

          {preferences.hasChildren === true && (
            <Badge colorScheme="yellow">Has children at home</Badge>
          )}
          {preferences.hasOtherPets === true && (
            <Badge colorScheme="yellow">Has other pets</Badge>
          )}
          {preferences.hasAllergies === true && (
            <Badge colorScheme="red">Has allergies</Badge>
          )}
        </VStack>
      </Box>

      <Stack spacing="4">
        <Text fontWeight="medium">Additional Notes (Optional)</Text>
        <Textarea
          placeholder="Any additional information for breeders..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </Stack>

      <Text fontSize="sm" color="gray.500">
        Your wanted listing will be visible to breeders immediately. You can edit or deactivate it anytime from your dashboard.
      </Text>

      <ButtonGroup width="100%">
        <Button onClick={onBack} variant="ghost">
          Back
        </Button>
        <Spacer />
        <Button
          isLoading={loading}
          type="submit"
          variant="primary"
        >
          Create Wanted Listing
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
