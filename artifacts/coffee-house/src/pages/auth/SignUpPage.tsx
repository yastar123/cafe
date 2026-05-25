import { Link, useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { Coffee, Eye, EyeOff, AlertCircle } from 'lucide-react'

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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-primary/6 to-transparent rounded-full translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/6 to-transparent rounded-full -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative w-full max-w-sm space-y-6">
        <Link href="/" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <Coffee className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
            Coffee House
          </span>
        </Link>

        <div className="bg-card border border-primary/15 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-accent/8 px-6 py-5 border-b border-primary/10">
            <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
              Buat Akun Baru
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Daftar gratis dan mulai memesan menu lezat kami
            </p>
          </div>

          <form onSubmit={handleSignUp} className="px-6 py-5 space-y-4">
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
                className="border-primary/20 focus:border-primary/50 h-10 rounded-xl"
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
                className="border-primary/20 focus:border-primary/50 h-10 rounded-xl"
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
                  className="border-primary/20 focus:border-primary/50 h-10 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
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
                  className="border-primary/20 focus:border-primary/50 h-10 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
              className="w-full bg-primary hover:bg-primary/90 font-semibold h-10 rounded-xl shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Membuat akun...
                </span>
              ) : 'Daftar Akun Baru'}
            </Button>

            <p className="text-center text-sm text-muted-foreground pt-1">
              Sudah punya akun?{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-semibold">
                Masuk di Sini
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
