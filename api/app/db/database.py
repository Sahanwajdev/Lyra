import os
import aiosqlite
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from app.config import settings

async def init_db():
    os.makedirs(settings.DATA_DIR, exist_ok=True)
    async with aiosqlite.connect(settings.DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS api_keys (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key TEXT UNIQUE NOT NULL,
                user_email TEXT NOT NULL,
                user_name TEXT,
                plan TEXT DEFAULT 'free',
                daily_requests_limit INTEGER DEFAULT 100,
                daily_video_limit INTEGER DEFAULT 5,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP NOT NULL,
                is_active BOOLEAN DEFAULT 1
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS key_usage (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key_id INTEGER NOT NULL,
                usage_date TEXT NOT NULL,
                requests_count INTEGER DEFAULT 0,
                video_requests_count INTEGER DEFAULT 0,
                FOREIGN KEY (key_id) REFERENCES api_keys(id),
                UNIQUE(key_id, usage_date)
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS request_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key_id INTEGER,
                endpoint TEXT NOT NULL,
                video_id TEXT,
                status_code INTEGER,
                response_time_ms REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Insert a default demo/test key if not exists
        default_demo_key = "lyra_free_demo_test_key_2026"
        cursor = await db.execute("SELECT id FROM api_keys WHERE key = ?", (default_demo_key,))
        row = await cursor.fetchone()
        if not row:
            now = datetime.now(timezone.utc)
            expires = now + timedelta(days=365)
            await db.execute("""
                INSERT INTO api_keys (key, user_email, user_name, plan, daily_requests_limit, daily_video_limit, created_at, expires_at, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                default_demo_key,
                "demo@lyra.cloud",
                "Demo User",
                "pro",
                25000,
                1250,
                now.isoformat(),
                expires.isoformat(),
                1
            ))
            await db.commit()

async def get_db_connection() -> aiosqlite.Connection:
    return await aiosqlite.connect(settings.DB_PATH)

async def get_key_data(key: str) -> Optional[Dict[str, Any]]:
    async with aiosqlite.connect(settings.DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("""
            SELECT id, key, user_email, user_name, plan, daily_requests_limit, daily_video_limit, created_at, expires_at, is_active
            FROM api_keys
            WHERE key = ?
        """, (key,))
        row = await cursor.fetchone()
        if not row:
            return None
        return dict(row)

async def check_and_increment_usage(key_id: int, is_video: bool = False) -> Dict[str, Any]:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    async with aiosqlite.connect(settings.DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        
        # Ensure row for today
        await db.execute("""
            INSERT OR IGNORE INTO key_usage (key_id, usage_date, requests_count, video_requests_count)
            VALUES (?, ?, 0, 0)
        """, (key_id, today))
        
        # Increment
        if is_video:
            await db.execute("""
                UPDATE key_usage
                SET requests_count = requests_count + 1,
                    video_requests_count = video_requests_count + 1
                WHERE key_id = ? AND usage_date = ?
            """, (key_id, today))
        else:
            await db.execute("""
                UPDATE key_usage
                SET requests_count = requests_count + 1
                WHERE key_id = ? AND usage_date = ?
            """, (key_id, today))
            
        await db.commit()
        
        cursor = await db.execute("""
            SELECT requests_count, video_requests_count
            FROM key_usage
            WHERE key_id = ? AND usage_date = ?
        """, (key_id, today))
        row = await cursor.fetchone()
        return dict(row)

async def log_request_metric(key_id: Optional[int], endpoint: str, video_id: Optional[str], status_code: int, response_time_ms: float):
    try:
        async with aiosqlite.connect(settings.DB_PATH) as db:
            await db.execute("""
                INSERT INTO request_logs (key_id, endpoint, video_id, status_code, response_time_ms)
                VALUES (?, ?, ?, ?, ?)
            """, (key_id, endpoint, video_id, status_code, response_time_ms))
            await db.commit()
    except Exception:
        pass
