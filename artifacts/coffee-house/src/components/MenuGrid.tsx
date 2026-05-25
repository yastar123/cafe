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

const categoryStyle: Record<string, { gradient: string; icon: React.ElementType; iconColor: string; iconBg: string; badgeCls: string; topBar: string }> = {
  coffee:        { gradient: 'from-amber-900/18 via-amber-800/10 to-amber-700/6',  icon: Coffee,         iconColor: 'text-amber-700',  iconBg: 'bg-amber-100/80',   badgeCls: 'bg-amber-100 text-amber-800 border-amber-200/60',    topBar: 'bg-amber-500' },
  tea:           { gradient: 'from-green-800/14 via-green-700/8 to-emerald-600/5', icon: Leaf,           iconColor: 'text-emerald-700', iconBg: 'bg-emerald-100/80', badgeCls: 'bg-emerald-100 text-emerald-800 border-emerald-200/60', topBar: 'bg-emerald-500' },
  'cold drinks': { gradient: 'from-sky-700/14 via-blue-600/8 to-cyan-500/5',       icon: Snowflake,      iconColor: 'text-sky-600',     iconBg: 'bg-sky-100/80',     badgeCls: 'bg-sky-100 text-sky-800 border-sky-200/60',          topBar: 'bg-sky-500' },
  pastries:      { gradient: 'from-orange-600/14 via-amber-500/8 to-yellow-400/5', icon: Cookie,         iconColor: 'text-orange-600',  iconBg: 'bg-orange-100/80',  badgeCls: 'bg-orange-100 text-orange-800 border-orange-200/60', topBar: 'bg-orange-500' },
  sandwiches:    { gradient: 'from-lime-700/12 via-green-600/8 to-emerald-500/5',  icon: Sandwich,       iconColor: 'text-lime-700',    iconBg: 'bg-lime-100/80',    badgeCls: 'bg-lime-100 text-lime-800 border-lime-200/60',       topBar: 'bg-lime-500' },
}

function getCategoryStyle(category: string) {
  const key = category.toLowerCase()
  return (
    categoryStyle[key] ??
    { gradient: 'from-primary/10 via-accent/6 to-primary/4', icon: UtensilsCrossed, iconColor: 'text-primary/60', iconBg: 'bg-primary/10', badgeCls: 'bg-primary/10 text-primary border-primary/20', topBar: 'bg-primary' }
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
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
      {items.map((item) => {
        const style = getCategoryStyle(item.category)
        const PlaceholderIcon = style.icon
        const qty = getCartQuantity(item.id)

        return (
          <div
            key={item.id}
            className="bg-card border border-primary/10 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-250 flex flex-col group relative"
          >
            {/* In-cart highlight */}
            {qty > 0 && (
              <div className="absolute inset-0 ring-2 ring-primary/30 rounded-2xl pointer-events-none z-10" />
            )}

            {/* Image / Placeholder */}
            {item.image_url ? (
              <div className="relative w-full overflow-hidden bg-primary/5" style={{ aspectRatio: '4/3' }}>
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-400"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                {qty > 0 && (
                  <div className="absolute top-2.5 right-2.5 bg-primary text-primary-foreground text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md z-20">
                    {qty}
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`w-full bg-gradient-to-br ${style.gradient} flex flex-col items-center justify-center gap-2 relative overflow-hidden`}
                style={{ aspectRatio: '4/3' }}
              >
                {/* Decorative circles */}
                <div className="absolute top-2 right-4 w-16 h-16 rounded-full bg-white/15" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/10" />
                <div className={`relative w-14 h-14 rounded-2xl ${style.iconBg} backdrop-blur-sm flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                  <PlaceholderIcon className={`h-7 w-7 ${style.iconColor}`} />
                </div>
                {qty > 0 && (
                  <div className="absolute top-2.5 right-2.5 bg-primary text-primary-foreground text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md z-20">
                    {qty}
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-3 sm:p-4 flex flex-col flex-1">
              <div className="flex-1">
                <span className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border mb-1.5 ${style.badgeCls}`}>
                  {item.category}
                </span>
                <h3 className="font-semibold text-foreground text-[14px] sm:text-[15px] leading-snug line-clamp-2">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-primary/8">
                <span className="text-sm sm:text-base font-bold text-primary leading-none">
                  {formatRupiah(item.price)}
                </span>

                {qty === 0 ? (
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(item)}
                    className="bg-primary hover:bg-primary/90 h-8 w-8 p-0 rounded-full shadow-sm hover:shadow-md transition-all press-effect flex-shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex items-center gap-1 bg-primary/8 rounded-full px-1 py-0.5 flex-shrink-0">
                    <button
                      onClick={() => handleDecrement(item)}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors text-primary press-effect active:bg-primary/25"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm font-bold text-primary tabular-nums">{qty}</span>
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
