# Project Structure - FREMKYS Order System

## Directory Tree

```
FREMKYS/
│
├── supabase/
│   ├── create-order/                    (OLD - Backup)
│   │   └── index.ts                     Legacy edge function
│   │
│   └── functions/
│       └── airtable-sync-orders/        (NEW - Active)
│           └── index.ts                 Main order processing function
│
├── src/
│   ├── components/
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── MiniCart.tsx
│   │   ├── ProductCard.tsx
│   │   ├── SearchPanel.tsx
│   │   └── FavoritesPanel.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useFavorites.ts
│   │   ├── useProducts.ts
│   │   └── useHeroImages.ts
│   │
│   ├── pages/
│   │   ├── About.tsx
│   │   ├── Admin.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── Checkout.tsx              ⭐ UPDATED - Uses new endpoint
│   │   ├── Contact.tsx
│   │   ├── FAQ.tsx
│   │   ├── Home.tsx
│   │   ├── OrderConfirmation.tsx
│   │   ├── Privacy.tsx
│   │   ├── Product.tsx
│   │   ├── Shop.tsx
│   │   ├── Terms.tsx
│   │   └── Track.tsx
│   │
│   ├── utils/
│   │   ├── airtable.ts                (Deprecated)
│   │   └── shippingPrices.ts
│   │
│   ├── lib/
│   │   └── supabase.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── Documentation/                       📚 NEW FILES
│   ├── AIRTABLE_FIELDS_MAPPING.md      Complete field reference (English)
│   ├── QUICK_START_GUIDE_AR.md         Quick guide (Arabic)
│   ├── UPDATE_SUMMARY.md               Overview of changes
│   ├── DEPLOYMENT_CHECKLIST.md         Deployment checklist
│   └── PROJECT_STRUCTURE.md            This file
│
├── Legacy Documentation/
│   ├── AUDIT_SUMMARY_AR.md
│   ├── AIRTABLE_FIELD_CHECKLIST.md
│   ├── AIRTABLE_IMPLEMENTATION_SUMMARY.md
│   ├── AIRTABLE_TESTING_GUIDE.md
│   ├── CHECKOUT_UPDATE_SUMMARY.md
│   ├── COMPREHENSIVE_INTEGRATION_AUDIT_REPORT.md
│   ├── IMMEDIATE_ACTION_REQUIRED.md
│   ├── QUICK_TEST_GUIDE.md
│   ├── TROUBLESHOOTING_GUIDE.md
│   └── check-supabase-orders.sql
│
├── Configuration/
│   ├── .env                            Environment variables
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── eslint.config.js
│
└── Public/
    └── index.html
```

---

## Key Files Explained

### Active Components

#### 1. Edge Function (Server-Side)
**Location**: `supabase/functions/airtable-sync-orders/index.ts`

**Purpose**:
- Receives order data from frontend
- Validates and processes order
- Sends to Airtable (with retry mechanism)
- Saves to Supabase database
- Returns confirmation

**Key Features**:
- Complete field mapping
- JSON Items field
- Error handling with retry
- 15-second timeout
- Graceful degradation

**Flow**:
```
Frontend → Edge Function → Airtable + Supabase → Response
```

#### 2. Checkout Component (Client-Side)
**Location**: `src/pages/Checkout.tsx`

**Purpose**:
- Collects customer information
- Validates input (phone, email)
- Calculates shipping fees
- Submits order to Edge Function
- Shows confirmation

**Key Updates**:
- Uses new endpoint: `/functions/v1/airtable-sync-orders`
- Enhanced validation
- Better error messages
- Loading states

#### 3. Documentation Files

##### AIRTABLE_FIELDS_MAPPING.md
**Audience**: Developers
**Content**:
- Complete field list
- Data types
- Request/response formats
- Testing procedures
- Troubleshooting

##### QUICK_START_GUIDE_AR.md
**Audience**: Arabic-speaking team members
**Content**:
- Setup instructions
- Field checklist
- Testing guide
- Common errors
- FAQ

##### DEPLOYMENT_CHECKLIST.md
**Audience**: DevOps/Deployment team
**Content**:
- Pre-deployment checks
- Step-by-step deployment
- Testing procedures
- Rollback plan
- Sign-off forms

---

## Data Flow Diagram

### Complete Order Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│                                                                 │
│  Cart Items → Checkout Form → Validation → Submit              │
│                                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    Frontend Processing
                    - Collect form data
                    - Validate phone/email
                    - Calculate totals
                    - Prepare payload
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EDGE FUNCTION                                │
│              (airtable-sync-orders)                             │
│                                                                 │
│  1. Receive request                                             │
│  2. Validate data                                               │
│  3. Generate order number                                       │
│  4. Calculate totals                                            │
│  5. Format product details                                      │
│                                                                 │
└───────────────┬─────────────────────────────┬───────────────────┘
                │                             │
                ▼                             ▼
    ┌───────────────────────┐   ┌───────────────────────┐
    │    AIRTABLE API       │   │   SUPABASE DATABASE   │
    │                       │   │                       │
    │  - Order Number       │   │  - orders table       │
    │  - Customer Info      │   │  - Full details       │
    │  - Items (JSON)       │   │  - Timestamps         │
    │  - Product Details    │   │                       │
    │  - Amounts            │   │                       │
    │  - Status             │   │                       │
    │                       │   │                       │
    │  Auto-generated:      │   │                       │
    │  - ID                 │   │                       │
    │  - Full Customer Name │   │                       │
    │  - Timestamps         │   │                       │
    │                       │   │                       │
    └───────────┬───────────┘   └───────────┬───────────┘
                │                           │
                │         Success           │
                └────────────┬──────────────┘
                             │
                             ▼
                    Response Generated
                    - orderId
                    - orderNumber
                    - airtableRecordId
                    - airtableSuccess
                    - message
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                               │
│                                                                 │
│  Show Confirmation → Clear Cart → Redirect to Thank You        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Field Mapping Overview

