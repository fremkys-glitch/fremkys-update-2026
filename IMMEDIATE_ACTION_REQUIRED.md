# خطوات عاجلة - يجب تنفيذها فوراً

## ⚠️ إجراءات فورية مطلوبة

---

## الخطوة 1: إضافة Environment Variables في Supabase

**الوقت المقدر**: 5 دقائق
**الأهمية**: حرجة جداً

### التنفيذ:

1. اذهب إلى Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/xktmwzqqlbkymlsavutn/settings/functions
   ```

2. اذهب إلى قسم "Edge Functions" → "Secrets"

3. أضف المتغيرات التالية:

```bash
AIRTABLE_API_KEY=patO4zErdHJF4rokY.4f661e6545ddf1a26ad7d93933881edfcf71476fe710263c4d034398d87e05e2
AIRTABLE_BASE_ID=appHEqfWbNHzk3zft
AIRTABLE_TABLE_NAME=Orders
```

4. احفظ واعد نشر Edge Function

### التحقق:
```bash
# في Dashboard، افتح Logs وتأكد من عدم ظهور رسالة "مفاتيح Airtable غير موجودة"
```

---

## الخطوة 2: التحقق من أسماء الأعمدة في Airtable

**الوقت المقدر**: 10 دقائق
**الأهمية**: حرجة جداً

### التنفيذ:

1. افتح Airtable base:
   ```
   https://airtable.com/appHEqfWbNHzk3zft
   ```

2. افتح جدول "Orders"

3. تأكد من أن أسماء الأعمدة **تطابق تماماً** (case-sensitive):

| اسم العمود في Airtable | النوع المطلوب | ملاحظات |
|------------------------|---------------|---------|
| Order Number | Single line text | يجب أن يكون بالضبط "Order Number" أو "order_number" |
| customer_first_name | Single line text | snake_case |
| customer_last_name | Single line text | snake_case |
| customer_email | Email أو Single line text | snake_case |
| customer_phone | Phone أو Single line text | snake_case |
| Shipping Address | Long text | يجب أن يكون بالضبط "Shipping Address" أو "shipping_address" |
| shipping_city | Single line text | snake_case |
| shipping_wilaya | Single line text | snake_case |
| delivery_type | Single line text أو Single select | snake_case |
| notes | Long text | snake_case |
| product_name | Long text | snake_case |
| product_size | Single line text | snake_case |
| subtotal | Number | **مهم جداً**: يجب أن يكون Number |
| shipping_fee | Number | **مهم جداً**: يجب أن يكون Number |
| Total | Number | يجب أن يكون بالضبط "Total" أو "total" |
| status | Single line text أو Single select | snake_case |

### إذا كانت الأسماء مختلفة:

**الخيار 1 (الأسهل)**: عدل أسماء الأعمدة في Airtable لتطابق الجدول أعلاه.

**الخيار 2**: عدل الكود في `supabase/create-order/index.ts` (السطر 63-77) ليطابق أسماء أعمدتك.

### التحقق:
```bash
# أرسل طلب تجريبي وتحقق من:
# 1. عدم ظهور خطأ UNKNOWN_FIELD_NAME
# 2. ظهور السجل الجديد في Airtable
```

---

## الخطوة 3: اختبار شامل للنظام

**الوقت المقدر**: 15 دقيقة
**الأهمية**: حرجة

### التنفيذ:

#### 1. افتح التطبيق في المتصفح
```bash
npm run dev
```

#### 2. افتح Developer Tools (F12)
اذهب إلى Console tab

#### 3. ضع طلب تجريبي:
- أضف منتج للسلة
- املأ النموذج بالبيانات التالية:

```
الاسم: اختبار
اللقب: تجريبي
البريد: test@example.com
الهاتف: 0555123456
العنوان: شارع الاختبار
المدينة: الجزائر
الولاية: Alger
نوع التوصيل: منزلي
```

#### 4. راقب Console Logs
يجب أن ترى:
```
📝 Starting order submission...
📦 Order payload prepared: {...}
🌐 Sending to Edge Function: https://xktmwzqqlbkymlsavutn.supabase.co/functions/v1/create-order
📥 Response status: 200
✅ Order sent to Airtable successfully!
✅ Airtable Record ID: recXXXXXXXXXXXXXX
✅ Order created successfully!
```

#### 5. تحقق من Airtable
- افتح Airtable base
- ابحث عن السجل الجديد
- تأكد من أن جميع الحقول مملوءة

#### 6. تحقق من Supabase
- افتح Supabase Dashboard → Table Editor
- افتح جدول `orders`
- ابحث عن السجل الجديد

### اختبار الأخطاء:

#### اختبار 1: رقم هاتف خاطئ
```
الهاتف: 123456
النتيجة المتوقعة: يظهر خطأ "رقم الهاتف غير صحيح"
```

#### اختبار 2: بريد إلكتروني خاطئ
```
البريد: not-an-email
النتيجة المتوقعة: يظهر خطأ "البريد الإلكتروني غير صحيح"
```

#### اختبار 3: سلة فارغة
```
حاول الذهاب للـ checkout مع سلة فارغة
النتيجة المتوقعة: رسالة "سلة التسوق فارغة"
```

### التحقق النهائي:
- [ ] Console logs تظهر جميع المراحل بنجاح
- [ ] السجل موجود في Airtable
- [ ] السجل موجود في Supabase
- [ ] جميع الحقول مملوءة بشكل صحيح
- [ ] رسائل الخطأ تظهر عند إدخال بيانات خاطئة

---

## الخطوة 4: إعادة نشر Edge Function (إذا لزم الأمر)

**الوقت المقدر**: 5 دقائق
**الأهمية**: متوسطة

إذا قمت بتعديل أسماء الحقول أو إضافة Environment Variables، يجب إعادة النشر:

### التنفيذ:

استخدم أداة الـ deployment في Supabase Dashboard:
1. اذهب إلى Edge Functions
2. اختر `create-order`
3. اضغط "Redeploy"

---

## الأخطاء الشائعة وحلولها

### الخطأ: UNKNOWN_FIELD_NAME

**السبب**: اسم العمود في Airtable لا يطابق ما في الكود

**الحل**:
1. افتح Airtable
2. تحقق من اسم العمود المذكور في رسالة الخطأ
3. عدل الاسم ليطابق تماماً (case-sensitive)

مثال:
```
الخطأ: "Unknown field name: 'customer_first_name'"
الحل: تأكد أن اسم العمود في Airtable هو "customer_first_name" بالضبط
```

---

### الخطأ: INVALID_VALUE_FOR_COLUMN

**السبب**: نوع البيانات خاطئ (مثلاً: إرسال نص لحقل رقمي)

**الحل**:
1. افتح Airtable
2. تأكد أن أعمدة `subtotal`, `shipping_fee`, `Total` من نوع **Number**
3. غير نوع العمود إذا لزم الأمر

---

### الخطأ: AUTHENTICATION_REQUIRED

**السبب**: API key غير صحيح أو مفقود

**الحل**:
1. تحقق من Environment Variables في Supabase
2. تأكد أن `AIRTABLE_API_KEY` صحيح
3. أعد نشر Edge Function

---

### الخطأ: Network Error / Timeout

**السبب**: مشكلة في الاتصال بـ Airtable

**الحل**:
- النظام سيحاول 3 مرات تلقائياً
- إذا استمر الخطأ، تحقق من:
  1. الاتصال بالإنترنت
  2. حالة Airtable API (https://status.airtable.com)
  3. الطلب سيُحفظ في Supabase حتى لو فشل Airtable

---

## Checklist نهائي

قبل الانتقال للإنتاج، تأكد من:

- [ ] تم إضافة Environment Variables في Supabase
- [ ] تم التحقق من أسماء الأعمدة في Airtable
- [ ] تم اختبار النظام بنجاح
- [ ] Console logs تظهر كل المراحل
- [ ] السجلات تظهر في Airtable و Supabase
- [ ] رسائل الخطأ تعمل بشكل صحيح
- [ ] تم اختبار جميع السيناريوهات (نجاح، فشل، أخطاء)

---

## التواصل عند الحاجة

إذا واجهت أي مشاكل:

1. تحقق من Console logs (F12)
2. تحقق من Edge Function logs في Supabase Dashboard
3. راجع التقرير الكامل: `COMPREHENSIVE_INTEGRATION_AUDIT_REPORT.md`
4. راجع الملخص: `AUDIT_SUMMARY_AR.md`

---

## بعد الانتهاء

بمجرد إتمام هذه الخطوات الأربع:
- النظام جاهز للاستخدام
- البيانات محمية من الفقدان
- الأمان محسّن بشكل كبير
- معالجة الأخطاء محسّنة

**الوقت الإجمالي**: ~35 دقيقة
**الحالة بعد التنفيذ**: جاهز للإنتاج

---

**ملاحظة مهمة**: هذه الخطوات ضرورية قبل إطلاق النظام في بيئة الإنتاج. تجاهلها قد يؤدي إلى فقدان بيانات أو مشاكل أمنية.
