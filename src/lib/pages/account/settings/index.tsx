import {
  Box,
  Container,
  Stack,
  StackDivider,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// import * as React from "react";

const Settings = () => {
  const notifications = [
    {
      type: "Email",
      description: "Receive email updates on comments you followed",
      isActive: false,
    },
    {
      type: "Text messages",
      description: "Receive updates by SMS",
      isActive: true,
    },
    {
      type: "Browser",
      description: "We'll send via our desktop or mobile app",
      isActive: true,
    },
  ];

  const onToggleNotification = (notification) => {
    if ((notification.type = "Email")) {
      // open add email modal
      // include subscribe to newsletter option/checkbox
    }
  };

  return (
    <Box
      as="section"
      py={{
        base: "4",
        md: "8",
      }}
    >
      <Container maxW="3xl">
        <Box
          bg="bg-surface"
          boxShadow={useColorModeValue("sm", "sm-dark")}
          borderRadius="lg"
          p={{
            base: "6",
            md: "8",
          }}
        >
          <Stack spacing="5" divider={<StackDivider />}>
            <Stack spacing="1">
              <Text fontSize="lg" fontWeight="medium">
                Notifications
              </Text>
              <Text fontSize="sm" color="muted">
                Receive notifications about Doghouse updates.
              </Text>
            </Stack>
            {notifications.map((notification, id) => (
              <Stack
                // eslint-disable-next-line
                key={id}
                justify="space-between"
                direction="row"
                spacing="4"
              >
                <Stack spacing="0.5" fontSize="sm">
                  <Text color="emphasized" fontWeight="medium">
                    {notification.type}
                  </Text>
                  <Text color="muted">{notification.description}</Text>
                </Stack>
                <Switch
                  defaultChecked={notification.isActive}
                  colorScheme="brand"
                  onChange={() => onToggleNotification(notification)}
                />
              </Stack>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Settings;
