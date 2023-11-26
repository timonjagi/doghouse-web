import {
  Badge,
  Box,
  Heading,
  HStack,
  Icon,
  Image,
  Link,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import * as React from 'react'
import { VscCircleFilled } from 'react-icons/vsc'

export const BlogPost = (props) => {
  const { post, isHero } = props
  return (
    <Link
      _hover={{
        textDecor: 'none',
      }}
      role="group"
    >
      <Stack spacing="8">
        <Box overflow="hidden">
          <Image
            src={post.image}
            alt={post.title}
            width="full"
            height={useBreakpointValue({
              base: '15rem',
              md: isHero ? 'sm' : '15rem',
            })}
            objectFit="cover"
            transition="all 0.2s"
            _groupHover={{
              transform: 'scale(1.05)',
            }}
          />
        </Box>
        <Stack spacing="6">
          <Stack spacing="3">
            <HStack spacing="1" fontSize="sm" fontWeight="semibold" color="accent">
              <Text>{post.author.name}</Text>
              <Icon as={VscCircleFilled} boxSize="2" />
              <Text> {post.publishedAt}</Text>
            </HStack>
            <Heading
              size={useBreakpointValue({
                base: 'xs',
                md: isHero ? 'sm' : 'xs',
              })}
            >
              {post.title}
            </Heading>
            <Text color="muted">{post.excerpt}</Text>
          </Stack>
          <HStack>
            {post.tags.map((tag, id) => (
              <Badge key={id} colorScheme={tag.color}>
                {tag.label}
              </Badge>
            ))}
          </HStack>
        </Stack>
      </Stack>
    </Link>
  )
}
