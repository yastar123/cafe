import { useCart, type CartItem } from '@/lib/store/cart'
import { Button } from '@/components/ui/button'
import { useLocation } from 'wouter'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

interface CartSidebarProps {
  cartItems: CartItem[]
  onNavigate?: () => void
}

export default function CartSidebar({ cartItems, onNavigate }: CartSidebarProps) {
  const removeItem = useCart((state) => state.removeItem)
  const updateQuantity = useCart((state) => state.updateQuantity)
  const getTotal = useCart((state) => state.getTotal)
  const [, setLocation] = useLocation()

  const total = getTotal()
  const tax = total * 0.05
  const finalTotal = total + tax

  const handleCheckout = () => {
    onNavigate?.()
    setLocation('/checkout')
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-card border border-primary/12 rounded-2xl shadow-md lg:sticky lg:top-24 flex flex-col h-full lg:h-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/12 to-accent/10 px-4 py-3.5 flex-shrink-0 border-b border-primary/10">
          <h2 className="font-semibold text-foreground text-base flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-primary" />
            Keranjang Belanja
            {cartItems.length > 0 && (
              <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto">
                <ShoppingBag className="h-7 w-7 text-primary/30" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground/60">Keranjang kosong</p>
                <p className="text-xs text-muted-foreground mt-0.5">Tambah menu untuk mulai pesan</p>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {cartItems.map((item, idx) => (
                <div
                  key={item.menuItemId}
                  className={`flex items-start gap-2.5 py-3 ${idx < cartItems.length - 1 ? 'border-b border-primary/8' : ''}`}
                >
                  {/* Mini image/icon */}
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <ShoppingBag className="h-4 w-4 text-primary/40" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate leading-snug">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{formatRupiah(item.price)}/item</p>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <p className="text-xs font-semibold text-primary">{formatRupiah(item.price * item.quantity)}</p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                        className="w-6 h-6 border border-primary/20 hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Minus className="h-2.5 w-2.5 text-primary" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                        className="w-6 h-6 border border-primary/20 hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Plus className="h-2.5 w-2.5 text-primary" />
                      </button>
                      <button
                        onClick={() => removeItem(item.menuItemId)}
                        className="w-6 h-6 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg flex items-center justify-center transition-colors ml-0.5"
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Totals */}
              <div className="pt-3 mt-1 border-t border-primary/15 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">{formatRupiah(total)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>PPN (5%)</span>
                  <span className="font-medium text-foreground">{formatRupiah(tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-primary/10">
                  <span>Total</span>
                  <span className="text-primary text-base">{formatRupiah(finalTotal)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-primary/90 font-semibold mt-3 shadow-sm h-10 gap-2"
              >
                Bayar Sekarang
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
