import { useState, useEffect } from 'react'
import { getInventory, getLowStockItems, updateInventory } from '../../../services/squareService'

export default function InventoryManager({ selectedShop }) {
  const [inventory, setInventory] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editQuantity, setEditQuantity] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => { loadInventory() }, [selectedShop])

  const loadInventory = async () => {
    try {
      setLoading(true)
      const [all, low] = await Promise.all([
        getInventory(selectedShop),
        getLowStockItems(selectedShop)
      ])
      setInventory(all)
      setLowStock(low)
      setError(null)
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (itemId, qty) => {
    try {
      const q = parseInt(qty)
      if (isNaN(q) || q < 0) {
        setMessage('Invalid quantity')
        return
      }
      await updateInventory(itemId, q)
      setMessage('✓ Updated')
      setEditingId(null)
      loadInventory()
      setTimeout(() => setMessage(''), 2000)
    } catch (err) {
      setMessage('Failed to update')
    }
  }

  if (loading) return <div className="module-loading">Loading...</div>
  if (error) return <div className="module-error">⚠️ {error}</div>

  return (
    <div className="inventory-module">
      {lowStock.length > 0 && (
        <div className="alert-box warning">
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">
            <h4>Low Stock Alert</h4>
            <p>{lowStock.length} items below threshold</p>
          </div>
        </div>
      )}

      {message && <div className="success-message">{message}</div>}

      <div className="list-header">
        <h3>Items ({inventory.length})</h3>
        <button className="action-button" onClick={loadInventory}>🔄 Refresh</button>
      </div>

      <div className="inventory-list">
        {inventory.length > 0 ? (
          inventory.map(item => {
            const isLow = item.quantity <= item.minThreshold
            return (
              <div key={item.id} className={`inventory-item ${isLow ? 'low-stock' : ''}`}>
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-category">{item.category}</div>
                </div>
                <div className="item-details">
                  <div className="detail"><span className="label">Current:</span><span className={`value ${isLow ? 'warning' : ''}`}>{item.quantity}</span></div>
                  <div className="detail"><span className="label">Min:</span><span className="value">{item.minThreshold}</span></div>
                </div>
                <div className="item-actions">
                  {editingId === item.id ? (
                    <div className="edit-form">
                      <input type="number" min="0" value={editQuantity} onChange={(e) => setEditQuantity(e.target.value)} />
                      <button className="btn-save" onClick={() => handleUpdate(item.id, editQuantity)}>✓</button>
                      <button className="btn-cancel" onClick={() => setEditingId(null)}>✕</button>
                    </div>
                  ) : (
                    <button className="btn-edit" onClick={() => { setEditingId(item.id); setEditQuantity(item.quantity.toString()); }}>✏️ Edit</button>
                  )}
                </div>
              </div>
            )
          })
        ) : <p className="empty-state">No items</p>}
      </div>
    </div>
  )
}
