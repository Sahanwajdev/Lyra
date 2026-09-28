import os
from pydantic_settings import BaseSettings if False else object

class Settings:
    PROJECT_NAME: str = "Lyra Cloud API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # Security
    ADMIN_SECRET: str = os.getenv("ADMIN_SECRET", "lyra_admin_secret_super_secure_key_2026")
    
    # Database
    DATA_DIR: str = os.getenv("DATA_DIR", os.path.join(os.path.dirname(__file__), "..", "data"))
    DB_PATH: str = os.path.join(DATA_DIR, "lyra.db")
    
    # Caching TTLs in seconds
    SEARCH_CACHE_TTL: int = int(os.getenv("SEARCH_CACHE_TTL", "3600"))        # 1 hour
    STREAM_CACHE_TTL: int = int(os.getenv("STREAM_CACHE_TTL", "10800"))       # 3 hours (YouTube stream expires in ~6 hrs)
    INFO_CACHE_TTL: int = int(os.getenv("INFO_CACHE_TTL", "86400"))           # 24 hours
    
    # Plans & Limits
    PLANS = {
        "free": {
            "name": "Free",
            "daily_requests": 100,
            "daily_video_requests": 5,
            "price": 0,
            "validity_days": 30
        },
        "basic": {
            "name": "Basic",
            "daily_requests": 3000,
            "daily_video_requests": 150,
            "price": 99,
            "validity_days": 30
        },
        "starter": {
            "name": "Starter",
            "daily_requests": 5000,
            "daily_video_requests": 250,
            "price": 149,
            "validity_days": 30
        },
        "standard": {
            "name": "Standard",
            "daily_requests": 10000,
            "daily_video_requests": 500,
            "price": 289,
            "validity_days": 30
        },
        "pro": {
            "name": "Pro",
            "daily_requests": 25000,
            "daily_video_requests": 1250,
            "price": 569,
            "validity_days": 30
        },
        "business": {
            "name": "Business",
            "daily_requests": 50000,
            "daily_video_requests": 2500,
            "price": 1129,
            "validity_days": 30
        },
        "enterprise": {
            "name": "Enterprise",
            "daily_requests": 100000,
            "daily_video_requests": 5000,
            "price": 1879,
            "validity_days": 30
        },
        "ultra": {
            "name": "Ultra",
            "daily_requests": 150000,
            "daily_video_requests": 7500,
            "price": 2389,
            "validity_days": 30
        }
    }

settings = Settings()
