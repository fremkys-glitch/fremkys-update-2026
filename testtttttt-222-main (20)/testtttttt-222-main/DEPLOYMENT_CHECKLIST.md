# Deployment Checklist - Airtable Integration v2.0

## Pre-Deployment Checks

### 1. Airtable Column Verification
- [ ] Open Airtable base: https://airtable.com/appHEqfWbNHzk3zft
- [ ] Go to "Orders" table
- [ ] Verify each column name matches EXACTLY (case-sensitive):

#### Text Columns
- [ ] `Order Number` (Title Case with space)
- [ ] `customer_first_name` (lowercase with underscore)
- [ ] `customer_last_name` (lowercase with underscore)
- [ ] `customer_email` (lowercase with underscore)
- [ ] `customer_phone` (lowercase with underscore)
- [ ] `Shipping Address` (Title Case with space)
- [ ] `shipping_city` (lowercase with underscore)
- [ ] `shipping_wilaya` (lowercase with underscore)
- [ ] `delivery_type` (lowercase with underscore)
- [ ] `notes` (lowercase)
- [ ] `Items` (Title Case - type: Long text)
- [ ] `product_name` (lowercase with underscore)
- [ ] `product_size` (lowercase with underscore)
- [ ] `status` (lowercase)

#### Number Columns
- [ ] `subtotal` (type: Number, precision: 2)
- [ ] `shipping_fee` (type: Number, precision: 2)
- [ ] `Total` (type: Number, precision: 2)

#### Auto-Generated Columns (Don't modify)
- [ ] `ID` (Auto number)
- [ ] `Full Customer Name` (Formula field)
- [ ] `Created At` (Created time)
- [ ] `Updated At` (Last modified time)
- [ ] `Confirmation Date` (Formula/Date field)

### 2. Environment Variables Setup
- [ ] Go to Supabase Dashboard: https://supabase.com/dashboard/project/xktmwzqqlbkymlsavutn
- [ ] Navigate to: Edge Functions → Settings → Secrets
- [ ] Add the following variables:

```bash
AIRTABLE_API_KEY=patO4zErdHJF4rokY.4f661e6545ddf1a26ad7d93933881edfcf71476fe710263c4d034398d87e05e2
AIRTABLE_BASE_ID=appHEqfWbNHzk3zft
AIRTABLE_TABLE_NAME=Orders
```

- [ ] Save all variables
- [ ] Verify they are saved correctly

### 3. Code Review
- [ ] New Edge Function exists: `supabase/functions/airtable-sync-orders/index.ts`
- [ ] Checkout page updated: `src/pages/Checkout.tsx` uses `/functions/v1/airtable-sync-orders`
- [ ] Build completed successfully: `npm run build` passed
- [ ] No TypeScript errors
- [ ] No linting errors

### 4. Documentation Review
- [ ] `AIRTABLE_FIELDS_MAPPING.md` created and complete
- [ ] `QUICK_START_GUIDE_AR.md` created and complete
- [ ] `UPDATE_SUMMARY.md` created and complete
- [ ] `DEPLOYMENT_CHECKLIST.md` (this file) created

---

## Deployment Steps

### Step 1: Deploy Edge Function
- [ ] Go to Supabase Dashboard → Edge Functions
- [ ] Deploy `airtable-sync-orders` function
- [ ] Wait for deployment to complete
- [ ] Verify function appears in list
- [ ] Check function status is "Active"

### Step 2: Test Edge Function
- [ ] Go to Edge Functions → airtable-sync-orders
- [ ] Click "Invoke" or "Test"
- [ ] Send a test payload
- [ ] Verify response is successful
- [ ] Check logs for any errors

### Step 3: Frontend Deployment
- [ ] Build frontend: `npm run build`
- [ ] Verify build succeeds
- [ ] Deploy to production
- [ ] Clear browser cache
- [ ] Hard refresh (Ctrl+Shift+R)

---

## Post-Deployment Testing

