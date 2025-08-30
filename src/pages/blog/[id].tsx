import { useRouter } from 'next/router';
import SingleBlogPost from "lib/pages/blog/SingleBlogPost";

const BlogPostPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return router.push('/404');
  }
  return <SingleBlogPost id={id as string} />;
};

export default BlogPostPage;
