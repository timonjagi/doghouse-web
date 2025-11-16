import {
  FiHome,
  FiSearch,
  FiTarget,
  FiClipboard,
  FiUsers,
  FiBarChart,
  FiShield,
  FiList,
  FiMessageSquare,
  FiGitlab,
  FiCreditCard,
  FiUser,
  FiGrid,
  FiShoppingBag,
} from "react-icons/fi";
import { GiDogHouse } from "react-icons/gi";
import { LuDog, LuSettings2 } from "react-icons/lu";

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
      title: "Dashboard",
      items: [
        {
          label: "Overview",
          href: "/dashboard",
          icon: FiHome,
          ariaLabel: "Dashboard home"
        },
        {
          label: "Inbox",
          href: "/dashboard/inbox",
          icon: FiMessageSquare,
          ariaLabel: "Inbox"
        },
      ]
    },
    {
      title: "Manage",
      items: [
        {
          label: "Kennel",
          href: "/dashboard/account/kennel",
          icon: GiDogHouse,
          ariaLabel: "View kennel"
        },
        {
          label: "Breeds",
          href: "/dashboard/breeds",
          icon: LuDog,
          ariaLabel: "Manage breeds and listings"
        },

        {
          label: "Listings",
          href: "/dashboard/listings",
          icon: FiShoppingBag,
          ariaLabel: "Manage listings"
        },
        {
          label: "Applications",
          href: "/dashboard/applications",
          icon: FiClipboard,
          ariaLabel: "View applications"
        },
        // {
        //   label: "Matches",
        //   href: "/dashboard/matches",
        //   icon: FiTarget,
        //   ariaLabel: "View matches"
        // },
      ]
    },
    {
      title: "Account",
      items: [
        {
          label: "Profile",
          href: "/dashboard/account/profile",
          icon: FiUser,
          ariaLabel: "View profile"
        },

        {
          label: "Billing",
          href: "/dashboard/account/billing",
          icon: FiCreditCard,
          ariaLabel: "View payment history"
        }
      ]
    }
  ],

  seeker: [
    {
      title: "Dashboard",
      items: [
        {
          label: "Overview",
          href: "/dashboard",
          icon: FiGrid,
          ariaLabel: "Dashboard home"
        },
        {
          label: "Inbox",
          href: "/dashboard/inbox",
          icon: FiMessageSquare,
          ariaLabel: "Inbox"
        },
      ]
    },
    {
      title: "Browse",
      items: [
        {
          label: "Breeders",
          href: "/dashboard/breeders",
          icon: GiDogHouse,
          ariaLabel: "View kennel"
        },
        {
          label: "Breeds",
          href: "/dashboard/breeds",
          icon: LuDog,
          ariaLabel: "Browse breeds and listings"
        },
        {
          label: "Listings",
          href: "/dashboard/listings",
          icon: FiShoppingBag,
          ariaLabel: "Browse listings"
        },
        {
          label: "Applications",
          href: "/dashboard/applications",
          icon: FiClipboard,
          ariaLabel: "My applications"
        },
        // {
        //   label: "Matches",
        //   href: "/dashboard/matches",
        //   icon: FiTarget,
        //   ariaLabel: "My matches"
        // },
      ]
    },
    {
      title: "Account",
      items: [
        {
          label: "Profile",
          href: "/dashboard/account/profile",
          icon: FiUser,
          ariaLabel: "View profile"
        },
        {
          label: "Preferences",
          href: "/dashboard/account/preferences",
          icon: LuSettings2,
          ariaLabel: "View preferences"
        },
        {
          label: "Billing",
          href: "/dashboard/account/billing",
          icon: FiCreditCard,
          ariaLabel: "View billing history"
        },
      ]
    }
  ],

  admin: [
    {
      title: "Dashboard",
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
      title: "Manage",
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
        {
          label: "Payouts",
          href: "/dashboard/admin/payouts",
          icon: FiCreditCard,
          ariaLabel: "Manage breeder payouts"
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
