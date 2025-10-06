import { useToast } from "@chakra-ui/react";
import { useState } from "react";

export const useDropZone = ({ selectedImages, setSelectedImages }) => {
  const toast = useToast();

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    const reader = new FileReader();

    if (files?.length) {
      reader.readAsDataURL(files[0]);

      reader.onload = (readerEvent) => {
        const newFile = readerEvent.target?.result;
        if (newFile) {
          if (selectedImages.includes(newFile)) {
            return toast({
              title: "Image already selected",
              description: "Please select a different image",
              status: "error",
              duration: 4000,
            });
          }
          setSelectedImages([...selectedImages, newFile]);
        }
      };
    }
  };

  const onRemoveImage = (file) => {
    const files = selectedImages.filter(
      (selectedFile) => selectedFile !== file
    );
    setSelectedImages(files);
  };

  return {
    onSelectImage,
    onRemoveImage,
    selectedImages,
  };
};
