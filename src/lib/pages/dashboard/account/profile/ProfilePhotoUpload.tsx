import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  VStack,
  HStack,
  Avatar,
  Text,
  useToast,
  IconButton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FiUpload, FiTrash2 } from 'react-icons/fi';
import { useUploadProfilePhoto, useUpdateUserProfile } from 'lib/hooks/queries';
import { User } from '../../../../../../db/schema';

interface ProfilePhotoUploadProps {
  userProfile: User;
}

export const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  userProfile,
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadProfilePhoto();
  const updateProfileMutation = useUpdateUserProfile();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file.',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB.',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadMutation.mutateAsync(selectedFile);

      toast({
        title: 'Profile photo updated',
        description: 'Your profile photo has been updated successfully.',
        status: 'success',
        duration: 3000,
      });

      // Clear selection
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    try {
      // Set profile_photo_url to null to remove the current photo
      await updateProfileMutation.mutateAsync({ profile_photo_url: null });

      toast({
        title: 'Profile photo removed',
        description: 'Your profile photo has been removed.',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Failed to remove photo',
        description: error instanceof Error ? error.message : 'Something went wrong',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Card>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size={{ base: 'xs', lg: 'sm' }} mb={2}>
              Profile Photo
            </Heading>
            <Text color="gray.600" fontSize="sm">
              Upload a profile photo to personalize your account.
            </Text>
          </Box>

          {/* Current/Preview Photo Display */}
          <HStack spacing={6} align="start">
            <Box>
              <Avatar
                size="xl"
                src={previewUrl || userProfile.profile_photo_url || undefined}
                name={userProfile.display_name || userProfile.email || 'User'}
                bg="brand.500"
                color="white"
              />
            </Box>

            <VStack align="start" spacing={3} flex={1}>
              {!selectedFile ? (
                <>
                  <Text fontSize="sm" color="gray.600">
                    {userProfile.profile_photo_url
                      ? 'Current profile photo'
                      : 'No profile photo uploaded'
                    }
                  </Text>

                  <HStack spacing={3}>
                    <Button
                      leftIcon={<FiUpload />}
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      isLoading={uploadMutation.isPending}
                    >
                      {userProfile.profile_photo_url ? 'Change Photo' : 'Upload Photo'}
                    </Button>

                    {userProfile.profile_photo_url && (
                      <IconButton
                        aria-label="Remove photo"
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="outline"
                        colorScheme="red"
                        onClick={handleRemovePhoto}
                        isLoading={uploadMutation.isPending}
                      />
                    )}
                  </HStack>
                </>
              ) : (
                <>
                  <Text fontSize="sm" color="gray.600">
                    New photo selected: {selectedFile.name}
                  </Text>

                  <HStack spacing={3}>
                    <Button
                      colorScheme="brand"
                      size="sm"
                      onClick={handleUpload}
                      isLoading={uploadMutation.isPending}
                    >
                      Upload Photo
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      isDisabled={uploadMutation.isPending}
                    >
                      Cancel
                    </Button>
                  </HStack>
                </>
              )}
            </VStack>
          </HStack>

          {/* File Size Info */}
          <Alert status="info" size="sm">
            <AlertIcon />
            <Text fontSize="sm">
              Supported formats: JPG, PNG, WebP. Maximum file size: 5MB.
            </Text>
          </Alert>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </VStack>
      </CardBody>
    </Card>
  );
};
