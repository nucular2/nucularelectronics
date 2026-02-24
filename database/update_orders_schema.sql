-- Add new columns to orders table for detailed checkout information
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS recipient_info jsonb,
ADD COLUMN IF NOT EXISTS shipping_address jsonb,
ADD COLUMN IF NOT EXISTS contacts jsonb;

-- Ensure status can handle 'new' or 'draft' if not already
-- (status is text, so it's fine)
