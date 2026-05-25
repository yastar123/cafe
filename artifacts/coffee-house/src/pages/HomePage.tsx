import { Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { useLocation } from 'wouter'
import {
  Coffee, ShoppingCart, Zap, Star, ArrowRight,
  UserPlus, UtensilsCrossed, CreditCard, PackageCheck, ChevronRight,
  MapPin, Clock, Shield,
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
  { icon: UserPlus,        num: '01', title: 'Buat Akun',       desc: 'Daftar gratis 30 detik',        color: 'bg-primary',         shadow: 'shadow-primary/25',    ring: 'ring-primary/20' },
  { icon: UtensilsCrossed, num: '02', title: 'Pilih Menu',      desc: '50+ kopi & hidangan pilihan',   color: 'bg-amber-500',        shadow: 'shadow-amber-500/25',  ring: 'ring-amber-400/20' },
  { icon: CreditCard,      num: '03', title: 'Checkout',        desc: 'Bayar cara yang kamu suka',     color: 'bg-blue-500',         shadow: 'shadow-blue-500/25',   ring: 'ring-blue-400/20' },
  { icon: PackageCheck,    num: '04', title: 'Ambil & Nikmati', desc: 'Siap dalam hitungan menit',     color: 'bg-emerald-500',      shadow: 'shadow-emerald-500/25',ring: 'ring-emerald-400/20' },
]

const features = [
  {
    icon: Coffee,
    title: 'Kualitas Premium',
    desc: 'Kopi racikan barista profesional dari biji pilihan dengan cita rasa yang konsisten setiap saat.',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50/40 border-amber-200/50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    accent: 'bg-amber-500',
  },
  {
    icon: Zap,
    title: 'Layanan Cepat',
    desc: 'Pesan online, ambil di gerai dalam hitungan menit — tanpa antre panjang.',
    bg: 'bg-gradient-to-br from-sky-50 to-blue-50/40 border-sky-200/50',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-700',
    accent: 'bg-sky-500',
  },
  {
    icon: ShoppingCart,
    title: 'Pemesanan Mudah',
    desc: 'Checkout cepat dengan transfer bank, e-wallet, atau bayar tunai di kasir.',
    bg: 'bg-gradient-to-br from-emerald-50 to-green-50/40 border-emerald-200/50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    accent: 'bg-emerald-500',
  },
]

const stats = [
  { value: '50+',   label: 'Pilihan Menu',    color: 'text-primary',      bg: 'bg-primary/8',      border: 'border-primary/15' },
  { value: '< 5m',  label: 'Waktu Siap',      color: 'text-emerald-600',  bg: 'bg-emerald-50',     border: 'border-emerald-200/60' },
  { value: '3',     label: 'Cara Bayar',      color: 'text-blue-600',     bg: 'bg-blue-50',        border: 'border-blue-200/60' },
  { value: '100%',  label: 'Profesional',     color: 'text-amber-600',    bg: 'bg-amber-50',       border: 'border-amber-200/60' },
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
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Coffee className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              Coffee House
            </span>
          </Link>
          <nav className="hidden sm:flex items-center gap-5 text-sm text-muted-foreground">
            <a href="#cara-pesan" className="hover:text-primary transition-colors font-medium">Cara Pesan</a>
            <a href="#keunggulan" className="hover:text-primary transition-colors font-medium">Keunggulan</a>
          </nav>
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
          className="relative overflow-hidden px-4 pt-10 pb-10 md:pt-16 md:pb-16"
          style={{ background: 'linear-gradient(150deg, hsl(35 95% 94%) 0%, hsl(30 65% 95%) 40%, hsl(25 40% 97%) 100%)' }}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-6 left-6 w-2.5 h-2.5 rounded-full bg-primary/15 animate-pulse" />
            <div className="absolute top-20 left-28 w-1.5 h-1.5 rounded-full bg-primary/10" />
            <div className="absolute top-10 right-24 w-2 h-2 rounded-full bg-accent/25" />
            <div className="absolute top-36 right-10 w-1.5 h-1.5 rounded-full bg-primary/12" />
            <div className="absolute bottom-14 left-10 w-2 h-2 rounded-full bg-accent/18" />
            <div className="absolute bottom-6 right-36 w-1.5 h-1.5 rounded-full bg-primary/12" />
            <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-gradient-to-bl from-primary/10 to-transparent rounded-full translate-x-1/3 -translate-y-1/4 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent/8 to-transparent rounded-full -translate-x-1/3 translate-y-1/4 blur-2xl" />
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

              {/* Text */}
              <div className="space-y-5 text-center md:text-left order-2 md:order-1 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 bg-primary/12 text-primary px-4 py-1.5 rounded-full text-xs font-bold border border-primary/20 shadow-sm">
                  <Star className="h-3 w-3 fill-primary" />
                  Kopi Premium, Layanan Terbaik
                </div>
                <h1
                  className="text-[2.1rem] sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold text-foreground leading-[1.12]"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Nikmati Setiap{' '}
                  <span className="text-primary italic relative">
                    Tegukan
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary/25 rounded-full hidden md:block" />
                  </span>{' '}
                  Bersama Kami
                </h1>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md mx-auto md:mx-0">
                  Pesan kopi & hidangan favorit secara online. Racikan barista profesional, siap dalam hitungan menit.
                </p>

                {/* Trust signals */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary/60" />
                    Ambil di Gerai
                  </span>
                  <span className="w-px h-4 bg-primary/15" />
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-emerald-600" />
                    Siap &lt; 5 Menit
                  </span>
                  <span className="w-px h-4 bg-primary/15" />
                  <span className="flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-blue-600" />
                    Gratis Daftar
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-1">
                  <Link href="/auth/sign-up" className="sm:flex-none">
                    <Button className="bg-primary hover:bg-primary/90 h-12 px-8 text-sm font-semibold shadow-lg shadow-primary/25 inline-flex items-center gap-2 w-full sm:w-auto press-effect rounded-xl">
                      Mulai Pesan Sekarang
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/login" className="sm:flex-none">
                    <Button variant="outline" className="border-primary/25 bg-white/70 backdrop-blur-sm h-12 px-8 text-sm font-medium text-primary hover:bg-white/90 w-full sm:w-auto rounded-xl shadow-sm">
                      Sudah Punya Akun?
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground/60">Bergabung dengan pelanggan setia Coffee House ☕</p>
              </div>

              {/* Illustration */}
              <div className="flex items-center justify-center order-1 md:order-2 animate-fade-in delay-200">
                <div className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-[300px] md:h-[300px] lg:w-[340px] lg:h-[340px] animate-float">
                  <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-primary/15 to-accent/10 blur-3xl opacity-70" />
                  <div
                    className="absolute inset-0 rounded-full border border-primary/12 shadow-2xl"
                    style={{ background: 'radial-gradient(circle at 35% 30%, hsl(35 85% 93%) 0%, hsl(30 60% 90%) 55%, hsl(28 48% 88%) 100%)' }}
                  />
                  <div className="absolute inset-5 rounded-full border border-primary/8" />
                  <div className="absolute inset-[22px]">
                    <CoffeeCupIllustration />
                  </div>
                  {/* Floating badge — menu count */}
                  <div className="hidden sm:flex absolute -top-1 -right-2 md:-right-5 items-center gap-1.5 bg-white border border-primary/15 rounded-2xl px-3 py-1.5 shadow-lg shadow-primary/12 animate-scale-in delay-400">
                    <Coffee className="h-3.5 w-3.5 text-primary" />
                    <p className="text-xs font-bold text-primary whitespace-nowrap">50+ Menu</p>
                  </div>
                  {/* Floating badge — ready time */}
                  <div className="hidden sm:flex absolute bottom-4 -left-4 md:-left-8 items-center gap-1.5 bg-white border border-emerald-200 rounded-2xl px-3 py-1.5 shadow-lg shadow-emerald-100 animate-scale-in delay-500">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-xs font-bold text-emerald-600 whitespace-nowrap">Siap 5 menit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats strip ── */}
        <section className="border-y border-primary/10 bg-white/80 backdrop-blur-sm shadow-sm px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {stats.map(({ value, label, color, bg, border }) => (
                <div key={label} className={`${bg} ${border} border rounded-xl sm:rounded-2xl px-2 sm:px-4 py-3 text-center`}>
                  <p className={`text-lg sm:text-2xl font-bold ${color}`} style={{ fontFamily: 'Playfair Display, serif' }}>
                    {value}
                  </p>
                  <p className="text-[9px] sm:text-[11px] text-muted-foreground mt-0.5 font-semibold leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How to Order ── */}
        <section
          id="cara-pesan"
          className="px-4 py-12 md:py-20"
          style={{ background: 'linear-gradient(180deg, transparent 0%, hsl(25 50% 28% / 0.03) 100%)' }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider border border-primary/20 mb-3">
                Cara Pesan
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                4 Langkah Mudah
              </h2>
              <p className="text-muted-foreground mt-2 text-sm max-w-xs mx-auto">Dari daftar sampai kopi di tangan — semua dalam hitungan menit</p>
            </div>

            {/* Mobile: horizontal scroll | Desktop: 4-col */}
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-none md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
              {steps.map(({ icon: Icon, num, title, desc, color, shadow, ring }, i) => (
                <div
                  key={num}
                  className="flex-shrink-0 w-40 snap-center md:flex-shrink md:w-auto"
                >
                  {/* Card */}
                  <div className={`bg-card border border-primary/10 rounded-2xl p-4 md:p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col items-center relative`}>
                    {/* Connector line on desktop */}
                    {i < steps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] right-0 h-px border-t-2 border-dashed border-primary/15 z-0" />
                    )}
                    <div className={`relative z-10 w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center shadow-lg ${shadow} press-effect ring-4 ${ring} group-hover:scale-105 transition-transform duration-200 mb-3`}>
                      <Icon className="h-6 w-6" />
                      <span className="absolute -top-2 -right-2 text-[9px] font-black bg-white border-2 border-current/10 text-foreground/60 rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                        {num}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-foreground leading-tight">{title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll dots — mobile only */}
            <div className="flex items-center justify-center gap-1.5 mt-3 md:hidden">
              {steps.map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-primary/25" />
              ))}
              <span className="text-[10px] text-muted-foreground/50 ml-2">geser →</span>
            </div>

            <div className="mt-10 text-center">
              <Link href="/auth/sign-up">
                <Button className="bg-primary hover:bg-primary/90 shadow-md gap-2 px-7 press-effect rounded-xl h-11 font-semibold">
                  Mulai Sekarang — Gratis <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="keunggulan" className="px-4 pb-14 md:pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider border border-primary/20 mb-3">
                Keunggulan Kami
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                Kenapa Coffee House?
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">Kami hadirkan pengalaman kopi terbaik untuk Anda</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map(({ icon: Icon, title, desc, bg, iconBg, iconColor, accent }) => (
                <div key={title} className={`${bg} border rounded-2xl p-5 md:p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-default relative overflow-hidden`}>
                  {/* Top accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${accent} opacity-70`} />
                  <div className={`${iconBg} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                  </div>
                  <h3 className="font-bold text-foreground text-base mb-1.5">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="px-4 pb-14 md:pb-20">
          <div className="max-w-5xl mx-auto">
            <div
              className="rounded-3xl p-8 md:p-16 text-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, hsl(25 55% 18%) 0%, hsl(20 50% 12%) 100%)' }}
            >
              {/* Decorative */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl" />
                <div className="absolute top-5 left-5 w-2 h-2 bg-white/25 rounded-full" />
                <div className="absolute top-12 left-20 w-1.5 h-1.5 bg-white/15 rounded-full" />
                <div className="absolute top-8 right-1/4 w-1 h-1 bg-white/20 rounded-full" />
                <div className="absolute bottom-5 right-8 w-2 h-2 bg-white/25 rounded-full" />
                <div className="absolute bottom-12 right-24 w-1.5 h-1.5 bg-white/15 rounded-full" />
              </div>
              <div className="relative z-10 space-y-5 max-w-xl mx-auto">
                <div className="inline-flex items-center gap-1.5 bg-white/12 border border-white/20 rounded-full px-4 py-1.5">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <span className="text-white/85 text-xs font-semibold">Bergabung Sekarang</span>
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Siap Menikmati Kopi Terbaik?
                </h2>
                <p className="text-white/60 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
                  Daftar sekarang dan dapatkan pengalaman memesan kopi yang mudah, cepat, dan menyenangkan.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
                  <Link href="/auth/sign-up">
                    <Button className="bg-white text-primary hover:bg-white/92 font-bold px-8 h-12 shadow-xl gap-2 press-effect w-full sm:w-auto rounded-xl text-sm">
                      Daftar Gratis <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/12 h-12 px-8 w-full sm:w-auto rounded-xl backdrop-blur-sm text-sm">
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
      <footer
        className="border-t border-primary/10 py-10 md:py-12"
        style={{ background: 'linear-gradient(180deg, hsl(35 80% 97%) 0%, hsl(30 50% 96%) 100%)' }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                  <Coffee className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-primary text-base" style={{ fontFamily: 'Playfair Display, serif' }}>Coffee House</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                Kopi premium, barista profesional, layanan cepat — semua dalam genggaman Anda.
              </p>
            </div>
            {/* Links */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">Navigasi</p>
              <div className="space-y-2">
                {[
                  { href: '/auth/login',    label: 'Masuk' },
                  { href: '/auth/sign-up',  label: 'Daftar Gratis' },
                  { href: '/menu',          label: 'Lihat Menu' },
                ].map(({ href, label }) => (
                  <div key={label}>
                    <Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group">
                      <ChevronRight className="h-3 w-3 text-primary/30 group-hover:text-primary/60 transition-colors" />
                      {label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            {/* Info */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">Info</p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-primary/40 flex-shrink-0" />
                  Buka setiap hari, 07.00 – 22.00
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary/40 flex-shrink-0" />
                  Ambil pesanan di gerai kami
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-primary/40 flex-shrink-0" />
                  Daftar & pesan 100% gratis
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-primary/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">© 2026 Coffee House. All rights reserved.</p>
            <p className="text-xs text-muted-foreground/50">Dibuat dengan ☕ dan dedikasi</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
