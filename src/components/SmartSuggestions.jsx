import '../styles/SmartSuggestions.css'

const SUGGESTIONS = [
  'Show me the Smokey skin fade process',
  'What\'s the clean‑down routine',
  'How do we handle late clients',
  'Walk me through the opening checklist',
  'Give me the consultation script'
]

export default function SmartSuggestions({ onSuggestionClick, show }) {
  if (!show || !SUGGESTIONS.length) return null

  return (
    <div className="smart-suggestions">
      {SUGGESTIONS.map((suggestion, idx) => (
        <button
          key={idx}
          className="suggestion-chip"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  )
}
