import time
from typing import Any, Optional, Dict
from cachetools import TTLCache
from app.config import settings

# Thread-safe in-memory TTL caches for blazing fast (< 1ms) retrieval
search_cache: TTLCache = TTLCache(maxsize=10000, ttl=settings.SEARCH_CACHE_TTL)
stream_cache: TTLCache = TTLCache(maxsize=20000, ttl=settings.STREAM_CACHE_TTL)
info_cache: TTLCache = TTLCache(maxsize=20000, ttl=settings.INFO_CACHE_TTL)
key_cache: TTLCache = TTLCache(maxsize=5000, ttl=60) # Cache API key data for 60s to avoid hammering DB

def get_cached_search(query: str) -> Optional[Any]:
    key = query.strip().lower()
    return search_cache.get(key)

def set_cached_search(query: str, data: Any):
    key = query.strip().lower()
    search_cache[key] = data

def get_cached_stream(video_id: str, quality: str = "best") -> Optional[Any]:
    key = f"{video_id}_{quality}"
    return stream_cache.get(key)

def set_cached_stream(video_id: str, quality: str, data: Any):
    key = f"{video_id}_{quality}"
    stream_cache[key] = data

def get_cached_info(video_id: str) -> Optional[Any]:
    return info_cache.get(video_id)

def set_cached_info(video_id: str, data: Any):
    info_cache[video_id] = data

def get_cached_key(api_key: str) -> Optional[Dict[str, Any]]:
    return key_cache.get(api_key)

def set_cached_key(api_key: str, data: Dict[str, Any]):
    key_cache[api_key] = data

def invalidate_key_cache(api_key: str):
    key_cache.pop(api_key, None)
