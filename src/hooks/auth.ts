import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api/auth'
import { useRouter } from 'next/router'
import { useToast } from '@chakra-ui/react'

export function useSignUp() {
  const router = useRouter()
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      queryClient.setQueryData(['user', data.id], data)
      toast({
        title: 'Account created successfully',
        description: "Let's finish creating your profile",
        status: 'success',
      })
      router.push('/signup')
    },
    onError: (error: Error) => {
      toast({
        title: 'Error creating account',
        description: error.message,
        status: 'error',
      })
    },
  })
}

export function useLogin() {
  const router = useRouter()
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['user', data.user?.id], data.user)
      router.push('/home')
    },
    onError: (error: Error) => {
      toast({
        title: 'Login failed',
        description: error.message,
        status: 'error',
      })
    },
  })
}

export function useUser(uid: string | undefined) {
  return useQuery({
    queryKey: ['user', uid],
    queryFn: () => (uid ? authApi.getUser(uid) : null),
    enabled: !!uid, // Only run query if uid exists
  })
}

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear() // Clear all queries from cache
      router.push('/login')
    },
  })
} 