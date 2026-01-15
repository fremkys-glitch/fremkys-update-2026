import { X, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: ReturnType<typeof useCart>;
  onCheckout: () => void;
}

export default function MiniCart({ isOpen, onClose, cart, onCheckout }: MiniCartProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out rounded-l-lg">
        <div className="flex flex-col h-full p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-light">Votre panier</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 transition rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          {cart.cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="text-lg mb-2">Votre panier est vide</p>
                <p className="text-sm">Ajoutez des articles pour commencer</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                {cart.cart.map((item, index) => (
                  <div key={`${item.id}-${item.size || ''}-${index}`} className="flex gap-4 pb-4 border-b border-gray-200">
                    <div className="w-20 h-24 bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-1">{item.name}</p>
                      {item.size && <p className="text-xs text-gray-500 mb-1">المقاس: {item.size}</p>}
                      <p className="text-gray-600 text-sm mb-2">{item.price.toFixed(2)} DA</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const foundItem = cart.cart[index];
                            if (foundItem) cart.updateQuantity(foundItem.id, foundItem.quantity - 1);
                          }}
                          className="px-2 py-1 border border-gray-300 hover:border-gray-400 transition text-sm"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => {
                            const foundItem = cart.cart[index];
                            if (foundItem) cart.updateQuantity(foundItem.id, foundItem.quantity + 1);
                          }}
                          className="px-2 py-1 border border-gray-300 hover:border-gray-400 transition text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => {
                          const foundItem = cart.cart[index];
                          if (foundItem) cart.removeFromCart(foundItem.id);
                        }}
                        className="p-2 hover:bg-gray-100 transition rounded text-gray-600 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                      <p className="font-medium text-sm">{(item.price * item.quantity).toFixed(2)} DA</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="border-t border-gray-200 pt-4 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium">Total</span>
              <span className="font-light">{cart.totalPrice.toFixed(2)} DA</span>
            </div>

            <button
              disabled={cart.cart.length === 0}
              onClick={() => {
                onCheckout();
                onClose();
              }}
              className="w-full bg-black text-white py-4 hover:bg-gray-800 transition rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Passer commande
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
