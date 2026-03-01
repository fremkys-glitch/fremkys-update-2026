import { CheckCircle, Package, Phone } from 'lucide-react';

interface OrderConfirmationProps {
  orderId?: string;
  orderNumber?: string;
  onNavigate: (page: string) => void;
}

export default function OrderConfirmation({ orderNumber, onNavigate }: OrderConfirmationProps) {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-4xl font-light mb-4">تم تأكيد طلبك بنجاح!</h1>
        <p className="text-gray-600 text-lg">
          شكرًا لك على الثقة في FREMKYS
        </p>
      </div>

      {orderNumber && (
        <div className="bg-gray-50 border border-gray-200 p-6 mb-8 text-center">
          <p className="text-sm text-gray-600 mb-2">رقم الطلب</p>
          <p className="text-2xl font-light tracking-wider">{orderNumber}</p>
        </div>
      )}

      <div className="space-y-6 mb-8">
        <div className="flex items-start space-x-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <Phone className="flex-shrink-0 mt-1 text-blue-600" size={20} />
          <div>
            <h3 className="font-semibold mb-1 text-blue-900">سيتم الاتصال بك قريبًا</h3>
            <p className="text-sm text-blue-800">
              سيتواصل معك فريقنا في أقرب وقت لتأكيد الطلب وتفاصيل الشحن.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-4 bg-green-50 border border-green-200 rounded">
          <Package className="flex-shrink-0 mt-1 text-green-600" size={20} />
          <div>
            <h3 className="font-semibold mb-1 text-green-900">الشحن والتسليم</h3>
            <p className="text-sm text-green-800">
              سيتم شحن طلبك خلال 24-48 ساعة بعد التأكيد. مدة التوصيل من 2 إلى 7 أيام عمل حسب الولاية.
            </p>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-200 pt-8">
        <h3 className="font-semibold mb-4">ماذا بعد؟</h3>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-8">
          <li>سيتصل بك فريق خدمة العملاء لتأكيد الطلب</li>
          <li>بعد التأكيد، سيتم شحن طلبك</li>
          <li>ستتلقى رابط تتبع الشحنة عبر الرسائل القصيرة</li>
          <li>يمكنك فحص المنتج قبل الدفع عند الاستلام</li>
        </ol>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onNavigate('shop')}
            className="flex-1 bg-black text-white py-4 hover:bg-gray-800 transition"
          >
            مواصلة التسوق
          </button>
          <button
            onClick={() => onNavigate('track')}
            className="flex-1 border border-black py-4 hover:bg-gray-50 transition"
          >
            تتبع طلبي
          </button>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>هل تحتاج إلى مساعدة؟</p>
        <p className="mt-2">
          اتصل بنا على <a href="tel:+213792221056" className="font-medium hover:underline">+213 792 22 10 56</a>
          {' '}أو راسلنا على{' '}
          <a href="mailto:fremkysboutique@gmail.com" className="font-medium hover:underline">
            fremkysboutique@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
