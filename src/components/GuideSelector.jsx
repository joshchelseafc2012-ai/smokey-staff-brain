import { useState } from 'react'
import '../styles/GuideSelector.css'

const GUIDES = [
  {
    id: 'skin-fade',
    label: 'Smokey Skin Fade',
    query: 'Give me the complete Smokey skin fade process step by step'
  },
  {
    id: 'beard-shaping',
    label: 'Beard Shaping Basics',
    query: 'How do we shape beards at Smokey? Give me the full process'
  },
  {
    id: 'daily-checklist',
    label: 'Daily Open/Close',
    query: 'Give me the opening and closing checklists'
  },
  {
    id: 'clean-down',
    label: 'Clean-Down Routine',
    query: 'What is the clean-down routine? Give me the full process'
  }
]

export default function GuideSelector({ onGuideSelect }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (query) => {
    onGuideSelect(query)
    setIsOpen(false)
  }

  return (
    <div className="guide-selector-wrapper">
      <button
        className="guide-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open guides"
      >
        <span className="guide-label">Guides</span>
        <span className="guide-icon">▼</span>
      </button>

      {isOpen && (
        <div className="guide-dropdown">
          {GUIDES.map(guide => (
            <button
              key={guide.id}
              className="guide-option"
              onClick={() => handleSelect(guide.query)}
            >
              {guide.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
