# UserCardWithBackground Component

A flexible, role-based user card component that displays user information with a background header and avatar.

## Features

- **Role-based rendering**: Automatically displays appropriate information based on user role (breeder, seeker)
- **Type-safe**: Full TypeScript support with schema-based types
- **Extensible**: Easy to add new user roles
- **Customizable**: Configurable background color and max width
- **Responsive**: Mobile-friendly design

## Usage

### Breeder Card

```tsx
import { UserCardWithBackground } from '@/lib/components/ui/UserCardWithBackground';
import { Button } from '@chakra-ui/react';
import { HiPencilAlt } from 'react-icons/hi';

const breederData = {
  role: 'breeder' as const,
  user: {
    id: '123',
    email: 'john@example.com',
    display_name: 'John Doe',
    profile_photo_url: 'https://example.com/photo.jpg',
    bio: 'Experienced breeder specializing in Golden Retrievers',
    location_text: 'Austin, TX',
    is_verified: true,
    created_at: new Date('2020-01-15'),
    // ... other user fields
  },
  breederProfile: {
    id: '456',
    user_id: '123',
    kennel_name: 'Golden Valley Kennels',
    rating: '4.8',
    verified_at: new Date('2020-02-01'),
    // ... other breeder profile fields
  },
};

<UserCardWithBackground
  data={breederData}
  action={
    <Button size="sm" leftIcon={<HiPencilAlt />}>
      Edit
    </Button>
  }
/>
```

### Seeker Card

```tsx
const seekerData = {
  role: 'seeker' as const,
  user: {
    id: '789',
    email: 'jane@example.com',
    display_name: 'Jane Smith',
    profile_photo_url: 'https://example.com/photo2.jpg',
    bio: 'Looking for a family-friendly dog',
    location_text: 'Seattle, WA',
    is_verified: true,
    created_at: new Date('2023-06-10'),
    // ... other user fields
  },
  seekerProfile: {
    id: '101',
    user_id: '789',
    experience_level: 'beginner',
    has_children: true,
    // ... other seeker profile fields
  },
};

<UserCardWithBackground
  data={seekerData}
  backgroundColorScheme="purple.600"
/>
```

## Props

### UserCardWithBackgroundProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `UserCardData` | required | User and role-specific profile data |
| `action` | `React.ReactNode` | - | Optional action button/element (e.g., Edit button) |
| `maxW` | `string` | `'xl'` | Maximum width of the card |
| `backgroundColorScheme` | `string` | `'blue.600'` | Background color for the header section |

### UserCardData Types

#### BreederCardData
```typescript
{
  role: 'breeder';
  user: User;
  breederProfile: BreederProfile;
  memberSince?: string; // Optional custom member since text
}
```

#### SeekerCardData
```typescript
{
  role: 'seeker';
  user: User;
  seekerProfile?: SeekerProfile;
  memberSince?: string; // Optional custom member since text
}
```

## Adding New User Roles

To add a new user role (e.g., 'admin', 'veterinarian'):

1. **Update types.ts**: Add a new interface extending `BaseUserCardData`

```typescript
export interface AdminCardData extends BaseUserCardData {
  role: 'admin';
  adminProfile: AdminProfile;
}

// Update the union type
export type UserCardData = BreederCardData | SeekerCardData | AdminCardData;
```

2. **Update App.tsx**: Add role-specific rendering logic

```typescript
if (data.role === 'admin' && data.adminProfile) {
  subtitle = 'Administrator';
  additionalInfo = (
    <HStack mt="2" spacing="2" justify={{ sm: 'center' }}>
      <Badge colorScheme="red" fontSize="sm">
        Admin
      </Badge>
    </HStack>
  );
}
```

## Component Structure

```
UserCardWithBackground/
├── App.tsx              # Main component with role-based logic
├── CardContent.tsx      # Content wrapper
├── CardWithAvatar.tsx   # Card with avatar layout
├── UserInfo.tsx         # User info display (location, member since, etc.)
├── types.ts             # TypeScript type definitions
├── index.ts             # Exports
└── README.md            # This file
```

## Customization Examples

### Custom Background Color
```tsx
<UserCardWithBackground
  data={userData}
  backgroundColorScheme="purple.600"
/>
```

### Custom Width
```tsx
<UserCardWithBackground
  data={userData}
  maxW="2xl"
/>
```

### With Edit Action
```tsx
<UserCardWithBackground
  data={userData}
  action={
    <Button size="sm" onClick={handleEdit}>
      Edit Profile
    </Button>
  }
/>
```
