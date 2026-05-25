import { Button } from '@/components/ui/button'
import { Link, useSearch } from 'wouter'
import { CheckCircle, Coffee, ClipboardList, Package } from 'lucide-react'

export default function OrderSuccessPage() {
  const search = useSearch()
  const params = new URLSearchParams(search)
  const orderId = params.get('orderId')

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-full translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-primary/6 to-transparent rounded-full -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative bg-card border border-primary/12 rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Success header */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-b border-emerald-100 px-6 py-8 text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-emerald-700" style={{ fontFamily: 'Playfair Display, serif' }}>
              Pesanan Berhasil!
            </h1>
            <p className="text-sm text-emerald-600/80 mt-1.5">
              Terima kasih! Pesanan Anda telah kami terima dan akan segera diproses.
            </p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Order ID */}
          {orderId && (
            <div className="bg-primary/5 border border-primary/12 rounded-xl p-4">
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1.5">ID Pesanan</p>
              <p className="text-sm font-mono font-bold text-foreground select-all break-all">{orderId}</p>
            </div>
          )}

          {/* Steps */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold text-foreground/60 uppercase tracking-wide">Langkah Selanjutnya</p>
            {[
              { icon: ClipboardList, text: 'Admin akan memverifikasi bukti pembayaran Anda', color: 'text-blue-600 bg-blue-50' },
              { icon: Coffee,        text: 'Barista akan segera membuatkan pesanan Anda',    color: 'text-amber-600 bg-amber-50' },
              { icon: Package,       text: 'Ambil pesanan saat status berubah "Siap Diambil"', color: 'text-emerald-600 bg-emerald-50' },
            ].map(({ icon: Icon, text, color }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm text-foreground/70 leading-snug pt-1">{text}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-1 flex gap-3">
            <Link href="/menu" className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary/90 font-semibold rounded-xl shadow-sm">
                Kembali ke Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
