import { useState } from 'react'
import '../styles/GuideModal.css'

const GUIDE_CONTENT = {
  'Smokey Skin Fade': {
    title: 'Smokey Skin Fade Process',
    steps: [
      {
        title: 'Prep',
        description: 'Brush hair out, check head shape, check crown direction, decide fade height'
      },
      {
        title: 'Set Your Baseline',
        description: '0.5 guideline, keep it clean and consistent, no wobbling'
      },
      {
        title: 'Open Lever Work',
        description: 'Work up into the 1, keep strokes short, keep the fade tight'
      },
      {
        title: '1 Guard Work',
        description: 'Build the blend, don\'t rush this, this is where most barbers mess up'
      },
      {
        title: 'Detail',
        description: 'Corners, shadows, weight lines, use corners of the blade'
      },
      {
        title: 'Final Polish',
        description: 'Razor the edges, check symmetry, check back of head, dust off properly'
      }
    ]
  },
  'Beard Shaping Basics': {
    title: 'Beard Shaping',
    steps: [
      {
        title: 'Comb Everything Out',
        description: 'You can\'t shape what you can\'t see'
      },
      {
        title: 'Line the Cheeks',
        description: 'Natural, not drawn-on. We don\'t do Instagram beards here'
      },
      {
        title: 'Line the Neck',
        description: 'Two fingers above Adam\'s apple. Clean curve, no boxy shapes'
      },
      {
        title: 'Fade Into the Sideburns',
        description: 'Blend it — don\'t leave a step'
      },
      {
        title: 'Razor Finish',
        description: 'Always. Clients feel the difference'
      }
    ]
  },
  'Daily Open/Close': {
    title: 'Daily Opening & Closing',
    subsections: [
      {
        heading: 'Opening Checklist',
        items: [
          'Lights on',
          'Music on',
          'Towels stocked',
          'Clippers oiled',
          'Razors loaded',
          'Stations clean',
          'Reception tidy',
          'Card machine charged',
          'Floor spotless'
        ]
      },
      {
        heading: 'Closing Checklist',
        items: [
          'Full sweep + mop',
          'Bins emptied',
          'Towels bagged',
          'Tools sanitised',
          'Stations wiped',
          'Mirrors polished',
          'Reception reset',
          'Card machine docked',
          'Doors locked properly'
        ]
      }
    ]
  },
  'Clean-Down Routine': {
    title: 'Clean-Down Routine',
    description: 'This is non-negotiable. After every client:',
    steps: [
      { title: 'Brush Down Chair', description: '' },
      { title: 'Disinfect Armrests', description: '' },
      { title: 'Wipe Station', description: '' },
      { title: 'Sweep Floor', description: '' },
      { title: 'Sanitise Tools', description: '' },
      { title: 'Fresh Neck Strip', description: '' },
      { title: 'Fresh Cape', description: '' }
    ],
    footer: 'If your station looks messy, you look messy. This is what separates Smokey from the rest.'
  }
}

export default function GuideModal({ guideName, onClose }) {
  const guide = GUIDE_CONTENT[guideName]

  if (!guide) return null

  return (
    <div className="guide-modal-overlay" onClick={onClose}>
      <div className="guide-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="guide-modal-header">
          <h2>{guide.title}</h2>
          <button className="guide-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="guide-modal-body">
          {guide.description && (
            <p className="guide-description">{guide.description}</p>
          )}

          {guide.steps && (
            <div className="guide-steps">
              {guide.steps.map((step, idx) => (
                <div key={idx} className="guide-step">
                  <div className="step-number">{idx + 1}</div>
                  <div className="step-content">
                    <h4>{step.title}</h4>
                    {step.description && <p>{step.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {guide.subsections && (
            <div className="guide-subsections">
              {guide.subsections.map((section, idx) => (
                <div key={idx} className="guide-subsection">
                  <h4>{section.heading}</h4>
                  <ul>
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {guide.footer && (
            <div className="guide-footer">
              {guide.footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
