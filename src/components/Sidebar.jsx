import { useState } from 'react'
import { getQuickTopics } from '../config/brainConfig'
import GuideModal from './GuideModal'
import '../styles/Sidebar.css'

const SAVED_GUIDES = [
  'Smokey Skin Fade',
  'Beard Shaping Basics',
  'Daily Open/Close',
  'Clean-Down Routine'
]

export default function Sidebar({ onQuickTopicClick, isOpen, onClose, onNewSession, brainType }) {
  const [selectedGuide, setSelectedGuide] = useState(null)
  
  // Get quick topics for the current brain type
  const quickTopicsLabels = getQuickTopics(brainType || 'staff');
  
  // Convert simple string array to topic objects with queries
  const quickTopics = quickTopicsLabels.map((label, idx) => ({
    id: `topic-${idx}`,
    label: label,
    query: label
  }))

  const handleNewSession = () => {
    onNewSession()
    onClose()
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <div className="sidebar-content">
        <div className="sidebar-header">
          <h2>Sidebar</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="sidebar-section">
          <button
            className="sidebar-item session-btn"
            onClick={handleNewSession}
          >
            ✨ +New Session
          </button>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-heading">Quick Topics</h3>
          <div className="quick-topics">
            {quickTopics.map(topic => (
              <button
                key={topic.id}
                className="sidebar-item topic-item"
                onClick={() => {
                  onQuickTopicClick(topic.query)
                  onClose()
                }}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-heading">Saved Guides</h3>
          <div className="saved-guides">
            {SAVED_GUIDES.map((guide, idx) => (
              <button
                key={idx}
                className="sidebar-item guide-item"
                onClick={() => setSelectedGuide(guide)}
              >
                {guide}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedGuide && (
        <GuideModal
          guideName={selectedGuide}
          onClose={() => setSelectedGuide(null)}
        />
      )}
    </div>
  )
}
