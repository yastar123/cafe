import { Button } from '@/components/ui/button'
import { Link, useSearch } from 'wouter'
import { CheckCircle, Coffee, ClipboardList, Package, Copy, ArrowRight, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export default function OrderSuccessPage() {
  const search = useSearch()
  const params = new URLSearchParams(search)
  const orderId = params.get('orderId')

  const handleCopyId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId)
      toast.success('ID pesanan disalin!')
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, hsl(150 40% 97%) 0%, hsl(25 50% 97%) 50%, hsl(150 30% 96%) 100%)',
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-full translate-x-1/3 -translate-y-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/8 to-transparent rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-100/20 rounded-full blur-3xl" />
      </div>

      {/* Top bar */}
      <div className="relative flex items-center justify-center pt-8 pb-4 px-4">
        <Link href="/menu" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Coffee className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
            Coffee House
          </span>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center px-4 pb-8 pt-2">
        <div className="relative w-full max-w-md">

          {/* Sparkle accent */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md z-10">
            <Sparkles className="h-3 w-3" />
            Pesanan Dikonfirmasi
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-emerald-100 rounded-3xl shadow-2xl overflow-hidden">

            {/* Success hero */}
            <div
              className="px-6 pt-10 pb-7 text-center space-y-3 border-b border-emerald-100"
              style={{ background: 'linear-gradient(180deg, hsl(150 60% 97%) 0%, hsl(150 40% 96%) 100%)' }}
            >
              {/* Animated ring + icon */}
              <div className="flex justify-center mb-1">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-emerald-300/40 animate-ping scale-150" />
                  <div className="absolute inset-0 rounded-full bg-emerald-200/30 scale-125" />
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-200/60">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-emerald-700 mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Pesanan Berhasil! 🎉
                </h1>
                <p className="text-sm text-emerald-600/80 mt-1.5 leading-relaxed max-w-xs mx-auto">
                  Terima kasih! Pesanan Anda telah kami terima dan akan segera diproses.
                </p>
              </div>
            </div>

            <div className="px-5 py-5 space-y-4">
              {/* Order ID */}
              {orderId && (
                <div className="bg-primary/5 border border-primary/12 rounded-2xl p-4">
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1.5">ID Pesanan</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-mono font-bold text-foreground break-all flex-1">{orderId}</p>
                    <button
                      onClick={handleCopyId}
                      className="p-2 rounded-xl hover:bg-primary/10 transition-colors text-primary flex-shrink-0 border border-primary/15"
                      title="Salin ID"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5">Simpan ID ini untuk memantau status pesanan</p>
                </div>
              )}

              {/* Next steps */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Proses Selanjutnya</p>
                <div className="space-y-2">
                  {[
                    { icon: ClipboardList, text: 'Admin akan memverifikasi bukti pembayaran Anda',   color: 'from-blue-400 to-blue-600',    badge: '01', bg: 'bg-blue-50' },
                    { icon: Coffee,        text: 'Barista akan segera membuatkan pesanan Anda',        color: 'from-amber-400 to-amber-600',  badge: '02', bg: 'bg-amber-50' },
                    { icon: Package,       text: 'Ambil pesanan saat status berubah "Siap Diambil"',   color: 'from-emerald-400 to-emerald-600', badge: '03', bg: 'bg-emerald-50' },
                  ].map(({ icon: Icon, text, color, badge }, i) => (
                    <div key={i} className={`flex items-center gap-3 ${i === 0 ? 'bg-blue-50' : i === 1 ? 'bg-amber-50/60' : 'bg-emerald-50/60'} rounded-xl px-3.5 py-3 border border-black/5`}>
                      <div className={`relative w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <Icon className="h-4 w-4 text-white" />
                        <span className="absolute -top-1.5 -right-1.5 text-[8px] font-bold bg-white border border-black/10 rounded-full w-4 h-4 flex items-center justify-center text-foreground/60">
                          {badge}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/70 leading-snug flex-1">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <Link href="/menu" className="flex-1">
                  <Button className="w-full bg-primary hover:bg-primary/90 font-semibold rounded-xl shadow-sm h-11 press-effect gap-2">
                    Kembali ke Menu <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/menu" className="sm:flex-none">
                  <Button variant="outline" className="w-full sm:w-auto border-primary/20 rounded-xl h-11 text-primary hover:bg-primary/5 px-5">
                    Pantau Pesanan
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
