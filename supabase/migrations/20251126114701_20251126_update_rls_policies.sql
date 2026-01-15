/*
  # Update RLS Policies for Better Access

  1. Security Changes
    - Ensure public read access to products
    - Ensure public access to hero images
  2. Important Notes
    - Products and hero images are public data
    - Orders are manageable by all (for guest checkout)
*/

-- Products: Ensure public read access
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
CREATE POLICY "Products are readable by everyone"
  ON products FOR SELECT
  TO public
  USING (true);

-- Hero images: Ensure public read access
DROP POLICY IF EXISTS "Enable read access for all users" ON hero_images;
CREATE POLICY "Hero images are readable by everyone"
  ON hero_images FOR SELECT
  TO public
  USING (true);
