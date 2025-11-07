import { useColorModeValue, Card, CardBody, VStack, HStack, Box, Button, Divider, FormControl, FormLabel, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Switch, Textarea, Text, Input, IconButton, Badge, SimpleGrid, useDisclosure, Select, Modal, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useStyleConfig, Alert, AlertIcon, CloseButton, useBreakpointValue, Img } from '@chakra-ui/react';
import React, { useRef, useState } from 'react'
import { DeleteIcon, AddIcon, AttachmentIcon } from '@chakra-ui/icons'

function HealthInfoStep({ data, updateData }) {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const isMobile = useBreakpointValue({ base: true, md: false });
  console.log(data.health);
  const selectedFileRef = useRef<HTMLInputElement>(null);

  const { isOpen: isAddVaccinationOpen, onOpen: onAddVaccinationOpen, onClose: onAddVaccinationClose } = useDisclosure();
  // Common dog vaccinations
  const commonVaccinations = [
    'Parvovirus',
    'Distemper',
    'Adenovirus (Canine Hepatitis)',
    'Parainfluenza',
    'DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)',
    'Rabies',
    'Bordetella (Kennel Cough)',
    'Leptospirosis',
    'Lyme Disease',
    'Canine Influenza',
    'Coronavirus',
    'Giardia',
    'Heartworm Prevention',
    'Flea/Tick Prevention'
  ];

  const updateVaccinations = (vaccinations) => {

    console.log('vaccinations', vaccinations);
    updateData({
      health: {
        ...data.health,
        vaccinations: vaccinations
      }
    });
  };

  const removeVaccination = (index) => {
    const currentVaccinations = data.health?.vaccinations || [];
    updateVaccinations(currentVaccinations.filter((_, i) => i !== index));
  };

  const updateHealthTests = (testType, value) => {
    updateData({
      health: {
        ...data.health,
        healthTests: {
          ...data.health?.healthTests,
          [testType]: value
        }
      }
    });
  };

  const updateCertificates = (files) => {
    updateData({
      health: {
        ...data.health,
        certificates: [...(data.health?.certificates || []), ...files]
      }
    });
  };

  const removeCertificate = (index) => {
    const currentCertificates = data.health?.certificates || [];
    updateData({
      health: {
        ...data.health,
        certificates: currentCertificates.filter((_, i) => i !== index)
      }
    });
  }

  return (
    <VStack spacing={6} align="stretch">

      <Box>
        <Text fontSize="md" fontWeight="semibold">
          Health Information
        </Text>
        <Text fontSize="sm" color="gray.600">
          Add health details and vaccination status
        </Text>
      </Box>
      <Card bg={bgColor}>
        <CardBody>
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between" align="center" >
              <Box>
                <Text fontSize="sm" fontWeight="semibold">Vaccinations</Text>
                <Text fontSize="xs" color="gray.500">
                  Add vaccinations the {data.type === 'single_pet' ? 'dog' : 'litter'} has received
                </Text>
              </Box>
              <Button
                size="sm"
                onClick={onAddVaccinationOpen}
                leftIcon={<AddIcon />}
                colorScheme="brand"
                variant="link"
              >
                {isMobile ? 'Add' : 'Add Vaccination '}
              </Button>
            </HStack>
            <Divider />

            <VStack spacing={3} align="stretch">
              {!data.health?.vaccinations?.length && (
                <Alert fontSize="xs" color="gray.500">
                  <AlertIcon />
                  No vaccinations added yet.
                </Alert>
              )}
              {(data.health?.vaccinations || []).map((vaccination, index) => (
                <VaccineCard
                  key={index}
                  vaccination={vaccination}
                  index={index}
                  removeVaccination={removeVaccination}
                />
              ))}
            </VStack>
          </VStack>
        </CardBody>
      </Card>

      <Card bg={bgColor}>
        <CardBody>
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between" align="center">
              <Box>
                <Text fontSize="sm" fontWeight="semibold">Health Certificates</Text>
                <Text fontSize="xs" color="gray.500">
                  Upload health certificates for the pet
                </Text>
              </Box>

              <Button
                variant="link"
                colorScheme="brand"
                size="sm"
                onClick={() => selectedFileRef.current?.click()}
                leftIcon={<AttachmentIcon />}
              >
                {isMobile ? 'Upload' : 'Upload Certificates'}
              </Button>
              <input
                hidden
                ref={selectedFileRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => updateCertificates(Array.from(e.target.files))}
              />
            </HStack>
            <Divider />


            <FormControl>
              {!data.health?.certificates?.length && (
                <Alert fontSize="xs" color="gray.500">
                  <AlertIcon />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Upload PDF or image files of health certificates
                  </Text>
                </Alert>
              )}

              {data.health?.certificates?.length > 0 && (
                <HStack mt={2} spacing={2} flexWrap="wrap">
                  {data.health.certificates.map((file, index) => (
                    <CertificateBadge
                      key={index}
                      file={file}
                      index={index}
                      removeCertificate={removeCertificate}
                    />
                  ))}
                </HStack>
              )}
            </FormControl>
          </VStack>
        </CardBody>
      </Card>

      {/* <Card bg={bgColor}>
        <CardBody>
          <VStack spacing={3} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="semibold">Health Tests</Text>
              <Text fontSize="xs" color="gray.600">
                Indicate which health tests have been performed
              </Text>
            </Box>

            <Divider />
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {[
                { key: 'dna', label: 'DNA Test' },
                { key: 'hips', label: 'Hip Score' },
                { key: 'eyes', label: 'Eye Test' },
                { key: 'heart', label: 'Heart Test' }
              ].map((test) => (
                <FormControl key={test.key} display="flex" alignItems="center" justifyContent="space-between">
                  <FormLabel fontSize="sm" mb={0}>{test.label}</FormLabel>
                  <Switch
                    isChecked={data.health?.healthTests?.[test.key] || false}
                    onChange={(e) => updateHealthTests(test.key, e.target.checked)}
                    colorScheme="brand"
                  />
                </FormControl>
              ))}
            </SimpleGrid>
          </VStack>
        </CardBody>
      </Card> */}

      <Card bg={bgColor}>
        <CardBody>
          <VStack spacing={3} align="stretch">
            <Box >
              <Text fontSize="sm" fontWeight="semibold">Medical Notes</Text>
              <Text fontSize="xs" color="gray.600"> Any health concerns or special care requirements</Text>
            </Box>
            <Divider />
            <FormControl>

              <Textarea
                size="sm"
                placeholder="Any health concerns or special care requirements..."
                value={data.health?.medicalNotes || ''}
                onChange={(e) => updateData({
                  health: {
                    ...data.health,
                    medicalNotes: e.target.value
                  }
                })}
                rows={3}
                bg="white"
              />
            </FormControl>
          </VStack>
        </CardBody>
      </Card>


      <AddVaccinationModal
        isOpen={isAddVaccinationOpen}
        onClose={onAddVaccinationClose}
        data={data}
        commonVaccinations={commonVaccinations}
        updateVaccinations={updateVaccinations}
        bgColor={bgColor}
      />
    </VStack>

  )
}

