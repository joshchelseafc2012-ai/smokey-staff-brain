/**
 * Square Service Layer
 * Abstraction layer for Square API calls
 * Currently uses mock data for development
 * TODO: Replace mock data with real Square API calls when credentials available
 */

const SQUARE_API_KEY = process.env.REACT_APP_SQUARE_ACCESS_TOKEN || '';
const SQUARE_LOCATION_ID = process.env.REACT_APP_SQUARE_LOCATION_ID || 'tolworth';

// ============================================================================
// MOCK DATA - Replace with real Square API calls in production
// ============================================================================

const mockBookings = [
  {
    id: 'booking_001',
    clientId: 'cust_001',
    clientName: 'Marcus',
    clientPhone: '+44 7700 123456',
    startTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // 1 hour from now
    endTime: new Date(new Date().getTime() + 90 * 60 * 1000).toISOString(),
    service: 'Skin Fade + Beard',
    duration: 30,
    price: 35,
    staffName: 'Jay',
    staffId: 'staff_001',
    status: 'confirmed',
    notes: 'Client prefers tight fade'
  },
  {
    id: 'booking_002',
    clientId: 'cust_002',
    clientName: 'D',
    clientPhone: '+44 7700 234567',
    startTime: new Date(new Date().getTime() + 120 * 60 * 1000).toISOString(),
    endTime: new Date(new Date().getTime() + 150 * 60 * 1000).toISOString(),
    service: 'Skin Fade',
    duration: 30,
    price: 25,
    staffName: 'Trey',
    staffId: 'staff_002',
    status: 'confirmed',
    notes: ''
  },
  {
    id: 'booking_003',
    clientId: 'cust_003',
    clientName: 'Chris',
    clientPhone: '+44 7700 345678',
    startTime: new Date(new Date().getTime() + 180 * 60 * 1000).toISOString(),
    endTime: new Date(new Date().getTime() + 210 * 60 * 1000).toISOString(),
    service: 'Beard Line + Detail',
    duration: 30,
    price: 20,
    staffName: 'Jay',
    staffId: 'staff_001',
    status: 'confirmed',
    notes: 'First time client'
  }
];

