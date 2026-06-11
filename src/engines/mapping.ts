import type { CanonicalEvent, EventCategory, MappingParams } from '../types'

// D Dorian scale: D E F G A B C
const D_DORIAN = ['D', 'E', 'F', 'G', 'A', 'B', 'C']

const CATEGORY_OCTAVE_BASE: Record<EventCategory, number> = {
  wildfires: 5,
  storms: 2,
  volcanoes: 3,
  floods: 4,
}

const CATEGORY_DURATION: Record<EventCategory, string> = {
  wildfires: '16n',
  storms: '2n',
  volcanoes: '1n',
  floods: '8n',
}

const CATEGORY_REVERB: Record<EventCategory, number> = {
  wildfires: 0.15,
  storms: 0.45,
  volcanoes: 0.75,
  floods: 0.55,
}

function latitudeToOctaveOffset(lat: number): number {
  // High latitude → higher register (+1 octave), equator → 0
  return Math.round((Math.abs(lat) / 90) * 2)
}

function longitudeToPan(lon: number): number {
  return lon / 180
}

function pickNote(category: EventCategory, lat: number, lon: number): string {
  const octaveBase = CATEGORY_OCTAVE_BASE[category]
  const octaveOffset = latitudeToOctaveOffset(lat)
  const octave = Math.min(octaveBase + octaveOffset, 7)

  // Use lon to deterministically pick a scale degree
  const degreeIndex = Math.abs(Math.round(lon)) % D_DORIAN.length
  return `${D_DORIAN[degreeIndex]}${octave}`
}

function recencyVelocity(isNew: boolean): number {
  return isNew ? 0.85 : 0.45
}

export function mapEvent(event: CanonicalEvent): MappingParams {
  return {
    event,
    note: pickNote(event.category, event.latitude, event.longitude),
    velocity: recencyVelocity(event.isNew),
    pan: longitudeToPan(event.longitude),
    duration: CATEGORY_DURATION[event.category],
    reverbWet: CATEGORY_REVERB[event.category],
    instrument: event.category,
  }
}

export function mapEvents(events: CanonicalEvent[]): MappingParams[] {
  return events
    .filter(e => !e.isClosed)
    .map(mapEvent)
    .sort((a, b) => (b.event.isNew ? 1 : 0) - (a.event.isNew ? 1 : 0))
}
