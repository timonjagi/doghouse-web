export interface UserProfile {
  // eslint-disable-next-line
  name: string;
  location: string;
  roles: string[];
  user_breeds: Record<string, any>[];
  preferences: Record<string, any>;
}
