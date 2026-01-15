# Airtable Integration Testing Guide

## Overview
The order submission now integrates with Airtable using the correct API endpoint and field mappings.

## Configuration

### Airtable Settings
- **API Endpoint:** `https://api.airtable.com/v0/{BASE_ID}/{TABLE_NAME}`
- **Base ID:** `appHEqfWbNHzk3zft`
- **Table Name:** `Orders`
- **API Key:** Configured in edge function

### Field Mapping
The following fields are sent to Airtable (must match your Airtable column names exactly):

| Field Name | Type | Description |
|------------|------|-------------|
| customer_first_name | String | Customer's first name |
| customer_last_name | String | Customer's last name |
| customer_email | String | Customer's email address |
| customer_phone | String | Customer's phone number |
| shipping_address | String | Shipping address |
| shipping_city | String | City name |
| shipping_wilaya | String | Wilaya/State |
| delivery_type | String | Delivery method (home/office) |
| product_name | String | Product name(s) |
| product_size | String | Product size(s) |
| notes | String | Order notes |
| subtotal | Number | Subtotal amount |
| shipping_fee | Number | Shipping cost |
| status | String | Order status |

## Testing Steps

### 1. Verify Airtable Table Structure
Before testing, ensure your Airtable table has these exact column names:
- `customer_first_name`
- `customer_last_name`
- `customer_email`
- `customer_phone`
- `shipping_address`
- `shipping_city`
- `shipping_wilaya`
- `delivery_type`
- `product_name`
- `product_size`
- `notes`
- `subtotal` (Number type)
- `shipping_fee` (Number type)
- `status`

### 2. Test Order Submission

1. Open your application
2. Add a product to cart
3. Go to checkout
4. Fill in all required fields:
   - First Name
   - Last Name
   - Phone
   - Address
   - City
   - Wilaya
   - Delivery Type
5. Complete the order

### 3. Check Console Logs

Open Browser Console (F12) and look for these logs:

**Success Indicators:**
```
🔄 Starting Airtable submission...
📦 Order data received: {...}
🌐 Airtable URL: https://api.airtable.com/v0/appHEqfWbNHzk3zft/Orders
📤 Payload being sent: {...}
📥 Response status: 200
✅ Successfully sent order to Airtable!
✅ Airtable record ID: recXXXXXXXXXXXXXX
```

**Error Indicators:**
```
❌ Airtable API error: 422 {...}
❌ Error details: {...}
```

### 4. Verify in Airtable

1. Open your Airtable base: https://airtable.com/appHEqfWbNHzk3zft
2. Check the Orders table
3. Verify the new record appears with all fields populated correctly

## Common Issues & Solutions

### Issue: Field names don't match
**Error:** `UNKNOWN_FIELD_NAME`
**Solution:** Verify that your Airtable column names match EXACTLY (case-sensitive):
- Use underscores, not spaces
- All lowercase
- Example: `customer_first_name` NOT `Customer First Name`

### Issue: Invalid API key
**Error:** `AUTHENTICATION_REQUIRED`
**Solution:** Verify the API key is correct in the edge function

### Issue: CORS errors
**Error:** Cross-origin request blocked
**Solution:** Check that CORS headers are properly set in the edge function (already configured)

### Issue: Wrong data types
**Error:** `INVALID_VALUE_FOR_COLUMN`
**Solution:**
- Ensure `subtotal` and `shipping_fee` columns are Number type in Airtable
- All other fields should be Single line text or Long text

## Debugging Checklist

- [ ] API URL is `https://api.airtable.com/v0/appHEqfWbNHzk3zft/Orders`
- [ ] Authorization header includes `Bearer {API_KEY}`
- [ ] Field names match Airtable columns exactly
- [ ] Console shows request payload and response
- [ ] No CORS errors in console
- [ ] Airtable columns have correct data types
- [ ] API key has write permissions to the table

## Advanced Testing

### Test with cURL
```bash
curl -X POST 'https://xktmwzqqlbkymlsavutn.supabase.co/functions/v1/create-order' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "customer": {
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "phone": "+213 555 123 456",
      "address": "123 Test Street",
      "city": "Algiers",
      "wilaya": "Alger",
      "deliveryType": "home",
      "notes": "Test order"
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

### Monitor Edge Function Logs
View logs in Supabase Dashboard:
1. Go to https://supabase.com/dashboard/project/xktmwzqqlbkymlsavutn/functions
2. Click on `create-order` function
3. View the Logs tab
4. Look for the emoji-marked log entries for easy tracking

## Response Format

### Success Response
```json
{
  "success": true,
  "orderId": "123",
  "orderNumber": "FREMKYS-1234567890",
  "airtableRecordId": "recXXXXXXXXXXXXXX",
  "airtableSuccess": true,
  "message": "تم إنشاء الطلب بنجاح"
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

## Support

If you continue to have issues:

1. Check the field names in your Airtable table
2. Verify the API key has write permissions
3. Check the edge function logs in Supabase
4. Review the browser console for detailed error messages
5. Ensure the Airtable base ID and table name are correct

## Notes

- Orders are sent to BOTH Supabase database AND Airtable
- If Airtable submission fails, the order still saves to Supabase
- The response includes both database and Airtable success status
- All logs use emoji markers for easy identification
