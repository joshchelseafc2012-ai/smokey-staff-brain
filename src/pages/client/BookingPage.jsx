import ClientBookingPanel from '../../components/square/ClientBookingPanel'
import '../../styles/Pages.css'

export default function BookingPage({ selectedShop }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📅 Book an Appointment</h1>
        <p className="page-subtitle">Easy booking in 3 steps</p>
      </div>

      <ClientBookingPanel selectedShop={selectedShop} />

      <div className="info-box" style={{ marginTop: '32px' }}>
        <h3>Why book with us?</h3>
        <ul>
          <li>✓ No waiting around - reserved time slot</li>
          <li>✓ Earn loyalty points with every visit</li>
          <li>✓ Choose your favourite barber</li>
          <li>✓ Can reschedule anytime online</li>
          <li>✓ Get reminders before your appointment</li>
        </ul>
      </div>
    </div>
  )
}
