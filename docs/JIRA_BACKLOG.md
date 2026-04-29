# Earth Sings — Jira-style backlog

Use this document as the single source for epics, stories, and tasks when creating issues in Jira (or GitHub Projects). **Issue keys** below are suggestions—replace with your tracker’s prefix (e.g. `ES-101`).

**Related:** [DESIGN_AND_PROJECT_PLAN.md](DESIGN_AND_PROJECT_PLAN.md) · [PROGRESS.md](PROGRESS.md)

---

## How to use this in Jira

| Field | Guidance |
| --- | --- |
| **Epic** | One Jira Epic per row in the Epics table (link all child stories). |
| **Story** | Import Summary + Description + Acceptance Criteria from each story block. |
| **Sub-task / Task** | Checkbox items under each story map to sub-tasks or linked tasks. |
| **Labels** | `phase-0` … `phase-4`, `audio`, `data`, `ui`, `infra`, `docs`. |
| **Priority** | P0 = blocks phase exit; P1 = should-have; P2 = nice-to-have. |

**Story points:** Optional. Use 1, 2, 3, 5, 8 if your team estimates; otherwise omit.

---

## Epics overview

| Epic key (suggested) | Name | Phase | Goal (one line) |
| --- | --- | --- | --- |
| **ES-EPIC-0** | Project foundation | Pre–Phase 0 | Repo, toolchain, and skeleton aligned with design architecture. |
| **ES-EPIC-1** | Offline prototype | Phase 0 | Fixture-driven deterministic audio + minimal UI. |
| **ES-EPIC-2** | EONET data integration | Phase 1 | BFF ingestion, canonical model, live vs fixture mode. |
| **ES-EPIC-3** | Meaningful generative audio | Phase 2 | Delta-aware mapping, voice limits, category sonic identity. |
| **ES-EPIC-4** | Interactive map & controls | Phase 3 | Map UI, filters, focus mode, A/V sync cues. |
| **ES-EPIC-5** | Polish & launch readiness | Phase 4 | Presets, perf, observability, onboarding, runbook. |

---

## Epic ES-EPIC-0 — Project foundation

**Objective:** Establish the minimal app shape (frontend + optional BFF) so Phase 0 work lands in the right layers.

### Story ES-100 — Initialize frontend application

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P0 |
| **Labels** | `phase-0`, `infra` |
| **Description** | Scaffold the chosen frontend (React + TypeScript per design default) with play/stop placeholder and audio context lifecycle (user gesture). |

**Acceptance criteria**

- [ ] App builds and runs locally.
- [ ] Audio context starts only after explicit user action (browser policy).
- [ ] Empty or stub mapping hook exists for later `MappingEngine`.

**Tasks / sub-tasks**

- [ ] **ES-100-1** Choose and document package manager and Node version (lockfile committed).
- [ ] **ES-100-2** Add Tone.js (or confirm raw Web Audio) dependency per design default.
- [ ] **ES-100-3** Add minimal CI script placeholder (lint/build) if repo uses CI.

---

### Story ES-101 — Define canonical TypeScript types for events (stub)

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P1 |
| **Labels** | `data`, `phase-0` |

**Acceptance criteria**

- [ ] Types match the mental model in design doc: id, category, geometry hints, time fields, derived flags TBD.
- [ ] Used by fixture loader in ES-110.

**Tasks**

- [ ] **ES-101-1** Draft `CanonicalEvent` (or equivalent) aligned with `EventNormalizer` responsibilities in design doc.
- [ ] **ES-101-2** Document optional vs required fields for EONET-shaped payloads (comments only until Phase 1).

---

## Epic ES-EPIC-1 — Phase 0: Offline prototype

**Objective:** Static fixture (20–50 events), mapping engine, deterministic 2–3 min loop, category filter, no live API.

### Story ES-110 — Author synthetic event fixture JSON

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P0 |
| **Labels** | `phase-0`, `data` |

