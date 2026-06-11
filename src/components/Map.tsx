import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { CanonicalEvent, EventCategory } from '../types'

const CATEGORY_COLOR: Record<EventCategory, string> = {
  wildfires: '#ff6b35',
  storms: '#4a9eff',
  volcanoes: '#cc44aa',
  floods: '#22ccbb',
}

interface MapProps {
  events: CanonicalEvent[]
  focusedId: string | null
  onFocus: (id: string | null) => void
}

export function Map({ events, focusedId, onFocus }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<globalThis.Map<string, L.CircleMarker>>(new globalThis.Map())

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    mapRef.current = L.map(containerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      worldCopyJump: true,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(mapRef.current)

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  // Sync markers with events
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const open = events.filter(e => !e.isClosed)
    const currentIds = new Set(open.map(e => e.id))

    // Remove stale markers
    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        marker.remove()
        markersRef.current.delete(id)
      }
    })

    // Add or update markers
    open.forEach(event => {
      const color = CATEGORY_COLOR[event.category]
      const isFocused = focusedId === event.id
      const radius = event.isNew ? 10 : 7

      if (markersRef.current.has(event.id)) {
        const existing = markersRef.current.get(event.id)!
        existing.setStyle({
          color: isFocused ? '#ffffff' : color,
          fillColor: color,
          weight: isFocused ? 3 : 1,
          fillOpacity: isFocused ? 1.0 : 0.7,
        })
        existing.setRadius(isFocused ? radius + 4 : radius)
      } else {
        const marker = L.circleMarker([event.latitude, event.longitude], {
          radius,
          color: isFocused ? '#ffffff' : color,
          fillColor: color,
          fillOpacity: 0.7,
          weight: isFocused ? 3 : 1,
        })

        marker.bindPopup(`
          <strong>${event.title}</strong><br/>
          Category: ${event.category}<br/>
          ${event.isNew ? '<span style="color:#22ccbb">● New event</span><br/>' : ''}
          Lat: ${event.latitude.toFixed(2)}, Lon: ${event.longitude.toFixed(2)}
        `)

        marker.on('click', () => {
          onFocus(focusedId === event.id ? null : event.id)
          map.panTo([event.latitude, event.longitude], { animate: true })
        })

        marker.addTo(map)
        markersRef.current.set(event.id, marker)
      }
    })
  }, [events, focusedId, onFocus])

  // Pan to focused event
  useEffect(() => {
    if (!focusedId || !mapRef.current) return
    const event = events.find(e => e.id === focusedId)
    if (event) {
      mapRef.current.flyTo([event.latitude, event.longitude], 5, { animate: true, duration: 1.2 })
    }
  }, [focusedId, events])

  return <div ref={containerRef} className="map-container" />
}
