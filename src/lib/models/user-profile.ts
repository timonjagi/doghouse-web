export interface UserProfile {
  // eslint-disable-next-line
  name: string;
  location: string;
  roles: string[];
  pet_profiles: Record<string, any>[];
  preferences: Record<string, any>;
}
