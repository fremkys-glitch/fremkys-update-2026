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

export const DEMO_PRODUCTS: Product[] = [];
