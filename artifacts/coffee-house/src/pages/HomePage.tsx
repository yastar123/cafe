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
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
      <path d="M110 60 C110 40 126 40 126 20" stroke="hsl(25 50% 28%)" strokeWidth="3.5" strokeLinecap="round" opacity="0.35"/>
      <path d="M140 70 C140 50 156 50 156 30" stroke="hsl(25 50% 28%)" strokeWidth="3.5" strokeLinecap="round" opacity="0.28"/>
      <path d="M170 60 C170 40 186 40 186 20" stroke="hsl(25 50% 28%)" strokeWidth="3.5" strokeLinecap="round" opacity="0.35"/>
      <ellipse cx="160" cy="262" rx="92" ry="15" fill="hsl(25 50% 28%)" opacity="0.14"/>
      <path d="M75 248 Q160 268 245 248" stroke="hsl(25 50% 28%)" strokeWidth="2.5" fill="none" opacity="0.2"/>
      <path d="M90 100 L100 240 Q160 260 220 240 L230 100 Z" fill="hsl(35 100% 99%)" stroke="hsl(25 50% 28%)" strokeWidth="2.5" opacity="0.95"/>
      <path d="M95 140 L100 240 Q160 260 220 240 L225 140 Z" fill="hsl(25 45% 55%)" opacity="0.18"/>
      <ellipse cx="160" cy="140" rx="65" ry="11" fill="hsl(25 45% 35%)" opacity="0.2"/>
      <path d="M228 138 Q272 138 272 178 Q272 218 228 218" stroke="hsl(25 50% 28%)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.85"/>
      <circle cx="160" cy="182" r="24" fill="hsl(25 50% 28%)" opacity="0.09"/>
      <path d="M151 183 C151 175 160 170 169 175 C178 180 175 190 166 190 C162 190 160 187 160 187 C160 187 158 190 154 190 C148 190 147 185 151 183 Z" fill="hsl(25 50% 28%)" opacity="0.35"/>
    </svg>
  )
}

const steps = [
  { icon: UserPlus,        num: '01', title: 'Buat Akun',       desc: 'Daftar gratis 30 detik',        color: 'bg-primary',         shadow: 'shadow-primary/25' },
  { icon: UtensilsCrossed, num: '02', title: 'Pilih Menu',      desc: '50+ kopi & hidangan pilihan',   color: 'bg-amber-500',        shadow: 'shadow-amber-500/25' },
  { icon: CreditCard,      num: '03', title: 'Checkout',        desc: 'Bayar cara yang kamu suka',     color: 'bg-blue-500',         shadow: 'shadow-blue-500/25' },
  { icon: PackageCheck,    num: '04', title: 'Ambil & Nikmati', desc: 'Siap dalam hitungan menit',     color: 'bg-emerald-500',      shadow: 'shadow-emerald-500/25' },
]

