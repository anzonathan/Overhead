import os
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv


load_dotenv()

app = FastAPI(title="Overhead AI")



# ── API routes ────────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"status": "ok", "model": "gemini-2.5-flash"}


@app.post("/api/chat")
async def chat(request: Request):
    body = await request.json()
    messages: list = body.get("messages", [])
    context: str   = body.get("context", "")

    # Build multi-turn history (everything except the last message)
    history = [
        {"role": "user" if m["role"] == "user" else "model", "parts": [m["content"]]}
        for m in messages[:-1]
    ]

    latest = messages[-1]["content"] if messages else ""
    if context:
        latest = f"[Context: {context}]\n\n{latest}"

    chat_session = model.start_chat(history=history)

    def stream():
        try:
            for chunk in chat_session.send_message(latest, stream=True):
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            yield f"\n\n[Error: {e}]"

    return StreamingResponse(
        stream(),
        media_type="text/plain",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


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
