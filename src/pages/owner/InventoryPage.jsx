import { useState, useEffect } from 'react'
import InventoryManager from '../../components/square/modules/InventoryManager'
import '../../styles/Pages.css'

export default function InventoryPage({ selectedShop }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📦 Inventory</h1>
        <p className="page-subtitle">Stock levels and reordering</p>
      </div>

      <InventoryManager selectedShop={selectedShop} />

      <div className="info-box" style={{ marginTop: '32px' }}>
        <h3>Inventory Tips</h3>
        <ul>
          <li>Keep clipper blades well-stocked - dull blades = unhappy clients</li>
          <li>Monitor oil and beard products - these drive loyalty and upsells</li>
          <li>Reorder when items hit yellow - don't wait for red</li>
          <li>Check expiry dates monthly (especially products)</li>
        </ul>
      </div>
    </div>
  )
}
