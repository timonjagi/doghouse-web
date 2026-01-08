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
  FiHelpCircle,
} from "react-icons/fi";
import { GiDogHouse } from "react-icons/gi";
import { LuDog, LuSettings2 } from "react-icons/lu";

export type UserRole = "breeder" | "seeker" | "admin";

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
          ariaLabel: "Dashboard home",
        },
        {
          label: "Inbox",
          href: "/dashboard/inbox",
          icon: FiMessageSquare,
          ariaLabel: "Inbox",
        },
      ],
    },
    {
      title: "Manage",
      items: [
        {
          label: "Kennel",
          href: "/dashboard/kennel",
          icon: GiDogHouse,
          ariaLabel: "View kennel",
        },
        {
          label: "Matches",
          href: "/dashboard/matches",
          icon: FiUserCheck,
          ariaLabel: "View matches",
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          label: "Profile",
          href: "/dashboard/account/profile",
          icon: FiUser,
          ariaLabel: "View profile",
        },

        {
          label: "Billing",
          href: "/dashboard/account/billing",
          icon: FiCreditCard,
          ariaLabel: "View payment history",
        },
        {
          label: "Support",
          href: "/dashboard/support",
          icon: FiHelpCircle,
          ariaLabel: "Support and help",
        },
      ],
    },
  ],
};

// Helper function to get navigation sections for a role
export const getNavigationForRole = (
  role: UserRole | null | undefined
): NavSection[] => {
  if (!role || !navigationConfig[role]) {
    return navigationConfig.seeker; // Default to seeker navigation
  }
  return navigationConfig[role];
};

// Helper function to get all navigation items for a role (flattened)
export const getNavItemsForRole = (
  role: UserRole | null | undefined
): NavItem[] => {
  const sections = getNavigationForRole(role);
  return sections.flatMap((section) => section.items);
};
