import { Box, HStack } from "@chakra-ui/react"
import { DesktopNavItem } from "./NavCategory/NavCategoryMenu"
import { useColorModeValue as mode } from "@chakra-ui/react"

interface TabBarProps {
  activeTab: string,
  menuItems: any
}

export const TabBar = ({ menuItems, activeTab }: TabBarProps) => {
  return (
    <Box
      position="sticky"
      top={0}
      zIndex="sticky"
      borderTopWidth="1px"
      borderBottomWidth="1px"
      borderColor={mode('gray.200', 'gray.700')}
      bg={mode('white', 'gray.800')}
      px={{ base: 2, md: 4 }}
    >
      <Box maxW="8xl" mx="auto">
        <HStack
          spacing="8"
          overflowX="auto"
          overflowY="hidden"
          whiteSpace="nowrap"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
          }}
        >
          {menuItems.map((link) => (
            <DesktopNavItem
              key={link.label}
              label={link.label}
              href={link.href}
              isActive={activeTab === link.tab}
            />
          ))}
        </HStack>
      </Box>
    </Box>
  )
}