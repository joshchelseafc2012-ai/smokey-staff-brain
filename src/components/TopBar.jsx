import ShopSelector from './ShopSelector'
import GuideSelector from './GuideSelector'
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

// Brain metadata for titles and subtitles
const BRAIN_INFO = {
  staff: {
    title: 'SMOKEY STAFF BRAIN',
    subtitle: 'INTERNAL KNOWLEDGE SYSTEM'
  },
  owner: {
    title: 'SMOKEY OWNER BRAIN',
    subtitle: 'BUSINESS INTELLIGENCE'
  },
  client: {
    title: 'SMOKEY CLIENT BRAIN',
    subtitle: 'YOUR PERSONAL ASSISTANT'
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

export default function TopBar({
  brainType,
  selectedShop,
  onShopChange,
  onMenuToggle,
  user,
  onLogout
}) {
  const shop = SHOP_INFO[selectedShop] || SHOP_INFO.tolworth
  const todaysHours = getTodaysHours(selectedShop)
  const isOpen = todaysHours !== 'Closed'
  const brainInfo = BRAIN_INFO[brainType] || BRAIN_INFO.staff

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={onMenuToggle} aria-label="Toggle menu">
          <img src="/assets/smokey-logo.png" alt="Smokey" className="logo-small" />
        </button>
        <div className="branding">
          <h1 className="topbar-title">{brainInfo.title}</h1>
          <p className="topbar-subtitle">{brainInfo.subtitle}</p>
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

      <div className="topbar-right">
        <div className="topbar-dropdowns">
          {brainType === 'staff' && <GuideSelector />}
          <ShopSelector selectedShop={selectedShop} onShopChange={onShopChange} />
        </div>

        {user && (
          <div className="topbar-user">
            <span className="user-name">{user.name}</span>
            <button className="logout-btn" onClick={onLogout} aria-label="Logout">
              Exit
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export { SHOP_INFO }
