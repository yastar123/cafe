import { useLocation, Link } from 'wouter'
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/store/cart'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Upload, CreditCard, ShoppingBag } from 'lucide-react'
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
  const [, setLocation] = useLocation()
  const { items: cartItems, getTotal, clearCart } = useCart()
  const [user, setUser] = useState<User | null>(null)
  const [paymentChannels, setPaymentChannels] = useState<PaymentChannel[]>([])
  const [selectedMethod, setSelectedMethod] = useState<string>('Tunai')
  const [notes, setNotes] = useState('')
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userData = sessionStorage.getItem('user')
    if (!userData) { setLocation('/auth/login'); return }
    setUser(JSON.parse(userData))
  }, [setLocation])

  useEffect(() => {
    const fetchPaymentChannels = async () => {
      try {
        const { data, error } = await supabase
          .from('payment_channels')
          .select('*')
          .eq('active', true)
          .order('created_at')
        if (!error && data) {
          setPaymentChannels(data)
          if (data.length > 0) setSelectedMethod(data[0].name)
        }
      } catch {}
    }
    fetchPaymentChannels()
  }, [])

  const total = getTotal()
  const tax = total * 0.05
  const finalTotal = total + tax

  const selectedChannel = paymentChannels.find((c) => c.name === selectedMethod)
  const isCash = selectedMethod === 'Tunai'

  if (!user || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="border-primary/20 max-w-sm w-full">
          <CardContent className="pt-10 pb-8 text-center space-y-4">
            <ShoppingBag className="h-12 w-12 mx-auto text-primary/30" />
            <p className="text-muted-foreground">Keranjang belanja kosong</p>
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
      let paymentProofUrl = null

      if (paymentProof) {
        const fileName = `${Date.now()}_${paymentProof.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(fileName, paymentProof)
        if (uploadError) throw new Error('Gagal mengunggah bukti pembayaran: ' + uploadError.message)
        paymentProofUrl = uploadData?.path
      }

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user!.id,
          total_amount: finalTotal,
          payment_method: selectedMethod,
          payment_status: 'pending',
          order_status: 'pending',
          payment_proof_url: paymentProofUrl,
          notes,
        }])
        .select()

      if (orderError) throw new Error('Gagal menyimpan pesanan: ' + orderError.message)

      const orderId = orderData[0].id
      const orderItems = cartItems.map((item) => ({
        order_id: orderId,
        menu_item_id: item.menuItemId,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
      if (itemsError) throw new Error('Gagal menyimpan detail pesanan: ' + itemsError.message)

      clearCart()
      toast.success('Pesanan berhasil dibuat!')
      setLocation(`/order-success?orderId=${orderId}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat checkout'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        <Link href="/menu" className="inline-flex items-center gap-2 text-primary hover:underline mb-6 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Menu
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <CardTitle className="text-xl md:text-2xl">Checkout Pembayaran</CardTitle>
                <CardDescription>Pilih metode pembayaran dan selesaikan pesanan Anda</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <form onSubmit={handleSubmitOrder} className="space-y-6">
                  {/* Payment method */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">Metode Pembayaran</Label>
                    <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-2">
                      {paymentChannels.map((channel) => (
                        <label
                          key={channel.id}
                          htmlFor={`pay_${channel.id}`}
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedMethod === channel.name
                              ? 'border-primary bg-primary/5'
                              : 'border-primary/15 hover:border-primary/30'
                          }`}
                        >
                          <RadioGroupItem value={channel.name} id={`pay_${channel.id}`} />
                          <CreditCard className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="font-medium text-sm">{channel.name}</span>
                        </label>
                      ))}
                      <label
                        htmlFor="pay_cash"
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedMethod === 'Tunai'
                            ? 'border-primary bg-primary/5'
                            : 'border-primary/15 hover:border-primary/30'
                        }`}
                      >
                        <RadioGroupItem value="Tunai" id="pay_cash" />
                        <span className="font-medium text-sm">Bayar di Kasir (Tunai)</span>
                      </label>
                    </RadioGroup>
                  </div>

                  {/* Transfer info */}
                  {!isCash && selectedChannel && (
                    <Card className="border-primary/15 bg-primary/5">
                      <CardContent className="pt-4 pb-4 space-y-2">
                        <h4 className="font-bold text-primary text-sm">Rekening Tujuan Transfer</h4>
                        {selectedChannel.account_number && (
                          <div>
                            <p className="text-xs text-muted-foreground">No. Rekening / Telepon:</p>
                            <p className="font-bold text-lg select-all">{selectedChannel.account_number}</p>
                          </div>
                        )}
                        {selectedChannel.account_name && (
                          <div>
                            <p className="text-xs text-muted-foreground">A/N:</p>
                            <p className="font-semibold">{selectedChannel.account_name}</p>
                          </div>
                        )}
                        {selectedChannel.instructions && (
                          <p className="text-xs text-muted-foreground whitespace-pre-line mt-1">
                            {selectedChannel.instructions}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {isCash && (
                    <Card className="border-primary/15 bg-primary/5">
                      <CardContent className="pt-4 pb-4">
                        <p className="text-sm text-muted-foreground">
                          Lakukan pembayaran langsung di kasir saat mengambil pesanan. Tunjukkan ID Pesanan kepada barista kami.
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Upload proof */}
                  {!isCash && (
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Unggah Bukti Pembayaran <span className="text-red-500">*</span></Label>
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:bg-primary/5 ${paymentProof ? 'border-primary/40 bg-primary/5' : 'border-primary/20'}`}>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                          className="hidden"
                          id="proof-upload"
                        />
                        <label htmlFor="proof-upload" className="cursor-pointer flex flex-col items-center gap-2">
                          <Upload className={`h-7 w-7 ${paymentProof ? 'text-primary' : 'text-primary/40'}`} />
                          <span className="text-sm font-medium">
                            {paymentProof ? paymentProof.name : 'Klik untuk unggah bukti transfer'}
                          </span>
                          <span className="text-xs text-muted-foreground">JPG, PNG, atau tangkapan layar</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-sm font-semibold block mb-2">
                      Catatan (Opsional)
                    </Label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Contoh: es batu dipisah, kurangi gula, dll."
                      className="w-full p-3 border border-primary/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-sm bg-background"
                      rows={3}
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 h-11 font-medium text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Memproses Pesanan...' : 'Buat Pesanan Sekarang'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card className="border-primary/10 lg:sticky lg:top-6">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-3">
                <CardTitle className="text-base">Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                {cartItems.map((item) => (
                  <div key={item.menuItemId} className="flex justify-between text-sm pb-2 border-b border-primary/10 last:border-0">
                    <span className="truncate pr-2">{item.name} <span className="text-muted-foreground">×{item.quantity}</span></span>
                    <span className="font-medium flex-shrink-0">{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="pt-2 space-y-1.5 border-t border-primary/20">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatRupiah(total)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>PPN (5%)</span>
                    <span>{formatRupiah(tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-1.5 border-t border-primary/10">
                    <span>Total</span>
                    <span className="text-primary">{formatRupiah(finalTotal)}</span>
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
