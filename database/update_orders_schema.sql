-- Add new columns to orders table for detailed checkout information
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS recipient_info jsonb,
ADD COLUMN IF NOT EXISTS shipping_address jsonb,
ADD COLUMN IF NOT EXISTS contacts jsonb;

-- Store payment/CRM sync state inside contacts JSON (no new columns required)
-- Example structure:
-- contacts.payment = { provider, status, paidAt, amount, updatedAt }
-- contacts.crm = { status, fullPaidAt, paidAt, paymentStatuses, syncedAt }

-- Ensure status can handle 'new' or 'draft' if not already
-- (status is text, so it's fine)
