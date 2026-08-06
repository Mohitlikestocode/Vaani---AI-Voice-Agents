"""SQLite database — persistent storage that survives server restarts.
Data stored in backend/swara.db (auto-created on first run).
"""

import sqlite3
import os
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent.parent / "swara.db"

def _get_conn():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn

def init_db():
    """Create tables if they don't exist."""
    conn = _get_conn()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS agents (
            id TEXT PRIMARY KEY,
            owner_id TEXT DEFAULT '',
            business_name TEXT NOT NULL,
            business_type TEXT NOT NULL,
            greeting TEXT DEFAULT '',
            instructions TEXT DEFAULT '',
            total_seats INTEGER DEFAULT 20,
            avg_eating_minutes INTEGER DEFAULT 60,
            max_party_size INTEGER DEFAULT 20,
            reservations_enabled INTEGER DEFAULT 1,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS reservations (
            id TEXT PRIMARY KEY,
            agent_id TEXT NOT NULL,
            guest_name TEXT NOT NULL,
            party_size INTEGER NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            phone TEXT DEFAULT '',
            notes TEXT DEFAULT '',
            status TEXT DEFAULT 'confirmed',
            created_at TEXT NOT NULL,
            FOREIGN KEY (agent_id) REFERENCES agents(id)
        );
    """)
    conn.commit()
    conn.close()

# Initialize on import
init_db()
