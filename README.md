# Overhead

Overhead is a highly responsive, offline-capable productivity tool featuring a vanilla JavaScript frontend and a lightweight Python FastAPI backend. It uses Server-Sent Events (SSE) for real-time synchronization and "Virtual Hydration" for efficient recurring goal management.

## Features

- **Real-time Sync:** Instant updates across all connected clients via SSE.
- **Virtual Tasks:** Zero-footprint recurring tasks that only persist to the database when interacted with.
- **Offline-First Design:** Built for speed and resilience.
- **Visual Goal Tracking:** Manage areas, goals, and tasks in a unified interface.

## Prerequisites

- Python 3.9+
- pip (Python package installer)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Overhead
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv .venv
   # On macOS/Linux:
   source .venv/bin/activate
   # On Windows:
   .venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize the database:**
   The application uses SQLite. Initialize the schema by running:
   ```bash
   python db.py
   ```

## Usage

1. **Start the server:**
   ```bash
   python server.py
   ```
   By default, the server will run on [http://localhost:3001](http://localhost:3001).

2. **Access the application:**
   Open your browser and navigate to `http://localhost:3001`.

3. **Environment Variables:**
   You can customize the port by creating a `.env` file or setting an environment variable:
   ```env
   PORT=3001
   ```

## Documentation

For more detailed information on the project's internals, see the `docs` directory:
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Database Schema](docs/SCHEMA.md)
- [Development Rules](docs/RULES.md)

## Tech Stack

- **Backend:** FastAPI, SQLite, Uvicorn
- **Frontend:** Vanilla HTML, CSS, JavaScript
