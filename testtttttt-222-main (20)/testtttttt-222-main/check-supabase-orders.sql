-- Check if orders are being saved in Supabase
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/xktmwzqqlbkymlsavutn/editor

-- 1. Check recent orders (last 24 hours)
SELECT
    order_number,
    customer_first_name,
    customer_last_name,
    customer_phone,
    status,
    created_at
FROM orders
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC
LIMIT 20;

-- 2. Count total orders
SELECT COUNT(*) as total_orders FROM orders;

-- 3. Check latest order
SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;

-- INTERPRETATION:
-- If you see orders here but NOT in Airtable,
-- then the issue is with Airtable integration (field names or API key)
--
-- If you see NO orders here either,
-- then orders aren't being submitted from the frontend
