CREATE TABLE IF NOT EXISTS areas (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sym TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    scale TEXT NOT NULL,
    type TEXT NOT NULL,
    area TEXT NOT NULL,
    subgoals TEXT NOT NULL DEFAULT '[]',
    defaultTime TEXT DEFAULT '',
    recurrenceDays TEXT DEFAULT '[]',
    FOREIGN KEY(area) REFERENCES areas(id)
);

CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    goalId TEXT DEFAULT '',
    parentId TEXT DEFAULT '',
    title TEXT,
    time TEXT,
    done BOOLEAN NOT NULL DEFAULT 0
);
