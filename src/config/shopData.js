/**
 * Shop Data Configuration
 * Single source of truth for all shop information across the application
 */

export const SHOP_INFO = {
  tolworth: {
    id: 'tolworth',
    name: 'Tolworth',
    address: '142 Tolworth Broadway, Surbiton, KT6 7JD',
    hours: {
      'Monday-Wednesday': '10:00 AM - 7:00 PM',
      'Thursday-Saturday': '10:00 AM - 8:00 PM',
      'Sunday': 'Closed'
    }
  },
  kingston: {
    id: 'kingston',
    name: 'Kingston',
    address: '32 Surbiton Road, Kingston upon Thames, KT1 2HX',
    hours: {
      'Monday-Wednesday': '10:00 AM - 7:00 PM',
      'Thursday-Saturday': '10:00 AM - 8:00 PM',
      'Sunday': 'Closed'
    }
  },
  west: {
    id: 'west',
    name: 'West',
    address: '70 North End Rd, London, W14 9EP',
    hours: {
      'Monday-Saturday': '10:00 AM - 5:00 PM',
      'Sunday': 'Closed'
    }
  },
  birmingham: {
    id: 'birmingham',
    name: 'Birmingham (Primark)',
    address: 'Primark, 38 High Street, Birmingham, B4 7SL',
    hours: {
      'Monday-Saturday': '8:00 AM - 9:00 PM',
      'Sunday': '11:00 AM - 5:00 PM'
    }
  },
  manchester: {
    id: 'manchester',
    name: 'Manchester (Primark)',
    address: 'Primark, 106-122 Market Street, Manchester, M1 1WA',
    hours: {
      'Monday-Saturday': '8:00 AM - 8:00 PM',
      'Sunday': '11:00 AM - 5:00 PM'
    }
  }
};

/**
 * Get shop info by ID
 */
export function getShopInfo(shopId) {
  return SHOP_INFO[shopId] || SHOP_INFO.tolworth;
}

/**
 * Get today's opening hours for a shop
 */
export function getTodaysHours(shopId) {
  const shop = SHOP_INFO[shopId];
  if (!shop) return 'Unknown';

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1-6 = Mon-Sat

  if (dayOfWeek === 0) {
    return shop.hours['Sunday'] || 'Closed';
  } else if (dayOfWeek >= 4) {
    return shop.hours['Thursday-Saturday'] || shop.hours['Monday-Saturday'] || 'Unknown';
  } else {
    return shop.hours['Monday-Wednesday'] || shop.hours['Monday-Saturday'] || 'Unknown';
  }
}

/**
 * Check if shop is open today
 */
export function isShopOpen(shopId) {
  return getTodaysHours(shopId) !== 'Closed';
}

/**
 * Get all shops as array (useful for dropdowns)
 */
export function getAllShops() {
  return Object.values(SHOP_INFO);
}
