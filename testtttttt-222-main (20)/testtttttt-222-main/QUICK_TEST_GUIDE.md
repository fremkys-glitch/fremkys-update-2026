# Quick Test Guide - Airtable Integration

## Before Testing

### 1. Verify Airtable Table Columns
Your Airtable "Orders" table MUST have these exact column names:

```
✓ customer_first_name
✓ customer_last_name
✓ customer_email
✓ customer_phone
✓ shipping_address
✓ shipping_city
✓ shipping_wilaya
✓ delivery_type
✓ product_name
✓ product_size
✓ notes
✓ subtotal (Number type)
✓ shipping_fee (Number type)
✓ status
```

**IMPORTANT:** Names are case-sensitive and must use underscores, not spaces!

## Test Process

### Step 1: Open Browser Console
Press `F12` to open Developer Tools

### Step 2: Place Test Order
1. Add a product to cart
2. Go to checkout
3. Fill in these test details:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com`
   - Phone: `+213 555 123 456`
   - Address: `123 Test Street`
   - City: `Algiers`
   - Wilaya: `Alger`
   - Delivery Type: `home`
   - Notes: `Test order for Airtable`
4. Complete the order

### Step 3: Check Console Logs
Look for these messages:

**SUCCESS Pattern:**
```
🔄 Starting Airtable submission...
🌐 Airtable URL: https://api.airtable.com/v0/appHEqfWbNHzk3zft/Orders
📤 Payload being sent: {...}
📥 Response status: 200
✅ Successfully sent order to Airtable!
✅ Airtable record ID: recXXXXXXXXXXXXXX
```

**ERROR Pattern:**
```
❌ Airtable API error: 422
❌ Error details: {...}
```

### Step 4: Verify in Airtable
1. Go to https://airtable.com/appHEqfWbNHzk3zft
2. Open the "Orders" table
3. Check if the new record appears

## Common Errors & Quick Fixes

### Error: UNKNOWN_FIELD_NAME
**Cause:** Column name mismatch
**Fix:** Check that your Airtable column is named exactly: `customer_first_name` (not "Customer First Name" or "customerfirstname")

### Error: INVALID_VALUE_FOR_COLUMN
**Cause:** Wrong data type
**Fix:** Ensure `subtotal` and `shipping_fee` columns are set to "Number" type in Airtable

### Error: AUTHENTICATION_REQUIRED
**Cause:** API key issue
**Fix:** API key is already configured correctly in the edge function

### Error: 404 Not Found
**Cause:** Wrong base ID or table name
**Fix:** Base ID `appHEqfWbNHzk3zft` and table name `Orders` are correct

## Success Checklist

- [ ] Console shows 🔄 Starting Airtable submission
- [ ] Console shows 🌐 Airtable URL with correct endpoint
- [ ] Console shows 📤 Payload with all order data
- [ ] Console shows 📥 Response status: 200
- [ ] Console shows ✅ Successfully sent order to Airtable
- [ ] Console shows ✅ Airtable record ID
- [ ] New record appears in Airtable Orders table
- [ ] All fields are populated correctly in Airtable

## Debug Commands

### Check Edge Function Logs
View real-time logs:
1. Go to: https://supabase.com/dashboard/project/xktmwzqqlbkymlsavutn/functions
2. Click "create-order"
3. Click "Logs" tab
4. Look for the emoji markers

### Test with cURL (Advanced)
```bash
curl -X POST 'https://xktmwzqqlbkymlsavutn.supabase.co/functions/v1/create-order' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrdG13enFxbGJreW1sc2F2dXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMzEzNTEsImV4cCI6MjA3OTYwNzM1MX0.vVxA-ajZxykRnKpahyyA99ccEvyWn_TIhV1fT_Mp4vE' \
  -H 'Content-Type: application/json' \
  -d '{
    "customer": {
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "phone": "+213555123456",
      "address": "123 Test Street",
      "city": "Algiers",
      "wilaya": "Alger",
      "deliveryType": "home",
      "notes": "cURL test"
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

## Expected Response Format

```json
{
  "success": true,
  "orderId": "123",
  "orderNumber": "FREMKYS-1702834567890",
  "airtableRecordId": "recXXXXXXXXXXXXXX",
  "airtableSuccess": true,
  "message": "تم إنشاء الطلب بنجاح"
}
```

## If Everything Fails

1. **Check Airtable column names** - Most common issue!
2. **Verify API key permissions** - Should have write access
3. **Check base and table IDs** - Must be exact
4. **Review console for detailed errors** - Error messages are descriptive
5. **Check edge function logs** - Shows server-side errors

## Contact Info

**Airtable Base:** https://airtable.com/appHEqfWbNHzk3zft
**Edge Function:** https://xktmwzqqlbkymlsavutn.supabase.co/functions/v1/create-order

## What Was Fixed

1. ✅ Using correct API endpoint: `api.airtable.com`
2. ✅ Exact field names matching your specification
3. ✅ Simplified payload structure
4. ✅ Comprehensive logging with emojis
5. ✅ Better error handling and messages
6. ✅ Success/failure tracking
7. ✅ Response includes Airtable record ID

## Test Now!

Open your application and place a test order. Watch the console logs as the magic happens!
