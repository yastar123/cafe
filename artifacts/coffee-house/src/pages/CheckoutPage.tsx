import { useLocation, Link } from 'wouter'
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/store/cart'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft, Upload, CreditCard, ShoppingBag, Coffee,
  AlertCircle, Banknote, ChevronDown, ChevronUp, CheckCircle2,
} from 'lucide-react'
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

const steps = [
  { label: 'Keranjang', done: true },
  { label: 'Pembayaran', active: true },
  { label: 'Selesai', done: false },
]

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
  const [summaryExpanded, setSummaryExpanded] = useState(false)

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
  const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0)

  if (!user || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-primary/15 rounded-2xl shadow-md max-w-sm w-full p-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto">
            <ShoppingBag className="h-7 w-7 text-primary/30" />
          </div>
          <p className="text-muted-foreground font-medium">Keranjang belanja kosong</p>
          <p className="text-sm text-muted-foreground">Tambahkan menu terlebih dahulu sebelum checkout.</p>
          <Link href="/menu">
            <Button className="bg-primary hover:bg-primary/90 rounded-xl gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Menu
            </Button>
          </Link>
        </div>
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
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
          <Link href="/menu" className="p-1.5 rounded-lg hover:bg-primary/8 transition-colors text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Coffee className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-primary text-base" style={{ fontFamily: 'Playfair Display, serif' }}>
              Checkout
            </span>
          </div>

          {/* Progress steps — desktop */}
          <div className="hidden sm:flex items-center gap-2 ml-auto">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-1.5">
                {i > 0 && <div className="w-6 h-px bg-primary/20" />}
                <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  step.active
                    ? 'bg-primary text-primary-foreground'
                    : step.done
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-primary/8 text-muted-foreground'
                }`}>
                  {step.done && !step.active && <CheckCircle2 className="h-3 w-3" />}
                  {step.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-5 pb-10">

        {/* Mobile order summary — collapsible card at the top */}
        <div className="lg:hidden mb-4 bg-card border border-primary/12 rounded-2xl shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setSummaryExpanded(!summaryExpanded)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-primary/4 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm text-foreground">
                Ringkasan Pesanan ({itemCount} item)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary text-sm">{formatRupiah(finalTotal)}</span>
              {summaryExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </button>

          {summaryExpanded && (
            <div className="border-t border-primary/10 px-4 py-3 space-y-0 bg-primary/2">
              {cartItems.map((item, idx) => (
                <div
                  key={item.menuItemId}
                  className={`flex justify-between text-sm py-2 ${idx < cartItems.length - 1 ? 'border-b border-primary/8' : ''}`}
                >
                  <span className="text-foreground/80 truncate pr-2">
                    {item.name}
                    <span className="text-muted-foreground ml-1 text-xs">×{item.quantity}</span>
                  </span>
                  <span className="font-semibold flex-shrink-0 text-xs">{formatRupiah(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="pt-2.5 mt-1 border-t border-primary/12 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">{formatRupiah(total)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>PPN (5%)</span>
                  <span className="font-medium text-foreground">{formatRupiah(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1.5 border-t border-primary/10">
                  <span>Total</span>
                  <span className="text-primary">{formatRupiah(finalTotal)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Payment form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-primary/12 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-primary/8 to-accent/6 px-5 py-4 border-b border-primary/10">
                <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Pilih Metode Pembayaran
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">Pilih cara yang paling mudah untuk Anda</p>
              </div>

              <form onSubmit={handleSubmitOrder} className="p-5 space-y-6">
                {/* Payment method */}
                <div>
                  <Label className="text-sm font-bold mb-3 block">Metode Pembayaran</Label>
                  <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-2">
                    {paymentChannels.map((channel) => (
                      <label
                        key={channel.id}
                        htmlFor={`pay_${channel.id}`}
                        className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                          selectedMethod === channel.name
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-primary/15 hover:border-primary/35 hover:bg-primary/3'
                        }`}
                      >
                        <RadioGroupItem value={channel.name} id={`pay_${channel.id}`} />
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          selectedMethod === channel.name ? 'bg-primary text-primary-foreground' : 'bg-primary/10'
                        }`}>
                          <CreditCard className={`h-4 w-4 ${selectedMethod === channel.name ? 'text-primary-foreground' : 'text-primary'}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{channel.name}</p>
                          {channel.account_number && (
                            <p className="text-xs text-muted-foreground">{channel.account_number}</p>
                          )}
                        </div>
                        {selectedMethod === channel.name && (
                          <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />
                        )}
                      </label>
                    ))}
                    <label
                      htmlFor="pay_cash"
                      className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                        selectedMethod === 'Tunai'
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                          : 'border-primary/15 hover:border-emerald-200 hover:bg-emerald-50/30'
                      }`}
                    >
                      <RadioGroupItem value="Tunai" id="pay_cash" />
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        selectedMethod === 'Tunai' ? 'bg-emerald-500' : 'bg-emerald-100'
                      }`}>
                        <Banknote className={`h-4 w-4 ${selectedMethod === 'Tunai' ? 'text-white' : 'text-emerald-600'}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Bayar di Kasir (Tunai)</p>
                        <p className="text-xs text-muted-foreground">Bayar langsung saat ambil pesanan</p>
                      </div>
                      {selectedMethod === 'Tunai' && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 ml-auto" />
                      )}
                    </label>
                  </RadioGroup>
                </div>

                {/* Transfer info */}
                {!isCash && selectedChannel && (
                  <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 space-y-2.5">
                    <h4 className="font-bold text-amber-800 text-sm flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5" />
                      Rekening Tujuan Transfer
                    </h4>
                    {selectedChannel.account_number && (
                      <div>
                        <p className="text-xs text-amber-700/70">No. Rekening / Telepon:</p>
                        <p className="font-bold text-2xl text-amber-900 select-all tracking-wider mt-0.5">
                          {selectedChannel.account_number}
                        </p>
                      </div>
                    )}
                    {selectedChannel.account_name && (
                      <div>
                        <p className="text-xs text-amber-700/70">Atas Nama:</p>
                        <p className="font-semibold text-amber-900 text-sm">{selectedChannel.account_name}</p>
                      </div>
                    )}
                    {selectedChannel.instructions && (
                      <p className="text-xs text-amber-700/80 whitespace-pre-line border-t border-amber-200/60 pt-2">
                        {selectedChannel.instructions}
                      </p>
                    )}
                    <div className="bg-amber-100/80 rounded-lg px-3 py-2 text-xs text-amber-800 font-medium">
                      💡 Transfer tepat <strong>{formatRupiah(finalTotal)}</strong> agar lebih mudah diverifikasi
                    </div>
                  </div>
                )}

                {isCash && (
                  <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Banknote className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-800 mb-0.5">Bayar di Kasir</p>
                      <p className="text-xs text-emerald-700/80 leading-relaxed">
                        Lakukan pembayaran langsung kepada kasir saat mengambil pesanan. Tunjukkan ID Pesanan kepada barista kami.
                      </p>
                    </div>
                  </div>
                )}

                {/* Upload proof */}
                {!isCash && (
                  <div>
                    <Label className="text-sm font-bold mb-2 block">
                      Unggah Bukti Pembayaran <span className="text-red-500">*</span>
                    </Label>
                    <label
                      htmlFor="proof-upload"
                      className={`flex flex-col items-center gap-3 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                        paymentProof
                          ? 'border-primary/50 bg-primary/4 hover:bg-primary/6'
                          : 'border-primary/20 hover:border-primary/40 hover:bg-primary/3'
                      }`}
                    >
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                        className="hidden"
                        id="proof-upload"
                      />
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${paymentProof ? 'bg-primary/15' : 'bg-primary/8'}`}>
                        <Upload className={`h-6 w-6 ${paymentProof ? 'text-primary' : 'text-primary/40'}`} />
                      </div>
                      <div>
                        {paymentProof ? (
                          <>
                            <p className="text-sm font-semibold text-primary">{paymentProof.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Klik untuk ganti file</p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-semibold text-foreground">Klik untuk unggah bukti transfer</p>
                            <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, atau tangkapan layar (maks. 5 MB)</p>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <Label htmlFor="notes" className="text-sm font-bold block mb-2">
                    Catatan <span className="text-muted-foreground font-normal">(Opsional)</span>
                  </Label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: es batu dipisah, kurangi gula, dll."
                    className="w-full p-3 border border-primary/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 resize-none text-sm bg-background transition-colors"
                    rows={3}
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Mobile total recap before submit */}
                <div className="lg:hidden bg-primary/5 border border-primary/12 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-medium">Total Pembayaran</span>
                  <span className="text-base font-bold text-primary">{formatRupiah(finalTotal)}</span>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 h-12 font-semibold text-base rounded-xl shadow-sm gap-2 press-effect"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memproses Pesanan...
                    </span>
                  ) : (
                    <>Buat Pesanan Sekarang ✓</>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Desktop order summary */}
          <div className="hidden lg:block">
            <div className="bg-card border border-primary/12 rounded-2xl shadow-sm lg:sticky lg:top-20 overflow-hidden">
              <div className="bg-gradient-to-r from-primary/8 to-accent/6 px-4 py-3.5 border-b border-primary/10">
                <h2 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  Ringkasan Pesanan
                  <span className="ml-auto text-xs font-normal text-muted-foreground">{itemCount} item</span>
                </h2>
              </div>
              <div className="p-4 space-y-0">
                {cartItems.map((item, idx) => (
                  <div
                    key={item.menuItemId}
                    className={`flex justify-between text-sm py-2.5 ${idx < cartItems.length - 1 ? 'border-b border-primary/8' : ''}`}
                  >
                    <span className="truncate pr-2 text-foreground/80">
                      {item.name}
                      <span className="text-muted-foreground ml-1">×{item.quantity}</span>
                    </span>
                    <span className="font-semibold flex-shrink-0">{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="pt-3 mt-1 border-t border-primary/15 space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">{formatRupiah(total)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>PPN (5%)</span>
                    <span className="font-medium text-foreground">{formatRupiah(tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-primary/10">
                    <span>Total</span>
                    <span className="text-primary">{formatRupiah(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
