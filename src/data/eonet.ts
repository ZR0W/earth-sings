import type { CanonicalEvent, EONETResponse, EventCategory } from '../types'
import fixtureData from './fixture.json'

const EONET_BASE = 'https://eonet.gsfc.nasa.gov/api/v3'
const POLL_INTERVAL_MS = 5 * 60 * 1000

const CATEGORY_MAP: Record<string, EventCategory> = {
  wildfires: 'wildfires',
  'sea and lake ice': 'floods',
  'severe storms': 'storms',
  'volcanoes': 'volcanoes',
  'floods': 'floods',
  'tropical storms': 'storms',
  'dust and haze': 'wildfires',
}

const EONET_CATEGORY_IDS: Record<EventCategory, string[]> = {
  wildfires: ['wildfires'],
  storms: ['severeStorms', 'tropicalStorms'],
  volcanoes: ['volcanoes'],
  floods: ['floods'],
}

function normalizeCategory(raw: string): EventCategory | null {
  const lower = raw.toLowerCase()
  return CATEGORY_MAP[lower] ?? null
}

function isWithin24h(dateStr: string): boolean {
  return Date.now() - new Date(dateStr).getTime() < 24 * 60 * 60 * 1000
}

export function normalizeEONETEvent(raw: {
  id: string
  title: string
  closed: string | null
  categories: Array<{ id: string; title: string }>
  sources: Array<{ id: string; url: string }>
  geometry: Array<{
    magnitudeValue: number | null
    date: string
    type: string
    coordinates: [number, number]
  }>
}): CanonicalEvent | null {
  const cat = raw.categories
    .map(c => normalizeCategory(c.title))
    .find(c => c !== null)

  if (!cat) return null

  const geo = raw.geometry[raw.geometry.length - 1]
  if (!geo || geo.type !== 'Point') return null

  const [lon, lat] = geo.coordinates

  return {
    id: raw.id,
    title: raw.title,
    category: cat,
    latitude: lat,
    longitude: lon,
    detectedAt: raw.geometry[0].date,
    updatedAt: geo.date,
    isNew: isWithin24h(raw.geometry[0].date),
    isClosed: raw.closed !== null,
    magnitude: geo.magnitudeValue,
    sourceUrl: raw.sources[0]?.url ?? '',
  }
}

async function fetchEONET(categories: EventCategory[]): Promise<CanonicalEvent[]> {
  const categoryIds = categories.flatMap(c => EONET_CATEGORY_IDS[c])
  const params = new URLSearchParams({
    status: 'open',
    limit: '100',
    category: categoryIds.join(','),
  })

  const res = await fetch(`${EONET_BASE}/events?${params}`)
  if (!res.ok) throw new Error(`EONET fetch failed: ${res.status}`)

  const data: EONETResponse = await res.json()
  return data.events
    .map(e => normalizeEONETEvent(e))
    .filter((e): e is CanonicalEvent => e !== null)
}

function loadFixture(): CanonicalEvent[] {
  return fixtureData as CanonicalEvent[]
}

export class EventPoller {
  private timer: ReturnType<typeof setInterval> | null = null
  private useFixture: boolean

  constructor() {
    this.useFixture = import.meta.env.VITE_USE_FIXTURE === 'true'
  }

  async fetchOnce(categories: EventCategory[]): Promise<CanonicalEvent[]> {
    if (this.useFixture) {
      return loadFixture().filter(e => categories.includes(e.category))
    }
    try {
      return await fetchEONET(categories)
    } catch {
      console.warn('EONET fetch failed, falling back to fixture data')
      return loadFixture().filter(e => categories.includes(e.category))
    }
  }

  startPolling(
    categories: EventCategory[],
    onUpdate: (events: CanonicalEvent[]) => void
  ) {
    this.fetchOnce(categories).then(onUpdate)
    this.timer = setInterval(async () => {
      const events = await this.fetchOnce(categories)
      onUpdate(events)
    }, POLL_INTERVAL_MS)
  }

  stopPolling() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
