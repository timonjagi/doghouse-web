import {
  Stack,
  FormControl,
  Input,
  ButtonGroup,
  Button,
  Box,
  Spacer,
  HStack,
  useToast,
  Text,
  useBreakpointValue,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { supabase } from "lib/supabase/client";
import { GoogleIcon, TwitterIcon, GitHubIcon } from "./ProviderIcons";
import { FaFacebook } from "react-icons/fa";

type PageProps = {
  setProfileNotCreated?: any;
};

// eslint-disable-next-line
export const LoginForm = ({ setProfileNotCreated }: PageProps) => {
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both email and password",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else if (data.user) {
        router.push("/dashboard");
        toast({
          title: "Login successful",
          description: "Welcome back!",
          status: "success",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast({
          title: "Google login failed",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      // OAuth redirect will handle the rest
    } catch (error) {
      toast({
        title: "Google login failed",
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
        onSubmit={handleEmailLogin}
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        <ButtonGroup w="full">
          <Button
            isLoading={loading}
            type="submit"
            size="lg"
            w="full"
            variant="primary"
            isDisabled={!email || !password}
          >
            <span>Sign In</span>
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

      <Stack spacing="3">
        <Button
          variant="secondary"
          leftIcon={<GoogleIcon boxSize="5" />}
          iconSpacing="3"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </Button>
      </Stack>

      {router.pathname.includes("signup") && (
        <Text fontSize="xs" color="subtle" textAlign="center">
          By continuing, you acknowledge that you have read, understood, and
          agree to our terms and conditions
        </Text>
      )}
    </Stack>
  );
};