const AddVaccinationModal = ({ isOpen, onClose, data, commonVaccinations, updateVaccinations, bgColor }) => {

  const [newVaccinationType, setNewVaccinationType] = useState('');
  const [newVaccinationDate, setNewVaccinationDate] = useState('');
  const addVaccination = () => {
    if (newVaccinationType.trim() && newVaccinationDate) {
      const currentVaccinations = data.health?.vaccinations || [];

      const newVaccination = {
        type: newVaccinationType.trim(),
        date: newVaccinationDate,
        completed: true
      };

      updateVaccinations([...currentVaccinations, newVaccination]);
      setNewVaccinationType('');
      setNewVaccinationDate('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Vaccination</ModalHeader>
        <Stack spacing={4} px={{ base: "6", sm: "8", lg: "16" }}
        >
          <FormControl>
            <Select
              placeholder="Select vaccination type"
              value={newVaccinationType}
              onChange={(e) => setNewVaccinationType(e.target.value)}
              bg={bgColor}
              colorScheme="brand"
            >
              {commonVaccinations.map((vaccination) => (
                <option key={vaccination} value={vaccination} disabled={data.health?.vaccinations?.some(v => v.type === vaccination)}>
                  {vaccination}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <Input
              type="date"
              value={newVaccinationDate}
              onChange={(e) => setNewVaccinationDate(e.target.value)}
              bg={bgColor}
              colorScheme="brand"
            />
          </FormControl>

        </Stack>
        <ModalFooter >
          <Button variant="ghost" onClick={onClose}>Cancel</Button>

          <Button
            colorScheme="brand"
            mr={3}
            onClick={addVaccination}
            isDisabled={!newVaccinationType || !newVaccinationDate}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

  )
}

const VaccineCard = ({ vaccination, index, removeVaccination }) => {
  return (
    <Badge key={index} colorScheme="brand" variant="outline" px={3} py={2} borderRadius="md" w="full">
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" fontWeight="medium">{vaccination.type}</Text>
          <Text fontSize="xs" color="subtle">Date: {new Date(vaccination.date).toDateString()}</Text>
        </VStack>
        <CloseButton size="sm" ml={2} onClick={() => removeVaccination(index)} />
      </HStack>
    </Badge>
  )
}

const CertificateBadge = ({ file, index, removeCertificate }) => {
  return (
    <Box key={index} borderRadius="md" overflow="hidden" borderWidth={1}>
      <Img
        src={file && typeof file === 'string' ? file : URL.createObjectURL(file)}
        alt={`Photo ${index + 1}`}
        objectFit="cover"
        w="full"
        h="100px"
      />
      {file.name && <Badge key={index} colorScheme="brand" variant="outline" px={2} py={1} borderRadius="md">
        <HStack align="center" spacing={2} direction="row">
          <Text>{file.name}</Text>
          <CloseButton size="sm" ml={2} onClick={() => removeCertificate(index)} />
        </HStack>
      </Badge>}
    </Box>

  )
}

export default HealthInfoStep;
