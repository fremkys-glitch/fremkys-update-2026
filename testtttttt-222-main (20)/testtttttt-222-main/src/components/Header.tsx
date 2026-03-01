import { Search, Heart, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import MiniCart from './MiniCart';
import FavoritesPanel from './FavoritesPanel';
import SearchPanel from './SearchPanel';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';

interface HeaderProps {
  onNavigate: (page: string, productId?: string, category?: string, collection?: string) => void;
  currentPage: string;
  cart: ReturnType<typeof useCart>;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  favorites: ReturnType<typeof useFavorites>;
  favoritesOpen: boolean;
  setFavoritesOpen: (open: boolean) => void;
}

export default function Header({ onNavigate, currentPage, cart, cartOpen, setCartOpen, favorites, favoritesOpen, setFavoritesOpen }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="bg-black text-white py-2 text-sm overflow-hidden relative">
        <div className="flex whitespace-nowrap animate-scroll">
          <span className="inline-block px-4">
            Livraison partout en Algérie | التوصيل إلى جميع ولايات الجزائر
          </span>
          <span className="inline-block px-4">
            Livraison partout en Algérie | التوصيل إلى جميع ولايات الجزائر
          </span>
          <span className="inline-block px-4">
            Livraison partout en Algérie | التوصيل إلى جميع ولايات الجزائر
          </span>
          <span className="inline-block px-4">
            Livraison partout en Algérie | التوصيل إلى جميع ولايات الجزائر
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className="hidden lg:flex space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-gray-600 transition ${currentPage === 'home' ? 'font-semibold' : ''}`}
            >
              Accueil
            </button>
            <button
              onClick={() => onNavigate('shop', undefined, undefined, 'all')}
              className={`hover:text-gray-600 transition ${currentPage === 'shop' ? 'font-semibold' : ''}`}
            >
              Boutique
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`hover:text-gray-600 transition ${currentPage === 'about' ? 'font-semibold' : ''}`}
            >
              À propos
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`hover:text-gray-600 transition ${currentPage === 'contact' ? 'font-semibold' : ''}`}
            >
              Contact
            </button>
          </nav>

          <div
            className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <h1 className="text-2xl font-light tracking-[0.3em]">FREMKYS</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:text-gray-600 transition hidden sm:block"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setFavoritesOpen(true)}
              className="hover:text-gray-600 transition hidden sm:block relative"
            >
              <Heart size={20} />
              {favorites.favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.favorites.length}
                </span>
              )}
            </button>
            <button className="hover:text-gray-600 transition hidden sm:block">
              <User size={20} />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="hover:text-gray-600 transition relative"
            >
              <ShoppingBag size={20} />
              {cart.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
                className={`text-left hover:text-gray-600 transition ${currentPage === 'home' ? 'font-semibold' : ''}`}
              >
                Accueil
              </button>
              <button
                onClick={() => { onNavigate('shop', undefined, undefined, 'all'); setMobileMenuOpen(false); }}
                className={`text-left hover:text-gray-600 transition ${currentPage === 'shop' ? 'font-semibold' : ''}`}
              >
                Boutique
              </button>
              <button
                onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }}
                className={`text-left hover:text-gray-600 transition ${currentPage === 'about' ? 'font-semibold' : ''}`}
              >
                À propos
              </button>
              <button
                onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }}
                className={`text-left hover:text-gray-600 transition ${currentPage === 'contact' ? 'font-semibold' : ''}`}
              >
                Contact
              </button>
              <button
                onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
                className="text-left hover:text-gray-600 transition flex items-center space-x-2"
              >
                <Search size={18} />
                <span>Recherche</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      <MiniCart isOpen={cartOpen} onClose={() => setCartOpen(false)} cart={cart} onCheckout={() => onNavigate('checkout')} />
      <FavoritesPanel
        isOpen={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        favorites={favorites}
        onProductClick={(id) => onNavigate('product', id)}
      />
      <SearchPanel
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onProductClick={(id) => onNavigate('product', id)}
      />
    </header>
  );
}
