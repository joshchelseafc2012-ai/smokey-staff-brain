import { useState, useEffect } from 'react'
import { getStaffMetrics } from '../../../services/squareService'

export default function StaffMetrics({ selectedShop }) {
  const [metrics, setMetrics] = useState([])
  const [period, setPeriod] = useState('today')
  const [sortBy, setSortBy] = useState('revenue')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { loadMetrics() }, [selectedShop, period])

  const loadMetrics = async () => {
    try {
      setLoading(true)
      const data = await getStaffMetrics(selectedShop, period)
      setMetrics(data)
      setError(null)
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to load metrics')
    } finally {
      setLoading(false)
    }
  }

  const sorted = [...metrics].sort((a, b) => {
    if (sortBy === 'revenue') return b.revenue - a.revenue
    if (sortBy === 'appointments') return b.appointments - a.appointments
    if (sortBy === 'rebook') return b.rebookRate - a.rebookRate
    return 0
  })

  if (loading) return <div className="module-loading">Loading...</div>
  if (error) return <div className="module-error">⚠️ {error}</div>

  return (
    <div className="staff-module">
      <div className="module-controls">
        <div className="control-group">
          <label>Period:</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="today">Today</option>
            <option value="week">Week</option>
          </select>
        </div>
        <div className="control-group">
          <label>Sort:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="revenue">Revenue</option>
            <option value="appointments">Appointments</option>
            <option value="rebook">Rebook Rate</option>
          </select>
        </div>
        <button className="action-button" onClick={loadMetrics}>🔄 Refresh</button>
      </div>

      {metrics.length > 0 ? (
        <div className="staff-table">
          <div className="table-header">
            <div className="col col-name">Name</div>
            <div className="col col-stat">Appointments</div>
            <div className="col col-stat">Revenue</div>
            <div className="col col-stat">Rebook</div>
            <div className="col col-stat">Rating</div>
          </div>
          {sorted.map((staff) => (
            <div key={staff.id} className="table-row">
              <div className="col col-name"><div className="staff-name">{staff.name}</div></div>
              <div className="col col-stat"><div className="stat-value">{staff.appointments}</div></div>
              <div className="col col-stat"><div className="stat-value">£{staff.revenue}</div></div>
              <div className="col col-stat">
                <div className="stat-value">{(staff.rebookRate * 100).toFixed(0)}%</div>
                <div className="stat-bar"><div className="bar-fill" style={{ width: `${staff.rebookRate * 100}%` }}></div></div>
              </div>
              <div className="col col-stat"><div className="stat-value">⭐ {staff.rating}</div></div>
            </div>
          ))}
        </div>
      ) : <p className="empty-state">No data</p>}
    </div>
  )
}
