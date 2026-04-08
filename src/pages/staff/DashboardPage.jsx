import { useState, useEffect } from 'react'
import StaffDashboard from '../../components/square/StaffDashboard'
import ChatThread from '../../components/shared/ChatThread'
import '../../styles/Pages.css'

export default function StaffDashboardPage({ selectedShop, user, onChat }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
          brainType: 'staff',
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
              if (data.type === 'text') {
                result += data.content
              }
            } catch (e) {
              // ignore
            }
          }
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: result }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Could not reach AI. Try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📊 Dashboard</h1>
        <p className="page-subtitle">Today's overview and schedule</p>
      </div>

      <StaffDashboard selectedShop={selectedShop} staffName={user.name} />

      <div className="chat-section">
        <h3>Need Help?</h3>
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
            placeholder="Ask about procedures, cleaning routines, or anything else..."
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
