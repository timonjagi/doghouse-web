import {
  useColorModeValue,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Avatar,
  Divider,
  Flex,
  Button,
  Box,
  Center,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { Dropzone } from "lib/components/Dropzone";
import React from "react";

const ProfileCard: React.FC<any> = ({
  loading,
  saving,
  userProfile,
  firstName,
  lastName,
  location,
  setFirstName,
  setLastName,
  setLocation,
  selectedFiles,
  onSelectImage,
  onRemoveImage,
  onSubmit,
  ...rest
}) => {
  return (
    <>
      {loading ? (
        <Box flex="1" h="full">
          <Center>
            <Spinner />
          </Center>
        </Box>
      ) : (
        <Box
          bg="bg-surface"
          boxShadow={useColorModeValue("sm", "sm-dark")}
          borderRadius="lg"
          flex="1"
          {...rest}
        >
          <Stack
            spacing="5"
            px={{ base: "4", md: "6" }}
            py={{ base: "5", md: "6" }}
          >
            <Alert status="info">
              <AlertIcon />
              Upload profile photo to continue
            </Alert>
            <Stack spacing="6" direction={{ base: "column", md: "row" }}>
              <FormControl id="firstName">
                <FormLabel>First Name</FormLabel>
                <Input
                  defaultValue=""
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </FormControl>
              <FormControl id="lastName">
                <FormLabel>Last Name</FormLabel>
                <Input
                  defaultValue=""
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </FormControl>
            </Stack>
            <FormControl id="street">
              <FormLabel>Location</FormLabel>
              <Input
                defaultValue=""
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
            </FormControl>

            <FormControl id="picture">
              <FormLabel>Picture</FormLabel>
              <Stack spacing={{ base: "3", md: "5" }} direction="row">
                <Avatar
                  size="lg"
                  name={userProfile.name}
                  src={userProfile.profilePhotoUrl}
                />
                <Dropzone
                  selectedFiles={selectedFiles}
                  onRemove={onRemoveImage}
                  onChange={onSelectImage}
                  maxUploads={1}
                />
              </Stack>
            </FormControl>
          </Stack>
          <Divider />
          <Flex direction="row-reverse" py="4" px={{ base: "4", md: "6" }}>
            <Button
              type="submit"
              variant="primary"
              onClick={onSubmit}
              isLoading={saving}
            >
              Save
            </Button>
          </Flex>
        </Box>
      )}
    </>
  );
};
export default ProfileCard;
