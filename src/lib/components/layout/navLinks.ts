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
  FiEdit,
  FiMessageSquare,
  FiGitlab,
  FiCreditCard,
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
      title: "Dashboard",
      items: [
        {
          label: "Overview",
          href: "/dashboard",
          icon: FiHome,
          ariaLabel: "Dashboard home"
        },
        // {
        //   label: "Inbox",
        //   href: "/dashboard/inbox",
        //   icon: FiMessageSquare,
        //   ariaLabel: "Inbox"
        // },
      ]
    },
    {
      title: "Manage",
      items: [
        {
          label: "Breeds",
          href: "/dashboard/breeds",
          icon: FiGitlab,
          ariaLabel: "Manage breeds and listings"
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
        {
          label: "Matches",
          href: "/dashboard/matches",
          icon: FiTarget,
          ariaLabel: "View matches"
        },
      ]
    },
    {
      title: "Billing",
      items: [
        {
          label: "Earnings",
          href: "/dashboard/billing/earnings",
          icon: FiCreditCard,
          ariaLabel: "View earnings and payouts"
        },
        // {
        //   label: "Transactions",
        //   href: "/dashboard/billing/transactions",
        //   icon: FiBarChart,
        //   ariaLabel: "View transaction history"
        // },
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
          icon: FiHome,
          ariaLabel: "Dashboard home"
        },
        // {
        //   label: "Inbox",
        //   href: "/dashboard/inbox",
        //   icon: FiMessageSquare,
        //   ariaLabel: "Inbox"
        // },
      ]
    },
    {
      title: "Browse",
      items: [
        {
          label: "Breeds",
          href: "/dashboard/breeds",
          icon: FiSearch,
          ariaLabel: "Browse breeds and listings"
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
        {
          label: "Matches",
          href: "/dashboard/matches",
          icon: FiTarget,
          ariaLabel: "My matches"
        },
      ]
    },
    {
      title: "Billing",
      items: [
        {
          label: "Payments",
          href: "/dashboard/billing/payments",
          icon: FiCreditCard,
          ariaLabel: "View payment history"
        },
        // {
        //   label: "Transactions",
        //   href: "/dashboard/billing/transactions",
        //   icon: FiBarChart,
        //   ariaLabel: "View transaction history"
        // },
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
