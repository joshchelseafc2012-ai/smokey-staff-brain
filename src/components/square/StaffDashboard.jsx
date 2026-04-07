import { useState, useEffect } from 'react'
import { getBookings } from '../../../services/squareService'

export default function StaffDashboard({ selectedShop, staffName }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getBookings(selectedShop, 'today')
        setBookings(data.filter(b => b.status !== 'cancelled'))
      } catch (err) {
        console.error('Error loading bookings:', err)
      } finally {
        setLoading(false)
      }
    }
    loadBookings()
  }, [selectedShop])

  if (loading) return <div className="staff-dashboard loading">Loading appointments...</div>

  const timeStr = (t) => new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const nextBooking = bookings[0]
  const hasUpcoming = bookings.length > 0

  return (
    <div className="staff-dashboard">
      <div className="dashboard-header">
        <h3>📅 Your Schedule Today</h3>
      </div>

      {hasUpcoming ? (
        <>
          <div className="next-appointment highlight">
            <div className="appointment-time">{timeStr(nextBooking.startTime)}</div>
            <div className="appointment-client">{nextBooking.clientName}</div>
            <div className="appointment-service">{nextBooking.service}</div>
            <div className="appointment-duration">⏱️ {nextBooking.duration}m</div>
          </div>

          {bookings.length > 1 && (
            <div className="upcoming-list">
              <div className="list-label">Upcoming ({bookings.length - 1} more)</div>
              {bookings.slice(1, 4).map((b, i) => (
                <div key={i} className="compact-booking">
                  <span className="time">{timeStr(b.startTime)}</span>
                  <span className="client">{b.clientName}</span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="no-bookings">No appointments today</div>
      )}
    </div>
  )
}
