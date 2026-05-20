# Earth Sings — project progress

**Purpose:** Single place to see **current phase**, **what changed**, and **what’s next**. Update this file when a phase milestone is reached or when scope shifts.

**Related:** [DESIGN_AND_PROJECT_PLAN.md](DESIGN_AND_PROJECT_PLAN.md) · [JIRA_BACKLOG.md](JIRA_BACKLOG.md) · [PRE_PHASE_DATA_EXPLORATION.md](PRE_PHASE_DATA_EXPLORATION.md)

---

## Current status

| Field | Value |
| --- | --- |
| **Last updated** | 2026-04-29 |
| **Current phase** | Pre-Phase — EONET data exploration (planned, not started) |
| **Design / planning** | Complete — see design doc and backlog |
| **Implementation (main app)** | Not started — blocked until pre-phase findings inform mappings |
| **Next milestone** | Build vanilla [EONET explorer](PRE_PHASE_DATA_EXPLORATION.md) → write `docs/findings/EONET_DATA_PROFILE.md` |

**One-line summary:** Product decisions for stack and Phase 0 audio are locked; next work is a vanilla JS explorer to profile live EONET data before coding the generative app.

---

## Phase tracker

| Phase | Name | Status | Notes |
| --- | --- | --- | --- |
| **Pre-Phase** | EONET data exploration (vanilla explorer + findings) | Not started | Plan: [PRE_PHASE_DATA_EXPLORATION.md](PRE_PHASE_DATA_EXPLORATION.md); stories ES-P01–ES-P06 |
| **Foundation** | Repo, toolchain, canonical types stub | Not started | Stories ES-100, ES-101 — after pre-phase |
| **Phase 0** | Offline prototype (fixture + mapping + minimal UI) | Not started | Uses locked categories + single mode; fixture informed by pre-phase |
| **Phase 1** | EONET BFF + live snapshot + fixture/live toggle | Not started | Polling/TTL informed by pre-phase measurements |
| **Phase 2** | Meaningful audio (deltas, voices, palette v1) | Not started | Category recognition, smoothing |
| **Phase 3** | Interactive map & controls | Not started | Map, filters, focus, A/V sync cues |
| **Phase 4** | Refinement & launch readiness | Not started | Presets, perf, observability, onboarding, runbook |

**Legend:** Not started | In progress | Blocked | Done

---

## Changelog (brief)

Add a row when you finish a phase or hit a major milestone.

| Date | Milestone | Description |
| --- | --- | --- |
| 2026-04-29 | Planning deliverable | Added [DESIGN_AND_PROJECT_PLAN.md](DESIGN_AND_PROJECT_PLAN.md) (architecture, EONET mapping, phases 0–4). |
| 2026-04-29 | PM artifacts | Added [JIRA_BACKLOG.md](JIRA_BACKLOG.md) (epics/stories/tasks) and this progress doc; docs consolidated under `docs/`. |
| 2026-04-29 | Pre-phase plan + decisions | Locked stack/categories/harmony; added [PRE_PHASE_DATA_EXPLORATION.md](PRE_PHASE_DATA_EXPLORATION.md). |

---

## Decisions log

Record **locked** choices in the summary table. Each topic below explains **options**, **tradeoffs**, and **current status**.

### Summary (locked vs open)

| Topic | Status | Your decision |
| --- | --- | --- |
| Application stack | **Locked** | Defaults (see below) |
| Phase 0 / pre-phase categories | **Locked** | Wildfires, storms, volcanoes, floods |
| Harmonic strategy | **Locked** | Single mode / key |
| EONET category API IDs | **Open** | Confirm exact slugs in pre-phase explorer (`/categories`) |
| Map provider | **Open** | Phase 3 |
| Polling interval + cache TTL | **Open** | Phase 1 — measure in pre-phase |
| Listening profile default | **Open** | Phase 2–3 |

---

### 1. Application stack

**What it controls:** How the main Earth Sings app is built (not the pre-phase explorer, which stays vanilla JS).

| Option | Pros | Cons |
| --- | --- | --- |
| **A — Defaults: React + TypeScript + Vite + Tone.js** (recommended in design doc) | Large ecosystem, fast UI iteration, Tone handles scheduling/transport | Heavier than minimal vanilla; needs build tooling |
| **B — SvelteKit + Tone.js** | Less boilerplate, smaller bundles | Smaller hiring/docs pool; different patterns |
| **C — Vanilla TS + Web Audio only** | Maximum control, no framework weight | Slower UI work; manual audio graph management |
| **D — Vanilla TS + Tone.js (no React)** | Simple deploy, still good audio | Awkward state/UI as app grows |

