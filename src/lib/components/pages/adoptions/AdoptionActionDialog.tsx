import React from "react";
import { useRouter } from "next/router";
import {
  useUpdateAdoption,
  AdoptionWithListing,
  useAdoptionTimelineLogic,
} from "../../../hooks/queries/useAdoptions";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  VStack,
  FormControl,
  FormLabel,
  Textarea,
  AlertDialogFooter,
  Button,
  Text,
  useToast,
  Box,
  HStack,
  Divider,
  Alert,
  AlertDescription,
  List,
  ListItem,
  ListIcon,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useAdoptionConversation } from "../../../hooks/queries/useContextConversations";
import { useInitiatePayment } from "../../../hooks/queries/usePayments";

interface AdoptionActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pendingAction: any;
  setPendingAction: (action: any) => void;
  adoption?: AdoptionWithListing;
  userProfile?: any;
}

const AdoptionActionDialog: React.FC<AdoptionActionDialogProps> = ({
  isOpen,
  onClose,
  pendingAction,
  setPendingAction,
  adoption,
  userProfile,
}) => {
  const router = useRouter();
  const toast = useToast();
  const updateAdoptionMutation = useUpdateAdoption();
  const initiatePaymentMutation = useInitiatePayment();
  const timelineLogic = useAdoptionTimelineLogic({
    adoption: adoption,
    userProfile,
  });

  const { createConversation } = useAdoptionConversation(adoption?.id || "");

  const [responseMessage, setResponseMessage] = React.useState("");

  const handleClose = () => {
    setPendingAction(null);
    setResponseMessage("");
    onClose();
  };

  const getPaymentDetails = () => {
    if (!adoption || !pendingAction) return { amount: 0, description: "" };
    const listing = adoption.listings;
    if (pendingAction.type === "pay_reservation") {
      return {
        amount: Number(listing.reservation_fee) || 0,
        description: `Reservation fee for ${listing.title}`,
      };
    } else if (pendingAction.type === "complete_payment") {
      const finalAmount =
        Number(listing.price) - Number(listing.reservation_fee);
      return {
        amount: Math.max(finalAmount, 0),
        description: `Final payment for ${listing.title}`,
      };
    }
    return { amount: 0, description: "" };
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pendingAction || !adoption) return;

    const startUrl = `/dashboard/adoptions/${adoption.id}`;

    switch (pendingAction.type) {
      case "pay_reservation":
      case "complete_payment":
        try {
          const { amount, description } = getPaymentDetails();
          const result = await initiatePaymentMutation.mutateAsync({
            amount,
            type:
              pendingAction.type === "pay_reservation"
                ? "reservation"
                : "final",
            applicationId: adoption.id,
            description,
            application: adoption,
          });

          if (result?.data?.authorization_url) {
            window.location.href = result.data.authorization_url;
            handleClose();
          } else {
            throw new Error("Payment initialization failed");
          }
        } catch (error: any) {
          toast({
            title: "Payment Error",
            description: error.message || "Failed to initialize payment",
            status: "error",
            duration: 5000,
          });
        }
        return;

      case "sign_contract":
        try {
          await updateAdoptionMutation.mutateAsync({
            id: adoption.id,
            updates: { contract_signed: true },
          });
          toast({
            title: "Contract Signed",
            description: "You have successfully signed the adoption contract.",
            status: "success",
            duration: 3000,
          });
          handleClose();
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || "Failed to sign contract",
            status: "error",
            duration: 5000,
          });
        }
        return;

      case "contact_breeder":
      case "contact_applicant":
        try {
          const participants =
            pendingAction.type === "contact_breeder"
              ? [adoption.listings.owner_id]
              : [adoption.seeker_id];

          const conversation = await createConversation(
            adoption.listings,
            participants,
            responseMessage.trim() || undefined
          );
          if (conversation) {
            router.push(`/dashboard/inbox/${conversation.id}`);
          }
          handleClose();
        } catch (error: any) {
          toast({
            title: "Error",
            description: "Failed to open conversation",
            status: "error",
            duration: 3000,
          });
        }
        return;

      case "leave_review":
        router.push(`${startUrl}?action=review`);
        handleClose();
        return;

      case "contact_support":
        // Navigate to support page with adoption context
        router.push("/support?adoption_id=" + adoption.id);
        handleClose();
        return;
    }

    // Handle status update actions
    if (
      ["withdraw", "approve", "reject", "complete"].includes(pendingAction.type)
    ) {
      try {
        await updateAdoptionMutation.mutateAsync({
          id: adoption.id,
          updates: {
            status: pendingAction.status,
          },
        });

        toast({
          title: pendingAction.title,
          description: pendingAction.message || "Action completed successfully",
          status: "success",
          duration: 3000,
        });

        handleClose();
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to update adoption",
          status: "error",
          duration: 5000,
        });
      }
    }
  };

  const isLoading =
    updateAdoptionMutation.isPending || initiatePaymentMutation.isPending;
  const isPaymentAction = ["pay_reservation", "complete_payment"].includes(
    pendingAction?.type
  );
  const isContactAction = [
    "contact_breeder",
    "contact_applicant",
    "contact_support",
  ].includes(pendingAction?.type);
  const { amount, description: paymentDesc } = getPaymentDetails();

  return (
    <AlertDialog
      isCentered
      isOpen={isOpen}
      leastDestructiveRef={undefined}
      onClose={handleClose}
      size={isPaymentAction ? "lg" : "md"}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {pendingAction?.title || "Action Confirmation"}
          </AlertDialogHeader>
          <AlertDialogBody>
            <VStack spacing={4} align="stretch">
              {/* Payment Summary */}
              {isPaymentAction && (
                <Box
                  p={4}
                  bg={useColorModeValue("gray.50", "gray.800")}
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.100"
                >
                  <VStack spacing={2} align="start">
                    <Text
                      fontSize="md"
                      fontWeight="semibold"
                      color={useColorModeValue("gray.700", "gray.200")}
                    >
                      {paymentDesc}
                    </Text>
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      color={useColorModeValue("brand.600", "brand.500")}
                    >
                      Ksh. {amount.toLocaleString()}
                    </Text>
                    <Alert
                      status="info"
                      borderRadius="md"
                      variant="subtle"
                      py={2}
                    >
                      <AlertDescription fontSize="xs">
                        {pendingAction.type === "pay_reservation"
                          ? "This amount will be deducted from your final payment"
                          : "Final payment amount (reservation fee already deducted)"}
                      </AlertDescription>
                    </Alert>
                  </VStack>
                </Box>
              )}

              {/* Message Controls (for status updates OR contact actions) */}
              {(isContactAction ||
                ["approve", "reject", "complete"].includes(
                  pendingAction?.type
                )) && (
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium">
                    {isContactAction
                      ? "Initial Message"
                      : "Response Message (Optional)"}
                  </FormLabel>
                  <Textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder={
                      isContactAction
                        ? "Type your message here..."
                        : pendingAction?.type === "approve"
                        ? "Add a welcome message for the applicant..."
                        : pendingAction?.type === "reject"
                        ? "Add a reason for rejection..."
                        : "Add a message for the applicant..."
                    }
                    rows={isContactAction ? 5 : 3}
                    size="sm"
                    borderRadius="md"
                  />
                </FormControl>
              )}

              {pendingAction?.dialogBody && (
                <Text
                  fontSize="sm"
                  color={useColorModeValue("gray.600", "gray.400")}
                >
                  {pendingAction.dialogBody}
                </Text>
              )}

              {/* Action Body & Info */}
              {!isPaymentAction &&
                !isContactAction &&
                !["withdraw", "approve", "reject", "complete"].includes(
                  pendingAction?.type
                ) &&
                (pendingAction?.dialogBody ||
                  timelineLogic.currentStep?.info) && (
                  <VStack align="stretch" spacing={3}>
                    {timelineLogic.currentStep?.info &&
                      timelineLogic.currentStep.info.length > 0 && (
                        <Box
                          bg={useColorModeValue("blue.50", "blue.800")}
                          p={3}
                          borderRadius="md"
                        >
                          <List spacing={2}>
                            {timelineLogic.currentStep.info.map((info, i) => (
                              <ListItem
                                key={i}
                                fontSize="xs"
                                color={useColorModeValue(
                                  "blue.700",
                                  "blue.500"
                                )}
                                display="flex"
                                alignItems="start"
                              >
                                <ListIcon
                                  as={ChevronRightIcon}
                                  color={useColorModeValue(
                                    "blue.400",
                                    "blue.500"
                                  )}
                                  mt={1}
                                />
                                {info}
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                  </VStack>
                )}

              {/* Payment Flow Info */}
              {isPaymentAction && (
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color="gray.500"
                    mb={2}
                    textTransform="uppercase"
                  >
                    What happens next?
                  </Text>
                  <List spacing={1} fontSize="xs" color="gray.600">
                    <ListItem display="flex" alignItems="center">
                      <ListIcon as={ChevronRightIcon} color="green.500" />
                      Redirect to Paystack secure checkout
                    </ListItem>
                    <ListItem display="flex" alignItems="center">
                      <ListIcon as={ChevronRightIcon} color="green.500" />
                      Complete payment with M-Pesa or Card
                    </ListItem>
                    <ListItem display="flex" alignItems="center">
                      <ListIcon as={ChevronRightIcon} color="green.500" />
                      Auto-update of adoption status
                    </ListItem>
                  </List>
                </Box>
              )}
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter
            borderTopWidth={isPaymentAction ? "1px" : 0}
            mt={2}
          >
            <Button
              isDisabled={isLoading}
              onClick={handleClose}
              size="sm"
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              colorScheme={pendingAction?.colorScheme || "blue"}
              onClick={() => handleSubmit()}
              ml={3}
              isLoading={isLoading}
              size="sm"
              loadingText={
                isPaymentAction ? "Initializing..." : "Submitting..."
              }
            >
              {isPaymentAction
                ? `Pay Ksh. ${amount.toLocaleString()}`
                : pendingAction?.confirmText || "Confirm"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AdoptionActionDialog;
