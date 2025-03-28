import { supabase } from './supabase'

export type User = {
  id: string
  email: string
  // Add other user fields as needed
}

export const api = {
  auth: {
    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return data
    },

    signUp: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      return data
    },

    signOut: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },

    getUser: async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    }
  },

  // Example of a data operation
  data: {
    createItem: async (table: string, data: any) => {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
      if (error) throw error
      return result
    },

    getItems: async (table: string) => {
      const { data, error } = await supabase
        .from(table)
        .select('*')
      if (error) throw error
      return data
    },

    updateItem: async (table: string, id: string, data: any) => {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
      if (error) throw error
      return result
    },

    deleteItem: async (table: string, id: string) => {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
      if (error) throw error
    }
  }
}