import { Link, useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { Coffee } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
        <Coffee className="h-7 w-7 text-primary" />
        <span className="text-2xl font-bold text-primary">Coffee House</span>
      </Link>

      <div className="w-full max-w-sm">
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-xl">
            <CardTitle className="text-2xl font-bold text-primary">Selamat Datang</CardTitle>
            <CardDescription>
              Masuk untuk memesan kopi &amp; hidangan favorit Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username">Nama Pengguna</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-primary/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Kata Sandi</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-primary/20"
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Masuk Sekarang'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Belum punya akun?{' '}
                <Link href="/auth/sign-up" className="text-primary hover:underline font-semibold">
                  Daftar Sekarang
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
