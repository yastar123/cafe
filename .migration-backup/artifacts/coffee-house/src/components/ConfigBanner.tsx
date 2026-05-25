import { isSupabaseConfigured } from '@/lib/supabase'
import { AlertTriangle } from 'lucide-react'

export default function ConfigBanner() {
  if (isSupabaseConfigured) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-600 text-white px-4 py-3 flex items-center gap-3 shadow-lg">
      <AlertTriangle className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm font-medium">
        <strong>Konfigurasi Diperlukan:</strong> Set{' '}
        <code className="bg-amber-700 px-1 rounded text-xs">VITE_SUPABASE_URL</code> dan{' '}
        <code className="bg-amber-700 px-1 rounded text-xs">VITE_SUPABASE_ANON_KEY</code>{' '}
        di Secrets Replit untuk menghubungkan ke database.
      </p>
    </div>
  )
}
