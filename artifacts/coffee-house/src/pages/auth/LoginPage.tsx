import { Link, useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { Coffee, Eye, EyeOff, AlertCircle } from 'lucide-react'

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
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

      if (dbError || !user) {
        setError('Nama pengguna atau kata sandi salah')
        toast.error('Nama pengguna atau kata sandi salah')
        return
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash)
      if (!isPasswordValid) {
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-primary/6 to-transparent rounded-full translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/6 to-transparent rounded-full -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative w-full max-w-sm space-y-6">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <Coffee className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
            Coffee House
          </span>
        </Link>

        {/* Card */}
        <div className="bg-card border border-primary/15 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-accent/8 px-6 py-5 border-b border-primary/10">
            <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
              Selamat Datang Kembali
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Masuk untuk memesan kopi & hidangan favorit Anda
            </p>
          </div>

          <form onSubmit={handleLogin} className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm font-semibold">Nama Pengguna</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-primary/20 focus:border-primary/50 h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-semibold">Kata Sandi</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
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
                  Memproses...
                </span>
              ) : 'Masuk Sekarang'}
            </Button>

            <p className="text-center text-sm text-muted-foreground pt-1">
              Belum punya akun?{' '}
              <Link href="/auth/sign-up" className="text-primary hover:underline font-semibold">
                Daftar Sekarang
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
