import { useState } from 'react';
import { Package, Search } from 'lucide-react';

export default function Track() {
  const [orderNumber, setOrderNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Recherche de la commande: ${orderNumber}`);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-full mb-4">
          <Package size={32} />
        </div>
        <h1 className="text-4xl font-light mb-4">Suivre ma commande</h1>
        <p className="text-gray-600">
          Entrez votre numéro de commande pour suivre votre colis
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-12">
        <div className="flex gap-2">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Numéro de commande (ex: FREMKYS-12345)"
            required
            className="flex-1 px-4 py-4 border border-gray-300 focus:outline-none focus:border-black"
          />
          <button
            type="submit"
            className="bg-black text-white px-8 py-4 hover:bg-gray-800 transition flex items-center space-x-2"
          >
            <Search size={20} />
            <span>Rechercher</span>
          </button>
        </div>
      </form>

      <div className="bg-gray-50 p-8">
        <h2 className="text-xl font-light mb-4">Informations utiles</h2>
        <div className="space-y-4 text-sm text-gray-600">
          <p>
            <strong>Où trouver mon numéro de commande ?</strong><br />
            Votre numéro de commande se trouve dans l'email de confirmation que vous avez reçu après votre achat.
          </p>
          <p>
            <strong>Délai de livraison</strong><br />
            Les commandes sont généralement expédiées sous 24-48h et livrées sous 3-5 jours ouvrés.
          </p>
          <p>
            <strong>Besoin d'aide ?</strong><br />
            Notre service client est disponible du lundi au vendredi de 9h à 18h.
          </p>
        </div>
      </div>
    </div>
  );
}
