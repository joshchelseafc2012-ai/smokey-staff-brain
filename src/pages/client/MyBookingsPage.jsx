import { useState, useEffect } from 'react'
import { getBookings } from '../../services/squareService'
import '../../styles/Pages.css'

export default function MyBookingsPage({ selectedShop }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBookings(selectedShop)
        setBookings(data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime)))
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedShop])

  const timeStr = (t) => new Date(t).toLocaleString('en-GB')

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📋 My Bookings</h1>
        <p className="page-subtitle">Your past and upcoming appointments</p>
      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <p>No bookings yet. <a href="#booking">Book now!</a></p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking, idx) => (
            <div key={idx} className="booking-card">
              <div className="booking-date">{timeStr(booking.startTime)}</div>
              <div className="booking-info">
                <h4>{booking.service}</h4>
                <p>With {booking.staffName} • {booking.duration}m</p>
              </div>
              <div className="booking-status" style={{
                background: booking.status === 'completed' ? '#e8f5e9' : '#fff3e0',
                color: booking.status === 'completed' ? '#2e7d32' : '#e65100',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {booking.status === 'completed' ? '✓ Done' : booking.status === 'in_progress' ? '→ In Progress' : 'Upcoming'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
