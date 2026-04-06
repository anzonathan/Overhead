import os
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv


load_dotenv()

app = FastAPI(title="Overhead AI")

import asyncio
data_version = 0
event_clients = []

async def notify_clients():
    global data_version
    data_version += 1
    for q in list(event_clients):
        try:
            await q.put(data_version)
        except:
            pass

@app.get("/api/events")
async def sse_events():
    q = asyncio.Queue()
    event_clients.append(q)
    async def event_stream():
        try:
            while True:
                v = await q.get()
                yield f"data: {v}\n\n"
        except asyncio.CancelledError:
            pass
        finally:
            event_clients.remove(q)
    return StreamingResponse(event_stream(), media_type="text/event-stream")

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
    defaultTime: Optional[str] = ""
    recurrenceDays: Optional[str] = "[]"

class TaskStruct(BaseModel):
    id: str
    date: str
    goalId: Optional[str] = ""
    parentId: Optional[str] = ""
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
async def create_area(a: AreaStruct):
    with get_db() as conn:
        conn.execute("INSERT INTO areas (id, name, sym) VALUES (?, ?, ?)", (a.id, a.name, a.sym))
        conn.commit()
    await notify_clients()
    return {"status": "ok"}

@app.put("/api/areas/{area_id}")
async def update_area(area_id: str, a: AreaStruct):
    with get_db() as conn:
        conn.execute("UPDATE areas SET name=?, sym=? WHERE id=?", (a.name, a.sym, area_id))
        conn.commit()
    await notify_clients()
    return {"status": "ok"}

@app.delete("/api/areas/{area_id}")
async def delete_area(area_id: str):
    with get_db() as conn:
        conn.execute("DELETE FROM areas WHERE id=?", (area_id,))
        conn.commit()
    await notify_clients()
    return {"status": "ok"}

@app.post("/api/goals")
async def create_goal(goal: GoalStruct):
    with get_db() as conn:
        conn.execute("INSERT INTO goals (id, title, scale, type, area, subgoals, defaultTime, recurrenceDays) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                     (goal.id, goal.title, goal.scale, goal.type, goal.area, goal.subgoals, goal.defaultTime, goal.recurrenceDays))
        conn.commit()
    await notify_clients()
    return {"status": "ok"}

@app.put("/api/goals/{goal_id}")
async def update_goal(goal_id: str, goal: GoalStruct):
    with get_db() as conn:
        conn.execute("UPDATE goals SET title=?, scale=?, type=?, area=?, subgoals=?, defaultTime=?, recurrenceDays=? WHERE id=?",
                     (goal.title, goal.scale, goal.type, goal.area, goal.subgoals, goal.defaultTime, goal.recurrenceDays, goal_id))
        conn.commit()
    await notify_clients()
    return {"status": "ok"}

@app.delete("/api/goals/{goal_id}")
async def delete_goal(goal_id: str):
    with get_db() as conn:
        conn.execute("DELETE FROM goals WHERE id=?", (goal_id,))
        conn.commit()
    await notify_clients()
    return {"status": "ok"}

@app.post("/api/tasks")
async def create_task(t: TaskStruct):
    with get_db() as conn:
        conn.execute("INSERT INTO tasks (id, date, goalId, parentId, title, time, done) VALUES (?, ?, ?, ?, ?, ?, ?)",
                     (t.id, t.date, t.goalId, t.parentId, t.title, t.time, t.done))
        conn.commit()
    await notify_clients()
    return {"status": "ok"}

@app.put("/api/tasks/{task_id}")
async def update_task(task_id: str, t: TaskStruct):
    with get_db() as conn:
        conn.execute("UPDATE tasks SET date=?, goalId=?, parentId=?, title=?, time=?, done=? WHERE id=?",
                     (t.date, t.goalId, t.parentId, t.title, t.time, t.done, task_id))
        conn.commit()
    await notify_clients()
    return {"status": "ok"}

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: str):
    with get_db() as conn:
        conn.execute("DELETE FROM tasks WHERE id=?", (task_id,))
        conn.commit()
    await notify_clients()
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
