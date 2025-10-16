import {
  FiHome,
  FiSearch,
  FiTarget,
  FiClipboard,
  FiUsers,
  FiBarChart,
  FiShield,
  FiSettings,
  FiLogOut,
  FiHeart,
  FiList,
} from "react-icons/fi";

export type UserRole = 'breeder' | 'seeker' | 'admin';

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  label: string;
  href: string;
  icon: any;
  ariaLabel?: string;
}

export interface NavigationConfig {
  [key: string]: NavSection[];
}

// Role-based navigation configurations
export const navigationConfig: NavigationConfig = {
  breeder: [
    {
      title: "DASHBOARD",
      items: [
        {
          label: "Overview",
          href: "/dashboard",
          icon: FiHome,
          ariaLabel: "Dashboard home"
        }
      ]
    },
    {
      title: "BREEDS",
      items: [
        {
          label: "Manage",
          href: "/dashboard/breeds",
          icon: FiHeart,
          ariaLabel: "Manage breeds and listings"
        },
        {
          label: "Matches",
          href: "/dashboard/matches",
          icon: FiTarget,
          ariaLabel: "View matches"
        },
        {
          label: "Listings",
          href: "/dashboard/listings",
          icon: FiList,
          ariaLabel: "Manage listings"
        },
        {
          label: "Applications",
          href: "/dashboard/applications",
          icon: FiClipboard,
          ariaLabel: "View applications"
        },
      ]
    }
  ],

  seeker: [
    {
      title: "DASHBOARD",
      items: [
        {
          label: "Overview",
          href: "/dashboard",
          icon: FiHome,
          ariaLabel: "Dashboard home"
        }
      ]
    },
    {
      title: "BREEDS",
      items: [
        {
          label: "Browse",
          href: "/dashboard/breeds",
          icon: FiSearch,
          ariaLabel: "Browse breeds and listings"
        },
        {
          label: "Matches",
          href: "/dashboard/matches",
          icon: FiTarget,
          ariaLabel: "My matches"
        },
        {
          label: "Listings",
          href: "/dashboard/listings",
          icon: FiList,
          ariaLabel: "Browse listings"
        },
        {
          label: "Applications",
          href: "/dashboard/applications",
          icon: FiClipboard,
          ariaLabel: "My applications"
        },
      ]
    }
  ],

  admin: [
    {
      title: "DASHBOARD",
      items: [
        {
          label: "Overview",
          href: "/dashboard/admin",
          icon: FiHome,
          ariaLabel: "Dashboard home"
        }
      ]
    },
    {
      title: "MANAGE",
      items: [
        {
          label: "Users",
          href: "/dashboard/admin/users",
          icon: FiUsers,
          ariaLabel: "Manage all users"
        },
        {
          label: "Verification",
          href: "/dashboard/admin/verification",
          icon: FiShield,
          ariaLabel: "Breeder verification"
        },

      ]
    },
    {
      title: "CONTENT",
      items: [
        {
          label: "Breeds",
          href: "/dashboard/admin/breeds",
          icon: FiList,
          ariaLabel: "Manage all listings"
        },
        {
          label: "Listings",
          href: "/dashboard/admin/listings",
          icon: FiList,
          ariaLabel: "Manage all listings"
        },
        {
          label: "Applications",
          href: "/dashboard/admin/applications",
          icon: FiClipboard,
          ariaLabel: "My applications"
        },
      ]
    },
    {
      title: "ANALYTICS",
      items: [
        {
          label: "Analytics",
          href: "/dashboard/admin/analytics",
          icon: FiBarChart,
          ariaLabel: "Platform analytics"
        },

      ]
    }
  ]
};

// Helper function to get navigation config for a role
export const getNavigationForRole = (role: UserRole | null | undefined): NavSection[] => {
  if (!role || !navigationConfig[role]) {
    return [];
  }
  return navigationConfig[role];
};

// Helper function to get all navigation items for a role (flattened)
export const getNavItemsForRole = (role: UserRole | null | undefined): NavItem[] => {
  const sections = getNavigationForRole(role);
  return sections.flatMap(section => section.items);
};
