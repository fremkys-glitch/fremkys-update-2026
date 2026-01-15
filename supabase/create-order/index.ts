import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const supabaseUrl = 'https://xktmwzqqlbkymlsavutn.supabase.co';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseKey!);

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

const AIRTABLE_CONFIG = {
  apiKey: Deno.env.get('AIRTABLE_API_KEY') || 'patO4zErdHJF4rokY.4f661e6545ddf1a26ad7d93933881edfcf71476fe710263c4d034398d87e05e2',
  baseId: Deno.env.get('AIRTABLE_BASE_ID') || 'appHEqfWbNHzk3zft',
  tableName: Deno.env.get('AIRTABLE_TABLE_NAME') || 'Orders'
};

async function sendToAirtable(orderData: any, retryCount = 0, maxRetries = 3) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 بدء إرسال الطلب إلى Airtable');
  if (retryCount > 0) {
    console.log(`🔄 محاولة رقم ${retryCount + 1} من ${maxRetries + 1}`);
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (!AIRTABLE_CONFIG.apiKey || !AIRTABLE_CONFIG.baseId) {
    console.error('❌ مفاتيح Airtable غير موجودة!');
    return { success: false, error: 'مفاتيح Airtable غير مكونة' };
  }

  console.log('✅ مفاتيح Airtable موجودة');

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableName}`;
    console.log('🌐 URL:', url);
    
    // استخدام أسماء الحقول بالضبط كما في Airtable
    // الحقول المحسوبة (Formula) و AI لا نرسلها لأنها تُحسب تلقائياً
    const fields = {
      'Order Number': String(orderData.order_number || ''),
      'customer_first_name': String(orderData.customer_first_name || ''),
      'customer_last_name': String(orderData.customer_last_name || ''),
      'customer_email': String(orderData.customer_email || ''),
      'customer_phone': String(orderData.customer_phone || ''),
      'Shipping Address': String(orderData.shipping_address || ''),
      'shipping_city': String(orderData.shipping_city || ''),
      'shipping_wilaya': String(orderData.shipping_wilaya || ''),
      'delivery_type': String(orderData.delivery_type || 'home'),
      'notes': String(orderData.notes || ''),
      'product_name': String(orderData.product_name || ''),
      'product_size': String(orderData.product_size || ''),
      'subtotal': Number(orderData.subtotal || 0),
      'shipping_fee': Number(orderData.shipping_fee || 0),
      'Total': Number(orderData.total || 0),
      'status': String(orderData.status || 'طلب جديد')
    };

    const payload = { fields };
    console.log('📤 عدد الحقول المرسلة:', Object.keys(fields).length);
    console.log('📋 البيانات:', JSON.stringify(fields, null, 2));

    console.log('⏳ جاري الإرسال إلى Airtable...');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log('📥 Response Status:', response.status);
    
    const responseText = await response.text();
    console.log('📥 Response Body:', responseText);

    if (!response.ok) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ فشل الإرسال إلى Airtable');
      console.error('Status:', response.status);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      let errorMessage = 'فشل الإرسال إلى Airtable';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error?.message || errorData.error?.type || errorMessage;
        console.error('تفاصيل الخطأ:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        console.error('الرد الخام:', responseText);
      }
      return { success: false, error: errorMessage, status: response.status, rawError: responseText };
    }

    const responseData = JSON.parse(responseText);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ نجح الإرسال إلى Airtable!');
    console.log('✅ معرف السجل:', responseData.id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return { success: true, data: responseData };

  } catch (error: any) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ خطأ في الاتصال بـ Airtable');
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
      return sendToAirtable(orderData, retryCount + 1, maxRetries);
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
      status: 'طلب جديد'
    };

    console.log('🎯 إرسال البيانات إلى Airtable...');
    const airtableResult = await sendToAirtable(orderData);

    if (!airtableResult.success) {
      console.error('⚠️ فشل الإرسال إلى Airtable:', airtableResult.error);
      console.warn('⚠️ سيتم حفظ الطلب في Supabase فقط');
    }

    console.log('💾 حفظ الطلب في Supabase...');
    const dbData = {
      order_number: orderNumber,
      customer_first_name: customer.firstName,
      customer_last_name: customer.lastName,
      customer_email: customer.email || '',
      customer_phone: customer.phone,
      shipping_address: customer.address,
      shipping_city: customer.city,
      shipping_wilaya: customer.wilaya,
      delivery_type: customer.deliveryType || 'home',
      notes: customer.notes || '',
      status: 'pending',
      created_at: timestamp
    };

    const { data: order, error } = await supabase
      .from('orders')
      .insert([dbData])
      .select()
      .maybeSingle();

    if (error) {
      console.error('⚠️ فشل الحفظ في Supabase:', error);

      return new Response(JSON.stringify({
        success: false,
        error: 'فشل حفظ الطلب في قاعدة البيانات',
        airtableSuccess: airtableResult.success,
        airtableRecordId: airtableResult.data?.id || null,
        details: error
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ تم حفظ الطلب في Supabase');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅✅✅ تم إنشاء الطلب بنجاح! ✅✅✅');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return new Response(JSON.stringify({
      success: true,
      orderId: order?.id || null,
      orderNumber: orderNumber,
      airtableRecordId: airtableResult.data?.id || null,
      airtableSuccess: airtableResult.success,
      message: airtableResult.success
        ? 'تم إنشاء الطلب وإرساله إلى Airtable بنجاح'
        : 'تم حفظ الطلب (فشل الإرسال إلى Airtable)'
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