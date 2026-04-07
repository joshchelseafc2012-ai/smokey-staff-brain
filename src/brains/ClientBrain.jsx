import { useState, useEffect, useRef } from 'react'
import BrainLayout from '../layouts/BrainLayout'
import Sidebar from '../components/Sidebar'
import ChatThread from '../components/shared/ChatThread'
import SmartSuggestions from '../components/SmartSuggestions'
import WelcomeMessage from '../components/shared/WelcomeMessage'
import ClientBookingPanel from '../components/square/ClientBookingPanel'
import { getCustomerLoyalty, getBookings } from '../services/squareService'
import '../styles/ChatInterface.css'
import '../styles/ClientBrain.css'
import '../components/square/styles/BrainDashboards.css'

const FALLBACK_MESSAGE = `No stress — looks like I can't reach the server. Try again in a moment.`

/**
 * Client Brain - Personal barber assistant
 * Helps clients book appointments, manage loyalty, and get recommendations
 */
export default function ClientBrain({
  user,
  onLogout,
  selectedShop,
  onShopChange,
  onQuestionAsked
}) {
  const brainType = 'client';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [clientData, setClientData] = useState({
    loyaltyPoints: 0,
    loyaltyTier: 'standard',
    upcomingBookings: [],
    previousVisits: 0,
    favoriteStaff: null
  });

  const inputRef = useRef(null);
  const chatAreaRef = useRef(null);

  const loadProfile = async () => {
    setProfileLoading(true);
    try {
      const [loyalty, bookings] = await Promise.all([
        getCustomerLoyalty(user.id || 'client'),
        getBookings(selectedShop, 'upcoming')
      ]);

      let tier = 'standard';
      if (loyalty.pointsBalance >= 1000) tier = 'gold';
      if (loyalty.pointsBalance >= 500) tier = 'silver';

      setClientData({
        loyaltyPoints: loyalty.pointsBalance,
        loyaltyTier: tier,
        upcomingBookings: bookings.filter(b => b.status === 'confirmed'),
        previousVisits: 15,
        favoriteStaff: 'Jay'
      });
    } catch (error) {
      console.error('Error loading client profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [selectedShop, user.id]);

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

        {/* Loyalty Card */}
        <div className="client-profile">
          {profileLoading ? (
            <div className="profile-loading">Loading your profile...</div>
          ) : (
            <>
              <div className="loyalty-card">
                <div className="loyalty-header">
                  <h3>Your Loyalty</h3>
                  <span className={`loyalty-tier ${clientData.loyaltyTier}`}>
                    {clientData.loyaltyTier.toUpperCase()}
                  </span>
                </div>
                <div className="loyalty-points">
                  <div className="points-display">
                    <span className="points-number">{clientData.loyaltyPoints}</span>
                    <span className="points-label">points</span>
                  </div>
                  <div className="points-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{
                        width: `${Math.min((clientData.loyaltyPoints / 500) * 100, 100)}%`
                      }}></div>
                    </div>
                    <p className="progress-hint">
                      {clientData.loyaltyTier === 'gold'
                        ? `You're a VIP! Enjoy premium benefits.`
                        : clientData.loyaltyTier === 'silver'
                        ? `Keep going to reach Gold tier!`
                        : 'Build points with every visit'}
                    </p>
                  </div>
                </div>
              </div>

              <ClientBookingPanel selectedShop={selectedShop} onBookingCreated={loadProfile} />

              {clientData.upcomingBookings.length > 0 && (
                <div className="upcoming-section">
                  <h3>Your Next Appointment</h3>
                  {clientData.upcomingBookings.slice(0, 1).map(booking => (
                    <div key={booking.id} className="booking-preview">
                      <div className="booking-time">
                        {new Date(booking.time).toLocaleDateString('en-GB', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })} at {new Date(booking.time).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="booking-service">
                        {booking.service} with {booking.staffName}
                      </div>
                      <div className="booking-duration">
                        ~{booking.duration} mins
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="quick-stats">
                <div className="stat">
                  <span className="stat-number">{clientData.previousVisits}</span>
                  <span className="stat-label">Visits</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{clientData.favoriteStaff || '—'}</span>
                  <span className="stat-label">Favorite Barber</span>
                </div>
              </div>
            </>
          )}
        </div>

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
              placeholder="Book an appointment or ask about services…"
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
