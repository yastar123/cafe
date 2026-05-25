'use client'

import { useCart, type CartItem } from '@/lib/store/cart'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Trash2, Minus, Plus } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

interface CartSidebarProps {
  cartItems: CartItem[]
}

export default function CartSidebar({ cartItems }: CartSidebarProps) {
  const removeItem = useCart((state) => state.removeItem)
  const updateQuantity = useCart((state) => state.updateQuantity)
  const getTotal = useCart((state) => state.getTotal)

  const total = getTotal()

  return (
    <div className="lg:w-80 flex-shrink-0">
      <Card className="sticky top-24 border-primary/10">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-3">
          <CardTitle className="text-lg">
            Keranjang Belanja ({cartItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {cartItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Keranjang belanja kosong
            </p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.menuItemId}
                  className="flex items-center justify-between border-b border-primary/10 pb-4 last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRupiah(item.price)} / item
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.menuItemId, item.quantity - 1)
                      }
                      className="p-1 hover:bg-primary/10 rounded transition-colors"
                    >
                      <Minus className="h-3 w-3 text-primary" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.menuItemId, item.quantity + 1)
                      }
                      className="p-1 hover:bg-primary/10 rounded transition-colors"
                    >
                      <Plus className="h-3 w-3 text-primary" />
                    </button>
                    <button
                      onClick={() => removeItem(item.menuItemId)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors ml-2"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Summary */}
              <div className="pt-4 space-y-2 border-t border-primary/20">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatRupiah(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">PPN (5%)</span>
                  <span className="font-medium">
                    {formatRupiah(total * 0.05)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-primary/10">
                  <span>Total</span>
                  <span className="text-primary font-bold">
                    {formatRupiah(total * 1.05)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout" className="block mt-4 w-full">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 font-medium"
                  disabled={cartItems.length === 0}
                >
                  Bayar Sekarang
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
