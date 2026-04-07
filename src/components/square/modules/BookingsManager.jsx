import { useState, useEffect } from 'react'
import { getBookings, createBooking, cancelBooking, getStaff } from '../../../services/squareService'

export default function BookingsManager({ selectedShop }) {
  const [bookings, setBookings] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    clientName: '', clientPhone: '', service: '', duration: 30, price: 25, staffId: '', startTime: ''
  })

  useEffect(() => { loadData() }, [selectedShop])

  const loadData = async () => {
    try {
      setLoading(true)
      const [b, s] = await Promise.all([
        getBookings(selectedShop, 'today'),
        getStaff(selectedShop)
      ])
      setBookings(b)
      setStaff(s)
      setError(null)
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to load')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      if (!formData.clientName || !formData.service || !formData.staffId) {
        setMessage('Fill all required fields')
        return
      }
      await createBooking(formData)
      setMessage('✓ Booking created')
      setShowForm(false)
      setFormData({ clientName: '', clientPhone: '', service: '', duration: 30, price: 25, staffId: '', startTime: '' })
      loadData()
      setTimeout(() => setMessage(''), 2000)
    } catch (err) {
      setMessage('Failed to create')
    }
  }

  const handleCancel = async (id) => {
    if (window.confirm('Cancel?')) {
      try {
        await cancelBooking(id)
        setMessage('✓ Cancelled')
        loadData()
        setTimeout(() => setMessage(''), 2000)
      } catch (err) {
        setMessage('Failed')
      }
    }
  }

  if (loading) return <div className="module-loading">Loading...</div>
  if (error) return <div className="module-error">⚠️ {error}</div>

  return (
    <div className="bookings-module">
      <div className="module-header">
        <h3>Today's Bookings ({bookings.length})</h3>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Close' : '+ New'}
        </button>
      </div>

      {message && <div className="status-message">{message}</div>}

      {showForm && (
        <form className="booking-form" onSubmit={handleCreate}>
          <h4>Create Booking</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Client *</label>
              <input type="text" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input type="tel" value={formData.clientPhone} onChange={(e) => setFormData({...formData, clientPhone: e.target.value})} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Service *</label>
              <input type="text" value={formData.service} onChange={(e) => setFormData({...formData, service: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Barber *</label>
              <select value={formData.staffId} onChange={(e) => setFormData({...formData, staffId: e.target.value})}>
                <option value="">Select</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Duration (mins)</label>
              <input type="number" min="15" value={formData.duration} onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})} />
            </div>
            <div className="form-group">
              <label>Price (£)</label>
              <input type="number" min="0" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save">✓ Create</button>
            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>✕ Cancel</button>
          </div>
        </form>
      )}

      <div className="bookings-list">
        {bookings.length > 0 ? (
          bookings.map(b => (
            <div key={b.id} className="booking-card">
              <div className="booking-main">
                <div><div className="client-name">{b.clientName}</div><div className="client-phone">{b.clientPhone}</div></div>
                <div className="booking-time"><div className="time-label">📅</div><div className="time-value">{new Date(b.startTime).toLocaleString('en-GB')}</div></div>
              </div>
              <div className="booking-details">
                <span className="detail">✂️ {b.service}</span>
                <span className="detail">👤 {b.staffName}</span>
                <span className="detail">⏱️ {b.duration}m</span>
                <span className="detail">£{b.price}</span>
              </div>
              <div className="booking-status">
                <span className={`status-badge ${b.status}`}>{b.status.toUpperCase()}</span>
                {b.status === 'confirmed' && <button className="btn-cancel-small" onClick={() => handleCancel(b.id)}>✕</button>}
              </div>
            </div>
          ))
        ) : <p className="empty-state">No bookings</p>}
      </div>
    </div>
  )
}