### Test 1: Basic Order Submission
- [ ] Open website in browser
- [ ] Open Developer Tools (F12) → Console tab
- [ ] Add a product to cart
- [ ] Go to checkout
- [ ] Fill in test data:
  - First Name: Test
  - Last Name: User
  - Email: test@example.com
  - Phone: 0555123456
  - Address: 123 Test Street
  - City: Algiers
  - Wilaya: Alger
  - Delivery Type: Home
  - Notes: Test order
- [ ] Complete the order
- [ ] Verify console shows success messages
- [ ] Note the order number

### Test 2: Verify in Airtable
- [ ] Go to Airtable: https://airtable.com/appHEqfWbNHzk3zft
- [ ] Open Orders table
- [ ] Find the test order by order number
- [ ] Verify all fields are populated:
  - [ ] Order Number
  - [ ] customer_first_name = "Test"
  - [ ] customer_last_name = "User"
  - [ ] customer_email = "test@example.com"
  - [ ] customer_phone = "0555123456"
  - [ ] Shipping Address = "123 Test Street"
  - [ ] shipping_city = "Algiers"
  - [ ] shipping_wilaya = "Alger"
  - [ ] delivery_type = "توصيل منزلي"
  - [ ] notes = "Test order"
  - [ ] Items (contains JSON array)
  - [ ] product_name (formatted string)
  - [ ] product_size (formatted string)
  - [ ] subtotal (number)
  - [ ] shipping_fee (number)
  - [ ] Total (number)
  - [ ] status = "طلب جديد"
  - [ ] ID (auto-generated number)
  - [ ] Full Customer Name = "Test User"
  - [ ] Created At (timestamp)
  - [ ] Updated At (timestamp)

### Test 3: Verify in Supabase
- [ ] Go to Supabase Dashboard → Table Editor
- [ ] Open "orders" table
- [ ] Find the test order
- [ ] Verify fields:
  - [ ] order_number
  - [ ] customer_first_name
  - [ ] customer_last_name
  - [ ] customer_email
  - [ ] customer_phone
  - [ ] shipping_address
  - [ ] shipping_city
  - [ ] shipping_wilaya
  - [ ] delivery_type
  - [ ] notes
  - [ ] status
  - [ ] created_at

### Test 4: Edge Function Logs
- [ ] Go to Supabase Dashboard → Edge Functions
- [ ] Click on "airtable-sync-orders"
- [ ] Go to "Logs" tab
- [ ] Verify you see:
  - [ ] "New order request received"
  - [ ] "Order data received from frontend"
  - [ ] Customer details logged
  - [ ] "Sending order to Airtable..."
  - [ ] "Successfully sent to Airtable"
  - [ ] "Airtable Record ID: recXXX"
  - [ ] "Saving order to Supabase database..."
  - [ ] "Order saved to Supabase successfully"
  - [ ] "Order created successfully!"

### Test 5: Error Handling
Test with invalid data to ensure proper error messages:

#### Test 5a: Invalid Phone Number
- [ ] Add product to cart
- [ ] Go to checkout
- [ ] Enter invalid phone: "123"
- [ ] Try to proceed
- [ ] Verify error message appears: "رقم الهاتف غير صحيح"

#### Test 5b: Invalid Email
- [ ] Enter invalid email: "not-an-email"
- [ ] Try to proceed
- [ ] Verify error message appears: "البريد الإلكتروني غير صحيح"

#### Test 5c: Empty Cart
- [ ] Clear cart
- [ ] Try to access checkout
- [ ] Verify message: "سلة التسوق فارغة"

### Test 6: Items Field Validation
- [ ] Place an order with multiple products
- [ ] Check Airtable Items field
- [ ] Copy the JSON content
- [ ] Paste into a JSON validator (e.g., jsonlint.com)
- [ ] Verify it's valid JSON
- [ ] Verify it contains all product details:
  - [ ] id
  - [ ] name
  - [ ] price
  - [ ] quantity
  - [ ] image
  - [ ] size

