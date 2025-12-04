import { FiHeart, FiHome, FiSearch, FiUser, FiMessageSquare, FiTarget, FiUserCheck } from 'react-icons/fi'
import { GiDogHouse } from 'react-icons/gi'
import { LuDog } from 'react-icons/lu'

export const items = [
  {
    label: 'Home',
    icon: FiHome,
    href: '/dashboard',
  },
  {
    label: 'Search',
    icon: FiSearch,
    href: '/dashboard/search',
    role: 'seeker'
  },
  {
    label: 'Wishlist',
    icon: FiHeart,
    href: '/dashboard/wishlist',
    role: 'seeker'
  },
  {
    label: 'Kennel',
    icon: GiDogHouse,
    href: '/dashboard/kennel',
    role: 'breeder'
  },
  {
    label: 'Matches',
    icon: FiUserCheck,
    href: '/dashboard/matches',
    role: 'breeder'
  },
  {
    label: 'Inbox',
    icon: FiMessageSquare,
    href: '/dashboard/inbox',
  },
  {
    label: 'Account',
    icon: FiUser,
    href: '/dashboard/account',
  },
]
