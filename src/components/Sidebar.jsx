import { useState } from 'react'
import '../styles/Sidebar.css'

const PAGE_MENU = {
  staff: [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'procedures', icon: '✂️', label: 'Procedures' },
    { id: 'schedule', icon: '📅', label: 'Schedule' },
    { id: 'checklist', icon: '✓', label: 'Checklist' },
    { id: 'help', icon: '❓', label: 'Help' }
  ],
  owner: [
    { id: 'dashboard', icon: '📈', label: 'Dashboard' },
    { id: 'staff', icon: '👥', label: 'Staff' },
    { id: 'inventory', icon: '📦', label: 'Inventory' },
    { id: 'analytics', icon: '📊', label: 'Analytics' }
  ],
  client: [
    { id: 'dashboard', icon: '🏠', label: 'Home' },
    { id: 'booking', icon: '📅', label: 'Book' },
    { id: 'mybookings', icon: '📋', label: 'My Bookings' },
    { id: 'loyalty', icon: '🎁', label: 'Loyalty' },
    { id: 'services', icon: '✂️', label: 'Services' }
  ]
}

export default function Sidebar({
  brainType = 'staff',
  currentPage,
  onPageChange,
  isOpen,
  onClose,
  onQuickTopicClick,
  onNewSession
}) {
  const [showQuickTopics, setShowQuickTopics] = useState(false)
  const menu = PAGE_MENU[brainType] || PAGE_MENU.staff

  const handlePageClick = (pageId) => {
    onPageChange(pageId)
    onClose()
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <div className="sidebar-content">
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Page Navigation */}
        <div className="sidebar-section">
          <h3 className="sidebar-heading">Pages</h3>
          <div className="page-menu">
            {menu.map(page => (
              <button
                key={page.id}
                className={`sidebar-item page-item ${currentPage === page.id ? 'active' : ''}`}
                onClick={() => handlePageClick(page.id)}
              >
                <span className="icon">{page.icon}</span>
                <span className="label">{page.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Topics (if available) */}
        {onQuickTopicClick && (
          <>
            <div className="sidebar-divider" />
            <div className="sidebar-section">
              <button
                className="sidebar-item session-btn"
                onClick={() => {
                  if (onNewSession) onNewSession()
                  onClose()
                }}
              >
                ✨ +New Chat
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