const mockCustomers = [
  {
    id: 'cust_001',
    name: 'Marcus',
    email: 'marcus@example.com',
    phone: '+44 7700 123456',
    visits: 15,
    lastVisit: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    totalSpent: 450,
    favoriteStaff: 'Jay',
    favoriteService: 'Skin Fade + Beard',
    notes: 'Preferred barber: Jay, tight fades'
  },
  {
    id: 'cust_002',
    name: 'D',
    email: 'd@example.com',
    phone: '+44 7700 234567',
    visits: 8,
    lastVisit: new Date(new Date().getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
    totalSpent: 200,
    favoriteStaff: 'Trey',
    favoriteService: 'Skin Fade',
    notes: ''
  },
  {
    id: 'cust_003',
    name: 'Chris',
    email: 'chris@example.com',
    phone: '+44 7700 345678',
    visits: 1,
    lastVisit: new Date().toISOString(),
    totalSpent: 25,
    favoriteStaff: null,
    favoriteService: null,
    notes: 'First time customer'
  },
  {
    id: 'cust_004',
    name: 'John',
    email: 'john@example.com',
    phone: '+44 7700 456789',
    visits: 0,
    lastVisit: null,
    totalSpent: 0,
    favoriteStaff: null,
    favoriteService: null,
    notes: 'Prospect'
  }
];

const mockPayments = [
  {
    id: 'pay_001',
    customerId: 'cust_001',
    customerName: 'Marcus',
    amount: 35,
    currency: 'GBP',
    date: new Date().toISOString(),
    method: 'card',
    status: 'completed',
    bookingId: 'booking_001',
    service: 'Skin Fade + Beard'
  },
  {
    id: 'pay_002',
    customerId: 'cust_002',
    customerName: 'D',
    amount: 25,
    currency: 'GBP',
    date: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    method: 'card',
    status: 'completed',
    bookingId: null,
    service: 'Walk-in: Skin Fade'
  },
  {
    id: 'pay_003',
    customerId: 'cust_003',
    customerName: 'Chris',
    amount: 20,
    currency: 'GBP',
    date: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    method: 'cash',
    status: 'completed',
    bookingId: null,
    service: 'Walk-in: Beard Line'
  }
];

const mockInventory = [
  {
    id: 'inv_001',
    name: 'Clipper Blades (0.5mm)',
    category: 'Clippers',
    quantity: 12,
    minThreshold: 5,
    reorderPoint: 10,
    unit: 'pack',
    lastRestocked: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inv_002',
    name: 'Beard Oil',
    category: 'Products',
    quantity: 2,
    minThreshold: 3,
    reorderPoint: 5,
    unit: 'bottle',
    lastRestocked: new Date(new Date().getTime() - 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inv_003',
    name: 'Matt Clay (Pomade)',
    category: 'Products',
    quantity: 8,
    minThreshold: 3,
    reorderPoint: 6,
    unit: 'jar',
    lastRestocked: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inv_004',
    name: 'Neck Strips',
    category: 'Supplies',
    quantity: 50,
    minThreshold: 20,
    reorderPoint: 40,
    unit: 'pack',
    lastRestocked: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inv_005',
    name: 'Disinfectant Spray',
    category: 'Supplies',
    quantity: 3,
    minThreshold: 2,
    reorderPoint: 4,
    unit: 'bottle',
    lastRestocked: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const mockStaff = [
  {
    id: 'staff_001',
    name: 'Jay',
    email: 'jay@smokey.com',
    role: 'barber',
    phone: '+44 7700 111111',
    appointmentsToday: 12,
    appointmentsThisWeek: 45,
    revenueToday: 360,
    revenueThisWeek: 1200,
    rebookRate: 0.92,
    noShowRate: 0.05,
    averageRating: 4.8
  },
  {
    id: 'staff_002',
    name: 'Trey',
    email: 'trey@smokey.com',
    role: 'barber',
    phone: '+44 7700 222222',
    appointmentsToday: 10,
    appointmentsThisWeek: 38,
    revenueToday: 280,
    revenueThisWeek: 950,
    rebookRate: 0.88,
    noShowRate: 0.08,
    averageRating: 4.6
  },
  {
    id: 'staff_003',
    name: 'Sam',
    email: 'sam@smokey.com',
    role: 'barber',
    phone: '+44 7700 333333',
    appointmentsToday: 8,
    appointmentsThisWeek: 32,
    revenueToday: 200,
    revenueThisWeek: 780,
    rebookRate: 0.85,
    noShowRate: 0.10,
    averageRating: 4.5
  }
];

const mockLoyalty = [
  {
    customerId: 'cust_001',
    customerName: 'Marcus',
    pointsBalance: 450,
    pointsThisMonth: 50,
    tier: 'gold',
    pointsToNextTier: 50,
    lastRedeemDate: new Date(new Date().getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    lastRedeemedAmount: 100,
    createdAt: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    joinDate: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    customerId: 'cust_002',
    customerName: 'D',
    pointsBalance: 200,
    pointsThisMonth: 25,
    tier: 'silver',
    pointsToNextTier: 300,
    lastRedeemDate: null,
    lastRedeemedAmount: 0,
    createdAt: new Date(new Date().getTime() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    joinDate: new Date(new Date().getTime() - 180 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    customerId: 'cust_003',
    customerName: 'Chris',
    pointsBalance: 0,
    pointsThisMonth: 0,
    tier: 'bronze',
    pointsToNextTier: 500,
    lastRedeemDate: null,
    lastRedeemedAmount: 0,
    createdAt: new Date().toISOString(),
    joinDate: new Date().toISOString()
  }
];

// ============================================================================
// BOOKINGS API
// ============================================================================

/**
 * Get all bookings for a location
 * TODO: Replace with Square API call to /v2/locations/{location_id}/bookings
 */
export const getBookings = async (locationId = SQUARE_LOCATION_ID, dateRange = 'today') => {
  try {
    // TODO: const response = await fetch(`https://sqrd.square.com/v2/locations/${locationId}/bookings?date=${dateRange}`, {
    // TODO:   headers: { 'Authorization': `Bearer ${SQUARE_API_KEY}` }
    // TODO: });
    
    // Mock implementation
    return Promise.resolve(mockBookings.filter(b => b.status !== 'cancelled'));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

/**
 * Create a new booking
 * TODO: Replace with Square API call to POST /v2/locations/{location_id}/bookings
 */
export const createBooking = async (bookingData) => {
  try {
    // TODO: const response = await fetch(`https://sqrd.square.com/v2/locations/${SQUARE_LOCATION_ID}/bookings`, {
    // TODO:   method: 'POST',
    // TODO:   headers: { 'Authorization': `Bearer ${SQUARE_API_KEY}` },
    // TODO:   body: JSON.stringify(bookingData)
    // TODO: });

    // Mock implementation
    const newBooking = {
      id: `booking_${Date.now()}`,
      ...bookingData,
      status: 'confirmed'
    };
    return Promise.resolve(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

/**
 * Update an existing booking
 * TODO: Replace with Square API call to PUT /v2/locations/{location_id}/bookings/{booking_id}
 */
export const updateBooking = async (bookingId, updates) => {
  try {
    // TODO: const response = await fetch(`https://sqrd.square.com/v2/locations/${SQUARE_LOCATION_ID}/bookings/${bookingId}`, {
    // TODO:   method: 'PUT',
    // TODO:   headers: { 'Authorization': `Bearer ${SQUARE_API_KEY}` },
    // TODO:   body: JSON.stringify(updates)
    // TODO: });

    // Mock implementation
    const booking = mockBookings.find(b => b.id === bookingId);
    if (!booking) throw new Error(`Booking ${bookingId} not found`);
    
    const updated = { ...booking, ...updates };
    return Promise.resolve(updated);
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (bookingId) => {
  return updateBooking(bookingId, { status: 'cancelled' });
};

// ============================================================================
// CUSTOMERS API
// ============================================================================

/**
 * Get all customers for a location
 * TODO: Replace with Square API call to /v2/customers
 */
export const getCustomers = async (locationId = SQUARE_LOCATION_ID) => {
  try {
    // TODO: const response = await fetch(`https://sqrd.square.com/v2/customers`, {
    // TODO:   headers: { 'Authorization': `Bearer ${SQUARE_API_KEY}` }
    // TODO: });

    return Promise.resolve(mockCustomers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

/**
 * Get a single customer by ID
 * TODO: Replace with Square API call to /v2/customers/{customer_id}
 */
export const getCustomer = async (customerId) => {
  try {
    // TODO: const response = await fetch(`https://sqrd.square.com/v2/customers/${customerId}`, {
    // TODO:   headers: { 'Authorization': `Bearer ${SQUARE_API_KEY}` }
    // TODO: });

    const customer = mockCustomers.find(c => c.id === customerId);
    if (!customer) throw new Error(`Customer ${customerId} not found`);
    
    return Promise.resolve(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
};

/**
 * Search customers by name or phone
 */
export const searchCustomers = async (query) => {
  try {
    // TODO: Replace with Square API call with search query

    const lowerQuery = query.toLowerCase();
    return Promise.resolve(
      mockCustomers.filter(c => 
        c.name.toLowerCase().includes(lowerQuery) ||
        c.phone.includes(query) ||
        c.email.includes(lowerQuery)
      )
    );
  } catch (error) {
    console.error('Error searching customers:', error);
    throw error;
  }
};

/**
 * Create a new customer
 * TODO: Replace with Square API call to POST /v2/customers
 */
export const createCustomer = async (customerData) => {
  try {
    // TODO: const response = await fetch(`https://sqrd.square.com/v2/customers`, {
    // TODO:   method: 'POST',
    // TODO:   headers: { 'Authorization': `Bearer ${SQUARE_API_KEY}` },
    // TODO:   body: JSON.stringify(customerData)
    // TODO: });

    const newCustomer = {
      id: `cust_${Date.now()}`,
      ...customerData,
      visits: 0,
      lastVisit: null,
      totalSpent: 0
    };
    return Promise.resolve(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

// ============================================================================
// PAYMENTS & REVENUE API
// ============================================================================

/**
 * Get payments for a location and date range
 * TODO: Replace with Square API call to /v2/payments
 */
export const getPayments = async (locationId = SQUARE_LOCATION_ID, dateRange = 'today') => {
  try {
    // TODO: const response = await fetch(`https://sqrd.square.com/v2/payments?location_id=${locationId}&date=${dateRange}`, {
    // TODO:   headers: { 'Authorization': `Bearer ${SQUARE_API_KEY}` }
    // TODO: });

    return Promise.resolve(mockPayments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

/**
 * Get total revenue for a day
 */
export const getDailyRevenue = async (locationId = SQUARE_LOCATION_ID, date = 'today') => {
  try {
    const payments = await getPayments(locationId, date);
    const total = payments.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0);
    return Promise.resolve(total);
  } catch (error) {
    console.error('Error calculating daily revenue:', error);
    throw error;
  }
};

/**
 * Get revenue breakdown by service
 */
export const getRevenueByService = async (locationId = SQUARE_LOCATION_ID, dateRange = 'week') => {
  try {
    const payments = await getPayments(locationId, dateRange);
    const breakdown = {};
    
    payments.forEach(p => {
      if (p.status === 'completed') {
        const service = p.service || 'Other';
        breakdown[service] = (breakdown[service] || 0) + p.amount;
      }
    });

    return Promise.resolve(breakdown);
  } catch (error) {
    console.error('Error calculating revenue by service:', error);
    throw error;
  }
};

/**
 * Get revenue breakdown by staff member
 */
export const getRevenueByStaff = async (locationId = SQUARE_LOCATION_ID, dateRange = 'week') => {
  try {
    const bookings = await getBookings(locationId, dateRange);
    const breakdown = {};
    
    bookings.forEach(b => {
      if (b.status === 'completed') {
        const staff = b.staffName || 'Unknown';
        breakdown[staff] = (breakdown[staff] || 0) + b.price;
      }
    });

    return Promise.resolve(breakdown);
  } catch (error) {
    console.error('Error calculating revenue by staff:', error);
    throw error;
  }
};

// ============================================================================
// INVENTORY API
// ============================================================================

/**
 * Get all inventory items
 * TODO: Replace with Square API call to /v2/inventory
 */
export const getInventory = async (locationId = SQUARE_LOCATION_ID) => {
  try {
    // TODO: const response = await fetch(`https://sqrd.square.com/v2/inventory?location_id=${locationId}`, {
    // TODO:   headers: { 'Authorization': `Bearer ${SQUARE_API_KEY}` }
    // TODO: });

    return Promise.resolve(mockInventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

/**
 * Get low stock items (below minimum threshold)
 */
export const getLowStockItems = async (locationId = SQUARE_LOCATION_ID) => {
  try {
    const inventory = await getInventory(locationId);
    return Promise.resolve(
      inventory.filter(item => item.quantity <= item.minThreshold)
    );
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    throw error;
  }
};

/**
 * Update inventory quantity
 * TODO: Replace with Square API call to PUT /v2/inventory/{item_id}
 */
export const updateInventory = async (itemId, quantity) => {
  try {
    // TODO: const response = await fetch(`https://sqrd.square.com/v2/inventory/${itemId}`, {
    // TODO:   method: 'PUT',
    // TODO:   headers: { 'Authorization': `Bearer ${SQUARE_API_KEY}` },
    // TODO:   body: JSON.stringify({ quantity })
    // TODO: });

    const item = mockInventory.find(i => i.id === itemId);
    if (!item) throw new Error(`Inventory item ${itemId} not found`);
    
    item.quantity = quantity;
    return Promise.resolve(item);
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw error;
  }
};

// ============================================================================
// STAFF API
// ============================================================================

/**
 * Get all staff members
 * TODO: Replace with Square API call to /v2/team-members (or custom staff endpoint)
 */
export const getStaff = async (locationId = SQUARE_LOCATION_ID) => {
  try {
    // TODO: const response = await fetch(`https://sqrd.square.com/v2/team-members?location_id=${locationId}`, {
    // TODO:   headers: { 'Authorization': `Bearer ${SQUARE_API_KEY}` }
    // TODO: });

    return Promise.resolve(mockStaff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
};

/**
 * Get staff member by ID
 */
export const getStaffMember = async (staffId) => {
  try {
    const staff = mockStaff.find(s => s.id === staffId);
    if (!staff) throw new Error(`Staff member ${staffId} not found`);
    
    return Promise.resolve(staff);
  } catch (error) {
    console.error('Error fetching staff member:', error);
    throw error;
  }
};

/**
 * Get staff performance metrics
 */
export const getStaffMetrics = async (locationId = SQUARE_LOCATION_ID, period = 'week') => {
  try {
    const staff = await getStaff(locationId);
    
    return Promise.resolve(staff.map(s => ({
      id: s.id,
      name: s.name,
      appointments: period === 'today' ? s.appointmentsToday : s.appointmentsThisWeek,
      revenue: period === 'today' ? s.revenueToday : s.revenueThisWeek,
      rebookRate: s.rebookRate,
      noShowRate: s.noShowRate,
      rating: s.averageRating
    })));
  } catch (error) {
    console.error('Error fetching staff metrics:', error);
    throw error;
  }
};

// ============================================================================
// LOYALTY API
// ============================================================================

/**
 * Get customer loyalty information
 * TODO: Replace with Square API call to /v2/loyalty/programs or custom endpoint
 */
export const getCustomerLoyalty = async (customerId) => {
  try {
    // TODO: const response = await fetch(`https://sqrd.square.com/v2/loyalty/accounts?customer_id=${customerId}`, {
    // TODO:   headers: { 'Authorization': `Bearer ${SQUARE_API_KEY}` }
    // TODO: });

    const loyalty = mockLoyalty.find(l => l.customerId === customerId);
    
    if (!loyalty) {
      // Return default loyalty for unknown customers
      return Promise.resolve({
        customerId,
        pointsBalance: 0,
        pointsThisMonth: 0,
        tier: 'bronze',
        pointsToNextTier: 500
      });
    }
    
    return Promise.resolve(loyalty);
  } catch (error) {
    console.error('Error fetching customer loyalty:', error);
    throw error;
  }
};

/**
 * Add loyalty points to a customer
 * TODO: Replace with Square API call to POST /v2/loyalty/accounts/{account_id}/adjust-points
 */
export const addLoyaltyPoints = async (customerId, points) => {
  try {
    // TODO: const response = await fetch(`https://sqrd.square.com/v2/loyalty/accounts/${customerId}/adjust-points`, {
    // TODO:   method: 'POST',
    // TODO:   headers: { 'Authorization': `Bearer ${SQUARE_API_KEY}` },
    // TODO:   body: JSON.stringify({ points })
    // TODO: });

    const loyalty = mockLoyalty.find(l => l.customerId === customerId);
    if (loyalty) {
      loyalty.pointsBalance += points;
      loyalty.pointsThisMonth += points;
    }
    
    return Promise.resolve({ customerId, pointsAdded: points });
  } catch (error) {
    console.error('Error adding loyalty points:', error);
    throw error;
  }
};

/**
 * Redeem loyalty points
 * TODO: Replace with Square API call to POST /v2/loyalty/accounts/{account_id}/redeem-points
 */
export const redeemLoyaltyPoints = async (customerId, points) => {
  try {
    // TODO: const response = await fetch(`https://sqrd.square.com/v2/loyalty/accounts/${customerId}/redeem-points`, {
    // TODO:   method: 'POST',
    // TODO:   headers: { 'Authorization': `Bearer ${SQUARE_API_KEY}` },
    // TODO:   body: JSON.stringify({ points })
    // TODO: });

    const loyalty = mockLoyalty.find(l => l.customerId === customerId);
    if (!loyalty) throw new Error(`Customer ${customerId} not found`);
    if (loyalty.pointsBalance < points) throw new Error('Insufficient loyalty points');
    
    loyalty.pointsBalance -= points;
    loyalty.lastRedeemDate = new Date().toISOString();
    loyalty.lastRedeemedAmount = points;
    
    return Promise.resolve({ customerId, pointsRedeemed: points });
  } catch (error) {
    console.error('Error redeeming loyalty points:', error);
    throw error;
  }
};

// ============================================================================
// EXPORT DEFAULT OBJECT
// ============================================================================

export default {
  // Bookings
  getBookings,
  createBooking,
  updateBooking,
  cancelBooking,

  // Customers
  getCustomers,
  getCustomer,
  searchCustomers,
  createCustomer,

  // Payments
  getPayments,
  getDailyRevenue,
  getRevenueByService,
  getRevenueByStaff,

  // Inventory
  getInventory,
  getLowStockItems,
  updateInventory,

  // Staff
  getStaff,
  getStaffMember,
  getStaffMetrics,

  // Loyalty
  getCustomerLoyalty,
  addLoyaltyPoints,
  redeemLoyaltyPoints
};
