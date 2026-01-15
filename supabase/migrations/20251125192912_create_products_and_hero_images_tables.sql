/*
  # إنشاء جداول المنتجات وصور الصفحة الرئيسية

  ## الجداول الجديدة
  
  ### products
  - `id` (uuid, primary key)
  - `name` (text) - اسم المنتج
  - `price` (numeric) - السعر
  - `category` (text) - التصنيف
  - `image` (text) - رابط الصورة الأساسية
  - `hover_image` (text) - رابط الصورة عند التمرير
  - `sizes` (jsonb) - المقاسات المتاحة
  - `description` (text) - وصف المنتج
  - `is_new` (boolean) - منتج جديد
  - `is_best_seller` (boolean) - الأكثر مبيعاً
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### hero_images
  - `id` (uuid, primary key)
  - `title` (text) - العنوان
  - `subtitle` (text) - العنوان الفرعي
  - `image_url` (text) - رابط الصورة
  - `position` (integer) - الترتيب
  - `is_active` (boolean) - نشط/غير نشط
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## الأمان
  - تفعيل RLS على جميع الجداول
  - السماح بالقراءة للجميع
  - السماح بالتعديل للمستخدمين المصادق عليهم فقط
*/

-- إنشاء جدول المنتجات
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  image text NOT NULL,
  hover_image text NOT NULL,
  sizes jsonb NOT NULL DEFAULT '[]'::jsonb,
  description text NOT NULL DEFAULT '',
  is_new boolean DEFAULT false,
  is_best_seller boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول صور الصفحة الرئيسية
CREATE TABLE IF NOT EXISTS hero_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

-- سياسات القراءة للجميع
CREATE POLICY "Anyone can read products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read hero images"
  ON hero_images FOR SELECT
  USING (true);

-- سياسات الإدراج للمستخدمين المصادق عليهم
CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert hero images"
  ON hero_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- سياسات التحديث للمستخدمين المصادق عليهم
CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update hero images"
  ON hero_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- سياسات الحذف للمستخدمين المصادق عليهم
CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete hero images"
  ON hero_images FOR DELETE
  TO authenticated
  USING (true);

-- إضافة فهرس للتصنيفات
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- إضافة فهرس للترتيب
CREATE INDEX IF NOT EXISTS idx_hero_images_position ON hero_images(position);

-- دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء المحفزات
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hero_images_updated_at ON hero_images;
CREATE TRIGGER update_hero_images_updated_at
  BEFORE UPDATE ON hero_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
