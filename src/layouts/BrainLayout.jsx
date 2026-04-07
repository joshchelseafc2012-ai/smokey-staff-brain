import TopBar from '../components/shared/TopBar'
import Footer from '../components/shared/Footer'
import '../styles/BrainLayout.css'

/**
 * BrainLayout - Shared layout wrapper for all three brains (Staff, Owner, Client)
 * Provides consistent header, footer, and main container structure
 */
export default function BrainLayout({
  brainType,
  user,
  selectedShop,
  onShopChange,
  onLogout,
  children,
  onMenuToggle
}) {
  return (
    <div className="brain-layout">
      <TopBar
        brainType={brainType}
        selectedShop={selectedShop}
        onShopChange={onShopChange}
        onMenuToggle={onMenuToggle}
        user={user}
        onLogout={onLogout}
      />

      <div className="main-container">
        {children}
      </div>

      <Footer />
    </div>
  )
}
