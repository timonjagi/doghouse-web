import React, { useState } from "react";
import {
  Box,
  Button,
  Textarea,
  VStack,
  HStack,
  Text,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
} from "@chakra-ui/react";
import { Rating } from "./Rating";
import { useCreateReview } from "../../hooks/queries/useReviews";

interface ReviewFormProps {
  adoptionId: string;
  onReviewSubmitted?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  adoptionId,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createReviewMutation = useCreateReview();
  const toast = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating for the breeder.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createReviewMutation.mutateAsync({
        adoption_id: adoptionId,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim() || undefined,
        is_anonymous: isAnonymous,
      });

      toast({
        title: "Review submitted!",
        description:
          "Thank you for sharing your experience. Your feedback helps other pet seekers.",
        status: "success",
        duration: 5000,
      });

      // Reset form
      setRating(0);
      setTitle("");
      setComment("");
      setIsAnonymous(false);

      onReviewSubmitted?.();
    } catch (error) {
      toast({
        title: "Failed to submit review",
        description: "Please try again later.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
      <VStack spacing={4} align="stretch">
        <Text fontWeight="bold" fontSize="lg">
          Share Your Experience
        </Text>

        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            Rating *
          </FormLabel>
          <Rating score={rating} interactive onChange={setRating} size="lg" />
          {rating > 0 && (
            <Text fontSize="xs" color="gray.600" mt={1}>
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </Text>
          )}
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            Review Title (Optional)
          </FormLabel>
          <Input
            placeholder="Summarize your experience..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            Your Review *
          </FormLabel>
          <Textarea
            placeholder="Tell others about your experience with this breeder..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={1000}
          />
          <Text fontSize="xs" color="gray.500" mt={1}>
            {comment.length}/1000 characters
          </Text>
        </FormControl>

        <Checkbox
          isChecked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          size="sm"
        >
          Submit anonymously
        </Checkbox>

        <Button
          colorScheme="brand"
          onClick={handleSubmit}
          isLoading={isSubmitting}
          loadingText="Submitting..."
          alignSelf="flex-start"
          isDisabled={!rating || !comment.trim()}
        >
          Submit Review
        </Button>
      </VStack>
    </Box>
  );
};
