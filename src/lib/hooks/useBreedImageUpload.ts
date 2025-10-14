import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { supabase } from '../supabase/client';

interface UseBreedImageUploadProps {
  userId: string;
  breedId?: string;
  onUploadComplete?: (urls: string[]) => void;
}

export const useBreedImageUpload = ({
  userId,
  breedId,
  onUploadComplete
}: UseBreedImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();

  const uploadImages = async (images: File[]): Promise<string[]> => {
    if (!userId || images.length === 0) return [];

    setUploading(true);
    setProgress(0);

    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const fileName = `breed-${userId}-${Date.now()}-${Math.random()}.${image.name.split('.').pop()}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('breed-images')
          .upload(`user-${userId}/${fileName}`, image);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('breed-images')
          .getPublicUrl(`user-${userId}/${fileName}`);

        uploadedUrls.push(publicUrl);

        // Update progress
        setProgress(((i + 1) / images.length) * 100);
      }

      // Call completion callback if provided
      if (onUploadComplete) {
        onUploadComplete(uploadedUrls);
      }

      toast({
        title: "Images uploaded successfully!",
        description: `${uploadedUrls.length} breed image${uploadedUrls.length > 1 ? 's' : ''} uploaded.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setUploading(false);
    setProgress(0);
    return uploadedUrls;
  };

  const updateUserBreedWithImages = async (breedId: string, imageUrls: string[]) => {
    try {
      const { error } = await supabase
        .from('user_breeds')
        .update({
          images: imageUrls,
          updated_at: new Date().toISOString(),
        })
        .eq('id', breedId);

      if (error) throw error;

      toast({
        title: "Breed updated with images",
        description: "Your breed profile now includes the uploaded images.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

    } catch (error: any) {
      toast({
        title: "Failed to update breed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return {
    uploadImages,
    updateUserBreedWithImages,
    uploading,
    progress,
  };
};
