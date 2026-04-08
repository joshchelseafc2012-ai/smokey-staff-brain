import { useState } from 'react'
import LoginScreen from './components/LoginScreen'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import PageContainer from './components/PageContainer'
import './styles/App.css'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [selectedShop, setSelectedShop] = useState('tolworth')
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogin = (userData) => {
    setUser(userData)
    setIsLoggedIn(true)
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    setCurrentPage('dashboard')
    setSidebarOpen(false)
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <div className="app">
      <TopBar
        selectedShop={selectedShop}
        onShopChange={setSelectedShop}
        onLogout={handleLogout}
        user={user}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="app-container">
        <Sidebar
          brainType={user.role}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="main-content">
          <PageContainer
            brainType={user.role}
            currentPage={currentPage}
            selectedShop={selectedShop}
            user={user}
          />
        </main>
      </div>
    </div>
  )
}
