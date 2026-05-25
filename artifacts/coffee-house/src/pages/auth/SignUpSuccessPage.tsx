import { Button } from '@/components/ui/button'
import { Link } from 'wouter'
import { CheckCircle, Coffee, ArrowRight, Star, UtensilsCrossed, Clock, Sparkles } from 'lucide-react'

const nextSteps = [
  { icon: Star,           text: 'Jelajahi 50+ menu kopi & hidangan pilihan',    color: 'from-amber-400 to-amber-600',   bg: 'bg-amber-50/60' },
  { icon: UtensilsCrossed,text: 'Tambahkan item favorit ke keranjang belanja',  color: 'from-blue-400 to-blue-600',     bg: 'bg-blue-50' },
  { icon: Clock,          text: 'Ambil pesanan siap dalam hitungan menit',      color: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50/60' },
]

export default function SignUpSuccessPage() {
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
      </div>

      {/* Top bar */}
      <div className="relative flex items-center justify-center pt-8 pb-4 px-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Coffee className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
            Coffee House
          </span>
        </Link>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-start justify-center px-4 pb-8 pt-2">
        <div className="relative w-full max-w-sm">

          {/* Sparkle accent */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md z-10">
            <Sparkles className="h-3 w-3" />
            Selamat Bergabung!
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-emerald-100 rounded-3xl shadow-2xl overflow-hidden">

            {/* Success hero */}
            <div
              className="px-6 pt-10 pb-7 text-center space-y-3 border-b border-emerald-100"
              style={{ background: 'linear-gradient(180deg, hsl(150 60% 97%) 0%, hsl(150 40% 96%) 100%)' }}
            >
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
                  Akun Berhasil Dibuat! 🎉
                </h1>
                <p className="text-sm text-emerald-600/80 mt-1.5 leading-relaxed max-w-xs mx-auto">
                  Selamat bergabung! Silakan masuk untuk mulai memesan kopi dan hidangan lezat kami.
                </p>
              </div>
            </div>

            <div className="px-5 py-5 space-y-4">
              {/* Next steps */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Langkah Selanjutnya</p>
                <div className="space-y-2">
                  {nextSteps.map(({ icon: Icon, text, color, bg }, i) => (
                    <div key={i} className={`flex items-center gap-3 ${bg} rounded-xl px-3.5 py-3 border border-black/5`}>
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-sm text-foreground/70 leading-snug">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2 pt-1">
                <Link href="/auth/login" className="block">
                  <Button className="w-full bg-primary hover:bg-primary/90 font-semibold h-11 rounded-xl shadow-sm gap-2 press-effect">
                    Masuk Sekarang <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full border-primary/20 rounded-xl font-medium h-10 text-primary hover:bg-primary/5">
                    Kembali ke Beranda
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
