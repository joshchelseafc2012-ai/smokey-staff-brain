import { useState, useEffect } from 'react'
import { getStaff, createBooking } from '../../../services/squareService'

export default function ClientBookingPanel({ selectedShop, onBookingCreated }) {
  const [showForm, setShowForm] = useState(false)
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    service: 'Skin Fade',
    duration: 30,
    staffId: '',
    startTime: ''
  })

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const data = await getStaff(selectedShop)
        setStaff(data)
        if (data.length > 0) setFormData(f => ({ ...f, staffId: data[0].id }))
      } catch (err) {
        console.error('Error loading staff:', err)
      }
    }
    loadStaff()
  }, [selectedShop])

  const handleBook = async () => {
    if (!formData.staffId || !formData.startTime) {
      setMessage('Please select a barber and time')
      return
    }

    try {
      setLoading(true)
      await createBooking({
        clientName: 'Client',
        clientPhone: '',
        service: formData.service,
        duration: formData.duration,
        price: 25,
        staffId: formData.staffId,
        startTime: formData.startTime
      })
      setMessage('✓ Appointment booked!')
      setTimeout(() => {
        setShowForm(false)
        setMessage('')
        setFormData({ service: 'Skin Fade', duration: 30, staffId: staff[0]?.id || '', startTime: '' })
        if (onBookingCreated) onBookingCreated()
      }, 1500)
    } catch (err) {
      setMessage('Failed to book appointment')
    } finally {
      setLoading(false)
    }
  }

  const services = ['Skin Fade', 'Skin Fade + Beard', 'Lineup', 'Line Shape', 'Beard Trim', 'Kids Cut']

  return (
    <div className="client-booking-panel">
      <div className="panel-header">
        <h3>📅 Book Appointment</h3>
        <button
          className={`toggle-btn ${showForm ? 'active' : ''}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Close' : '+ Book Now'}
        </button>
      </div>

      {showForm && (
        <div className="booking-form">
          {message && <div className="booking-message">{message}</div>}

          <div className="form-group">
            <label>Service</label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({...formData, service: e.target.value})}
            >
              {services.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Duration</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
              >
                <option value={30}>30 mins</option>
                <option value={45}>45 mins</option>
                <option value={60}>60 mins</option>
              </select>
            </div>

            <div className="form-group">
              <label>Barber</label>
              <select
                value={formData.staffId}
                onChange={(e) => setFormData({...formData, staffId: e.target.value})}
              >
                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Date & Time</label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({...formData, startTime: e.target.value})}
            />
          </div>

          <button
            className="btn-book"
            onClick={handleBook}
            disabled={loading}
          >
            {loading ? 'Booking...' : '✓ Confirm Booking'}
          </button>
        </div>
      )}
    </div>
  )
}
