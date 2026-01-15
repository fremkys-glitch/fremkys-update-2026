import { useState } from 'react';
import { Eye, ShoppingBag, AlertCircle, Share2, Copy, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';

interface ProductCardProps {
  product: Product;
  onViewProduct: (id: string) => void;
  onCartOpen?: () => void;
  cart: ReturnType<typeof useCart>;
}

export default function ProductCard({ product, onViewProduct, onCartOpen, cart }: ProductCardProps) {
  const [addedToCart, setAddedToCart] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const productUrl = `${window.location.origin}?product=${product.id}`;
    navigator.clipboard.writeText(productUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = (platform: string) => {
    const productUrl = `${window.location.origin}?product=${product.id}`;
    const text = `Check out ${product.name} - ${product.price.toFixed(2)} DA`;

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(productUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + productUrl)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div
      className="group relative cursor-pointer"
      onClick={() => onViewProduct(product.id)}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 ${
            product.in_stock === false ? 'opacity-50' : ''
          }`}
        />

        {product.in_stock === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <AlertCircle size={18} className="text-red-600" />
              <span className="text-sm font-medium text-red-600">Rupture de stock</span>
            </div>
          </div>
        )}

        {product.in_stock !== false && (
          <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                cart.addToCart(product.id, product.name, product.price, product.image, undefined);
                setAddedToCart(true);
                setTimeout(() => setAddedToCart(false), 2000);
                if (onCartOpen) {
                  onCartOpen();
                }
              }}
              className={`w-full py-3 transition flex items-center justify-center space-x-2 ${
                addedToCart
                  ? 'bg-green-600 text-white'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              <ShoppingBag size={18} />
              <span>{addedToCart ? 'Ajouté' : 'Ajouter au panier'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 text-center">
        <h3 className="text-sm font-medium">{product.name}</h3>
        <div className="mt-1 flex items-center justify-center gap-2">
          {product.old_price ? (
            <>
              <span className="text-sm text-gray-400 line-through">
                {product.old_price.toFixed(2)} DA
              </span>
              <span className="text-sm font-semibold text-red-600">
                {product.price.toFixed(2)} DA
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-600">
              {product.price.toFixed(2)} DA
            </span>
          )}
        </div>
        <div className="mt-2 relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowShare(!showShare);
            }}
            className="text-sm text-gray-500 hover:text-black transition flex items-center justify-center space-x-1 mx-auto"
          >
            <Share2 size={14} />
            <span>Partager</span>
          </button>

          {showShare && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 whitespace-nowrap">
              <div className="flex flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyLink();
                  }}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-black transition px-3 py-2 rounded hover:bg-gray-50"
                >
                  {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  <span>{copied ? 'Copié' : 'Copier le lien'}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare('whatsapp');
                    setShowShare(false);
                  }}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-black transition px-3 py-2 rounded hover:bg-gray-50 w-full"
                >
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare('facebook');
                    setShowShare(false);
                  }}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-black transition px-3 py-2 rounded hover:bg-gray-50 w-full"
                >
                  <span>Facebook</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare('twitter');
                    setShowShare(false);
                  }}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-black transition px-3 py-2 rounded hover:bg-gray-50 w-full"
                >
                  <span>Twitter</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
