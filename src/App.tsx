import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import About from './pages/About';
import Contact from './pages/Contact';
import Track from './pages/Track';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import { useCart } from './hooks/useCart';
import { useFavorites } from './hooks/useFavorites';
import { useAuth } from './hooks/useAuth';

type Page = 'home' | 'shop' | 'product' | 'about' | 'contact' | 'track' | 'faq' | 'privacy' | 'terms' | 'admin' | 'checkout' | 'confirmation';
type CollectionType = 'all' | 'best-sellers' | 'limited-edition' | 'new-arrivals';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [collectionType, setCollectionType] = useState<CollectionType>('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const cart = useCart();
  const favorites = useFavorites();
  const { user, loading } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || urlParams.get('product');

    if (productId) {
      setSelectedProductId(productId);
      setCurrentPage('product');
    }

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id') || params.get('product');

      if (id) {
        setSelectedProductId(id);
        setCurrentPage('product');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (page: string, productId?: string, _category?: string, collection?: string) => {
    if (page === 'admin') {
      if (!user) {
        setShowAdminLogin(true);
      } else {
        setCurrentPage('admin');
      }
    } else {
      setCurrentPage(page as Page);
    }

    if (productId) {
      if (page === 'confirmation') {
        setOrderNumber(productId);
      } else {
        setSelectedProductId(productId);
        if (page === 'product') {
          const url = new URL(window.location.href);
          url.searchParams.set('id', productId);
          window.history.pushState({}, '', url.toString());
        }
      }
    } else if (page === 'home') {
      window.history.pushState({}, '', window.location.pathname);
    }

    if (page === 'shop' && collection) {
      setCollectionType(collection as CollectionType);
    }

    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = () => {
    setShowAdminLogin(false);
    setCurrentPage('admin');
  };

  const handleLogout = () => {
    setCurrentPage('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  if (showAdminLogin) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} onCartOpen={() => setCartOpen(true)} />;
      case 'shop':
        return <Shop onNavigate={handleNavigate} onCartOpen={() => setCartOpen(true)} collectionType={collectionType} />;
      case 'product':
        return <Product productId={selectedProductId} onCartOpen={() => setCartOpen(true)} onNavigate={handleNavigate} cart={cart} favorites={favorites} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'track':
        return <Track />;
      case 'faq':
        return <FAQ />;
      case 'privacy':
        return <Privacy />;
      case 'terms':
        return <Terms />;
      case 'admin':
        return user ? <AdminDashboard onLogout={handleLogout} /> : <AdminLogin onLoginSuccess={handleLoginSuccess} />;
      case 'checkout':
        return <Checkout onNavigate={handleNavigate} onBack={() => setCurrentPage('home')} cart={cart} />;
      case 'confirmation':
        return <OrderConfirmation orderNumber={orderNumber} onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} onCartOpen={() => setCartOpen(true)} />;
    }
  };

  if (currentPage === 'admin' && user) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        onNavigate={handleNavigate}
        currentPage={currentPage}
        cart={cart}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        favorites={favorites}
        favoritesOpen={favoritesOpen}
        setFavoritesOpen={setFavoritesOpen}
      />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
