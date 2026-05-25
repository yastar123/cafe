'use server'

import { createClient } from '@/lib/supabase/server'

export async function seedMenuItems() {
  const supabase = await createClient()

  const menuItems = [
    // Coffee -> Kopi
    {
      name: 'Espresso',
      description: 'Konsentrat kopi murni yang pekat dan kuat',
      category: 'Kopi',
      price: 20000,
      available: true,
    },
    {
      name: 'Americano',
      description: 'Espresso shot dengan tambahan air panas',
      category: 'Kopi',
      price: 25000,
      available: true,
    },
    {
      name: 'Cappuccino',
      description: 'Espresso dengan steamed milk dan busa susu tebal',
      category: 'Kopi',
      price: 30000,
      available: true,
    },
    {
      name: 'Latte',
      description: 'Espresso lembut dengan perbandingan susu yang creamy',
      category: 'Kopi',
      price: 32000,
      available: true,
    },
    {
      name: 'Macchiato',
      description: 'Espresso dengan sedikit busa susu di atasnya',
      category: 'Kopi',
      price: 28000,
      available: true,
    },
    {
      name: 'Flat White',
      description: 'Espresso dengan susu microfoam bertekstur beludru',
      category: 'Kopi',
      price: 32000,
      available: true,
    },
    // Cold Drinks -> Minuman Dingin
    {
      name: 'Iced Coffee',
      description: 'Kopi seduh dingin segar disajikan dengan es batu',
      category: 'Minuman Dingin',
      price: 25000,
      available: true,
    },
    {
      name: 'Iced Latte',
      description: 'Espresso dingin dipadu dengan susu segar dan es',
      category: 'Minuman Dingin',
      price: 32000,
      available: true,
    },
    {
      name: 'Cold Brew',
      description: 'Kopi konsentrat hasil ekstraksi air dingin selama 12 jam',
      category: 'Minuman Dingin',
      price: 28000,
      available: true,
    },
    {
      name: 'Frappuccino',
      description: 'Kopi blend dingin dengan whipped cream lembut di atasnya',
      category: 'Minuman Dingin',
      price: 38000,
      available: true,
    },
    // Tea -> Teh
    {
      name: 'Teh Hijau',
      description: 'Teh hijau hangat yang menenangkan dan kaya antioksidan',
      category: 'Teh',
      price: 18000,
      available: true,
    },
    {
      name: 'Teh Hitam',
      description: 'Seduhan teh hitam klasik hangat berkualitas tinggi',
      category: 'Teh',
      price: 15000,
      available: true,
    },
    {
      name: 'Chai Latte',
      description: 'Perpaduan teh rempah chai hangat dan steamed milk',
      category: 'Teh',
      price: 30000,
      available: true,
    },
    {
      name: 'Matcha Latte',
      description: 'Teh hijau matcha Jepang murni dengan susu hangat',
      category: 'Teh',
      price: 35000,
      available: true,
    },
    // Pastries -> Kue & Roti
    {
      name: 'Croissant Butter',
      description: 'Roti croissant khas Prancis yang renyah dan bermentega',
      category: 'Kue & Roti',
      price: 22000,
      available: true,
    },
    {
      name: 'Chocolate Croissant',
      description: 'Croissant renyah dengan isian cokelat lumer berkualitas',
      category: 'Kue & Roti',
      price: 25000,
      available: true,
    },
    {
      name: 'Blueberry Muffin',
      description: 'Kue muffin lembut dengan buah blueberry segar di dalamnya',
      category: 'Kue & Roti',
      price: 20000,
      available: true,
    },
    {
      name: 'Cinnamon Roll',
      description: 'Roti gulung kayu manis hangat dilapisi gula frosting',
      category: 'Kue & Roti',
      price: 24000,
      available: true,
    },
    // Sandwiches -> Roti Lapis
    {
      name: 'Sandwich Ham & Keju',
      description: 'Daging ham sapi panggang dengan keju lumer di roti panggang',
      category: 'Roti Lapis',
      price: 45000,
      available: true,
    },
    {
      name: 'Turkey Avocado Sandwich',
      description: 'Irisan daging kalkun, alpukat mentega segar, dan sayuran',
      category: 'Roti Lapis',
      price: 52000,
      available: true,
    },
    {
      name: 'Veggie Delight Sandwich',
      description: 'Sayuran segar panggang, saus hummus, dan bumbu herba',
      category: 'Roti Lapis',
      price: 38000,
      available: true,
    },
  ]

  // Clean and clear existing menu items first to allow clean re-seeding
  await supabase
    .from('menu_items')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  // Insert localized menu items
  const { error } = await supabase
    .from('menu_items')
    .insert(menuItems)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, message: 'Menu cafe berhasil di-seed dalam Bahasa Indonesia!' }
}

export async function seedAdminUser() {
  const supabase = await createClient()
  const bcrypt = require('bcryptjs')

  // Check if admin already exists
  const { data: existingAdmin } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'admin')
    .limit(1)

  if (existingAdmin && existingAdmin.length > 0) {
    return { success: true, message: 'Admin user already exists' }
  }

  const passwordHash = await bcrypt.hash('admin123', 10)

  const { error } = await supabase
    .from('users')
    .insert([
      {
        username: 'admin',
        email: 'admin@coffeehouse.com',
        password_hash: passwordHash,
        role: 'admin',
      },
    ])

  if (error) {
    return { success: false, error: error.message }
  }

  return {
    success: true,
    message: 'Admin user created with username: admin, password: admin123',
  }
}
