const AIRTABLE = {
  apiKey: 'patO4zErdHJF4rokY.4f661e6545ddf1a26ad7d93933881edfcf71476fe710263c4d034398d87e05e2',
  baseId: 'appHEqfWbNHzk3zft',
  tableName: 'Orders'
};

console.log('✅ Airtable configuration loaded successfully');

export async function submitOrderToAirtable(orderData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  wilaya: string;
  deliveryType: string;
  productName: string;
  productSize: string;
  notes: string;
  subtotal: number;
  shippingFee: number;
}) {
  const url = `https://api.airtable.com/v0/${AIRTABLE.baseId}/${AIRTABLE.tableName}`;

  console.log('📤 Submitting order to:', url);
  console.log('📦 Order data:', orderData);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          customer_first_name: orderData.firstName,
          customer_last_name: orderData.lastName,
          customer_email: orderData.email,
          customer_phone: orderData.phone,
          shipping_address: orderData.address,
          shipping_city: orderData.city,
          shipping_wilaya: orderData.wilaya,
          delivery_type: orderData.deliveryType || "توصيل منزلي",
          product_name: orderData.productName,
          product_size: orderData.productSize,
          notes: orderData.notes || "",
          subtotal: parseFloat(String(orderData.subtotal)) || 0,
          shipping_fee: parseFloat(String(orderData.shippingFee)) || 0,
          status: "طلب جديد"
        }
      })
    });

    const data = await response.json();

    console.log('📥 Response status:', response.status);
    console.log('📥 Response data:', data);

    if (response.ok) {
      console.log('✅ تم إرسال طلبك بنجاح! رقم الطلب:', data.id);
      return { success: true, data };
    } else {
      console.error('❌ Airtable error:', data);
      return { success: false, error: data };
    }

  } catch (error) {
    console.error('❌ Network error:', error);
    return { success: false, error };
  }
}
