import '../styles/WelcomeMessage.css'

export default function WelcomeMessage({ staffName }) {
  return (
    <div className="welcome-message">
      <h2>What's happening, {staffName || 'Barber'}</h2>
      <p>Welcome to the Smokey Staff Brain. Ask me anything about how we cut, run the shop, or look after clients.</p>
    </div>
  )
}
