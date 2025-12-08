import { useQuery } from '@tanstack/react-query';

export interface Category {
  label: string;
  href: string;
  featuredImage?: string;
  description?: string;
  tab?: string;
}

interface UseCategoriesParams {
  page: 'explore' | 'dashboard';
  tab?: string;
  isDesktop?: boolean;
}

export const useCategories = ({ page, tab, isDesktop }: UseCategoriesParams) => {

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

        const categories: { [key: string]: Category[] } = {
          tabMenuItems: [],
          searchTabMenuItems: [],
          all: [],
          breeds: [],
          breeders: [],
          listings: [],
          breedGroups: [],
          petTypes: []
        }

        categories.tabMenuItems.push(
          {
            label: 'All Categories',
            href: page === 'explore' ? '/explore?tab=all&category=dogs' : '/dashboard?tab=all&category=dogs',
            tab: 'all'
          },
          {
            label: 'Pet Listings',
            href: page === 'explore' ? '/explore?tab=listings&category=dogs' : '/dashboard?tab=listings&category=dogs',
            tab: 'listings'
          },
          {
            label: 'Breeders',
            href: page === 'explore' ? '/explore?tab=breeders&category=dogs' : '/dashboard?tab=breeders&category=dogs',
            tab: 'breeders'
          },
          {
            label: 'Shelters',
            href: page === 'explore' ? '/explore?tab=shelters&category=dogs' : '/dashboard?tab=shelters&category=dogs',
            tab: 'shelters'
          },
          {
            label: 'Vets',
            href: page === 'explore' ? '/explore?tab=vets&category=dogs' : '/dashboard?tab=vets&category=dogs',
            tab: 'vets'
          },
          {
            label: 'Adoption Events',
            href: page === 'explore' ? '/explore?tab=events&category=dogs' : '/dashboard?tab=events&category=dogs',
            tab: 'events'
          },
        )

        categories.searchTabMenuItems.push(
          {
            label: 'All Categories',
            href: page === 'explore' ? '/explore?tab=all&category=dogs' : '/dashboard?tab=all&category=dogs',
            tab: 'all'
          },
          {
            label: 'Pet Listings',
            href: page === 'explore' ? '/explore?tab=listings&category=dogs' : '/dashboard?tab=listings&category=dogs',
            tab: 'listings'
          },
          {
            label: 'Breeds',
            href: page === 'explore' ? '/explore?tab=breeds&category=dogs' : '/dashboard?tab=breeds&category=dogs',
            tab: 'breeds'
          },
          {
            label: 'Breeders',
            href: page === 'explore' ? '/explore?tab=breeders&category=dogs' : '/dashboard?tab=breeders&category=dogs',
            tab: 'breeders'
          },
          {
            label: 'Shelters',
            href: page === 'explore' ? '/explore?tab=shelters&category=dogs' : '/dashboard?tab=shelters&category=dogs',
            tab: 'shelters'
          },
          {
            label: 'Vets',
            href: page === 'explore' ? '/explore?tab=vets&category=dogs' : '/dashboard?tab=vets&category=dogs',
            tab: 'vets'
          },
        )
        categories.listings.push(
          {
            label: 'Featured Pets',
            href: '/dashboard/search?tab=listings&featured=true'
          },
          {
            label: 'New Arrivals',
            href: '/dashboard/search?tab=listings&sort=newest'
          },
          {
            label: 'Upcoming Litters',
            href: '/dashboard/search?tab=listings&sort=upcoming'
          },
          {
            label: 'Adoption Events',
            href: '/dashboard/search?tab=listings&sort=events'
          },
          {
            label: 'Lost & Found',
            href: '/dashboard/search?tab=listings&sort=lost'
          },
          {
            label: 'Missing Pets',
            href: '/dashboard/search?tab=listings&sort=missing'
          },

        )

        categories.breeds.push(
          {
            label: 'Apartment Dogs',
            href: page === 'explore' ? '/explore?tab=breeds&apartment=true' : '/dashboard/search?tab=breeds&apartment=true'
          },
          {
            label: 'Family Dogs',
            href: page === 'explore' ? '/explore?tab=breeds&family=true' : '/dashboard/search?tab=breeds&family=true'
          },
          {
            label: 'Guard Dogs',
            href: page === 'explore' ? '/explore?tab=breeds&guard=true' : '/dashboard/search?tab=breeds&guard=true'
          },
          {
            label: 'Hypoallergenic Breeds',
            href: '/dashboard/search?tab=breeds&hypoallergenic=true'
          },

        )

        categories.breeders.push(
          {
            label: 'Verified Breeders',
            href: '/dashboard/search?tab=breeders&verified=true'
          },
          {
            label: 'Rescue Organizations',
            href: '/dashboard/search?tab=breeders&organization=true'
          }
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
            label: 'Bunnies',
            href: page === 'explore' ? '/explore?category=bunnies' : '/dashboard?category=bunnies',
          },
          {
            label: 'Hamsters',
            href: page === 'explore' ? '/explore?category=hamsters' : '/dashboard?category=hamsters',
          },
          {
            label: 'Guinea Pigs',
            href: page === 'explore' ? '/explore?category=guinea_pigs' : '/dashboard?category=guinea_pigs',
          },
          {
            label: 'Parrots',
            href: page === 'explore' ? '/explore?category=parrots' : '/dashboard?category=parrots',
          },
          {
            label: 'Squirrels',
            href: page === 'explore' ? '/explore?category=squirrels' : '/dashboard?category=squirrels',
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
          {
            label: 'Toy Group',
            href: '/dashboard/search?tab=breeds&category=toy',
            featuredImage: '/images/breed_groups_3/toy.png',
            description: 'Explore our most popular breeds'
          },
          {
            label: 'Pastoral Group',
            href: '/dashboard/search?tab=breeds&category=pastoral',
            featuredImage: '/images/breed_groups_3/pastoral.png',
            description: 'Explore our most popular breeds'
          },
          {
            label: 'Working Group',
            href: '/dashboard/search?tab=breeds&category=working',
            featuredImage: '/images/breed_groups_3/working.png',
            description: 'Explore our most popular breeds'
          },
          {
            label: 'Terrier Group',
            href: '/dashboard/search?tab=breeds&category=terrier',
            featuredImage: '/images/breed_groups_3/terrier.png',
            description: 'Explore our most popular breeds'
          },
          {
            label: 'Gun Dog Group',
            href: '/dashboard/search?tab=breeds&category=gun-dog',
            featuredImage: '/images/breed_groups_3/gun-dog.png',
            description: 'Explore our most popular breeds'
          },
          {
            label: 'Hound Group',
            href: '/dashboard/search?tab=breeds&category=hound',
            featuredImage: '/images/breed_groups_3/hound.png',
            description: 'Explore our most popular breeds'
          },
          {
            label: 'Hybrid Group',
            href: page === 'explore' ? '/explore?tab=breeds&category=hybrid' : '/dashboard/search?tab=breeds&category=hybrid',
            featuredImage: '/images/breed_groups_3/hybrid.png',
            description: 'Explore our most popular breeds'
          },
          {
            label: 'Utility Group',
            href: page === 'explore' ? '/explore?tab=breeds&category=utility' : '/dashboard/search?tab=breeds&category=utility',
            featuredImage: '/images/breed_groups_3/utility.png',
            description: 'Explore our most popular breeds'
          },
        ];

        return categories;
      },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}