# Coffee House

Aplikasi pemesanan kopi & hidangan kafe berbasis web, dibangun dengan React + Vite. Pelanggan bisa memesan dari menu, checkout dengan bukti transfer, dan memantau status pesanan. Admin bisa mengelola menu, pesanan, metode pembayaran, dan pengguna.

## Run & Operate

- `pnpm --filter @workspace/coffee-house run dev` — jalankan frontend Coffee House
- `pnpm run typecheck` — typecheck seluruh workspace
- `pnpm run build` — build semua paket
- Required env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (set di Replit Secrets)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind v4, shadcn/ui, wouter
- State: zustand (cart)
- Backend: Supabase (PostgreSQL + Storage)
- Auth: custom username/password, bcryptjs, sessionStorage

## Where things live

- `artifacts/coffee-house/src/pages/` — semua halaman (Menu, Checkout, Admin, Auth)
- `artifacts/coffee-house/src/components/` — komponen reusable (MenuGrid, CartSidebar, OrderModal, AdminSidebar, ConfigBanner)
- `artifacts/coffee-house/src/lib/supabase.ts` — Supabase client + noop client saat belum dikonfigurasi
- `artifacts/coffee-house/src/lib/store/cart.ts` — cart zustand store
- `artifacts/coffee-house/src/index.css` — Coffee House theme (HSL vars, oklch)

## Architecture decisions

- Supabase dijadikan backend utama; saat env vars belum disetel, app menggunakan noop Proxy client yang mengembalikan `{ data: null, error }` agar tidak crash
- Auth menggunakan custom username/password (bcrypt hash disimpan di tabel `users`), session di sessionStorage — tidak menggunakan Supabase Auth
- Admin protected: cek `sessionStorage.user.role === 'admin'` di AdminSidebar, redirect ke `/auth/login` jika tidak valid
- Mobile cart menggunakan shadcn `Sheet` (drawer dari kanan); desktop menggunakan sidebar statis
- AdminSidebar: fixed sidebar di `lg+`, hamburger + overlay drawer di mobile

## Product

- Halaman Beranda (landing page publik)
- Auth: Login, Daftar, Sukses Daftar
- Menu: daftar produk dengan filter kategori, keranjang belanja (sidebar desktop / drawer mobile)
- Checkout: pilih metode pembayaran (transfer/e-wallet/tunai), unggah bukti transfer, catatan pesanan
- Riwayat Pesanan: pelanggan bisa lihat & pantau status pesanan
- Admin: Dasbor statistik, Kelola Pesanan, Kelola Menu, Metode Pembayaran, Kelola Pengguna

## User preferences

- Bahasa Indonesia untuk semua teks UI
- Fully responsive: mobile-first, semua halaman harus tampil baik di layar kecil
- Tidak ada silent failure — selalu tampilkan pesan error yang jelas
- Toast errors hanya ditampilkan jika Supabase sudah dikonfigurasi (bukan saat noop)

## Gotchas

- `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` **wajib** diset di Replit Secrets sebelum data bisa dimuat
- Noop Supabase client menggunakan Proxy + `.bind()` pada promise methods agar method chaining (`.from().select().eq()`) tidak crash
- Tabel DB yang diperlukan: `users`, `menu_items`, `orders`, `order_items`, `payment_channels`
- Storage bucket: `payment-proofs` (public read, authenticated write)

## Pointers

- Lihat `pnpm-workspace` skill untuk struktur workspace dan TypeScript setup
