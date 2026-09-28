import time
from fastapi import APIRouter, Depends, Query, Request, HTTPException
from typing import Dict, Any

from app.core.security import verify_api_key
from app.services.youtube import get_audio_stream, extract_video_id
from app.services.downloader import proxy_audio_stream
from app.models.schemas import StreamResponse

router = APIRouter(prefix="/stream", tags=["Streaming"])

@router.get("", response_model=StreamResponse)
async def get_stream_url(
    request: Request,
    id: str = Query(..., description="YouTube Video ID or full YouTube URL"),
    quality: str = Query("best", regex="^(best|high|low)$", description="Audio stream quality"),
    auth: Dict[str, Any] = Depends(verify_api_key)
):
    start_time = time.perf_counter()
    vid_id = extract_video_id(id)
    
    try:
        data = await get_audio_stream(vid_id, quality=quality)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract audio stream: {str(e)}")
        
    latency = round((time.perf_counter() - start_time) * 1000, 2)
    
    # Construct direct proxy URL
    base_url = str(request.base_url).rstrip("/")
    api_key = request.state.key_info.get("key", "")
    proxy_url = f"{base_url}/api/v1/stream/raw?id={vid_id}&quality={quality}&api_key={api_key}"
    
    return {
        "status": "success",
        "id": vid_id,
        "title": data.get("title", ""),
        "channel": data.get("channel", ""),
        "duration": str(data.get("duration", "00:00")),
        "duration_seconds": data.get("duration_seconds", 0),
        "thumbnail": data.get("thumbnail", ""),
        "stream_url": data.get("stream_url", ""),
        "format": data.get("format", "m4a"),
        "bitrate": data.get("bitrate", 128),
        "filesize": data.get("filesize", 0),
        "proxy_stream_url": proxy_url,
        "latency_ms": latency
    }

@router.get("/raw")
async def get_raw_audio_stream(
    request: Request,
    id: str = Query(..., description="YouTube Video ID or full YouTube URL"),
    quality: str = Query("best", regex="^(best|high|low)$"),
    auth: Dict[str, Any] = Depends(verify_api_key)
):
    """
    Direct piped audio stream. Perfect for Telegram bots needing an unblocked audio stream.
    """
    vid_id = extract_video_id(id)
    try:
        return await proxy_audio_stream(vid_id, quality=quality)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Streaming proxy failed: {str(e)}")
