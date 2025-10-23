import { useToast } from "@chakra-ui/react";
import { useState } from "react";

interface UseDropZoneProps {
  selectedImages: File[] | string[];
  setSelectedImages: (images: any) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export const useDropZone = ({
  selectedImages,
  setSelectedImages,
  maxFiles = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
}: UseDropZoneProps) => {
  const toast = useToast();

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    // Validate file types
    const validFiles = files.filter(file => acceptedTypes.includes(file.type));

    if (validFiles.length < files.length) {
      toast({
        title: "Invalid file format",
        description: "Please select only image files (JPEG, PNG, WebP)",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
    }

    // Check max files limit
    const totalFiles = selectedImages.length + validFiles.length;
    if (totalFiles > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} images allowed`,
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    // Check for duplicates
    const newFiles = validFiles.filter(file => {
      return !selectedImages.some(existingFile =>
        existingFile.name === file.name && existingFile.size === file.size
      );
    });

    if (newFiles.length < validFiles.length) {
      toast({
        title: "Duplicate files removed",
        description: "Some files were already selected",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }

    setSelectedImages([...selectedImages, ...newFiles]);
  };

  const onRemoveImage = (index: number) => {
    const files = [...selectedImages].filter((_, i) => i !== index);
    setSelectedImages(files);
  };

  const clearImages = () => {
    setSelectedImages([]);
  };

  return {
    onSelectImage,
    onRemoveImage,
    clearImages,
    selectedImages,
    isMaxFiles: selectedImages.length >= maxFiles,
  };
};
