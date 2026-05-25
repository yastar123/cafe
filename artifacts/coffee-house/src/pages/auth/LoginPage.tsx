import { Link, useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { Coffee, Eye, EyeOff, AlertCircle, ArrowRight, Star, Zap, CreditCard } from 'lucide-react'

const perks = [
  { icon: Coffee,     label: '50+ pilihan menu kopi & hidangan' },
  { icon: Zap,        label: 'Siap diambil dalam 5 menit' },
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
      const { data: user, error: dbError } = await supabase
        .from('users').select('*').eq('username', username).single()
      if (dbError || !user) {
        setError('Nama pengguna atau kata sandi salah')
        toast.error('Nama pengguna atau kata sandi salah')
        return
      }
      const isValid = await bcrypt.compare(password, user.password_hash)
      if (!isValid) {
        setError('Nama pengguna atau kata sandi salah')
        toast.error('Nama pengguna atau kata sandi salah')
        return
      }
      sessionStorage.setItem('user', JSON.stringify(user))
      toast.success('Selamat datang kembali, ' + user.username + '!')
      setLocation(user.role === 'admin' ? '/admin' : '/menu')
    } catch {
      setError('Terjadi kesalahan saat mencoba masuk')
      toast.error('Gagal masuk, silakan coba lagi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — desktop only */}
      <div
        className="hidden lg:flex lg:w-2/5 xl:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, hsl(25 55% 20%) 0%, hsl(20 50% 14%) 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute top-10 left-10 w-2 h-2 bg-white/20 rounded-full" />
          <div className="absolute top-24 left-24 w-1.5 h-1.5 bg-white/15 rounded-full" />
          <div className="absolute bottom-12 right-12 w-2 h-2 bg-white/20 rounded-full" />
          <div className="absolute bottom-28 right-28 w-1.5 h-1.5 bg-white/15 rounded-full" />
        </div>
        <div className="relative z-10 text-center space-y-8 max-w-xs">
          <div className="w-20 h-20 rounded-3xl bg-white/15 flex items-center justify-center mx-auto backdrop-blur-sm border border-white/20 shadow-xl">
            <Coffee className="h-10 w-10 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-4">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className="text-white/80 text-xs font-medium">Kopi Premium</span>
            </div>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              Coffee House
            </h2>
            <p className="text-white/60 mt-2 text-sm leading-relaxed">
              Kopi premium, barista profesional, siap dalam hitungan menit.
            </p>
          </div>
          <div className="space-y-3 text-left">
            {perks.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-white/70 text-sm bg-white/5 rounded-xl px-4 py-2.5 border border-white/10">
                <Icon className="h-4 w-4 text-white/50 flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
        {/* Subtle background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/5 to-transparent rounded-full -translate-x-1/4 translate-y-1/4" />
        </div>

        {/* Mobile: compact top brand bar */}
        <div className="lg:hidden flex items-center gap-3 px-5 pt-8 pb-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Coffee className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              Coffee House
            </span>
          </Link>
          <span className="ml-auto text-xs text-muted-foreground">
            Belum punya akun?{' '}
            <Link href="/auth/sign-up" className="text-primary font-semibold hover:underline">Daftar</Link>
          </span>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 pb-8 relative">
          <div className="w-full max-w-sm mx-auto space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                Selamat Datang
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Masuk untuk memesan kopi & hidangan favorit Anda
              </p>
            </div>

            {/* Form card */}
            <div className="bg-card border border-primary/12 rounded-2xl shadow-lg overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary/50" />
              <form onSubmit={handleLogin} className="px-5 py-5 space-y-4">
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
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

                {/* Desktop only: register link inside card */}
                <p className="hidden lg:block text-center text-sm text-muted-foreground pt-1">
                  Belum punya akun?{' '}
                  <Link href="/auth/sign-up" className="text-primary hover:underline font-semibold">
                    Daftar Sekarang
                  </Link>
                </p>
              </form>
            </div>

            {/* Mobile perks strip — compact horizontal */}
            <div className="lg:hidden grid grid-cols-3 gap-2">
              {perks.map(({ icon: Icon, label }) => (
                <div key={label} className="bg-card border border-primary/10 rounded-xl p-2.5 text-center">
                  <Icon className="h-4 w-4 text-primary/60 mx-auto mb-1" />
                  <p className="text-[10px] text-muted-foreground leading-tight">{label}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-muted-foreground">
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