const features = [
  { icon: Coffee,       title: 'Kualitas Premium',  desc: 'Kopi racikan barista profesional dari biji pilihan dengan cita rasa yang konsisten.', bg: 'bg-amber-50 border-amber-200/60',   iconBg: 'bg-amber-100',   iconColor: 'text-amber-700' },
  { icon: Zap,          title: 'Layanan Cepat',     desc: 'Pesan online, ambil di gerai dalam hitungan menit — tanpa antre panjang.',             bg: 'bg-sky-50 border-sky-200/60',       iconBg: 'bg-sky-100',     iconColor: 'text-sky-700' },
  { icon: ShoppingCart, title: 'Pemesanan Mudah',   desc: 'Checkout cepat dengan transfer bank, e-wallet, atau bayar tunai di kasir.',            bg: 'bg-emerald-50 border-emerald-200/60', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
]

const stats = [
  { value: '50+',    label: 'Pilihan Menu',    color: 'text-primary' },
  { value: '< 5m',  label: 'Waktu Siap',      color: 'text-emerald-600' },
  { value: '3',     label: 'Cara Pembayaran', color: 'text-blue-600' },
  { value: '100%',  label: 'Profesional',     color: 'text-amber-600' },
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
      {/* ── Header ── */}
      <header className="border-b border-primary/10 bg-background/90 backdrop-blur-md sticky top-0 z-50">
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
              <Button variant="outline" size="sm" className="border-primary/25 text-primary hover:bg-primary/5 font-medium h-8 text-xs px-3 rounded-xl">
                Masuk
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-sm font-medium h-8 text-xs px-3 rounded-xl">
                Daftar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section
          className="relative overflow-hidden px-4 pt-8 pb-8 md:pt-14 md:pb-14"
          style={{ background: 'linear-gradient(160deg, hsl(35 90% 95%) 0%, hsl(30 60% 96%) 45%, hsl(25 35% 97%) 100%)' }}
        >
          {/* Decorative dots */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-8 left-8 w-2 h-2 rounded-full bg-primary/20" />
            <div className="absolute top-16 left-24 w-1.5 h-1.5 rounded-full bg-primary/15" />
            <div className="absolute top-12 right-20 w-2 h-2 rounded-full bg-accent/30" />
            <div className="absolute top-32 right-8 w-1.5 h-1.5 rounded-full bg-primary/15" />
            <div className="absolute bottom-16 left-12 w-2 h-2 rounded-full bg-accent/20" />
            <div className="absolute bottom-8 right-32 w-1.5 h-1.5 rounded-full bg-primary/15" />
            <div className="absolute bottom-20 left-40 w-1 h-1 rounded-full bg-primary/20 hidden sm:block" />
            <div className="absolute top-20 left-1/2 w-1 h-1 rounded-full bg-primary/10 hidden md:block" />
            {/* Large soft blobs */}
            <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-gradient-to-bl from-primary/8 to-transparent rounded-full translate-x-1/3 -translate-y-1/4 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/8 to-transparent rounded-full -translate-x-1/3 translate-y-1/4 blur-2xl" />
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">

              {/* Text — below illustration on mobile */}
              <div className="space-y-4 text-center md:text-left order-2 md:order-1">
                <div className="inline-flex items-center gap-2 bg-primary/12 text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold border border-primary/20 shadow-sm">
                  <Star className="h-3 w-3 fill-primary" />
                  Kopi Premium, Layanan Terbaik
                </div>
                <h1
                  className="text-[2rem] sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-[1.15]"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Nikmati Setiap{' '}
                  <span className="text-primary italic">Tegukan</span>{' '}
                  Bersama Kami
                </h1>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-sm mx-auto md:mx-0">
                  Pesan kopi & hidangan favorit secara online. Racikan barista profesional, siap dalam hitungan menit.
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5 justify-center md:justify-start pt-1">
                  <Link href="/auth/sign-up" className="sm:flex-none">
                    <Button className="bg-primary hover:bg-primary/90 h-11 px-7 text-sm font-semibold shadow-lg shadow-primary/20 inline-flex items-center gap-2 w-full sm:w-auto press-effect rounded-xl">
                      Mulai Pesan Sekarang
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/login" className="sm:flex-none">
                    <Button variant="outline" className="border-primary/25 bg-white/60 backdrop-blur-sm h-11 px-7 text-sm font-medium text-primary hover:bg-white/80 w-full sm:w-auto rounded-xl shadow-sm">
                      Sudah Punya Akun?
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground/70">Bergabung dengan pelanggan setia Coffee House ☕</p>
              </div>

              {/* Illustration */}
              <div className="flex items-center justify-center order-1 md:order-2">
                <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80">
                  {/* Outer glow */}
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/12 blur-3xl opacity-60" />
                  {/* Circle background — warm amber tint */}
                  <div
                    className="absolute inset-0 rounded-full border border-primary/15 shadow-xl"
                    style={{ background: 'radial-gradient(circle at 35% 30%, hsl(35 80% 93%) 0%, hsl(30 55% 90%) 60%, hsl(28 45% 88%) 100%)' }}
                  />
                  {/* Inner subtle ring */}
                  <div className="absolute inset-4 rounded-full border border-primary/8" />
                  {/* SVG illustration */}
                  <div className="absolute inset-6">
                    <CoffeeCupIllustration />
                  </div>
                  {/* Floating badges */}
                  <div className="hidden sm:flex absolute top-0 -right-4 md:-right-6 items-center gap-1.5 bg-white border border-primary/15 rounded-2xl px-2.5 py-1.5 shadow-lg shadow-primary/10">
                    <Coffee className="h-3 w-3 text-primary" />
                    <p className="text-xs font-bold text-primary whitespace-nowrap">50+ Menu</p>
                  </div>
                  <div className="hidden sm:flex absolute bottom-6 -left-5 md:-left-8 items-center gap-1.5 bg-white border border-emerald-200 rounded-2xl px-2.5 py-1.5 shadow-lg shadow-emerald-100">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <p className="text-xs font-bold text-emerald-600 whitespace-nowrap">Siap 5 menit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats strip ── */}
        <section className="border-y border-primary/10 bg-white/70 backdrop-blur-sm shadow-sm px-4 py-5">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-4 divide-x divide-primary/10">
              {stats.map(({ value, label, color }) => (
                <div key={label} className="text-center px-2">
                  <p className={`text-xl sm:text-2xl font-bold ${color}`} style={{ fontFamily: 'Playfair Display, serif' }}>
                    {value}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 font-medium leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How to Order ── */}
        <section
          className="px-4 py-12 md:py-16"
          style={{ background: 'linear-gradient(180deg, transparent 0%, hsl(25 50% 28% / 0.03) 100%)' }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider border border-primary/20 mb-3">
                Cara Pesan
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                4 Langkah Mudah
              </h2>
              <p className="text-muted-foreground mt-1.5 text-sm">Dari daftar sampai kopi di tangan — semua dalam hitungan menit</p>
            </div>

            {/* Mobile: horizontal scroll strip | Desktop: grid */}
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-none md:grid md:grid-cols-4 md:gap-0 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
              {steps.map(({ icon: Icon, num, title, desc, color, shadow }, i) => (
                <div
                  key={num}
                  className="flex-shrink-0 w-36 snap-center flex flex-col items-center text-center relative md:flex-shrink md:w-auto"
                >
                  {i < steps.length - 1 && (
                    <div className="hidden md:flex absolute top-6 left-1/2 w-full items-center justify-end pr-2 z-0">
                      <ChevronRight className="h-4 w-4 text-primary/25" />
                    </div>
                  )}
                  <div className={`relative z-10 w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center shadow-lg ${shadow} press-effect`}>
                    <Icon className="h-6 w-6" />
                    <span className="absolute -top-2 -right-2 text-[9px] font-bold bg-white border border-current/20 text-foreground/50 rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                      {num}
                    </span>
                  </div>
                  <div className="mt-3 px-1 space-y-0.5">
                    <h4 className="font-bold text-sm text-foreground">{title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Scroll hint on mobile */}
            <div className="flex items-center justify-center gap-1.5 mt-3 md:hidden">
              {steps.map((s, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-primary/20" />
              ))}
              <span className="text-[10px] text-muted-foreground/50 ml-1">← geser →</span>
            </div>

            <div className="mt-8 text-center">
              <Link href="/auth/sign-up">
                <Button className="bg-primary hover:bg-primary/90 shadow-sm gap-2 px-6 press-effect rounded-xl h-11">
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
            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-4">
              {features.map(({ icon: Icon, title, desc, bg, iconBg, iconColor }) => (
                <div key={title} className={`${bg} border rounded-2xl p-4 sm:p-5 flex sm:flex-col items-start gap-3.5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group cursor-default`}>
                  <div className={`${iconBg} w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground text-sm">{title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="px-4 pb-12">
          <div className="max-w-5xl mx-auto">
            <div
              className="rounded-3xl p-8 md:p-14 text-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, hsl(25 55% 18%) 0%, hsl(20 50% 12%) 100%)' }}
            >
              {/* Decorative elements */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl" />
                <div className="absolute top-4 left-4 w-2 h-2 bg-white/20 rounded-full" />
                <div className="absolute top-10 left-16 w-1.5 h-1.5 bg-white/15 rounded-full" />
                <div className="absolute bottom-4 right-6 w-2 h-2 bg-white/20 rounded-full" />
                <div className="absolute bottom-10 right-20 w-1.5 h-1.5 bg-white/15 rounded-full" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <span className="text-white/80 text-xs font-medium">Bergabung Sekarang</span>
                </div>
                <h2 className="text-xl md:text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Siap Menikmati Kopi Terbaik?
                </h2>
                <p className="text-white/65 text-xs md:text-sm max-w-sm mx-auto">
                  Daftar sekarang dan dapatkan pengalaman memesan kopi yang mudah, cepat, dan menyenangkan.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
                  <Link href="/auth/sign-up">
                    <Button className="bg-white text-primary hover:bg-white/92 font-semibold px-7 h-11 shadow-xl gap-2 press-effect w-full sm:w-auto rounded-xl">
                      Daftar Gratis <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-11 px-7 w-full sm:w-auto rounded-xl backdrop-blur-sm">
                      Sudah Punya Akun
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
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
            <p className="text-xs text-muted-foreground">© 2026 Coffee House. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
