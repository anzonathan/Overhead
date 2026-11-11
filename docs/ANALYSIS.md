# Overhead — Web App Analysis

A technical review of the current codebase (frontend `app.js`/`index.html`/`style.css`, backend `server.py`/`db.py`, schema `schema.sql`). Focus: correctness, security, data integrity, performance, and maintainability.

## Architecture Summary

- **Stack**: vanilla JS + FastAPI + SQLite + SSE. No framework, no build step.
- **Data model**: `areas` → `goals` (tree via `subgoals` JSON) → `tasks` (tree via `parentId`), plus a new `templates` table keyed by weekday.
- **Sync**: SSE (`/api/events`) pushes a version number; clients re-fetch `/api/data` on change. Clean, no polling.
- **Virtual hydration**: loop goals project tasks into memory for ±1 month around the focus month; only persisted on interaction. Good storage discipline.
- **Weighted subtasks**: `tasks.weight` + `taskProgress()` computes parent completion.

Strengths: simple, fast, offline-capable, no dependency bloat, clean separation of data access (`db.py`) and transport (`server.py`).

## Issues

### Security

1. **Stored XSS — no HTML escaping (HIGH for shared use).**
   Task titles, goal titles, and area names are interpolated directly into `innerHTML`:
   - `app.js:301` `const label = t.title || ...` → `app.js:313` `${label}`
   - `app.js:620` `${goal.title}`, `app.js:663` `${area.name}`
   Any title containing `<script>` or `onerror=` executes. No `escapeHtml()` exists anywhere. Low risk for a single-user local tool, but the server binds `0.0.0.0` (`server.py:205`), so any host on the LAN can read/write — including injecting script into every open browser. **Fix**: add and apply a shared `escapeHtml()` to every user-controlled string, or build DOM via `textContent`.

2. **No authentication / authorization.**
   The entire CRUD API is open. Fine for localhost; risky on a shared network. Consider binding `127.0.0.1` by default and requiring an opt-in flag for LAN/remote use.

3. **Error message leaked to DOM (`app.js:1413`).**
   `Runtime Crash: ${e.message} ... ${e.stack}` renders raw exception text. Not a data leak of concern locally, but sloppy in production.

### Correctness / Bugs

4. **Inconsistent spillover handling.**
   `getTasksForDate()` (`app.js` ~line 10) folds midnight-spanning tasks from the previous day into "today" (via the `spilling` branch), but the Week and Month views render raw `getTasksForDate()` per day — and the spillover *destination* only ever targets the immediately-following day. A task `22:00–02:00` appears twice (once in its own day, once as `00:00–02:00` spill on the next day), and only one day forward is computed. The behavior is surprising and un-modeled in the DB. **Fix**: decide on a single source of truth (e.g. render a task only on its `date`, showing an "→02:00" marker, or compute spillover once in a shared helper).

5. **Orphaned data on deletion (data integrity).**
   - `delete_area` (`server.py:106`) removes an Area but leaves its Goals pointing at a missing area → goals silently disappear from the tree (no longer reachable via `renderGoals`).
   - `delete_goal` (`server.py:132`) removes a Goal but leaves Tasks with that `goalId` and child Goals referencing the deleted parent in `subgoals`.
   - `delete_task` deletes subtasks recursively (good), but no FK/cleanup anywhere else.
   **Fix**: cascade delete (or explicitly clean) related rows, and/or add `ON DELETE` behavior + foreign keys pragma.

6. **Hebrew date is a placeholder.**
   `app.js:96` `(date.getMonth() + 3) % 12` is labeled "crude mock" — it is not the Hebrew calendar. Displayed as real data on the Today hero and Month header. **Fix**: either integrate a real `Intl.DateTimeFormat('he-u-ca-hebrew')` (built-in, no dependency) or remove the misleading value.

7. **`taskProgress` vs. partial weighting edge case.**
   A zero-weight subtask among weighted siblings contributes 0% (`childWeight`, `app.js`). If a parent has weighted children summing to 100% and one extra child with weight 0, the parent reaches 100% while that child remains undone. Acceptable, but worth documenting (it is now, in the guide) or auto-assigning equal remainder.

8. **Optimistic UI without rollback.**
   `toggleRowTask` (`app.js:691`) flips the checkbox class immediately, then awaits persistence. A failed fetch leaves UI and store out of sync. Minor for local use.

### Performance

9. **Full re-render on every interaction.**
   `render()` replaces `#view.innerHTML` entirely on any toggle/navigation. With hundreds of tasks this is O(n) DOM churn per click. Fine at current scale; would need virtualized lists or targeted mutation at large scale.

10. **`taskProgress` / `siblingsOf` scan `TASKS` repeatedly.**
   Each parent row calls `taskProgress()` which filters the full `TASKS` array; in a dense week this is O(tasks × parents). Acceptable locally, but a precomputed children index would be trivial and faster.

11. **No pagination or limits on `/api/data`.**
   Returns the whole DB on every SSE-triggered refetch. Fine at personal scale; a bottleneck if the archive grows.

### Maintainability

12. **`renderTaskRow` duplicated 3×** (Today, Week, Month-detail). Nearly identical HTML; a single shared `taskRowHtml()` would cut ~150 lines and eliminate the drift that already exists between them (e.g. the Week version hardcodes `font-size:14px`).

13. **Modal is a swiss-army knife.**
   One `#add-modal` reused for task/goal/area/template item, distinguished by ad-hoc module globals (`editTaskId`, `editGoalId`, `goalAreaId`, `templateDay`, …). Works, but state is scattered and easy to get wrong. A small state object + one `renderModal()` would clarify.

14. **Inline `onclick` strings with embedded IDs.**
   `onclick="openModal('${t.id}')"` interpolates task IDs into attribute strings. Task IDs are `t` + timestamp or `t_loop_{goalId}_{date}`, so they are mostly safe — but this pattern is one typo away from an injection, and it tightly couples markup to globals.

15. **Schema evolution via try/except ALTER** (`db.py:19`). Pragmatic and works, but no migration ledger — column adds are untracked over time. Worth moving to a simple versioned migration list.

## Recommendations (priority order)

1. Add `escapeHtml()` and apply it to every interpolated user string (fixes #1, highest value).
2. Bind `127.0.0.1` by default; opt-in for LAN (fixes #2, trivial).
3. Cascade-clean Goals/Tasks when an Area or Goal is deleted (#5).
4. Replace the Hebrew mock with `Intl.DateTimeFormat('he-u-ca-hebrew')` (#6).
5. Extract shared `taskRowHtml()` (#12) and unify spillover semantics (#4).
6. Add a versioned migration list (#15).

## Verdict

Overhead is a well-scoped, fast single-user planner. The architecture (SSE + virtual hydration + frontend-first IDs) is thoughtful and appropriate for the use case. The main real risks are **stored XSS via unescaped titles** and **open network exposure** — both become serious only if the app leaves localhost. For personal, single-machine use it is solid; the highest-leverage improvements are escaping, defaulting to loopback, and cascading deletes.
