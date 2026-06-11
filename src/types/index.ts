export type EventCategory = 'wildfires' | 'storms' | 'volcanoes' | 'floods'

export interface CanonicalEvent {
  id: string
  title: string
  category: EventCategory
  latitude: number
  longitude: number
  detectedAt: string   // ISO8601
  updatedAt: string    // ISO8601
  isNew: boolean       // detected within last 24h
  isClosed: boolean
  magnitude: number | null
  sourceUrl: string
}

export interface MappingParams {
  event: CanonicalEvent
  note: string          // e.g. "D4", "A3"
  velocity: number      // 0–1
  pan: number           // -1 to +1
  duration: string      // Tone.js notation e.g. "4n"
  reverbWet: number     // 0–1
  instrument: EventCategory
}

export interface AudioParams {
  playing: boolean
  activeCategories: Set<EventCategory>
  focusedEventId: string | null
  voiceBudget: number
}

export interface EONETResponse {
  title: string
  description: string
  link: string
  events: EONETEvent[]
}

export interface EONETEvent {
  id: string
  title: string
  description: string | null
  link: string
  closed: string | null
  categories: Array<{ id: string; title: string }>
  sources: Array<{ id: string; url: string }>
  geometry: Array<{
    magnitudeValue: number | null
    magnitudeUnit: string | null
    date: string
    type: 'Point'
    coordinates: [number, number]  // [lon, lat]
  }>
}
