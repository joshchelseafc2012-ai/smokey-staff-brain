import { useState, useEffect } from 'react'
import { getCustomers, searchCustomers, createCustomer } from '../../../services/squareService'

export default function CustomersManager({ selectedShop }) {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', favoriteStaff: ''
  })

  useEffect(() => { loadCustomers() }, [selectedShop])
  
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch()
    } else {
      setFilteredCustomers(customers)
    }
  }, [searchQuery, customers])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const data = await getCustomers(selectedShop)
      setCustomers(data)
      setFilteredCustomers(data)
      setError(null)
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to load')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    try {
      const results = await searchCustomers(searchQuery)
      setFilteredCustomers(results)
    } catch (err) {
      setFilteredCustomers([])
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      if (!formData.name || !formData.phone) {
        setMessage('Name and phone required')
        return
      }
      await createCustomer(formData)
      setMessage('✓ Created')
      setShowForm(false)
      setFormData({ name: '', email: '', phone: '', favoriteStaff: '' })
      loadCustomers()
      setTimeout(() => setMessage(''), 2000)
    } catch (err) {
      setMessage('Failed')
    }
  }

  if (loading) return <div className="module-loading">Loading...</div>
  if (error) return <div className="module-error">⚠️ {error}</div>

  return (
    <div className="customers-module">
      <div className="module-header">
        <h3>Customers ({customers.length})</h3>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Close' : '+ New'}
        </button>
      </div>

      {message && <div className="status-message">{message}</div>}

      {showForm && (
        <form className="customer-form" onSubmit={handleCreate}>
          <h4>Add Customer</h4>
          <div className="form-group">
            <label>Name *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Phone *</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save">✓ Add</button>
            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>✕ Cancel</button>
          </div>
        </form>
      )}

      <div className="search-bar">
        <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
        {searchQuery && <button className="btn-clear" onClick={() => setSearchQuery('')}>✕</button>}
      </div>

      <div className="customers-list">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map(c => (
            <div key={c.id} className="customer-card">
              <div className="customer-header">
                <div className="customer-name">{c.name}</div>
                <div className="visit-count">👤 {c.visits} visits</div>
              </div>
              <div className="customer-contact">
                <div className="contact-item"><span className="label">📞</span><span className="value">{c.phone}</span></div>
                {c.email && <div className="contact-item"><span className="label">📧</span><span className="value">{c.email}</span></div>}
              </div>
              <div className="customer-details">
                {c.favoriteStaff && <div className="detail"><span className="label">Favorite:</span><span className="value">{c.favoriteStaff}</span></div>}
                {c.totalSpent > 0 && <div className="detail"><span className="label">Spent:</span><span className="value">£{c.totalSpent.toFixed(2)}</span></div>}
              </div>
            </div>
          ))
        ) : <p className="empty-state">{searchQuery ? 'Not found' : 'No customers'}</p>}
      </div>
    </div>
  )
}
