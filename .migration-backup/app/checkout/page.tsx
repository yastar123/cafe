'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/store/cart'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Upload, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'

interface User {
  id: string
  username: string
  email: string
}

interface PaymentChannel {
  id: string
  name: string
  account_number?: string
  account_name?: string
  instructions?: string
  active: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items: cartItems, getTotal, clearCart } = useCart()
  const [user, setUser] = useState<User | null>(null)
  const [paymentChannels, setPaymentChannels] = useState<PaymentChannel[]>([])
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userData = sessionStorage.getItem('user')
    if (!userData) {
      router.push('/auth/login')
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  useEffect(() => {
    const fetchPaymentChannels = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('payment_channels')
        .select('*')
        .eq('active', true)
        .order('created_at')

      if (!error && data) {
        setPaymentChannels(data)
        if (data.length > 0) {
          setSelectedMethod(data[0].name)
        } else {
          setSelectedMethod('Tunai')
        }
      }
    }
    fetchPaymentChannels()
  }, [])

  if (!user || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="border-primary/20">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Keranjang belanja Anda kosong</p>
            <Link href="/menu">
              <Button className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Menu
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const total = getTotal()
  const tax = total * 0.05
  const finalTotal = total + tax

  const selectedChannel = paymentChannels.find((c) => c.name === selectedMethod)
  const isCash = selectedMethod === 'Tunai'

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isCash && !paymentProof) {
      setError('Bukti pembayaran wajib diunggah untuk metode transfer/e-wallet')
      toast.error('Bukti pembayaran wajib diunggah')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      let paymentProofUrl = null

      // Upload payment proof if provided
      if (paymentProof) {
        const fileName = `${Date.now()}_${paymentProof.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(fileName, paymentProof)

        if (uploadError) {
          console.error('Storage Upload Error:', uploadError)
          throw new Error('Gagal mengunggah bukti pembayaran: ' + uploadError.message)
        }
        paymentProofUrl = uploadData?.path
      }

      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total_amount: finalTotal, // Store finalTotal containing tax
            payment_method: selectedMethod,
            payment_status: 'pending',
            order_status: 'pending',
            payment_proof_url: paymentProofUrl,
            notes,
          },
        ])
        .select()

      if (orderError) {
        console.error('Order Insert Error:', orderError)
        throw new Error('Gagal menyimpan pesanan: ' + orderError.message)
      }

      const orderId = orderData[0].id

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: orderId,
        menu_item_id: item.menuItemId,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Order Items Insert Error:', itemsError)
        throw new Error('Gagal menyimpan detail pesanan: ' + itemsError.message)
      }

      // Clear cart and redirect
      clearCart()
      toast.success('Pesanan berhasil dibuat!')
      router.push(`/order-success?orderId=${orderId}`)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Terjadi kesalahan saat checkout'
      )
      toast.error(err instanceof Error ? err.message : 'Gagal memproses checkout')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/menu" className="mb-6 flex items-center gap-2 text-primary hover:underline w-fit">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Menu
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <Card className="border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <CardTitle className="text-2xl">Checkout Pembayaran</CardTitle>
                <CardDescription>
                  Selesaikan pesanan Anda dan pilih metode pembayaran di bawah ini
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmitOrder} className="space-y-6">
                  {/* Payment Method */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block text-foreground">
                      Pilih Metode Pembayaran
                    </Label>
                    <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                      {paymentChannels.map((channel) => (
                        <div
                          key={channel.id}
                          className="flex items-center space-x-3 p-3 border border-primary/10 rounded-lg hover:bg-primary/5 cursor-pointer mt-2"
                        >
                          <RadioGroupItem
                            value={channel.name}
                            id={channel.id}
                          />
                          <Label
                            htmlFor={channel.id}
                            className="flex-1 cursor-pointer font-medium flex items-center gap-2"
                          >
                            <CreditCard className="h-4 w-4 text-primary" />
                            {channel.name}
                          </Label>
                        </div>
                      ))}

                      <div className="flex items-center space-x-3 p-3 border border-primary/10 rounded-lg hover:bg-primary/5 cursor-pointer mt-2">
                        <RadioGroupItem value="Tunai" id="payment_cash" />
                        <Label
                          htmlFor="payment_cash"
                          className="flex-1 cursor-pointer font-medium"
                        >
                          Bayar di Kasir (Tunai / Cash)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Payment Detail Instructions */}
                  {!isCash && selectedChannel && (
                    <Card className="border-primary/10 bg-primary/5">
                      <CardContent className="pt-4 space-y-3">
                        <h4 className="font-bold text-primary">Informasi Rekening Tujuan</h4>
                        {selectedChannel.account_number && (
                          <div>
                            <span className="text-xs text-muted-foreground block">Nomor Rekening / Telepon:</span>
                            <span className="font-bold text-lg select-all">{selectedChannel.account_number}</span>
                          </div>
                        )}
                        {selectedChannel.account_name && (
                          <div>
                            <span className="text-xs text-muted-foreground block">Atas Nama (A/N):</span>
                            <span className="font-semibold">{selectedChannel.account_name}</span>
                          </div>
                        )}
                        {selectedChannel.instructions && (
                          <div>
                            <span className="text-xs text-muted-foreground block">Instruksi Pembayaran:</span>
                            <p className="text-xs text-muted-foreground whitespace-pre-line mt-1">
                              {selectedChannel.instructions}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {isCash && (
                    <Card className="border-primary/10 bg-primary/5">
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">
                          Silakan lakukan pembayaran langsung di kasir Coffee House saat Anda mengambil pesanan. Tunjukkan ID Pesanan Anda kepada barista kami.
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Payment Proof Upload */}
                  {!isCash && (
                    <div>
                      <Label className="text-base font-semibold mb-3 block text-foreground">
                        Unggah Bukti Pembayaran
                      </Label>
                      <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:bg-primary/5 transition-colors">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setPaymentProof(e.target.files?.[0] || null)
                          }
                          className="hidden"
                          id="proof-upload"
                        />
                        <label
                          htmlFor="proof-upload"
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          <Upload className="h-8 w-8 text-primary/60" />
                          <span className="text-sm font-medium text-foreground">
                            {paymentProof
                              ? paymentProof.name
                              : 'Klik untuk mengunggah gambar bukti transfer'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            (Format gambar: JPG, PNG, atau tangkapan layar)
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-base font-semibold block mb-2 text-foreground">
                      Catatan Tambahan (Opsional)
                    </Label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Contoh: Es batu dipisah, kurangi gula, dll."
                      className="w-full p-3 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-sm"
                      rows={3}
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 bg-red-50 p-3 rounded">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 h-10 font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Memproses Pesanan...' : 'Buat Pesanan Sekarang'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border-primary/10 sticky top-24">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-3">
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="flex justify-between text-sm border-b border-primary/10 pb-2"
                  >
                    <span className="text-foreground">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </div>
                ))}

                <div className="pt-3 space-y-2 border-t border-primary/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatRupiah(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pajak PPN (5%)</span>
                    <span>{formatRupiah(tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-primary/10">
                    <span>Total Pembayaran</span>
                    <span className="text-primary">
                      {formatRupiah(finalTotal)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
