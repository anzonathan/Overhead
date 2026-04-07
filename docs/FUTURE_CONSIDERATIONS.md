# Future Considerations & Roadmap

Overhead functions as a lightning-fast locally scoped progressive planner. However, expansion requires anticipating specific structural roadblocks and user enhancements.

### 1. Unified Time Blocking & Drag-and-Drop
Currently, users are expected to set times using the `<input type="time">` module manually. Future implementations should explore native DOM drag-and-drop mechanics in the Week and Today views to allow stretching and compressing task durations visually. The backend schema is already prepped via `parseMinutes` calculations.

### 2. Deep Linking and Multi-Device Capability 
With SSE functioning cleanly, introducing a secure authentication abstraction could take Overhead server-less or multi-device with extreme efficiency. Cross-client tab syncing currently handles the backbone of what would be multi-device synchronization. 

### 3. Progressive Subgoal Checking
Presently, goals act as top-level anchors for tasks. Building logic that aggregates task completions underneath a goal, and effectively transitions the Goal into a `done: true` state (and cascading upward to parent goals) is critical for macro "annual" or "life" planning closure. **Note: Recursive task completion (subtasks) is already implemented as of v0.2.0.**

### 4. Advanced Block Constraints & Timezone Resiliency
Midnight-spanning and cross-boundary recurring spillover logic functions perfectly inside current local-runtime windows. Standardizing absolute UTC metrics and robust localized DST shifts will be required before opening a remote auth gateway to highly mobile users.

### 5. Deployment Configurations
Creating optimized runtime configurations via `Docker` or explicit script mapping (e.g., Gunicorn wrapping FastAPI) is required for persistent production beyond local `.db` usage.
