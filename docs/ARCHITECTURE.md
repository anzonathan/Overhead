# Architecture Overview

Overhead is built as a highly responsive, offline-capable progressive vanilla JS frontend powered by a lightweight Python FastAPI backend.

## Tech Stack
- **Backend:** Python + FastAPI Server (`server.py`)
- **Database:** SQLite (`overhead.db` / `db.py`)
- **Frontend:** Vanilla HTML, CSS, JavaScript (`index.html`, `style.css`, `app.js`)

## Core Concepts
### 1. Persistence-First Data Syncing (SSE)
Overhead relies on **Server-Sent Events (SSE)** to push real-time updates. 
- The client subscribes to `/api/events` via HTTP.
- Any CRUD mutation on the DB calls `notify_clients()`, which streams a version bump.
- Connected clients instantly re-fetch `loadData()` to stay exactly in sync across tabs.
- This entirely eliminates manual polling.

### 2. Hydration of Recurring Goals
Goals mapped as `type: "loop"` feature automatic task generation logic:
- On page load, the frontend (`hydrateRecurring`) determines if it needs to build a new task for today from active loop goals.
- It parses the `recurrenceDays` JSON array to check if the loop is active for today's Day of Week.
- It generates a deterministic frontend ID (`t_loop_{goalId}_{date}`) so that multiple tabs pushing tasks prevent duplicate DB entries.
- If a loop crosses midnight (e.g. `20:00 - 02:00`), `getTasksForDate` virtually spills a task starting at `00:00` into the following day without modifying the backend schema.

### 3. File Map
- **`app.js`**: Holds the local memory replicas (`TASKS`, `GOALS`, `AREAS`), event listeners, modals, and rendering loop for Today, Week, Month, and Goal Tree.
- **`style.css`**: Built on CSS variables for immediate dark/light mode following `prefers-color-scheme`. Minimal media queries adapt the desktop sidebar into a mobile bottom/top bar.
- **`server.py`**: The FastAPI endpoints controlling logic and SSE iteration.
- **`schema.sql`**: Table layouts mapped out for fresh boots.