**Acceptance criteria**

- [ ] 20–50 synthetic events covering agreed initial categories (e.g. wildfire, storm, volcano, flood).
- [ ] Same file replayed yields identical parsed structure.

**Tasks**

- [ ] **ES-110-1** Decide final Phase 0 category set (**decision gate** — see Phase 0 in design doc).
- [ ] **ES-110-2** Include variety: recency, rough geographic spread, multiple events per region.
- [ ] **ES-110-3** Validate fixture against canonical types (ES-101).

---

### Story ES-111 — Implement mapping engine (fixture → musical state)

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P0 |
| **Labels** | `phase-0`, `audio` |

**Acceptance criteria**

- [ ] Deterministic output for identical inputs (no unseeded randomness).
- [ ] Category → timbre family; recency → articulation; region → pan/register per design §5.1.
- [ ] Bounded parameters (no runaway levels).

**Tasks**

- [ ] **ES-111-1** Implement rule table (config object or module) with documented rationale per mapping.
- [ ] **ES-111-2** Harmonic framework: single mode vs slow rotation (**decision gate**).
- [ ] **ES-111-3** Unit-test or snapshot-test deterministic mapping for at least 3 categories.

---

### Story ES-112 — Minimal UI: play / stop + one category filter

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P0 |
| **Labels** | `phase-0`, `ui` |

**Acceptance criteria**

- [ ] Play/stop controls audio pipeline.
- [ ] One filter changes audible output predictably (e.g. hide one category → that voice layer drops).

**Tasks**

- [ ] **ES-112-1** Wire UI to `AudioEngine` / Tone transport.
- [ ] **ES-112-2** Expose category filter state to mapping or post-mix.

---

### Story ES-113 — Phase 0 validation & exit

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P0 |
| **Labels** | `phase-0`, `qa` |

**Acceptance criteria**

- [ ] Stable 2–3 minute evolving loop; categories audibly distinct.
- [ ] 5-minute run: acceptable CPU on target browser(s).
- [ ] Document results in [PROGRESS.md](PROGRESS.md) and mark Phase 0 complete.

**Tasks**

- [ ] **ES-113-1** Determinism check across reloads.
- [ ] **ES-113-2** Manual listening checklist (3+ categories recognizable).
- [ ] **ES-113-3** Update PROGRESS.md — Phase 0.

---

## Epic ES-EPIC-2 — Phase 1: Basic EONET data integration

**Objective:** Backend poll + cache + normalized snapshot API; UI toggle fixture vs live; graceful degradation.

### Story ES-120 — BFF: ingestion service for EONET v3

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P0 |
| **Labels** | `phase-1`, `infra`, `data` |

**Acceptance criteria**

