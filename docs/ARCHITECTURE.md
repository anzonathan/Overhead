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

### 2. Virtual Hydration & Recurring Goals
Goals mapped as `type: "loop"` feature highly efficient automatic task generation logic:
- On page load, `hydrateVirtualTasks()` dynamically projects loop tasks into the `TASKS` memory array for a sliding 90-day window (`±1 month` from current view). 
- These "virtual tasks" behave exactly like real tasks natively in the UI (navigable in Week/Month views, overlapping midnight effortlessly) but cost **zero database footprint** until interacted with.
- If a user marks a virtual task as `done` or edits it, `toggleRowTask` / `submitModal` intercepts and sends a `POST` dynamically, turning it into a real database row seamlessly.
- **Soft Deletion:** If a user deletes a loop task from their daily view, the system creates a true DB instance with `title: '__DELETED__'`. `getTasksForDate` filters these titles out entirely, shielding it endlessly from the UI while identically telling the `hydrateVirtualTasks` loop *not* to regenerate it.

### 3. File Map
- **`app.js`**: Holds the local memory replicas (`TASKS`, `GOALS`, `AREAS`), event listeners, modals, and rendering loop for Today, Week, Month, and Goal Tree.
- **`style.css`**: Built on CSS variables for immediate dark/light mode following `prefers-color-scheme`. Minimal media queries adapt the desktop sidebar into a mobile bottom/top bar.
- **`server.py`**: The FastAPI endpoints controlling logic and SSE iteration.
- **`schema.sql`**: Table layouts mapped out for fresh boots.
