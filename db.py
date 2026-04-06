import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'overhead.db')
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), 'schema.sql')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        with open(SCHEMA_PATH, 'r') as f:
            conn.executescript(f.read())
        
        # Migration: Add parentId to tasks if missing
        try:
            conn.execute("ALTER TABLE tasks ADD COLUMN parentId TEXT DEFAULT ''")
        except sqlite3.OperationalError:
            pass # Already exists
            
        conn.commit()

INITIAL_AREAS = []

def seed_if_empty():
    pass

if __name__ == '__main__':
    init_db()
    seed_if_empty()
    print("Database initialized and optionally seeded.")
