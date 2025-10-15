import {
  Stack,
  FormControl,
  Input,
  ButtonGroup,
  Button,
  HStack,
  useToast,
  Text,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { supabase } from "lib/supabase/client";
import { GoogleIcon } from "./ProviderIcons";

export const SignupForm = () => {
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailSignup = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else if (data.user) {
        toast({
          title: "Account created successfully",
          description: "Logging you in and setting up your profile...",
          status: "success",
          duration: 3000,
        });

        // Auto-login the user after signup
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          console.error('Auto-login failed:', signInError);
          toast({
            title: "Login failed",
            description: "Account created but login failed. Please log in manually.",
            status: "warning",
            duration: 5000,
          });
          router.push("/login");
          return;
        }

        if (signInData.user) {
          // Create basic user profile in the users table while authenticated
          const { error: profileError } = await supabase
            .from('users')
            .insert([
              {
                id: signInData.user.id,
                email: email,
                is_verified: false,
              },
            ]);

          if (profileError) {
            console.error('Error creating user profile:', profileError);
            toast({
              title: "Profile creation warning",
              description: "Account created but profile setup incomplete. You can complete this in onboarding.",
              status: "warning",
              duration: 5000,
            });
          }

          // Redirect to onboarding instead of login
          router.push("/onboarding");
        }
      }
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "An unexpected error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }

  };

  const handleGoogleSignup = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });

      if (error) {
        toast({
          title: "Google signup failed",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      // OAuth redirect will handle the rest
    } catch (error) {
      toast({
        title: "Google signup failed",
        description: "An unexpected error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  return (
    <Stack spacing="6" w="full">
      <Stack
        spacing="6"
        as="form"
        align="center"
        onSubmit={handleEmailSignup}
        w="full"
      >
        <FormControl>
          <Input
            size="lg"
            required
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <Input
            size="lg"
            required
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <Input
            size="lg"
            required
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormControl>

        <ButtonGroup w="full">
          <Button
            isLoading={loading}
            type="submit"
            size="lg"
            w="full"
            variant="primary"
            isDisabled={!email || !password || !confirmPassword}
          >
            <span>Create Account</span>
          </Button>
        </ButtonGroup>
      </Stack>

      <HStack>
        <Divider />
        <Text fontSize="sm" color="muted">
          OR
        </Text>
        <Divider />
      </HStack>

      <Button
        variant="secondary"
        leftIcon={<GoogleIcon boxSize="5" />}
        iconSpacing="3"
        onClick={handleGoogleSignup}
        isLoading={loading}
      >
        Continue with Google
      </Button>

      <Text fontSize="xs" color="subtle" textAlign="center">
        By continuing, you acknowledge that you have read, understood, and
        agree to our terms and conditions
      </Text>
    </Stack>
  );
};
