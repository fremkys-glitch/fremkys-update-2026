import { useState, useEffect } from 'react';
import { Heart, Share2, Truck, Shield, RefreshCw, Check, Copy } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { useProducts, Product as ProductType } from '../hooks/useProducts';

interface ProductProps {
  productId: string;
  onCartOpen: () => void;
  onNavigate: (page: string) => void;
  cart?: ReturnType<typeof useCart>;
  favorites?: ReturnType<typeof useFavorites>;
}

export default function Product({ productId, onCartOpen, onNavigate, cart: cartProp, favorites: favoritesProp }: ProductProps) {
  const { products, loading } = useProducts();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [shakeSize, setShakeSize] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const defaultCart = useCart();
  const defaultFavorites = useFavorites();
  const cart = cartProp || defaultCart;
  const favorites = favoritesProp || defaultFavorites;

  useEffect(() => {
    const foundProduct = products.find(p => p.id === productId);
    setProduct(foundProduct || null);
  }, [products, productId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl">Produit non trouvé</h2>
      </div>
    );
  }

  const images = [product.image, product.image2, product.image3].filter(img => img);

  const handleCopyLink = () => {
    const productUrl = `${window.location.origin}?product=${product.id}`;
    navigator.clipboard.writeText(productUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = (platform: string) => {
    const productUrl = `${window.location.origin}?product=${product.id}`;
    const text = `Découvrez ${product.name} - ${product.price.toFixed(2)} DA sur FREMKYS`;

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(productUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + productUrl)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShare(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        <div>
          <div className="aspect-[2/3] bg-gray-100 mb-4">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`aspect-[2/3] bg-gray-100 border-2 transition ${
                  selectedImage === idx ? 'border-black' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-light mb-2">{product.name}</h1>
              <div className="flex items-center gap-3">
                {product.old_price ? (
                  <>
                    <p className="text-lg text-gray-400 line-through">
                      {product.old_price.toFixed(2)} DA
                    </p>
                    <p className="text-2xl font-semibold text-red-600">
                      {product.price.toFixed(2)} DA
                    </p>
                  </>
                ) : (
                  <p className="text-2xl">{product.price.toFixed(2)} DA</p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => favorites.toggleFavorite(product.id)}
                className="p-2 border border-gray-300 hover:border-black transition"
              >
                <Heart
                  size={20}
                  fill={favorites.isFavorite(product.id) ? 'currentColor' : 'none'}
                  color={favorites.isFavorite(product.id) ? '#dc2626' : 'currentColor'}
                />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowShare(!showShare)}
                  className="p-2 border border-gray-300 hover:border-black transition"
                >
                  <Share2 size={20} />
                </button>
                {showShare && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowShare(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={handleCopyLink}
                          className="flex items-center space-x-2 text-sm text-gray-700 hover:text-black transition px-3 py-2 rounded hover:bg-gray-50 w-full text-left"
                        >
                          {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                          <span>{copied ? 'Lien copié!' : 'Copier le lien'}</span>
                        </button>
                        <button
                          onClick={() => handleShare('whatsapp')}
                          className="flex items-center space-x-2 text-sm text-gray-700 hover:text-black transition px-3 py-2 rounded hover:bg-gray-50 w-full text-left"
                        >
                          <span>Partager sur WhatsApp</span>
                        </button>
                        <button
                          onClick={() => handleShare('facebook')}
                          className="flex items-center space-x-2 text-sm text-gray-700 hover:text-black transition px-3 py-2 rounded hover:bg-gray-50 w-full text-left"
                        >
                          <span>Partager sur Facebook</span>
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          className="flex items-center space-x-2 text-sm text-gray-700 hover:text-black transition px-3 py-2 rounded hover:bg-gray-50 w-full text-left"
                        >
                          <span>Partager sur Twitter</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Taille</h3>
              <div className={`flex flex-wrap gap-2 ${shakeSize ? 'shake' : ''}`}>
                {product.sizes.map((sizeObj) => (
                  <button
                    key={sizeObj.size}
                    onClick={() => sizeObj.available && setSelectedSize(sizeObj.size)}
                    disabled={!sizeObj.available}
                    className={`px-4 py-2 border transition relative flex items-center gap-1 ${
                      selectedSize === sizeObj.size
                        ? 'bg-black text-white border-black'
                        : sizeObj.available
                        ? 'bg-white text-black border-gray-300 hover:border-black'
                        : 'bg-red-50 text-red-600 border-red-200 cursor-not-allowed'
                    }`}
                  >
                    {sizeObj.size}
                    {sizeObj.available && (
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    )}
                    {!sizeObj.available && (
                      <span className="text-lg font-bold">✕</span>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                متوفر
                <span className="inline-block ml-3 text-red-600">
                  ✕ غير متوفر
                </span>
              </p>
            </div>
          )}

          <button
            onClick={() => {
              if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                setShakeSize(true);
                setTimeout(() => setShakeSize(false), 500);
                alert('يرجى اختيار المقاس قبل إضافة المنتج إلى السلة');
                return;
              }
              cart.addToCart(product.id, product.name, product.price, product.image, selectedSize);
              setAddedToCart(true);
              setTimeout(() => setAddedToCart(false), 2000);
              onCartOpen();
            }}
            className={`w-full py-4 mb-4 transition ${
              addedToCart
                ? 'bg-green-600 text-white'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {addedToCart ? '✓ Ajouté au panier' : 'Ajouter au panier'}
          </button>

          <button
            onClick={() => {
              if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                setShakeSize(true);
                setTimeout(() => setShakeSize(false), 500);
                alert('يرجى اختيار المقاس قبل إتمام الطلب');
                return;
              }
              const itemKey = selectedSize ? `${product.id}-${selectedSize}` : product.id;
              const existingItem = cart.cart.find(item => {
                const cartKey = item.size ? `${item.id}-${item.size}` : item.id;
                return cartKey === itemKey;
              });

              if (existingItem) {
                onNavigate('checkout');
              } else {
                cart.addToCart(product.id, product.name, product.price, product.image, selectedSize);
                onNavigate('checkout');
              }
            }}
            className="w-full border border-black py-4 mb-6 hover:bg-gray-50 transition"
          >
            Acheter maintenant
          </button>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Truck size={20} className="mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Livraison gratuite</h4>
                <p className="text-sm text-gray-600">À partir de 10 000 DA d'achat</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <RefreshCw size={20} className="mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">L'échange gratuit</h4>
                <p className="text-sm text-gray-600">Sous 24h</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Shield size={20} className="mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Paiement sécurisé</h4>
                <p className="text-sm text-gray-600">Transactions protégées</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
