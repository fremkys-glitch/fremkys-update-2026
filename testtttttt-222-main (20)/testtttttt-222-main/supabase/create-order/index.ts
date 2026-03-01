const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface OrderRequest {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    wilaya: string;
    deliveryType?: string;
    notes?: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    size?: string;
  }>;
  shippingFee: number;
}

// إعدادات SeaTable
const SEATABLE_CONFIG = {
  serverUrl: Deno.env.get('VITE_SEATABLE_SERVER_URL') || 'https://cloud.seatable.io',
  apiToken: Deno.env.get('VITE_SEATABLE_ORDERS_API_TOKEN') || '5a94590bde7e4a7d87e582e8a6cfb2ac267c30a9',
  baseUuid: Deno.env.get('VITE_SEATABLE_ORDERS_BASE_UUID') || '10ebbfdd-784e-4df4-99ea-d333998a6bf3',
  tableName: 'airtable_orders'
};

// دالة للحصول على Base Token من SeaTable
async function getSeaTableBaseToken(): Promise<string> {
  console.log('🔑 جاري الحصول على Base Token من SeaTable...');
  
  const url = `${SEATABLE_CONFIG.serverUrl}/api/v2.1/dtable/app-access-token/`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${SEATABLE_CONFIG.apiToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ فشل الحصول على Base Token:', response.status, errorText);
    throw new Error(`فشل الحصول على Base Token: ${response.status}`);
  }

  const data = await response.json();
  console.log('✅ تم الحصول على Base Token بنجاح');
  
  return data.access_token;
}

// دالة إرسال الطلب إلى SeaTable
async function sendToSeaTable(orderData: any, retryCount = 0, maxRetries = 3) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 بدء إرسال الطلب إلى SeaTable');
  if (retryCount > 0) {
    console.log(`🔄 محاولة رقم ${retryCount + 1} من ${maxRetries + 1}`);
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (!SEATABLE_CONFIG.apiToken || !SEATABLE_CONFIG.baseUuid) {
    console.error('❌ مفاتيح SeaTable غير موجودة!');
    return { success: false, error: 'مفاتيح SeaTable غير مكونة' };
  }

  console.log('✅ مفاتيح SeaTable موجودة');
  console.log('📍 Server:', SEATABLE_CONFIG.serverUrl);
  console.log('📍 Base UUID:', SEATABLE_CONFIG.baseUuid);
  console.log('📍 Table:', SEATABLE_CONFIG.tableName);

  try {
    // الحصول على Base Token
    const baseToken = await getSeaTableBaseToken();

    // تحضير البيانات للإرسال
    const rowData = {
      'order_number': String(orderData.order_number || ''),
      'customer_first_name': String(orderData.customer_first_name || ''),
      'customer_last_name': String(orderData.customer_last_name || ''),
      'customer_email': String(orderData.customer_email || ''),
      'customer_phone': String(orderData.customer_phone || ''),
      'shipping_address': String(orderData.shipping_address || ''),
      'shipping_city': String(orderData.shipping_city || ''),
      'shipping_wilaya': String(orderData.shipping_wilaya || ''),
      'delivery_type': String(orderData.delivery_type || 'home'),
      'notes': String(orderData.notes || ''),
      'product_name': String(orderData.product_name || ''),
      'product_size': String(orderData.product_size || ''),
      'subtotal': Number(orderData.subtotal || 0),
      'shipping_fee': Number(orderData.shipping_fee || 0),
      'total': Number(orderData.total || 0),
      'status': String(orderData.status || 'طلب جديد')
    };

    console.log('📤 عدد الحقول المرسلة:', Object.keys(rowData).length);
    console.log('📋 البيانات:', JSON.stringify(rowData, null, 2));

    // إرسال البيانات إلى SeaTable
    const url = `${SEATABLE_CONFIG.serverUrl}/dtable-server/api/v1/dtables/${SEATABLE_CONFIG.baseUuid}/rows/`;
    console.log('🌐 URL:', url);
    console.log('⏳ جاري الإرسال إلى SeaTable...');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${baseToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        table_name: SEATABLE_CONFIG.tableName,
        row: rowData
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log('📥 Response Status:', response.status);
    
    const responseText = await response.text();
    console.log('📥 Response Body:', responseText);

    if (!response.ok) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ فشل الإرسال إلى SeaTable');
      console.error('Status:', response.status);
      console.error('Response:', responseText);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      return { 
        success: false, 
        error: `فشل الإرسال إلى SeaTable: ${response.status}`,
        status: response.status,
        rawError: responseText 
      };
    }

    const responseData = JSON.parse(responseText);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ نجح الإرسال إلى SeaTable!');
    console.log('✅ معرف السجل:', responseData._id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return { success: true, data: responseData };

  } catch (error: any) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ خطأ في الاتصال بـ SeaTable');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const isNetworkError = error.name === 'AbortError' ||
                          error.message.includes('network') ||
                          error.message.includes('timeout') ||
                          error.message.includes('ECONNREFUSED');

    if (isNetworkError && retryCount < maxRetries) {
      console.warn(`⏳ إعادة المحاولة بعد ${(retryCount + 1) * 2} ثانية...`);
      await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
      return sendToSeaTable(orderData, retryCount + 1, maxRetries);
    }

    return { success: false, error: error.message };
  }
}

