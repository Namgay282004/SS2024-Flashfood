import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nbvdekfateldqbkwbfcv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5idmRla2ZhdGVsZHFia3diZmN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNzUzMjksImV4cCI6MjA1OTc1MTMyOX0.1nXnktbLs5y-IwwFkPGP8OXzxVL4oV-L4-adMaQgybo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})