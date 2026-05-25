import { Button } from '@/components/ui/button'
import { Link } from 'wouter'
import { CheckCircle, Coffee, ArrowRight, Star, UtensilsCrossed, Clock } from 'lucide-react'

const nextSteps = [
  { icon: Star,           text: 'Jelajahi 50+ menu kopi & hidangan pilihan',     color: 'text-amber-600 bg-amber-50' },
  { icon: UtensilsCrossed,text: 'Tambahkan item favorit ke keranjang belanja',    color: 'text-blue-600 bg-blue-50' },
  { icon: Clock,          text: 'Ambil pesanan dalam hitungan menit',             color: 'text-emerald-600 bg-emerald-50' },
]

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-100/40 to-transparent rounded-full translate-x-1/3 -translate-y-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-primary/5 to-transparent rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl" />
      </div>

      <div className="relative w-full max-w-sm space-y-6">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <Coffee className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
            Coffee House
          </span>
        </Link>

        {/* Card */}
        <div className="bg-card border border-primary/15 rounded-2xl shadow-xl overflow-hidden">
          {/* Success header */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-b border-emerald-100/80 px-6 py-8 text-center space-y-3">
            <div className="flex justify-center">
              {/* Animated rings */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-40 scale-150" />
                <div className="absolute inset-0 rounded-full bg-emerald-50 scale-125" />
                <div className="relative w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-emerald-600" />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-emerald-700 mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Akun Berhasil Dibuat! 🎉
              </h1>
              <p className="text-sm text-emerald-600/80 mt-2 leading-relaxed">
                Selamat bergabung! Silakan masuk untuk mulai memesan kopi dan hidangan lezat kami.
              </p>
            </div>
          </div>

          {/* Next steps */}
          <div className="px-5 pt-4 pb-2 space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Langkah Selanjutnya</p>
            {nextSteps.map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-3 py-1.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm text-foreground/70">{text}</p>
              </div>
            ))}
          </div>

          <div className="px-5 pb-5 pt-3 space-y-2.5">
            <Link href="/auth/login" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 font-semibold h-11 rounded-xl shadow-sm gap-2 press-effect">
                Masuk Sekarang
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full border-primary/20 rounded-xl font-medium h-10">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
