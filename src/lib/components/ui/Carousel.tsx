import type { BoxProps, FlexProps, IconButtonProps } from "@chakra-ui/react";
import { Box, Flex, IconButton, useColorModeValue } from "@chakra-ui/react";
import type { KeenSliderOptions } from "keen-slider/react";
import { useKeenSlider } from "keen-slider/react"; // using version 6.6.10
import * as React from "react";

export const Carousel = React.forwardRef<HTMLDivElement, FlexProps>(
  function Carousel(props, ref) {
    return (
      <Flex
        ref={ref}
        className="chakra-carousel"
        overflow="hidden"
        position="relative"
        userSelect="none"
        {...props}
      />
    );
  }
);

export const CarouselSlide = (props: BoxProps) => (
  <Box
    className="chakra-carousel__slide"
    position="relative"
    overflow="hidden"
    width="100%"
    minH="100%"
    {...props}
  />
);

export const CarouselIconButton = (props: IconButtonProps) => (
  <IconButton
    variant="unstyled"
    boxSize="auto"
    minW="auto"
    display="inline-flex"
    fontSize="2xl"
    color={useColorModeValue("gray.600", "gray.400")}
    _hover={{
      color: useColorModeValue("blue.500", "blue.300"),
      _disabled: { color: useColorModeValue("gray.600", "gray.400") },
    }}
    _active={{ color: useColorModeValue("blue.600", "blue.400") }}
    _focus={{ boxShadow: "none" }}
    _focusVisible={{ boxShadow: "outline" }}
    {...props}
  />
);

export const useCarousel = (options?: KeenSliderOptions) => {
  const defaultOptions = { selector: ".chakra-carousel__slide" };
  return useKeenSlider<HTMLDivElement>({ ...defaultOptions, ...options });
};
