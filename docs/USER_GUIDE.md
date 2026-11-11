# Overhead — User Guide

Overhead is a Jewish-week-oriented task and goal planner. The week runs **Sunday → Saturday**; Saturday (Sabbath) is a rest day and is excluded from scheduling.

## Getting Started

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python db.py          # initializes/migrates the SQLite database
python server.py      # serves http://localhost:3001
```

Open `http://localhost:3001` in a browser.

## Navigation

The sidebar (left) switches between views:

| Icon | View | Purpose |
|------|------|---------|
| ○ | Today | Today's schedule |
| ‖ | Week | Sun–Sat weekly view |
| ▦ | Month | Calendar + day detail |
| ≡ | Goals | Areas and goal tree |
| ▤ | Templates | Per-weekday task templates |
| ∽ | Stats | Performance charts |

On mobile the sidebar is hidden; tap the cycle button (top-right) to rotate through views.

## Core Concepts

- **Area** — a life category (Work, Health, etc.), identified by an emoji.
- **Goal** — a target inside an Area, with a scale (Life / Annual / Monthly / Weekly / Daily) and a type (Linear or Loop).
- **Task** — a concrete action on a specific date, optionally tied to a goal.
- **Subtask** — a task nested under a parent task, contributing a percentage to the parent's completion.
- **Loop goal** — a recurring goal that auto-generates a task on the chosen weekdays.

## Tasks

### Adding a task
- Click the **+** FAB, or a `+` button on a day, to open the schedule sheet.
- Fill in the title, optional goal, and time range. Leave time blank for an "Unscheduled" item.

### Editing / deleting
- Click a task's title to edit it.
- Click the 🗑 in the edit sheet to delete it (deleting a parent deletes all its subtasks).

### Checking off
- Click the **✓** box to mark a task done. Checking a parent checks all children; unchecking a child unchecks the parent.

## Subtasks & Weighted Progress

A subtask is created by clicking the `+` on a task row, then "New Subtask".

- Each subtask has a **% of parent** value (0–100). Leaving it at `0` shares the parent equally among siblings.
- A parent's completion is the weighted sum of its completed subtasks.
- Parents show a live percentage (e.g. `50%`) and are only marked "done" at 100%.

**Example:** a "Ship report" task with subtasks *Draft* (70%) and *Review* (30%) shows `70%` once *Draft* is done.

## Recurring Goals (Loop)

A goal of type **Loop** repeats automatically.

1. Create a goal and set its type to **Loop**.
2. Choose a default time range.
3. Check the weekdays it should recur on (Sunday = `S`, Saturday = `S` at the end; Sabbath is normally left unchecked).

Loop tasks are "virtual" until you interact with them — they materialize in the database only when toggled or edited, keeping storage small. Deleting a loop task for a specific day anchors it as `__DELETED__` so it does not regenerate.

## The Week View (Sun–Sat)

The Week view shows a fixed **Sunday → Saturday** week.

- Use **‹ / · / ›** to move to the previous week, return to the current week, or advance to the next week.
- This is where you plan future weeks: navigate forward, then add tasks or apply templates.

## Templates

Templates are per-weekday task lists that you can stamp onto any date.

1. Open the **Templates** view.
2. For a weekday, click **+ add item** and enter a title, optional goal, and time.
3. In the **Week** view, a **◇ template** button appears on any weekday that has a template. Click it to copy that day's template items into the selected date as real tasks.

This lets you define e.g. a "Monday" routine once and apply it to any future Monday.

## Analytics

The **Stats** view charts completion rate, grouped by:

- **Day** — last 14 days.
- **Week** — last 12 Sun–Sat weeks.
- **Month** — last 12 months.

Summary cards show all-time completion, tasks done, open tasks today, and the best bucket.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| ← / → | Move to previous / next day (Today or Month-detail view) |
| Esc | Close the modal / deselect a day |
| Enter | Save (when a modal is open) |
