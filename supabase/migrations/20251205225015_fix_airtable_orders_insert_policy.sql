/*
  # Fix Insert Policy for Airtable Orders

  Allow anonymous users to insert orders from the frontend
*/

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Allow service role to insert orders" ON airtable_orders;

-- Create new policy that allows anyone to insert orders
CREATE POLICY "Allow public to insert orders"
  ON airtable_orders
  FOR INSERT
  TO public
  WITH CHECK (true);
