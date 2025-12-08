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
  Textarea,
  FormHelperText,
  Select,
} from "@chakra-ui/react";
import { Dropzone } from "lib/components/ui/Dropzone";
import React, { useState } from "react";

type NewPostFormProps = {};

const NewPostForm: React.FC<NewPostFormProps> = (props) => {
  const [saving, setSaving] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([] as any);
  const [selectedPostType, setSelectedPostType] = useState("");

  const onSelectImage = () => { };
  const onRemoveImage = () => { };
  const onSubmit = () => {
    // const activity = {
    //   title: "Pet listed",
    //   description: `Hi, I'm looking for a ${pet.breed} ${pet.age}, preferrably ${pet.sex}`,
    //   seekerId: pet.seekerId,
    //   userName: user.displayName,
    //   userPhotoUrl: user.photoURL || null,
    //   petBreed: pet.breed,
    //   petAge: pet.age,
    //   petSex: pet.sex,
    //   createdAt: pet.createdAt,
    //   updatedAt: pet.updatedAt,
    // };
    // db.collection("activity").doc().set(activity);
  };

  return (
    <Box bg="bg-surface" borderRadius="lg" flex="1" {...props}>
      <Stack spacing="5" py={{ base: "5", md: "6" }}>
        <FormControl>
          <FormLabel>Post type</FormLabel>
          <Select
            placeholder="Select option"
            colorScheme="brand"
            value={selectedPostType}
            onChange={(event) => setSelectedPostType(event.target.value)}
          >
            <option value="request">Pet request</option>
            <option value="offer">Pet offer</option>
          </Select>
        </FormControl>

        {/* <FormControl id="bio">
          <FormLabel>Post</FormLabel>
          <Textarea rows={3} resize="none" />
        </FormControl> */}

        {selectedPostType === "offer" && (
          <FormControl id="picture">
            <FormLabel>Upload Picture(s)</FormLabel>

            <Dropzone
              selectedFiles={selectedFiles}
              onRemove={onRemoveImage}
              onChange={onSelectImage}
              maxUploads={1}
            />
          </FormControl>
        )}
      </Stack>
      <Divider />
      <Flex direction="row-reverse" py="4" px={{ base: "4", md: "6" }}>
        <Button
          type="submit"
          variant="primary"
          onClick={onSubmit}
          isLoading={saving}
        >
          Post
        </Button>
      </Flex>
    </Box>
  );
};
export default NewPostForm;
