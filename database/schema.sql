-- TurboCode IDE Database Schema
-- SQLite3 Schema for Project Metadata, Settings, and Compilation History

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('c', 'cpp')),
    root_path TEXT NOT NULL,
    main_file TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_files (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    name TEXT NOT NULL,
    relative_path TEXT NOT NULL,
    content TEXT,
    language TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recent_files (
    id TEXT PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    language TEXT NOT NULL,
    last_opened_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS compilation_history (
    id TEXT PRIMARY KEY,
    timestamp INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    language TEXT NOT NULL,
    compile_success INTEGER NOT NULL,
    duration_ms INTEGER,
    exit_code INTEGER,
    error_count INTEGER DEFAULT 0,
    warning_count INTEGER DEFAULT 0,
    compiler_output TEXT
);

CREATE INDEX IF NOT EXISTS idx_compilation_time ON compilation_history(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_recent_files ON recent_files(last_opened_at DESC);
