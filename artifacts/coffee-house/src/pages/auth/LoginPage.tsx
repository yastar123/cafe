import { Link, useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { toast } from 'sonner'
import { api, setUser } from '@/lib/api'
import { Coffee, Eye, EyeOff, AlertCircle, ArrowRight, Star, Zap, CreditCard, Clock } from 'lucide-react'

const perks = [
  { icon: Coffee,     label: '50+ pilihan menu kopi & hidangan segar' },
  { icon: Zap,        label: 'Pesanan siap diambil dalam 5 menit' },
  { icon: CreditCard, label: 'Bayar transfer, e-wallet, atau tunai' },
]

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [, setLocation] = useLocation()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const { token, user } = await api.auth.login(username, password)
      setUser(user, token)
      toast.success('Selamat datang kembali, ' + user.username + '!')
      setLocation(user.role === 'admin' ? '/admin' : '/menu')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat mencoba masuk'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — tablet + desktop ── */}
      <div
        className="hidden md:flex md:w-2/5 xl:w-1/2 flex-col items-center justify-center p-10 xl:p-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, hsl(25 55% 20%) 0%, hsl(20 50% 14%) 60%, hsl(15 45% 10%) 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-white/4 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-white/4 rounded-full blur-2xl" />
          <div className="absolute top-10 left-10 w-2 h-2 bg-white/20 rounded-full" />
          <div className="absolute top-24 left-28 w-1.5 h-1.5 bg-white/12 rounded-full" />
          <div className="absolute top-48 left-14 w-1 h-1 bg-white/10 rounded-full" />
          <div className="absolute bottom-12 right-12 w-2 h-2 bg-white/20 rounded-full" />
          <div className="absolute bottom-32 right-32 w-1.5 h-1.5 bg-white/12 rounded-full" />
          <div className="absolute top-1/2 right-8 w-1 h-1 bg-white/10 rounded-full" />
        </div>
        <div className="relative z-10 text-center space-y-8 max-w-xs">
          <div className="w-20 h-20 rounded-3xl bg-white/12 flex items-center justify-center mx-auto backdrop-blur-sm border border-white/15 shadow-2xl">
            <Coffee className="h-10 w-10 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3.5 py-1.5 mb-4">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className="text-white/80 text-xs font-semibold">Kopi Premium</span>
            </div>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              Coffee House
            </h2>
            <p className="text-white/55 mt-2.5 text-sm leading-relaxed">
              Kopi premium, barista profesional, siap dalam hitungan menit.
            </p>
          </div>
          <div className="space-y-2.5 text-left">
            {perks.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-white/70 text-sm bg-white/6 rounded-xl px-4 py-3 border border-white/8">
                <div className="w-7 h-7 rounded-lg bg-white/12 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-3.5 w-3.5 text-white/65" />
                </div>
                {label}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
            <Clock className="h-3.5 w-3.5" />
            Buka setiap hari, 07.00 – 22.00
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-primary/5 to-transparent rounded-full translate-x-1/3 -translate-y-1/4 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-accent/4 to-transparent rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl" />
        </div>

        <div className="md:hidden flex items-center gap-3 px-5 pt-6 pb-2 relative">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Coffee className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              Coffee House
            </span>
          </Link>
          <span className="ml-auto text-xs text-muted-foreground shrink-0">
            Belum punya akun?{' '}
            <Link href="/auth/sign-up" className="text-primary font-bold hover:underline">Daftar</Link>
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center px-5 sm:px-10 py-6 relative">
          <div className="w-full max-w-sm mx-auto space-y-5">
            <div className="animate-fade-in-up">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                Selamat Datang
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5">
                Masuk untuk memesan kopi & hidangan favorit Anda
              </p>
            </div>

            <div className="bg-card border border-primary/12 rounded-2xl shadow-lg overflow-hidden animate-fade-in-up delay-100">
              <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary/50" />
              <form onSubmit={handleLogin} className="px-5 sm:px-6 py-5 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-sm font-semibold">Nama Pengguna</Label>
                  <Input
                    id="username" type="text" placeholder="Masukkan username"
                    required autoComplete="username"
                    value={username} onChange={(e) => setUsername(e.target.value)}
                    className="border-primary/20 focus:border-primary/50 h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm font-semibold">Kata Sandi</Label>
                  <div className="relative">
                    <Input
                      id="password" type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••" required autoComplete="current-password"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="border-primary/20 focus:border-primary/50 h-11 rounded-xl pr-11"
                    />
                    <button
                      type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-primary/8"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 font-semibold h-11 rounded-xl shadow-sm gap-2 press-effect"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memproses...
                    </span>
                  ) : (
                    <>Masuk Sekarang <ArrowRight className="h-4 w-4" /></>
                  )}
                </Button>

                <p className="hidden md:block text-center text-sm text-muted-foreground pt-1">
                  Belum punya akun?{' '}
                  <Link href="/auth/sign-up" className="text-primary hover:underline font-semibold">
                    Daftar Sekarang
                  </Link>
                </p>
              </form>
            </div>

            <div className="md:hidden space-y-2 animate-fade-in-up delay-200">
              {perks.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 bg-card border border-primary/10 rounded-xl px-3.5 py-2.5 shadow-sm">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">{label}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-muted-foreground animate-fade-in-up delay-300">
              <Link href="/" className="hover:text-primary hover:underline transition-colors">
                ← Kembali ke Beranda
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
