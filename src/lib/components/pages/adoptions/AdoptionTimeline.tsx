import React from "react";
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Badge,
  Icon,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  AdoptionWithListing,
  AdoptionStatusHistory,
  useAdoptionTimelineLogic,
} from "../../../hooks/queries/useAdoptions";
import { AdoptionActionList } from "./AdoptionActionList";

interface AdoptionTimelineProps {
  adoption: AdoptionWithListing;
  userProfile: any;
  transactions?: any[];
  statusHistory?: AdoptionStatusHistory[];
  availableActions?: any[]; // Defined button configs
}

export const AdoptionTimeline = React.forwardRef<
  {
    getCurrentStepButtons: () => any[];
  },
  AdoptionTimelineProps
>((props, ref) => {
  const router = useRouter();

  // Use the logic hook - no actions passed here anymore
  const { steps, currentStepIndex } = useAdoptionTimelineLogic({
    adoption: props.adoption,
    userProfile: props.userProfile,
    transactions: props.transactions,
    statusHistory: props.statusHistory,
  });

  // Export function to get current step buttons for use in parent components
  const getCurrentStepButtons = () => {
    return props.availableActions || [];
  };

  // Make this available to parent component
  React.useImperativeHandle(ref, () => ({
    getCurrentStepButtons,
  }));

  const { activeStep } = useSteps({
    index: currentStepIndex,
    count: steps.length,
  });

  return (
    <Stepper
      index={activeStep}
      orientation="vertical"
      height="fit-content"
      gap="0"
      w="full"
    >
      {steps.map((step, index) => (
        <Step
          key={index}
          style={{
            width: "100%",
            marginBottom: index === steps.length - 1 ? 0 : "24px",
          }}
        >
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box flexShrink="0" width="100%" pl={4}>
            <StepTitle
              fontSize="md"
              fontWeight="bold"
              color={step.status === "current" ? "brand.600" : "gray.800"}
            >
              {step.title}
            </StepTitle>
            <StepDescription fontSize="sm" color="gray.600">
              {step.description}
            </StepDescription>

            {/* Render Actions ONLY for the current step */}
            {step.status === "current" && (
              <Box mt={3}>
                <AdoptionActionList
                  adoption={props.adoption}
                  userProfile={props.userProfile}
                  transactions={props.transactions}
                  variant="timeline"
                />
              </Box>
            )}
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
});
