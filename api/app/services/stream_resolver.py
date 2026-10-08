import base64
import re
import html
from typing import Dict, Any, Optional
import httpx

try:
    from cryptography.hazmat.decrepit.ciphers.algorithms import TripleDES
except ImportError:
    try:
        from cryptography.hazmat.primitives.ciphers.algorithms import TripleDES
    except ImportError:
        TripleDES = None

try:
    from cryptography.hazmat.primitives.ciphers import Cipher, modes
    from cryptography.hazmat.backends import default_backend
except ImportError:
    Cipher = None

def _decrypt_saavn_url(enc_url: str) -> Optional[str]:
    """Decrypt JioSaavn DES-ECB encrypted media URL to direct CDN link."""
    if not enc_url or not Cipher or not TripleDES:
        return None
    try:
        key = b"38346591"
        enc = base64.b64decode(enc_url)
        cipher = Cipher(TripleDES(key * 3), modes.ECB(), backend=default_backend())
        decryptor = cipher.decryptor()
        dec = decryptor.update(enc) + decryptor.finalize()
        pad = dec[-1]
        if isinstance(pad, int) and 0 < pad <= 8:
            dec = dec[:-pad]
        return dec.decode("utf-8", errors="ignore").strip()
    except Exception:
        return None

def _clean_track_title(title: str) -> str:
    """Clean video/track title for superior audio matching."""
    cleaned = html.unescape(title)
    cleaned = re.sub(r'\(.*?(?:official|audio|video|lyric|remix|hd|4k|ft\.|feat).*?\)', '', cleaned, flags=re.I)
    cleaned = re.sub(r'\[.*?(?:official|audio|video|lyric|remix|hd|4k|ft\.|feat).*?\]', '', cleaned, flags=re.I)
    cleaned = re.sub(r'[\(\[\{].*?[\)\]\}]', '', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned or title

def resolve_saavn_stream(query_or_id: str, quality: str = "best") -> Optional[Dict[str, Any]]:
    """Ultra-fast, zero-bot-ban audio stream resolver."""
    title = query_or_id.strip()
    video_id = query_or_id.strip()

    # If it's an 11-char YouTube ID or URL, fetch the real title via oEmbed
    if len(query_or_id) == 11 and re.match(r'^[a-zA-Z0-9_-]{11}$', query_or_id):
        try:
            oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={query_or_id}&format=json"
            resp = httpx.get(oembed_url, timeout=4.0)
            if resp.status_code == 200:
                data = resp.json()
                title = data.get("title", query_or_id)
        except Exception:
            pass

    search_query = _clean_track_title(title)
    params = {
        "__call": "search.getResults",
        "_format": "json",
        "_marker": "0",
        "api_version": "4",
        "ctx": "web6dot0",
        "q": search_query,
        "p": 1,
        "n": 5
    }

    try:
        r = httpx.get("https://www.jiosaavn.com/api.php", params=params, timeout=5.0)
        if r.status_code != 200:
            return None

        data = r.json()
        results = data.get("results", [])
        if not results:
            return None

        song = results[0]
        enc_url = song.get("more_info", {}).get("encrypted_media_url")
        if not enc_url:
            return None

        raw_url = _decrypt_saavn_url(enc_url)
        if not raw_url:
            return None

        # Select bitrates based on quality
        if quality == "low":
            stream_url = raw_url.replace("_96.mp4", "_48.mp4")
            bitrate = 48.0
        elif quality == "high":
            stream_url = raw_url.replace("_96.mp4", "_160.mp4")
            bitrate = 160.0
        else: # best
            stream_url = raw_url.replace("_96.mp4", "_320.mp4")
            bitrate = 320.0

        duration_sec = int(song.get("more_info", {}).get("duration") or 210)
        mins, secs = divmod(duration_sec, 60)
        formatted_duration = f"{mins:02d}:{secs:02d}"

        artist = "Unknown Artist"
        artist_map = song.get("more_info", {}).get("artistMap", {})
        if artist_map.get("primary_artists"):
            artist = artist_map["primary_artists"][0].get("name", artist)

        thumbnail = song.get("image", "").replace("150x150", "500x500")

        return {
            "status": "success",
            "id": video_id,
            "title": html.unescape(song.get("title", title)),
            "duration": formatted_duration,
            "duration_seconds": duration_sec,
            "channel": artist,
            "thumbnail": thumbnail,
            "stream_url": stream_url,
            "format": "mp4",
            "filesize": int(duration_sec * (bitrate * 1024 / 8)),
            "bitrate": bitrate,
            "views": int(song.get("play_count", 0) or 0),
            "webpage_url": f"https://www.youtube.com/watch?v={video_id}" if len(video_id) == 11 else f"https://www.youtube.com/results?search_query={search_query}"
        }
    except Exception:
        return None
