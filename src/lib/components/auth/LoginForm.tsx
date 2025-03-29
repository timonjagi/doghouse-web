import {
  Stack,
  ButtonGroup,
  Button,
  HStack,
  useToast,
  Text,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { GoogleIcon } from "./ProviderIcons";
import { FaFacebook } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";

type PageProps = {
  setProfileNotCreated?: (value: boolean) => void;
};

export const LoginForm = ({ setProfileNotCreated }: PageProps) => {
  const toast = useToast();
  const router = useRouter();

  // Social login mutation
  const socialSignIn = useMutation({
    mutationFn: async (provider: "google" | "facebook") => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // The actual redirect will be handled by Supabase
      localStorage.setItem("authUser", JSON.stringify(data.user));
    },
    onError: (error: Error) => {
      toast({
        title: "Social login failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return (
    <Stack spacing="6" w="full">
      <Stack spacing="3">
        <Button
          variant="secondary"
          leftIcon={<GoogleIcon boxSize="5" />}
          iconSpacing="3"
          onClick={() => socialSignIn.mutate("google")}
          isLoading={socialSignIn.isPending}
          size="lg"
          w="full"
        >
          Continue with Google
        </Button>
        <Button
          variant="secondary"
          leftIcon={<Icon as={FaFacebook} boxSize="5" color="facebook.500" />}
          iconSpacing="3"
          onClick={() => socialSignIn.mutate("facebook")}
          isLoading={socialSignIn.isPending}
          size="lg"
          w="full"
        >
          Continue with Facebook
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
