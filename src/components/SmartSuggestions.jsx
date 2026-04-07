import { getSuggestions } from '../services/brainService';
import '../styles/SmartSuggestions.css';

/**
 * SmartSuggestions - Brain-aware suggestion chips
 * Shows different suggestions based on brain type
 */
export default function SmartSuggestions({ onSuggestionClick, show, brainType }) {
  if (!show) return null;

  const suggestions = getSuggestions(brainType || 'staff');
  if (!suggestions || !suggestions.length) return null;

  return (
    <div className="smart-suggestions">
      {suggestions.map((suggestion, idx) => (
        <button
          key={idx}
          className="suggestion-chip"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
