import { useRouter } from 'next/router';
import SingleBlogPost from "lib/pages/blog/SingleBlogPost";

const BlogPostPage = () => {
  const router = useRouter();

  if (!router.isReady) {
    return null; // Or a loading spinner
  }

  const { slug } = router.query;

  if (!slug) {
    // If id is still not available after router is ready, redirect to 404
    router.push('/404');
    return null;
  }
  return <SingleBlogPost slug={slug as string} />;
};

export default BlogPostPage;
