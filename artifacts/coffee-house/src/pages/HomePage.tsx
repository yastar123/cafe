import { Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { Coffee, ShoppingCart, Zap, Star, ArrowRight } from 'lucide-react'

function CoffeeCupIllustration() {
  return (
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Steam lines */}
      <path d="M110 60 C110 40 126 40 126 20" stroke="hsl(25 50% 28%)" strokeWidth="3.5" strokeLinecap="round" opacity="0.3"/>
      <path d="M140 70 C140 50 156 50 156 30" stroke="hsl(25 50% 28%)" strokeWidth="3.5" strokeLinecap="round" opacity="0.25"/>
      <path d="M170 60 C170 40 186 40 186 20" stroke="hsl(25 50% 28%)" strokeWidth="3.5" strokeLinecap="round" opacity="0.3"/>
      {/* Saucer */}
      <ellipse cx="160" cy="262" rx="90" ry="14" fill="hsl(25 50% 28%)" opacity="0.12"/>
      <path d="M75 248 Q160 268 245 248" stroke="hsl(25 50% 28%)" strokeWidth="2.5" fill="none" opacity="0.2"/>
      {/* Cup body */}
      <path d="M90 100 L100 240 Q160 258 220 240 L230 100 Z" fill="hsl(35 100% 99%)" stroke="hsl(25 50% 28%)" strokeWidth="2.5" opacity="0.9"/>
      {/* Cup gradient fill - coffee */}
      <path d="M95 140 L100 240 Q160 258 220 240 L225 140 Z" fill="hsl(25 45% 55%)" opacity="0.15"/>
      {/* Coffee surface */}
      <ellipse cx="160" cy="140" rx="65" ry="10" fill="hsl(25 45% 35%)" opacity="0.18"/>
      {/* Handle */}
      <path d="M228 138 Q270 138 270 178 Q270 218 228 218" stroke="hsl(25 50% 28%)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8"/>
      {/* Logo/brand mark on cup */}
      <circle cx="160" cy="180" r="22" fill="hsl(25 50% 28%)" opacity="0.08"/>
      <path d="M151 183 C151 175 160 170 169 175 C178 180 175 190 166 190 C162 190 160 187 160 187 C160 187 158 190 154 190 C148 190 147 185 151 183 Z" fill="hsl(25 50% 28%)" opacity="0.3"/>
    </svg>
  )
}

export default function HomePage() {
  const [, setLocation] = useLocation()

  useEffect(() => {
    const user = sessionStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setLocation(userData.role === 'admin' ? '/admin' : '/menu')
    }
  }, [setLocation])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-primary/10 bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <Coffee className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              Coffee House
            </span>
          </div>
          <div className="flex gap-2.5">
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="border-primary/25 text-primary hover:bg-primary/5 font-medium">
                Masuk
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-sm font-medium">
                Daftar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero section */}
        <section className="relative overflow-hidden px-4 py-14 md:py-20">
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/6 to-transparent rounded-full translate-x-1/3 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/6 to-transparent rounded-full -translate-x-1/3 translate-y-1/4" />
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: text */}
              <div className="space-y-6 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold border border-primary/20">
                  <Star className="h-3.5 w-3.5 fill-primary" />
                  Kopi Premium, Layanan Terbaik
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Nikmati Setiap{' '}
                  <span className="text-primary italic">Tegukan</span>{' '}
                  Bersama Kami
                </h1>

                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                  Pesan kopi & hidangan favorit Anda secara online. Racikan barista profesional, siap dalam hitungan menit.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link href="/auth/sign-up">
                    <Button className="bg-primary hover:bg-primary/90 h-12 px-8 text-base font-semibold shadow-md inline-flex items-center gap-2">
                      Mulai Pesan Sekarang
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="outline" className="border-primary/25 h-12 px-8 text-base font-medium text-primary hover:bg-primary/5">
                      Sudah Punya Akun?
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-muted-foreground">
                  Bergabung dengan pelanggan setia Coffee House ☕
                </p>
              </div>

              {/* Right: illustration */}
              <div className="hidden md:flex items-center justify-center">
                <div className="relative w-72 h-72 lg:w-80 lg:h-80">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-accent/8 blur-2xl" />
                  {/* Circle background */}
                  <div className="absolute inset-6 rounded-full bg-gradient-to-br from-primary/8 to-accent/5 border border-primary/10" />
                  {/* Illustration */}
                  <div className="absolute inset-8">
                    <CoffeeCupIllustration />
                  </div>
                  {/* Floating badges */}
                  <div className="absolute top-4 -right-4 bg-card border border-primary/15 rounded-2xl px-3 py-2 shadow-md">
                    <p className="text-xs font-bold text-primary">☕ 50+ Menu</p>
                  </div>
                  <div className="absolute bottom-8 -left-6 bg-card border border-primary/15 rounded-2xl px-3 py-2 shadow-md">
                    <p className="text-xs font-bold text-emerald-600">✓ Siap 5 menit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 pb-16 md:pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: Coffee,
                  title: 'Kualitas Premium',
                  desc: 'Kopi racikan barista profesional dari biji pilihan dengan cita rasa konsisten',
                  color: 'bg-amber-50 border-amber-200/60',
                  iconBg: 'bg-amber-100',
                  iconColor: 'text-amber-700',
                },
                {
                  icon: Zap,
                  title: 'Layanan Cepat',
                  desc: 'Pesan online, ambil di gerai dalam hitungan menit — tanpa antre panjang',
                  color: 'bg-blue-50 border-blue-200/60',
                  iconBg: 'bg-blue-100',
                  iconColor: 'text-blue-700',
                },
                {
                  icon: ShoppingCart,
                  title: 'Pemesanan Mudah',
                  desc: 'Checkout cepat dengan pilihan transfer bank, e-wallet, atau bayar di kasir',
                  color: 'bg-emerald-50 border-emerald-200/60',
                  iconBg: 'bg-emerald-100',
                  iconColor: 'text-emerald-700',
                },
              ].map(({ icon: Icon, title, desc, color, iconBg, iconColor }) => (
                <div key={title} className={`${color} border rounded-2xl p-6 space-y-3 hover:shadow-md transition-all duration-200`}>
                  <div className={`${iconBg} w-11 h-11 rounded-xl flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-foreground text-base">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-primary/10 bg-background/50 py-5">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 Coffee House. Hak cipta dilindungi undang-undang.</p>
        </div>
      </footer>
    </div>
  )
}
