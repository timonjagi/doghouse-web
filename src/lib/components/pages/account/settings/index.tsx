import {
  Box,
  Container,
  Heading,
  Stack,
  StackDivider,
  Switch,
  Text,
  useColorModeValue,
  Select,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import { useState } from "react";

const Settings = () => {
  const [notificationSettings, setNotificationSettings] = useState([
    {
      type: "Email",
      description: "Receive email updates",
      isActive: false,
      snooze: "None",
      snoozeOptions: ["None", "1 hour", "1 day", "1 week"],
    },
    {
      type: "SMS",
      description: "Receive updates by SMS",
      isActive: true,
      snooze: "None",
      snoozeOptions: ["None", "1 hour", "1 day", "1 week"],
    },
    {
      type: "Push",
      description: "Receive push notifications",
      isActive: true,
      snooze: "None",
      snoozeOptions: ["None", "1 hour", "1 day", "1 week"],
    },
    {
      type: "WhatsApp",
      description: "Receive WhatsApp messages",
      isActive: false,
      snooze: "None",
      snoozeOptions: ["None", "1 hour", "1 day", "1 week"],
    },
  ]);

  const onToggleNotification = (index: number) => {
    const updated = [...notificationSettings];
    updated[index].isActive = !updated[index].isActive;
    setNotificationSettings(updated);
    // TODO: Persist to DB and sync with Novu subscriber preferences
  };

  const onSnoozeChange = (index: number, value: string) => {
    const updated = [...notificationSettings];
    updated[index].snooze = value;
    setNotificationSettings(updated);
    // TODO: Persist and apply snooze logic in workflows
  };

  return (
    <Box
      as="section"
      py={{
        base: "4",
        md: "0",
      }}
    >
      <NextSeo title="Settings - DogHouse Kenya" />

      <Container maxW="7xl">
        <Stack spacing="4">

          <Box>
            <Heading size={{ base: 'sm', lg: 'md' }}>
              Settings
            </Heading>
            <Text color="gray.600" mt={2}>
              Manage your account settings
            </Text>
          </Box>

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
                  Receive notifications about Pethouse updates.
                </Text>
              </Stack>
              {notificationSettings.map((notification, id) => (
                <Stack
                  // eslint-disable-next-line
                  key={id}
                  justify="space-between"
                  direction="row"
                  spacing="4"
                  align="center"
                >
                  <Stack spacing="0.5" fontSize="sm">
                    <Text color="emphasized" fontWeight="medium">
                      {notification.type}
                    </Text>
                    <Text color="muted">{notification.description}</Text>
                  </Stack>
                  <Stack direction="row" spacing="2" align="center">
                    <Text fontSize="sm">Snooze:</Text>
                    <Select
                      size="sm"
                      value={notification.snooze}
                      onChange={(e) => onSnoozeChange(id, e.target.value)}
                      width="120px"
                    >
                      {notification.snoozeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                    <Switch
                      isChecked={notification.isActive}
                      colorScheme="brand"
                      onChange={() => onToggleNotification(id)}
                    />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Stack >

      </Container>

    </Box>

  );
};

export default Settings;
