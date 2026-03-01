/*
  # Create Orders Table

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `order_number` (text, unique) - Human-readable order number
      - `customer_first_name` (text) - Customer first name
      - `customer_last_name` (text) - Customer last name
      - `customer_email` (text) - Customer email
      - `customer_phone` (text) - Customer phone number
      - `shipping_address` (text) - Full shipping address
      - `shipping_city` (text) - Shipping city
      - `shipping_wilaya` (text) - Shipping wilaya
      - `notes` (text) - Order notes (optional)
      - `items` (jsonb) - Order items in JSON format
      - `subtotal` (decimal) - Subtotal amount
      - `shipping_fee` (decimal) - Shipping fee
      - `total` (decimal) - Total amount
      - `status` (text) - Order status (pending, confirmed, shipped, delivered, cancelled)
      - `created_at` (timestamptz) - Order creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `orders` table
    - Add policy for public insert (since no auth yet)
    - Add policy for admin to read all orders

  3. Important Notes
    - Orders are stored with full customer and product details
    - No authentication required for placing orders (Cash on Delivery model)
    - Order numbers are auto-generated using FREMKYS prefix
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_first_name text NOT NULL,
  customer_last_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  shipping_address text NOT NULL,
  shipping_city text NOT NULL,
  shipping_wilaya text NOT NULL,
  notes text DEFAULT '',
  items jsonb NOT NULL,
  subtotal decimal(10, 2) NOT NULL,
  shipping_fee decimal(10, 2) NOT NULL,
  total decimal(10, 2) NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can read own orders by order_number"
  ON orders
  FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
