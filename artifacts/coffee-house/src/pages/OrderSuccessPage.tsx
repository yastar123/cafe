import { Button } from '@/components/ui/button'
import { Link, useSearch } from 'wouter'
import { CheckCircle, Coffee, ClipboardList, Package, Copy } from 'lucide-react'
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-100/40 to-transparent rounded-full translate-x-1/3 -translate-y-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-primary/5 to-transparent rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl" />
      </div>

      <div className="relative w-full max-w-md space-y-5">
        {/* Logo */}
        <Link href="/menu" className="flex justify-center hover:opacity-80 transition-opacity">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <Coffee className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>Coffee House</span>
          </div>
        </Link>

        <div className="bg-card border border-primary/12 rounded-2xl shadow-xl overflow-hidden">
          {/* Success header */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-b border-emerald-100 px-6 py-8 text-center space-y-3">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-emerald-200/60 animate-ping scale-125 opacity-50" />
                <div className="relative w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center shadow-md">
                  <CheckCircle className="h-10 w-10 text-emerald-600" />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-emerald-700 mt-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                Pesanan Berhasil! 🎉
              </h1>
              <p className="text-sm text-emerald-600/80 mt-1.5 leading-relaxed">
                Terima kasih! Pesanan Anda telah kami terima dan akan segera diproses.
              </p>
            </div>
          </div>

          <div className="px-5 py-5 space-y-5">
            {/* Order ID */}
            {orderId && (
              <div className="bg-primary/5 border border-primary/12 rounded-xl p-4">
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1.5">ID Pesanan</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-mono font-bold text-foreground break-all flex-1">{orderId}</p>
                  <button
                    onClick={handleCopyId}
                    className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors text-primary flex-shrink-0"
                    title="Salin ID"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">Simpan ID ini untuk memantau status pesanan Anda</p>
              </div>
            )}

            {/* Steps */}
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Proses Selanjutnya</p>
              {[
                { icon: ClipboardList, text: 'Admin akan memverifikasi bukti pembayaran Anda',      color: 'text-blue-600 bg-blue-50',    badge: '01' },
                { icon: Coffee,        text: 'Barista akan segera membuatkan pesanan Anda',         color: 'text-amber-600 bg-amber-50',  badge: '02' },
                { icon: Package,       text: 'Ambil pesanan saat status berubah "Siap Diambil"',    color: 'text-emerald-600 bg-emerald-50', badge: '03' },
              ].map(({ icon: Icon, text, color, badge }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="h-4 w-4" />
                    <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold bg-white border border-current/20 rounded-full w-4 h-4 flex items-center justify-center text-current/70">
                      {badge}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/70 leading-snug pt-1.5">{text}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Link href="/menu" className="flex-1">
                <Button className="w-full bg-primary hover:bg-primary/90 font-semibold rounded-xl shadow-sm h-11 press-effect">
                  Kembali ke Menu
                </Button>
              </Link>
              <Link href="/menu" className="sm:flex-initial">
                <Button variant="outline" className="w-full sm:w-auto border-primary/20 rounded-xl h-11 text-primary hover:bg-primary/5 px-5">
                  Pantau Pesanan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
