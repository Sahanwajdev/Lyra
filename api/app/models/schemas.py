from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SongItem(BaseModel):
    id: str
    title: str
    duration: str
    channel: str
    thumbnail: str
    views: str
    url: str

class SearchResponse(BaseModel):
    status: str = "success"
    query: str
    count: int
    results: List[SongItem]
    latency_ms: float

class StreamResponse(BaseModel):
    status: str = "success"
    id: str
    title: str
    channel: str
    duration: str
    duration_seconds: int
    thumbnail: str
    stream_url: str
    format: str
    bitrate: Optional[int] = 128
    filesize: Optional[int] = 0
    proxy_stream_url: str
    latency_ms: float

class KeyCreateRequest(BaseModel):
    email: str
    name: Optional[str] = "Developer"
    plan: Optional[str] = "free"

class KeyResponse(BaseModel):
    status: str = "success"
    key: str
    user_email: str
    user_name: str
    plan: str
    daily_requests_limit: int
    daily_video_limit: int
    expires_at: str
    is_active: bool

class KeyUsageResponse(BaseModel):
    status: str = "success"
    key: str
    plan: str
    requests_today: int
    daily_requests_limit: int
    video_requests_today: int
    daily_video_limit: int
    expires_at: str
    percent_used: float

class PlanDetails(BaseModel):
    name: str
    daily_requests: int
    daily_video_requests: int
    price: int
    validity_days: int

class SystemStatsResponse(BaseModel):
    status: str = "success"
    uptime_seconds: float
    total_requests_today: int
    cache_search_size: int
    cache_stream_size: int
    average_latency_ms: float
    plans: Dict[str, Any]
