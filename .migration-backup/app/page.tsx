'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Coffee, ShoppingCart, Zap } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const user = sessionStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      if (userData.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/menu')
      }
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-primary/10 bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Coffee House</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <Button variant="outline" className="border-primary/20">
                Masuk
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-primary hover:bg-primary/90">
                Daftar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-0">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-4 text-balance">
              Selamat Datang di Coffee House
            </h2>
            <p className="text-xl text-muted-foreground text-balance">
              Pesan kopi dan hidangan favorit Anda secara online. Cepat, segar, dan selalu lezat.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 py-8">
            <div className="bg-card p-6 rounded-lg border border-primary/10">
              <Coffee className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Kualitas Premium</h3>
              <p className="text-sm text-muted-foreground">
                Kopi khas racikan barista profesional dengan bahan premium berkualitas tinggi
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-primary/10">
              <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Layanan Cepat</h3>
              <p className="text-sm text-muted-foreground">
                Pesan online dan ambil di gerai dalam hitungan menit tanpa antre panjang
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-primary/10">
              <ShoppingCart className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Pemesanan Praktis</h3>
              <p className="text-sm text-muted-foreground">
                Sistem checkout yang mudah dengan pembayaran transfer bank dan e-wallet
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/auth/sign-up">
              <Button className="bg-primary hover:bg-primary/90 h-12 px-8 text-lg font-medium">
                Mulai Pesan Sekarang
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="border-primary/20 h-12 px-8 text-lg font-medium"
              >
                Sudah Punya Akun?
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 bg-background/50 py-6">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 Coffee House. Hak cipta dilindungi undang-undang.</p>
        </div>
      </footer>
    </div>
  )
}
