import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'

interface OrderItem {
  id: string
  quantity: number
  unit_price: number
  menu_items?: { name: string }
}

interface Order {
  id: string
  total_amount: number
  payment_method: string
  payment_status: string
  order_status: string
  payment_proof_url?: string
  notes?: string
  created_at: string
  users?: { username: string; email: string }
}

interface OrderModalProps {
  order: Order
  isOpen: boolean
  onClose: () => void
  onUpdate: (orderId: string, updates: Partial<Order>) => void
  isAdminView?: boolean
}

export default function OrderModal({
  order,
  isOpen,
  onClose,
  onUpdate,
  isAdminView = true,
}: OrderModalProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status)
  const [orderStatus, setOrderStatus] = useState(order.order_status)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isOpen) return
    setPaymentStatus(order.payment_status)
    setOrderStatus(order.order_status)

    const fetchOrderItems = async () => {
      const { data, error } = await supabase
        .from('order_items')
        .select('*, menu_items(name)')
        .eq('order_id', order.id)

      if (!error && data) {
        setOrderItems(data as OrderItem[])
      } else {
        toast.error('Gagal memuat detail menu pesanan')
      }
      setIsLoading(false)
    }

    fetchOrderItems()
  }, [isOpen, order.id, order.payment_status, order.order_status])

  const handleUpdate = async () => {
    const updates: Partial<Order> = {}
    if (paymentStatus !== order.payment_status) updates.payment_status = paymentStatus
    if (orderStatus !== order.order_status) updates.order_status = orderStatus

    if (Object.keys(updates).length > 0) {
      onUpdate(order.id, updates)
      toast.success('Status pesanan berhasil diperbarui')
    }
  }

  const getProofUrl = (path?: string) => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    return supabase.storage.from('payment-proofs').getPublicUrl(path).data.publicUrl
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu Konfirmasi'
      case 'confirmed': return 'Diterima'
      case 'rejected': return 'Ditolak'
      default: return status
    }
  }

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Antrean'
      case 'preparing': return 'Sedang Dibuat'
      case 'ready': return 'Siap Diambil'
      case 'completed': return 'Selesai'
      case 'cancelled': return 'Dibatalkan'
      default: return status
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Pesanan</DialogTitle>
          <DialogDescription>
            ID Pesanan: {order.id.slice(0, 8).toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="border-primary/10">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Pelanggan</p>
                  <p className="font-semibold">{order.users?.username || 'Pelanggan Cafe'}</p>
                  <p className="text-sm text-muted-foreground">{order.users?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Waktu Pemesanan</p>
                  <p className="font-semibold">
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Pukul {new Date(order.created_at).toLocaleTimeString('id-ID')} WIB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <p className="text-center text-muted-foreground">Memuat detail item pesanan...</p>
          ) : (
            <Card className="border-primary/10">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Daftar Item</h3>
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm border-b border-primary/10 pb-2 last:border-0"
                    >
                      <span>{item.menu_items?.name} x {item.quantity}</span>
                      <span className="font-medium">{formatRupiah(item.unit_price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-lg font-bold pt-4 border-t border-primary/20">
                  <span>Total Pembayaran (PPN 5% Inc.)</span>
                  <span className="text-primary">{formatRupiah(order.total_amount)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-primary/10">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Informasi Pembayaran</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Metode Pembayaran</p>
                  <p className="font-semibold">{order.payment_method}</p>
                </div>

                {order.payment_proof_url && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-2">Bukti Transfer Pembayaran</p>
                    <div className="flex flex-col gap-2">
                      <a
                        href={getProofUrl(order.payment_proof_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium w-fit bg-primary/5 px-3 py-2 rounded border border-primary/10"
                      >
                        <ImageIcon className="h-4 w-4" />
                        Buka Bukti Gambar
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <div className="mt-2 border border-primary/10 rounded-lg overflow-hidden max-w-sm">
                        <img
                          src={getProofUrl(order.payment_proof_url)}
                          alt="Bukti Transfer"
                          className="w-full object-contain max-h-60"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-2 block">
                    Status Pembayaran
                  </label>
                  {isAdminView ? (
                    <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                      <SelectTrigger className="border-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Menunggu Konfirmasi</SelectItem>
                        <SelectItem value="confirmed">Pembayaran Diterima</SelectItem>
                        <SelectItem value="rejected">Pembayaran Ditolak</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-semibold capitalize text-sm">{getPaymentStatusText(order.payment_status)}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-2 block">
                    Status Pembuatan Pesanan
                  </label>
                  {isAdminView ? (
                    <Select value={orderStatus} onValueChange={setOrderStatus}>
                      <SelectTrigger className="border-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Antrean (Pending)</SelectItem>
                        <SelectItem value="preparing">Sedang Dibuat (Preparing)</SelectItem>
                        <SelectItem value="ready">Siap Diambil (Ready)</SelectItem>
                        <SelectItem value="completed">Selesai (Completed)</SelectItem>
                        <SelectItem value="cancelled">Dibatalkan (Cancelled)</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-semibold capitalize text-sm">{getOrderStatusText(order.order_status)}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card className="border-primary/10 bg-amber-50/50">
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">Catatan Pembeli</p>
                    <p className="text-sm text-foreground">{order.notes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3 pt-4">
            {isAdminView && (
              <Button onClick={handleUpdate} className="flex-1 bg-primary hover:bg-primary/90">
                Simpan Perubahan
              </Button>
            )}
            <Button onClick={onClose} variant="outline" className="flex-1">
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
