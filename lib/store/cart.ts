import { create } from 'zustand'

export interface CartItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  image_url?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (menuItemId: string) => void
  updateQuantity: (menuItemId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (item: CartItem) => {
    set((state) => {
      const existingItem = state.items.find(
        (i) => i.menuItemId === item.menuItemId,
      )
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.menuItemId === item.menuItemId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
        }
      }
      return { items: [...state.items, item] }
    })
  },
  
  removeItem: (menuItemId: string) => {
    set((state) => ({
      items: state.items.filter((i) => i.menuItemId !== menuItemId),
    }))
  },
  
  updateQuantity: (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(menuItemId)
    } else {
      set((state) => ({
        items: state.items.map((i) =>
          i.menuItemId === menuItemId ? { ...i, quantity } : i,
        ),
      }))
    }
  },
  
  clearCart: () => {
    set({ items: [] })
  },
  
  getTotal: () => {
    const state = get()
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  },
}))
