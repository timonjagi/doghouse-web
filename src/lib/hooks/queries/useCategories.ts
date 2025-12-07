import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';
import router from 'next/router';
import { useBreakpointValue } from '@chakra-ui/react';

export interface Category {
  label: string;
  url: string;
  featuredImage?: string;
  description?: string;
}

export const useCategories = (page: 'explore' | 'dashboard', tab?: string, isDesktop?: boolean) => {

  return useQuery({
    queryKey: ['categories'],
    queryFn:
      // async (): Promise<BreedCategory[]> => {
      //   // Get breeds with their listing counts
      //   const { data, error } = await supabase
      //     .from('breeds')
      //     .select(`
      //       id,
      //       name,
      //       group,
      //       featured_image_url,
      //       listings!inner (
      //         id,
      //         status
      //       )
      //     `)
      //     .eq('listings.status', 'available')
      //     .order('name');

      //   if (error) throw error;

      //   // Group by breed and count listings
      //   const breedMap = new Map<string, BreedCategory>();

      //   data?.forEach((breed: any) => {
      //     const breedId = breed.id;
      //     if (!breedMap.has(breedId)) {
      //       breedMap.set(breedId, {
      //         id: breedId,
      //         name: breed.name,
      //         group: breed.group || 'Other',
      //         listingCount: 0,
      //         featuredImage: breed.featured_image_url,
      //       });
      //     }
      //     breedMap.get(breedId)!.listingCount += 1;
      //   });

      //   // Convert to array, sort by listing count, and limit
      //   return Array.from(breedMap.values())
      //     .sort((a, b) => b.listingCount - a.listingCount)
      //     .slice(0, limit);
      // },
      (): { [key: string]: Category[] } => {

        const categories = {
          menuItems: [],
          all: [],
          breeds: [],
          breeders: [],
          listings: [],
          breedGroups: [],
          petTypes: []
        }

        categories.menuItems.push(
          { label: isDesktop ? 'All Categories' : 'All Categories', href: page === 'explore' ? '/explore?tab=all&category=dogs' : '/dashboard?tab=all&category=dogs', tab: 0 },
          { label: isDesktop ? 'Available Pets' : 'Pets', href: page === 'explore' ? '/explore?tab=listings&category=dogs' : '/dashboard?tab=listings&category=dogs', tab: 1 },
          { label: isDesktop ? 'Popular Breeds' : 'Breeds', href: page === 'explore' ? '/explore?tab=breeds&category=dogs' : '/dashboard?tab=breeds&category=dogs', tab: 2 },
          { label: isDesktop ? 'Breeders Near You' : 'Breeders', href: page === 'explore' ? '/explore?tab=breeders&category=dogs' : '/dashboard?tab=breeders&category=dogs', tab: 3 },
        )

        // [
        //   { label: 'All Categories', href: '/dashboard?tab=all&category=dogs', tab: 0 },
        //   { label: 'Available Pets', href: '/dashboard?tab=listings&category=dogs', tab: 1 },
        //   { label: 'Popular Breeds', href: '/dashboard?tab=breeds&category=dogs', tab: 2 },
        //   { label: 'Breeders Near You', href: '/dashboard?tab=breeders&category=dogs', tab: 3 },
        // ]

        categories.listings.push(
          { label: 'Featured Pets', url: page === 'explore' ? '/explore?tab=listings&featured=true' : '/dashboard/search?tab=listings&featured=true' },
          { label: 'New Arrivals', url: page === 'explore' ? '/explore?tab=listings&sort=newest' : '/dashboard/search?tab=listings&sort=newest' },
          { label: 'Upcoming Litters', url: page === 'explore' ? '/explore?tab=listings&sort=upcoming' : '/dashboard/search?tab=listings&sort=upcoming' },
          { label: 'Adoption Events', url: page === 'explore' ? '/explore?tab=listings&sort=events' : '/dashboard/search?tab=listings&sort=events' },
          { label: 'Lost & Found', url: page === 'explore' ? '/explore?tab=listings&sort=lost' : '/dashboard/search?tab=listings&sort=lost' },
          { label: 'Missing Pets', url: page === 'explore' ? '/explore?tab=listings&sort=missing' : '/dashboard/search?tab=listings&sort=missing' },

        )

        categories.breeds.push(
          { label: 'Apartment Dogs', url: page === 'explore' ? '/explore?tab=breeds&apartment=true' : '/dashboard/search?tab=breeds&apartment=true' },
          { label: 'Family Dogs', url: page === 'explore' ? '/explore?tab=breeds&family=true' : '/dashboard/search?tab=breeds&family=true' },
          { label: 'Guard Dogs', url: page === 'explore' ? '/explore?tab=breeds&guard=true' : '/dashboard/search?tab=breeds&guard=true' },
          { label: 'Hypoallergenic Breeds', url: page === 'explore' ? '/explore?tab=breeds&hypoallergenic=true' : '/dashboard/search?tab=breeds&hypoallergenic=true' },

        )

        categories.breeders.push(
          { label: 'Verified Breeders', url: page === 'explore' ? '/explore?tab=breeders&verified=true' : '/dashboard/search?tab=breeders&verified=true' },
          { label: 'Rescue Organizations', url: page === 'explore' ? '/explore?tab=breeders&organization=true' : '/dashboard/search?tab=breeders&organization=true' }
        )


        ///
        categories.petTypes = [
          {
            label: 'Dogs',
            href: page === 'explore' ? '/explore?category=dogs' : '/dashboard?category=dogs',
          },
          {
            label: 'Cats',
            href: page === 'explore' ? '/explore?category=cats' : '/dashboard?category=cats',
          },
          {
            label: 'Rodents',
            href: page === 'explore' ? '/explore?category=rodents' : '/dashboard?category=rodents',
          },
          {
            label: 'Fish',
            href: page === 'explore' ? '/explore?category=fish' : '/dashboard?category=fish',
          },
          {
            label: 'Birds',
            href: page === 'explore' ? '/explore?category=birds' : '/dashboard?category=birds',
          },
          {
            label: 'Reptiles',
            href: page === 'explore' ? '/explore?category=reptiles' : '/dashboard?category=reptiles',
          },
          {
            label: 'Amphibians',
            href: page === 'explore' ? '/explore?category=amphibians' : '/dashboard?category=amphibians',
          },

        ]

        if (tab) {
          categories.petTypes.forEach((petType) => {
            if (petType.href.includes(tab)) {
              // append tab when switching pet types
              petType.href = petType.href + '&tab=' + tab
            }
          });
        }

        categories.breedGroups = [
          { label: 'Toy Group', url: page === 'explore' ? '/explore?tab=breeds&category=toy' : '/dashboard/search?tab=breeds&category=toy', featuredImage: '/images/breed_groups_3/toy.png', description: 'Explore our most popular breeds' },
          { label: 'Pastoral Group', url: page === 'explore' ? '/explore?tab=breeds&category=pastoral' : '/dashboard/search?tab=breeds&category=pastoral', featuredImage: '../../../../../public/images/breed_groups_3/pastoral.png', description: 'Explore our most popular breeds' },
          { label: 'Working Group', url: page === 'explore' ? '/explore?tab=breeds&category=working' : '/dashboard/search?tab=breeds&category=working', featuredImage: '/images/breed_groups_3/working.png', description: 'Explore our most popular breeds' },
          { label: 'Terrier Group', url: page === 'explore' ? '/explore?tab=breeds&category=terrier' : '/dashboard/search?tab=breeds&category=terrier', featuredImage: '/images/breed_groups_3/terrier.png', description: 'Explore our most popular breeds' },
          { label: 'Gun Dog Group', url: page === 'explore' ? '/explore?tab=breeds&category=gun-dog' : '/dashboard/search?tab=breeds&category=gun-dog', featuredImage: '/images/breed_groups_3/gun-dog.png', description: 'Explore our most popular breeds' },
          { label: 'Hound Group', url: page === 'explore' ? '/explore?tab=breeds&category=hound' : '/dashboard/search?tab=breeds&category=hound', featuredImage: '/images/breed_groups_3/hound.png', description: 'Explore our most popular breeds' },
          { label: 'Hybrid Group', url: page === 'explore' ? '/explore?tab=breeds&category=hybrid' : '/dashboard/search?tab=breeds&category=hybrid', featuredImage: '/images/breed_groups_3/hybrid.png', description: 'Explore our most popular breeds' },
          { label: 'Utility Group', url: page === 'explore' ? '/explore?tab=breeds&category=utility' : '/dashboard/search?tab=breeds&category=utility', featuredImage: '/images/breed_groups_3/utility.png', description: 'Explore our most popular breeds' },
        ];

        return categories;
      },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}