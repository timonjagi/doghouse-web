// post.tsx
import { PortableText } from "@portabletext/react";
import client from "../../../client";
import imageUrlBuilder from "@sanity/image-url";
import {
  Stack,
  AspectRatio,
  Skeleton,
  Heading,
  HStack,
  Avatar,
  Box,
  Text,
} from "@chakra-ui/react";

function urlFor(source) {
  return imageUrlBuilder(client).image(source);
}

const ptComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <img
          alt={value.alt || " "}
          loading="lazy"
          src={urlFor(value).width(320).height(240).fit("max").auto("format")}
        />
      );
    },
  },
};

const Post = (props) => {
  const {
    title = "Missing title",
    name = "Missing name",
    categories,
    authorImage,
    body = [],
    mainImage,
    publishedAt,
  } = props.post;

  console.log(mainImage);
  return (
    <Box maxW="2xl" mx="auto" pt="8">
      <Stack spacing="6">
        {/* <AspectRatio ratio={16 / 9}>
          <Image
            src=""
            objectPosition="top"
            objectFit="cover"
            fallback={<Skeleton />}
            alt={title}
            borderRadius="xl"
          />
        </AspectRatio> */}
        <Stack spacing="3">
          <Stack spacing="1">
            <Text fontSize="sm" fontWeight="semibold" color="accent">
              {categories}
            </Text>
            <Heading
              size="xs"
              fontWeight="semibold"
              fontSize={{ base: "xl", lg: "2xl" }}
              lineHeight={{ base: "1.5", lg: "2rem" }}
            >
              {title}
            </Heading>
          </Stack>
          {/* <Text>{categories}</Text> */}
        </Stack>
        <HStack spacing="3">
          <Avatar
            size="md"
            name={name}
            src={urlFor(authorImage).width(50).url()}
          />
          <Box lineHeight="1.25rem">
            <Text fontSize="sm" color="default">
              {name}
            </Text>
            <Text fontSize="sm"> {publishedAt}</Text>
          </Box>
        </HStack>

        <PortableText value={body} components={ptComponents} />
      </Stack>
    </Box>
  );
};

export async function getStaticPaths() {
  const paths = await client.fetch(
    `*[_type == "post" && defined(slug.current)][].slug.current`
  );

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
}

export async function getStaticProps(context) {
  // It's important to default the slug so that it doesn't return "undefined"
  const { slug = "" } = context.params;
  const post = await client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0]
    {
      title, 
      "name": author->name,
      "categories": categories[]->title,
      "authorImage": author->image,
      body,
      publishedAt,
      mainImage,
    }
  `,
    { slug }
  );
  return {
    props: {
      post,
    },
  };
}

export default Post;
