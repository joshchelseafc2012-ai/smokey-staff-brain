import ShopSelector from './ShopSelector'
import '../styles/TopBar.css'

export default function TopBar({ selectedShop, onShopChange }) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <img src="/assets/smokey-logo.png" alt="Smokey" className="logo-small" />
        <h1 className="topbar-title">SMOKEY STAFF BRAIN</h1>
      </div>
      <ShopSelector selectedShop={selectedShop} onShopChange={onShopChange} />
    </div>
  )
}
