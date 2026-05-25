import { isSupabaseConfigured } from '@/lib/supabase'
import { AlertTriangle, X, ExternalLink } from 'lucide-react'
import { useState } from 'react'

export default function ConfigBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (isSupabaseConfigured || dismissed) return null

  return (
    <div className="fixed z-[60] bottom-20 right-3 md:bottom-5 md:right-4 lg:right-5 max-w-[270px] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl shadow-xl shadow-amber-900/10 overflow-hidden">
        {/* Top accent bar */}
        <div className="h-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400" />
        <div className="p-3.5 flex gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-amber-900 leading-snug">Setup Diperlukan</p>
            <p className="text-[11px] text-amber-700/90 mt-1 leading-relaxed">
              Tambahkan{' '}
              <code className="bg-amber-100/80 text-amber-800 px-1 py-0.5 rounded text-[10px] font-mono">SUPABASE_URL</code>
              {' '}&{' '}
              <code className="bg-amber-100/80 text-amber-800 px-1 py-0.5 rounded text-[10px] font-mono">ANON_KEY</code>
              {' '}di Replit Secrets.
            </p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 p-1 rounded-lg text-amber-500 hover:text-amber-700 hover:bg-amber-100 transition-colors -mt-0.5 -mr-0.5"
            aria-label="Tutup"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
