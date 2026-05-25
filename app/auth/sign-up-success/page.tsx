'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6 animate-fade-in">
          <Card className="border-green-205 bg-green-50 shadow-lg">
            <CardHeader className="text-center">
              <div className="mb-4 text-5xl text-green-600 font-bold">✓</div>
              <CardTitle className="text-2xl text-green-800 font-extrabold">
                Akun Berhasil Dibuat!
              </CardTitle>
              <CardDescription className="text-green-700">
                Akun Anda telah berhasil terdaftar. Silakan masuk terlebih dahulu untuk mulai memesan kopi dan makanan lezat kami.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/auth/login">
                <Button className="w-full bg-primary hover:bg-primary/90 font-medium">
                  Masuk Sekarang
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
