import { useCart, type CartItem } from '@/lib/store/cart'
import { Button } from '@/components/ui/button'
import { Plus, Coffee } from 'lucide-react'
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
        <div
          key={item.id}
          className="bg-card border border-primary/10 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col group"
        >
          {/* Image area */}
          {item.image_url ? (
            <div className="relative h-44 w-full overflow-hidden bg-primary/5">
              <img
                src={item.image_url}
                alt={item.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ) : (
            <div className="h-40 w-full bg-gradient-to-br from-primary/10 via-accent/8 to-primary/5 flex flex-col items-center justify-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-sm">
                <Coffee className="h-7 w-7 text-primary/60" />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            <div className="flex-1">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-wide text-accent bg-accent/10 px-2 py-0.5 rounded-full mb-1.5">
                {item.category}
              </span>
              <h3 className="font-semibold text-foreground text-base leading-snug">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-primary/8">
              <span className="text-base font-bold text-primary">
                {formatRupiah(item.price)}
              </span>
              <Button
                size="sm"
                onClick={() => handleAddToCart(item)}
                className="bg-primary hover:bg-primary/90 h-8 w-8 p-0 rounded-full shadow-sm hover:shadow-md transition-all"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
