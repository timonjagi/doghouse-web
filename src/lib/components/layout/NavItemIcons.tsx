import { FiHeart, FiHome, FiSearch, FiUser, FiMessageSquare } from 'react-icons/fi'

export const items = {
  home: {
    label: 'Home',
    icon: FiHome,
    href: '/dashboard',
  },
  search: {
    label: 'Search',
    icon: FiSearch,
    href: '/dashboard/search',
  },
  wishlist: {
    label: 'Wishlist',
    icon: FiHeart,
    href: '/dashboard/wishlist',
  },
  inbox: {
    label: 'Inbox',
    icon: FiMessageSquare,
    href: '/dashboard/inbox',
  },
  account: {
    label: 'Account',
    icon: FiUser,
    href: '/dashboard/account',
  },
}
