import '../../styles/Pages.css'

export default function ServicesPage() {
  const services = [
    {
      name: 'Skin Fade',
      price: '£25',
      time: '30-45 mins',
      desc: 'Clean skin fade with sharp lines. Perfect for modern, fresh look.'
    },
    {
      name: 'Skin Fade + Beard',
      price: '£30',
      time: '45-60 mins',
      desc: 'Full fade with professional beard shaping and line work.'
    },
    {
      name: 'Lineup',
      price: '£15',
      time: '15-20 mins',
      desc: 'Sharp edge work and hairline definition. Quick refresh.'
    },
    {
      name: 'Beard Trim',
      price: '£12',
      time: '15 mins',
      desc: 'Professional beard shaping and light trim.'
    },
    {
      name: 'Line Shape',
      price: '£10',
      time: '10 mins',
      desc: 'Cheek and neck line definition. Perfect with any cut.'
    },
    {
      name: 'Kids Cut',
      price: '£15',
      time: '20-30 mins',
      desc: 'Friendly, patient barbers great with younger clients.'
    }
  ]

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">✂️ Our Services</h1>
        <p className="page-subtitle">Professional barber services for every look</p>
      </div>

      <div className="services-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
      }}>
        {services.map((service, idx) => (
          <div key={idx} className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h4 style={{ margin: '0 0 8px 0' }}>{service.name}</h4>
            <p style={{ margin: '0 0 16px 0', color: '#666', fontSize: '14px' }}>
              {service.desc}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: 600, color: '#C9A84C' }}>
                {service.price}
              </span>
              <span style={{ fontSize: '12px', color: '#999' }}>
                ⏱️ {service.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="info-box" style={{ marginTop: '32px' }}>
        <h3>First Time?</h3>
        <p>Come 10 mins early so we can chat about your style and what you're looking for. We'll make sure you leave looking fresh.</p>
      </div>
    </div>
  )
}
