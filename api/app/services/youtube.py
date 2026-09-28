import asyncio
import re
from typing import List, Dict, Any, Optional
import httpx
import yt_dlp

from app.core.cache import (
    get_cached_search,
    set_cached_search,
    get_cached_stream,
    set_cached_stream,
    get_cached_info,
    set_cached_info
)

# Optimized yt-dlp configuration with multi-client fallbacks to prevent 429/SABR/Sign-in streaming bugs
YTDL_BASE_OPTIONS = {
    'quiet': True,
    'no_warnings': True,
    'skip_download': True,
    'extract_flat': False,
    'nocheckcertificate': True,
    'ignoreerrors': False,
    'logtostderr': False,
    'format': 'bestaudio/best',
    'youtube_include_dash_manifest': False,
    'youtube_include_hls_manifest': False,
    'socket_timeout': 15,
    'extractor_args': {
        'youtube': {
            'player_client': ['visionos', 'android'],
            'player_skip': ['webpage', 'configs']
        }
    },
    'http_headers': {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
    }
}

INNERTUBE_URL = "https://www.youtube.com/youtubei/v1/search"
INNERTUBE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Content-Type": "application/json",
    "Origin": "https://www.youtube.com",
    "Referer": "https://www.youtube.com/",
}

def extract_video_id(url_or_id: str) -> str:
    url_or_id = url_or_id.strip()
    if len(url_or_id) == 11 and re.match(r'^[a-zA-Z0-9_-]{11}$', url_or_id):
        return url_or_id
    
    match = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11}).*', url_or_id)
    if match:
        return match.group(1)
    return url_or_id

