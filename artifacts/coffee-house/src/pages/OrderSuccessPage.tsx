import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Link, useSearch } from 'wouter'
import { CheckCircle } from 'lucide-react'

export default function OrderSuccessPage() {
  const search = useSearch()
  const params = new URLSearchParams(search)
  const orderId = params.get('orderId')

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="border-green-200 bg-white max-w-md w-full shadow-lg">
        <CardHeader className="text-center pb-3 bg-green-50 rounded-t-xl">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-green-600">Pesanan Dibuat!</CardTitle>
          <CardDescription className="text-sm mt-2 text-muted-foreground">
            Terima kasih atas pesanan Anda. Pesanan Anda telah kami terima dan akan segera diproses.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          {orderId && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-xs text-green-700 font-semibold mb-1">ID Pesanan Anda</p>
              <p className="text-sm font-mono font-bold text-green-800 select-all break-all">{orderId}</p>
            </div>
          )}

          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
            <p className="text-xs text-primary font-bold mb-2">Langkah Selanjutnya</p>
            <ul className="text-xs text-foreground space-y-1.5 list-disc list-inside">
              <li>Admin akan memverifikasi bukti pembayaran Anda</li>
              <li>Barista akan segera membuat pesanan Anda</li>
              <li>Silakan ambil pesanan saat status berubah menjadi "Siap Diambil"</li>
            </ul>
          </div>

          <div className="flex gap-3 flex-col pt-2">
            <Link href="/menu" className="w-full">
              <Button className="w-full bg-primary hover:bg-primary/90 font-medium">
                Kembali ke Menu
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
