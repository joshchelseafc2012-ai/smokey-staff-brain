import '../../styles/Pages.css'

export default function ProceduresPage() {
  const procedures = [
    {
      name: 'Skin Fade',
      steps: [
        'Brush out, check shape, decide height',
        '0.5 guideline, clean and consistent',
        'Work up into 1, short strokes',
        'Build blend with 1 guard, don\'t rush',
        'Detail corners, shadows, weight lines',
        'Razor edges, check symmetry, dust off'
      ]
    },
    {
      name: 'Beard Shaping',
      steps: [
        'Comb out - you can\'t shape what you can\'t see',
        'Line cheeks - natural, not Instagram style',
        'Line neck - two fingers above Adam\'s apple, clean curve',
        'Fade sideburns - blend it, no steps',
        'Razor finish - always'
      ]
    },
    {
      name: 'Lineup',
      steps: [
        'Comb hairline upright',
        'Light hand - just define natural lines',
        'Receding corners? Subtle is better',
        'Edge work around ears',
        'Dust off, check both sides'
      ]
    }
  ]

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">✂️ Procedures</h1>
        <p className="page-subtitle">Step-by-step guides for every service</p>
      </div>

      <div className="procedures-grid">
        {procedures.map((proc, idx) => (
          <div key={idx} className="procedure-card">
            <h3>{proc.name}</h3>
            <ol className="procedure-steps">
              {proc.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="info-box" style={{ marginTop: '32px' }}>
        <h3>Remember</h3>
        <ul>
          <li>If it looks good, it IS good</li>
          <li>Take your time - rushing shows</li>
          <li>Confidence makes the difference</li>
          <li>Every head of hair is different</li>
          <li>Talk to the client, learn their preferences</li>
        </ul>
      </div>
    </div>
  )
}
