import { useState } from 'react'
import GuideModal from './GuideModal'
import '../styles/Sidebar.css'

const QUICK_TOPICS = [
  { id: 'consultation', label: 'Client Consultation', query: 'Give me the consultation script' },
  { id: 'fades', label: 'Skin Fades & Blends', query: 'Walk me through the Smokey skin fade process' },
  { id: 'beards', label: 'Beards & Shaping', query: 'How do we shape beards at Smokey?' },
  { id: 'hygiene', label: 'Hygiene & Clean Down', query: 'What is the clean-down routine?' },
  { id: 'walkins', label: 'Walk‑ins vs Bookings', query: 'How do we handle walk-ins vs bookings?' },
  { id: 'late', label: 'Late / No‑Show Rules', query: 'What is the late/no-show policy?' },
  { id: 'pricing', label: 'Pricing & Discounts', query: 'Tell me about Smokey pricing and discounts' },
  { id: 'checklist', label: 'Open & Close Checklist', query: 'Give me the opening and closing checklists' },
  { id: 'social', label: 'Social Media & Photos', query: 'What are the social media and photo guidelines?' },
  { id: 'difficult', label: 'Dealing with Difficult Clients', query: 'How do we handle difficult clients?' },
]

const SAVED_GUIDES = [
  'Smokey Skin Fade',
  'Beard Shaping Basics',
  'Daily Open/Close',
  'Clean-Down Routine'
]

export default function Sidebar({ onQuickTopicClick, isOpen, onClose }) {
  const [selectedGuide, setSelectedGuide] = useState(null)

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-section">
          <h3 className="sidebar-heading">Sessions</h3>
          <button className="sidebar-item">+ New Session</button>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-heading">Quick Topics</h3>
          <div className="quick-topics">
            {QUICK_TOPICS.map(topic => (
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
    </>
  )
}
