import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { FiThumbsUp, FiThumbsDown, FiEye } from "react-icons/fi";
import { SupportFAQ as SupportFAQType } from "../../db/schema";
import {
  useTrackFAQView,
  useVoteFAQ,
} from "../../hooks/queries/useSupportFAQs";

interface SupportFAQProps {
  faq: SupportFAQType & {
    support_categories?: {
      id: string;
      name: string;
      icon?: string;
    };
  };
  showCategory?: boolean;
  showVotes?: boolean;
  showViewCount?: boolean;
}

export const SupportFAQ: React.FC<SupportFAQProps> = ({
  faq,
  showCategory = true,
  showVotes = true,
  showViewCount = true,
}) => {
  const toast = useToast();
  const [userVote, setUserVote] = useState<"helpful" | "not_helpful" | null>(
    null
  );

  const trackView = useTrackFAQView();
  const voteFAQ = useVoteFAQ();

  const handleView = () => {
    if (!faq.view_count || faq.view_count === 0) {
      trackView.mutate(faq.id, {
        onSuccess: () => {
          // View count will be updated via query invalidation
        },
        onError: (error) => {
          console.error("Failed to track FAQ view:", error);
        },
      });
    }
  };

  const handleVote = (isHelpful: boolean) => {
    const voteType = isHelpful ? "helpful" : "not_helpful";

    voteFAQ.mutate(
      { faqId: faq.id, isHelpful },
      {
        onSuccess: () => {
          setUserVote(voteType);
          toast({
            title: "Thank you for your feedback!",
            status: "success",
            duration: 2000,
          });
        },
        onError: (error) => {
          toast({
            title: "Failed to submit feedback",
            description: error.message,
            status: "error",
            duration: 3000,
          });
        },
      }
    );
  };

  return (
    <Box borderWidth="1px" borderRadius="md" p={4} bg="white">
      <Accordion allowToggle>
        <AccordionItem border="none">
          <AccordionButton
            onClick={handleView}
            _hover={{ bg: "gray.50" }}
            px={0}
            py={2}
          >
            <Box flex="1" textAlign="left">
              <VStack align="start" spacing={2}>
                <HStack spacing={2} wrap="wrap">
                  {showCategory && faq.support_categories && (
                    <Badge colorScheme="blue" variant="subtle">
                      {faq.support_categories.name}
                    </Badge>
                  )}
                  {faq.is_featured && (
                    <Badge colorScheme="purple" variant="subtle">
                      Featured
                    </Badge>
                  )}
                </HStack>

                <Text fontWeight="semibold" fontSize="md" lineHeight="tight">
                  {faq.question}
                </Text>

                {showViewCount && faq.view_count > 0 && (
                  <HStack spacing={1} color="gray.500" fontSize="sm">
                    <Icon as={FiEye} />
                    <Text>{faq.view_count} views</Text>
                  </HStack>
                )}
              </VStack>
            </Box>
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel pb={4}>
            <VStack align="start" spacing={4}>
              <Text color="gray.700" whiteSpace="pre-wrap">
                {faq.answer}
              </Text>

              {showVotes && (
                <HStack spacing={4}>
                  <Text fontSize="sm" color="gray.600">
                    Was this helpful?
                  </Text>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      variant={userVote === "helpful" ? "solid" : "outline"}
                      colorScheme={userVote === "helpful" ? "green" : "gray"}
                      leftIcon={<FiThumbsUp />}
                      onClick={() => handleVote(true)}
                      isLoading={voteFAQ.isPending}
                      isDisabled={userVote !== null}
                    >
                      Yes ({faq.helpful_votes || 0})
                    </Button>
                    <Button
                      size="sm"
                      variant={userVote === "not_helpful" ? "solid" : "outline"}
                      colorScheme={userVote === "not_helpful" ? "red" : "gray"}
                      leftIcon={<FiThumbsDown />}
                      onClick={() => handleVote(false)}
                      isLoading={voteFAQ.isPending}
                      isDisabled={userVote !== null}
                    >
                      No ({faq.not_helpful_votes || 0})
                    </Button>
                  </HStack>
                </HStack>
              )}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
