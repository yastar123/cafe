'use client'

import { signUp } from '@/app/actions/auth'
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

export default function SignUpPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok')
      toast.error('Konfirmasi kata sandi tidak cocok')
      return
    }

    if (password.length < 6) {
      setError('Kata sandi harus minimal 6 karakter')
      toast.error('Kata sandi terlalu pendek (minimal 6 karakter)')
      return
    }

    setIsLoading(true)

    try {
      const result = await signUp(username, email, password)
      if (result.error) {
        let errorMsg = result.error
        if (result.error.toLowerCase().includes('unique') && result.error.toLowerCase().includes('username')) {
          errorMsg = 'Nama pengguna sudah digunakan. Silakan gunakan yang lain.'
        } else if (result.error.toLowerCase().includes('unique') && result.error.toLowerCase().includes('email')) {
          errorMsg = 'Alamat email sudah terdaftar. Silakan gunakan email lain atau langsung masuk.'
        }
        setError(errorMsg)
        toast.error(errorMsg)
      } else {
        toast.success('Pendaftaran akun berhasil!')
        router.push('/auth/sign-up-success')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat pendaftaran akun')
      toast.error('Gagal mendaftar, silakan coba lagi')
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
              <CardTitle className="text-3xl font-extrabold text-primary">Daftar Akun</CardTitle>
              <CardDescription>
                Daftar untuk mulai memesan menu lezat kami online
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSignUp}>
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
                    <Label htmlFor="email">Alamat Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@contoh.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-primary/20"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Kata Sandi</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Minimal 6 karakter"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-primary/20"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Konfirmasi Kata Sandi</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Ulangi kata sandi"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {isLoading ? 'Membuat akun...' : 'Daftar Akun Baru'}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Sudah punya akun?{' '}
                  <Link
                    href="/auth/login"
                    className="text-primary hover:underline font-bold"
                  >
                    Masuk di Sini
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
