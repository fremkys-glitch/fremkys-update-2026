/*
  # Fix images table structure
  
  1. Changes
    - Rename "products link" column to "product_link"
    - Rename "name" column to "category" 
    - Update the hero images data to use proper category names
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'image' AND column_name = 'products link'
  ) THEN
    ALTER TABLE image RENAME COLUMN "products link" TO product_link;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'image' AND column_name = 'name'
  ) THEN
    ALTER TABLE image RENAME COLUMN name TO category;
  END IF;
END $$;
