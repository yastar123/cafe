import { isSupabaseConfigured } from '@/lib/supabase'
import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

export default function ConfigBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (isSupabaseConfigured || dismissed) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-amber-700/30 bg-amber-600/95 backdrop-blur-sm text-white px-4 py-2.5 flex items-center gap-3 shadow-lg">
      <AlertTriangle className="h-4 w-4 flex-shrink-0 opacity-90" />
      <p className="text-xs font-medium flex-1">
        <strong className="font-bold">Konfigurasi Diperlukan:</strong> Set{' '}
        <code className="bg-amber-700/70 px-1.5 py-0.5 rounded text-[11px] font-mono">VITE_SUPABASE_URL</code> dan{' '}
        <code className="bg-amber-700/70 px-1.5 py-0.5 rounded text-[11px] font-mono">VITE_SUPABASE_ANON_KEY</code>{' '}
        di Secrets Replit untuk menghubungkan ke database.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded-lg hover:bg-amber-700/50 transition-colors flex-shrink-0"
        aria-label="Tutup"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
