import ShopSelector from './ShopSelector'
import '../styles/TopBar.css'

// Shop information with addresses and opening hours
const SHOP_INFO = {
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
}

// Helper function to get today's opening hours
function getTodaysHours(shopId) {
  const shop = SHOP_INFO[shopId]
  if (!shop) return 'Unknown'

  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = Sunday, 1-6 = Mon-Sat

  if (dayOfWeek === 0) {
    // Sunday
    return shop.hours['Sunday'] || 'Closed'
  } else if (dayOfWeek >= 4) {
    // Thursday-Saturday
    return shop.hours['Thursday-Saturday'] || shop.hours['Monday-Saturday'] || 'Unknown'
  } else {
    // Monday-Wednesday
    return shop.hours['Monday-Wednesday'] || shop.hours['Monday-Saturday'] || 'Unknown'
  }
}

export default function TopBar({ selectedShop, onShopChange, onMenuToggle }) {
  const shop = SHOP_INFO[selectedShop] || SHOP_INFO.tolworth
  const todaysHours = getTodaysHours(selectedShop)
  const isOpen = todaysHours !== 'Closed'

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={onMenuToggle} aria-label="Toggle menu">
          ☰
        </button>
        <img src="/assets/smokey-logo.png" alt="Smokey" className="logo-small" />
        <div className="branding">
          <h1 className="topbar-title">SMOKEY STAFF BRAIN</h1>
          <p className="topbar-subtitle">INTERNAL KNOWLEDGE SYSTEM</p>
        </div>
      </div>

      <div className="topbar-center">
        <div className="shop-info">
          <div className="shop-address">{shop.address}</div>
          <div className={`shop-hours ${isOpen ? 'open' : 'closed'}`}>
            {isOpen ? '🟢' : '🔴'} Open today: {todaysHours}
          </div>
        </div>
      </div>

      <ShopSelector selectedShop={selectedShop} onShopChange={onShopChange} />
    </div>
  )
}

export { SHOP_INFO }
