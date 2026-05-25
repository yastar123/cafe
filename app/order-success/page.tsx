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
import { useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Suspense } from 'react'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <Card className="border-green-205 bg-white max-w-md w-full shadow-lg">
      <CardHeader className="text-center pb-3">
        <div className="mb-4 flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-600 animate-bounce" />
        </div>
        <CardTitle className="text-3xl font-extrabold text-green-600">Pesanan Dibuat!</CardTitle>
        <CardDescription className="text-sm mt-2 text-muted-foreground">
          Terima kasih atas pesanan Anda. Pesanan Anda telah kami terima dan akan segera diproses.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {orderId && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 font-semibold mb-1">ID Pesanan Anda</p>
            <p className="text-sm font-mono font-bold text-green-955 select-all">
              {orderId}
            </p>
          </div>
        )}

        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
          <p className="text-xs text-primary font-bold mb-2">
            Langkah Selanjutnya
          </p>
          <ul className="text-xs text-foreground space-y-1.5 list-disc list-inside">
            <li>Admin akan memverifikasi bukti pembayaran Anda</li>
            <li>Barista akan segera membuat pesanan Anda</li>
            <li>Silakan ambil pesanan Anda saat statusnya berubah menjadi "Siap Diambil"</li>
          </ul>
        </div>

        <div className="flex gap-3 flex-col pt-4">
          <Link href="/menu" className="w-full">
            <Button className="w-full bg-primary hover:bg-primary/90 font-medium">
              Kembali Belanja
            </Button>
          </Link>
          <Link href="/menu" className="w-full">
            <Button variant="outline" className="w-full font-medium">
              Lihat Pesanan Saya
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Suspense fallback={
        <Card className="max-w-md w-full p-8 text-center border-primary/10">
          <p className="text-muted-foreground text-sm">Memuat informasi pesanan...</p>
        </Card>
      }>
        <OrderSuccessContent />
      </Suspense>
    </div>
  )
}