**Locked decision:** **A — Defaults** (React + TypeScript + Tone.js; BFF with Node when Phase 1 starts).

**Rationale:** Matches [DESIGN_AND_PROJECT_PLAN.md](DESIGN_AND_PROJECT_PLAN.md) §4; best fit for map + controls in Phase 3.

---

### 2. Phase 0 category set (musical “voices”)

**What it controls:** Which natural event types get distinct timbres in the prototype and fixture data.

| Option | Pros | Cons |
| --- | --- | --- |
| **Four core types** — wildfires, storms, volcanoes, floods | Clear sonic palette; aligns with design doc examples; manageable for listening tests | Misses ice, dust, drought until later |
| **EONET “top N by volume”** | Music reflects what’s actually active on Earth | Skews toward wildfires/storms; categories shift seasonally |
| **All EONET categories** | Complete coverage | Too many voices for Phase 0; muddy mix |

**Locked decision:** **Wildfires, storms, volcanoes, floods.**

**Follow-up (pre-phase):** Map display names → EONET `category` query IDs (e.g. docs use `wildfires`, `severeStorms`) via [Categories API](https://eonet.gsfc.nasa.gov/api/v3/categories).

**Rationale:** Enough variety to test mapping; still small enough to hear each category clearly in a 2–3 minute loop.

---

### 3. Harmonic strategy

**What it controls:** Background harmony while event-driven voices change.

| Option | Pros | Cons |
| --- | --- | --- |
| **A — Single mode / key** (locked) | Easiest to judge category timbres; deterministic; simpler tests | Less long-session variety |
| **B — Slow rotating chord/mode cycle** | Richer over 20+ minutes | Harder to debug; can mask weak category mappings |
| **C — No fixed harmony (free/atonal)** | Flexible | Sounds random; conflicts with “meaningful not random” goal |

**Locked decision:** **A — Single mode / key** for Phase 0 (revisit in Phase 4 presets if needed).

**Rationale:** Design Phase 0 exit criteria focus on **category recognition**; fixed harmony keeps the experiment controlled.

---

### 4. Map provider (Phase 3 — not yet decided)

**What it controls:** Interactive map in the main app.

| Option | Pros | Cons |
| --- | --- | --- |
| **Mapbox GL JS** | Polished UX, good performance | API token, usage limits/cost |
| **Leaflet + OSM** | Free tiles, simple | Less polished; tile usage policy awareness |
| **OpenLayers** (EONET how-to uses this for NASA layers) | Aligns with [how-to guide](https://eonet.gsfc.nasa.gov/how-to-guide) WMTS examples | Steeper API; heavier for a music-first UI |

**Status:** Defer until Phase 3. Pre-phase explorer can skip map or add optional OpenLayers tab later.

---

### 5. Polling interval + cache TTL (Phase 1 — not yet decided)

**What it controls:** How “live” the music feels vs API load and jitter.

| Option | Pros | Cons |
| --- | --- | --- |
| **Fast poll (30s–1m)** | Reacts quickly to new events | May hear noise from curation churn; more requests |
| **Medium poll (5–15m)** | Stable listening; matches slow EONET updates | New events feel delayed |
| **Adaptive per category** | Tuned to category cadence | More complex BFF logic |

**Status:** Decide after **pre-phase** snapshot-compare sessions (see [PRE_PHASE_DATA_EXPLORATION.md](PRE_PHASE_DATA_EXPLORATION.md)).

---

### 6. Listening profile default (Phase 2–3 — not yet decided)

**What it controls:** Busy vs sparse default mix.

| Option | Pros | Cons |
| --- | --- | --- |
| **Ambient** | Pleasant long sessions; less fatigue | Harder to “read” individual events |
| **Analytical** | Clear event-to-sound linkage | Can feel busy or harsh |

**Status:** Defer until Phase 2 listening tests.

---

## Next actions (for the team)

1. **Pre-phase:** Implement explorer per [PRE_PHASE_DATA_EXPLORATION.md](PRE_PHASE_DATA_EXPLORATION.md) (ES-P01 → ES-P06); no React/Tone yet.
2. Document EONET category IDs for the four locked types in `docs/findings/EONET_DATA_PROFILE.md`.
3. After pre-phase exit: start **ES-100** / **ES-101** (main app foundation) with fixture shaped by findings.
4. Update **Phase tracker** and **Changelog** when pre-phase completes.
