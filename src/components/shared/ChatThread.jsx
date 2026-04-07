import { useEffect, useRef } from 'react'
import '../../styles/ChatThread.css'

export default function ChatThread({ messages, isLoading }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  return (
    <div className="chat-thread">
      {messages.map((msg, idx) => (
        <div key={idx} className={`message message-${msg.role}`}>
          <div className="message-content">{msg.content}</div>
        </div>
      ))}

      {isLoading && (
        <div className="message message-assistant">
          <div className="message-content typing">
            <span></span><span></span><span></span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
