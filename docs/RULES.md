# Project Rules and Design Guidelines

### 1. Aesthetic Minimalism
Overhead aims to feel indistinguishable from a native macOS/iOS application:
- **No unnecessary buttons:** Interactions should be context-aware (e.g. clicking a task toggles it, clicking its name edits it).
- **Whitespace over lines:** Use padding and margins instead of borders unless absolutely necessary.
- **Typography:** Relies structurally on `sans` (Inter/SF Pro) for headings and `mono` for system text and metrics.

### 2. Theme Handling
- Never hardcode `#ffffff` or `#000000` into logic.
- Use the CSS variable matrix (`--bg`, `--ink`, `--surface`, `--accent`).
- **No Theme Toggle:** The app strictly watches operating system preferences via `@media (prefers-color-scheme: dark)` and the `<meta name="color-scheme" content="light dark">` HTML tag. Modalities react inherently and systemically.

### 3. Memory & Efficiency
- Generate dynamic tasks frontend-first and sync up.
- Reduce DOM re-renders by mutating the state variables (`GOALS`, `TASKS`) entirely and replacing innerHTML sequentially rather than polling DB for every view switch.
- Avoid bulky JS frameworks. Vanilla JS remains explicitly fast.
