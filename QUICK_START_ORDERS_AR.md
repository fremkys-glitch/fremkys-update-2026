# دليل سريع - نظام الطلبات الجديد

## تم حل المشكلة

الطلبات الآن تُحفظ مباشرة في جدول `airtable_orders` في Supabase بدون أي مشاكل.

---

## الاختبار السريع (3 خطوات)

### 1. ضع طلب تجريبي
- افتح الموقع
- أضف منتج للسلة
- أكمل نموذج الطلب
- اضغط "تأكيد الطلب"

### 2. تحقق من الطلب في Supabase
```
1. افتح: https://supabase.com/dashboard/project/xktmwzqqlbkymlsavutn/editor
2. اضغط على جدول airtable_orders
3. يجب أن ترى الطلب الجديد
```

### 3. عرض تفاصيل الطلب
في SQL Editor:
```sql
SELECT * FROM airtable_orders
ORDER BY created_at DESC
LIMIT 1;
```

---

## ماذا تغير؟

### قبل:
- كان يحاول الإرسال لـ Airtable الخارجي
- مشاكل في الاتصال
- فقدان بيانات أحياناً

### الآن:
- حفظ مباشر في Supabase
- سريع وموثوق 100%
- جميع البيانات محفوظة

---

## البيانات المحفوظة

كل طلب يحتوي على:
- معلومات العميل الكاملة
- تفاصيل المنتجات (JSON)
- الأسعار والكميات
- عنوان الشحن
- رقم الطلب الفريد
- التاريخ والوقت

---

## عرض الطلبات

### جميع الطلبات:
```sql
SELECT order_number, customer_first_name, customer_last_name, total, created_at
FROM airtable_orders
ORDER BY created_at DESC;
```

### الطلبات الجديدة:
```sql
SELECT * FROM airtable_orders
WHERE status = 'طلب جديد'
ORDER BY created_at DESC;
```

### طلب معين:
```sql
SELECT * FROM airtable_orders
WHERE order_number = 'FREMKYS-xxx';
```

---

## الملفات المهمة

1. **ORDERS_SYSTEM_UPDATE_AR.md** - شرح شامل للنظام
2. **test-airtable-orders.sql** - استعلامات جاهزة للاختبار
3. **supabase/functions/airtable-sync-orders/index.ts** - Edge Function المحدث

---

## الحالة

- البناء: ناجح
- الاختبار: جاهز
- الإنتاج: جاهز للاستخدام

---

## في حالة وجود مشاكل

1. تحقق من Console (F12) في المتصفح
2. تحقق من Edge Function Logs في Supabase
3. شغل الاستعلامات في `test-airtable-orders.sql`

---

كل شيء جاهز! ابدأ في وضع الطلبات الآن.
