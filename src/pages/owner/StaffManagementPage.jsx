import { useState, useEffect } from 'react'
import { getStaff, getStaffMetrics } from '../../services/squareService'
import '../../styles/Pages.css'

export default function StaffManagementPage({ selectedShop }) {
  const [staff, setStaff] = useState([])
  const [metrics, setMetrics] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [staffData, metricsData] = await Promise.all([
          getStaff(selectedShop),
          getStaffMetrics(selectedShop)
        ])
        setStaff(staffData)
        const metricsMap = {}
        metricsData.forEach(m => {
          metricsMap[m.staffId] = m
        })
        setMetrics(metricsMap)
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedShop])

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">👥 Staff Management</h1>
        <p className="page-subtitle">Team performance and scheduling</p>
      </div>

      {loading ? (
        <p>Loading staff data...</p>
      ) : (
        <div className="staff-table">
          {staff.map((member, idx) => {
            const m = metrics[member.id] || {}
            return (
              <div key={idx} className="staff-row">
                <div className="staff-name">{member.name}</div>
                <div className="staff-stat">
                  <span className="label">Today</span>
                  <span className="value">{m.appointmentsToday || 0} appointments</span>
                </div>
                <div className="staff-stat">
                  <span className="label">Revenue</span>
                  <span className="value">£{(m.revenueToday || 0).toFixed(2)}</span>
                </div>
                <div className="staff-stat">
                  <span className="label">Rating</span>
                  <span className="value">⭐ {(m.avgRating || 4.8).toFixed(1)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="info-box" style={{ marginTop: '32px' }}>
        <h3>Quick Actions</h3>
        <p>View full analytics on the Analytics page to compare staff performance week-over-week.</p>
      </div>
    </div>
  )
}
