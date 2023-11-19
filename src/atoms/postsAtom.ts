import { Timestamp } from 'firebase/firestore';
import { atom } from 'recoil';

export type Post = {
  id?: string;
  creatorId: string;
  creatorDisplayName: string;
  title: string;
  body: string;
  numberOfComments: number;
  voteCount: number;
  imageURL?: string;
  communityId: string;
  communityImageURL?: string;
  createdAt: Timestamp
}

interface PostState {
  selectedPost: Post | null;
  posts: Post[];
  // postVotes
}

const defaultPostState: PostState = {
  selectedPost: null,
  posts: []
}

export const postState = atom<PostState>({
  key: 'postState',
  default: defaultPostState
})

