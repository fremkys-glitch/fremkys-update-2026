import { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { MapPin, CreditCard, Package, ArrowLeft, Home, Building2 } from 'lucide-react';
import { getShippingPrice, isDeliveryAvailable } from '../utils/shippingPrices';

interface CheckoutProps {
  onNavigate: (page: string, orderId?: string) => void;
  onBack: () => void;
  cart: ReturnType<typeof useCart>;
}

export default function Checkout({ onNavigate, onBack, cart }: CheckoutProps) {
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [deliveryType, setDeliveryType] = useState<'home' | 'office'>('home');
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    wilaya: '',
    postalCode: '',
    notes: ''
  });

  const wilayas = [
    'Adrar', 'Aïn Defla', 'Aïn Témouchent', 'Alger', 'Annaba', 'Batna', 'Béjaïa', 'Béchar',
    'Béni Abbès', 'Biskra', 'Blida', 'Bordj Bou Arréridj', 'Bordj Badji Mokhtar', 'Boumerdès',
    'Bouira', 'Chlef', 'Constantine', 'Djanet', 'Djelfa', 'El Bayadh', 'El Oued', 'El Tarf',
    'Ghardaïa', 'Guelma', 'Illizi', 'In Salah', 'In Guezzam', 'Jijel', 'Khenchela', 'Laghouat',
    'Mascara', 'Médéa', 'El Meniaa', 'Mila', 'Mostaganem', 'M\'Sila', 'Naâma', 'Oran', 'Ouargla',
    'Ouled Djellal', 'Oum El Bouaghi', 'Relizane', 'Saïda', 'Sidi Bel Abbès', 'Skikda',
    'Souk Ahras', 'Sétif', 'Tamanrasset', 'Tébessa', 'Tiaret', 'Timimoun', 'Tindouf',
    'Tissemsilt', 'Tizi Ouzou', 'Tlemcen', 'Touggourt', 'Tipaza', 'El M\'Ghair'
  ];

  useEffect(() => {
    if (formData.wilaya) {
      if (cart.totalPrice >= 10000) {
        setShippingFee(0);
      } else {
        const price = getShippingPrice(formData.wilaya, deliveryType);
        setShippingFee(price || 0);
      }
    } else {
      setShippingFee(0);
    }
  }, [formData.wilaya, deliveryType, cart.totalPrice]);

  const validatePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\s+/g, '');
    const algerianPhoneRegex = /^(\+213|0)(5|6|7)[0-9]{8}$/;
    return algerianPhoneRegex.test(cleanPhone);
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 'shipping') {
      if (!formData.wilaya) {
        alert('يرجى اختيار الولاية');
        return;
      }

      if (!validatePhone(formData.phone)) {
        alert('رقم الهاتف غير صحيح. يجب أن يكون رقم هاتف جزائري صحيح');
        return;
      }

      if (formData.email && !validateEmail(formData.email)) {
        alert('البريد الإلكتروني غير صحيح');
        return;
      }

      if (!isDeliveryAvailable(formData.wilaya, deliveryType)) {
        alert('عذراً، التوصيل غير متاح لهذه الولاية بنوع التوصيل المحدد');
        return;
      }
      setStep('payment');
    } else if (step === 'payment') {
      if (submitting) {
        return;
      }

      setSubmitting(true);

      console.log('📝 Starting order submission...');

      const items = cart.cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        size: item.size || ''
      }));

      console.log('📦 Order data prepared');

      try {
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const total = subtotal + shippingFee;

        const productNames = items.map(item => `${item.name} (x${item.quantity})`).join(', ');
        const productSizes = items.map(item => item.size ? `${item.size} (x${item.quantity})` : 'No Size').join(', ');

        const timestamp = new Date().toISOString();
        const orderNumber = `FREMKYS-${Date.now()}`;

        const orderData = {
          order_number: orderNumber,
          customer_first_name: formData.firstName,
          customer_last_name: formData.lastName,
          customer_email: formData.email || '',
          customer_phone: formData.phone,
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_wilaya: formData.wilaya,
          delivery_type: deliveryType === 'home' ? 'توصيل منزلي' : 'توصيل للمكتب',
          notes: formData.notes || '',
          items: items,
          product_name: productNames,
          product_size: productSizes,
          subtotal: Math.round(subtotal * 100) / 100,
          shipping_fee: Math.round(shippingFee * 100) / 100,
          total: Math.round(total * 100) / 100,
          status: 'طلب جديد',
          created_at: timestamp
        };

        console.log('💾 Saving order to Supabase database...');

        const { supabase } = await import('../lib/supabase');
        const { data: order, error } = await supabase
          .from('airtable_orders')
          .insert([orderData])
          .select()
          .single();

        if (error) {
          console.error('❌ Supabase Error:', error);
          throw new Error(error.message || 'Failed to submit order');
        }

        console.log('✅ Order saved successfully!');
        console.log('✅ Order ID:', order?.id);
        console.log('✅ Order Number:', orderNumber);

        alert(`تم إرسال طلبك بنجاح!\nرقم الطلب: ${orderNumber}`);
        cart.clearCart();
        onNavigate('confirmation', orderNumber);

      } catch (error: any) {
        console.error('❌ Exception during order submission:', error);
        alert(`خطأ في إرسال الطلب: ${error.message || 'حدث خطأ غير متوقع'}\n\nيرجى المحاولة مرة أخرى.`);
        setSubmitting(false);
      }
    }
  };

  if (!cart.isLoaded) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <Package size={64} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  if (cart.cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package size={64} className="mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-light mb-4">سلة التسوق فارغة</h2>
        <p className="text-gray-600 mb-8">أضف منتجات لبدء التسوق</p>
        <button
          onClick={() => onNavigate('shop')}
          className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition"
        >
          تصفح المنتجات
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 mb-8 text-gray-600 hover:text-black transition"
      >
        <ArrowLeft size={20} />
        <span>العودة</span>
      </button>

      <h1 className="text-4xl font-light text-center mb-8">إتمام الطلب</h1>

      <div className="flex justify-center mb-12">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${step === 'shipping' ? 'text-black' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'shipping' ? 'bg-black text-white' : 'bg-gray-200'}`}>
              <MapPin size={16} />
            </div>
            <span className="text-sm font-medium">الشحن</span>
          </div>

          <div className="w-12 h-px bg-gray-300"></div>

          <div className={`flex items-center space-x-2 ${step === 'payment' ? 'text-black' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-black text-white' : 'bg-gray-200'}`}>
              <CreditCard size={16} />
            </div>
            <span className="text-sm font-medium">الدفع والتأكيد</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {step === 'shipping' && (
              <div className="bg-white border border-gray-200 p-6">
                <h2 className="text-2xl font-light mb-6">معلومات الشحن</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">الاسم</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">اللقب</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">البريد الإلكتروني (اختياري)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      placeholder="+213 أو 0555123456"
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">العنوان</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">المدينة</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">الولاية</label>
                    <select
                      value={formData.wilaya}
                      onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                    >
                      <option value="">اختر الولاية</option>
                      {wilayas.map((wilaya) => (
                        <option key={wilaya} value={wilaya}>{wilaya}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">نوع التوصيل</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('home')}
                        disabled={!!(formData.wilaya && !isDeliveryAvailable(formData.wilaya, 'home'))}
                        className={`p-4 border-2 rounded transition ${
                          deliveryType === 'home'
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        } ${formData.wilaya && !isDeliveryAvailable(formData.wilaya, 'home') ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Home className="mx-auto mb-2" size={24} />
                        <div className="font-semibold">توصيل للمنزل</div>
                        {formData.wilaya && (
                          <div className="text-sm mt-1">
                            {isDeliveryAvailable(formData.wilaya, 'home')
                              ? cart.totalPrice >= 10000
                                ? 'مجاني'
                                : `${getShippingPrice(formData.wilaya, 'home')} دج`
                              : 'غير متاح'}
                          </div>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryType('office')}
                        disabled={!!(formData.wilaya && !isDeliveryAvailable(formData.wilaya, 'office'))}
                        className={`p-4 border-2 rounded transition ${
                          deliveryType === 'office'
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        } ${formData.wilaya && !isDeliveryAvailable(formData.wilaya, 'office') ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Building2 className="mx-auto mb-2" size={24} />
                        <div className="font-semibold">توصيل للمكتب</div>
                        {formData.wilaya && (
                          <div className="text-sm mt-1">
                            {isDeliveryAvailable(formData.wilaya, 'office')
                              ? cart.totalPrice >= 10000
                                ? 'مجاني'
                                : `${getShippingPrice(formData.wilaya, 'office')} دج`
                              : 'غير متاح'}
                          </div>
                        )}
                      </button>
                    </div>
                    {!formData.wilaya && (
                      <p className="text-sm text-gray-500 mt-2">اختر الولاية أولاً لمعرفة الأسعار المتاحة</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">ملاحظات (اختياري)</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black resize-none"
                      placeholder="أي ملاحظات إضافية للطلب"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 mt-6 hover:bg-gray-800 transition"
                >
                  المتابعة إلى الدفع
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-white border border-gray-200 p-6">
                <h2 className="text-2xl font-light mb-6">طريقة الدفع</h2>

                <div className="space-y-4">
                  <div className="border-2 border-black p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">الدفع عند الاستلام</h3>
                      <div className="w-5 h-5 rounded-full border-2 border-black bg-black"></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      ادفع نقدًا عند استلام المنتج. يمكنك فحص المنتج قبل الدفع.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>ملاحظة:</strong> سيتم الاتصال بك لتأكيد الطلب قبل الشحن. تأكد من صحة رقم الهاتف.
                  </p>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    disabled={submitting}
                    className="flex-1 border border-gray-300 py-4 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    السابق
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-black text-white py-4 hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>جارٍ إرسال الطلب...</span>
                      </>
                    ) : (
                      <span>تأكيد الطلب</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 p-6 sticky top-24">
            <h3 className="text-xl font-light mb-4">ملخص الطلب</h3>

            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
              {cart.cart.map((item, index) => (
                <div key={`${item.id}-${item.size || ''}-${index}`} className="flex items-center space-x-3">
                  <div className="w-16 h-20 bg-gray-100 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    {item.size && <p className="text-xs text-gray-600">المقاس: {item.size}</p>}
                    <p className="text-xs text-gray-600">الكمية: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">{(item.price * item.quantity).toFixed(2)} DA</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>المجموع الفرعي</span>
                <span>{cart.totalPrice.toFixed(2)} DA</span>
              </div>
              <div className="flex justify-between">
                <span>الشحن ({deliveryType === 'home' ? 'للمنزل' : 'للمكتب'})</span>
                <span>
                  {formData.wilaya ? (
                    cart.totalPrice >= 10000 ? (
                      <span className="text-green-600 font-semibold">مجاني</span>
                    ) : shippingFee > 0 ? (
                      `${shippingFee.toFixed(2)} DA`
                    ) : (
                      'غير متاح'
                    )
                  ) : (
                    'اختر الولاية'
                  )}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                <span>المجموع الكلي</span>
                <span>{(cart.totalPrice + shippingFee).toFixed(2)} DA</span>
              </div>
            </div>

            {cart.totalPrice >= 10000 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-700 font-medium text-center">
                  🎉 لقد حصلت على الشحن المجاني!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}