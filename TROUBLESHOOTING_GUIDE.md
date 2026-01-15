# Airtable Integration Troubleshooting Guide - FREMKYS

## Problem: Orders Not Appearing in Airtable

---

## Quick Diagnosis (Start Here)

### Option 1: Use the Test Tool (Fastest)
1. Open `test-airtable-connection.html` in your browser
2. Open Developer Tools (F12) and go to Console tab
3. Click "Send Test Order"
4. Follow the results

### Option 2: Check Supabase Logs (Most Reliable)
1. Go to: https://supabase.com/dashboard/project/xktmwzqqlbkymlsavutn/functions
2. Click "create-order" function
3. Click "Logs" tab
4. Look for recent errors

---

## Common Issues and Solutions

### Issue 1: Field Name Mismatch (90% of cases)

**Symptoms:**
- Logs show: "Status: 422"
- Error: "UNKNOWN_FIELD_NAME"
- Orders appear in Supabase but not Airtable

**Solution:**
Open Airtable and check your column names match EXACTLY:

```
MUST MATCH EXACTLY (case-sensitive):
- Order Number (Title Case, with space)
- customer_first_name (lowercase, underscore)
- customer_last_name (lowercase, underscore)
- customer_email (lowercase, underscore)
- customer_phone (lowercase, underscore)
- Shipping Address (Title Case, with space)
- shipping_city (lowercase, underscore)
- shipping_wilaya (lowercase, underscore)
- delivery_type (lowercase, underscore)
- notes (lowercase)
- product_name (lowercase, underscore)
- product_size (lowercase, underscore)
- subtotal (lowercase)
- shipping_fee (lowercase, underscore)
- Total (Title Case)
- status (lowercase)
```

**Quick Fix:**
Rename columns in Airtable to match the above list exactly.

---

### Issue 2: Wrong Field Types

**Symptoms:**
- Error: "INVALID_VALUE_FOR_COLUMN"
- Numbers not saving correctly

**Solution:**
In Airtable, ensure these fields are "Number" type:
- subtotal
- shipping_fee
- Total

**How to fix:**
1. Click the dropdown arrow on the column header
2. Select "Customize field type"
3. Change to "Number"
4. Set precision to 2 decimal places

---

### Issue 3: Filters Hiding Records

**Symptoms:**
- Orders appear in logs as successful
- "airtableSuccess: true" in response
- But you don't see them in Airtable

**Solution:**
1. In Airtable, look at top of the table
2. Click "Hide fields" or filter icon
3. Click "Remove all filters"
4. Make sure you're viewing "All records" view

---

### Issue 4: Wrong Table or Base

**Symptoms:**
- Everything seems successful
- No error messages
- Just can't find the orders

**Solution:**
1. Verify you're in the correct base:
   - URL should be: https://airtable.com/appHEqfWbNHzk3zft
2. Verify you're in the "Orders" table (check table name at top)
3. Check if you have multiple workspaces

---

### Issue 5: API Key Issues

**Symptoms:**
- Logs show: "Status: 401"
- Error: "AUTHENTICATION_REQUIRED"

**Solution:**
The API key is already configured in your edge function. If you see this error:
1. The key might have been revoked in Airtable
2. Get a new Personal Access Token from Airtable
3. Update it in the edge function or add as environment variable

---

## Diagnostic Flow Chart

```
Start Here
    |
    v
Place a test order
    |
    v
Check Browser Console (F12)
    |
    +-- See "Order sent to Airtable successfully!" ?
    |       |
    |       +-- YES -> Check Airtable table for new record
    |       |          |
    |       |          +-- Found it? SOLVED!
    |       |          |
    |       |          +-- Not found? -> Check filters/views
    |       |
    |       +-- NO -> Check error message
    |                 |
    |                 +-- "422" -> Field name mismatch
    |                 |            (See Issue 1)
    |                 |
    |                 +-- "401" -> API key issue
    |                 |            (See Issue 5)
    |                 |
    |                 +-- Other -> Check Supabase logs
    |
    v
Check Supabase Logs
    |
    +-- See Arabic error messages?
            |
            +-- "فشل الإرسال إلى Airtable"
            |   -> Airtable integration failed
            |   -> Check error details in logs
            |
            +-- "نجح الإرسال إلى Airtable"
                -> Success! Check Airtable filters
```

---

## Testing Checklist

After making changes, test with these steps:

- [ ] Open test-airtable-connection.html
- [ ] Open Browser Console (F12)
- [ ] Click "Send Test Order"
- [ ] Check Console for detailed logs
- [ ] Check Supabase Edge Function logs
- [ ] Check Airtable for new record
- [ ] Verify all fields are populated correctly
- [ ] Place a real order from your website
- [ ] Confirm it appears in both Supabase and Airtable

---

## Where to Look

