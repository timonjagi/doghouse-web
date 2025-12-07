import { Accordion, Box, HStack, SimpleGrid, Stack, Text, useColorModeValue as mode } from '@chakra-ui/react'
import * as React from 'react'
import { NavAccordionItem } from './NavAccordionItem'
import { NavProductItem } from './NavProductItem'
import { SubNavLinkGroup } from './SubNavLinkGroup'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Link from 'next/link'

const DesktopNavMenu = ({ data }: { data: any }) => {
  return (
    <Box
      px="10"
      pt="6"
      pb="16"
      bg={mode('white', 'gray.800')}
    >
      <Box maxWidth="8xl" mx="auto">
        <Stack direction="row" spacing="5vw" justify="space-between">
          <Stack direction="row" spacing="5vw" flexShrink={0}>
            <SubNavLinkGroup {...data.category} />
            <SubNavLinkGroup {...data.featured} />
          </Stack>

          <SimpleGrid
            spacing="6"
            columns={{
              base: 2,
              md: 3,
              lg: 4,
            }}
            alignContent="flex-start"
            width="full"

            overflowY="auto"
          >
            {data.products.map((product) => (
              <NavProductItem key={product.id} href="#" {...product} />
            ))}
          </SimpleGrid>
        </Stack>
      </Box>
    </Box>
  )
}
const MobileNavMenu = ({ data }: { data: any }) => (
  <Accordion
    allowToggle
    defaultIndex={0}
    overflow="auto"
    w="full"

  >
    <Stack width="full">
      {data.products.map((product) => (
        <NavAccordionItem label={[product.label]} width="full"
        >
          <HStack width="full" align="baseline" justify="space-between">
            <Text fontWeight="bold" mb="4">

            </Text>
            <HStack>
              <Link href={`/dashboard/search?tab=listings&category=${product.label.toLowerCase()}`}>View All</Link>
              <ChevronRightIcon />
            </HStack>
          </HStack>

          <Stack direction="row" pt="5" width="full"
          >
            {/* {data.products.slice(0, 3).map((product) => (
            <NavProductItem key={product.id} href="#" {...product} />
        ))} */}

            <SimpleGrid
              spacing="6"
              columns={{
                base: 2,
                md: 3,
                lg: 4,
              }}
              alignContent="flex-start"
              width="full"

              overflowY="auto"
            >
              {product.products.map((product) => (
                <NavProductItem key={product.id} href={product.href} {...product} />
              ))}
            </SimpleGrid>
          </Stack>
          <Box mt="8">
            <SubNavLinkGroup {...data.category} />
          </Box>
        </NavAccordionItem>
      ))}
    </Stack>

  </Accordion>
)

export const NavMenu = {
  Desktop: DesktopNavMenu,
  Mobile: MobileNavMenu,
}
