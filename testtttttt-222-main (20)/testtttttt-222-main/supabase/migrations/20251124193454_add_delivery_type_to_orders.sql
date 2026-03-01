/*
  # إضافة حقل نوع التوصيل لجدول الطلبات

  1. التعديلات
    - إضافة عمود `delivery_type` لجدول `orders`
      - نوع البيانات: text
      - القيم المسموحة: 'home' أو 'office'
      - القيمة الافتراضية: 'home'
      - غير قابل للفراغ (NOT NULL)
    
  2. الملاحظات
    - يتم استخدام هذا الحقل لتحديد نوع التوصيل (للمنزل أو للمكتب)
    - يؤثر على حساب تكلفة الشحن حسب الولاية
*/

-- إضافة عمود نوع التوصيل
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'delivery_type'
  ) THEN
    ALTER TABLE orders ADD COLUMN delivery_type text NOT NULL DEFAULT 'home';
    
    -- إضافة قيد للتأكد من أن القيمة صحيحة
    ALTER TABLE orders ADD CONSTRAINT check_delivery_type 
      CHECK (delivery_type IN ('home', 'office'));
  END IF;
END $$;