### From Frontend to Edge Function

```javascript
Frontend Payload:
{
  customer: {
    firstName: "Ahmed",
    lastName: "Benzaid",
    email: "ahmed@example.com",
    phone: "+213 555 123 456",
    address: "123 Rue de la Paix",
    city: "Algiers",
    wilaya: "Alger",
    deliveryType: "توصيل منزلي",
    notes: "Handle with care"
  },
  items: [
    {
      id: "product-1",
      name: "Long Coat Bordeaux",
      price: 5000,
      quantity: 2,
      image: "https://...",
      size: "M"
    }
  ],
  shippingFee: 600
}
```

### From Edge Function to Airtable

```javascript
Airtable Payload:
{
  fields: {
    "Order Number": "FREMKYS-1733427600000",
    "customer_first_name": "Ahmed",
    "customer_last_name": "Benzaid",
    "customer_email": "ahmed@example.com",
    "customer_phone": "+213 555 123 456",
    "Shipping Address": "123 Rue de la Paix",
    "shipping_city": "Algiers",
    "shipping_wilaya": "Alger",
    "delivery_type": "توصيل منزلي",
    "notes": "Handle with care",
    "Items": "[{\"id\":\"product-1\",\"name\":\"Long Coat Bordeaux\",...}]",
    "product_name": "Long Coat Bordeaux (x2)",
    "product_size": "M (x2)",
    "subtotal": 10000,
    "shipping_fee": 600,
    "Total": 10600,
    "status": "طلب جديد"
  }
}
```

### Airtable Auto-Generated Fields

```
Not sent in payload (calculated by Airtable):
- ID: 123 (auto-number)
- Full Customer Name: "Ahmed Benzaid" (formula)
- Created At: 2025-12-05 10:30:00 (timestamp)
- Updated At: 2025-12-05 10:30:00 (timestamp)
- Confirmation Date: [calculated based on your formula]
```

---

## Environment Setup

### Required Variables

#### In Supabase Edge Functions
```bash
AIRTABLE_API_KEY=patO4zErdHJF4rokY...
AIRTABLE_BASE_ID=appHEqfWbNHzk3zft
AIRTABLE_TABLE_NAME=Orders
```

#### In Frontend (.env)
```bash
VITE_SUPABASE_URL=https://xktmwzqqlbkymlsavutn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## API Endpoints

### Active Endpoint
```
POST /functions/v1/airtable-sync-orders
```

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {SUPABASE_ANON_KEY}"
}
```

**Response**:
```json
{
  "success": true,
  "orderId": "uuid",
  "orderNumber": "FREMKYS-xxx",
  "airtableRecordId": "recXXX",
  "airtableSuccess": true,
  "message": "Order created successfully"
}
```

---

## Testing Locations

### 1. Browser Console (F12)
- Frontend validation
- Request payload
- Response data
- Error messages

### 2. Supabase Dashboard
**Edge Functions → airtable-sync-orders → Logs**
- Server-side processing
- Airtable API calls
- Database operations
- Error details

### 3. Airtable
**https://airtable.com/appHEqfWbNHzk3zft**
- Order records
- Field population
- Calculated fields
- Timestamps

### 4. Supabase Database
**Table Editor → orders**
- Database records
- Data integrity
- Timestamps

---

## Version History

### v2.0 (Current - 2025-12-05)
- New Edge Function: airtable-sync-orders
- Complete field mapping
- JSON Items field
- Enhanced documentation
- Updated frontend

### v1.0 (Previous)
- Basic order creation
- Partial Airtable sync
- create-order function
- Limited documentation

---

## Quick Reference

### Important URLs

| Resource | URL |
|----------|-----|
| Airtable Base | https://airtable.com/appHEqfWbNHzk3zft |
| Supabase Dashboard | https://supabase.com/dashboard/project/xktmwzqqlbkymlsavutn |
| Edge Functions | https://supabase.com/dashboard/project/xktmwzqqlbkymlsavutn/functions |
| Table Editor | https://supabase.com/dashboard/project/xktmwzqqlbkymlsavutn/editor |

### Documentation Files Priority

1. **DEPLOYMENT_CHECKLIST.md** - Start here for deployment
2. **QUICK_START_GUIDE_AR.md** - Quick setup (Arabic)
3. **AIRTABLE_FIELDS_MAPPING.md** - Complete reference (English)
4. **UPDATE_SUMMARY.md** - Overview of changes
5. **PROJECT_STRUCTURE.md** - This file

---

## Support & Maintenance

### Regular Tasks
- Check Edge Function logs daily (first week)
- Monitor Airtable API usage
- Review error patterns
- Verify field population

### Monthly Tasks
- Review and update documentation
- Check for Airtable API changes
- Optimize performance
- Plan enhancements

---

**Version**: 2.0
**Last Updated**: 2025-12-05
**Status**: Production Ready
**Maintained By**: Development Team
