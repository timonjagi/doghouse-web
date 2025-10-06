import { Box } from "@chakra-ui/react";
import * as React from "react";

import { Gallery } from "./Gallery";

const images = [
  {
    id: "01",
    src: "images/breeds/doghousekenya_golden_retriever_1.webp",
    alt: "Golden Retriever",
    title: "Golden Retriever",
  },
  /** ***********  ✨ Windsurf Command 🌟  ************ */
  {
    id: "02",
    src: "images/breeds/doghousekenya_boerboel_1.jpg",
    alt: "Boerboel",
    title: "Boerboel",
  },
  {
    id: "03",
    src: "images/breeds/doghousekenya_great_dane_1.jpg",
    alt: "Great Dane",
    title: "Great Dane",
  },
  {
    id: "04",
    src: "images/breeds/doghousekenya_maltese_1.jpg",
    alt: "Maltese",
    title: "Maltese",
  },
  {
    id: "05",
    src: "images/breeds/doghousekenya_siberian_husky_1.jpg",
    alt: "Siberian Husky",
    title: "Siberian Husky",
  },
  {
    id: "06",
    src: "images/breeds/doghousekenya_rotweiler_1.jpg",
    alt: "Rottweiler",
    title: "Rottweiler",
  },
  {
    id: "07",
    src: "images/breeds/doghousekenya_spaniel_1.jpg",
    alt: "Spaniel",
    title: "Spaniel",
  },
  {
    id: "08",
    src: "images/breeds/doghousekenya_st_bernard_1.jpg",
    alt: "St Bernard",
    title: "St Bernard",
  },
  {
    id: "09",
    src: "images/breeds/doghousekenya_labrador_1.jpg",
    alt: "Labrador",
    title: "Labrador",
  },
];

export const App = () => {
  return (
    <Box
      maxW="3xl"
      mx="auto"
      px={{ base: "4", md: "8", lg: "12" }}
      py={{ base: "6", md: "8", lg: "12" }}
    >
      <Gallery images={images} />
    </Box>
  );
};
