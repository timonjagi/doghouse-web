import React from 'react';
import { IconButton, IconButtonProps, useToast, Tooltip, Button, ButtonProps } from '@chakra-ui/react';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useIsInWishlist, useAddToWishlist, useRemoveFromWishlist } from 'lib/hooks/queries/useWishlist';
import { useCurrentUser } from 'lib/hooks/queries/useAuth';

interface AddToWishlistButtonProps extends Omit<IconButtonProps & ButtonProps, 'aria-label'> {
  listingId?: string;
  userBreedId?: string;
  breedId?: string;
  notifyWhenAvailable?: boolean;
  withText?: boolean;
  textAdded?: string;
  textNotAdded?: string;
}

export const AddToWishlistButton: React.FC<AddToWishlistButtonProps> = ({
  listingId,
  userBreedId,
  breedId,
  notifyWhenAvailable = false,
  withText = false,
  textAdded,
  textNotAdded,
  ...props
}) => {
  const { data: user } = useCurrentUser();
  const toast = useToast();

  const { data: wishlistState, isLoading: isCheckLoading } = useIsInWishlist(listingId, userBreedId, breedId);
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const isAdded = wishlistState?.inWishlist;
  const wishlistId = wishlistState?.wishlistId;

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to your wishlist.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (isAdded && wishlistId) {
        await removeFromWishlist.mutateAsync(wishlistId);
        toast({
          title: 'Removed from wishlist',
          status: 'info',
          duration: 2000,
          isClosable: true,
        });
      } else {
        await addToWishlist.mutateAsync({
          listing_id: listingId,
          user_breed_id: userBreedId,
          breed_id: breedId,
          notify_when_available: notifyWhenAvailable,
        });
        toast({
          title: 'Added to wishlist',
          description: notifyWhenAvailable ? 'You will be notified when this becomes available.' : undefined,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const isLoading = isCheckLoading || addToWishlist.isPending || removeFromWishlist.isPending;
  const icon = isAdded ? <FaHeart color="red" /> : <FiHeart />;
  const label = isAdded ? (textAdded || 'Added to wishlist') : (textNotAdded || 'Add to wishlist');

  if (withText) {
    return (
      <Button
        leftIcon={icon}
        onClick={handleToggleWishlist}
        isLoading={isLoading}
        variant="outline"
        colorScheme={isAdded ? 'red' : 'gray'}
        {...props}
      >
        {label}
      </Button>
    );
  }

  return (
    <Tooltip label={label}>
      <IconButton
        aria-label={label}
        icon={icon}
        onClick={handleToggleWishlist}
        isLoading={isLoading}
        variant="ghost"
        colorScheme={isAdded ? 'red' : 'gray'}
        borderRadius="full"
        {...props}
      />
    </Tooltip>
  );
};
