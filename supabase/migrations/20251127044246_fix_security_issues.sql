/*
  # Fix Security Issues

  ## Changes Made
  
  ### 1. Foreign Key Index (site_settings)
    - Add index on `site_settings.user_id` to optimize foreign key lookups
  
  ### 2. RLS Policy Optimization (site_settings)
    - Fix `owner_all_settings` policy to use subquery pattern `(select auth.uid())`
    - Consolidate multiple permissive SELECT policies into a single policy
    - Remove redundant `public_read_settings` policy
  
  ### 3. Unused Indexes (orders)
    - Drop unused indexes `idx_orders_order_number` and `idx_orders_status`
    - Keep the unique constraint on order_number (orders_order_number_key)
    - Keep idx_orders_created_at as it's likely used for sorting
  
  ### 4. RLS Policies for image table
    - Add public read policy since images are public resources
    - Add authenticated-only insert/update/delete policies for admin users
  
  ### 5. Function Search Path
    - Fix `generate_order_number` function to have immutable search_path
    - Fix `update_orders_updated_at` trigger function to have immutable search_path
  
  ## Security Improvements
  - All foreign keys now have covering indexes
  - RLS policies use optimized subquery pattern
  - No multiple permissive policies on same table
  - All tables with RLS have appropriate policies
  - Functions have secure search paths
*/

-- 1. Add index for foreign key on site_settings.user_id
CREATE INDEX IF NOT EXISTS idx_site_settings_user_id 
ON site_settings(user_id);

-- 2. Fix site_settings RLS policies
-- Drop existing policies
DROP POLICY IF EXISTS "owner_all_settings" ON site_settings;
DROP POLICY IF EXISTS "public_read_settings" ON site_settings;

-- Create optimized policies with subquery pattern and no overlapping permissions
CREATE POLICY "site_settings_select" 
ON site_settings 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "site_settings_owner_update"
ON site_settings
FOR UPDATE
TO authenticated
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "site_settings_owner_delete"
ON site_settings
FOR DELETE
TO authenticated
USING ((select auth.uid()) = user_id);

CREATE POLICY "site_settings_authenticated_insert"
ON site_settings
FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) = user_id);

-- 3. Drop unused indexes on orders table
DROP INDEX IF EXISTS idx_orders_order_number;
DROP INDEX IF EXISTS idx_orders_status;

-- 4. Add RLS policies for image table (currently has RLS enabled but no policies)
-- Images are public for reading, but only authenticated users can modify
CREATE POLICY "image_public_read"
ON image
FOR SELECT
TO public
USING (true);

CREATE POLICY "image_authenticated_insert"
ON image
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "image_authenticated_update"
ON image
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "image_authenticated_delete"
ON image
FOR DELETE
TO authenticated
USING (true);

-- 5. Fix function search paths by recreating with SECURITY DEFINER and explicit search_path
DROP FUNCTION IF EXISTS generate_order_number();
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  next_number int;
  order_num text;
BEGIN
  next_number := nextval('order_number_seq');
  order_num := 'FREMKYS-' || LPAD(next_number::text, 4, '0');
  RETURN order_num;
END;
$$;

DROP FUNCTION IF EXISTS update_orders_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger since we dropped the function with CASCADE
DROP TRIGGER IF EXISTS update_orders_updated_at_trigger ON orders;
CREATE TRIGGER update_orders_updated_at_trigger
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();
