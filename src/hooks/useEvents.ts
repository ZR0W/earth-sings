import { useEffect, useRef, useState } from 'react'
import type { CanonicalEvent, EventCategory } from '../types'
import { EventPoller } from '../data/eonet'

export function useEvents(activeCategories: EventCategory[]) {
  const [events, setEvents] = useState<CanonicalEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pollerRef = useRef(new EventPoller())

  useEffect(() => {
    const poller = pollerRef.current
    setLoading(true)
    setError(null)

    poller.startPolling(activeCategories, (incoming) => {
      setEvents(incoming)
      setLoading(false)
    })

    return () => poller.stopPolling()
  }, [activeCategories.join(',')])  // eslint-disable-line react-hooks/exhaustive-deps

  return { events, loading, error }
}
