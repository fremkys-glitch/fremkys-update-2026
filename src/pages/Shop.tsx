import { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, X } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';

interface ShopProps {
  onNavigate: (page: string, productId?: string, category?: string, collection?: string) => void;
  onCartOpen: () => void;
  collectionType?: 'all' | 'best-sellers' | 'limited-edition' | 'new-arrivals';
  productsData?: ReturnType<typeof useProducts>;
}

export default function Shop({ onNavigate, onCartOpen, productsData }: ShopProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const cart = useCart();
  const fallbackProducts = useProducts();
  const { products, loading } = productsData || fallbackProducts;

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      return p.price >= priceRange[0] && p.price <= priceRange[1];
    });
  }, [products, priceRange]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-light text-center mb-8">Boutique</h1>

      <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-8 gap-4">
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:border-black transition"
        >
          <SlidersHorizontal size={18} />
          <span>Filtrer</span>
        </button>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
          <p className="mt-4 text-gray-600">Chargement des produits...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-2">Aucun produit trouvé</p>
          <p className="text-sm text-gray-500">Essayez de modifier les filtres</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewProduct={(id) => onNavigate('product', id)}
              onCartOpen={onCartOpen}
              cart={cart}
            />
          ))}
        </div>
      )}

      {filterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setFilterOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light">Filtres</h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="p-2 hover:bg-gray-100 transition rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Prix</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{priceRange[0]} DA</span>
                    <span>{priceRange[1]} DA</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Prix minimum</label>
                      <input
                        type="range"
                        min="0"
                        max="50000"
                        step="100"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Prix maximum</label>
                      <input
                        type="range"
                        min="0"
                        max="50000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <button
                  onClick={() => {
                    setPriceRange([0, 50000]);
                    setFilterOpen(false);
                  }}
                  className="w-full border border-gray-300 py-3 hover:bg-gray-50 transition"
                >
                  Réinitialiser
                </button>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="w-full bg-black text-white py-3 hover:bg-gray-800 transition"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