Deno.serve(async (req: Request) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📨 استقبال طلب جديد');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight request');
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: OrderRequest = await req.json();
    console.log('📦 تم استقبال البيانات من Frontend');
    
    const { customer, items, shippingFee } = body;

    // التحقق من البيانات
    if (!items || items.length === 0) {
      throw new Error('يجب أن يحتوي الطلب على منتج واحد على الأقل');
    }

    if (!customer?.firstName || !customer?.lastName || !customer?.phone) {
      throw new Error('البيانات المطلوبة ناقصة (الاسم والهاتف مطلوبان)');
    }

    console.log('✅ التحقق من البيانات تم بنجاح');
    console.log('👤 العميل:', customer.firstName, customer.lastName);
    console.log('📱 الهاتف:', customer.phone);
    console.log('📦 عدد المنتجات:', items.length);

    // حساب الأسعار
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + shippingFee;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    
    const productNames = items.map(item => `${item.name} (x${item.quantity})`).join(', ');
    const productSizes = items.map(item => item.size ? `${item.size} (x${item.quantity})` : 'بدون مقاس').join(', ');

    const timestamp = new Date().toISOString();
    const orderNumber = `FREMKYS-${Date.now()}`;

    console.log('📋 رقم الطلب:', orderNumber);
    console.log('💰 المجموع الفرعي:', subtotal, 'DZD');
    console.log('🚚 رسوم الشحن:', shippingFee, 'DZD');
    console.log('💵 الإجمالي:', total, 'DZD');

    const orderData = {
      order_number: orderNumber,
      customer_first_name: customer.firstName,
      customer_last_name: customer.lastName,
      customer_email: customer.email || '',
      customer_phone: customer.phone,
      shipping_address: customer.address || '',
      shipping_city: customer.city || '',
      shipping_wilaya: customer.wilaya || '',
      delivery_type: customer.deliveryType || 'home',
      notes: customer.notes || '',
      product_name: productNames,
      product_size: productSizes,
      quantity: totalQuantity,
      subtotal: Math.round(subtotal * 100) / 100,
      shipping_fee: Math.round(shippingFee * 100) / 100,
      total: Math.round(total * 100) / 100,
      status: 'طلب جديد',
      created_at: timestamp
    };

    console.log('🎯 إرسال البيانات إلى SeaTable...');
    const seatableResult = await sendToSeaTable(orderData);

    if (!seatableResult.success) {
      console.error('❌ فشل الإرسال إلى SeaTable:', seatableResult.error);
      
      return new Response(JSON.stringify({
        success: false,
        error: 'فشل حفظ الطلب في SeaTable',
        details: seatableResult.error,
        orderNumber: orderNumber
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅✅✅ تم إنشاء الطلب بنجاح! ✅✅✅');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return new Response(JSON.stringify({
      success: true,
      orderNumber: orderNumber,
      seatableRecordId: seatableResult.data?._id || null,
      message: 'تم إنشاء الطلب وحفظه في SeaTable بنجاح ✅'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ خطأ في إنشاء الطلب');
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return new Response(JSON.stringify({
      success: false,
      error: err.message || 'خطأ في إنشاء الطلب'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
