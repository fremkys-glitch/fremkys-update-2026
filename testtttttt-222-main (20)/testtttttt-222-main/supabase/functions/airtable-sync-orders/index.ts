import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://xktmwzqqlbkymlsavutn.supabase.co';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseKey!);

interface OrderRequest {
  customer: {
    firstName: string;
    lastName: string;
    email?: string;
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

Deno.serve(async (req: Request) => {
  console.log('New order request received');
  console.log('Method:', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: OrderRequest = await req.json();
    console.log('Order data received from frontend');

    const { customer, items, shippingFee } = body;

    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    if (!customer?.firstName || !customer?.lastName || !customer?.phone) {
      throw new Error('Required customer data missing');
    }

    console.log('Customer:', customer.firstName, customer.lastName);
    console.log('Phone:', customer.phone);
    console.log('Items count:', items.length);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + shippingFee;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    const productNames = items.map(item => `${item.name} (x${item.quantity})`).join(', ');
    const productSizes = items.map(item => item.size ? `${item.size} (x${item.quantity})` : 'No Size').join(', ');

    const timestamp = new Date().toISOString();
    const orderNumber = `FREMKYS-${Date.now()}`;

    console.log('Order Number:', orderNumber);
    console.log('Subtotal:', subtotal, 'DA');
    console.log('Shipping Fee:', shippingFee, 'DA');
    console.log('Total:', total, 'DA');

    const orderData = {
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
      items: items,
      product_name: productNames,
      product_size: productSizes,
      quantity: totalQuantity,
      subtotal: Math.round(subtotal * 100) / 100,
      shipping_fee: Math.round(shippingFee * 100) / 100,
      total: Math.round(total * 100) / 100,
      status: 'طلب جديد',
      created_at: timestamp
    };

    console.log('Saving order to airtable_orders table...');
    const { data: order, error } = await supabase
      .from('airtable_orders')
      .insert([orderData])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Failed to save order:', error);

      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to save order to database',
        details: error
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Order saved successfully!');
    console.log('Order ID:', order?.id);

    return new Response(JSON.stringify({
      success: true,
      orderId: order?.id || null,
      orderNumber: orderNumber,
      message: 'Order created successfully'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('Error creating order:', err.message);
    console.error('Stack:', err.stack);

    return new Response(JSON.stringify({
      success: false,
      error: err.message || 'Error creating order'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
