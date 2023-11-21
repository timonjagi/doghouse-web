import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PageContent from "../../../lib/layout/PageContent";
import NewPostForm from "../../../lib/pages/group/Posts/PostForm/NewPostForm";
import { auth } from "../../../lib/firebase/client";

const SumbitPostPage: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <PageContent>
      <>
        <Box padding="14px 0px" borderBottom="1px solid white">
          <Text>Create a post</Text>
        </Box>
        {user && <NewPostForm user={user} />}
      </>
      <>AboutCommunity</>
    </PageContent>
  );
};
export default SumbitPostPage;
