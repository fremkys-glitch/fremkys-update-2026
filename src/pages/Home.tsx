import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';

interface HomeProps {
  onNavigate: (page: string, productId?: string, category?: string, collection?: string) => void;
  onCartOpen: () => void;
  productsData?: ReturnType<typeof useProducts>;
}

export default function Home({ onNavigate, onCartOpen, productsData }: HomeProps) {
  const [email, setEmail] = useState('');
  const cart = useCart();
  const fallbackProducts = useProducts();
  const { products, loading } = productsData || fallbackProducts;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Merci pour votre inscription !');
    setEmail('');
  };

  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      <section className="relative h-[70vh] min-h-[500px] bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={() => onNavigate('shop')}
      >
        <img
          src="https://ik.imagekit.io/dpfjowzmv/home%20photo.jpg"
          alt="Nouvelle Collection"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h2 className="text-4xl md:text-7xl font-light tracking-wider mb-4">
            Nouvelle Collection
          </h2>
          <p className="text-base md:text-xl mb-8">Classic & timeless</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('shop');
            }}
            className="bg-white text-black px-8 py-3 hover:bg-gray-100 transition font-medium tracking-wide"
          >
            SHOP NOW
          </button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="relative aspect-square bg-gray-100 overflow-hidden group cursor-pointer"
            onClick={() => onNavigate('shop', undefined, undefined, 'new-arrivals')}
          >
            <img
              src="https://res.cloudinary.com/dlhbx3b1d/image/upload/v1771892445/home_3_qro91c.jpg"
              alt="Nouveautés"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h3 className="text-white text-2xl md:text-3xl font-light">Nouveautés</h3>
            </div>
          </div>

          <div
            className="relative aspect-square bg-gray-100 overflow-hidden group cursor-pointer"
            onClick={() => onNavigate('shop', undefined, undefined, 'best-sellers')}
          >
            <img
              src="https://res.cloudinary.com/dlhbx3b1d/image/upload/v1771892430/home_2_rlkc72.jpg"
              alt="Best Sellers"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h3 className="text-white text-2xl md:text-3xl font-light">Best Sellers</h3>
            </div>
          </div>

          <div
            className="relative aspect-square bg-gray-100 overflow-hidden group cursor-pointer"
            onClick={() => onNavigate('shop', undefined, undefined, 'limited-edition')}
          >
            <img
              src="https://res.cloudinary.com/dlhbx3b1d/image/upload/v1771892419/home_1_cvqwdf.jpg"
              alt="Collection Limitée"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h3 className="text-white text-2xl md:text-3xl font-light">Collection Limitée</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-light">Sélection</h2>
          <button
            onClick={() => onNavigate('shop')}
            className="flex items-center space-x-2 text-sm hover:underline"
          >
            <span>Voir tout</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
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
      </section>

      <section className="bg-[#f5f5dc] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-4">Newsletter</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Inscrivez-vous pour recevoir nos dernières nouveautés et offres exclusives
          </p>
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              required
              className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition"
            >
              S'inscrire
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
