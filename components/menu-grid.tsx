'use client'

import { useCart, type CartItem } from '@/lib/store/cart'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'

interface MenuItem {
  id: string
  name: string
  description?: string
  category: string
  price: number
  image_url?: string
  available: boolean
}

interface MenuGridProps {
  items: MenuItem[]
}

export default function MenuGrid({ items }: MenuGridProps) {
  const addToCart = useCart((state) => state.addItem)

  const handleAddToCart = (item: MenuItem) => {
    const cartItem: CartItem = {
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image_url: item.image_url,
    }
    addToCart(cartItem)
    toast.success(`${item.name} berhasil dimasukkan ke keranjang!`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden hover:shadow-lg transition-shadow border-primary/10"
        >
          {item.image_url && (
            <div className="relative h-40 w-full bg-primary/5">
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <p className="text-xs text-primary/60 font-medium mt-1">
                  {item.category}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {item.description && (
              <CardDescription className="mb-3 text-sm">
                {item.description}
              </CardDescription>
            )}
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-primary">
                {formatRupiah(item.price)}
              </span>
              <Button
                size="sm"
                onClick={() => handleAddToCart(item)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
