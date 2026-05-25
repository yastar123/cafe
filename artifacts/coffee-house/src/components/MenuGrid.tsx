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
    toast.success(`${item.name} ditambahkan ke keranjang!`)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden hover:shadow-md transition-all border-primary/10 group"
        >
          {item.image_url ? (
            <div className="relative h-36 w-full bg-primary/5 overflow-hidden">
              <img
                src={item.image_url}
                alt={item.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="h-2 w-full bg-gradient-to-r from-primary/20 to-accent/20" />
          )}
          <CardHeader className="pb-2 pt-3 px-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base leading-tight truncate">{item.name}</CardTitle>
                <p className="text-xs text-primary/60 font-medium mt-0.5">{item.category}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {item.description && (
              <CardDescription className="mb-3 text-xs line-clamp-2">
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
                className="bg-primary hover:bg-primary/90 h-8 w-8 p-0 rounded-full"
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
