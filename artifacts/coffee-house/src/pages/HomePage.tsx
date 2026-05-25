import { Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { useLocation } from 'wouter'
import {
  Coffee, ShoppingCart, Zap, Star, ArrowRight,
  UserPlus, UtensilsCrossed, CreditCard, PackageCheck, ChevronRight,
} from 'lucide-react'

function CoffeeCupIllustration() {
  return (
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
      <path d="M110 60 C110 40 126 40 126 20" stroke="hsl(25 50% 28%)" strokeWidth="3.5" strokeLinecap="round" opacity="0.3"/>
      <path d="M140 70 C140 50 156 50 156 30" stroke="hsl(25 50% 28%)" strokeWidth="3.5" strokeLinecap="round" opacity="0.25"/>
      <path d="M170 60 C170 40 186 40 186 20" stroke="hsl(25 50% 28%)" strokeWidth="3.5" strokeLinecap="round" opacity="0.3"/>
      <ellipse cx="160" cy="262" rx="90" ry="14" fill="hsl(25 50% 28%)" opacity="0.12"/>
      <path d="M75 248 Q160 268 245 248" stroke="hsl(25 50% 28%)" strokeWidth="2.5" fill="none" opacity="0.2"/>
      <path d="M90 100 L100 240 Q160 258 220 240 L230 100 Z" fill="hsl(35 100% 99%)" stroke="hsl(25 50% 28%)" strokeWidth="2.5" opacity="0.9"/>
      <path d="M95 140 L100 240 Q160 258 220 240 L225 140 Z" fill="hsl(25 45% 55%)" opacity="0.15"/>
      <ellipse cx="160" cy="140" rx="65" ry="10" fill="hsl(25 45% 35%)" opacity="0.18"/>
      <path d="M228 138 Q270 138 270 178 Q270 218 228 218" stroke="hsl(25 50% 28%)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8"/>
      <circle cx="160" cy="180" r="22" fill="hsl(25 50% 28%)" opacity="0.08"/>
      <path d="M151 183 C151 175 160 170 169 175 C178 180 175 190 166 190 C162 190 160 187 160 187 C160 187 158 190 154 190 C148 190 147 185 151 183 Z" fill="hsl(25 50% 28%)" opacity="0.3"/>
    </svg>
  )
}

const steps = [
  { icon: UserPlus,        num: '01', title: 'Buat Akun',       desc: 'Daftar gratis 30 detik',              color: 'bg-primary text-primary-foreground' },
  { icon: UtensilsCrossed, num: '02', title: 'Pilih Menu',      desc: '50+ kopi & hidangan pilihan',          color: 'bg-amber-500 text-white' },
  { icon: CreditCard,      num: '03', title: 'Checkout',        desc: 'Bayar sesuai metode pilihanmu',        color: 'bg-blue-500 text-white' },
  { icon: PackageCheck,    num: '04', title: 'Ambil & Nikmati', desc: 'Siap dalam hitungan menit',            color: 'bg-emerald-500 text-white' },
]

const features = [
  { icon: Coffee,       title: 'Kualitas Premium',  desc: 'Kopi racikan barista profesional dari biji pilihan dengan cita rasa konsisten.', color: 'bg-amber-50 border-amber-200/70',  iconBg: 'bg-amber-100',  iconColor: 'text-amber-700' },
  { icon: Zap,          title: 'Layanan Cepat',     desc: 'Pesan online, ambil di gerai dalam hitungan menit — tanpa antre panjang.',       color: 'bg-sky-50 border-sky-200/70',     iconBg: 'bg-sky-100',    iconColor: 'text-sky-700' },
  { icon: ShoppingCart, title: 'Pemesanan Mudah',   desc: 'Checkout cepat dengan transfer bank, e-wallet, atau bayar di kasir.',            color: 'bg-emerald-50 border-emerald-200/70', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
]

const stats = [
  { value: '50+',  label: 'Pilihan Menu' },
  { value: '5m',   label: 'Waktu Siap' },
  { value: '3×',   label: 'Metode Bayar' },
  { value: '100%', label: 'Barista' },
]

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
      <header className="border-b border-primary/10 bg-background/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <Coffee className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              Coffee House
            </span>
          </div>
          <div className="flex gap-2">
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="border-primary/25 text-primary hover:bg-primary/5 font-medium h-8 text-xs px-3">
                Masuk
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-sm font-medium h-8 text-xs px-3">
                Daftar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden px-4 pt-8 pb-8 md:pt-14 md:pb-12">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-primary/6 to-transparent rounded-full translate-x-1/3 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-accent/6 to-transparent rounded-full -translate-x-1/3 translate-y-1/4" />
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-5 md:gap-10 items-center">

              {/* Text — order 2 on mobile (below illustration) */}
              <div className="space-y-4 text-center md:text-left order-2 md:order-1">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold border border-primary/20">
                  <Star className="h-3 w-3 fill-primary" />
                  Kopi Premium, Layanan Terbaik
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Nikmati Setiap{' '}
                  <span className="text-primary italic">Tegukan</span>{' '}
                  Bersama Kami
                </h1>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md mx-auto md:mx-0">
                  Pesan kopi & hidangan favorit secara online. Racikan barista profesional, siap dalam hitungan menit.
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5 justify-center md:justify-start">
                  <Link href="/auth/sign-up">
                    <Button className="bg-primary hover:bg-primary/90 h-11 px-7 text-sm font-semibold shadow-md inline-flex items-center gap-2 w-full sm:w-auto press-effect">
                      Mulai Pesan Sekarang
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="outline" className="border-primary/25 h-11 px-7 text-sm font-medium text-primary hover:bg-primary/5 w-full sm:w-auto">
                      Sudah Punya Akun?
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground">Bergabung dengan pelanggan setia Coffee House ☕</p>
              </div>

              {/* Illustration — order 1 on mobile (top), smaller */}
              <div className="flex items-center justify-center order-1 md:order-2">
                <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-80 lg:h-80">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/12 to-accent/8 blur-2xl" />
                  <div className="absolute inset-3 rounded-full bg-gradient-to-br from-primary/8 to-accent/5 border border-primary/10" />
                  <div className="absolute inset-5">
                    <CoffeeCupIllustration />
                  </div>
                  {/* Floating badges — hidden on xs to avoid overflow */}
                  <div className="hidden sm:block absolute top-1 -right-3 md:-right-5 bg-card border border-primary/15 rounded-2xl px-2.5 py-1.5 shadow-md">
                    <p className="text-[10px] sm:text-xs font-bold text-primary whitespace-nowrap">☕ 50+ Menu</p>
                  </div>
                  <div className="hidden sm:block absolute bottom-4 -left-4 md:-left-6 bg-card border border-primary/15 rounded-2xl px-2.5 py-1.5 shadow-md">
                    <p className="text-[10px] sm:text-xs font-bold text-emerald-600 whitespace-nowrap">✓ Siap 5 menit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats strip ── */}
        <section className="border-y border-primary/10 bg-card/60 backdrop-blur-sm px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-4 divide-x divide-primary/10">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center px-2 py-1">
                  <p className="text-xl sm:text-2xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>{value}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How to Order ── */}
        <section className="px-4 py-12 md:py-16" style={{ background: 'linear-gradient(180deg, transparent 0%, hsl(25 50% 28% / 0.04) 100%)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wide border border-primary/20 mb-3">
                Cara Pesan
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                4 Langkah Mudah
              </h2>
              <p className="text-muted-foreground mt-1.5 text-sm">Dari daftar sampai kopi di tangan — semua dalam hitungan menit</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
              {steps.map(({ icon: Icon, num, title, desc, color }, i) => (
                <div key={num} className="flex flex-col items-center text-center relative">
                  {i < steps.length - 1 && (
                    <div className="hidden md:flex absolute top-6 left-1/2 w-full items-center justify-end pr-3 z-0">
                      <ChevronRight className="h-4 w-4 text-primary/30" />
                    </div>
                  )}
                  <div className={`relative z-10 w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-md press-effect`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-3 px-2">
                    <p className="text-[10px] font-bold text-primary/50 uppercase tracking-widest">{num}</p>
                    <h4 className="font-bold text-sm text-foreground mt-0.5">{title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link href="/auth/sign-up">
                <Button className="bg-primary hover:bg-primary/90 shadow-sm gap-2 px-6 press-effect">
                  Mulai Sekarang — Gratis <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="px-4 pb-12 md:pb-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-7">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                Kenapa Coffee House?
              </h2>
              <p className="text-muted-foreground mt-1.5 text-sm">Kami hadirkan pengalaman kopi terbaik untuk Anda</p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {features.map(({ icon: Icon, title, desc, color, iconBg, iconColor }) => (
                <div key={title} className={`${color} border rounded-2xl p-5 space-y-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group`}>
                  <div className={`${iconBg} w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <h3 className="font-bold text-foreground text-sm">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="px-4 pb-12">
          <div className="max-w-5xl mx-auto">
            <div
              className="rounded-2xl p-7 md:p-12 text-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, hsl(25 55% 20%) 0%, hsl(20 50% 14%) 100%)' }}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl" />
              </div>
              <div className="relative z-10 space-y-3">
                <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Bergabung Sekarang</p>
                <h2 className="text-xl md:text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Siap Menikmati Kopi Terbaik?
                </h2>
                <p className="text-white/70 text-xs md:text-sm max-w-sm mx-auto">
                  Daftar sekarang dan dapatkan pengalaman memesan kopi yang mudah, cepat, dan menyenangkan.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
                  <Link href="/auth/sign-up">
                    <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-7 h-11 shadow-lg gap-2 press-effect w-full sm:w-auto">
                      Daftar Gratis <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-11 px-7 w-full sm:w-auto">
                      Sudah Punya Akun
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 bg-background py-6">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Coffee className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <p className="font-bold text-primary text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>Coffee House</p>
            </div>
            <div className="flex items-center gap-5 text-xs text-muted-foreground">
              <Link href="/auth/login" className="hover:text-primary transition-colors">Masuk</Link>
              <Link href="/auth/sign-up" className="hover:text-primary transition-colors">Daftar</Link>
              <Link href="/menu" className="hover:text-primary transition-colors">Menu</Link>
            </div>
            <p className="text-xs text-muted-foreground">© 2026 Coffee House.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
