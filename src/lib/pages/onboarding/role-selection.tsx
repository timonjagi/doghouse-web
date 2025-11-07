import {
  Stack,
  Heading,
  Text,
  Button,
  ButtonGroup,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useCurrentUser } from "../../hooks/queries";
import { useUpdateUserProfile } from "../../hooks/queries";
import { supabase } from "../../supabase/client";
import { RadioCardGroup } from "lib/components/ui/RadioCardGroup";
import { RadioCard } from "lib/components/ui/RadioCard";

// eslint-disable-next-line
const RoleSelectionStep = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  // Get current user and update profile mutation
  const updateUserProfile = useUpdateUserProfile();

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
  ];

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      // Map the selected role to database format
      const dbRole = selectedRole === "dog_seeker" ? "seeker" : "breeder";

      await updateUserProfile.mutateAsync({ role: dbRole });

    } catch (err: any) {
      toast({
        title: "Error saving role",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  return (
    <Stack as="form" spacing="9" onSubmit={(event) => onSubmit(event)}>
      <Heading size={{ base: "sm", md: "md" }}>How would you like to continue?</Heading>
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
        {/* <Button onClick={onBack} variant="ghost">
          Back
        </Button> */}
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

export default RoleSelectionStep;