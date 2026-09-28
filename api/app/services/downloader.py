import httpx
from fastapi.responses import StreamingResponse
from typing import AsyncGenerator
from app.services.youtube import get_audio_stream

async def stream_audio_chunks(stream_url: str, chunk_size: int = 65536) -> AsyncGenerator[bytes, None]:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    }
    async with httpx.AsyncClient(timeout=60.0) as client:
        async with client.stream("GET", stream_url, headers=headers) as response:
            async for chunk in response.aiter_bytes(chunk_size=chunk_size):
                yield chunk

async def proxy_audio_stream(video_id: str, quality: str = "best") -> StreamingResponse:
    info = await get_audio_stream(video_id, quality=quality)
    stream_url = info["stream_url"]
    format_ext = info.get("format", "m4a")
    
    media_type = "audio/mp4" if format_ext == "m4a" else "audio/webm"
    
    return StreamingResponse(
        stream_audio_chunks(stream_url),
        media_type=media_type,
        headers={
            "Accept-Ranges": "bytes",
            "Content-Disposition": f'inline; filename="{info["title"]}.{format_ext}"',
            "X-Song-Title": info["title"],
            "X-Song-Duration": str(info["duration"]),
        }
    )