### 1. Browser Console Logs (F12)
**What to look for:**
- "Starting order submission..."
- "بدء إرسال الطلب إلى Airtable"
- "Order sent to Airtable successfully!"
- "Airtable Record ID: recXXXXX"

**If you see errors:**
- Copy the full error message
- Check the error code (422, 401, 500)
- Look for field names mentioned in errors

### 2. Supabase Edge Function Logs
**Link:** https://supabase.com/dashboard/project/xktmwzqqlbkymlsavutn/functions

**What to look for:**
- Request received: "استقبال طلب جديد"
- Airtable submission: "بدء إرسال الطلب إلى Airtable"
- Success: "نجح الإرسال إلى Airtable!"
- Failure: "فشل الإرسال إلى Airtable"

**How to read:**
- Green = Success
- Red = Error
- Look at timestamps to find your recent order

### 3. Supabase Database
**Link:** https://supabase.com/dashboard/project/xktmwzqqlbkymlsavutn/editor

Run the SQL from `check-supabase-orders.sql` to see if orders are being saved.

**Interpretation:**
- Orders in Supabase but not Airtable = Airtable integration issue
- No orders anywhere = Frontend submission issue

### 4. Airtable
**Link:** https://airtable.com/appHEqfWbNHzk3zft

**Things to check:**
- Correct base? (URL should match)
- Correct table? ("Orders")
- Any filters active? (Look for filter icon)
- All fields showing? (Check "Hide fields")
- Viewing "All records" view?

---

## Advanced Debugging

### View Real-Time Logs

When placing a test order, keep these open simultaneously:

1. **Browser Console** (F12) - Shows frontend logs
2. **Supabase Function Logs** - Shows backend logs
3. **Airtable table** - Refresh to see new records

### Enable Verbose Logging

The edge function already has comprehensive logging. Every step is logged with markers for easy identification.

### Test with cURL

If the website isn't working, test the edge function directly:

```bash
curl -X POST 'https://xktmwzqqlbkymlsavutn.supabase.co/functions/v1/create-order' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrdG13enFxbGJreW1sc2F2dXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMzEzNTEsImV4cCI6MjA3OTYwNzM1MX0.vVxA-ajZxykRnKpahyyA99ccEvyWn_TIhV1fT_Mp4vE' \
  -H 'Content-Type: application/json' \
  -d '{
    "customer": {
      "firstName": "Test",
      "lastName": "User",
      "email": "test@test.com",
      "phone": "+213555123456",
      "address": "123 Test St",
      "city": "Algiers",
      "wilaya": "Alger",
      "deliveryType": "home"
    },
    "items": [{
      "id": "test-1",
      "name": "Test Product",
      "price": 5000,
      "quantity": 1,
      "size": "M"
    }],
    "shippingFee": 600
  }'
```

---

## Expected Successful Response

When everything works, you should see:

```json
{
  "success": true,
  "orderId": "some-uuid-here",
  "orderNumber": "FREMKYS-1733427600000",
  "airtableRecordId": "recXXXXXXXXXXXXXX",
  "airtableSuccess": true,
  "message": "تم إنشاء الطلب وإرساله إلى Airtable بنجاح"
}
```

**Key indicators:**
- `success: true` - Order created
- `airtableSuccess: true` - Sent to Airtable successfully
- `airtableRecordId` - The Airtable record ID (starts with "rec")

---

## Still Not Working?

If you've tried everything above:

1. **Check Field Names Again**
   - This is the #1 cause of issues
   - Use the exact checklist in AIRTABLE_FIELD_CHECKLIST.md
   - Names are case-sensitive and must match exactly

2. **Verify Field Types**
   - subtotal, shipping_fee, Total must be Number type
   - Not Currency, not Text, must be Number

3. **Check Airtable Base ID**
   - Should be: appHEqfWbNHzk3zft
   - Verify in your browser URL when viewing the base

4. **Check Airtable Table Name**
   - Should be: "Orders" (exact, with capital O)
   - Not "orders", not "ORDER", must be "Orders"

5. **Generate New API Key**
   - Go to: https://airtable.com/create/tokens
   - Create new token with:
     - Scope: data.records:write
     - Access: The specific base
   - Update in edge function

---

## Success Indicators

You'll know it's working when:

1. Browser console shows: "Order sent to Airtable successfully!"
2. Response includes: "airtableSuccess": true
3. Response includes: "airtableRecordId": "recXXXXXXXXXXXXXX"
4. New record appears in Airtable within seconds
5. All fields are populated correctly in Airtable

---

## Need More Help?

1. Check the comprehensive audit report: `COMPREHENSIVE_INTEGRATION_AUDIT_REPORT.md`
2. Review the Arabic summary: `AUDIT_SUMMARY_AR.md`
3. Check immediate actions: `IMMEDIATE_ACTION_REQUIRED.md`

---

**Remember:** The most common issue (90% of cases) is field name mismatch. Double-check your Airtable column names first!
