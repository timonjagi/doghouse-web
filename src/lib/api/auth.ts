import { supabase } from '../../../lib/supabase'

interface SignUpData {
  email: string
  password: string
  [key: string]: any // for additional user data
}

interface LoginData {
  email: string
  password: string
}

export const authApi = {
  signup: async (data: SignUpData) => {
    const { email, password, ...userData } = data

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    // Create user profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user?.id,
        email: email,
        ...userData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (profileError) throw profileError

    return profileData
  },

  login: async (data: LoginData) => {
    const { data: authData, error } = await supabase.auth.signInWithPassword(data)
    if (error) throw error
    return authData
  },

  getUser: async (uid: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .single()

    if (error) throw error
    return data
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
} 