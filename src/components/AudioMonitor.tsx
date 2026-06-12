import { useState } from 'react'
import type { AudioEvent } from '../engines/audio'

const CATEGORY_EMOJI: Record<string, string> = {
  wildfires: '🔥',
  storms: '🌀',
  volcanoes: '🌋',
  floods: '🌊',
}

const CATEGORY_COLOR: Record<string, string> = {
  wildfires: '#ff6b35',
  storms: '#4a9eff',
  volcanoes: '#cc44aa',
  floods: '#22ccbb',
}

function relativeTime(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 2) return 'now'
  if (diff < 60) return `${diff}s ago`
  return `${Math.floor(diff / 60)}m ago`
}

function panLabel(pan: number): string {
  if (pan < -0.1) return `L${Math.abs(Math.round(pan * 100))}`
  if (pan > 0.1) return `R${Math.round(pan * 100)}`
  return 'C'
}

interface Props {
  current: AudioEvent | null
  log: AudioEvent[]
}

export function AudioMonitor({ current, log }: Props) {
  const [open, setOpen] = useState(true)

  return (
    <div className="audio-monitor">
      <button className="monitor-toggle" onClick={() => setOpen(o => !o)}>
        <span className="monitor-title">AUDIO MONITOR</span>
        <span className="monitor-chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="monitor-body">
          {/* NOW row */}
          <div className={`monitor-now ${current ? 'active' : ''}`}>
            {current ? (
              <>
                <span
                  className="monitor-pulse"
                  style={{ background: CATEGORY_COLOR[current.category] }}
                />
                <span className="monitor-emoji">{CATEGORY_EMOJI[current.category]}</span>
                <span className="monitor-event-title">{current.eventTitle}</span>
                <span className="monitor-pills">
                  <span className="monitor-pill note">{current.note}</span>
                  <span className="monitor-pill">vel {current.velocity}</span>
                  <span className="monitor-pill">{panLabel(current.pan)}</span>
                  <span className="monitor-pill">{current.duration}</span>
                  {current.isFocused && <span className="monitor-pill focused">SOLO</span>}
                </span>
              </>
            ) : (
              <span className="monitor-idle">Waiting for next note…</span>
            )}
          </div>

          {/* Rolling log */}
          <div className="monitor-log">
            {log.length === 0 && (
              <div className="monitor-log-empty">No events yet</div>
            )}
            {log.map((e, idx) => (
              <div
                key={`${e.eventId}-${e.timestamp}`}
                className={`monitor-log-row ${idx === 0 ? 'monitor-log-latest' : ''}`}
                style={{ '--cat-color': CATEGORY_COLOR[e.category] } as React.CSSProperties}
              >
                <span className="log-time">{relativeTime(e.timestamp)}</span>
                <span className="log-emoji">{CATEGORY_EMOJI[e.category]}</span>
                <span className="log-title">{e.eventTitle}</span>
                <span className="log-pills">
                  <span className="log-pill">{e.note}</span>
                  <span className="log-pill">{panLabel(e.pan)}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
