/*
  # Create airtable_orders table
  
  1. New Table
    - `airtable_orders` - stores complete order information including items
      - `id` (uuid, primary key)
      - `order_number` (text, unique) - رقم الطلب الفريد
      - `customer_first_name` (text) - الاسم الأول
      - `customer_last_name` (text) - اللقب
      - `customer_email` (text) - البريد الإلكتروني
      - `customer_phone` (text) - رقم الهاتف
      - `shipping_address` (text) - العنوان
      - `shipping_city` (text) - المدينة
      - `shipping_wilaya` (text) - الولاية
      - `delivery_type` (text) - نوع التوصيل
      - `notes` (text) - ملاحظات
      - `items` (jsonb) - تفاصيل المنتجات
      - `product_name` (text) - أسماء المنتجات
      - `product_size` (text) - المقاسات
      - `quantity` (integer) - الكمية الإجمالية
      - `subtotal` (numeric) - المجموع الفرعي
      - `shipping_fee` (numeric) - رسوم الشحن
      - `total` (numeric) - الإجمالي
      - `status` (text) - حالة الطلب
      - `airtable_record_id` (text) - معرف السجل في Airtable
      - `created_at` (timestamptz) - تاريخ الإنشاء
      - `updated_at` (timestamptz) - تاريخ التحديث
  
  2. Security
    - Enable RLS on airtable_orders table
    - Add policy for authenticated users to view orders
    - Add policy for service role to insert/update orders
*/

-- Create airtable_orders table
CREATE TABLE IF NOT EXISTS airtable_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_wilaya TEXT NOT NULL,
  delivery_type TEXT DEFAULT 'home',
  notes TEXT,
  items JSONB NOT NULL,
  product_name TEXT,
  product_size TEXT,
  quantity INTEGER DEFAULT 1,
  subtotal NUMERIC(10, 2) NOT NULL,
  shipping_fee NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'طلب جديد',
  airtable_record_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on order_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_airtable_orders_order_number ON airtable_orders(order_number);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_airtable_orders_created_at ON airtable_orders(created_at DESC);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_airtable_orders_status ON airtable_orders(status);

-- Enable Row Level Security
ALTER TABLE airtable_orders ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all orders
CREATE POLICY "Allow authenticated users to read orders"
  ON airtable_orders
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow service role to insert orders
CREATE POLICY "Allow service role to insert orders"
  ON airtable_orders
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy: Allow service role to update orders
CREATE POLICY "Allow service role to update orders"
  ON airtable_orders
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_airtable_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_airtable_orders_updated_at
  BEFORE UPDATE ON airtable_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_airtable_orders_updated_at();