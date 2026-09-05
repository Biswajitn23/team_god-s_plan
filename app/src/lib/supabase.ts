import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ypxjdcbynwxylqskclfh.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweGpkY2J5bnd4eWxxc2tjbGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MTQ5ODMsImV4cCI6MjA3MzQ5MDk4M30.0FlaHWfzFnV_dXYVJsf1sntToQVgyECqoTgIAt8gJ7U'

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface CollectionRecord {
  id?: string
  species: string
  scientific_name: string
  method: string
  quantity: number
  location: string
  notes: string
  photos: string[]
  batch_id: string
  created_at?: string
}