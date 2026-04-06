import os
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv


load_dotenv()

app = FastAPI(title="Overhead AI")



# ── Database API routes ────────────────────────────────────────────────────────
import json
from pydantic import BaseModel
from typing import Optional
from db import get_db

class AreaStruct(BaseModel):
    id: str
    name: str
    sym: str

class GoalStruct(BaseModel):
    id: str
    title: str
    scale: str
    type: str
    area: str
    subgoals: str

class TaskStruct(BaseModel):
    id: str
    date: str
    goalId: str
    title: Optional[str] = ""
    time: Optional[str] = ""
    done: bool = False

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/data")
def get_all_data():
    with get_db() as conn:
        areas = [dict(r) for r in conn.execute("SELECT * FROM areas").fetchall()]
        goals = [dict(r) for r in conn.execute("SELECT * FROM goals").fetchall()]
        tasks = [dict(r) for r in conn.execute("SELECT * FROM tasks").fetchall()]
    return {"areas": areas, "goals": goals, "tasks": tasks}

@app.post("/api/areas")
def create_area(a: AreaStruct):
    with get_db() as conn:
        conn.execute("INSERT INTO areas (id, name, sym) VALUES (?, ?, ?)", (a.id, a.name, a.sym))
        conn.commit()
    return {"status": "ok"}

@app.put("/api/areas/{area_id}")
def update_area(area_id: str, a: AreaStruct):
    with get_db() as conn:
        conn.execute("UPDATE areas SET name=?, sym=? WHERE id=?", (a.name, a.sym, area_id))
        conn.commit()
    return {"status": "ok"}

@app.delete("/api/areas/{area_id}")
def delete_area(area_id: str):
    with get_db() as conn:
        # User might have goals attached. We could cascade delete or orphan. Lets cascade.
        conn.execute("DELETE FROM areas WHERE id=?", (area_id,))
        conn.commit()
    return {"status": "ok"}

@app.post("/api/goals")
def create_goal(goal: GoalStruct):
    with get_db() as conn:
        conn.execute("INSERT INTO goals (id, title, scale, type, area, subgoals) VALUES (?, ?, ?, ?, ?, ?)",
                     (goal.id, goal.title, goal.scale, goal.type, goal.area, goal.subgoals))
        conn.commit()
    return {"status": "ok"}

@app.put("/api/goals/{goal_id}")
def update_goal(goal_id: str, goal: GoalStruct):
    with get_db() as conn:
        conn.execute("UPDATE goals SET title=?, scale=?, type=?, area=?, subgoals=? WHERE id=?",
                     (goal.title, goal.scale, goal.type, goal.area, goal.subgoals, goal_id))
        conn.commit()
    return {"status": "ok"}

@app.delete("/api/goals/{goal_id}")
def delete_goal(goal_id: str):
    with get_db() as conn:
        conn.execute("DELETE FROM goals WHERE id=?", (goal_id,))
        conn.commit()
    return {"status": "ok"}

@app.post("/api/tasks")
def create_task(t: TaskStruct):
    with get_db() as conn:
        conn.execute("INSERT INTO tasks (id, date, goalId, title, time, done) VALUES (?, ?, ?, ?, ?, ?)",
                     (t.id, t.date, t.goalId, t.title, t.time, t.done))
        conn.commit()
    return {"status": "ok"}

@app.put("/api/tasks/{task_id}")
def update_task(task_id: str, t: TaskStruct):
    with get_db() as conn:
        conn.execute("UPDATE tasks SET date=?, goalId=?, title=?, time=?, done=? WHERE id=?",
                     (t.date, t.goalId, t.title, t.time, t.done, task_id))
        conn.commit()
    return {"status": "ok"}

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: str):
    with get_db() as conn:
        conn.execute("DELETE FROM tasks WHERE id=?", (task_id,))
        conn.commit()
    return {"status": "ok"}



# ── Static files (serve the UI) ───────────────────────────────────────────────

@app.get("/")
def index():
    return FileResponse("index.html")

# Mount everything else as static (CSS, JS, etc.)
app.mount("/", StaticFiles(directory="."), name="static")


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 3000))
    print(f"  Overhead AI → http://localhost:{port}")
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=True)
