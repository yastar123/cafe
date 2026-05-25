-- 1. Drop check constraint on orders table to allow dynamic payment methods
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;

-- 2. Create payment_channels table
CREATE TABLE IF NOT EXISTS public.payment_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    account_number TEXT,
    account_name TEXT,
    instructions TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_channels ENABLE ROW LEVEL SECURITY;

-- Allow all operations for public (matches development schema policies)
CREATE POLICY "Allow all operations for public on payment_channels" ON public.payment_channels
    FOR ALL USING (true) WITH CHECK (true);

-- 3. Pre-seed default payment channels
INSERT INTO public.payment_channels (name, account_number, account_name, instructions, active)
VALUES 
    ('Transfer Bank BCA', '8410928371', 'Coffee House Cafe', 'Silakan transfer tepat sesuai total nominal belanja ke rekening BCA kami.', true),
    ('Transfer Bank Mandiri', '1370019283746', 'Coffee House Cafe', 'Silakan transfer tepat sesuai total nominal belanja ke rekening Mandiri kami.', true),
    ('E-Wallet OVO / GoPay', '081234567890', 'Coffee House Cafe', 'Silakan transfer ke nomor OVO/GoPay kami dan lampirkan bukti pembayaran.', true)
ON CONFLICT (name) DO UPDATE 
SET account_number = EXCLUDED.account_number,
    account_name = EXCLUDED.account_name,
    instructions = EXCLUDED.instructions;

-- 4. Ensure payment-proofs storage bucket exists and has correct public policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if any to recreate them cleanly
DROP POLICY IF EXISTS "Allow public select on payment-proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow public insert on payment-proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update on payment-proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete on payment-proofs" ON storage.objects;

-- Create policies for public access (including anonymous users using anon key)
CREATE POLICY "Allow public select on payment-proofs" ON storage.objects
    FOR SELECT USING (bucket_id = 'payment-proofs');

CREATE POLICY "Allow public insert on payment-proofs" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Allow public update on payment-proofs" ON storage.objects
    FOR UPDATE USING (bucket_id = 'payment-proofs');

CREATE POLICY "Allow public delete on payment-proofs" ON storage.objects
    FOR DELETE USING (bucket_id = 'payment-proofs');
