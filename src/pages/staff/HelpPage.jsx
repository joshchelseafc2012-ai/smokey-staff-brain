import '../../styles/Pages.css'

export default function HelpPage() {
  const faqs = [
    {
      q: 'Client is 15 minutes late',
      a: 'Give them 10 mins max. If no-show by then, move to next client. Bill as attended if they show up mid-service.'
    },
    {
      q: 'What if I make a mistake on a fade?',
      a: 'Stay calm. Use clippers to even it out. If bad, offer to rework for free. Learn and move on.'
    },
    {
      q: 'Customer wants a style I\'m not confident with',
      a: 'Be honest. "I want to get this perfect for you - let me grab Jay real quick to check." Better than a bad cut.'
    },
    {
      q: 'Clipper blade getting hot',
      a: 'Let it cool for 5 mins. Oil it. You\'ve got time. Hot blades pull hair and make clients uncomfortable.'
    },
    {
      q: 'How do I handle complaints?',
      a: '1) Listen. 2) Apologize. 3) Offer to rework. 4) Tell a manager. Never argue with a client.'
    }
  ]

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">❓ Help Center</h1>
        <p className="page-subtitle">Common questions and quick answers</p>
      </div>

      <div className="faqs">
        {faqs.map((faq, idx) => (
          <div key={idx} className="faq-item">
            <h4>{faq.q}</h4>
            <p>{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="info-box" style={{ marginTop: '32px' }}>
        <h3>Quick Policies</h3>
        <ul>
          <li><strong>Late Policy:</strong> 0-10 mins: take if possible. 10-20 mins: shorten service. 20+ mins: rebook</li>
          <li><strong>Walk-ins:</strong> Book if slots free. Otherwise, put on list for next available</li>
          <li><strong>Rebookes:</strong> Always put loyal clients first for new openings</li>
          <li><strong>Products:</strong> Ask about beard oil, aftershave before they leave</li>
          <li><strong>Loyalty:</strong> Mention points system - they earn with every visit</li>
        </ul>
      </div>

      <div className="info-box warning" style={{ marginTop: '24px' }}>
        <h3>Standards</h3>
        <p>Clean station = professional barber. Dirty station = doesn't care about craft. Be the first one we choose.</p>
      </div>
    </div>
  )
}
