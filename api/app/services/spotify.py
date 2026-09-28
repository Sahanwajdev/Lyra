import re
import httpx
from typing import Optional, Dict

SPOTIFY_URL_PATTERN = re.compile(
    r'https?://(?:open\.)?spotify\.com/(?:intl-[a-z]{2}/)?(track|album|playlist)/([a-zA-Z0-9]+)'
)

async def resolve_spotify_metadata(url: str) -> Optional[Dict[str, str]]:
    match = SPOTIFY_URL_PATTERN.search(url)
    if not match:
        return None
        
    item_type = match.group(1)
    item_id = match.group(2)
    
    # Use Spotify oEmbed API - public, ultra-fast, zero auth required
    oembed_url = f"https://open.spotify.com/oembed?url={url}"
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(oembed_url)
            if resp.status_code == 200:
                data = resp.json()
                title = data.get("title", "")
                thumbnail = data.get("thumbnail_url", "")
                
                # title is usually format: "Song Name by Artist Name"
                return {
                    "type": item_type,
                    "id": item_id,
                    "query": title,
                    "title": title,
                    "thumbnail": thumbnail
                }
    except Exception:
        pass
        
    return None
