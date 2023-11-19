import { Stack } from "@chakra-ui/react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Group } from "../../../../atoms/groupsAtom";
import { Post } from "../../../../atoms/postsAtom";
import { auth, fireStore } from "../../../firebase/client";
import usePosts from "../../../../hooks/usePosts";
import PostItem from "./PostItem";
import PostLoader from "./PostLoader";

type PostsListProps = {
  groupData: Group;
};

const PostsList: React.FC<PostsListProps> = ({ groupData }) => {
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  } = usePosts();

  const getPosts = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(fireStore, "posts"),
        where("groupId", "==", groupData.id),
        orderBy("createdAt", "desc")
      );

      const data = await getDocs(postQuery);
      const posts = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("posts", posts);

      setPostStateValue((prev) => ({ ...prev, posts: posts as Post[] }));
    } catch (error: any) {
      console.log("getPosts query", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((post) => (
            <PostItem
              key={post.id}
              userIsCreator={user?.uid === post.creatorId}
              userVoteValue={undefined}
              post={post}
              onVote={onVote}
              onDeletePost={onDeletePost}
              onSelectPost={onSelectPost}
            />
          ))}
        </Stack>
      )}
    </>
  );
};
export default PostsList;
