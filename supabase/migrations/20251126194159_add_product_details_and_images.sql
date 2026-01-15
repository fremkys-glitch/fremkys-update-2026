/*
  # إضافة الأعمدة الناقصة وجدول الصور

  ## التعديلات على جدول products
  - إضافة `old_price` - السعر القديم (للعروض)
  - إضافة `image1`, `image2`, `image3` - صور إضافية
  - إضافة حقول المقاسات: `size_s`, `size_m`, `size_l`, `size_xl`, `size_36`, `size_38`, `size_40`, `size_42`
  - إضافة `product_link` - رابط المنتج

  ## جدول جديد images
  - `id` (uuid, primary key)
  - `image` (text) - رابط الصورة
  - `product_link` (text) - رابط المنتج
  - `category` (text) - التصنيف
  - `position` (integer) - الترتيب العرض
  - `created_at` (timestamptz)

  ## الأمان
  - تفعيل RLS على جدول الصور
  - السماح بالقراءة للجميع
*/

-- إضافة الأعمدة الجديدة إلى جدول products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'old_price'
  ) THEN
    ALTER TABLE products ADD COLUMN old_price numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'image1'
  ) THEN
    ALTER TABLE products ADD COLUMN image1 text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'image2'
  ) THEN
    ALTER TABLE products ADD COLUMN image2 text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'image3'
  ) THEN
    ALTER TABLE products ADD COLUMN image3 text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'size_s'
  ) THEN
    ALTER TABLE products ADD COLUMN size_s boolean;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'size_m'
  ) THEN
    ALTER TABLE products ADD COLUMN size_m boolean;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'size_l'
  ) THEN
    ALTER TABLE products ADD COLUMN size_l boolean;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'size_xl'
  ) THEN
    ALTER TABLE products ADD COLUMN size_xl boolean;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'size_36'
  ) THEN
    ALTER TABLE products ADD COLUMN size_36 boolean;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'size_38'
  ) THEN
    ALTER TABLE products ADD COLUMN size_38 boolean;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'size_40'
  ) THEN
    ALTER TABLE products ADD COLUMN size_40 boolean;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'size_42'
  ) THEN
    ALTER TABLE products ADD COLUMN size_42 boolean;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'product_link'
  ) THEN
    ALTER TABLE products ADD COLUMN product_link text;
  END IF;
END $$;

-- إنشاء جدول الصور
CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image text NOT NULL,
  product_link text NOT NULL,
  category text NOT NULL,
  position integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- تفعيل RLS على جدول الصور
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- حذف السياسات القديمة إن وجدت
DROP POLICY IF EXISTS "Anyone can read images" ON images;
DROP POLICY IF EXISTS "Authenticated users can insert images" ON images;
DROP POLICY IF EXISTS "Authenticated users can update images" ON images;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON images;

-- إنشاء السياسات الجديدة
CREATE POLICY "Anyone can read images"
  ON images FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert images"
  ON images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update images"
  ON images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete images"
  ON images FOR DELETE
  TO authenticated
  USING (true);

-- إضافة الفهارس
CREATE INDEX IF NOT EXISTS idx_images_category ON images(category);
CREATE INDEX IF NOT EXISTS idx_images_product_link ON images(product_link);
CREATE INDEX IF NOT EXISTS idx_images_position ON images(position);