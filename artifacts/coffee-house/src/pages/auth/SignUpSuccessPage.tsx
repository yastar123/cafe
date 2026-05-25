import { Button } from '@/components/ui/button'
import { Link } from 'wouter'
import { CheckCircle, Coffee, ArrowRight } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-full translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-primary/6 to-transparent rounded-full -translate-x-1/4 translate-y-1/4" />
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
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-b border-emerald-100 px-6 py-8 text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-emerald-600" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-emerald-700" style={{ fontFamily: 'Playfair Display, serif' }}>
                Akun Berhasil Dibuat!
              </h1>
              <p className="text-sm text-emerald-600/80 mt-1.5 leading-relaxed">
                Selamat bergabung! Silakan masuk untuk mulai memesan kopi dan hidangan lezat kami.
              </p>
            </div>
          </div>

          <div className="px-6 py-5 space-y-3">
            <Link href="/auth/login" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 font-semibold h-10 rounded-xl shadow-sm gap-2">
                Masuk Sekarang
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full border-primary/20 rounded-xl font-medium">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
