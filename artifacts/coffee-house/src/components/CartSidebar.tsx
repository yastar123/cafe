import { useCart, type CartItem } from '@/lib/store/cart'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link, useLocation } from 'wouter'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
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
      {/* Desktop card wrapper (only applied on desktop) */}
      <Card className="border-primary/10 lg:sticky lg:top-24 flex flex-col h-full lg:h-auto">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-3 flex-shrink-0">
          <CardTitle className="text-base">
            Keranjang Belanja ({cartItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <ShoppingBag className="h-10 w-10 text-primary/30 mx-auto" />
              <p className="text-sm text-muted-foreground">Keranjang belanja kosong</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.menuItemId}
                  className="flex items-center justify-between border-b border-primary/10 pb-3 last:border-0"
                >
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="font-medium text-sm text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{formatRupiah(item.price)}/item</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                      className="p-1 hover:bg-primary/10 rounded transition-colors"
                    >
                      <Minus className="h-3 w-3 text-primary" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                      className="p-1 hover:bg-primary/10 rounded transition-colors"
                    >
                      <Plus className="h-3 w-3 text-primary" />
                    </button>
                    <button
                      onClick={() => removeItem(item.menuItemId)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors ml-1"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-3 space-y-1.5 border-t border-primary/20">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatRupiah(total)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">PPN (5%)</span>
                  <span className="font-medium">{formatRupiah(tax)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-1.5 border-t border-primary/10">
                  <span>Total</span>
                  <span className="text-primary">{formatRupiah(finalTotal)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-primary/90 font-medium mt-2"
              >
                Bayar Sekarang
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
