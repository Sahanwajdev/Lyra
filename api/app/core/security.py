from fastapi import HTTPException, Security, Request, status
from fastapi.security.api_key import APIKeyHeader, APIKeyQuery
from datetime import datetime, timezone
from typing import Optional, Dict, Any

from app.db.database import get_key_data, check_and_increment_usage
from app.core.cache import get_cached_key, set_cached_key

API_KEY_HEADER = APIKeyHeader(name="x-api-key", auto_error=False)
API_KEY_QUERY = APIKeyQuery(name="api_key", auto_error=False)
API_KEY_QUERY_SHORT = APIKeyQuery(name="key", auto_error=False)

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
            
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "status": "error",
                "message": "Missing API Key. Provide it via header 'x-api-key' or query parameter '?api_key='.",
                "docs": "/docs"
            }
        )
        
    # Check cache first for instant response
    cached_key_info = get_cached_key(api_key)
    if not cached_key_info:
        key_data = await get_key_data(api_key)
        if not key_data:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"status": "error", "message": "Invalid or inactive API Key."}
            )
        cached_key_info = key_data
        set_cached_key(api_key, cached_key_info)
        
    # Check if active
    if not cached_key_info.get("is_active"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"status": "error", "message": "This API Key has been suspended or deactivated."}
        )
        
    # Check expiration
    expires_at_str = cached_key_info.get("expires_at")
    if expires_at_str:
        expires_at = datetime.fromisoformat(expires_at_str)
        if datetime.now(timezone.utc) > expires_at:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"status": "error", "message": "This API Key has expired. Please renew your plan."}
            )
            
    # Check rate limit and increment
    usage = await check_and_increment_usage(cached_key_info["id"], is_video=is_video)
    req_count = usage["requests_count"]
    vid_count = usage["video_requests_count"]
    
    daily_req_limit = cached_key_info.get("daily_requests_limit", 100)
    daily_vid_limit = cached_key_info.get("daily_video_limit", 5)
    
    if req_count > daily_req_limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "status": "error",
                "message": f"Daily API request limit exceeded ({req_count}/{daily_req_limit}). Upgrade your plan to increase limits."
            }
        )
        
    if is_video and vid_count > daily_vid_limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "status": "error",
                "message": f"Daily video request limit exceeded ({vid_count}/{daily_vid_limit}). Upgrade your plan for more video downloads."
            }
        )
        
    # Attach key info and usage to request state
    request.state.key_info = cached_key_info
    request.state.usage = {
        "requests_today": req_count,
        "requests_limit": daily_req_limit,
        "video_requests_today": vid_count,
        "video_requests_limit": daily_vid_limit
    }
    
    return cached_key_info
