import { Timestamp } from '@google-cloud/firestore';
import { atom } from 'recoil';

export interface Group {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  longDesc: string;
  imageUrl?: string
}
export interface UserGroup {
  groupId: string;
  isModerator?: string;
  imageUrl?: string
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
