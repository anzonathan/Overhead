# Changelog

## [0.1.0] - Evolution to Multiscale Intelligence
**Overhead has officially moved towards automated, multiscale predictive intelligence and a persistent backend syncing logic.**

### Added
- **Server-Sent Events (SSE):** The complete CRUD stack now emits SSE notifications, enabling instant DOM reloading on remote or cross-tab queries without relying on client-side polling.
- **Virtual Hydration (Memory Projection):** Replaced literal database bloat with an ephemeral sliding 90-day memory projection of recurring tasks. "Loop" goals automatically populate dynamically into `Today`, `Week`, and `Month` views seamlessly across all dates natively.
- **Soft Deletion (`__DELETED__`):** Loop tasks can now be directly deleted from daily views. To solve automated recurrence reviving skipped instances, Overhead natively anchors deleted loops into the backend implicitly marked with `title: '__DELETED__'`, which safely prevents virtual rehydration without modifying the SQLite schema.
- **Midnight Spillover (Virtual Routing):** Recurring loop goals extending past midnight natively spill into the next UI day visually (`00:00 - 02:00` display for the next day fragment) without bloating the backend. Conflict detection maps these properly.
- **Fast Task Additions:** `+` quick-add buttons mapped per-day on the weekly view and specifically inside the monthly detailed preview modal.
- **Mobile Clock:** Discreet `.mobile-clock` added to the top-right DOM specifically for narrow screens.

### Changed
- **Removed Polling Mechanisms:** `setInterval` polling is gone, radically lowering API pinging.
- **UI Simplifications:** Goal tree design was refactored for clarity (dropping the `RECURRING` colored badge for cleaner spacing, adjusting gap sizing for visual day selectors, and cleaning the week/month hero elements).
- **Dark Mode Policy:** Completely removed the dark mode manual toggle from the app sidebar. Hard-enforced `<meta name="color-scheme" content="light dark">` enabling strict CSS `prefers-color-scheme` reliance. This natively adheres to the host operating system instantly rather than forcing application-level bloat.

### Removed
- Manual `toggleTheme` JavaScript logic and the correlating toggle button.
- Progress bar and detailed sub-goal metrics from the `Today` hero in favor of highly stripped-down minimalism `X/Y tasks done · Z%`.
