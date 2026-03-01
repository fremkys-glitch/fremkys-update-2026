import { X, Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useProducts } from '../hooks/useProducts';

interface FavoritesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: ReturnType<typeof useFavorites>;
  onProductClick: (id: string) => void;
}

export default function FavoritesPanel({ isOpen, onClose, favorites, onProductClick }: FavoritesPanelProps) {
  const { products } = useProducts();

  if (!isOpen) return null;

  const favoriteProducts = products.filter(p => favorites.favorites.includes(p.id));

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out rounded-l-lg">
        <div className="flex flex-col h-full p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-light">Mes favoris</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 transition rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          {favoriteProducts.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Heart size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg mb-2">Aucun favori</p>
                <p className="text-sm">Ajoutez des articles à vos favoris</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
              {favoriteProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 pb-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 p-2 -m-2 transition"
                  onClick={() => {
                    onProductClick(product.id);
                    onClose();
                  }}
                >
                  <div className="w-20 h-24 bg-gray-100 flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1">{product.name}</p>
                    <p className="text-gray-600 text-sm mb-2">{product.price.toFixed(2)} €</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        favorites.toggleFavorite(product.id);
                      }}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
