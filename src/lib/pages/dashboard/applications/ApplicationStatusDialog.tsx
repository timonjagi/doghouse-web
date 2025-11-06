import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, VStack, FormControl, FormLabel, Textarea, AlertDialogFooter, Button, Text } from '@chakra-ui/react';
import React from 'react'

interface ApplicationStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pendingAction: any
  setPendingAction: (any) => void;
  onSubmit: () => void;
  isLoading: boolean
}

function ApplicationStatusDialog({
  form,
  setForm,
  isOpen,
  onClose,
  pendingAction,
  setPendingAction,
  onSubmit,
  isLoading
}) {
  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={undefined} onClose={() => {
      setPendingAction(null);
      onClose();
    }}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {pendingAction?.title || 'Update Application Status'}
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
                          : "Add a reason for rejection..."
                      }
                      rows={3}
                    />
                  </FormControl>
                )}

                {pendingAction?.type === 'withdraw' && (
                  <Text>
                    Are you sure you want to withdraw this application? This action cannot be undone.
                  </Text>
                )}

                {pendingAction?.type === 'approve' && (
                  <Text>
                    Approving this application will notify the applicant and allow them to proceed with the adoption process.
                  </Text>
                )}

                {pendingAction?.type === 'reject' && (
                  <Text>
                    Rejecting this application will notify the applicant that their application was not approved.
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
              onClick={onSubmit}
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

export default ApplicationStatusDialog