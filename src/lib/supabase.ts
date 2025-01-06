import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { supabaseAnonKey, supabaseUrl } from './config-supabase'
import * as SecureStore from "expo-secure-store";

class LargeSecureStore{
  async getItem(key: string){
    return null
  }

  async setItem(key: string, value: string){
  }

  async removeItem(key: string){
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

