import { useState, useEffect } from 'react'
import { getCustomers, getCustomerLoyalty, addLoyaltyPoints, redeemLoyaltyPoints } from '../../../services/squareService'

export default function LoyaltyManager({ selectedShop }) {
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [loyalty, setLoyalty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState('')
  const [action, setAction] = useState(null)
  const [amount, setAmount] = useState('')

  useEffect(() => { loadCustomers() }, [selectedShop])

  useEffect(() => {
    if (selectedCustomer) {
      loadLoyalty(selectedCustomer.id)
    }
  }, [selectedCustomer])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const data = await getCustomers(selectedShop)
      setCustomers(data)
      setError(null)
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to load')
    } finally {
      setLoading(false)
    }
  }

  const loadLoyalty = async (id) => {
    try {
      const data = await getCustomerLoyalty(id)
      setLoyalty(data)
      setError(null)
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to load')
    }
  }

  const handleAddPoints = async () => {
    try {
      const pts = parseInt(amount)
      if (isNaN(pts) || pts <= 0) {
        setMessage('Invalid amount')
        return
      }
      await addLoyaltyPoints(selectedCustomer.id, pts)
      setMessage(`✓ Added ${pts}`)
      setAmount('')
      setAction(null)
      loadLoyalty(selectedCustomer.id)
      setTimeout(() => setMessage(''), 2000)
    } catch (err) {
      setMessage('Failed')
    }
  }

  const handleRedeemPoints = async () => {
    try {
      const pts = parseInt(amount)
      if (isNaN(pts) || pts <= 0) {
        setMessage('Invalid amount')
        return
      }
      if (pts > loyalty.pointsBalance) {
        setMessage('Not enough points')
        return
      }
      await redeemLoyaltyPoints(selectedCustomer.id, pts)
      setMessage(`✓ Redeemed ${pts}`)
      setAmount('')
      setAction(null)
      loadLoyalty(selectedCustomer.id)
      setTimeout(() => setMessage(''), 2000)
    } catch (err) {
      setMessage('Failed')
    }
  }

  if (loading) return <div className="module-loading">Loading...</div>
  if (error) return <div className="module-error">⚠️ {error}</div>

  return (
    <div className="loyalty-module">
      <div className="loyalty-header">
        <h3>Loyalty Management</h3>
        <div className="customer-selector">
          <select value={selectedCustomer?.id || ''} onChange={(e) => { const c = customers.find(x => x.id === e.target.value); setSelectedCustomer(c); }} className="select-input">
            <option value="">Select customer...</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.visits} visits)</option>)}
          </select>
        </div>
      </div>

      {message && <div className="status-message">{message}</div>}

      {selectedCustomer && loyalty && (
        <div className="loyalty-container">
          <div className="loyalty-display">
            <div className="card-content">
              <div className="card-section">
                <div className="section-label">Customer</div>
                <div className="section-value">{selectedCustomer.name}</div>
              </div>
              <div className="card-section">
                <div className="section-label">Tier</div>
                <div className={`tier-badge ${loyalty.tier}`}>{loyalty.tier.toUpperCase()}</div>
              </div>
              <div className="card-section highlight">
                <div className="section-label">Points</div>
                <div className="points-big">{loyalty.pointsBalance}</div>
              </div>
              <div className="card-section">
                <div className="section-label">This Month</div>
                <div className="section-value">{loyalty.pointsThisMonth}</div>
              </div>
            </div>
          </div>

          <div className="loyalty-actions">
            <button className={`action-btn ${action === 'add' ? 'active' : ''}`} onClick={() => setAction(action === 'add' ? null : 'add')}>➕ Add</button>
            <button className={`action-btn ${action === 'redeem' ? 'active' : ''}`} onClick={() => setAction(action === 'redeem' ? null : 'redeem')}>💰 Redeem</button>
          </div>

          {action && (
            <div className="action-form">
              <h4>{action === 'add' ? 'Add Points' : 'Redeem Points'}</h4>
              <div className="form-group">
                <label>Amount</label>
                <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter" autoFocus />
              </div>
              <div className="form-actions">
                <button className="btn-submit" onClick={action === 'add' ? handleAddPoints : handleRedeemPoints}>✓ Confirm</button>
                <button className="btn-cancel" onClick={() => { setAction(null); setAmount(''); }}>✕ Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {!selectedCustomer && <p className="empty-state">Select a customer</p>}
    </div>
  )
}
