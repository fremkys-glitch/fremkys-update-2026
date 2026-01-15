/*
  # إعادة إنشاء جدول الطلبات

  ## الجداول الجديدة
  - `orders`
    - `id` (uuid, primary key)
    - `order_number` (text, unique) - رقم الطلب
    - `customer_first_name` (text) - اسم العميل
    - `customer_last_name` (text) - لقب العميل
    - `customer_email` (text) - البريد الإلكتروني
    - `customer_phone` (text) - رقم الهاتف
    - `shipping_address` (text) - العنوان الكامل
    - `shipping_city` (text) - المدينة
    - `shipping_wilaya` (text) - الولاية
    - `delivery_type` (text) - نوع التوصيل (home/office)
    - `notes` (text) - ملاحظات اختيارية
    - `items` (jsonb) - تفاصيل المنتجات
    - `subtotal` (decimal) - المجموع الفرعي
    - `shipping_fee` (decimal) - رسوم الشحن
    - `total` (decimal) - المجموع الكلي
    - `status` (text) - حالة الطلب
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## الأمان
  - تفعيل RLS على جدول orders
  - السماح للجميع بإدراج الطلبات (نموذج الدفع عند الاستلام)
  - السماح بالقراءة للجميع

  ## دالة توليد رقم الطلب
  - تستخدم sequence لتوليد أرقام متسلسلة
  - تنسيق: FREMKYS-XXXX
*/

-- إنشاء جدول orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_first_name text NOT NULL,
  customer_last_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  shipping_address text NOT NULL,
  shipping_city text NOT NULL,
  shipping_wilaya text NOT NULL,
  delivery_type text DEFAULT 'home',
  notes text DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal decimal(10, 2) NOT NULL DEFAULT 0,
  shipping_fee decimal(10, 2) NOT NULL DEFAULT 0,
  total decimal(10, 2) NOT NULL DEFAULT 0,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- حذف السياسات القديمة إن وجدت
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
DROP POLICY IF EXISTS "Public can read own orders by order_number" ON orders;
DROP POLICY IF EXISTS "Anyone can read orders" ON orders;

-- إنشاء السياسات الجديدة
CREATE POLICY "Anyone can insert orders"
  ON orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read orders"
  ON orders
  FOR SELECT
  USING (true);

-- إنشاء الفهارس
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- إنشاء sequence لتوليد أرقام الطلبات
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1000;

-- دالة لتوليد رقم طلب فريد
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  next_number int;
  order_num text;
BEGIN
  next_number := nextval('order_number_seq');
  order_num := 'FREMKYS-' || LPAD(next_number::text, 4, '0');
  RETURN order_num;
END;
$$;

-- دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء المحفز
DROP TRIGGER IF EXISTS update_orders_updated_at_trigger ON orders;
CREATE TRIGGER update_orders_updated_at_trigger
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();
