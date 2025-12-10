import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, VStack, FormControl, FormLabel, Textarea, AlertDialogFooter, Button, Text } from '@chakra-ui/react';
import React from 'react'

interface AdoptionStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pendingAction: any
  setPendingAction: (any) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean
  form: any;
  setForm: (any) => void;
}

const AdoptionStatusDialog: React.FC<AdoptionStatusDialogProps> = ({
  form,
  setForm,
  isOpen,
  onClose,
  pendingAction,
  setPendingAction,
  onSubmit,
  isLoading
}) => {
  return (
    <AlertDialog isCentered isOpen={isOpen} leastDestructiveRef={undefined} onClose={() => {
      setPendingAction(null);
      onClose();
    }}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {pendingAction?.title || 'Update Adoption Status'}
          </AlertDialogHeader>
          <AlertDialogBody>
            <form onSubmit={onSubmit}>
              <VStack spacing={4} align="stretch">
                {pendingAction?.type !== 'withdraw' && (
                  <FormControl>
                    <FormLabel>Response Message (Optional)</FormLabel>
                    <Textarea
                      value={form.response_message}
                      onChange={(e) => setForm({ ...form, response_message: e.target.value })}
                      placeholder={
                        pendingAction?.type === 'approve'
                          ? "Add a welcome message for the applicant..."
                          : pendingAction?.type === 'reject' ? "Add a reason for rejection..."
                            : "Add a message for the applicant..."
                      }
                      rows={3}
                    />
                  </FormControl>
                )}

                {pendingAction?.type === 'withdraw' && (
                  <Text>
                    Are you sure you want to withdraw this adoption request? This action cannot be undone.
                  </Text>
                )}

                {pendingAction?.type === 'approve' && (
                  <Text>
                    Approving this adoption will notify the applicant and allow them to proceed with the process.
                  </Text>
                )}

                {pendingAction?.type === 'reject' && (
                  <Text>
                    Rejecting this adoption will notify the applicant that their request was not approved.
                  </Text>
                )}
              </VStack>
            </form>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={() => {
              setPendingAction(null);
              onClose();
            }}>
              Cancel
            </Button>
            <Button
              colorScheme={pendingAction?.colorScheme || 'blue'}
              onClick={() => onSubmit()}
              ml={3}
              isLoading={isLoading}
            >
              {pendingAction?.confirmText || 'Confirm'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default AdoptionStatusDialog;
