import { useState, useEffect } from 'react'
import { getCustomerLoyalty, getBookings } from '../../services/squareService'
import ClientBookingPanel from '../../components/square/ClientBookingPanel'
import ChatThread from '../../components/shared/ChatThread'
import '../../styles/Pages.css'

export default function ClientDashboardPage({ user, selectedShop }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [loyalty, bookings] = await Promise.all([
          getCustomerLoyalty(user.id || 'client'),
          getBookings(selectedShop, 'upcoming')
        ])

        let tier = 'Standard'
        if (loyalty.pointsBalance >= 1000) tier = 'Gold'
        else if (loyalty.pointsBalance >= 500) tier = 'Silver'

        setProfile({
          points: loyalty.pointsBalance,
          tier,
          nextBooking: bookings.length > 0 ? bookings[0] : null
        })
      } catch (err) {
        console.error('Error:', err)
      }
    }
    load()
  }, [selectedShop])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages,
          selectedShop,
          brainType: 'client',
          staffName: user.name
        })
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let result = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line)
              if (data.type === 'text') result += data.content
            } catch (e) {}
          }
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: result }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error reaching AI. Try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🏠 Welcome Back</h1>
        <p className="page-subtitle">Your Smokey Barbers dashboard</p>
      </div>

      {profile && (
        <div className="page-grid">
          <div className="card">
            <div className="card-header">Loyalty Points</div>
            <div className="card-value">{profile.points}</div>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Tier: {profile.tier}</p>
          </div>
          {profile.nextBooking && (
            <div className="card">
              <div className="card-header">Next Appointment</div>
              <div className="card-value" style={{ fontSize: '16px' }}>
                {new Date(profile.nextBooking.startTime).toLocaleDateString()}
              </div>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                {profile.nextBooking.service} with {profile.nextBooking.staffName}
              </p>
            </div>
          )}
        </div>
      )}

      <h3 style={{ marginTop: '32px' }}>Quick Actions</h3>
      <ClientBookingPanel selectedShop={selectedShop} />

      <div className="chat-section" style={{ marginTop: '32px' }}>
        <h3>Ask Our Barbers</h3>
        <ChatThread messages={messages} isLoading={isLoading} />
        <div className="chat-input-section">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Ask about services, book an appointment, check loyalty..."
            rows="3"
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
