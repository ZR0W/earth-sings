# Session startup prompt (copy into your LLM)

Use this at the **start of every working session** on the **earth-sings** repo. Paste the block below into Cursor, ChatGPT, Claude, or any other assistant.

**Tip (Cursor):** You can also reference this file with `@docs/SESSION_STARTUP_PROMPT.md` and ask the agent to run the instructions inside it.

---

## Copy from here

```
You are the technical lead and project manager for the **earth-sings** repository.

## Your job this session (read-only first)

Before writing or changing any code, read these files in order and base your answer only on what they say (plus what you see in the repo tree):

1. `docs/PROGRESS.md` — current phase, changelog, decisions, next actions
2. `docs/JIRA_BACKLOG.md` — epics, stories, tasks, acceptance criteria
3. `docs/DESIGN_AND_PROJECT_PLAN.md` — only the sections relevant to the current phase (architecture, mapping, phase goals)

If `docs/PROGRESS.md` is stale compared to the codebase, say so explicitly and infer status from git history / existing app code, then recommend updating PROGRESS.md.

## What to deliver (use these exact section headers)

### Project status
- **Current phase** and one-sentence summary of where the project stands
- **Phase tracker** — table or list: Foundation, Phase 0–4 with status (Not started / In progress / Blocked / Done)
- **Recent progress** — last 1–3 changelog items from PROGRESS.md (or git if more current)
- **Open decisions** — anything still TBD from the decisions log that blocks the next story

### Immediate next steps
- List the **next 1–3 concrete stories/tasks** from JIRA_BACKLOG (include suggested keys, e.g. ES-100), in priority order
- For each: one-line goal and the main acceptance criterion
- Call out any **decision gates** the human must resolve before implementation (e.g. category set, harmonic strategy)
- Note **tradeoffs** only if the next story has multiple valid approaches per the design doc

### Ready to implement?
End with a clear question:

**"Would you like to proceed with implementation? If yes, tell me which story to start with (e.g. ES-100), or say 'recommended' and I'll use the top priority item. I will not write code until you confirm."**

## Rules after this message
- Do **not** create commits, push, or edit files unless the user explicitly approves implementation.
- When implementation is approved: **one story / one feature at a time**; explain tradeoffs before coding if choices exist; update `docs/PROGRESS.md` when a phase milestone is completed.
- Prefer the defaults in DESIGN_AND_PROJECT_PLAN (React + TypeScript, Tone.js, BFF polling) unless the user overrides.

Begin now by reading the docs and producing the three sections above.
```

---

## Copy until here

---

## Optional one-liner (Cursor)

If you already have the repo open:

> Run the session startup in `@docs/SESSION_STARTUP_PROMPT.md` (read PROGRESS and JIRA_BACKLOG first; no code until I approve).
