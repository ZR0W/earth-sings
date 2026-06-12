import * as Tone from 'tone'
import type { EventCategory, MappingParams } from '../types'

const VOICE_BUDGET = 8

export interface AudioEvent {
  timestamp: number
  eventId: string
  eventTitle: string
  category: EventCategory
  note: string
  velocity: number
  pan: number
  duration: string
  isFocused: boolean
}

export type AudioEventCallback = (e: AudioEvent) => void

const CATEGORY_EMOJI: Record<EventCategory, string> = {
  wildfires: '🔥',
  storms: '🌀',
  volcanoes: '🌋',
  floods: '🌊',
}

interface InstrumentSet {
  wildfires: Tone.PluckSynth
  storms: Tone.Synth
  volcanoes: Tone.FMSynth
  floods: Tone.Synth
}

interface ReverbSet {
  wildfires: Tone.Reverb
  storms: Tone.Reverb
  volcanoes: Tone.Reverb
  floods: Tone.Reverb
}

export class AudioEngine {
  private instruments: InstrumentSet | null = null
  private reverbs: ReverbSet | null = null
  private panners: Record<EventCategory, Tone.Panner> | null = null
  private isPlaying = false
  private scheduledIds: number[] = []
  private focusedEventId: string | null = null
  private onAudioEvent: AudioEventCallback | null = null

  setAudioEventCallback(cb: AudioEventCallback | null) {
    this.onAudioEvent = cb
  }

  private buildInstruments() {
    const wildfireReverb = new Tone.Reverb({ decay: 0.8, wet: 0.15 }).toDestination()
    const stormReverb = new Tone.Reverb({ decay: 3.5, wet: 0.45 }).toDestination()
    const volcanoReverb = new Tone.Reverb({ decay: 6.0, wet: 0.75 }).toDestination()
    const floodReverb = new Tone.Reverb({ decay: 2.5, wet: 0.55 }).toDestination()

    const wildFirePanner = new Tone.Panner(0).connect(wildfireReverb)
    const stormPanner = new Tone.Panner(0).connect(stormReverb)
    const volcanoPanner = new Tone.Panner(0).connect(volcanoReverb)
    const floodPanner = new Tone.Panner(0).connect(floodReverb)

    this.reverbs = {
      wildfires: wildfireReverb,
      storms: stormReverb,
      volcanoes: volcanoReverb,
      floods: floodReverb,
    }

    this.panners = {
      wildfires: wildFirePanner,
      storms: stormPanner,
      volcanoes: volcanoPanner,
      floods: floodPanner,
    }

    const wildfire = new Tone.PluckSynth({
      attackNoise: 1,
      dampening: 3000,
      resonance: 0.92,
    }).connect(wildFirePanner)

    const storm = new Tone.Synth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 1.5, decay: 0.5, sustain: 0.8, release: 3.0 },
      volume: -6,
    }).connect(stormPanner)

    const volcano = new Tone.FMSynth({
      modulationIndex: 12,
      harmonicity: 0.5,
      oscillator: { type: 'sine' },
      envelope: { attack: 2.0, decay: 1.0, sustain: 0.9, release: 4.0 },
      volume: -8,
    }).connect(volcanoPanner)

    const flood = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.3, decay: 0.4, sustain: 0.6, release: 2.0 },
      volume: -4,
    }).connect(floodPanner)

    this.instruments = { wildfires: wildfire, storms: storm, volcanoes: volcano, floods: flood }
  }

  async start(mappings: MappingParams[], activeCategories: Set<EventCategory>) {
    await Tone.start()
    Tone.getTransport().stop()
    Tone.getTransport().cancel()
    this.scheduledIds = []

    if (!this.instruments) {
      this.buildInstruments()
    }

    this.isPlaying = true
    this.scheduleMappings(mappings, activeCategories)
    Tone.getTransport().start()
  }

  private scheduleMappings(mappings: MappingParams[], activeCategories: Set<EventCategory>) {
    const filtered = mappings
      .filter(m => activeCategories.has(m.instrument))
      .slice(0, VOICE_BUDGET)

    if (filtered.length === 0) return

    const instruments = this.instruments!
    const panners = this.panners!

    // Spread events across an 8-bar loop
    const loopBars = 8
    const totalBeats = loopBars * 4

    filtered.forEach((m, i) => {
      const beatOffset = (i / filtered.length) * totalBeats
      const timeStr = `+${beatOffset * (60 / 120)}`  // 120 BPM

      const id = Tone.getTransport().scheduleRepeat((time) => {
        if (!this.isPlaying) return

        const isFocused = this.focusedEventId === null || this.focusedEventId === m.event.id
        const velocity = isFocused ? m.velocity : m.velocity * 0.15

        panners[m.instrument].pan.value = m.pan

        const instr = instruments[m.instrument]
        if (instr instanceof Tone.PluckSynth) {
          instr.triggerAttack(m.note, time)
        } else {
          instr.triggerAttackRelease(m.note, m.duration, time, velocity)
        }

        // Emit audit event (scheduled in audio thread; use setTimeout to push to JS thread)
        const audioEvt: AudioEvent = {
          timestamp: Date.now(),
          eventId: m.event.id,
          eventTitle: m.event.title,
          category: m.instrument,
          note: m.note,
          velocity: parseFloat(velocity.toFixed(2)),
          pan: parseFloat(m.pan.toFixed(2)),
          duration: m.duration,
          isFocused,
        }

        // Option B: console log
        const emoji = CATEGORY_EMOJI[m.instrument]
        console.group(`${emoji} [earth-sings] ${m.event.title}`)
        console.log('note     :', m.note)
        console.log('category :', m.instrument)
        console.log('velocity :', audioEvt.velocity, isFocused ? '(full)' : '(attenuated)')
        console.log('pan      :', audioEvt.pan, audioEvt.pan < 0 ? '← left' : audioEvt.pan > 0 ? 'right →' : 'center')
        console.log('duration :', m.duration)
        console.log('focused  :', isFocused)
        console.log('event id :', m.event.id)
        console.groupEnd()

        // Option A: notify UI callback
        if (this.onAudioEvent) {
          setTimeout(() => this.onAudioEvent!(audioEvt), 0)
        }
      }, `${loopBars}m`, timeStr)

      this.scheduledIds.push(id as unknown as number)
    })
  }

  updateMappings(mappings: MappingParams[], activeCategories: Set<EventCategory>) {
    if (!this.isPlaying) return
    Tone.getTransport().cancel()
    this.scheduledIds = []
    this.scheduleMappings(mappings, activeCategories)
  }

  setFocus(eventId: string | null) {
    this.focusedEventId = eventId
  }

  stop() {
    this.isPlaying = false
    this.focusedEventId = null
    Tone.getTransport().stop()
    Tone.getTransport().cancel()
    this.scheduledIds = []

    if (this.instruments) {
      Object.values(this.instruments).forEach(i => {
        try { i.releaseAll?.() } catch { /* ignore */ }
      })
    }
  }

  dispose() {
    this.stop()
    if (this.instruments) {
      Object.values(this.instruments).forEach(i => i.dispose())
      this.instruments = null
    }
    if (this.reverbs) {
      Object.values(this.reverbs).forEach(r => r.dispose())
      this.reverbs = null
    }
    if (this.panners) {
      Object.values(this.panners).forEach(p => p.dispose())
      this.panners = null
    }
  }

  get playing() {
    return this.isPlaying
  }
}
