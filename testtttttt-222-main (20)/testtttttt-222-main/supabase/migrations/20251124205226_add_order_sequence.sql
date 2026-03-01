/*
  # إضافة ترقيم تسلسلي للطلبات

  1. التعديلات
    - إنشاء تسلسل (sequence) لترقيم الطلبات بشكل تلقائي
    - إنشاء دالة لتوليد رقم طلب قصير بالصيغة: F-1, F-2, F-3...
    - الترقيم يبدأ من 1 ويزداد تلقائيًا مع كل طلب جديد
    
  2. الاستخدام
    - عند إنشاء طلب جديد، سيتم توليد رقم الطلب تلقائيًا
    - الصيغة: F-{رقم_تسلسلي}
    - مثال: F-1, F-2, F-3, F-100, etc.
*/

-- إنشاء تسلسل للطلبات
CREATE SEQUENCE IF NOT EXISTS orders_seq START WITH 1 INCREMENT BY 1;

-- دالة لتوليد رقم طلب قصير
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  next_id bigint;
BEGIN
  next_id := nextval('orders_seq');
  RETURN 'F-' || next_id::text;
END;
$$;
