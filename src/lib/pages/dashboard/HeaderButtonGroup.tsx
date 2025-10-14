import { HStack, Heading, IconButton } from "@chakra-ui/react";
import { useSupabaseAuth } from "lib/hooks/useSupabaseAuth";
import router from "next/router";
import React from "react";
import { FiBell, FiUser, FiSettings } from "react-icons/fi";

type HeaderButtonGroupProps = {};

const HeaderButtonGroup: React.FC<HeaderButtonGroupProps> = () => {
  const onClickMenuLink = (link) => { };
  const { user, loading } = useSupabaseAuth();

  return (
    <HStack justify="space-between" align="start">
      <Heading pb="4" size={{ base: "xs", sm: "md" }}>
        Hi, {user?.user_metadata.full_name} 👋
      </Heading>

      <HStack spacing="1" direction="row">
        <IconButton
          icon={<FiBell />}
          aria-label="Notifications"
          aria-current={
            router.pathname.includes("account/notifications") ? "page" : "false"
          }
          onClick={() => onClickMenuLink("/account/notifications")}
        />

        <IconButton
          aria-label='"'
          icon={<FiUser />}
          aria-current={
            router.pathname.includes("account/profile") ? "page" : "false"
          }
          onClick={() => onClickMenuLink("/account/profile")}
        />

        <IconButton
          icon={<FiSettings />}
          onClick={() => onClickMenuLink("/account/settings")}
          aria-current={
            router.pathname.includes("account/settings") ? "page" : "false"
          }
          aria-label="Settings"
        />
      </HStack>
    </HStack>
  );
};
export default HeaderButtonGroup;
