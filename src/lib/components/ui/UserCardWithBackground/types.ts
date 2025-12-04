import { User, BreederProfile, SeekerProfile } from '../../../../../db/schema';

// Base user card data that all roles share
export interface BaseUserCardData {
  user: User;
  memberSince?: string;
}

// Breeder-specific card data
export interface BreederCardData extends BaseUserCardData {
  role: 'breeder';
  breederProfile: BreederProfile;
}

// Seeker-specific card data
export interface SeekerCardData extends BaseUserCardData {
  role: 'seeker';
  seekerProfile?: SeekerProfile;
}

// Union type for all user card data types
export type UserCardData = BreederCardData | SeekerCardData;

// Props for the main component
export interface UserCardWithBackgroundProps {
  data: UserCardData;
  action?: React.ReactNode;
  maxW?: string;
  backgroundColorScheme?: string;
}
