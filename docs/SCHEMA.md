# Database Schema Overview

The database uses SQLite to maintain ultra-fast local interaction times. Everything relies on string IDs generated on the frontend for optimistic inserts without waiting sequentially for database UUID generation.

## 1. Areas (Categories)
High-level life groups (e.g., Work, Health, Personal).
- `id`: TEXT (Primary Key)
- `name`: TEXT
- `sym`: TEXT (Emoji symbol corresponding to area)

## 2. Goals
Scalable objects inside Areas that tasks try to complete.
- `id`: TEXT (Primary Key)
- `title`: TEXT
- `scale`: TEXT ('life', 'annual', 'monthly', 'weekly', 'daily')
- `type`: TEXT ('linear' for normal goals, 'loop' for recurring goals)
- `area`: TEXT (Foreign Key linked to Areas)
- `subgoals`: TEXT (Stringified JSON Array of child Goal IDs)
- `defaultTime`: TEXT (Stores 'HH:MM - HH:MM' for loop tasks auto-generation)
- `recurrenceDays`: TEXT (Stringified JSON Array of integers representing days [0=Sun, 6=Sat])

## 3. Tasks
Granular actions acting upon goals or existing independently.
- `id`: TEXT (Primary Key - often `t`+Date.now() or `t_loop_{goal}_{date}`)
- `date`: TEXT ('YYYY-MM-DD')
- `title`: TEXT
- `time`: TEXT (Usually 'HH:MM - HH:MM' or just 'HH:MM')
- `goalId`: TEXT (Foreign Key linked conditionally to Goals, nullable)
- `done`: BOOLEAN (Stored natively based on SQLite handling, manipulated tightly)
