import React, { useState, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Progress,
  Image,
  Button,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { CloseIcon, AttachmentIcon } from '@chakra-ui/icons';
import { IoDocument, IoImage } from 'react-icons/io5';
import { supabase } from '../../supabase/client';

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
}

interface FileAttachmentProps {
  attachments: FileAttachment[];
  onAttachmentsChange: (attachments: FileAttachment[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  disabled?: boolean;
}

const FileAttachmentComponent: React.FC<FileAttachmentProps> = ({
  attachments,
  onAttachmentsChange,
  maxFiles = 5,
  maxSize = 10,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const dragOverColor = useColorModeValue('blue.50', 'blue.900');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`;
    }

    // Check file count
    if (attachments.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }

    // Check file type (basic validation)
    const allowedTypes = [
      'image/',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/zip',
      'application/x-rar-compressed',
    ];

    const isAllowed = allowedTypes.some(type => file.type.startsWith(type));
    if (!isAllowed) {
      return 'File type not supported';
    }

    return null;
  };

  const uploadFile = async (file: File): Promise<FileAttachment> => {
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fileExt = file.name.split('.').pop();
    const fileName = `${fileId}.${fileExt}`;
    const filePath = `message-attachments/${fileName}`;

    setUploadingFiles(prev => new Set(prev).add(fileId));

    try {
      const { error: uploadError } = await supabase.storage
        .from('message-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('message-attachments')
        .getPublicUrl(filePath);

      return {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: publicUrl,
      };
    } finally {
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        toast({
          title: 'File validation error',
          description: validationError,
          status: 'error',
          duration: 3000,
        });
        continue;
      }

      try {
        const attachment = await uploadFile(file);
        onAttachmentsChange([...attachments, attachment]);
      } catch (error) {
        toast({
          title: 'Upload failed',
          description: `Failed to upload ${file.name}`,
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (attachmentId: string) => {
    onAttachmentsChange(attachments.filter(att => att.id !== attachmentId));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <IoImage size={20} />;
    }
    return <IoDocument size={20} />;
  };

  return (
    <VStack spacing={3} align="stretch">
      {/* File Drop Zone */}
      {!disabled && attachments.length < maxFiles && (
        <Box
          border="2px dashed"
          borderColor={isDragOver ? 'blue.400' : borderColor}
          borderRadius="md"
          p={4}
          bg={isDragOver ? dragOverColor : bgColor}
          transition="all 0.2s"
          cursor="pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          _hover={{ borderColor: 'blue.400' }}
        >
          <VStack spacing={2}>
            <AttachmentIcon boxSize={6} color="gray.500" />
            <Text fontSize="sm" color="gray.600" textAlign="center">
              Drop files here or click to browse
            </Text>
            <Text fontSize="xs" color="gray.500">
              Max {maxFiles} files, {maxSize}MB each
            </Text>
          </VStack>
        </Box>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        disabled={disabled}
      />

      {/* Attachment List */}
      {attachments.length > 0 && (
        <VStack spacing={2} align="stretch">
          {attachments.map((attachment) => (
            <Box
              key={attachment.id}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="md"
              p={3}
              bg={useColorModeValue('white', 'gray.800')}
            >
              <HStack justify="space-between" align="center">
                <HStack spacing={3} flex={1}>
                  {/* File Icon or Preview */}
                  {attachment.type.startsWith('image/') && attachment.url ? (
                    <Image
                      src={attachment.url}
                      alt={attachment.name}
                      boxSize="40px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  ) : (
                    <Box color="gray.500">
                      {getFileIcon(attachment.type)}
                    </Box>
                  )}

                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                      {attachment.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {formatFileSize(attachment.size)}
                    </Text>
                  </VStack>
                </HStack>

                {/* Upload Progress */}
                {uploadingFiles.has(attachment.id) && (
                  <Progress size="sm" w="60px" isIndeterminate />
                )}

                {/* Remove Button */}
                {!uploadingFiles.has(attachment.id) && !disabled && (
                  <IconButton
                    aria-label="Remove attachment"
                    icon={<CloseIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => removeAttachment(attachment.id)}
                  />
                )}
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </VStack>
  );
};

export default FileAttachmentComponent;
