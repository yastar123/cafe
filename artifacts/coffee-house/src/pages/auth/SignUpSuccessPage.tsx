import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Link } from 'wouter'
import { CheckCircle, Coffee } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
        <Coffee className="h-7 w-7 text-primary" />
        <span className="text-2xl font-bold text-primary">Coffee House</span>
      </Link>

      <div className="w-full max-w-sm">
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="text-center bg-green-50 rounded-t-xl pb-4">
            <div className="flex justify-center mb-3">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">
              Akun Berhasil Dibuat!
            </CardTitle>
            <CardDescription className="text-green-700/70">
              Akun Anda telah berhasil terdaftar. Silakan masuk untuk mulai memesan kopi dan hidangan lezat kami.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-3">
            <Link href="/auth/login" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 font-medium">
                Masuk Sekarang
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full border-primary/20">
                Kembali ke Beranda
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
