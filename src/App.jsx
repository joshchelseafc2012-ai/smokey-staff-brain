import { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import LoginScreen from './components/LoginScreen'
import './styles/App.css'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [selectedShop, setSelectedShop] = useState('tolworth')
  const [staffName, setStaffName] = useState('')
  const [sessionMemory, setSessionMemory] = useState({
    staffName: '',
    selectedShop: 'tolworth',
    lastQuestions: []
  })

  const handleLogin = (userData) => {
    setUser(userData)
    setStaffName(userData.name || userData.email)
    setSessionMemory(prev => ({
      ...prev,
      staffName: userData.name || userData.email
    }))
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    setStaffName('')
    setSelectedShop('tolworth')
    setSessionMemory({
      staffName: '',
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

  return (
    <div id="app">
      {!isLoggedIn ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <ChatInterface
          user={user}
          onLogout={handleLogout}
          selectedShop={selectedShop}
          onShopChange={handleShopChange}
          staffName={staffName}
          onQuestionAsked={updateLastQuestions}
        />
      )}
    </div>
  )
}
