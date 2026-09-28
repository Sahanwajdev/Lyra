import time
import httpx
from fastapi import APIRouter, Depends, Query, Request, HTTPException
from fastapi.responses import StreamingResponse
from typing import Dict, Any

from app.core.security import verify_api_key
from app.services.youtube import get_audio_stream, extract_video_id
from app.services.downloader import stream_audio_chunks

router = APIRouter(prefix="/download", tags=["Download"])

@router.get("")
async def download_song(
    request: Request,
    id: str = Query(..., description="YouTube Video ID or full YouTube URL"),
    format: str = Query("m4a", pattern="^(m4a|mp3|webm)$", description="Target audio file format"),
    quality: str = Query("best", pattern="^(best|high|low)$"),
    auth: Dict[str, Any] = Depends(lambda r: verify_api_key(r, is_video=False))
):
    vid_id = extract_video_id(id)
    try:
        info = await get_audio_stream(vid_id, quality=quality)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")

    stream_url = info["stream_url"]
    file_ext = info.get("format", format)
    clean_title = "".join(c for c in info["title"] if c.isalnum() or c in " ._-()").strip()
    filename = f"{clean_title}.{file_ext}"

    media_type = "audio/mp4" if file_ext == "m4a" else "audio/mpeg"
    
    return StreamingResponse(
        stream_audio_chunks(stream_url),
        media_type=media_type,
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "X-Song-Title": info["title"],
            "X-Song-Artist": info["channel"],
            "X-Song-Duration": str(info["duration"])
        }
    )
