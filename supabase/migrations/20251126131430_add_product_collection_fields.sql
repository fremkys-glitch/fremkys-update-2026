/*
  # Add collection type fields to products table

  1. New Columns
    - `is_best_seller` (boolean) - Mark products as best sellers
    - `is_limited_edition` (boolean) - Mark products as limited edition
    - `is_new` (boolean) - Mark products as new arrivals
  
  2. Changes
    - Adding three new boolean columns to products table to support filtering by collection type
  
  3. Important Notes
    - These columns default to false to maintain backward compatibility
    - Products can be marked with multiple collection types simultaneously
*/

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'is_best_seller'
    ) THEN
      ALTER TABLE products ADD COLUMN is_best_seller boolean DEFAULT false;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'is_limited_edition'
    ) THEN
      ALTER TABLE products ADD COLUMN is_limited_edition boolean DEFAULT false;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'is_new'
    ) THEN
      ALTER TABLE products ADD COLUMN is_new boolean DEFAULT false;
    END IF;
  END IF;
END $$;