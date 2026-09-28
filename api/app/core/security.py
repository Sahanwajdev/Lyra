from fastapi import HTTPException, Security, Request, status
from fastapi.security.api_key import APIKeyHeader, APIKeyQuery
from datetime import datetime, timezone
from typing import Optional, Dict, Any

from app.config import settings
from app.db.database import get_key_data, check_and_increment_usage
from app.core.cache import get_cached_key, set_cached_key

async def verify_api_key(
    request: Request,
    is_video: bool = False
) -> Dict[str, Any]:
    # Extract API key from header, query param, or Authorization header
    api_key = (
        request.headers.get("x-api-key")
        or request.query_params.get("api_key")
        or request.query_params.get("key")
    )
    
    if not api_key:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            api_key = auth_header.split(" ")[1]
            
    # In UNLIMITED MODE: if no key is provided, auto-assign public unlimited key
    if not api_key:
        if getattr(settings, "UNLIMITED_MODE", True):
            api_key = settings.DEFAULT_PUBLIC_KEY
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "status": "error",
                    "message": "Missing API Key. Provide it via header 'x-api-key' or query parameter '?api_key='.",
                    "docs": "/docs"
                }
            )

    # If UNLIMITED MODE is active, bypass all restrictions & limits completely!
    if getattr(settings, "UNLIMITED_MODE", True):
        unlimited_info = {
            "id": 1,
            "key": api_key,
            "user_email": "unlimited@lyra.cloud",
            "user_name": "Unlimited Developer",
            "plan": "unlimited",
            "daily_requests_limit": 999999999,
            "daily_video_limit": 999999999,
            "is_active": True
        }
        request.state.key_info = unlimited_info
        request.state.usage = {
            "requests_today": 0,
            "requests_limit": 999999999,
            "video_requests_today": 0,
            "video_requests_limit": 999999999
        }
        return unlimited_info

    # Regular validation if UNLIMITED_MODE is False
    cached_key_info = get_cached_key(api_key)
    if not cached_key_info:
        key_data = await get_key_data(api_key)
        if not key_data:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"status": "error", "message": "Invalid API Key."}
            )
        cached_key_info = key_data
        set_cached_key(api_key, cached_key_info)
        
    usage = await check_and_increment_usage(cached_key_info["id"], is_video=is_video)
    request.state.key_info = cached_key_info
    request.state.usage = {
        "requests_today": usage["requests_count"],
        "requests_limit": cached_key_info.get("daily_requests_limit", 999999999),
        "video_requests_today": usage["video_requests_count"],
        "video_requests_limit": cached_key_info.get("daily_video_limit", 999999999)
    }
    return cached_key_info
