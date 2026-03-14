import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface ProductSize {
  size: string;
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  old_price?: number;
  category: string;
  image: string;
  image1?: string;
  image2?: string;
  image3?: string;
  sizes: ProductSize[];
  description: string;
  in_stock?: boolean;
  is_new?: boolean;
  is_best_seller?: boolean;
  is_limited_edition?: boolean;
  product_link?: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, "old price", "Catégories", image, image2, image3, description, in_stock, is_new, is_best_seller, is_limited_edition, product_link, size_s, "size_M", "size_L", "size_XL", size_36, size_38, size_40, size_42')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedProducts: Product[] = (data || []).map((p: any) => {
        const sizes: ProductSize[] = [];

        if (p.size_s !== null && p.size_s !== undefined) {
          sizes.push({ size: 'S', available: p.size_s });
        }
        if (p.size_M !== null && p.size_M !== undefined) {
          sizes.push({ size: 'M', available: p.size_M });
        }
        if (p.size_L !== null && p.size_L !== undefined) {
          sizes.push({ size: 'L', available: p.size_L });
        }
        if (p.size_XL !== null && p.size_XL !== undefined) {
          sizes.push({ size: 'XL', available: p.size_XL });
        }
        if (p.size_36 !== null && p.size_36 !== undefined) {
          sizes.push({ size: '36', available: p.size_36 });
        }
        if (p.size_38 !== null && p.size_38 !== undefined) {
          sizes.push({ size: '38', available: p.size_38 });
        }
        if (p.size_40 !== null && p.size_40 !== undefined) {
          sizes.push({ size: '40', available: p.size_40 });
        }
        if (p.size_42 !== null && p.size_42 !== undefined) {
          sizes.push({ size: '42', available: p.size_42 });
        }

        const category = p['Catégories'] || '';
        const normalizedCategory = category.toLowerCase().trim();

        return {
          id: String(p.id),
          name: p.name || '',
          price: Number(p.price) || 0,
          old_price: p['old price'] ? Number(p['old price']) : undefined,
          category: normalizedCategory,
          image: p.image || '',
          image1: p.image || '',
          image2: p.image2 || '',
          image3: p.image3 || '',
          sizes: sizes,
          description: p.description || '',
          in_stock: p.in_stock !== false,
          is_new: p.is_new || false,
          is_best_seller: p.is_best_seller || false,
          is_limited_edition: p.is_limited_edition || false,
          product_link: p.product_link || ''
        };
      });

      setProducts(formattedProducts);
      setError(null);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('فشل تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    reload: loadProducts
  };
}
