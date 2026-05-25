# Quick Setup Guide

## Step 1: Supabase Integration

1. Go to your v0 project settings (top right)
2. Make sure Supabase integration is enabled
3. Verify that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables are set

## Step 2: Database Schema

The database schema has already been created via the migration. The following tables exist:
- `users`
- `menu_items`
- `orders`
- `order_items`

Row Level Security (RLS) policies are configured for secure data access.

## Step 3: Seed Sample Data (Optional)

To populate the database with sample menu items and admin account:

1. Navigate to a route that loads the seed action
2. Or manually insert test data via Supabase dashboard

**Sample Admin Account:**
- Username: `admin`
- Password: `admin123`
- Email: `admin@coffeehouse.com`

**Sample Menu Categories:**
- Coffee (Espresso, Cappuccino, Latte, etc.)
- Cold Drinks (Iced Coffee, Frappuccino, etc.)
- Tea (Green Tea, Chai Latte, Matcha, etc.)
- Pastries (Croissant, Muffin, Cinnamon Roll, etc.)
- Sandwiches (Ham & Cheese, Turkey Avocado, etc.)

## Step 4: Test the Application

### Customer Flow:
1. Go to home page
2. Click "Sign Up" to create an account
3. Login with your credentials
4. Browse menu by category
5. Add items to cart
6. Proceed to checkout
7. Choose payment method
8. Upload payment proof (if needed)
9. Place order
10. View order status in "My Orders"

### Admin Flow:
1. Login with admin credentials (admin / admin123)
2. You'll be redirected to admin dashboard
3. Navigate using sidebar:
   - **Dashboard**: View key metrics
   - **Orders**: View and manage all orders, update payment/order status
   - **Menu Items**: Add, edit, delete menu items
   - **Users**: View users, change roles, delete accounts

## Step 5: Deployment

### Deploy to Vercel:

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Key Features to Test

### Authentication
- ✅ Sign up with new account
- ✅ Login with credentials
- ✅ Protected routes (admin pages require admin role)
- ✅ Logout functionality

### Menu & Cart
- ✅ View menu items by category
- ✅ Add items to cart
- ✅ Update item quantities
- ✅ Remove items from cart
- ✅ Cart total calculation with tax

### Checkout
- ✅ Select payment method
- ✅ Upload payment proof (for bank transfer/e-wallet)
- ✅ Add special notes
- ✅ Create order with order items

### Orders
- ✅ View personal order history
- ✅ See order status

### Admin Dashboard
- ✅ View dashboard metrics
- ✅ Filter orders by status
- ✅ Search orders by ID/username
- ✅ View payment proofs
- ✅ Update payment status
- ✅ Update order status
- ✅ Add new menu items
- ✅ Edit menu items
- ✅ Delete menu items
- ✅ View users
- ✅ Change user roles

## File Upload

Payment proofs are stored in Supabase Storage in a bucket called `payment-proofs`. The storage path is automatically generated as `{timestamp}_{filename}`.

## Support & Troubleshooting

### Issue: "Module not found" errors
**Solution**: Make sure all packages are installed:
```bash
pnpm install
```

### Issue: Supabase credentials not found
**Solution**: Check v0 Settings > Vars to ensure Supabase keys are properly set

### Issue: Database tables not found
**Solution**: The migration has already been applied. If tables don't exist, re-run the migration through v0

### Issue: Can't upload payment proof
**Solution**: 
1. Check Supabase Storage exists
2. Ensure bucket is named `payment-proofs`
3. Check file size limits
4. Verify authenticated access permissions

## Architecture Notes

- **Authentication**: Custom implementation (not Supabase Auth) using username/password with bcrypt
- **State**: Zustand for client-side cart state
- **Database**: Full row-level security with role-based access
- **Styling**: Warm cafe theme with Tailwind CSS and shadcn/ui components
- **Payments**: Manual image upload (production would integrate with payment gateways)

## Next Steps for Production

1. **Replace payment proof upload** with real payment gateway integration (Stripe, PayPal, etc.)
2. **Add email notifications** for order confirmations and status updates
3. **Implement user dashboard** for order history and preferences
4. **Add menu item images** with proper CDN hosting
5. **Setup analytics** to track orders and revenue
6. **Implement search** for menu items
7. **Add ratings and reviews** system
8. **Consider loyalty program** for repeat customers

## Database Backup

Supabase automatically backs up your data. To export data:
1. Go to Supabase dashboard
2. Navigate to Settings > Backups
3. Download backup as needed

Good luck with your cafe ordering system! 🎉
