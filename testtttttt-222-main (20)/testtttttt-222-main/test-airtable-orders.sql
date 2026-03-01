-- ملف اختبار جدول airtable_orders
-- يمكنك تنفيذ هذه الاستعلامات في Supabase SQL Editor

-- 1. التحقق من وجود الجدول وعرض بنيته
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'airtable_orders'
ORDER BY ordinal_position;

-- 2. عرض جميع الطلبات (أحدث 10)
SELECT
  id,
  order_number,
  customer_first_name,
  customer_last_name,
  customer_phone,
  total,
  status,
  created_at
FROM airtable_orders
ORDER BY created_at DESC
LIMIT 10;

-- 3. عد الطلبات الإجمالية
SELECT COUNT(*) as total_orders
FROM airtable_orders;

-- 4. عرض طلب مع تفاصيل المنتجات (JSON بشكل جميل)
SELECT
  order_number,
  customer_first_name || ' ' || customer_last_name as customer_name,
  customer_phone,
  shipping_address,
  shipping_city,
  shipping_wilaya,
  delivery_type,
  jsonb_pretty(items) as products,
  product_name,
  product_size,
  quantity,
  subtotal,
  shipping_fee,
  total,
  status,
  created_at
FROM airtable_orders
ORDER BY created_at DESC
LIMIT 1;

-- 5. إحصائيات الطلبات
SELECT
  COUNT(*) as total_orders,
  COUNT(DISTINCT customer_phone) as unique_customers,
  SUM(total) as total_revenue,
  AVG(total) as average_order_value,
  MIN(total) as min_order,
  MAX(total) as max_order
FROM airtable_orders;

-- 6. الطلبات حسب الحالة
SELECT
  status,
  COUNT(*) as count,
  SUM(total) as revenue
FROM airtable_orders
GROUP BY status
ORDER BY count DESC;

-- 7. الطلبات حسب الولاية
SELECT
  shipping_wilaya,
  COUNT(*) as order_count,
  SUM(total) as total_revenue,
  AVG(total) as avg_order
FROM airtable_orders
GROUP BY shipping_wilaya
ORDER BY order_count DESC
LIMIT 10;

-- 8. طلبات اليوم
SELECT
  order_number,
  customer_first_name || ' ' || customer_last_name as customer,
  total,
  created_at
FROM airtable_orders
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;

-- 9. البحث عن طلب معين برقم الهاتف
-- (استبدل الرقم بالرقم الذي تريد البحث عنه)
SELECT
  order_number,
  created_at,
  total,
  status,
  product_name
FROM airtable_orders
WHERE customer_phone LIKE '%555123456%'
ORDER BY created_at DESC;

-- 10. البحث عن طلب برقم الطلب
-- (استبدل رقم الطلب)
SELECT
  order_number,
  customer_first_name,
  customer_last_name,
  customer_phone,
  customer_email,
  shipping_address,
  shipping_city,
  shipping_wilaya,
  delivery_type,
  notes,
  jsonb_pretty(items) as products_details,
  product_name,
  product_size,
  quantity,
  subtotal,
  shipping_fee,
  total,
  status,
  created_at,
  updated_at
FROM airtable_orders
WHERE order_number = 'FREMKYS-xxx';

-- 11. استخراج معلومات محددة من JSON items
SELECT
  order_number,
  created_at,
  jsonb_array_elements(items)->>'name' as product_name,
  (jsonb_array_elements(items)->>'price')::numeric as price,
  (jsonb_array_elements(items)->>'quantity')::integer as quantity,
  jsonb_array_elements(items)->>'size' as size
FROM airtable_orders
ORDER BY created_at DESC
LIMIT 10;

-- 12. تحديث حالة طلب (مثال)
-- UPDATE airtable_orders
-- SET status = 'قيد التجهيز'
-- WHERE order_number = 'FREMKYS-xxx';

-- 13. حذف طلبات تجريبية (احذر!)
-- DELETE FROM airtable_orders
-- WHERE customer_first_name = 'اختبار'
-- AND customer_last_name = 'تجريبي';
