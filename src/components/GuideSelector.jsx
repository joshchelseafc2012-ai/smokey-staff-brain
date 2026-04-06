import { useState } from 'react'
import GuideModal from './GuideModal'
import '../styles/GuideSelector.css'

const GUIDES = [
  {
    id: 'Smokey Skin Fade',
    label: 'Smokey Skin Fade'
  },
  {
    id: 'Beard Shaping Basics',
    label: 'Beard Shaping Basics'
  },
  {
    id: 'Daily Open/Close',
    label: 'Daily Open/Close'
  },
  {
    id: 'Clean-Down Routine',
    label: 'Clean-Down Routine'
  }
]

export default function GuideSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedGuide, setSelectedGuide] = useState(null)

  const handleSelect = (guideName) => {
    setSelectedGuide(guideName)
    setIsOpen(false)
  }

  return (
    <>
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
                onClick={() => handleSelect(guide.id)}
              >
                {guide.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedGuide && (
        <GuideModal guideName={selectedGuide} onClose={() => setSelectedGuide(null)} />
      )}
    </>
  )
}
