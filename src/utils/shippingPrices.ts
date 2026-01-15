export interface ShippingPrice {
  home: number | null;
  office: number | null;
}

export const SHIPPING_PRICES: Record<string, ShippingPrice> = {
  'Adrar': { home: 1200, office: 900 },
  'Aïn Defla': { home: 900, office: 450 },
  'Aïn Témouchent': { home: 900, office: 450 },
  'Alger': { home: 400, office: 300 },
  'Annaba': { home: 850, office: 450 },
  'Batna': { home: 900, office: 450 },
  'Béjaïa': { home: 800, office: 450 },
  'Béchar': { home: 1000, office: 650 },
  'Béni Abbès': { home: 950, office: 900 },
  'Biskra': { home: 950, office: 550 },
  'Blida': { home: 600, office: 400 },
  'Bordj Bou Arréridj': { home: 800, office: 450 },
  'Bordj Badji Mokhtar': { home: null, office: null },
  'Boumerdès': { home: 700, office: 450 },
  'Bouira': { home: 800, office: 450 },
  'Chlef': { home: 850, office: 450 },
  'Constantine': { home: 800, office: 450 },
  'Djanet': { home: null, office: null },
  'Djelfa': { home: 950, office: 550 },
  'El Bayadh': { home: 1000, office: 600 },
  'El Oued': { home: 950, office: 600 },
  'El Tarf': { home: 850, office: 450 },
  'Ghardaïa': { home: 950, office: 550 },
  'Guelma': { home: 900, office: 450 },
  'Illizi': { home: null, office: null },
  'In Salah': { home: 1500, office: null },
  'In Guezzam': { home: 1500, office: null },
  'Jijel': { home: 900, office: 450 },
  'Khenchela': { home: 900, office: 450 },
  'Laghouat': { home: 950, office: 550 },
  'Mascara': { home: 900, office: 450 },
  'Médéa': { home: 800, office: 450 },
  'El Meniaa': { home: 950, office: null },
  'Mila': { home: 900, office: 450 },
  'Mostaganem': { home: 900, office: 450 },
  'M\'Sila': { home: 850, office: 500 },
  'Naâma': { home: 950, office: 600 },
  'Oran': { home: 800, office: 450 },
  'Ouargla': { home: 950, office: 600 },
  'Ouled Djellal': { home: 950, office: 550 },
  'Oum El Bouaghi': { home: 850, office: 450 },
  'Relizane': { home: 900, office: 450 },
  'Saïda': { home: 900, office: 500 },
  'Sidi Bel Abbès': { home: 900, office: 450 },
  'Skikda': { home: 900, office: 450 },
  'Souk Ahras': { home: 900, office: 450 },
  'Sétif': { home: 800, office: 450 },
  'Tamanrasset': { home: 1500, office: 1050 },
  'Tébessa': { home: 900, office: 450 },
  'Tiaret': { home: 850, office: 450 },
  'Timimoun': { home: 1200, office: 900 },
  'Tindouf': { home: null, office: null },
  'Tissemsilt': { home: 900, office: 600 },
  'Tizi Ouzou': { home: 750, office: 450 },
  'Tlemcen': { home: 900, office: 500 },
  'Touggourt': { home: 950, office: 600 },
  'Tipaza': { home: 700, office: 450 },
  'El M\'Ghair': { home: 950, office: null },
};

export function getShippingPrice(wilaya: string, deliveryType: 'home' | 'office'): number | null {
  const prices = SHIPPING_PRICES[wilaya];
  if (!prices) return null;
  return deliveryType === 'home' ? prices.home : prices.office;
}

export function isDeliveryAvailable(wilaya: string, deliveryType: 'home' | 'office'): boolean {
  const price = getShippingPrice(wilaya, deliveryType);
  return price !== null;
}