async def search_youtube_innertube(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    cached = get_cached_search(query)
    if cached:
        return cached[:limit]

    payload = {
        "context": {
            "client": {
                "clientName": "WEB",
                "clientVersion": "2.20240410.01.00",
                "hl": "en",
                "gl": "US"
            }
        },
        "query": query,
        "params": "EgIQAQ%3D%3D"
    }

    results: List[Dict[str, Any]] = []

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(INNERTUBE_URL, headers=INNERTUBE_HEADERS, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                contents = (
                    data.get("contents", {})
                    .get("twoColumnSearchResultsRenderer", {})
                    .get("primaryContents", {})
                    .get("sectionListRenderer", {})
                    .get("contents", [])
                )

                for section in contents:
                    items = section.get("itemSectionRenderer", {}).get("contents", [])
                    for item in items:
                        if len(results) >= limit:
                            break
                        video_render = item.get("videoRenderer")
                        if not video_render:
                            continue
                        
                        video_id = video_render.get("videoId")
                        title = ""
                        title_runs = video_render.get("title", {}).get("runs", [])
                        if title_runs:
                            title = "".join([r.get("text", "") for r in title_runs])
                            
                        duration = video_render.get("lengthText", {}).get("simpleText", "00:00")
                        
                        channel = ""
                        owner_runs = video_render.get("ownerText", {}).get("runs", [])
                        if owner_runs:
                            channel = "".join([r.get("text", "") for r in owner_runs])
                            
                        thumbnails = video_render.get("thumbnail", {}).get("thumbnails", [])
                        thumbnail_url = thumbnails[-1].get("url") if thumbnails else f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"
                        
                        views = video_render.get("viewCountText", {}).get("simpleText", "N/A")
                        
                        if video_id and title:
                            results.append({
                                "id": video_id,
                                "title": title,
                                "duration": duration,
                                "channel": channel,
                                "thumbnail": thumbnail_url,
                                "views": views,
                                "url": f"https://www.youtube.com/watch?v={video_id}"
                            })

        if results:
            set_cached_search(query, results)
            return results[:limit]
    except Exception:
        pass

    return await search_youtube_ytdlp(query, limit)

def _ytdlp_flat_search(query: str, limit: int) -> List[Dict[str, Any]]:
    opts = {
        'quiet': True,
        'extract_flat': True,
        'skip_download': True,
        'no_warnings': True,
        'default_search': 'ytsearch'
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(f"ytsearch{limit}:{query}", download=False)
        entries = info.get('entries', []) if info else []
        results = []
        for e in entries:
            if not e:
                continue
            vid_id = e.get('id')
            results.append({
                "id": vid_id,
                "title": e.get('title', 'Unknown Title'),
                "duration": str(e.get('duration', '00:00')),
                "channel": e.get('uploader') or e.get('channel', 'Unknown'),
                "thumbnail": e.get('thumbnail') or f"https://i.ytimg.com/vi/{vid_id}/hqdefault.jpg",
                "views": str(e.get('view_count', 'N/A')),
                "url": f"https://www.youtube.com/watch?v={vid_id}"
            })
        return results

async def search_youtube_ytdlp(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    results = await asyncio.to_thread(_ytdlp_flat_search, query, limit)
    if results:
        set_cached_search(query, results)
    return results

def _extract_stream_sync(target: str, quality: str = "best") -> Dict[str, Any]:
    # Support 11-char ID, full URL, or search query
    if len(target) == 11 and re.match(r'^[a-zA-Z0-9_-]{11}$', target):
        url = f"https://www.youtube.com/watch?v={target}"
    elif target.startswith("http://") or target.startswith("https://"):
        url = target
    else:
        url = f"ytsearch1:{target}"
    
    opts = dict(YTDL_BASE_OPTIONS)
    if quality == "high":
        opts['format'] = 'bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio/best'
    elif quality == "low":
        opts['format'] = 'worstaudio[ext=m4a]/worstaudio/worst'
        
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=False)
        if not info:
            raise ValueError(f"Unable to extract audio for {target}")

        # If it was a search query, extract the first entry
        if 'entries' in info:
            entries = [e for e in info['entries'] if e]
            if not entries:
                raise ValueError(f"No results found for {target}")
            info = entries[0]

        video_id = info.get('id') or extract_video_id(target)

        # Extract direct audio stream URL
        stream_url = info.get('url')
        
        # Format fallback if direct url not top-level
        if not stream_url and 'formats' in info:
            audio_formats = [
                f for f in info['formats']
                if f.get('acodec') != 'none' and f.get('url') and not f.get('url', '').endswith(('.jpg', '.webp', '.mhtml'))
            ]
            if audio_formats:
                sorted_formats = sorted(audio_formats, key=lambda x: x.get('abr') or 0, reverse=True)
                stream_url = sorted_formats[0].get('url')
                
        if not stream_url:
            raise ValueError("No playable direct audio stream found.")

        duration = info.get('duration', 0)
        minutes, seconds = divmod(duration, 60)
        formatted_duration = f"{minutes:02d}:{seconds:02d}"

        thumbnails = info.get('thumbnails', [])
        thumbnail = thumbnails[-1].get('url') if thumbnails else f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"

        bitrate = info.get('abr') or 128
        if isinstance(bitrate, (int, float)):
            bitrate = round(bitrate, 1)

        return {
            "status": "success",
            "id": video_id,
            "title": info.get('title', 'Unknown Title'),
            "duration": formatted_duration,
            "duration_seconds": duration,
            "channel": info.get('uploader') or info.get('channel', 'Unknown Artist'),
            "thumbnail": thumbnail,
            "stream_url": stream_url,
            "format": info.get('ext', 'm4a'),
            "filesize": info.get('filesize') or info.get('filesize_approx') or 0,
            "bitrate": bitrate,
            "views": info.get('view_count', 0),
            "webpage_url": info.get('webpage_url', f"https://www.youtube.com/watch?v={video_id}")
        }

async def get_audio_stream(video_id_or_query: str, quality: str = "best") -> Dict[str, Any]:
    # Check cache first
    cached = get_cached_stream(video_id_or_query, quality)
    if cached:
        return cached

    # Resolve stream in thread pool
    result = await asyncio.to_thread(_extract_stream_sync, video_id_or_query, quality)
    
    # Cache under both query and video ID
    set_cached_stream(video_id_or_query, quality, result)
    if result.get("id"):
        set_cached_stream(result["id"], quality, result)
        
    return result

async def get_video_info(video_id_or_url: str) -> Dict[str, Any]:
    cached = get_cached_info(video_id_or_url)
    if cached:
        return cached
        
    data = await get_audio_stream(video_id_or_url)
    info = {k: v for k, v in data.items() if k != "stream_url"}
    set_cached_info(video_id_or_url, info)
    return info
