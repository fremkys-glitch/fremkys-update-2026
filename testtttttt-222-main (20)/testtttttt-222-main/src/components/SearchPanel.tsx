import { X, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (id: string) => void;
}

export default function SearchPanel({ isOpen, onClose, onProductClick }: SearchPanelProps) {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(products);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 top-0 bg-white shadow-2xl z-50 max-h-[80vh] overflow-hidden">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des produits..."
                autoFocus
                className="w-full pl-12 pr-4 py-4 border border-gray-300 focus:outline-none focus:border-black text-lg"
              />
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-100 transition rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
            {searchResults.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">Aucun produit trouvé</p>
                <p className="text-sm">Essayez avec d'autres mots-clés</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="cursor-pointer group"
                    onClick={() => {
                      onProductClick(product.id);
                      onClose();
                    }}
                  >
                    <div className="aspect-[2/3] bg-gray-100 overflow-hidden mb-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-sm font-medium mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.price.toFixed(2)}DA</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
