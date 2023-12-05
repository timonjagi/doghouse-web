import {
  AspectRatio,
  HStack,
  Image,
  Skeleton,
  Stack,
  StackProps,
  useBreakpointValue,
} from "@chakra-ui/react";
import * as React from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import {
  Carousel,
  CarouselIconButton,
  CarouselSlide,
  useCarousel,
} from "./Carousel";
import { ProductImage } from "./_data";

interface GalleryProps {
  rootProps?: StackProps;
}

const images = [
  { id: 1, src: "golden_retriever_1", alt: "Golden Retriever" },
  { id: 2, src: "golden_retriever_2", alt: "Golden Retriever" },
  { id: 3, src: "golden_retriever_3", alt: "Golden Retriever" },
  { id: 4, src: "golden_retriever_4", alt: "Golden Retriever" },
  { id: 5, src: "golden_retriever_6", alt: "Golden Retriever" },
  { id: 6, src: "golden_retriever_8", alt: "Golden Retriever" },
  { id: 7, src: "golden_retriever_9", alt: "Golden Retriever" },
  { id: 8, src: "golden_retriever_10", alt: "Golden Retriever" },
  { id: 9, src: "golden_retriever_11", alt: "Golden Retriever" },
];

export const Gallery = (props: GalleryProps) => {
  const { rootProps } = props;
  const aspectRatio = 4 / 3;
  const [index, setIndex] = React.useState(0);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const slidesPerView = useBreakpointValue({ base: 3, md: 5 });

  const [ref, slider] = useCarousel({
    slides: {
      perView: slidesPerView,
      spacing: useBreakpointValue({ base: 16, md: 24 }),
    },
    slideChanged: (slider) => setCurrentSlide(slider.track.details.rel),
  });

  return (
    <Stack spacing="4" {...rootProps}>
      <AspectRatio ratio={aspectRatio}>
        <Image
          src={`/images/breeds/golden_retriever/doghousekenya_${images[index].src}.webp`}
          objectFit="cover"
          alt={images[index].alt}
          fallback={<Skeleton />}
        />
      </AspectRatio>
      <HStack spacing="4">
        <CarouselIconButton
          onClick={() => slider.current?.prev()}
          icon={<IoChevronBackOutline />}
          aria-label="Previous slide"
          disabled={currentSlide === 0}
        />
        <Carousel ref={ref} direction="row" width="full">
          {images.map((image, i) => (
            <CarouselSlide key={i} onClick={() => setIndex(i)} cursor="pointer">
              <AspectRatio
                ratio={aspectRatio}
                transition="all 200ms"
                opacity={index === i ? 1 : 0.4}
                _hover={{ opacity: 1 }}
              >
                <Image
                  src={`/images/breeds/golden_retriever/doghousekenya_${image.src}.webp`}
                  objectFit="cover"
                  alt={image.alt}
                  fallback={<Skeleton />}
                />
              </AspectRatio>
            </CarouselSlide>
          ))}
        </Carousel>
        <CarouselIconButton
          onClick={() => slider.current?.next()}
          icon={<IoChevronForwardOutline />}
          aria-label="Next slide"
          disabled={currentSlide + Number(slidesPerView) === images.length}
        />
      </HStack>
    </Stack>
  );
};
