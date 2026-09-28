import time
from fastapi import APIRouter, Depends, Query, Request, HTTPException
from typing import Dict, Any

from app.core.security import verify_api_key
from app.services.youtube import get_video_info, extract_video_id

router = APIRouter(prefix="/info", tags=["Info"])

@router.get("")
async def get_info(
    request: Request,
    id: str = Query(..., description="YouTube Video ID or full YouTube URL"),
    auth: Dict[str, Any] = Depends(verify_api_key)
):
    start_time = time.perf_counter()
    vid_id = extract_video_id(id)
    
    try:
        data = await get_video_info(vid_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch song info: {str(e)}")
        
    latency = round((time.perf_counter() - start_time) * 1000, 2)
    return {
        "status": "success",
        "data": data,
        "latency_ms": latency
    }
