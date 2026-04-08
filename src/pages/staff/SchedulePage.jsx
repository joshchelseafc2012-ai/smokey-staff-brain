import { useState, useEffect } from 'react'
import { getBookings } from '../../services/squareService'
import '../../styles/Pages.css'

export default function SchedulePage({ selectedShop }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBookings(selectedShop, 'today')
        setBookings(data.filter(b => b.status !== 'cancelled'))
      } catch (err) {
        console.error('Error loading bookings:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedShop])

  const timeStr = (t) => new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📅 Today's Schedule</h1>
        <p className="page-subtitle">{bookings.length} appointment{bookings.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <p>Loading schedule...</p>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <p>No appointments today. Time to prep and restock! 🎉</p>
        </div>
      ) : (
        <div className="schedule-list">
          {bookings.map((booking, idx) => (
            <div key={idx} className="schedule-item">
              <div className="time-block">{timeStr(booking.startTime)}</div>
              <div className="booking-details">
                <h4>{booking.clientName}</h4>
                <p>{booking.service}</p>
                <span className="duration">⏱️ {booking.duration}m</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
