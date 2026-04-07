import { useState } from 'react'
import LoginScreen from './components/LoginScreen'
import StaffBrain from './brains/StaffBrain'
import OwnerBrain from './brains/OwnerBrain'
import ClientBrain from './brains/ClientBrain'
import './styles/App.css'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [selectedShop, setSelectedShop] = useState('tolworth')
  const [sessionMemory, setSessionMemory] = useState({
    staffName: '',
    userRole: '',
    selectedShop: 'tolworth',
    lastQuestions: []
  })

  const handleLogin = (userData) => {
    setUser(userData)
    setSessionMemory(prev => ({
      ...prev,
      staffName: userData.name,
      userRole: userData.role,
      selectedShop: 'tolworth'
    }))
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    setSelectedShop('tolworth')
    setSessionMemory({
      staffName: '',
      userRole: '',
      selectedShop: 'tolworth',
      lastQuestions: []
    })
  }

  const handleShopChange = (shopId) => {
    setSelectedShop(shopId)
    setSessionMemory(prev => ({
      ...prev,
      selectedShop: shopId
    }))
  }

  const updateLastQuestions = (question) => {
    setSessionMemory(prev => ({
      ...prev,
      lastQuestions: [question, ...prev.lastQuestions].slice(0, 5)
    }))
  }

  // Determine which brain to show based on user role
  const getActiveBrain = () => {
    if (!user) return null
    return user.role === 'owner' ? 'owner'
         : user.role === 'client' ? 'client'
         : 'staff'
  }

  const activeBrain = getActiveBrain()

  const renderBrain = () => {
    switch (activeBrain) {
      case 'owner':
        return (
          <OwnerBrain
            user={user}
            onLogout={handleLogout}
            selectedShop={selectedShop}
            onShopChange={handleShopChange}
            onQuestionAsked={updateLastQuestions}
          />
        )
      case 'client':
        return (
          <ClientBrain
            user={user}
            onLogout={handleLogout}
            selectedShop={selectedShop}
            onShopChange={handleShopChange}
            onQuestionAsked={updateLastQuestions}
          />
        )
      case 'staff':
      default:
        return (
          <StaffBrain
            user={user}
            onLogout={handleLogout}
            selectedShop={selectedShop}
            onShopChange={handleShopChange}
            onQuestionAsked={updateLastQuestions}
          />
        )
    }
  }

  return (
    <div id="app">
      {!isLoggedIn ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        renderBrain()
      )}
    </div>
  )
}
