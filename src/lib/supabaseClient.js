import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase non configurato: crea un file .env con VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (vedi .env.example).'
  )
}

// Se le variabili non sono impostate esportiamo comunque un client "vuoto"
// per non far crashare l'app: le funzioni di data-access lo controllano
// tramite isSupabaseConfigured prima di ogni chiamata.
export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null