---

## Performance Checks

### Response Time
- [ ] Order submission completes in < 3 seconds
- [ ] Airtable sync completes in < 2 seconds
- [ ] Database save completes in < 1 second

### Load Test (Optional)
- [ ] Submit 5 orders in quick succession
- [ ] Verify all appear in Airtable
- [ ] Verify all appear in Supabase
- [ ] Check for any errors in logs

---

## Monitoring Setup

### Daily Checks (First Week)
- [ ] Check Edge Function logs for errors
- [ ] Verify orders are appearing in Airtable
- [ ] Verify orders are appearing in Supabase
- [ ] Check for any field mapping issues

### Weekly Checks (Ongoing)
- [ ] Review error rate
- [ ] Check for any failed Airtable syncs
- [ ] Verify all fields are being populated correctly
- [ ] Monitor performance metrics

---

## Rollback Plan

If critical issues are found:

### Step 1: Immediate Rollback
- [ ] Update `src/pages/Checkout.tsx`
- [ ] Change endpoint back to: `/functions/v1/create-order`
- [ ] Rebuild and redeploy frontend
- [ ] Test order submission works

### Step 2: Investigate
- [ ] Review Edge Function logs
- [ ] Check Airtable API status
- [ ] Verify field names
- [ ] Check environment variables

### Step 3: Fix and Re-deploy
- [ ] Fix identified issues
- [ ] Test locally if possible
- [ ] Redeploy Edge Function
- [ ] Switch frontend back to new endpoint
- [ ] Test thoroughly

---

## Success Criteria

All items below must be checked before considering deployment successful:

### Core Functionality
- [ ] Orders submit successfully from frontend
- [ ] Orders appear in Airtable with all fields
- [ ] Orders appear in Supabase database
- [ ] Items field contains valid JSON
- [ ] Calculated fields work in Airtable (Full Customer Name, etc.)
- [ ] Timestamps are set correctly

### Error Handling
- [ ] Invalid phone number is rejected with clear message
- [ ] Invalid email is rejected with clear message
- [ ] Empty cart prevents checkout
- [ ] Network errors are handled gracefully
- [ ] Failed Airtable sync still saves to Supabase

### Performance
- [ ] Order submission completes in < 3 seconds
- [ ] No timeout errors
- [ ] Retry mechanism works for transient failures

### Documentation
- [ ] All documentation files are complete
- [ ] Team members can follow deployment guide
- [ ] Troubleshooting guide is accurate

---

## Known Issues / Limitations

Document any known issues here:

- [ ] None identified during initial deployment
- [ ] (Add any issues discovered during testing)

---

## Contact Information

### For Technical Issues
- Edge Function: airtable-sync-orders
- Airtable Base: https://airtable.com/appHEqfWbNHzk3zft
- Supabase Project: xktmwzqqlbkymlsavutn

### For Business Logic Questions
- Review: `AIRTABLE_FIELDS_MAPPING.md`
- Quick Guide: `QUICK_START_GUIDE_AR.md`
- Summary: `UPDATE_SUMMARY.md`

---

## Sign-off

### Deployment Completed By
- [ ] Name: ________________
- [ ] Date: ________________
- [ ] Time: ________________

### Testing Completed By
- [ ] Name: ________________
- [ ] Date: ________________
- [ ] Time: ________________

### Production Approved By
- [ ] Name: ________________
- [ ] Date: ________________
- [ ] Time: ________________

---

## Notes

Add any additional notes or observations here:

```
[Space for notes]
```

---

**Version**: 2.0
**Last Updated**: 2025-12-05
**Status**: Ready for Deployment

---

## Next Steps After Successful Deployment

1. Monitor for 24 hours
2. Review all orders in Airtable
3. Check for any field mapping issues
4. Gather user feedback
5. Plan for phase 2 enhancements (email notifications, etc.)

**Good luck with the deployment!**
