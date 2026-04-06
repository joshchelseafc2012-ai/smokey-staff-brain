import { useState } from 'react'
import { SHOP_INFO } from './TopBar'
import '../styles/ShopSelector.css'

// Build shops array from SHOP_INFO with categories
const SHOPS = [
  { id: 'tolworth', name: 'Tolworth', category: 'Standalone' },
  { id: 'kingston', name: 'Kingston', category: 'Standalone' },
  { id: 'west', name: 'West', category: 'Standalone' },
  { id: 'birmingham', name: 'Birmingham (Primark)', category: 'Primark' },
  { id: 'manchester', name: 'Manchester (Primark)', category: 'Primark' },
]

export default function ShopSelector({ selectedShop, onShopChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const currentShop = SHOPS.find(s => s.id === selectedShop) || SHOPS[0]

  const handleSelect = (shopId) => {
    onShopChange(shopId)
    setIsOpen(false)
  }

  return (
    <div className="shop-selector-wrapper">
      <button
        className="shop-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="shop-name">{currentShop.name}</span>
        <span className="shop-icon">▼</span>
      </button>

      {isOpen && (
        <div className="shop-dropdown">
          {SHOPS.map(shop => (
            <div key={shop.id} className="shop-category">
              {!SHOPS.slice(0, SHOPS.indexOf(shop)).some(s => s.category === shop.category) && (
                <div className="category-label">{shop.category}</div>
              )}
              <button
                className={`shop-option ${selectedShop === shop.id ? 'active' : ''}`}
                onClick={() => handleSelect(shop.id)}
              >
                {shop.name}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
