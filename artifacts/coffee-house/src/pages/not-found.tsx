import { Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { Coffee, Home, UtensilsCrossed } from 'lucide-react'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, hsl(35 90% 95%) 0%, hsl(30 60% 96%) 45%, hsl(25 35% 97%) 100%)' }}
    >
      {/* Header */}
      <header className="border-b border-primary/10 bg-white/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Coffee className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              Coffee House
            </span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-sm space-y-7">
          {/* Giant 404 with icon overlay */}
          <div className="relative inline-block">
            <p
              className="text-[108px] sm:text-[128px] font-bold leading-none select-none"
              style={{
                fontFamily: 'Playfair Display, serif',
                color: 'hsl(25 50% 28% / 0.08)',
              }}
            >
              404
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-20 h-20 rounded-3xl shadow-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(25 55% 20%) 0%, hsl(20 50% 14%) 100%)' }}
              >
                <Coffee className="h-10 w-10 text-white/80" />
              </div>
            </div>
          </div>

          {/* Decorative dots */}
          <div className="flex justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary/20" />
            <span className="w-2 h-2 rounded-full bg-primary/40" />
            <span className="w-2 h-2 rounded-full bg-primary/20" />
          </div>

          <div className="space-y-2 px-2">
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ups! Halaman yang kamu cari tidak tersedia. Mungkin sudah dipindah atau URL-nya salah ketik.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 gap-2 rounded-xl h-11 px-6 w-full sm:w-auto shadow-lg shadow-primary/20 press-effect font-semibold">
                <Home className="h-4 w-4" />
                Kembali ke Beranda
              </Button>
            </Link>
            <Link href="/menu">
              <Button
                variant="outline"
                className="border-primary/25 bg-white/60 text-primary hover:bg-white/80 gap-2 rounded-xl h-11 px-6 w-full sm:w-auto"
              >
                <UtensilsCrossed className="h-4 w-4" />
                Lihat Menu
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground/60">
            Kode kesalahan: <span className="font-mono">404 Not Found</span>
          </p>
        </div>
      </main>

      {/* Subtle footer */}
      <footer className="py-4 text-center">
        <p className="text-xs text-muted-foreground/50">
          © 2026 Coffee House
        </p>
      </footer>
    </div>
  )
}
