import { Link, useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import {
  Coffee, Eye, EyeOff, AlertCircle, UserPlus, ArrowRight,
  Star, Gift, ClipboardCheck, CreditCard,
} from 'lucide-react'

const perks = [
  { icon: Gift,          label: 'Daftar gratis, tanpa biaya apapun' },
  { icon: ClipboardCheck,label: 'Lacak status pesanan secara real-time' },
  { icon: CreditCard,    label: 'Pilihan metode pembayaran fleksibel' },
]

function PasswordStrength({ password }: { password: string }) {
  const { score, label, color } = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' }
    let s = 0
    if (password.length >= 6) s++
    if (password.length >= 10) s++
    if (/[A-Z]/.test(password)) s++
    if (/[0-9]/.test(password)) s++
    if (/[^A-Za-z0-9]/.test(password)) s++
    if (s <= 1) return { score: s, label: 'Sangat lemah', color: 'bg-red-400' }
    if (s === 2) return { score: s, label: 'Lemah', color: 'bg-orange-400' }
    if (s === 3) return { score: s, label: 'Cukup', color: 'bg-amber-400' }
    if (s === 4) return { score: s, label: 'Kuat', color: 'bg-lime-500' }
    return { score: s, label: 'Sangat kuat', color: 'bg-emerald-500' }
  }, [password])

  if (!password) return null

  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? color : 'bg-primary/10'
            }`}
          />
        ))}
      </div>
      <p className={`text-[11px] font-medium transition-colors ${
        score <= 1 ? 'text-red-500' :
        score === 2 ? 'text-orange-500' :
        score === 3 ? 'text-amber-600' :
        score === 4 ? 'text-lime-600' : 'text-emerald-600'
      }`}>
        Kekuatan kata sandi: {label}
      </p>
    </div>
  )
}

export default function SignUpPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [, setLocation] = useLocation()

  const passwordsMatch = confirmPassword === '' || password === confirmPassword

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok')
      return
    }
    if (password.length < 6) {
      setError('Kata sandi harus minimal 6 karakter')
      return
    }

    setIsLoading(true)
    try {
      const passwordHash = await bcrypt.hash(password, 10)
      const { error: dbError } = await supabase
        .from('users')
        .insert([{ username, email, password_hash: passwordHash, role: 'customer' }])
        .select()

      if (dbError) {
        let msg = dbError.message
        if (msg.toLowerCase().includes('unique') && msg.toLowerCase().includes('username'))
          msg = 'Nama pengguna sudah digunakan. Silakan pilih yang lain.'
        else if (msg.toLowerCase().includes('unique') && msg.toLowerCase().includes('email'))
          msg = 'Email sudah terdaftar. Silakan gunakan email lain.'
        setError(msg)
        toast.error(msg)
      } else {
        toast.success('Akun berhasil dibuat!')
        setLocation('/auth/sign-up-success')
      }
    } catch {
      setError('Terjadi kesalahan, silakan coba lagi')
      toast.error('Gagal mendaftar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div
        className="hidden lg:flex lg:w-2/5 xl:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, hsl(25 55% 20%) 0%, hsl(20 50% 14%) 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute top-10 left-10 w-2 h-2 bg-white/20 rounded-full" />
          <div className="absolute top-24 left-24 w-1.5 h-1.5 bg-white/15 rounded-full" />
          <div className="absolute top-48 left-14 w-1 h-1 bg-white/10 rounded-full" />
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
              <span className="text-white/80 text-xs font-medium">Bergabung Gratis</span>
            </div>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              Buat Akun Sekarang
            </h2>
            <p className="text-white/60 mt-2 text-sm leading-relaxed">
              Daftar gratis dan nikmati kemudahan memesan kopi premium favorit Anda.
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
      <div className="flex-1 flex flex-col items-center justify-center p-5 sm:p-8 bg-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary/5 to-transparent rounded-full translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/5 to-transparent rounded-full -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="relative w-full max-w-sm space-y-7">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <Link href="/" className="inline-flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                <Coffee className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
                Coffee House
              </span>
            </Link>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
              Buat Akun Baru
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Daftar gratis dan mulai memesan menu lezat kami
            </p>
          </div>

          <div className="bg-card border border-primary/12 rounded-2xl shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary/50" />

            <form onSubmit={handleSignUp} className="px-6 py-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-sm font-semibold">Nama Pengguna</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Buat username unik"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-primary/20 focus:border-primary/50 h-11 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@contoh.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-primary/20 focus:border-primary/50 h-11 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-semibold">Kata Sandi</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 6 karakter"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-primary/20 focus:border-primary/50 h-11 rounded-xl pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="text-sm font-semibold">Konfirmasi Kata Sandi</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Ulangi kata sandi"
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`h-11 rounded-xl pr-11 transition-colors ${
                      !passwordsMatch
                        ? 'border-red-300 focus:border-red-400 bg-red-50/50'
                        : 'border-primary/20 focus:border-primary/50'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {!passwordsMatch && (
                  <p className="text-[11px] text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Kata sandi tidak cocok
                  </p>
                )}
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
                disabled={isLoading || !passwordsMatch}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Membuat akun...
                  </span>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Daftar Akun Baru
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground pt-1">
                Sudah punya akun?{' '}
                <Link href="/auth/login" className="text-primary hover:underline font-semibold">
                  Masuk di Sini
                </Link>
              </p>
            </form>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary hover:underline transition-colors">
              ← Kembali ke Beranda
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
