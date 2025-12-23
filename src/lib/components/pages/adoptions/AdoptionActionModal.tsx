import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ModalCloseButton,
} from '@chakra-ui/react';
import { AdoptionWithListing } from '../../../hooks/queries/useAdoptions';
import { AdoptionActionList } from './AdoptionActionList';

interface AdoptionActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  adoption: AdoptionWithListing;
  userProfile: any;
  transactions?: any[];
}

export const AdoptionActionModal: React.FC<AdoptionActionModalProps> = ({
  isOpen,
  onClose,
  adoption,
  userProfile,
  transactions = [],
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="xl" overflow="hidden">
        <ModalHeader borderBottomWidth="1px" py={4}>
          Next Required Action
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={6}>
          <AdoptionActionList
            adoption={adoption}
            userProfile={userProfile}
            transactions={transactions}
            variant="timeline" // Using timeline look inside modal is usually good
          />
        </ModalBody>
        <ModalFooter bg="gray.50" py={3}>
          <Button variant="ghost" mr={3} onClick={onClose} size="sm">
            Review Details
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
