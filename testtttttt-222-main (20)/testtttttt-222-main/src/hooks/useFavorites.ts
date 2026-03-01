import { useState, useEffect } from 'react';

const FAVORITES_STORAGE_KEY = 'fremkys_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Error loading favorites from localStorage:', e);
        setFavorites([]);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = (productId: string) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites.filter((id) => id !== productId);
      }
      return [...prevFavorites, productId];
    });
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    isLoaded,
  };
}
