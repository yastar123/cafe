import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'

interface OrderItem {
  id: string
  quantity: number
  unitPrice?: number | string
  unit_price?: number | string
  subtotal?: number | string
  menuItemName?: string
  menu_items?: { name: string }
}

interface Order {
  id: string
  totalAmount?: number | string
  total_amount?: number | string
  paymentMethod?: string
  payment_method?: string
  paymentStatus?: string
  payment_status?: string
  orderStatus?: string
  order_status?: string
  paymentProofUrl?: string
  payment_proof_url?: string
  notes?: string
  createdAt?: string
  created_at?: string
  users?: { username: string; email: string }
  username?: string
  email?: string
}

interface OrderModalProps {
  order: Order
  isOpen: boolean
  onClose: () => void
  onUpdate: (orderId: string, updates: Partial<Order>) => void
  isAdminView?: boolean
}

function getField(o: Order, snake: keyof Order, camel: keyof Order): any {
  return o[snake] ?? o[camel]
}

function getItemName(item: OrderItem): string {
  return item.menuItemName ?? item.menu_items?.name ?? 'Item'
}

function getItemPrice(item: OrderItem): number {
  return Number(item.unitPrice ?? item.unit_price ?? 0)
}

const paymentStatusText: Record<string, string> = {
  pending: 'Menunggu Konfirmasi', confirmed: 'Diterima', rejected: 'Ditolak',
}
const orderStatusText: Record<string, string> = {
  pending: 'Antrean', preparing: 'Sedang Dibuat', ready: 'Siap Diambil',
  completed: 'Selesai', cancelled: 'Dibatalkan',
}

export default function OrderModal({
  order, isOpen, onClose, onUpdate, isAdminView = true,
}: OrderModalProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [paymentStatus, setPaymentStatus] = useState(String(getField(order, 'payment_status', 'paymentStatus') ?? ''))
  const [orderStatus, setOrderStatus] = useState(String(getField(order, 'order_status', 'orderStatus') ?? ''))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isOpen) return
    setPaymentStatus(String(getField(order, 'payment_status', 'paymentStatus') ?? ''))
    setOrderStatus(String(getField(order, 'order_status', 'orderStatus') ?? ''))

    const fetchOrderItems = async () => {
      try {
        const data = await api.orders.getOrderItems(order.id)
        setOrderItems(data as OrderItem[])
      } catch {
        toast.error('Gagal memuat detail menu pesanan')
      }
      setIsLoading(false)
    }
    fetchOrderItems()
  }, [isOpen, order.id])

  const handleUpdate = () => {
    const curPayment = String(getField(order, 'payment_status', 'paymentStatus') ?? '')
    const curOrder = String(getField(order, 'order_status', 'orderStatus') ?? '')
    const updates: Partial<Order> = {}
    if (paymentStatus !== curPayment) {
      updates.payment_status = paymentStatus
      updates.paymentStatus = paymentStatus
    }
    if (orderStatus !== curOrder) {
      updates.order_status = orderStatus
      updates.orderStatus = orderStatus
    }
    if (Object.keys(updates).length > 0) {
      onUpdate(order.id, updates)
    } else {
      toast.info('Tidak ada perubahan status')
    }
  }

  const proofUrl = String(getField(order, 'payment_proof_url', 'paymentProofUrl') ?? '')
  const totalAmount = getField(order, 'total_amount', 'totalAmount')
  const paymentMethod = getField(order, 'payment_method', 'paymentMethod')
  const createdAt = getField(order, 'created_at', 'createdAt')
  const username = order.users?.username ?? order.username ?? 'Pelanggan Cafe'
  const email = order.users?.email ?? order.email ?? ''

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Pesanan</DialogTitle>
          <DialogDescription>ID Pesanan: {order.id.slice(0, 8).toUpperCase()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="border-primary/10">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Pelanggan</p>
                  <p className="font-semibold">{username}</p>
                  <p className="text-sm text-muted-foreground">{email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Waktu Pemesanan</p>
                  {createdAt && (
                    <>
                      <p className="font-semibold">
                        {new Date(String(createdAt)).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Pukul {new Date(String(createdAt)).toLocaleTimeString('id-ID')} WIB
                      </p>
                    </>
                  )}
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
                    <div key={item.id} className="flex justify-between text-sm border-b border-primary/10 pb-2 last:border-0">
                      <span>{getItemName(item)} x {item.quantity}</span>
                      <span className="font-medium">{formatRupiah(getItemPrice(item) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-lg font-bold pt-4 border-t border-primary/20">
                  <span>Total Pembayaran (PPN 5% Inc.)</span>
                  <span className="text-primary">{formatRupiah(Number(totalAmount))}</span>
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
                  <p className="font-semibold">{String(paymentMethod ?? '')}</p>
                </div>

                {proofUrl && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-2">Bukti Transfer Pembayaran</p>
                    <div className="flex flex-col gap-2">
                      <a href={proofUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium w-fit bg-primary/5 px-3 py-2 rounded border border-primary/10">
                        <ImageIcon className="h-4 w-4" />Buka Bukti Gambar<ExternalLink className="h-3 w-3" />
                      </a>
                      <div className="mt-2 border border-primary/10 rounded-lg overflow-hidden max-w-sm">
                        <img src={proofUrl} alt="Bukti Transfer" className="w-full object-contain max-h-60"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-2 block">Status Pembayaran</label>
                  {isAdminView ? (
                    <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                      <SelectTrigger className="border-primary/20"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Menunggu Konfirmasi</SelectItem>
                        <SelectItem value="confirmed">Pembayaran Diterima</SelectItem>
                        <SelectItem value="rejected">Pembayaran Ditolak</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-semibold capitalize text-sm">{paymentStatusText[paymentStatus] ?? paymentStatus}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-2 block">Status Pembuatan Pesanan</label>
                  {isAdminView ? (
                    <Select value={orderStatus} onValueChange={setOrderStatus}>
                      <SelectTrigger className="border-primary/20"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Antrean (Pending)</SelectItem>
                        <SelectItem value="preparing">Sedang Dibuat (Preparing)</SelectItem>
                        <SelectItem value="ready">Siap Diambil (Ready)</SelectItem>
                        <SelectItem value="completed">Selesai (Completed)</SelectItem>
                        <SelectItem value="cancelled">Dibatalkan (Cancelled)</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-semibold capitalize text-sm">{orderStatusText[orderStatus] ?? orderStatus}</p>
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
              <Button onClick={handleUpdate} className="flex-1 bg-primary hover:bg-primary/90">Simpan Perubahan</Button>
            )}
            <Button onClick={onClose} variant="outline" className="flex-1">Tutup</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
