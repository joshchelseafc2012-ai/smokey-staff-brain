import { getBrainConfig } from '../../config/brainConfig';
import '../../styles/WelcomeMessage.css';

/**
 * WelcomeMessage - Brain-aware greeting
 * Personalized for each brain type and user
 */
export default function WelcomeMessage({ userName, brainType }) {
  const config = getBrainConfig(brainType);

  // Create personalized welcome message based on brain type
  const getWelcomeText = () => {
    const name = userName || 'there';
    
    switch (brainType) {
      case 'staff':
        return `What's happening, ${name}`;
      case 'owner':
        return `Welcome back, ${name}`;
      case 'client':
        return `Hey ${name}`;
      default:
        return `Welcome, ${name}`;
    }
  };

  return (
    <div className="welcome-message">
      <h2>{getWelcomeText()}</h2>
      <p>{getWelcomeDescription(brainType)}</p>
    </div>
  );
}

function getWelcomeDescription(brainType) {
  switch (brainType) {
    case 'staff':
      return 'Welcome to the Smokey Staff Brain. Ask me anything about how we cut, run the shop, or look after clients.';
    case 'owner':
      return "I'm here to help you understand your business, make smarter decisions, and grow Smokey Barbers.";
    case 'client':
      return 'Your personal barber assistant. Book appointments, check loyalty points, or get recommendations.';
    default:
      return 'Welcome to Smokey Barbers AI Operating System.';
  }
}
