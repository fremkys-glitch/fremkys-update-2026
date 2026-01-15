# Airtable Field Name Verification Checklist

## CRITICAL: Your Airtable column names MUST match these EXACTLY (case-sensitive):

Go to: https://airtable.com/appHEqfWbNHzk3zft

Check each column name in your "Orders" table:

### Required Field Names:

| Your Airtable Column Name | Required Type | Notes |
|---------------------------|---------------|-------|
| Order Number | Single line text | MUST be "Order Number" (Title Case) |
| customer_first_name | Single line text | MUST be lowercase with underscore |
| customer_last_name | Single line text | MUST be lowercase with underscore |
| customer_email | Single line text or Email | MUST be lowercase with underscore |
| customer_phone | Single line text or Phone | MUST be lowercase with underscore |
| Shipping Address | Long text | MUST be "Shipping Address" (Title Case) |
| shipping_city | Single line text | MUST be lowercase with underscore |
| shipping_wilaya | Single line text | MUST be lowercase with underscore |
| delivery_type | Single line text | MUST be lowercase with underscore |
| notes | Long text | MUST be lowercase |
| product_name | Long text | MUST be lowercase with underscore |
| product_size | Single line text | MUST be lowercase with underscore |
| subtotal | **Number** | CRITICAL: Must be Number type |
| shipping_fee | **Number** | CRITICAL: Must be Number type |
| Total | **Number** | MUST be "Total" (Title Case) |
| status | Single line text | MUST be lowercase |

## Common Mistakes:

1. **Using spaces instead of underscores**: "customer first name" instead of "customer_first_name"
2. **Wrong capitalization**: "Customer_First_Name" instead of "customer_first_name"
3. **Wrong field types**: Using "Currency" or "Text" instead of "Number" for price fields
4. **Extra fields**: Having Formula or AI fields is OK, but don't rename the above fields

## Quick Fix:

If your column names are different:
1. **Option A (Easier)**: Rename columns in Airtable to match the list above
2. **Option B**: Modify the edge function code (lines 64-79) to match your column names

## Testing:

After fixing column names, place a test order and check Supabase logs immediately.
