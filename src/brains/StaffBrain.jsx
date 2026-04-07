import { useState, useRef } from 'react'
import BrainLayout from '../layouts/BrainLayout'
import Sidebar from '../components/Sidebar'
import ChatThread from '../components/shared/ChatThread'
import SmartSuggestions from '../components/SmartSuggestions'
import WelcomeMessage from '../components/shared/WelcomeMessage'
import Footer from '../components/shared/Footer'
import '../styles/ChatInterface.css'

const FALLBACK_MESSAGE = `No stress — looks like the Brain can't reach the server right now. Here's the standard Smokey guide while we're offline:

## CLEAN‑DOWN ROUTINE
This is non‑negotiable. After every client:
- Brush down chair
- Disinfect armrests
- Wipe station
- Sweep floor
- Sanitise tools
- Fresh neck strip
- Fresh cape

If your station looks messy, you look messy. This is what separates Smokey from the rest.`

/**
 * Staff Brain - Internal assistant for barbers and staff
 * Helps with procedures, standards, client management, and daily operations
 */
export default function StaffBrain({
  user,
  onLogout,
  selectedShop,
  onShopChange,
  onQuestionAsked
}) {
  const brainType = 'staff';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const inputRef = useRef(null);
  const chatAreaRef = useRef(null);

  const handleSendMessage = async (messageText) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage = textToSend;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    if (onQuestionAsked) {
      onQuestionAsked(userMessage);
    }

    try {
      const recentHistory = messages.slice(-5);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: recentHistory,
          selectedShop: selectedShop,
          staffName: user.name,
          brainType: brainType
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedText = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);

              if (data.type === 'text') {
                accumulatedText += data.content;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: accumulatedText
                  };
                  return updated;
                });
              } else if (data.type === 'done') {
                break;
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }

      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer);
          if (data.type === 'text') {
            accumulatedText += data.content;
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: 'assistant',
                content: accumulatedText
              };
              return updated;
            });
          }
        } catch (e) {
          // Ignore
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: FALLBACK_MESSAGE
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleQuickTopic = (query) => {
    setInput(query);
    setTimeout(() => {
      handleSendMessage(query);
    }, 0);
  };

  const handleNewSession = () => {
    setMessages([]);
    setInput('');
    setIsLoading(false);
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = 0;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputFocus = () => {
    setTimeout(() => {
      inputRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setTimeout(() => {
        const scrollAmount = window.innerHeight * 0.25;
        window.scrollBy(0, scrollAmount);
      }, 100);
    }, 300);
  };

  return (
    <BrainLayout
      brainType={brainType}
      user={user}
      selectedShop={selectedShop}
      onShopChange={onShopChange}
      onLogout={onLogout}
      onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
    >
      <Sidebar
        onQuickTopicClick={handleQuickTopic}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewSession={handleNewSession}
        brainType={brainType}
      />

      <div className="chat-area" ref={chatAreaRef}>
        {messages.length === 0 && (
          <WelcomeMessage userName={user.name} brainType={brainType} />
        )}
        <ChatThread messages={messages} isLoading={isLoading} />

        {messages.length > 0 && !isLoading && (
          <SmartSuggestions
            onSuggestionClick={handleSuggestionClick}
            show={messages.length > 0}
            brainType={brainType}
          />
        )}

        <div className="input-bar">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              placeholder="Ask anything about Smokey standards…"
              className="message-input"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              className="send-btn"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </BrainLayout>
  );
}
