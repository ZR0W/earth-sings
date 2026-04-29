# Earth Sings — project progress

**Purpose:** Single place to see **current phase**, **what changed**, and **what’s next**. Update this file when a phase milestone is reached or when scope shifts.

**Related:** [DESIGN_AND_PROJECT_PLAN.md](DESIGN_AND_PROJECT_PLAN.md) · [JIRA_BACKLOG.md](JIRA_BACKLOG.md)

---

## Current status

| Field | Value |
| --- | --- |
| **Last updated** | 2026-04-29 |
| **Current phase** | Not started (implementation) |
| **Design / planning** | Complete — see design doc and backlog |
| **Next milestone** | Phase 0 — offline fixture prototype (see JIRA ES-EPIC-1 / stories ES-100–ES-113) |

**One-line summary:** Architecture and phased plan are documented; application code and EONET integration are not yet started.

---

## Phase tracker

| Phase | Name | Status | Notes |
| --- | --- | --- | --- |
| **Foundation** | Repo, toolchain, canonical types stub | Not started | Stories ES-100, ES-101 |
| **Phase 0** | Offline prototype (fixture + mapping + minimal UI) | Not started | Deterministic audio loop; category filter |
| **Phase 1** | EONET BFF + live snapshot + fixture/live toggle | Not started | Polling, normalize, cache, graceful fallback |
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

---

## Decisions log (fill as you go)

| Date | Topic | Decision | Rationale |
| --- | --- | --- | --- |
| — | Phase 0 category set | TBD | Lock before fixture finalization (design §Phase 0). |
| — | Harmonic strategy | TBD | Single mode vs slow rotating chords. |
| — | Map provider | TBD | Mapbox vs Leaflet (design §4.1). |
| — | Polling / TTL (Phase 1) | TBD | After first live integration benchmarks. |

---

## Next actions (for the team)

1. Start **ES-100** / **ES-101** (foundation) or jump straight to **ES-110** if repo already exists.
2. Run Phase 0 **decision gates** (categories + harmony) before freezing fixture JSON.
3. After each phase exit, update the **Phase tracker** table and add a **Changelog** row.
