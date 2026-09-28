import secrets
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, Query, Request, HTTPException
from typing import Dict, Any
import aiosqlite

from app.config import settings
from app.db.database import get_db_connection, get_key_data
from app.core.cache import invalidate_key_cache
from app.models.schemas import KeyCreateRequest, KeyResponse, KeyUsageResponse

router = APIRouter(prefix="/keys", tags=["API Keys"])

def generate_secure_key(prefix: str = "lyra") -> str:
    token = secrets.token_urlsafe(24).replace("-", "").replace("_", "")
    return f"{prefix}_{token}"

@router.get("/plans")
async def list_plans():
    return {
        "status": "success",
        "plans": settings.PLANS
    }

@router.post("/generate", response_model=KeyResponse)
async def generate_key(req: KeyCreateRequest):
    plan_name = req.plan.lower() if req.plan else "free"
    plan_info = settings.PLANS.get(plan_name)
    if not plan_info:
        raise HTTPException(status_code=400, detail=f"Invalid plan '{req.plan}'. Available: {list(settings.PLANS.keys())}")

    now = datetime.now(timezone.utc)
    validity_days = plan_info.get("validity_days", 30)
    expires_at = now + timedelta(days=validity_days)
    
    new_key = generate_secure_key()
    
    async with aiosqlite.connect(settings.DB_PATH) as db:
        await db.execute("""
            INSERT INTO api_keys (key, user_email, user_name, plan, daily_requests_limit, daily_video_limit, created_at, expires_at, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        """, (
            new_key,
            req.email,
            req.name or "Developer",
            plan_name,
            plan_info["daily_requests"],
            plan_info["daily_video_requests"],
            now.isoformat(),
            expires_at.isoformat()
        ))
        await db.commit()

    return {
        "status": "success",
        "key": new_key,
        "user_email": req.email,
        "user_name": req.name or "Developer",
        "plan": plan_name,
        "daily_requests_limit": plan_info["daily_requests"],
        "daily_video_limit": plan_info["daily_video_requests"],
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

@router.post("/revoke")
async def revoke_key(
    key: str = Query(..., description="API key to revoke")
):
    async with aiosqlite.connect(settings.DB_PATH) as db:
        cursor = await db.execute("UPDATE api_keys SET is_active = 0 WHERE key = ?", (key,))
        await db.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Key not found")

    invalidate_key_cache(key)
    return {"status": "success", "message": "API Key revoked successfully"}
