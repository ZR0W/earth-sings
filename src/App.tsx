import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controls } from './components/Controls'
import { EventList } from './components/EventList'
import { Map } from './components/Map'
import { AudioEngine } from './engines/audio'
import { mapEvents } from './engines/mapping'
import { useEvents } from './hooks/useEvents'
import type { EventCategory } from './types'

const ALL_CATEGORIES: EventCategory[] = ['wildfires', 'storms', 'volcanoes', 'floods']

export function App() {
  const [playing, setPlaying] = useState(false)
  const [activeCategories, setActiveCategories] = useState<Set<EventCategory>>(
    new Set(ALL_CATEGORIES)
  )
  const [focusedId, setFocusedId] = useState<string | null>(null)

  const activeCatArray = useMemo(
    () => ALL_CATEGORIES.filter(c => activeCategories.has(c)),
    [activeCategories]
  )

  const { events, loading } = useEvents(activeCatArray)

  const audioRef = useRef(new AudioEngine())

  const mappings = useMemo(() => mapEvents(events), [events])

  const dataSource = import.meta.env.VITE_USE_FIXTURE === 'true' ? 'fixture' : 'live'

  const handleTogglePlay = useCallback(async () => {
    const engine = audioRef.current
    if (engine.playing) {
      engine.stop()
      setPlaying(false)
      setFocusedId(null)
    } else {
      await engine.start(mappings, activeCategories)
      setPlaying(true)
    }
  }, [mappings, activeCategories])

  // Keep audio in sync with category changes while playing
  useEffect(() => {
    if (playing) {
      audioRef.current.updateMappings(mappings, activeCategories)
    }
  }, [mappings, activeCategories, playing])

  const handleToggleCategory = useCallback((cat: EventCategory) => {
    setActiveCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) {
        next.delete(cat)
      } else {
        next.add(cat)
      }
      return next
    })
  }, [])

  const handleFocus = useCallback((id: string | null) => {
    setFocusedId(id)
    audioRef.current.setFocus(id)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    const engine = audioRef.current
    return () => engine.dispose()
  }, [])

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Controls
          playing={playing}
          activeCategories={activeCategories}
          eventCount={events.filter(e => !e.isClosed).length}
          dataSource={dataSource as 'fixture' | 'live'}
          onTogglePlay={handleTogglePlay}
          onToggleCategory={handleToggleCategory}
        />
        {loading ? (
          <div className="loading">Loading events…</div>
        ) : (
          <EventList
            events={events}
            focusedId={focusedId}
            onFocus={handleFocus}
          />
        )}
      </aside>
      <main className="map-area">
        <Map
          events={events}
          focusedId={focusedId}
          onFocus={handleFocus}
        />
      </main>
    </div>
  )
}
