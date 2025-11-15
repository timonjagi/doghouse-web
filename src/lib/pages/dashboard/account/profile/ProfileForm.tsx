import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Textarea,
  VStack,
  useToast,
  Select,
} from '@chakra-ui/react';
import { User } from '../../../../../../db/schema';
import { useUpdateUserProfile, useUploadProfilePhoto } from 'lib/hooks/queries/useUserProfile';
import { useSeekerProfile, useUpsertSeekerProfile } from 'lib/hooks/queries/useSeekerProfile';
import { Dropzone } from 'lib/components/ui/Dropzone';
import { useDropZone } from 'lib/hooks/useDropZone';
import { RadioButton } from 'lib/components/ui/RadioButton';
import { RadioButtonGroup } from 'lib/components/ui/RadioButtonGroup';


interface ProfileFormProps {
  userProfile: User;
}

interface FormData {
  display_name: string;
  bio: string;
  phone: string;
  location_text: string;
}

interface FormErrors {
  display_name?: string;
  bio?: string;
  phone?: string;
  location_text?: string;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ userProfile }) => {
  const toast = useToast();
  const updateProfileMutation = useUpdateUserProfile();
  const uploadMutation = useUploadProfilePhoto();
  const { data: seekerProfile } = useSeekerProfile(userProfile.id);
  const upsertSeekerProfile = useUpsertSeekerProfile();

  const [formData, setFormData] = useState<FormData>({
    display_name: userProfile.display_name || '',
    bio: userProfile.bio || '',
    phone: userProfile.phone || '',
    location_text: userProfile.location_text || '',
  });

  const [seekerFormData, setSeekerFormData] = useState({
    experience_level: '',
    has_allergies: false,
    has_children: false,
    has_other_pets: false,
    living_situation: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Populate seeker form data
  useEffect(() => {
    if (seekerProfile) {
      setSeekerFormData({
        experience_level: seekerProfile.experience_level || '',
        has_allergies: seekerProfile.has_allergies,
        has_children: seekerProfile.has_children,
        has_other_pets: seekerProfile.has_other_pets,
        living_situation: seekerProfile.living_situation || '',
      });
    }
  }, [seekerProfile]);

  const { onSelectImage, onRemoveImage, selectedImages } = useDropZone({
    selectedImages: selectedFile ? [selectedFile] : [],
    setSelectedImages: (files) => setSelectedFile(files[0]),
    maxFiles: 1,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.display_name.trim()) {
      newErrors.display_name = 'Display name is required';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    if (formData.phone && !/^(\+254|0)[17]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Kenyan phone number';
    }

    if (!formData.location_text.trim()) {
      newErrors.location_text = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Update user profile
      await updateProfileMutation.mutateAsync(formData);

      // Update seeker profile if user is a seeker
      if (userProfile.role === 'seeker') {
        await upsertSeekerProfile.mutateAsync(seekerFormData);
      }

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
        status: 'success',
        duration: 3000,
      });

      if (selectedFile) {
        await uploadMutation.mutateAsync(selectedFile);

        setSelectedFile(null);

        toast({
          title: 'Profile photo updated',
          description: 'Your profile photo has been updated successfully.',
          status: 'success',
          duration: 3000,
        });

      }

    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error instanceof Error ? error.message : 'Something went wrong',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const hasChanges = () => {
    const userProfileChanged = (
      formData.display_name !== (userProfile.display_name || '') ||
      formData.bio !== (userProfile.bio || '') ||
      formData.phone !== (userProfile.phone || '') ||
      formData.location_text !== (userProfile.location_text || '') ||
      selectedFile
    );

    if (userProfile.role === 'seeker') {
      const seekerProfileChanged = (
        seekerFormData.experience_level !== (seekerProfile?.experience_level || '') ||
        seekerFormData.has_allergies !== (seekerProfile?.has_allergies || false) ||
        seekerFormData.has_children !== (seekerProfile?.has_children || false) ||
        seekerFormData.has_other_pets !== (seekerProfile?.has_other_pets || false) ||
        seekerFormData.living_situation !== (seekerProfile?.living_situation || '')
      );
      return userProfileChanged || seekerProfileChanged;
    }

    return userProfileChanged;
  };

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.display_name}>
                <Stack
                  direction={{ base: 'column', md: 'row' }}
                  spacing={{ base: '1.5', md: '8' }}
                  justify="space-between"
                >
                  <FormLabel variant="inline">Display Name</FormLabel>
                  <Stack w="full">
                    <Input
                      name="display_name"
                      value={formData.display_name}
                      onChange={handleInputChange}
                      placeholder="Your display name"
                      maxW={{ md: '3xl' }}
                    />
                    <FormErrorMessage >{errors.display_name}</FormErrorMessage>
                  </Stack>
                </Stack>
              </FormControl>
              <FormControl id="picture">

                <Stack
                  direction={{ base: 'column', md: 'row' }}
                  spacing={{ base: '1.5', md: '8' }}
                  justify="space-between"
                >
                  <FormLabel variant="inline">Photo</FormLabel>
                  <Stack
                    spacing={{ base: '3', md: '5' }}
                    direction={{ base: 'column', sm: 'row' }}
                    width="full"
                    maxW={{ md: '3xl' }}
                  >
                    <Avatar size="lg" name={userProfile.display_name} src={userProfile.profile_photo_url} />
                    <Dropzone
                      selectedFiles={selectedImages}
                      onChange={onSelectImage}
                      onRemove={onRemoveImage}
                      maxUploads={1}
                    />
                  </Stack>
                </Stack>
              </FormControl>
              <FormControl isInvalid={!!errors.bio}>
                <Stack
                  direction={{ base: 'column', md: 'row' }}
                  spacing={{ base: '1.5', md: '8' }}
                  justify="space-between"
                >
                  <FormLabel variant="inline">Bio</FormLabel>
                  <Stack w="full">
                    <Textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      resize="vertical"
                      maxW={{ md: '3xl' }}

                    />
                    <FormErrorMessage>{errors.bio}</FormErrorMessage>
                    <Box fontSize="sm" color="gray.500" mt={1}>
                      {formData.bio.length}/500 characters
                    </Box>
                  </Stack>

                </Stack>
              </FormControl>

              <FormControl isInvalid={!!errors.phone}>
                <Stack
                  direction={{ base: 'column', md: 'row' }}
                  spacing={{ base: '1.5', md: '8' }}
                  justify="space-between"
                >
                  <FormLabel variant="inline">Phone Number</FormLabel>
                  <Stack w="full">
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+254 XXX XXX XXX or 07XX XXX XXX"
                      type="tel"
                    />
                    <FormErrorMessage>{errors.phone}</FormErrorMessage>
                  </Stack>
                </Stack>
              </FormControl>

              <FormControl isInvalid={!!errors.location_text}>
                <Stack
                  direction={{ base: 'column', md: 'row' }}
                  spacing={{ base: '1.5', md: '8' }}
                  justify="space-between"
                >
                  <FormLabel variant="inline">Location</FormLabel>
                  <Stack w="full">
                    <Input
                      name="location_text"
                      value={formData.location_text}
                      onChange={handleInputChange}
                      placeholder="Your location"
                    />
                    <FormErrorMessage>{errors.location_text}</FormErrorMessage>
                  </Stack>
                </Stack>
              </FormControl>

              {/* Seeker-specific fields */}
              {userProfile.role === 'seeker' && (
                <>


                  <FormControl>
                    <Stack
                      direction={{ base: 'column', md: 'row' }}
                      spacing={{ base: '1.5', md: '8' }}
                      justify="space-between"
                    >
                      <FormLabel variant="inline">Living Situation</FormLabel>
                      <Stack w="full" maxW={{ md: '3xl' }}>
                        <Select
                          placeholder="Select your living situation"
                          value={seekerFormData.living_situation}
                          onChange={(e) => setSeekerFormData(prev => ({ ...prev, living_situation: e.target.value }))}
                        >
                          <option value="apartment">Apartment</option>
                          <option value="compound">Compound with yard</option>
                          <option value="farm">Farm/Rural property</option>
                        </Select>
                      </Stack>
                    </Stack>
                  </FormControl>

                  <FormControl>
                    <Stack
                      direction={{ base: 'column', md: 'row' }}
                      spacing={{ base: '1.5', md: '8' }}
                      justify="space-between"
                    >
                      <FormLabel variant="inline">Experience Level</FormLabel>
                      <Stack w="full">
                        <Select
                          placeholder="Select your experience level"
                          value={seekerFormData.experience_level}
                          onChange={(e) => setSeekerFormData(prev => ({ ...prev, experience_level: e.target.value }))}
                          maxW={{ md: '3xl' }}
                        >
                          <option value="beginner">Beginner - First time dog owner</option>
                          <option value="intermediate">Intermediate - Some experience</option>
                          <option value="experienced">Experienced - Multiple dogs owned</option>
                        </Select>
                      </Stack>
                    </Stack>
                  </FormControl>

                  <FormControl>
                    <Stack
                      direction={{ base: 'column', md: 'row' }}
                      spacing={{ base: '1.5', md: '8' }}
                      justify="space-between"
                    >
                      <FormLabel variant="inline">Household Allergies</FormLabel>
                      <Stack w="full" maxW={{ md: '3xl' }}>
                        <RadioButtonGroup
                          value={seekerFormData.has_allergies.toString()}
                          onChange={(value) => setSeekerFormData(prev => ({ ...prev, has_allergies: value === 'true' }))}
                        >
                          <RadioButton value="true">Yes</RadioButton>
                          <RadioButton value="false">No</RadioButton>
                        </RadioButtonGroup>
                      </Stack>
                    </Stack>
                  </FormControl>

                  <FormControl>
                    <Stack
                      direction={{ base: 'column', md: 'row' }}
                      spacing={{ base: '1.5', md: '8' }}
                      justify="space-between"
                    >
                      <FormLabel variant="inline">Children at Home</FormLabel>
                      <Stack w="full" maxW={{ md: '3xl' }}>
                        <RadioButtonGroup
                          value={seekerFormData.has_children.toString()}
                          onChange={(value) => setSeekerFormData(prev => ({ ...prev, has_children: value === 'true' }))}
                        >
                          <RadioButton value="true">Yes</RadioButton>
                          <RadioButton value="false">No</RadioButton>
                        </RadioButtonGroup>
                      </Stack>
                    </Stack>
                  </FormControl>

                  <FormControl>
                    <Stack
                      direction={{ base: 'column', md: 'row' }}
                      spacing={{ base: '1.5', md: '8' }}
                      justify="space-between"
                    >
                      <FormLabel variant="inline">Other Pets at Home</FormLabel>
                      <Stack w="full" maxW={{ md: '3xl' }}>
                        <RadioButtonGroup
                          value={seekerFormData.has_other_pets.toString()}
                          onChange={(value) => setSeekerFormData(prev => ({ ...prev, has_other_pets: value === 'true' }))}
                        >
                          <RadioButton value="true">Yes</RadioButton>
                          <RadioButton value="false">No</RadioButton>
                        </RadioButtonGroup>
                      </Stack>
                    </Stack>
                  </FormControl>

                </>
              )}
            </Stack>

            <Button
              type="submit"
              colorScheme="brand"
              size="lg"
              isLoading={updateProfileMutation.isPending || uploadMutation.isPending}
              isDisabled={!hasChanges() || updateProfileMutation.isPending || uploadMutation.isPending}
              alignSelf="flex-end"
            >
              Save Changes
            </Button>
          </VStack>
        </form>
      </CardBody>
    </Card>
  );
};
