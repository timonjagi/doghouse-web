import type { IconButtonProps, StackProps } from "@chakra-ui/react";
import {
  AspectRatio,
  Box,
  Circle,
  HStack,
  IconButton,
  Image,
  Skeleton,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

import type { ProductImage } from "./_data";
import { Carousel, CarouselSlide, useCarousel } from "./Carousel";

interface GalleryProps {
  images: ProductImage[];
  aspectRatio?: number;
  rootProps?: StackProps;
}

const CarouselIconButton = (props: IconButtonProps) => (
  <IconButton
    display="none"
    fontSize="lg"
    isRound
    boxShadow="base"
    bg={useColorModeValue("white", "gray.800")}
    _hover={{
      bg: useColorModeValue("gray.100", "gray.700"),
    }}
    _active={{
      bg: useColorModeValue("gray.200", "gray.600"),
    }}
    _focus={{ boxShadow: "inerhit" }}
    _focusVisible={{ boxShadow: "outline" }}
    {...props}
  />
);

export const Gallery = (props: GalleryProps) => {
  const { images, aspectRatio = 4 / 3, rootProps } = props;

  const [currentSlide, setCurrentSlide] = React.useState(0);

  const [ref, slider] = useCarousel({
    slideChanged: (sliderInstance) =>
      setCurrentSlide(sliderInstance.track.details.rel),
  });

  const hasPrevious = currentSlide !== 0;
  const hasNext = currentSlide < images.length - 1;

  return (
    <Stack spacing="4" {...rootProps}>
      <Box
        position="relative"
        sx={{
          _hover: {
            "> button": {
              display: "inline-flex",
            },
          },
        }}
      >
        <Carousel ref={ref}>
          {images.map((image) => (
            <CarouselSlide key={image.src}>
              <AspectRatio
                ratio={aspectRatio}
                transition="all 200ms"
                opacity={currentSlide === images.indexOf(image) ? 1 : 0.4}
                _hover={{ opacity: 1 }}
              >
                <Image
                  src={image.src}
                  objectFit="cover"
                  alt={image.alt}
                  fallback={<Skeleton />}
                />
              </AspectRatio>
            </CarouselSlide>
          ))}
        </Carousel>
        {hasPrevious && (
          <CarouselIconButton
            pos="absolute"
            left="3"
            top="50%"
            transform="translateY(-50%)"
            onClick={() => slider.current?.prev()}
            icon={<IoChevronBackOutline />}
            aria-label="Previous Slide"
          />
        )}

        {hasNext && (
          <CarouselIconButton
            pos="absolute"
            right="3"
            top="50%"
            transform="translateY(-50%)"
            onClick={() => slider.current?.next()}
            icon={<IoChevronForwardOutline />}
            aria-label="Next Slide"
          />
        )}
        <HStack
          position="absolute"
          width="full"
          justify="center"
          bottom="0"
          py="4"
        >
          {images.map((image) => (
            <Circle
              key={image.src}
              size="2"
              bg={
                currentSlide === images.indexOf(image)
                  ? "white"
                  : "whiteAlpha.400"
              }
            />
          ))}
        </HStack>
      </Box>
    </Stack>
  );
};
