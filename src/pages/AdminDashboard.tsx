import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Image, LogOut, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  size: string;
  description: string;
  in_stock?: boolean;
}

interface HeroImage {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  position: number;
  is_active: boolean;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'hero'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingHero, setEditingHero] = useState<HeroImage | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showHeroForm, setShowHeroForm] = useState(false);
  const { signOut } = useAuth();

  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    category: 'robes',
    image: '',
    size: '',
    description: '',
    in_stock: true
  });

  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    position: 0,
    is_active: true
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadProducts(), loadHeroImages()]);
    setLoading(false);
  };

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading products:', error);
    } else {
      setProducts(data || []);
    }
  };

  const loadHeroImages = async () => {
    const { data, error } = await supabase
      .from('hero_images')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      console.error('Error loading hero images:', error);
    } else {
      setHeroImages(data || []);
    }
  };

  const handleSaveProduct = async () => {
    const productData = {
      name: productForm.name,
      price: productForm.price,
      category: productForm.category,
      image: productForm.image,
      size: productForm.size,
      description: productForm.description,
      in_stock: productForm.in_stock
    };

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) {
        alert('خطأ في تحديث المنتج');
        console.error(error);
      } else {
        alert('تم تحديث المنتج بنجاح');
        resetProductForm();
        loadProducts();
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) {
        alert('خطأ في إضافة المنتج');
        console.error(error);
      } else {
        alert('تم إضافة المنتج بنجاح');
        resetProductForm();
        loadProducts();
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      alert('خطأ في حذف المنتج');
      console.error(error);
    } else {
      alert('تم حذف المنتج بنجاح');
      loadProducts();
    }
  };

  const handleSaveHero = async () => {
    if (editingHero) {
      const { error } = await supabase
        .from('hero_images')
        .update(heroForm)
        .eq('id', editingHero.id);

      if (error) {
        alert('خطأ في تحديث الصورة');
        console.error(error);
      } else {
        alert('تم تحديث الصورة بنجاح');
        resetHeroForm();
        loadHeroImages();
      }
    } else {
      const { error } = await supabase
        .from('hero_images')
        .insert([heroForm]);

      if (error) {
        alert('خطأ في إضافة الصورة');
        console.error(error);
      } else {
        alert('تم إضافة الصورة بنجاح');
        resetHeroForm();
        loadHeroImages();
      }
    }
  };

  const handleDeleteHero = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;

    const { error } = await supabase
      .from('hero_images')
      .delete()
      .eq('id', id);

    if (error) {
      alert('خطأ في حذف الصورة');
      console.error(error);
    } else {
      alert('تم حذف الصورة بنجاح');
      loadHeroImages();
    }
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      size: product.size,
      description: product.description,
      in_stock: product.in_stock !== false
    });
    setShowProductForm(true);
  };

  const startEditHero = (hero: HeroImage) => {
    setEditingHero(hero);
    setHeroForm({
      title: hero.title,
      subtitle: hero.subtitle,
      image_url: hero.image_url,
      position: hero.position,
      is_active: hero.is_active
    });
    setShowHeroForm(true);
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: 0,
      category: 'robes',
      image: '',
      size: '',
      description: '',
      in_stock: true
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const resetHeroForm = () => {
    setHeroForm({
      title: '',
      subtitle: '',
      image_url: '',
      position: 0,
      is_active: true
    });
    setEditingHero(null);
    setShowHeroForm(false);
  };

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  const categories = [
    { value: 'robes', label: 'Robes' },
    { value: 'tops', label: 'Tops' },
    { value: 'pantalons-jupes', label: 'Pantalons & Jupes' },
    { value: 'veste', label: 'Veste' },
    { value: 'manteaux-et-trenchs', label: 'Manteaux & Trenchs' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-light">لوحة التحكم - FREMKYS</h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition"
            >
              <LogOut size={18} />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2 px-6 py-3 transition ${
              activeTab === 'products'
                ? 'bg-black text-white'
                : 'bg-white border border-gray-300 hover:border-black'
            }`}
          >
            <Package size={20} />
            <span>إدارة المنتجات</span>
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center space-x-2 px-6 py-3 transition ${
              activeTab === 'hero'
                ? 'bg-black text-white'
                : 'bg-white border border-gray-300 hover:border-black'
            }`}
          >
            <Image size={20} />
            <span>صور الصفحة الرئيسية</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
            <p className="mt-4 text-gray-600">جارٍ التحميل...</p>
          </div>
        ) : (
          <>
            {activeTab === 'products' && (
              <div className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-light">المنتجات ({products.length})</h2>
                  <button
                    onClick={() => setShowProductForm(true)}
                    className="flex items-center space-x-2 bg-black text-white px-4 py-2 hover:bg-gray-800 transition"
                  >
                    <Plus size={18} />
                    <span>إضافة منتج</span>
                  </button>
                </div>

                {showProductForm && (
                  <div className="mb-6 p-6 bg-gray-50 border border-gray-300">
                    <h3 className="text-xl font-medium mb-4">
                      {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">اسم المنتج</label>
                        <input
                          type="text"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">السعر (DA)</label>
                        <input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">التصنيف</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                        >
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">المقاسات</label>
                        <input
                          type="text"
                          value={productForm.size}
                          onChange={(e) => setProductForm({ ...productForm, size: e.target.value })}
                          placeholder="S, M, L"
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">رابط الصورة</label>
                        <input
                          type="text"
                          value={productForm.image}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">الوصف</label>
                        <textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={productForm.in_stock}
                            onChange={(e) => setProductForm({ ...productForm, in_stock: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <span className="text-sm font-medium">متوفر في المخزن</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex space-x-4 mt-6">
                      <button
                        onClick={handleSaveProduct}
                        className="flex items-center space-x-2 bg-black text-white px-6 py-2 hover:bg-gray-800 transition"
                      >
                        <Save size={18} />
                        <span>حفظ</span>
                      </button>
                      <button
                        onClick={resetProductForm}
                        className="flex items-center space-x-2 border border-gray-300 px-6 py-2 hover:bg-gray-50 transition"
                      >
                        <X size={18} />
                        <span>إلغاء</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200">
                      <tr className="text-left">
                        <th className="pb-3 font-medium">الصورة</th>
                        <th className="pb-3 font-medium">الاسم</th>
                        <th className="pb-3 font-medium">التصنيف</th>
                        <th className="pb-3 font-medium">السعر</th>
                        <th className="pb-3 font-medium">المقاس</th>
                        <th className="pb-3 font-medium">الحالة</th>
                        <th className="pb-3 font-medium">الإجراءات</th>
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
                          <td className="py-4 text-gray-600">
                            {categories.find(c => c.value === product.category)?.label}
                          </td>
                          <td className="py-4">{product.price.toFixed(2)} DA</td>
                          <td className="py-4">
                            <span className="text-gray-600 text-sm">{product.size}</span>
                          </td>
                          <td className="py-4">
                            <span className={`text-sm font-medium ${product.in_stock !== false ? 'text-green-600' : 'text-red-600'}`}>
                              {product.in_stock !== false ? 'متوفر' : 'غير متوفر'}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => startEditProduct(product)}
                                className="p-2 hover:bg-gray-100 transition rounded"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 hover:bg-red-50 hover:text-red-600 transition rounded"
                              >
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
            )}

            {activeTab === 'hero' && (
              <div className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-light">صور الصفحة الرئيسية ({heroImages.length})</h2>
                  <button
                    onClick={() => setShowHeroForm(true)}
                    className="flex items-center space-x-2 bg-black text-white px-4 py-2 hover:bg-gray-800 transition"
                  >
                    <Plus size={18} />
                    <span>إضافة صورة</span>
                  </button>
                </div>

                {showHeroForm && (
                  <div className="mb-6 p-6 bg-gray-50 border border-gray-300">
                    <h3 className="text-xl font-medium mb-4">
                      {editingHero ? 'تعديل الصورة' : 'إضافة صورة جديدة'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">العنوان</label>
                        <input
                          type="text"
                          value={heroForm.title}
                          onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">العنوان الفرعي</label>
                        <input
                          type="text"
                          value={heroForm.subtitle}
                          onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">رابط الصورة</label>
                        <input
                          type="text"
                          value={heroForm.image_url}
                          onChange={(e) => setHeroForm({ ...heroForm, image_url: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">الترتيب</label>
                        <input
                          type="number"
                          value={heroForm.position}
                          onChange={(e) => setHeroForm({ ...heroForm, position: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={heroForm.is_active}
                            onChange={(e) => setHeroForm({ ...heroForm, is_active: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">نشط</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex space-x-4 mt-6">
                      <button
                        onClick={handleSaveHero}
                        className="flex items-center space-x-2 bg-black text-white px-6 py-2 hover:bg-gray-800 transition"
                      >
                        <Save size={18} />
                        <span>حفظ</span>
                      </button>
                      <button
                        onClick={resetHeroForm}
                        className="flex items-center space-x-2 border border-gray-300 px-6 py-2 hover:bg-gray-50 transition"
                      >
                        <X size={18} />
                        <span>إلغاء</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {heroImages.map((hero) => (
                    <div key={hero.id} className="border border-gray-200 overflow-hidden">
                      <div className="aspect-video bg-gray-100">
                        <img
                          src={hero.image_url}
                          alt={hero.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1">{hero.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{hero.subtitle}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-500">الترتيب: {hero.position}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            hero.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {hero.is_active ? 'نشط' : 'غير نشط'}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditHero(hero)}
                            className="flex-1 flex items-center justify-center space-x-1 py-2 border border-gray-300 hover:bg-gray-50 transition"
                          >
                            <Edit size={14} />
                            <span className="text-sm">تعديل</span>
                          </button>
                          <button
                            onClick={() => handleDeleteHero(hero.id)}
                            className="flex-1 flex items-center justify-center space-x-1 py-2 border border-red-300 text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 size={14} />
                            <span className="text-sm">حذف</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
