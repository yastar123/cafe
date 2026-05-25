'use client'

import { login } from '@/app/actions/auth'
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
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await login(username, password)
      if (result.error) {
        if (result.error === 'Invalid username or password') {
          setError('Nama pengguna atau kata sandi salah')
          toast.error('Nama pengguna atau kata sandi salah')
        } else {
          setError(result.error)
          toast.error(result.error)
        }
      } else {
        // Store user info in sessionStorage
        sessionStorage.setItem('user', JSON.stringify(result.user))
        toast.success('Selamat datang kembali, ' + result.user.username + '!')
        router.push(result.user.role === 'admin' ? '/admin' : '/menu')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mencoba masuk')
      toast.error('Gagal masuk, silakan coba lagi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex flex-col gap-6">
          <Card className="border-primary/20 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardTitle className="text-3xl font-extrabold text-primary">Selamat Datang</CardTitle>
              <CardDescription>
                Masuk untuk memesan kopi & hidangan favorit Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Nama Pengguna (Username)</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="border-primary/20"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Kata Sandi (Password)</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-primary/20"
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-500 bg-red-50 p-3 rounded border border-red-100">
                      {error}
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Memproses Masuk...' : 'Masuk Sekarang'}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Belum punya akun?{' '}
                  <Link
                    href="/auth/sign-up"
                    className="text-primary hover:underline font-bold"
                  >
                    Daftar Sekarang
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
