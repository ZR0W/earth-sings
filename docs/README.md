# Earth Sings — documentation (agent & human index)

This folder holds **planning, design, and project-management** artifacts. Use it as the first stop for context when implementing or reviewing the project.

## Files

| Document | Purpose |
| --- | --- |
| [README.md](README.md) | This index — navigation for humans and AI agents. |
| [planning.md](planning.md) | Original product/architecture prompt (inputs for the design doc). |
| [DESIGN_AND_PROJECT_PLAN.md](DESIGN_AND_PROJECT_PLAN.md) | Full system design, EONET mapping model, architecture, risks, phased build plan. |
| [JIRA_BACKLOG.md](JIRA_BACKLOG.md) | Epics, stories, tasks in Jira-importable structure; acceptance criteria and suggested sprints. |
| [PROGRESS.md](PROGRESS.md) | Live phase status, changelog, decisions log, next actions. |

## Conventions for AI agents

1. **Read order for implementation:** `PROGRESS.md` (current phase) → `JIRA_BACKLOG.md` (next stories) → relevant sections of `DESIGN_AND_PROJECT_PLAN.md`.
2. **After completing a phase:** update `PROGRESS.md` (phase row + changelog); align closed stories in your issue tracker with `JIRA_BACKLOG.md`.
3. **Single feature at a time:** follow the workflow in design doc §8 — one story per delivery when possible.

## Repo root

The repository [README.md](../README.md) stays at the project root for discoverability; it links here for full documentation.
