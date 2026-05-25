import { useCart, type CartItem } from '@/lib/store/cart'
import { Button } from '@/components/ui/button'
import { useLocation } from 'wouter'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Coffee } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

interface CartSidebarProps {
  cartItems: CartItem[]
  onNavigate?: () => void
  inSheet?: boolean
}

export default function CartSidebar({ cartItems, onNavigate, inSheet }: CartSidebarProps) {
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

  const wrapperCls = inSheet
    ? 'flex flex-col h-full'
    : 'bg-card border border-primary/12 rounded-2xl shadow-md lg:sticky lg:top-24 flex flex-col overflow-hidden'

  return (
    <div className={wrapperCls}>
      {/* Header — only shown outside sheet (sheet has its own SheetHeader) */}
      {!inSheet && (
        <div className="bg-gradient-to-r from-primary/10 to-accent/8 px-4 py-3.5 flex-shrink-0 border-b border-primary/10">
          <h2 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-primary" />
            Keranjang Belanja
            {cartItems.length > 0 && (
              <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </h2>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center flex-1">
          <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mb-3">
            <ShoppingBag className="h-7 w-7 text-primary/30" />
          </div>
          <p className="text-sm font-semibold text-foreground/60">Keranjang kosong</p>
          <p className="text-xs text-muted-foreground mt-1">Tambah menu favoritmu untuk mulai pesan</p>
        </div>
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Item list */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0 scrollbar-none">
            {cartItems.map((item, idx) => (
              <div
                key={item.menuItemId}
                className={`flex items-start gap-3 py-3 ${idx < cartItems.length - 1 ? 'border-b border-primary/8' : ''}`}
              >
                {/* Thumbnail */}
                <div className="w-11 h-11 rounded-xl flex-shrink-0 overflow-hidden mt-0.5">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                      <Coffee className="h-4 w-4 text-amber-600" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate leading-snug">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatRupiah(item.price)}/item</p>
                  {/* Controls row */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                      className="w-7 h-7 border border-primary/20 hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors press-effect"
                    >
                      <Minus className="h-3 w-3 text-primary" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                      className="w-7 h-7 border border-primary/20 hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors press-effect"
                    >
                      <Plus className="h-3 w-3 text-primary" />
                    </button>
                    <button
                      onClick={() => removeItem(item.menuItemId)}
                      className="w-7 h-7 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg flex items-center justify-center transition-colors ml-0.5 press-effect"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <p className="text-sm font-bold text-primary flex-shrink-0 mt-0.5">
                  {formatRupiah(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals + CTA */}
          <div className="px-4 pb-4 pt-3 border-t border-primary/10 space-y-2 flex-shrink-0 bg-card">
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

            <Button
              onClick={handleCheckout}
              className="w-full bg-primary hover:bg-primary/90 font-semibold mt-1 shadow-sm h-11 gap-2 rounded-xl press-effect"
            >
              Bayar Sekarang
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
