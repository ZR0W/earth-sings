You are a senior software architect, creative technologist, and technical product manager.

I want to build a project inspired by TrainJazz (a web app where real-time NYC subway data generates live jazz music). 
For context: TrainJazz maps real-world moving entities (trains) into a continuous generative music system and interactive visualization. :contentReference[oaicite:0]{index=0}

However, I DO NOT want you to jump into coding or implementation yet.

Your job is to produce a clear, structured DESIGN DOCUMENT and PROJECT PLAN that a human developer (me) can follow step-by-step and iterate on.

---

## PART 1 — ANALYSIS OF EXISTING PROJECT

Analyze TrainJazz at a systems level:

- What are the core components? (data ingestion, transformation, audio engine, frontend, etc.)
- What is the likely data flow from input → sound output?
- What are the key abstractions (e.g., "entity → instrument", "position → pitch")?
- What constraints does real-time data impose?

DO NOT speculate wildly—reason from typical web + generative audio architectures.

---

## PART 2 — LIKELY TECH STACK

Infer a realistic tech stack for TrainJazz:

- Frontend (framework, rendering, audio)
- Backend (if any)
- Data ingestion (APIs, streaming)
- Audio synthesis approach (Web Audio API, Tone.js, etc.)
- Hosting / deployment

For each choice:
- Give 1–2 alternatives
- Explain tradeoffs
- Recommend a default

---

## PART 3 — NEW PROJECT (NASA EONET DATA)

Now redesign the concept using this dataset:
https://eonet.gsfc.nasa.gov/

Instead of trains → music, use:
- Natural events (wildfires, storms, volcanoes, etc.)

Define:
- What maps to what? (event type → instrument? intensity → tempo?)
- What makes the output meaningful, not random?
- How does this differ from TrainJazz conceptually?

---

## PART 4 — SYSTEM DESIGN DOCUMENT

Produce a clean, human-readable design doc with:

1. Project overview
2. Core concept
3. System architecture (clearly separated layers)
4. Data flow diagram (textual is fine)
5. Key modules and responsibilities
6. Technical decisions + rationale
7. Risks and unknowns

Write this like something I could hand to a developer.

---

## PART 5 — BUILD PLAN (CRITICAL)

Create a step-by-step plan that allows iterative development with feedback:

- Phase 0: Simplest prototype (no real-time data)
- Phase 1: Basic data integration
- Phase 2: First meaningful audio output
- Phase 3: Interactive UI
- Phase 4: Refinement

For EACH phase:
- What to build
- What success looks like
- What I should test
- What I should decide before moving on

---

## PART 6 — INTERACTIVE WORKFLOW

At the end, define how we will work together:

- Break future work into small tasks I can assign you
- Wait for my approval before moving to next step
- When I ask for implementation, only build ONE feature at a time
- Always explain tradeoffs before coding

---

## OUTPUT FORMAT

- Use clear sections with headers
- Prefer clarity over completeness
- No code unless explicitly requested
- Think like a collaborator, not a code generator