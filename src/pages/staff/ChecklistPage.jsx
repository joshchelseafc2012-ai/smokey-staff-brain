import { useState } from 'react'
import '../../styles/Pages.css'

export default function ChecklistPage() {
  const [checklists, setChecklists] = useState({
    opening: {
      title: 'Opening Checklist',
      items: [
        'Lights on',
        'Music on',
        'Towels ready',
        'Clippers oiled',
        'Razors sharp',
        'Station clean',
        'Reception tidy',
        'Card machine charged',
        'Floor spotless'
      ],
      done: {}
    },
    closing: {
      title: 'Closing Checklist',
      items: [
        'Sweep & mop',
        'Bins emptied',
        'Towels bagged',
        'Tools sanitised',
        'Stations wiped',
        'Mirrors polished',
        'Reception reset',
        'Card machine docked',
        'Everything locked'
      ],
      done: {}
    }
  })

  const toggleItem = (phase, idx) => {
    setChecklists(prev => ({
      ...prev,
      [phase]: {
        ...prev[phase],
        done: {
          ...prev[phase].done,
          [idx]: !prev[phase].done[idx]
        }
      }
    }))
  }

  const renderChecklist = (phase) => {
    const list = checklists[phase]
    const completed = Object.values(list.done).filter(Boolean).length
    const total = list.items.length

    return (
      <div key={phase} className="checklist-section">
        <h3>{list.title}</h3>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(completed / total) * 100}%` }} />
        </div>
        <p className="progress-text">{completed}/{total} complete</p>

        <div className="checklist-items">
          {list.items.map((item, idx) => (
            <label key={idx} className={`checklist-item ${list.done[idx] ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={list.done[idx] || false}
                onChange={() => toggleItem(phase, idx)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">✓ Daily Checklist</h1>
        <p className="page-subtitle">Keep your station and shop in top shape</p>
      </div>

      {renderChecklist('opening')}
      {renderChecklist('closing')}
    </div>
  )
}
