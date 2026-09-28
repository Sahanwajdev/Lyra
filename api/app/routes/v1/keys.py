import secrets
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, Query, Request, HTTPException
from typing import Dict, Any, List
import aiosqlite

from app.config import settings
from app.db.database import get_db_connection, get_key_data, get_user_keys
from app.core.cache import invalidate_key_cache
from app.models.schemas import KeyCreateRequest, KeyResponse, KeyUsageResponse

router = APIRouter(prefix="/keys", tags=["API Keys"])

def generate_lyra_key() -> str:
    """
    Generates API key in the format requested by user:
    e.g. '8fLyra1d4a' (2 hex chars + 'Lyra' + 4 hex chars)
    """
    prefix = secrets.token_hex(1)  # e.g. '8f'
    suffix = secrets.token_hex(2)  # e.g. '1d4a'
    return f"{prefix}Lyra{suffix}"

@router.get("/plans")
async def list_plans():
    return {
        "status": "success",
        "plans": settings.PLANS
    }

@router.get("/user")
async def get_keys_for_user(
    email: str = Query(..., description="User email to fetch generated keys for")
):
    clean_email = email.strip().lower()
    keys = await get_user_keys(clean_email)
    return {
        "status": "success",
        "email": clean_email,
        "count": len(keys),
        "keys": keys
    }

@router.post("/generate", response_model=KeyResponse)
async def generate_key(req: KeyCreateRequest):
    clean_email = req.email.strip().lower()
    if not clean_email or "@" not in clean_email:
        raise HTTPException(status_code=400, detail="A valid user email is required to generate an API key")

    plan_name = req.plan.lower() if req.plan else "unlimited"
    plan_info = settings.PLANS.get(plan_name) or settings.PLANS.get("free")
    
    # In Unlimited mode, all keys get 999,999,999 limits
    req_limit = 999999999 if settings.UNLIMITED_MODE else plan_info.get("daily_requests", 100)
    vid_limit = 999999999 if settings.UNLIMITED_MODE else plan_info.get("daily_video_requests", 5)

    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(days=365) # 1 year validity
    
    # Generate unique key in the exact format: 8fLyra1d4a
    async with aiosqlite.connect(settings.DB_PATH) as db:
        while True:
            new_key = generate_lyra_key()
            cursor = await db.execute("SELECT id FROM api_keys WHERE key = ?", (new_key,))
            existing = await cursor.fetchone()
            if not existing:
                break
                
        await db.execute("""
            INSERT INTO api_keys (key, user_email, user_name, plan, daily_requests_limit, daily_video_limit, created_at, expires_at, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        """, (
            new_key,
            clean_email,
            req.name or "Developer",
            plan_name,
            req_limit,
            vid_limit,
            now.isoformat(),
            expires_at.isoformat()
        ))
        await db.commit()

    return {
        "status": "success",
        "key": new_key,
        "user_email": clean_email,
        "user_name": req.name or "Developer",
        "plan": plan_name,
        "daily_requests_limit": req_limit,
        "daily_video_limit": vid_limit,
        "expires_at": expires_at.isoformat(),
        "is_active": True
    }

@router.get("/usage", response_model=KeyUsageResponse)
async def get_usage(
    key: str = Query(..., description="API key to inspect")
):
    key_data = await get_key_data(key)
    if not key_data:
        raise HTTPException(status_code=404, detail="API key not found")

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    requests_today = 0
    video_requests_today = 0

    async with aiosqlite.connect(settings.DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("""
            SELECT requests_count, video_requests_count
            FROM key_usage
            WHERE key_id = ? AND usage_date = ?
        """, (key_data["id"], today))
        row = await cursor.fetchone()
        if row:
            requests_today = row["requests_count"]
            video_requests_today = row["video_requests_count"]

    req_limit = key_data["daily_requests_limit"]
    percent = round((requests_today / req_limit * 100), 2) if req_limit > 0 else 0

    return {
        "status": "success",
        "key": key_data["key"],
        "plan": key_data["plan"],
        "requests_today": requests_today,
        "daily_requests_limit": req_limit,
        "video_requests_today": video_requests_today,
        "daily_video_limit": key_data["daily_video_limit"],
        "expires_at": key_data["expires_at"],
        "percent_used": percent
    }
