import { Timestamp } from '@google-cloud/firestore';
import { atom } from 'recoil';

export interface Group {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageURL?: string
}
export interface UserGroup {
  groupId: string;
  isModerator?: string;
  imageURL?: string
}

interface GroupState {
  userGroups: UserGroup[]
}

const defaultCommunityState: GroupState = {
  userGroups: []
}

export const groupState = atom<GroupState>({
  key: 'communityState',
  default: defaultCommunityState
})
