import { Box, Stack, Heading, useBreakpointValue, Icon, Text, Image, Badge, HStack, Container } from '@chakra-ui/react'
import Footer from 'lib/layout/Footer'
import React from 'react'
import { posts } from './data'
import { VscCircleFilled } from 'react-icons/vsc';

interface BlogPostProps {
  id: string;
}

function BlogPost({ id }: BlogPostProps) {
  const isHero = true;
  console.log('id', id);
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return <Box>Post not found</Box>;
  }

  return (
    <Box bg="bg-surface">
      <Container
        pb={{
          base: "16",
          md: "24",
        }}
        mt={{
          base: "-16",
          md: "-24",
        }}
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

      </Container>
      <Footer />
    </Box>
  )
}

export default BlogPost
