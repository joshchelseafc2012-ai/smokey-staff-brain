import { useState, useEffect } from 'react'
import { getDailyRevenue, getRevenueByService, getRevenueByStaff } from '../../../services/squareService'

export default function RevenueAnalytics({ selectedShop }) {
  const [revenue, setRevenue] = useState(null)
  const [byService, setByService] = useState(null)
  const [byStaff, setByStaff] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadRevenueData()
  }, [selectedShop])

  const loadRevenueData = async () => {
    try {
      setLoading(true)
      const [daily, service, staff] = await Promise.all([
        getDailyRevenue(selectedShop, 'today'),
        getRevenueByService(selectedShop, 'week'),
        getRevenueByStaff(selectedShop, 'week')
      ])
      setRevenue(daily)
      setByService(service)
      setByStaff(staff)
      setError(null)
    } catch (err) {
      console.error('Error loading revenue:', err)
      setError('Failed to load revenue data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="module-loading">Loading revenue data...</div>
  if (error) return <div className="module-error">⚠️ {error}</div>

  return (
    <div className="revenue-module">
      <div className="revenue-card main">
        <div className="card-label">Today's Revenue</div>
        <div className="card-value">£{revenue?.toFixed(2) || '0.00'}</div>
        <button className="action-button" onClick={loadRevenueData}>🔄 Refresh</button>
      </div>

      <div className="revenue-section">
        <h3>Revenue by Service</h3>
        {byService && Object.keys(byService).length > 0 ? (
          <div className="revenue-list">
            {Object.entries(byService).sort(([, a], [, b]) => b - a).map(([service, amount]) => (
              <div key={service} className="revenue-item">
                <span className="service-name">{service}</span>
                <span className="service-amount">£{amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ) : <p className="empty-state">No revenue data</p>}
      </div>

      <div className="revenue-section">
        <h3>Revenue by Staff</h3>
        {byStaff && Object.keys(byStaff).length > 0 ? (
          <div className="revenue-list">
            {Object.entries(byStaff).sort(([, a], [, b]) => b - a).map(([staff, amount]) => (
              <div key={staff} className="revenue-item">
                <span className="staff-name">{staff}</span>
                <span className="staff-amount">£{amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ) : <p className="empty-state">No staff data</p>}
      </div>
    </div>
  )
}
