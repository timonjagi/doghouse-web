import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  Select,
  Switch,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { FiEdit, FiTrash, FiPlus, FiEye } from "react-icons/fi";
import {
  useSupportFAQs,
  useCreateFAQ,
  useUpdateFAQ,
  useDeleteFAQ,
} from "../../hooks/queries/useSupportFAQs";
import { useSupportCategories } from "../../hooks/queries/useSupportCategories";

type FAQWithCategory = {
  id: string;
  question: string;
  answer: string;
  category_id?: string;
  is_featured: boolean;
  is_active: boolean;
  view_count: number;
  helpful_votes: number;
  not_helpful_votes: number;
  created_by?: string;
  created_at: Date;
  updated_at: Date;
  support_categories?: {
    id: string;
    name: string;
  };
};

interface SupportFAQAdminProps {
  // Optional filtering props
}

export const SupportFAQAdmin: React.FC<SupportFAQAdminProps> = () => {
  const toast = useToast();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [editingFAQ, setEditingFAQ] = useState<any>(null);
  const [deletingFAQ, setDeletingFAQ] = useState<any>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category_id: "",
    is_featured: false,
    is_active: true,
  });

  const { data: faqsData = [], isLoading } = useSupportFAQs();
  const faqs = faqsData as FAQWithCategory[]; // Cast to include support_categories relation
  const { data: categories = [] } = useSupportCategories();
  const createFAQ = useCreateFAQ();
  const updateFAQ = useUpdateFAQ();
  const deleteFAQ = useDeleteFAQ();

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (faq: any) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category_id: faq.category_id || "",
      is_featured: faq.is_featured,
      is_active: faq.is_active,
    });
    onModalOpen();
  };

  const handleCreate = () => {
    setEditingFAQ(null);
    setFormData({
      question: "",
      answer: "",
      category_id: "",
      is_featured: false,
      is_active: true,
    });
    onModalOpen();
  };

  const handleDelete = (faq: any) => {
    setDeletingFAQ(faq);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (!deletingFAQ) return;

    try {
      await deleteFAQ.mutateAsync(deletingFAQ.id);
      toast({
        title: "FAQ deleted",
        status: "success",
        duration: 2000,
      });
      onDeleteClose();
      setDeletingFAQ(null);
    } catch (error: any) {
      toast({
        title: "Failed to delete FAQ",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both question and answer",
        status: "error",
        duration: 3000,
      });
      return;
    }

    try {
      if (editingFAQ) {
        await updateFAQ.mutateAsync({
          id: editingFAQ.id,
          updates: formData,
        });
        toast({
          title: "FAQ updated",
          status: "success",
          duration: 2000,
        });
      } else {
        await createFAQ.mutateAsync(formData);
        toast({
          title: "FAQ created",
          status: "success",
          duration: 2000,
        });
      }
      onModalClose();
      setEditingFAQ(null);
    } catch (error: any) {
      toast({
        title: `Failed to ${editingFAQ ? "update" : "create"} FAQ`,
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold">
          FAQ Management
        </Text>
        <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={handleCreate}>
          Add FAQ
        </Button>
      </HStack>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Question</Th>
            <Th>Category</Th>
            <Th>Status</Th>
            <Th>Views</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {faqs.map((faq) => (
            <Tr key={faq.id}>
              <Td>
                <VStack align="start" spacing={1}>
                  <Text fontWeight="semibold" noOfLines={2}>
                    {faq.question}
                  </Text>
                  {faq.is_featured && (
                    <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                      Featured
                    </Badge>
                  )}
                </VStack>
              </Td>
              <Td>{faq.support_categories?.name || "Uncategorized"}</Td>
              <Td>
                <Badge
                  colorScheme={faq.is_active ? "green" : "gray"}
                  variant="subtle"
                >
                  {faq.is_active ? "Active" : "Inactive"}
                </Badge>
              </Td>
              <Td>{faq.view_count || 0}</Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    aria-label="Edit FAQ"
                    icon={<FiEdit />}
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(faq)}
                  />
                  <IconButton
                    aria-label="Delete FAQ"
                    icon={<FiTrash />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleDelete(faq)}
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {faqs.length === 0 && !isLoading && (
        <Box textAlign="center" py={8}>
          <Text color="gray.500">No FAQs found</Text>
          <Button mt={4} leftIcon={<FiPlus />} onClick={handleCreate}>
            Create your first FAQ
          </Button>
        </Box>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={onModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingFAQ ? "Edit FAQ" : "Create FAQ"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Question</FormLabel>
                <Input
                  placeholder="Enter the FAQ question"
                  value={formData.question}
                  onChange={(e) =>
                    handleInputChange("question", e.target.value)
                  }
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Answer</FormLabel>
                <Textarea
                  placeholder="Enter the FAQ answer"
                  value={formData.answer}
                  onChange={(e) => handleInputChange("answer", e.target.value)}
                  rows={6}
                  resize="vertical"
                />
              </FormControl>

              <FormControl>
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

              <HStack spacing={4}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb={0}>Featured</FormLabel>
                  <Switch
                    isChecked={formData.is_featured}
                    onChange={(e) =>
                      handleInputChange("is_featured", e.target.checked)
                    }
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb={0}>Active</FormLabel>
                  <Switch
                    isChecked={formData.is_active}
                    onChange={(e) =>
                      handleInputChange("is_active", e.target.checked)
                    }
                  />
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={createFAQ.isPending || updateFAQ.isPending}
            >
              {editingFAQ ? "Update" : "Create"} FAQ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={undefined}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete FAQ
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this FAQ? This action cannot be
              undone.
              <br />
              <br />
              <strong>Question:</strong> {deletingFAQ?.question}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onDeleteClose}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={confirmDelete}
                ml={3}
                isLoading={deleteFAQ.isPending}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
