import { useState, useEffect } from 'react'
import { getPayments, getStaffMetrics, getCustomers, getBookings } from '../../services/squareService'
import '../../styles/Pages.css'

export default function AnalyticsPage({ selectedShop }) {
  const [data, setData] = useState(null)
  const [period, setPeriod] = useState('week')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [payments, metrics, customers, bookings] = await Promise.all([
          getPayments(selectedShop, period),
          getStaffMetrics(selectedShop, period),
          getCustomers(selectedShop),
          getBookings(selectedShop)
        ])

        const revenue = payments.reduce((sum, p) => sum + p.amount, 0)
        const avgServicePrice = payments.length > 0 ? revenue / payments.length : 0
        const returning = customers.filter(c => c.visits > 1).length
        const retention = customers.length > 0 ? ((returning / customers.length) * 100).toFixed(1) : 0

        setData({
          revenue,
          transactions: payments.length,
          avgPrice: avgServicePrice,
          customers: customers.length,
          retention,
          topStaff: metrics.sort((a, b) => b.revenueToday - a.revenueToday)[0],
          totalBookings: bookings.length
        })
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedShop, period])

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📊 Analytics</h1>
        <p className="page-subtitle">Detailed business metrics</p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label>Period: </label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {loading ? (
        <p>Loading analytics...</p>
      ) : data ? (
        <>
          <div className="page-grid">
            <div className="card">
              <div className="card-header">Total Revenue</div>
              <div className="card-value">£{data.revenue.toFixed(2)}</div>
            </div>
            <div className="card">
              <div className="card-header">Transactions</div>
              <div className="card-value">{data.transactions}</div>
            </div>
            <div className="card">
              <div className="card-header">Avg Service Price</div>
              <div className="card-value">£{data.avgPrice.toFixed(2)}</div>
            </div>
            <div className="card">
              <div className="card-header">Retention Rate</div>
              <div className="card-value">{data.retention}%</div>
            </div>
          </div>

          <h3 style={{ marginTop: '32px' }}>Key Insights</h3>
          <div className="insights">
            <p>✓ You have {data.customers} total customers</p>
            <p>✓ {data.retention}% are returning clients</p>
            <p>✓ Average transaction value: £{data.avgPrice.toFixed(2)}</p>
            {data.topStaff && <p>✓ Top performer: {data.topStaff.staffName}</p>}
          </div>
        </>
      ) : null}
    </div>
  )
}
