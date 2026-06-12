import type { CanonicalEvent, EventCategory } from '../types'

const CATEGORY_META: Record<EventCategory, { emoji: string; color: string }> = {
  wildfires: { emoji: '🔥', color: '#ff6b35' },
  storms: { emoji: '🌀', color: '#4a9eff' },
  volcanoes: { emoji: '🌋', color: '#cc44aa' },
  floods: { emoji: '🌊', color: '#22ccbb' },
}

interface EventListProps {
  events: CanonicalEvent[]
  focusedId: string | null
  onFocus: (id: string | null) => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function EventList({ events, focusedId, onFocus }: EventListProps) {
  const open = events.filter(e => !e.isClosed)

  return (
    <div className="event-list">
      <div className="event-list-header">Events</div>
      {open.length === 0 && (
        <div className="event-list-empty">No active events</div>
      )}
      {open.map(event => {
        const meta = CATEGORY_META[event.category]
        const focused = focusedId === event.id
        return (
          <button
            key={event.id}
            className={`event-item ${focused ? 'focused' : ''} ${event.isNew ? 'new' : ''}`}
            style={{ '--item-color': meta.color } as React.CSSProperties}
            onClick={() => onFocus(focused ? null : event.id)}
            title={`Click to focus audio on this event`}
          >
            <span className="event-emoji">{meta.emoji}</span>
            <div className="event-details">
              <div className="event-title">{event.title}</div>
              <div className="event-meta">
                {formatDate(event.detectedAt)}
                {event.isNew && <span className="new-badge">NEW</span>}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
