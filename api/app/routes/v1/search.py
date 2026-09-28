import time
from fastapi import APIRouter, Depends, Query, Request, HTTPException
from typing import Dict, Any

from app.core.security import verify_api_key
from app.services.youtube import search_youtube_innertube
from app.services.spotify import resolve_spotify_metadata
from app.models.schemas import SearchResponse

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("", response_model=SearchResponse)
async def search_music(
    request: Request,
    query: str = Query(..., description="Song title, artist, YouTube URL, or Spotify track link"),
    limit: int = Query(10, ge=1, le=50, description="Maximum number of results"),
    auth: Dict[str, Any] = Depends(verify_api_key)
):
    start_time = time.perf_counter()
    clean_query = query.strip()
    
    if not clean_query:
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
        
    # Check if Spotify link
    if "spotify.com" in clean_query:
        spotify_info = await resolve_spotify_metadata(clean_query)
        if spotify_info:
            clean_query = spotify_info["query"]

    # Ultra-fast search
    results = await search_youtube_innertube(clean_query, limit=limit)
    latency = round((time.perf_counter() - start_time) * 1000, 2)
    
    return {
        "status": "success",
        "query": clean_query,
        "count": len(results),
        "results": results,
        "latency_ms": latency
    }
