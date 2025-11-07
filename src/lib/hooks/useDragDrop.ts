import { useCallback, useState } from 'react';
import { useToast } from '@chakra-ui/react';

interface UseDragDropProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

export const useDragDrop = ({
  onFilesSelected,
  maxFiles = 10,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
}: UseDragDropProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const toast = useToast();

  const validateFiles = useCallback((files: File[]): File[] => {
    const validFiles: File[] = [];

    for (const file of files) {
      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported image format`,
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        continue;
      }

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the ${maxSize}MB size limit`,
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  }, [acceptedTypes, maxSize, toast]);

  const processFiles = useCallback((files: File[]) => {
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  }, [validateFiles, onFilesSelected]);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);

    const files = Array.from(event.dataTransfer.files);
    processFiles(files);
  }, [processFiles]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
  }, []);

  const onFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    processFiles(files);

    // Reset input value to allow selecting the same file again
    event.target.value = '';
  }, [processFiles]);

  return {
    isDragActive,
    onDrop,
    onDragOver,
    onDragLeave,
    onFileInputChange,
    getInputProps: () => ({
      type: 'file',
      multiple: true,
      accept: acceptedTypes.join(','),
      onChange: onFileInputChange,
      style: { display: 'none' }
    }),
    getRootProps: () => ({
      onDrop,
      onDragOver,
      onDragLeave,
    })
  };
};
