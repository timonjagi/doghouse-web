import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  Select,
  VStack,
  HStack,
  Text,
  useToast,
  Box,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import {
  useCreateSupportTicket,
  useUploadTicketAttachment,
} from "../../hooks/queries/useSupportTickets";
import { useSupportCategories } from "../../hooks/queries/useSupportCategories";
import { Dropzone } from "./Dropzone";

interface SupportTicketFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SupportTicketForm: React.FC<SupportTicketFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category_id: "",
    priority: "normal" as "low" | "normal" | "high" | "urgent",
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createTicket = useCreateSupportTicket();
  const uploadAttachment = useUploadTicketAttachment();
  const { data: categories = [] } = useSupportCategories();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: any) => {
    const files = Array.from(event.target.files as FileList);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.subject.trim() || !formData.description.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both subject and description",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create the ticket first
      const ticket = await createTicket.mutateAsync(formData);

      // Upload attachments if any
      if (attachments.length > 0) {
        const uploadPromises = attachments.map((file) =>
          uploadAttachment.mutateAsync({
            ticketId: ticket.id,
            file,
            filename: file.name,
          })
        );

        await Promise.all(uploadPromises);
      }

      toast({
        title: "Support ticket created",
        description: "We'll get back to you as soon as possible",
        status: "success",
        duration: 5000,
      });

      // Reset form
      setFormData({
        subject: "",
        description: "",
        category_id: "",
        priority: "normal",
      });
      setAttachments([]);

      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast({
        title: "Failed to create ticket",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        subject: "",
        description: "",
        category_id: "",
        priority: "normal",
      });
      setAttachments([]);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Support Ticket</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Alert status="info">
              <AlertIcon />
              <Text fontSize="sm">
                Our support team typically responds within 24 hours. For urgent
                issues, please select the appropriate priority level.
              </Text>
            </Alert>

            <FormControl isRequired>
              <FormLabel>Subject</FormLabel>
              <Input
                placeholder="Brief description of your issue"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                maxLength={255}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Please provide detailed information about your issue..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={6}
                resize="vertical"
              />
            </FormControl>

            <HStack spacing={4}>
              <FormControl flex={1}>
                <FormLabel>Category</FormLabel>
                <Select
                  placeholder="Select a category"
                  value={formData.category_id}
                  onChange={(e) =>
                    handleInputChange("category_id", e.target.value)
                  }
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl flex={1}>
                <FormLabel>Priority</FormLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) =>
                    handleInputChange("priority", e.target.value)
                  }
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </Select>
              </FormControl>
            </HStack>

            <Box>
              <FormLabel>Attachments (optional)</FormLabel>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Upload screenshots, documents, or other files that might help us
                understand your issue
              </Text>
              <Dropzone
                selectedFiles={attachments}
                onChange={handleFileChange}
                onRemove={removeAttachment}
                maxUploads={5}
              />

              {attachments.length > 0 && (
                <VStack align="start" spacing={2} mt={2}>
                  <Text fontSize="sm" fontWeight="semibold">
                    Attached files:
                  </Text>
                  {attachments.map((file, index) => (
                    <HStack key={index} w="full" justify="space-between">
                      <Text fontSize="sm">
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </Text>
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => removeAttachment(index)}
                      >
                        Remove
                      </Button>
                    </HStack>
                  ))}
                </VStack>
              )}
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={handleClose}
            isDisabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Creating ticket..."
          >
            Create Ticket
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
