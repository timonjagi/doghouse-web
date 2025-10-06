import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Link,
  useBreakpointValue,
  useColorModeValue,
  Card,
  CardBody,
  Divider,
  AspectRatio,
} from "@chakra-ui/react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import NextLink from "next/link";
import Footer from 'lib/components/layout/Footer';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <Card bg="bg-surface" shadow="lg">
      <CardBody p={{ base: 6, md: 8 }}>
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading size={{ base: "xs", md: "sm" }} mb={2}>
              Send us a Message
            </Heading>
            <Text color="muted">
              Have a question or need assistance? We'd love to hear from you.
            </Text>
          </Box>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel color="muted">Full Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    bg="bg-surface"
                    borderColor="gray.200"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="muted">Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    bg="bg-surface"
                    borderColor="gray.200"
                  />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                <FormControl>
                  <FormLabel color="muted">Phone Number</FormLabel>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+254 XXX XXX XXX"
                    bg="bg-surface"
                    borderColor="gray.200"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="muted">Subject</FormLabel>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What's this about?"
                    bg="bg-surface"
                    borderColor="gray.200"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel color="muted">Message</FormLabel>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us more about your inquiry..."
                  rows={5}
                  bg="bg-surface"
                  borderColor="gray.200"
                />
              </FormControl>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                w="full"
                mt={4}
              >
                Send Message
              </Button>
            </VStack>
          </form>
        </VStack>
      </CardBody>
    </Card>
  );
};

const ContactInfo = () => {
  const contactItems = [
    {
      icon: FaMapMarkerAlt,
      title: "Visit Us",
      content: "Nairobi, Kenya",
      description: "Come meet our team and some of our furry friends"
    },
    {
      icon: FaPhone,
      title: "Call Us",
      content: "+254 700 000 000",
      description: "Mon-Fri 9AM-6PM EAT"
    },
    {
      icon: FaEnvelope,
      title: "Email Us",
      content: "hello@doghousekenya.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: FaClock,
      title: "Business Hours",
      content: "Mon - Fri: 9:00 AM - 6:00 PM",
      description: "Sat: 10:00 AM - 4:00 PM"
    }
  ];

  return (
    <Card bg="bg-surface" shadow="lg">
      <CardBody p={{ base: 6, md: 8 }}>
        <VStack spacing={6} align="stretch">

          <MapSection />
          <VStack spacing={4} align="stretch">
            {contactItems.map((item, index) => (
              <HStack key={index} spacing={4} align="start">
                <Box
                  p={3}
                  bg="accent"
                  color="inverted"
                  borderRadius="lg"
                  flexShrink={0}
                >
                  <Icon as={item.icon} boxSize={5} />
                </Box>
                <Box flex={1}>
                  <Text fontWeight="semibold" mb={1}>
                    {item.title}
                  </Text>
                  <Text fontSize="sm" color="muted" mb={1}>
                    {item.content}
                  </Text>
                  {/* <Text fontSize="sm" color="gray.500">
                    {item.description}
                  </Text> */}
                </Box>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

const MapSection = () => {
  // Using a placeholder for the map - you can replace this with an actual map component
  return (
    <Card bg="bg-surface" shadow="lg">
      <CardBody p={0}>
        <AspectRatio ratio={16 / 9}>
          <Box
            bg="gray.100"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="lg"
          >
            <VStack spacing={2} color="gray.500">
              <Icon as={FaMapMarkerAlt} boxSize={8} />
              <Text fontSize="lg" fontWeight="medium">
                Interactive Map
              </Text>
              <Text fontSize="sm" textAlign="center" px={4}>
                Our location will be displayed here with an interactive map
              </Text>
            </VStack>
          </Box>
        </AspectRatio>
      </CardBody>
    </Card>
  );
};

const FAQSection = () => {
  const faqItems = [
    {
      question: "How do I get a dog?",
      answer: "Getting a dog through Doghouse is easy! We have a simple adoption process to ensure the best match between you and your future pet. Start by filling out our adoption application form where we'll learn about your lifestyle and preferences.",
      link: "/contact/adoption",
      linkText: "Start Your Adoption Journey"
    },

    {
      question: "What should I expect during the adoption process?",
      answer: "Our adoption process typically involves submitting an application, meeting with our team, visiting with available dogs, and completing the necessary paperwork. We guide you through each step to ensure a smooth experience."
    },
    {
      question: "Do you offer any support after adoption?",
      answer: "Yes! We provide ongoing support to all our adopters, including resources for training, health care guidance, and access to our community of dog lovers. We're here for you and your new companion."
    },
    {
      question: "How do I join your network of breeders?",
      answer: "We welcome responsible breeders who share our commitment to animal welfare and ethical breeding practices. Our breeder onboarding process ensures we maintain the highest standards for all our partner breeders.",
      link: "/contact/breeder",
      linkText: "Join Our Network"
    },
  ];

  return (
    <VStack spacing={6} align="stretch">
      <Box textAlign="center">
        <Heading size="md" mb={{ base: "3", md: "0" }}>
          Frequently Asked Questions
        </Heading>
        <Text color="muted">
          Find answers to common questions about our adoption process and services
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {faqItems.map((faq, index) => (
          <Card key={index} bg="bg-surface" shadow="lg">
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Heading size="sm" mb={3}>
                    {faq.question}
                  </Heading>
                  <Text color="muted" mb={4}>
                    {faq.answer}
                  </Text>
                  {faq.link && (
                    <Button
                      as={NextLink}
                      href={faq.link}
                      variant="outline"
                      colorScheme="brand"
                      size="sm"
                    >
                      {faq.linkText}
                    </Button>
                  )}
                </Box>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </VStack>
  );
};



function Contact() {
  return (
    <Box as="section" bg="bg-surface" minH="100vh">
      <Container maxW="7xl" py={{ base: 8, md: 12, lg: 16 }}>
        <Stack spacing={{ base: 8, md: 12, lg: 16 }}>
          {/* Header Section */}
          <Stack
            spacing={{
              base: "4",
              md: "6",
            }}
            textAlign="center"
          >
            <Stack spacing="4">

              <Heading
                size={useBreakpointValue({
                  base: "md",
                  md: "lg",
                })}
              >

                Contact Us
              </Heading>

              <Text
                fontSize={{
                  base: "lg",
                  md: "xl",
                }}
                color="muted"
                maxW="2xl"
                mx="auto"
              >
                Get in touch with our team. We're here to help you find your perfect furry companion
                or answer any questions you might have.
              </Text>
            </Stack>
          </Stack>
          {/* Main Content Grid - Form and Contact Info side by side */}
          <SimpleGrid
            columns={{ base: 1, lg: 2 }}
            spacing={{ base: 8, lg: 12 }}
          >
            <ContactInfo />


            {/* Contact Form */}
            <ContactForm />

            {/* Contact Information */}

          </SimpleGrid>


          {/* FAQ Section */}
          <FAQSection />
        </Stack>
      </Container>
      <Footer />
    </Box>
  );
}

export default Contact;
