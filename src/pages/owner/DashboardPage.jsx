import { useState, useEffect } from 'react'
import { getPayments, getStaff, getCustomers, getBookings } from '../../services/squareService'
import SquareDashboard from '../../components/square/SquareDashboard'
import ChatThread from '../../components/shared/ChatThread'
import '../../styles/Pages.css'

export default function OwnerDashboardPage({ selectedShop, user }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [payments, staff, customers, bookings] = await Promise.all([
          getPayments(selectedShop),
          getStaff(selectedShop),
          getCustomers(selectedShop),
          getBookings(selectedShop)
        ])

        const revenue = payments.reduce((sum, p) => sum + p.amount, 0)
        setDashboardData({
          revenue,
          staff: staff.length,
          customers: customers.length,
          bookings: bookings.length
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
          brainType: 'owner'
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
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error loading AI response.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📈 Business Dashboard</h1>
        <p className="page-subtitle">Your complete overview</p>
      </div>

      {dashboardData && (
        <div className="page-grid">
          <div className="card">
            <div className="card-header">Today's Revenue</div>
            <div className="card-value">£{dashboardData.revenue.toFixed(2)}</div>
          </div>
          <div className="card">
            <div className="card-header">Active Staff</div>
            <div className="card-value">{dashboardData.staff}</div>
          </div>
          <div className="card">
            <div className="card-header">Customers</div>
            <div className="card-value">{dashboardData.customers}</div>
          </div>
          <div className="card">
            <div className="card-header">Bookings Today</div>
            <div className="card-value">{dashboardData.bookings}</div>
          </div>
        </div>
      )}

      <h3 style={{ marginTop: '32px' }}>Full Analytics</h3>
      <SquareDashboard selectedShop={selectedShop} user={user} />

      <div className="chat-section" style={{ marginTop: '32px' }}>
        <h3>Ask Questions</h3>
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
            placeholder="Ask about revenue, staff performance, customers, trends..."
            rows="3"
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
            {isLoading ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
