import { useState, useEffect } from 'react'
import LoyaltyManager from '../../components/square/modules/LoyaltyManager'
import { getCustomerLoyalty } from '../../services/squareService'
import '../../styles/Pages.css'

export default function LoyaltyPage({ user, selectedShop }) {
  const [loyalty, setLoyalty] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCustomerLoyalty(user.id || 'client')
        setLoyalty(data)
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user.id])

  let tier = 'Standard'
  let tierColor = '#999'
  if (loyalty && loyalty.pointsBalance >= 1000) {
    tier = 'Gold'
    tierColor = '#FFD700'
  } else if (loyalty && loyalty.pointsBalance >= 500) {
    tier = 'Silver'
    tierColor = '#C0C0C0'
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🎁 Loyalty Program</h1>
        <p className="page-subtitle">Earn points with every visit</p>
      </div>

      {loading ? (
        <p>Loading loyalty info...</p>
      ) : loyalty ? (
        <>
          <div className="loyalty-card" style={{
            background: `linear-gradient(135deg, ${tierColor}22 0%, ${tierColor}11 100%)`,
            border: `2px solid ${tierColor}`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
                  {loyalty.pointsBalance} Points
                </h3>
                <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
                  Tier: <span style={{ fontWeight: 600, color: tierColor }}>{tier}</span>
                </p>
              </div>
              <div style={{ fontSize: '48px' }}>
                {tier === 'Gold' ? '👑' : tier === 'Silver' ? '⭐' : '🎫'}
              </div>
            </div>

            {tier !== 'Gold' && (
              <div style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>
                  {tier === 'Silver' 
                    ? `${1000 - loyalty.pointsBalance} points to Gold tier`
                    : `${500 - loyalty.pointsBalance} points to Silver tier`}
                </p>
                <div style={{
                  background: '#eee',
                  height: '8px',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: tierColor,
                    height: '100%',
                    width: `${Math.min((loyalty.pointsBalance / 1000) * 100, 100)}%`,
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>
            )}
          </div>

          <h3>Tier Benefits</h3>
          <div className="info-box">
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li><strong>Standard:</strong> 1 point per £1 spent</li>
              <li><strong>Silver (500+):</strong> 10% off your next service</li>
              <li><strong>Gold (1000+):</strong> Free service every 500 points + priority booking</li>
            </ul>
          </div>

          <h3 style={{ marginTop: '24px' }}>Manage Points</h3>
          <LoyaltyManager selectedShop={selectedShop} />
        </>
      ) : null}
    </div>
  )
}
