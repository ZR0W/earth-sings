import type { EventCategory } from '../types'

const CATEGORIES: { id: EventCategory; label: string; emoji: string; color: string }[] = [
  { id: 'wildfires', label: 'Wildfires', emoji: '🔥', color: '#ff6b35' },
  { id: 'storms', label: 'Storms', emoji: '🌀', color: '#4a9eff' },
  { id: 'volcanoes', label: 'Volcanoes', emoji: '🌋', color: '#cc44aa' },
  { id: 'floods', label: 'Floods', emoji: '🌊', color: '#22ccbb' },
]

interface ControlsProps {
  playing: boolean
  activeCategories: Set<EventCategory>
  eventCount: number
  dataSource: 'fixture' | 'live'
  onTogglePlay: () => void
  onToggleCategory: (cat: EventCategory) => void
}

export function Controls({
  playing,
  activeCategories,
  eventCount,
  dataSource,
  onTogglePlay,
  onToggleCategory,
}: ControlsProps) {
  return (
    <div className="controls">
      <div className="controls-header">
        <h1 className="app-title">Earth Sings</h1>
        <p className="app-subtitle">
          NASA Earth events as generative music
        </p>
      </div>

      <button
        className={`play-btn ${playing ? 'playing' : ''}`}
        onClick={onTogglePlay}
        aria-label={playing ? 'Stop' : 'Play'}
      >
        {playing ? '■ Stop' : '▶ Play'}
      </button>

      <div className="category-filters">
        {CATEGORIES.map(cat => (
          <label
            key={cat.id}
            className={`category-chip ${activeCategories.has(cat.id) ? 'active' : ''}`}
            style={{ '--chip-color': cat.color } as React.CSSProperties}
          >
            <input
              type="checkbox"
              checked={activeCategories.has(cat.id)}
              onChange={() => onToggleCategory(cat.id)}
            />
            <span className="chip-emoji">{cat.emoji}</span>
            <span className="chip-label">{cat.label}</span>
          </label>
        ))}
      </div>

      <div className="status-bar">
        <span className="event-count">
          <span className="count-number">{eventCount}</span> active events
        </span>
        <span className={`data-source ${dataSource}`}>
          {dataSource === 'live' ? '● Live' : '◆ Fixture'}
        </span>
      </div>
    </div>
  )
}
