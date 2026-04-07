import { getTodaysHours, isShopOpen, getShopInfo } from '../../config/shopData';
import { getBrainMetadata } from '../../services/brainService';
import ShopSelector from './ShopSelector';
import GuideSelector from '../GuideSelector';
import '../../styles/TopBar.css';

export default function TopBar({
  brainType,
  selectedShop,
  onShopChange,
  onMenuToggle,
  user,
  onLogout
}) {
  const shop = getShopInfo(selectedShop);
  const todaysHours = getTodaysHours(selectedShop);
  const isOpen = isShopOpen(selectedShop);
  const brainMetadata = getBrainMetadata(brainType);

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={onMenuToggle} aria-label="Toggle menu">
          <img src="/assets/smokey-logo.png" alt="Smokey" className="logo-small" />
        </button>
        <div className="branding">
          <h1 className="topbar-title">{brainMetadata.name}</h1>
          <p className="topbar-subtitle">{brainMetadata.subtitle}</p>
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

export { getShopInfo };
