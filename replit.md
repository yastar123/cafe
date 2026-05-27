# Coffee House

Aplikasi pemesanan kopi Indonesia berbasis web — pelanggan dapat memesan menu, membayar via transfer/e-wallet/tunai, dan admin dapat mengelola menu, pesanan, pembayaran, dan pengguna.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 3001)
- `pnpm --filter @workspace/coffee-house run dev` — run the frontend (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind CSS + Wouter (routing) + Zustand (cart state) + Sonner (toasts)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- File upload: multer (payment proof images)
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/coffee-house/` — React frontend (Vite)
  - `src/pages/` — all page components
  - `src/components/` — shared components (CartSidebar, MenuGrid, OrderModal, AdminSidebar)
  - `src/lib/api.ts` — all API calls (fetch wrapper with Bearer auth)
  - `src/lib/store/cart.ts` — Zustand cart store (persisted to localStorage)
- `artifacts/api-server/` — Express API server
  - `src/routes/` — route handlers (auth, menu, orders, users, payments, upload)
  - `src/lib/auth.ts` — session middleware (requireAuth, requireAdmin)
  - `uploads/` — uploaded payment proof images
- `lib/db/` — Drizzle schema and DB connection
  - `src/schema.ts` — all table definitions
  - `src/seed.ts` — initial seed data (menu items, payment channels, admin user)

## Architecture decisions

- Auth: custom session tokens in `sessions` table, stored as Bearer header; sessionStorage in browser (`authToken`, `user`)
- Cart: Zustand with persist middleware, stored in localStorage as `coffee-house-cart`
- API returns camelCase fields; frontend handles both snake_case and camelCase via fallback pattern (`field ?? field_snake`)
- File uploads saved to `artifacts/api-server/uploads/`, served statically at `/api/uploads/:filename`
- Admin auth guard is in `AdminSidebar` component (redirects to `/auth/login` if no session, or `/menu` if non-admin)
- Tax (PPN) is 5%, calculated client-side in CartSidebar and CheckoutPage

## Product

- **Homepage** (`/`): Landing page with brand info; redirects logged-in users to `/menu` (admin → `/admin`)
- **Menu** (`/menu`): Browse 16+ items by category (Kopi, Non-Kopi, Makanan), search, add to cart, view orders tab
- **Checkout** (`/checkout`): Select payment method (transfer bank/e-wallet/tunai), upload bukti pembayaran, submit order
- **Order Success** (`/order-success`): Confirmation with order ID, copy button, next-steps guide
- **My Orders** (`/orders`): View all orders with status, click Detail for full order modal
- **Admin Dashboard** (`/admin`): Stats (total orders, revenue, pending, preparing, completed)
- **Admin Orders** (`/admin/orders`): View/filter/search all orders, update payment & order status
- **Admin Menu** (`/admin/menu`): CRUD menu items with categories, price, availability toggle
- **Admin Payments** (`/admin/payments`): CRUD payment channels (bank/e-wallet), toggle active
- **Admin Users** (`/admin/users`): View users, change role, delete

## Seed Data

- Admin: `username=admin`, `password=admin123`, `email=admin@coffeehouse.com`
- Menu: 16 items — 8 Kopi, 4 Non-Kopi, 4 Makanan
- Payment channels: Transfer Bank BCA (1234567890), GoPay/OVO/DANA (081234567890)

## User Preferences

- UI language: Indonesian (Bahasa Indonesia) throughout
- Currency: Indonesian Rupiah (Rp format)
- Category names: Indonesian — Kopi, Non-Kopi, Makanan, Minuman, Dessert, Snack

## Gotchas

- API server must be rebuilt after code changes (`pnpm run build` inside api-server)
- The `Start application` workflow proxies `/api` → `localhost:3001` via Vite config
- Payment proof upload requires multipart/form-data; the `Content-Type` header must NOT be set manually (browser sets it with boundary)
- Admin default form category is `'Kopi'` (not `'Coffee'`)
- Sessions are stored in DB `sessions` table; logout deletes the session row

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
