import { useState, useEffect, useRef } from 'react'
import BrainLayout from '../layouts/BrainLayout'
import Sidebar from '../components/Sidebar'
import ChatThread from '../components/shared/ChatThread'
import SmartSuggestions from '../components/SmartSuggestions'
import WelcomeMessage from '../components/shared/WelcomeMessage'
import { getDailyRevenue, getStaffMetrics, getCustomers, getLowStockItems } from '../services/squareService'
import '../styles/ChatInterface.css'
import '../styles/OwnerDashboard.css'

const FALLBACK_MESSAGE = `No stress — looks like the Brain can't reach the server. Try again in a moment.`

/**
 * Owner Brain - Business intelligence and strategic advisor
 * Helps owners understand performance, metrics, and make better decisions
 */
export default function OwnerBrain({
  user,
  onLogout,
  selectedShop,
  onShopChange,
  onQuestionAsked
}) {
  const brainType = 'owner';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    dailyRevenue: 0,
    staffMetrics: [],
    customerCount: 0,
    lowStockItems: []
  });

  const inputRef = useRef(null);
  const chatAreaRef = useRef(null);

  // Load dashboard data on mount and when shop changes
  useEffect(() => {
    const loadDashboard = async () => {
      setDashboardLoading(true);
      try {
        const [revenue, staff, customers, inventory] = await Promise.all([
          getDailyRevenue(selectedShop, 'today'),
          getStaffMetrics(selectedShop, 'today'),
          getCustomers(selectedShop),
          getLowStockItems(selectedShop)
        ]);

        setDashboardData({
          dailyRevenue: revenue,
          staffMetrics: staff,
          customerCount: customers.length,
          lowStockItems: inventory
        });
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboard();
  }, [selectedShop]);

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

        {/* Dashboard Metrics */}
        <div className="owner-dashboard">
          {dashboardLoading ? (
            <div className="dashboard-loading">Loading metrics...</div>
          ) : (
            <>
              <div className="metrics-row">
                <div className="metric-card">
                  <div className="metric-label">Daily Revenue</div>
                  <div className="metric-value">£{dashboardData.dailyRevenue.toFixed(2)}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Total Customers</div>
                  <div className="metric-value">{dashboardData.customerCount}</div>
                </div>
              </div>

              {dashboardData.staffMetrics.length > 0 && (
                <div className="metrics-section">
                  <h3>Today's Staff Metrics</h3>
                  <div className="staff-metrics-table">
                    <div className="table-header">
                      <div className="col-name">Name</div>
                      <div className="col-number">Appointments</div>
                      <div className="col-number">Revenue</div>
                      <div className="col-number">Rebook Rate</div>
                    </div>
                    {dashboardData.staffMetrics.map(staff => (
                      <div key={staff.id} className="table-row">
                        <div className="col-name">{staff.name}</div>
                        <div className="col-number">{staff.appointments}</div>
                        <div className="col-number">£{staff.revenue.toFixed(2)}</div>
                        <div className="col-number">{(staff.rebookRate * 100).toFixed(0)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {dashboardData.lowStockItems.length > 0 && (
                <div className="metrics-section">
                  <h3 className="warning">⚠️ Low Stock Items</h3>
                  <div className="low-stock-list">
                    {dashboardData.lowStockItems.map(item => (
                      <div key={item.id} className="stock-item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">{item.quantity} {item.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              placeholder="Ask about business metrics, staff performance, or strategy…"
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
