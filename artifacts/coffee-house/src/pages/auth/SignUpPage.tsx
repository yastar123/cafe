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

export default function SignUpPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
      <Link href="/" className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
        <Coffee className="h-7 w-7 text-primary" />
        <span className="text-2xl font-bold text-primary">Coffee House</span>
      </Link>

      <div className="w-full max-w-sm">
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-xl">
            <CardTitle className="text-2xl font-bold text-primary">Daftar Akun</CardTitle>
            <CardDescription>
              Buat akun untuk mulai memesan menu lezat kami
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username">Nama Pengguna</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Buat username unik"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-primary/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@contoh.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-primary/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Kata Sandi</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-primary/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Konfirmasi Kata Sandi</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Ulangi kata sandi"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? 'Membuat akun...' : 'Daftar Akun Baru'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Sudah punya akun?{' '}
                <Link href="/auth/login" className="text-primary hover:underline font-semibold">
                  Masuk di Sini
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
