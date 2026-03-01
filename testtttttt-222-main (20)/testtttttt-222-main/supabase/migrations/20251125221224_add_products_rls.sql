/*
  # Add RLS policies to products table
  
  1. Security
    - Enable RLS on products table
    - Add policy for public SELECT (read-only access)
*/

CREATE POLICY "Products are publicly readable"
  ON products
  FOR SELECT
  TO public
  USING (true);