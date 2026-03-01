/*
  # إضافة الحقول الناقصة لجدول المنتجات

  ## التعديلات
  - إضافة `is_new` (boolean) - منتج جديد
  - إضافة `is_best_seller` (boolean) - الأكثر مبيعاً
  - إضافة `is_limited_edition` (boolean) - إصدار محدود
  - إضافة `product_link` (text) - رابط المنتج
  - إضافة `in_stock` (boolean) - متوفر في المخزن

  ## ملاحظات
  - جميع الحقول اختيارية مع قيم افتراضية
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'is_new'
  ) THEN
    ALTER TABLE products ADD COLUMN is_new boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'is_best_seller'
  ) THEN
    ALTER TABLE products ADD COLUMN is_best_seller boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'is_limited_edition'
  ) THEN
    ALTER TABLE products ADD COLUMN is_limited_edition boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'product_link'
  ) THEN
    ALTER TABLE products ADD COLUMN product_link text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'in_stock'
  ) THEN
    ALTER TABLE products ADD COLUMN in_stock boolean DEFAULT true;
  END IF;
END $$;