- [ ] Scheduled fetch from EONET v3 events endpoint(s) per [NASA EONET docs](https://eonet.gsfc.nasa.gov/docs/v3).
- [ ] Retries and basic health logging.

**Tasks**

- [ ] **ES-120-1** Scaffold Fastify or Express BFF (design default).
- [ ] **ES-120-2** Configure poll cadence and document env vars.
- [ ] **ES-120-3** Log fetch failures without crashing process.

---

### Story ES-121 — Event normalizer + snapshot store

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P0 |
| **Labels** | `phase-1`, `data` |

**Acceptance criteria**

- [ ] API payloads → canonical event model (stable IDs).
- [ ] Cached snapshot endpoint returns last good snapshot on upstream failure (**fallback**).

**Tasks**

- [ ] **ES-121-1** Implement `EventNormalizer` per design §6.3.
- [ ] **ES-121-2** TTL / stale snapshot behavior documented.
- [ ] **ES-121-3** Handle optional/missing fields (schema drift).

---

### Story ES-122 — Frontend: consume snapshot + fixture/live switch

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P0 |
| **Labels** | `phase-1`, `ui` |

**Acceptance criteria**

- [ ] UI displays current event set from BFF in live mode.
- [ ] Toggle preserves app stability; errors show non-blocking message.

**Tasks**

- [ ] **ES-122-1** Client fetch with loading/error states.
- [ ] **ES-122-2** Wire normalized events into existing mapping input path.

---

### Story ES-123 — Phase 1 exit criteria

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P0 |
| **Labels** | `phase-1`, `qa` |

**Acceptance criteria**

- [ ] End-to-end latency from poll to UI documented (rough benchmark).
- [ ] **Decisions recorded:** polling cadence, cache TTL, curated vs all categories.

**Tasks**

- [ ] **ES-123-1** Document decisions in PROGRESS.md or short ADR notes.
- [ ] **ES-123-2** Update PROGRESS.md — Phase 1.

---

## Epic ES-EPIC-3 — Phase 2: First meaningful audio output

**Objective:** Delta-aware phrasing, polyphony/voice limits, category instrument palette v1, smooth transitions.

### Story ES-130 — Snapshot diffing & event lifecycle

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P0 |
| **Labels** | `phase-2`, `audio` |

**Acceptance criteria**

- [ ] New / continuing / ended events change phrasing predictably.
- [ ] Temporal smoothing / hysteresis reduces chaotic jumps (design §5.2).

**Tasks**

- [ ] **ES-130-1** Maintain short history window for delta computation.
- [ ] **ES-130-2** Define “ended” detection policy (TTL vs explicit removal).

---

### Story ES-131 — Voice management & mixer rules

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P0 |
| **Labels** | `phase-2`, `audio` |

**Acceptance criteria**

- [ ] Polyphony cap and priority rules under spike load.
- [ ] Fades on add/remove; no hard clicks.

**Tasks**

- [ ] **ES-131-1** Implement voice pool per category or global limit.
- [ ] **ES-131-2** Stress test with synthetic spike fixture.

---

### Story ES-132 — Category instrument palette v1

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P0 |
| **Labels** | `phase-2`, `audio` |

**Acceptance criteria**

- [ ] At least **3** categories distinguishable in blind listening (internal test).
- [ ] Palette documented (which synth/sample per category).

**Tasks**

- [ ] **ES-132-1** Implement timbre per design metaphors (§5.1).
- [ ] **ES-132-2** Short listening test protocol (3–5 people optional).

---

### Story ES-133 — Phase 2 exit

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P0 |
| **Labels** | `phase-2`, `qa` |

**Tasks**

- [ ] **ES-133-1** Record default listening profile decision (ambient vs analytical).
- [ ] **ES-133-2** Update PROGRESS.md — Phase 2.

---

## Epic ES-EPIC-4 — Phase 3: Interactive UI

**Objective:** Map, regions, detail panel, category toggles, intensity scaling, focus mode, A/V sync indicators.

### Story ES-140 — Interactive map with event markers

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P0 |
| **Labels** | `phase-3`, `ui` |

**Acceptance criteria**

- [ ] Map library integrated (Mapbox GL JS or Leaflet per design).
- [ ] Markers/clusters match canonical geometry.

**Tasks**

- [ ] **ES-140-1** Token/key handling for map provider (env).
- [ ] **ES-140-2** Performance budget for N markers.

---

### Story ES-141 — Controls: filters, intensity, focus mode

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P0 |
| **Labels** | `phase-3`, `ui`, `audio` |

**Acceptance criteria**

- [ ] User can intentionally change what they hear via controls + selection.
- [ ] `InteractionController` concept (design §6.3) reflected in code structure.

**Tasks**

- [ ] **ES-141-1** Category toggles and intensity scaling → mapping/mixer.
- [ ] **ES-141-2** Focus mode (e.g. region or event) with audible emphasis.

---

### Story ES-142 — Event detail panel + sync indicators

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P1 |
| **Labels** | `phase-3`, `ui` |

**Acceptance criteria**

- [ ] Selecting an event shows metadata panel.
- [ ] Visual highlight for events currently influencing sound.

**Tasks**

- [ ] **ES-142-1** Link selection state to `musicState` / mixer.
- [ ] **ES-142-2** Optional `Tone.Draw` or rAF sync pattern.

---

### Story ES-143 — Accessibility & UX review

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P1 |
| **Labels** | `phase-3`, `a11y` |

**Acceptance criteria**

- [ ] Keyboard reachability for primary controls; contrast baseline.
- [ ] Motion-sensitive users: reduce non-essential animation if applicable.

---

### Story ES-144 — Phase 3 exit

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P0 |
| **Labels** | `phase-3`, `qa` |

**Tasks**

- [ ] **ES-144-1** Decisions: autoplay policy, default filters, copy tone (education vs ambient art).
- [ ] **ES-144-2** Update PROGRESS.md — Phase 3.

---

## Epic ES-EPIC-5 — Phase 4: Refinement & launch readiness

**Objective:** Listening presets, adaptive dynamics, performance, observability, onboarding, operational runbook.

### Story ES-150 — Listening presets / modes

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P1 |
| **Labels** | `phase-4`, `audio` |

**Acceptance criteria**

- [ ] At least 2 modes (e.g. ambient vs informative) with documented mapping differences.

---

### Story ES-151 — Performance & long-session stability

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P0 |
| **Labels** | `phase-4`, `perf` |

**Acceptance criteria**

- [ ] 20+ minute session without notable degradation on target browser(s).

**Tasks**

- [ ] **ES-151-1** Profile map + audio graph; fix top issues.
- [ ] **ES-151-2** Cross-browser smoke (Chrome, Firefox, Safari as applicable).

---

### Story ES-152 — Observability & health

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P1 |
| **Labels** | `phase-4`, `infra` |

**Acceptance criteria**

- [ ] Ingestion health visible (logs or minimal dashboard).
- [ ] Client-side error boundary + user-facing fallback copy.

---

### Story ES-153 — Onboarding, legend, deployment runbook

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P0 |
| **Labels** | `phase-4`, `docs`, `ui` |

**Acceptance criteria**

- [ ] New users grasp mapping model within first minutes (tooltip + legend).
- [ ] Runbook: deploy steps, env vars, rollback.

**Tasks**

- [ ] **ES-153-1** Update PROGRESS.md — Phase 4 / launch scope.

---

## Cross-cutting — Documentation & PM hygiene

### Story ES-190 — Keep PROGRESS.md current

| Field | Value |
| --- | --- |
| **Type** | Story (ongoing) |
| **Priority** | P1 |
| **Labels** | `docs` |

**Acceptance criteria**

- [ ] After each phase exit, [PROGRESS.md](PROGRESS.md) reflects date, summary, and next focus.

---

### Story ES-191 — Risk review checkpoints

| Field | Value |
| --- | --- |
| **Type** | Story |
| **Priority** | P2 |
| **Labels** | `docs` |

**Tasks**

- [ ] **ES-191-1** End of Phase 2: revisit design doc §6.5 risks (cadence, fatigue, ambiguity).

---

## Suggested sprint targets (example)

| Sprint | Focus | Candidate stories |
| --- | --- | --- |
| **Sprint 1** | Foundation + Phase 0 start | ES-100, ES-101, ES-110 |
| **Sprint 2** | Phase 0 complete | ES-111, ES-112, ES-113 |
| **Sprint 3** | Phase 1 backend | ES-120, ES-121 |
| **Sprint 4** | Phase 1 frontend + exit | ES-122, ES-123 |
| **Sprint 5+** | Phase 2–4 | ES-130 through ES-153 |

Adjust sprint length (1–2 weeks) to team capacity.

---

## Definition of Done (project default)

- Acceptance criteria met and demo’d.
- PROGRESS.md updated when a **phase** completes.
- Known limitations and next tradeoffs noted for the following story.
