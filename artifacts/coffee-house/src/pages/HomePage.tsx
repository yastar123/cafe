import { Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { Coffee, ShoppingCart, Zap, Star, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const [, setLocation] = useLocation()

  useEffect(() => {
    const user = sessionStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      if (userData.role === 'admin') {
        setLocation('/admin')
      } else {
        setLocation('/menu')
      }
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
        <section className="relative overflow-hidden px-4 py-16 md:py-24">
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/8 to-transparent rounded-full translate-x-1/2 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent/8 to-transparent rounded-full -translate-x-1/3 translate-y-1/4" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/4 to-transparent rounded-full" />
          </div>

          <div className="relative max-w-3xl mx-auto text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold border border-primary/20">
              <Star className="h-3.5 w-3.5 fill-primary" />
              Kopi Premium, Layanan Terbaik
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight text-balance" style={{ fontFamily: 'Playfair Display, serif' }}>
              Nikmati Setiap Tegukan <span className="text-primary">Coffee House</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-xl mx-auto">
              Pesan kopi & hidangan favorit Anda secara online. Racikan barista profesional, siap dalam hitungan menit.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
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

            {/* Social proof */}
            <p className="text-xs text-muted-foreground pt-2">
              Bergabung dengan pelanggan setia Coffee House ☕
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 pb-16 md:pb-24">
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
