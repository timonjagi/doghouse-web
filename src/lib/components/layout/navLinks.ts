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
  FiHeart,
  FiUserCheck,
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
          href: "/dashboard/kennel",
          icon: GiDogHouse,
          ariaLabel: "View kennel"
        },
        {
          label: "Matches",
          href: "/dashboard/matches",
          icon: FiUserCheck,
          ariaLabel: "View matches"
        },
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
      title: "",
      items: [
        {
          label: "Home",
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
      title: "Explore",
      items: [

        {
          label: "Search",
          href: "/dashboard/search",
          icon: FiSearch,
          ariaLabel: "Browse breeds and listings"
        },
        {
          label: "Wishlist",
          href: "/dashboard/wishlist",
          icon: FiHeart,
          ariaLabel: "Browse listings"
        },

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
          label: "Adoptions",
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
