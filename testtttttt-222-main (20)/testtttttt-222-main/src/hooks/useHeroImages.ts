import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface HeroImage {
  id: string;
  image: string;
  product_link: string;
  category: string;
}

export function useHeroImages() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedImages: HeroImage[] = (data || []).map((img: any) => ({
        id: String(img.id),
        image: img.image || '',
        product_link: img.product_link || '',
        category: img.category || ''
      }));

      setImages(formattedImages);
      setError(null);
    } catch (err) {
      console.error('Error loading hero images:', err);
      setError('فشل تحميل الصور');
    } finally {
      setLoading(false);
    }
  };

  const getImagesByCategory = (category: string) => {
    const categoryMap: Record<string, string[]> = {
      'nouvelle collection': ['Nouvelle Collection'],
      'nouveautes': ['Nouveautés'],
      'best sellers': ['Best Sellers'],
      'collection limitee': ['Collection Limitée']
    };

    const searchTerms = categoryMap[category.toLowerCase()] || [category];
    return images.filter(img =>
      searchTerms.some(term => img.category?.toLowerCase() === term.toLowerCase())
    );
  };

  return {
    images,
    loading,
    error,
    reload: loadImages,
    getImagesByCategory
  };
}
