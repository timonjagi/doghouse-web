import { Box, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, ReactNode } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { ColumnHeader, ColumnHeading, ColumnIconButton } from "./Column";

interface HeaderWithTitleProps {
  title?: string;
  rightElement?: ReactNode;
  isScrolled?: boolean;
}

/**
 * Header component for detail pages (e.g., breeds/[id], listings/[id]).
 * Shows back button, title that appears on scroll, and optional right element.
 */
export const HeaderWithTitle = ({ title, rightElement, isScrolled = false }: HeaderWithTitleProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <ColumnHeader shadow={isScrolled ? "base" : "none"}>
      <HStack justify="space-between" width="full">
        <HStack spacing="3">
          <ColumnIconButton
            aria-label="Navigate back"
            icon={<FiArrowLeft />}
            onClick={handleBack}
          />
          {isScrolled && title && <ColumnHeading>{title}</ColumnHeading>}
        </HStack>
        {rightElement}
      </HStack>
    </ColumnHeader>
  );
};

interface DetailPageContainerProps {
  children: ReactNode;
  title?: string;
  rightElement?: ReactNode;
}

/**
 * Container for detail pages with scroll tracking and sticky header.
 * Use this to wrap detail page content.
 */
export const DetailPageContainer = ({
  children,
  title,
  rightElement,
}: DetailPageContainerProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Box
      flex="1"
      overflowY="auto"
      onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 32)}
    >
      <ColumnHeader shadow={isScrolled ? "base" : "none"}>
        <HStack justify="space-between" width="full">
          <HStack spacing="3">
            <ColumnIconButton
              aria-label="Navigate back"
              icon={<FiArrowLeft />}
              onClick={handleBack}
            />
            {isScrolled && title && <ColumnHeading>{title}</ColumnHeading>}
          </HStack>
          {rightElement}
        </HStack>
      </ColumnHeader>
      {children}
    </Box>
  );
};
