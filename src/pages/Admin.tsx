import { Plus, Edit, Trash2, Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';

export default function Admin() {
  const { products } = useProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-light mb-2">Tableau de bord Admin</h1>
        <p className="text-gray-600">Gestion de votre boutique FREMKYS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm">Produits</h3>
            <Package size={20} className="text-gray-400" />
          </div>
          <p className="text-3xl font-light">{products.length}</p>
        </div>

        <div className="bg-white p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm">Commandes</h3>
            <ShoppingCart size={20} className="text-gray-400" />
          </div>
          <p className="text-3xl font-light">24</p>
        </div>

        <div className="bg-white p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm">Clients</h3>
            <Users size={20} className="text-gray-400" />
          </div>
          <p className="text-3xl font-light">156</p>
        </div>

        <div className="bg-white p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm">Revenus</h3>
            <TrendingUp size={20} className="text-gray-400" />
          </div>
          <p className="text-3xl font-light">2.4k€</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-light">Produits</h2>
          <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 hover:bg-gray-800 transition">
            <Plus size={18} />
            <span>Ajouter un produit</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left">
                <th className="pb-3 font-medium">Image</th>
                <th className="pb-3 font-medium">Nom</th>
                <th className="pb-3 font-medium">Catégorie</th>
                <th className="pb-3 font-medium">Prix</th>
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-20 object-cover"
                    />
                  </td>
                  <td className="py-4">
                    <p className="font-medium">{product.name}</p>
                  </td>
                  <td className="py-4 text-gray-600 capitalize">
                    {product.category.replace('-', ' ')}
                  </td>
                  <td className="py-4">{product.price.toFixed(2)}€</td>
                  <td className="py-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      En stock
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-gray-100 transition rounded">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-50 hover:text-red-600 transition rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-xl font-light mb-4">Commandes récentes</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium">Commande #{1000 + i}</p>
                  <p className="text-sm text-gray-600">Client {i}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{(89.99 * i).toFixed(2)}€</p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    En cours
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-xl font-light mb-4">Statistiques</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Taux de conversion</span>
                <span className="text-sm font-medium">3.2%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div className="bg-black h-2 rounded" style={{ width: '32%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Panier moyen</span>
                <span className="text-sm font-medium">125€</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div className="bg-black h-2 rounded" style={{ width: '62%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Taux de retour</span>
                <span className="text-sm font-medium">4.8%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div className="bg-black h-2 rounded" style={{ width: '48%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">
          <strong>Note :</strong> Ceci est une version de démonstration du tableau de bord admin.
          Les boutons et fonctionnalités ne sont pas connectés à une base de données réelle.
        </p>
      </div>
    </div>
  );
}
