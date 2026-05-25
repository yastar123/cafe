# Coffee House - Cafe Ordering System

A full-stack web application for ordering cafe items online with customer and admin interfaces.

## Features

### Customer Features
- Browse menu items by category (Coffee, Cold Drinks, Tea, Pastries, Sandwiches)
- Add items to cart with quantity management
- Checkout with payment method selection (Bank Transfer, E-Wallet, Cash)
- Upload payment proof for non-cash orders
- Track order status in real-time
- User authentication and account management

### Admin Features
- Dashboard with key metrics (total orders, revenue, pending orders)
- Manage orders with payment verification
- View payment proofs
- Update order and payment status
- CRUD operations for menu items
- User management with role assignment
- Filter and search orders by status

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **State Management**: Zustand (for cart)
- **Database**: Supabase PostgreSQL
- **Authentication**: Custom username/password with bcrypt hashing
- **File Storage**: Supabase Storage (payment proofs)
- **Styling**: Warm cafe theme (deep brown #6b4423, cream #faf6f0, accent orange #c85a2f)

## Project Structure

```
├── app/
│   ├── (auth)
│   │   ├── login/page.tsx
│   │   ├── sign-up/page.tsx
│   │   └── sign-up-success/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx (dashboard)
│   │   ├── orders/page.tsx
│   │   ├── menu/page.tsx
│   │   └── users/page.tsx
│   ├── menu/page.tsx
│   ├── checkout/page.tsx
│   ├── order-success/page.tsx
│   ├── orders/page.tsx
│   ├── actions/
│   │   ├── auth.ts
│   │   └── seed.ts
│   ├── layout.tsx
│   ├── page.tsx (home)
│   └── globals.css
├── components/
│   ├── menu-grid.tsx
│   ├── cart-sidebar.tsx
│   ├── admin-sidebar.tsx
│   ├── order-modal.tsx
│   └── ui/ (shadcn components)
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── proxy.ts
│   └── store/
│       └── cart.ts
└── middleware.ts
```

## Database Schema

### users
- `id` (UUID, PK)
- `username` (TEXT, UNIQUE)
- `email` (TEXT, UNIQUE)
- `password_hash` (TEXT)
- `role` (TEXT: 'customer' | 'admin')
- `created_at` (TIMESTAMP)

### menu_items
- `id` (UUID, PK)
- `name` (TEXT)
- `description` (TEXT)
- `category` (TEXT)
- `price` (DECIMAL)
- `image_url` (TEXT)
- `available` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### orders
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `total_amount` (DECIMAL)
- `payment_method` (TEXT: 'bank_transfer' | 'e_wallet' | 'cash')
- `payment_status` (TEXT: 'pending' | 'confirmed' | 'rejected')
- `order_status` (TEXT: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled')
- `payment_proof_url` (TEXT)
- `notes` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### order_items
- `id` (UUID, PK)
- `order_id` (UUID, FK)
- `menu_item_id` (UUID, FK)
- `quantity` (INT)
- `unit_price` (DECIMAL)
- `subtotal` (DECIMAL)
- `created_at` (TIMESTAMP)

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account and project

### Installation

1. **Install dependencies**:
```bash
pnpm install
```

2. **Set up environment variables**:
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Seed the database** (optional):
```bash
# Run in the browser console or use a server action
// Import the seed functions from app/actions/seed.ts
// Call seedMenuItems() and seedAdminUser()
```

4. **Run the development server**:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Credentials

### Admin Account (after seeding)
- **Username**: admin
- **Password**: admin123
- **Role**: admin

### Test Customer Account (create during sign-up)
- Create any account through the sign-up page
- Login and start ordering

## Features in Detail

### Authentication
- Custom username/password authentication
- Passwords hashed with bcrypt (10 rounds)
- Session stored in browser sessionStorage
- Protected routes with role-based access

### Shopping Cart
- Zustand store for state management
- Add/remove items with quantity control
- Persistent total calculation
- Tax calculation (5%)

### Payment Methods
1. **Bank Transfer**: Requires payment proof image
2. **E-Wallet**: Requires payment proof image (OVO, GCash, etc.)
3. **Cash**: Pay on pickup, no proof needed

### Order Management
- Customers can view their order history
- Admins can view all orders and update statuses
- Payment proof images stored in Supabase Storage
- Real-time status updates

### Admin Dashboard
- Overview stats (total orders, revenue, pending orders)
- Filter orders by payment/order status
- Search orders by ID or username
- Edit order and payment status
- View payment proof images
- Manage menu items (add, edit, delete)
- Manage users (view, change role, delete)

## Color Theme

The application uses a warm cafe-inspired color scheme:

- **Primary**: Deep Brown (#6b4423) - Used for main actions, headers
- **Accent**: Warm Orange (#c85a2f) - Used for highlights and alerts
- **Secondary**: Light Tan (#d4a574) - Used for secondary actions
- **Background**: Cream (#faf6f0) - Main background color
- **Foreground**: Dark Brown (#2c1810) - Text color

## Security Features

- Row Level Security (RLS) on all database tables
- Custom authentication with bcrypt password hashing
- Protected admin routes via middleware
- CSRF protection via Next.js
- Image uploads scoped to Supabase Storage

## Performance Optimizations

- Image optimization with Next.js Image component
- Client-side cart state with Zustand
- Server-side data fetching with server actions
- Database indexing on frequently queried columns
- Static generation where applicable

## Troubleshooting

### Supabase Credentials Missing
Make sure you have configured the Supabase integration in v0 and that the environment variables are set in your project settings.

### Cart Not Persisting
The cart uses browser sessionStorage which clears on browser close. For persistent carts, implement localStorage or database storage.

### Payment Proof Upload Failing
Ensure:
1. Supabase Storage bucket "payment-proofs" exists
2. Storage policies allow authenticated uploads
3. File size is within limits (typically 50MB)

## Future Enhancements

- Email notifications for order status updates
- Ratings and reviews system
- Loyalty/rewards program
- Advanced analytics dashboard
- Mobile app (React Native)
- Real-time order notifications (WebSockets)
- Menu item images with optimization
- Delivery tracking
- Multiple locations support

## License

This project is created with v0 and is available for personal and commercial use.
