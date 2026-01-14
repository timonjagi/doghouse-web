import { Box, HStack, useDisclosure, Badge, IconButton, Drawer, DrawerOverlay, DrawerContent } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, ReactNode } from "react";
import { FiArrowLeft, FiBell } from "react-icons/fi";
import { ColumnHeader, ColumnHeading, ColumnIconButton } from "./Column";
import { useCounts } from '@novu/react';
import { NotificationsDrawer } from "./NotificationsDrawer";

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

  const { counts } = useCounts({ filters: [{ read: false }] });
  const unreadCount = counts?.[0]?.count ?? 0;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleBack = () => {
    router.back();
  };

  return (
    <>
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
          <HStack spacing={2}>
            {rightElement}

          </HStack>
        </HStack>
      </ColumnHeader>
    </>
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

  const { counts } = useCounts({ filters: [{ read: false }] });
  const unreadCount = counts?.[0]?.count ?? 0;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleBack = () => {
    router.back();
  };

  return (
    <Box
      flex="1"
      overflowY="auto"
      onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 32)}
    >
      {/* <ColumnHeader shadow={isScrolled ? "base" : "none"}>
        <HStack justify="space-between" width="full">
          <HStack spacing="3">
            <ColumnIconButton
              aria-label="Navigate back"
              icon={<FiArrowLeft />}
              onClick={handleBack}
            />
            {isScrolled && title && <ColumnHeading>{title}</ColumnHeading>}
          </HStack>
          <HStack spacing={2}>
            {rightElement}
            <Box position="relative">
              <IconButton
                icon={<FiBell />}
                aria-label="Notifications"
                variant="ghost"
                size="sm"
                onClick={onOpen}
              />
              {unreadCount > 0 && (
                <Badge
                  position="absolute"
                  top="-1"
                  right="-1"
                  colorScheme="red"
                  borderRadius="full"
                  fontSize="xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Box>
          </HStack>
        </HStack>
      </ColumnHeader> */}

      {children}
    </Box>
  );
};
