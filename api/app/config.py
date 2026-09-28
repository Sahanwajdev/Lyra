import os

class Settings:
    PROJECT_NAME: str = "Lyra Cloud API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # UNLIMITED MODE: All rate limits, daily quotas, and video limits are disabled
    UNLIMITED_MODE: bool = True
    
    # Security
    ADMIN_SECRET: str = os.getenv("ADMIN_SECRET", "lyra_admin_secret_super_secure_key_2026")
    DEFAULT_PUBLIC_KEY: str = "lyra_live_unlimited_access"
    
    # Database
    DATA_DIR: str = os.getenv("DATA_DIR", os.path.join(os.path.dirname(__file__), "..", "data"))
    DB_PATH: str = os.path.join(DATA_DIR, "lyra.db")
    
    # Caching TTLs in seconds
    SEARCH_CACHE_TTL: int = int(os.getenv("SEARCH_CACHE_TTL", "3600"))        # 1 hour
    STREAM_CACHE_TTL: int = int(os.getenv("STREAM_CACHE_TTL", "10800"))       # 3 hours
    INFO_CACHE_TTL: int = int(os.getenv("INFO_CACHE_TTL", "86400"))           # 24 hours
    
    # Plans (All configured with UNLIMITED requests as requested)
    PLANS = {
        "free": {
            "name": "Free (Unlimited)",
            "daily_requests": 999999999,
            "daily_video_requests": 999999999,
            "price": 0,
            "validity_days": 3650
        },
        "basic": {
            "name": "Basic (Unlimited)",
            "daily_requests": 999999999,
            "daily_video_requests": 999999999,
            "price": 0,
            "validity_days": 3650
        },
        "starter": {
            "name": "Starter (Unlimited)",
            "daily_requests": 999999999,
            "daily_video_requests": 999999999,
            "price": 0,
            "validity_days": 3650
        },
        "pro": {
            "name": "Pro (Unlimited)",
            "daily_requests": 999999999,
            "daily_video_requests": 999999999,
            "price": 0,
            "validity_days": 3650
        },
        "enterprise": {
            "name": "Enterprise (Unlimited)",
            "daily_requests": 999999999,
            "daily_video_requests": 999999999,
            "price": 0,
            "validity_days": 3650
        }
    }

settings = Settings()
