import { useCart, type CartItem } from '@/lib/store/cart'
import { Button } from '@/components/ui/button'
import { Plus, Minus, Coffee, Leaf, Snowflake, Cookie, Sandwich, UtensilsCrossed } from 'lucide-react'
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

const categoryStyle: Record<string, { gradient: string; icon: React.ElementType; iconColor: string; iconBg: string; badgeCls: string }> = {
  coffee:        { gradient: 'from-amber-900/20 via-amber-800/10 to-amber-700/8',  icon: Coffee,         iconColor: 'text-amber-700',  iconBg: 'bg-amber-100/70',   badgeCls: 'bg-amber-100 text-amber-800 border-amber-200/60' },
  tea:           { gradient: 'from-green-800/15 via-green-700/8 to-emerald-600/5', icon: Leaf,           iconColor: 'text-emerald-700', iconBg: 'bg-emerald-100/70', badgeCls: 'bg-emerald-100 text-emerald-800 border-emerald-200/60' },
  'cold drinks': { gradient: 'from-sky-700/15 via-blue-600/8 to-cyan-500/5',       icon: Snowflake,      iconColor: 'text-sky-600',     iconBg: 'bg-sky-100/70',     badgeCls: 'bg-sky-100 text-sky-800 border-sky-200/60' },
  pastries:      { gradient: 'from-orange-600/15 via-amber-500/8 to-yellow-400/5', icon: Cookie,         iconColor: 'text-orange-600',  iconBg: 'bg-orange-100/70',  badgeCls: 'bg-orange-100 text-orange-800 border-orange-200/60' },
  sandwiches:    { gradient: 'from-lime-700/12 via-green-600/8 to-emerald-500/5',  icon: Sandwich,       iconColor: 'text-lime-700',    iconBg: 'bg-lime-100/70',    badgeCls: 'bg-lime-100 text-lime-800 border-lime-200/60' },
}

function getCategoryStyle(category: string) {
  const key = category.toLowerCase()
  return (
    categoryStyle[key] ??
    { gradient: 'from-primary/12 via-accent/8 to-primary/5', icon: UtensilsCrossed, iconColor: 'text-primary/60', iconBg: 'bg-primary/10', badgeCls: 'bg-primary/10 text-primary border-primary/20' }
  )
}

export default function MenuGrid({ items }: MenuGridProps) {
  const addToCart = useCart((state) => state.addItem)
  const updateQuantity = useCart((state) => state.updateQuantity)
  const cartItems = useCart((state) => state.items)

  const getCartQuantity = (itemId: string) => {
    return cartItems.find((c) => c.menuItemId === itemId)?.quantity ?? 0
  }

  const handleAddToCart = (item: MenuItem) => {
    const cartItem: CartItem = {
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image_url: item.image_url,
    }
    addToCart(cartItem)
    toast.success(`${item.name} ditambahkan!`, { duration: 1500 })
  }

  const handleDecrement = (item: MenuItem) => {
    const qty = getCartQuantity(item.id)
    if (qty > 0) updateQuantity(item.id, qty - 1)
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
      {items.map((item) => {
        const style = getCategoryStyle(item.category)
        const PlaceholderIcon = style.icon
        const qty = getCartQuantity(item.id)

        return (
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
                {qty > 0 && (
                  <div className="absolute top-2.5 right-2.5 bg-primary text-primary-foreground text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                    {qty}
                  </div>
                )}
              </div>
            ) : (
              <div className={`h-40 w-full bg-gradient-to-br ${style.gradient} flex flex-col items-center justify-center gap-2 relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-3 right-5 w-16 h-16 rounded-full bg-white/20" />
                  <div className="absolute -bottom-3 -left-3 w-20 h-20 rounded-full bg-white/15" />
                </div>
                <div className={`relative w-14 h-14 rounded-2xl ${style.iconBg} backdrop-blur-sm flex items-center justify-center shadow-sm`}>
                  <PlaceholderIcon className={`h-7 w-7 ${style.iconColor}`} />
                </div>
                {qty > 0 && (
                  <div className="absolute top-2.5 right-2.5 bg-primary text-primary-foreground text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                    {qty}
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
              <div className="flex-1">
                <span className={`inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border mb-1.5 ${style.badgeCls}`}>
                  {item.category}
                </span>
                <h3 className="font-semibold text-foreground text-[15px] leading-snug">
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

                {qty === 0 ? (
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(item)}
                    className="bg-primary hover:bg-primary/90 h-8 w-8 p-0 rounded-full shadow-sm hover:shadow-md transition-all press-effect"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex items-center gap-1.5 bg-primary/8 rounded-full px-1 py-0.5">
                    <button
                      onClick={() => handleDecrement(item)}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-primary/15 transition-colors text-primary press-effect"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm font-bold text-primary">{qty}</span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-7 h-7 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors text-primary-foreground press-effect"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
