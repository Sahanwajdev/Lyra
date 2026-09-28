import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse

from app.config import settings
from app.db.database import init_db
from app.routes.v1.search import router as search_router
from app.routes.v1.stream import router as stream_router
from app.routes.v1.download import router as download_router
from app.routes.v1.info import router as info_router
from app.routes.v1.keys import router as keys_router
from app.routes.v1.stats import router as stats_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB on startup
    await init_db()
    yield

app = FastAPI(
    title="Lyra Cloud API",
    description="Ultra-Fast Music Streaming & Song Download API for Telegram Music Bots and Web Applications",
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend dashboard and cross-origin bot requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Benchmark timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = (time.perf_counter() - start_time) * 1000
    response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}ms"
    response.headers["X-Powered-By"] = "Lyra Cloud Engine"
    return response

# Mount routes under /api/v1
app.include_router(search_router, prefix=settings.API_V1_STR)
app.include_router(stream_router, prefix=settings.API_V1_STR)
app.include_router(download_router, prefix=settings.API_V1_STR)
app.include_router(info_router, prefix=settings.API_V1_STR)
app.include_router(keys_router, prefix=settings.API_V1_STR)
app.include_router(stats_router, prefix=settings.API_V1_STR)

@app.get("/", response_class=PlainTextResponse)
@app.get("/api", response_class=PlainTextResponse)
@app.get("/api/index.py", response_class=PlainTextResponse)
async def root():
    return "Lyra 😊✨🎶"
