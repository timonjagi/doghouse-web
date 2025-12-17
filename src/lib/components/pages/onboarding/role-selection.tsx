import {
  Stack,
  Heading,
  Text,
  Button,
  ButtonGroup,
  Spacer,
  useToast,
  Box,
  Alert,
  AlertIcon,
  VStack,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useCurrentUser } from "../../../hooks/queries";
import { useUpdateUserProfile } from "../../../hooks/queries";
import { supabase } from "../../../supabase/client";
import { RadioCardGroup } from "lib/components/ui/RadioCardGroup";
import { RadioCard } from "lib/components/ui/RadioCard";
import { useRouter } from "next/router";

// eslint-disable-next-line
const RoleSelectionStep = () => {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [skipSelection, setSkipSelection] = useState(false);

  // Get current user and update profile mutation
  const updateUserProfile = useUpdateUserProfile();

  const options = [
    {
      label: "Pet Seeker",
      description: "I'm looking to adopt a pet",
      slug: "seeker",
    },
    {
      label: "Breeder/Shelter",
      description: "I'm looking to offer pets for adoption",
      slug: "breeder",
    },
  ];

  // Check if we should skip role selection based on query params
  useEffect(() => {
    const roleParam = router.query.role as string;
    if (roleParam && (roleParam === 'breeder' || roleParam === 'seeker')) {
      setSkipSelection(true);
      setSelectedRole(roleParam);
    }
  }, [router.query.role]);

  // Auto-submit if role is pre-selected
  useEffect(() => {
    if (skipSelection && selectedRole) {
      // Create a synthetic event for the form submission
      const syntheticEvent = { preventDefault: () => { } } as React.FormEvent;
      onSubmit(syntheticEvent);
    }
  }, [skipSelection, selectedRole]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      // Map the selected role to database format
      const dbRole = selectedRole === "dog_seeker" ? "seeker" : "breeder";

      await updateUserProfile.mutateAsync({ role: dbRole });

      await supabase.auth.updateUser({
        data: {
          role: dbRole,
        }
      })
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
