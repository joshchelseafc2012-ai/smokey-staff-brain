import { useState } from 'react'
import RevenueAnalytics from './modules/RevenueAnalytics'
import StaffMetrics from './modules/StaffMetrics'
import InventoryManager from './modules/InventoryManager'
import BookingsManager from './modules/BookingsManager'
import CustomersManager from './modules/CustomersManager'
import LoyaltyManager from './modules/LoyaltyManager'
import './styles/SquareDashboard.css'

/**
 * Square Dashboard - Complete business management interface
 * Tabs for all Square API functions with easy-to-use UI
 */
export default function SquareDashboard({ selectedShop, user }) {
  const [activeTab, setActiveTab] = useState('revenue')

  const tabs = [
    { id: 'revenue', label: '💰 Revenue', icon: '📊' },
    { id: 'staff', label: '👥 Staff', icon: '⭐' },
    { id: 'inventory', label: '📦 Inventory', icon: '⚠️' },
    { id: 'bookings', label: '📅 Bookings', icon: '✓' },
    { id: 'customers', label: '👤 Customers', icon: '🔍' },
    { id: 'loyalty', label: '🎁 Loyalty', icon: '🏆' }
  ]

  return (
    <div className="square-dashboard">
      <div className="dashboard-header">
        <h2>Business Dashboard</h2>
        <p className="location-info">📍 {selectedShop.charAt(0).toUpperCase() + selectedShop.slice(1)}</p>
      </div>

      <div className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {activeTab === 'revenue' && <RevenueAnalytics selectedShop={selectedShop} />}
        {activeTab === 'staff' && <StaffMetrics selectedShop={selectedShop} />}
        {activeTab === 'inventory' && <InventoryManager selectedShop={selectedShop} />}
        {activeTab === 'bookings' && <BookingsManager selectedShop={selectedShop} />}
        {activeTab === 'customers' && <CustomersManager selectedShop={selectedShop} />}
        {activeTab === 'loyalty' && <LoyaltyManager selectedShop={selectedShop} />}
      </div>
    </div>
  )
}
