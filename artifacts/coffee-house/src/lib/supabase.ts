import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Chainable no-op builder — returns empty results without crashing
function makeNoopBuilder(): any {
  const noopResult = Promise.resolve({
    data: null,
    error: { message: 'Supabase belum dikonfigurasi. Set VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di Secrets Replit.' },
  })
  const builder: any = new Proxy(noopResult, {
    get(target, prop: string) {
      // Bind promise methods directly to the real Promise so await works
      if (prop === 'then' || prop === 'catch' || prop === 'finally') {
        return (target as any)[prop].bind(target)
      }
      // All other methods return a new chainable builder
      return () => makeNoopBuilder()
    },
  })
  return builder
}

const noopStorage = new Proxy(
  {},
  {
    get() {
      return () => ({
        upload: () => Promise.resolve({ data: null, error: { message: 'Not configured' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      })
    },
  }
)

const noopClient = new Proxy({} as SupabaseClient, {
  get(_target, prop: string) {
    if (prop === 'storage') return noopStorage
    return () => makeNoopBuilder()
  },
})

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : noopClient
