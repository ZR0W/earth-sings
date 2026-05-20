# Pre-Phase: EONET data exploration

**Purpose:** Understand what NASA EONET actually returns—field shapes, update patterns, category mix, geometry complexity—**before** building the generative audio app. Findings here directly inform mapping rules (density, recency, magnitude, spatial spread).

**Status:** Planned (not started)  
**Tech:** Vanilla HTML + CSS + JavaScript (no framework), matching the spirit of the [EONET how-to guide](https://eonet.gsfc.nasa.gov/how-to-guide) but using `fetch` instead of jQuery.

**Related:** [PROGRESS.md](PROGRESS.md) · [DESIGN_AND_PROJECT_PLAN.md](DESIGN_AND_PROJECT_PLAN.md) · [API v3 docs](https://eonet.gsfc.nasa.gov/docs/v3)

---

## Why this pre-phase exists

TrainJazz assumes dense, frequent position updates. EONET is **curated event metadata** with variable cadence and optional fields ([disclaimer](https://eonet.gsfc.nasa.gov/what-is-eonet#disclaimer)). Musical choices (tempo, polyphony, “new event” accents) should follow **measured** behavior, not guesses.

Questions this phase must answer:

| Question | Why it matters for music |
| --- | --- |
| How many **open** events per category right now? | Voice budget / rhythmic density |
| How often does the event list **change** when polled? | Polling interval + smoothing |
| Which fields are **always present** vs often `null`? | Safe mapping dimensions |
| How many **geometry** points per event (Point vs Polygon)? | Spatial panning complexity |
| Is **magnitude** populated per category? | Dynamics / intensity mapping |
| How do **closed** events appear over `days` / date range? | Fade-out / lifecycle phrasing |
| Do our four categories use stable EONET **category IDs**? | Filter + fixture alignment |

---

## Locked product decisions (from PROGRESS)

These are already chosen for the main app; the explorer should **prioritize** these categories but still allow browsing all categories for comparison.

| Decision | Choice |
| --- | --- |
| Stack (main app) | Design defaults: React + TypeScript, Tone.js, BFF later |
| Phase 0 categories | Wildfires, storms, volcanoes, floods |
| Harmony (Phase 0) | Single mode / key |

**EONET category ID mapping (verify in explorer):**  
Use `/api/v3/categories` to confirm slugs. Docs examples include `wildfires`, `severeStorms`; volcanoes/floods have dedicated category endpoints—record exact `id` strings in the findings doc.

---

## API surface to explore

Base URL: `https://eonet.gsfc.nasa.gov/api/v3`

| Endpoint | Purpose | Doc |
| --- | --- | --- |
| `GET /events` | List events (default: open only) | [Events API](https://eonet.gsfc.nasa.gov/docs/v3) |
| `GET /events/{id}` | Single event detail + full geometry | [How-to: single event](https://eonet.gsfc.nasa.gov/how-to-guide) |
| `GET /events/geojson` | GeoJSON feature collection | [Events GeoJSON](https://eonet.gsfc.nasa.gov/docs/v3) |
| `GET /categories` | All category definitions | [Categories](https://eonet.gsfc.nasa.gov/docs/v3) |
| `GET /categories/{categoryId}` | Events filtered to one category | [Categories API](https://eonet.gsfc.nasa.gov/docs/v3) |
| `GET /sources` | Curator/source list | [Sources](https://eonet.gsfc.nasa.gov/docs/v3) |
| `GET /layers/{categoryId}` | Imagery layers per category (optional UI tab) | [How-to: layers](https://eonet.gsfc.nasa.gov/how-to-guide) |
| `GET /magnitudes` | Magnitude type definitions | [Magnitudes](https://eonet.gsfc.nasa.gov/api/v3/magnitudes) |

### High-value query parameters (Events)

From [v3 documentation](https://eonet.gsfc.nasa.gov/docs/v3):

| Parameter | Example use in explorer |
| --- | --- |
| `status` | `open` \| `closed` \| `all` |
| `limit` | Cap list size (e.g. 20, 100) |
| `days` | Recent window (e.g. 7, 20, 90) |
| `category` | Comma-separated OR filter |
| `source` | Filter by curator source |
| `start` / `end` | Date range (YYYY-MM-DD) |
| `bbox` | Regional subset |
| `magID` / `magMin` / `magMax` | Storm/wind-style magnitude filters |

**How-to reference call** (open events, limit 20):

```
GET https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=20
```

---

## Event data dimensions to measure

Per [Event object fields](https://eonet.gsfc.nasa.gov/docs/v3):

| Dimension | Fields | Explorer behavior |
| --- | --- | --- |
| Identity | `id`, `title`, `link` | Row key; link to live API URL |
| Narrative | `description` | Show % non-null |
| Lifecycle | `closed` | Open vs closed; time-to-close distribution |
| Taxonomy | `categories[]` | Count multi-category events |
| Provenance | `sources[]` | Source frequency table |
| Space-time | `geometry[]` | Point vs Polygon; # points per event; date spread |
| Intensity | `magnitudeValue`, `magnitudeUnit`, `magnitudeDescription` | Per-category fill rate |

Derived metrics (compute client-side):

- Events per category (open / all / last N days)
- Geometry point count histogram
- Age of oldest geometry date vs newest (recency spread)
- Poll delta: set difference of event IDs between two fetches (manual “snapshot compare”)

---

## Explorer web app — plan (vanilla JS)

### Suggested location in repo

```
tools/eonet-explorer/
  index.html
  css/styles.css
  js/
    api.js          # fetch wrappers, URL builder
    state.js        # current query, last response
    views/
      queryPanel.js
      responsePanel.js
      statsPanel.js
      eventDetail.js
    main.js
  findings/         # optional exported JSON snapshots (gitignore large dumps)
  README.md         # how to run locally (static server)
```

Serve with any static server (`npx serve tools/eonet-explorer` or VS Code Live Server). **No build step** required.

### UI layout (four regions)

```
+------------------------------------------------------------------+
|  EONET Data Explorer                    [link: v3 docs | how-to] |
+------------------------------------------------------------------+
| QUERY BUILDER          |  LIVE REQUEST INSPECTOR                  |
| - endpoint picker      |  - Human label: "List open events"       |
| - param inputs         |  - Full URL (clickable)                  |
| - [Run query]          |  - Copy curl / fetch snippet             |
| - presets dropdown     |  - Status + timing (ms)                  |
+------------------------+------------------------------------------+
| RESULTS (manipulable)    |  ANALYTICS (this response)               |
| - sortable table       |  - event count by category               |
| - category filter      |  - geometry type counts                  |
| - search title         |  - null-field report                     |
| - click row -> detail  |  - highlight our 4 categories            |
+------------------------+------------------------------------------+
| EVENT DETAIL (selected) |  RAW JSON (collapsible, syntax-friendly)  |
| - field checklist      |  - pretty-printed response               |
| - geometry timeline    |                                          |
+------------------------------------------------------------------+
```

### Core features (by build step)

#### Step P0.1 — Shell + query inspector

- Static layout, stylesheet, endpoint dropdown (`/events`, `/categories`, `/events/{id}`, etc.).
- On **Run query**: `fetch` URL, show exact URL + link to [docs section](https://eonet.gsfc.nasa.gov/docs/v3).
- Pretty-print JSON in collapsible panel; error display for HTTP failures.

**Done when:** Any documented GET can be fired and inspected.

#### Step P0.2 — Presets + parameter builder

Built-in presets (each documents itself in UI):

| Preset name | URL pattern |
| --- | --- |
| How-to: recent open | `/events?status=open&limit=20` |
| Our four categories | `/events?status=open&category=wildfires,severeStorms,...` (IDs confirmed via `/categories`) |
| Last 20 days all status | `/events?days=20&status=all&limit=100` |
| Single event | `/events/{id}` (input field) |
| Category drill-down | `/categories/wildfires?status=open&limit=50` |

- Editable query params (status, limit, days, category, source, start, end).
- **Do not** hide the constructed URL—it's the source of truth.

#### Step P0.3 — Manipulable results table

- Flatten `events[]` to table columns: id, title, categories, closed, geometry count, magnitude, first/last geometry date.
- Client-side sort, text filter, category chip filter.
- Row click loads detail pane + optional second fetch to `event.link` if list payload is shallow.

#### Step P0.4 — Analytics panel

- Bar chart or simple HTML bars (no chart library required) for category counts.
- “Field coverage” table: % events with description, magnitude, multi-geometry, polygon.
- Badge row for **locked categories** vs others.

#### Step P0.5 — Polling / cadence helper (manual)

- “Snapshot A / Snapshot B” buttons: store event ID sets in `sessionStorage`, show added/removed/changed count.
- Suggested poll intervals note based on observed churn (feeds Phase 1 TTL decision).

#### Step P0.6 — Findings export

- Button: **Export summary JSON** (stats only, not full API dump) for `docs/findings/eonet-snapshot-YYYY-MM-DD.json`.
- Short **FINDINGS.md** template section to paste: category counts, recommended poll interval, mapping notes.

**Optional (later):** Layers tab + OpenLayers map per [how-to full example](https://eonet.gsfc.nasa.gov/how-to-guide)—out of scope for minimal explorer v1 unless you want imagery context.

---

## Deliverables

| Deliverable | Description |
| --- | --- |
| `tools/eonet-explorer/` | Runnable static explorer app |
| `docs/findings/EONET_DATA_PROFILE.md` | Human-readable: dimensions, frequencies, gaps, musical implications |
| Updated `PROGRESS.md` | Pre-phase marked Done; Phase 1 polling/TTL informed |
| Mapping addendum | 1-page “recommended musical bindings” based on measured data |

---

## How findings feed Earth Sings

| Observation | Likely musical implication |
| --- | --- |
| Low open count globally | Longer note durations; fewer voices |
| Category A has 10× more events than B | Per-category voice caps; avoid B being inaudible |
| Geometry often multi-point | Use latest geometry date for recency; centroids for pan |
| Magnitude usually null for wildfires | Do not rely on magnitude for fires; use geometry spread or source |
| List changes slowly | Longer poll interval (e.g. 5–15 min); heavy smoothing |
| List changes quickly for storms | Shorter poll for storms only OR global conservative smoothing |
| Many closed events in `days=30` | “Ended” detection for fade-out in Phase 2 |

---

## Acceptance criteria (pre-phase complete)

- [ ] All primary endpoints in the table above queried successfully from the UI at least once.
- [ ] Our four categories confirmed with real EONET `category` IDs documented.
- [ ] `EONET_DATA_PROFILE.md` written with counts, field coverage, and poll recommendation.
- [ ] At least one “snapshot compare” session recorded (what changed in 10–30 minutes).
- [ ] No dependency on React/Tone for this tool (vanilla only).

---

## Out of scope (pre-phase)

- Generative audio / Tone.js
- BFF or server-side caching
- Production deployment (local static only is fine)
- Full WMTS map integration (optional stretch)

---

## Suggested Jira keys (if tracking)

| Story | Summary |
| --- | --- |
| **ES-P01** | Scaffold vanilla explorer shell + query inspector |
| **ES-P02** | Query presets + parameter builder |
| **ES-P03** | Sortable/filterable results table |
| **ES-P04** | Analytics + field coverage panel |
| **ES-P05** | Snapshot compare + findings export |
| **ES-P06** | Write `EONET_DATA_PROFILE.md` and update PROGRESS |

---

## References

- [EONET how-to guide](https://eonet.gsfc.nasa.gov/how-to-guide) — jQuery examples; we mirror flows with `fetch`
- [API v3 documentation](https://eonet.gsfc.nasa.gov/docs/v3) — fields, parameters, examples
- [EONET homepage](https://eonet.gsfc.nasa.gov/)
