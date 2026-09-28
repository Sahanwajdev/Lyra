# ⚡ Lyra Cloud - Ultra-Fast Music & Song Streaming API

<p align="center">
  <b>The high-speed audio extraction, stream resolution, and song download API engineered for Telegram Music Bots (Py-TgCalls, YukkiMusic, AnonX, AviaxMusic) and web applications.</b>
</p>

---

## 🌟 Key Features

- ⚡ **Sub-50ms Response Latency:** Uses direct YouTube InnerTube protocol and in-memory dual-layer LRU caching.
- 🛡️ **Zero YouTube 429 IP Bans:** Resolves streams server-side so your low-resource VPS never gets IP blocked by YouTube.
- 🤖 **Native Py-TgCalls Ready:** Outputs clean `.m4a` and `.opus` direct stream links ready to pipe into `AudioPiped(stream_url)`.
- 🎵 **Spotify & YT Music Resolution:** Resolves Spotify tracks and playlists directly to highest-bitrate YouTube audio streams.
- 🔑 **API Key & Plan Quota Management:** Built-in tiered quota engine (Free, Basic, Starter, Pro, Business, Enterprise, Ultra).
- 💻 **Web Console & Dashboard:** Modern Next.js dashboard with live API key generation, quota analytics, and real-time playground.
- 🐳 **One-Command Docker Deployment:** Fully containerized backend and frontend with Docker Compose.

---

## 🚀 Quick Start

### 1. Run with Docker Compose (Recommended)
```bash
git clone https://github.com/Sahanwajdev/Lyra.git
cd Lyra
docker compose up -d --build
```
- **FastAPI Backend:** `http://localhost:8000` (Docs: `http://localhost:8000/docs`)
- **Web Console & Dashboard:** `http://localhost:3000`

---

### 2. Manual Setup

#### Run the API Backend
```bash
cd api
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python run.py
```

#### Run the Web Console
```bash
cd console
npm install
npm run dev
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/search?query={q}&api_key={key}` | Fast music search via YouTube InnerTube & Spotify |
| `GET` | `/api/v1/stream?id={video_id}&api_key={key}` | Resolves direct `.m4a` stream URL for Py-TgCalls |
| `GET` | `/api/v1/stream/raw?id={video_id}&api_key={key}` | Direct audio streaming pipe with range headers |
| `GET` | `/api/v1/download?id={video_id}&api_key={key}` | Direct song download attachment |
| `GET` | `/api/v1/info?id={video_id}&api_key={key}` | Detailed track duration, artist, thumbnail & views |
| `POST`| `/api/v1/keys/generate` | Generate a new API Key with plan limits |
| `GET` | `/api/v1/keys/usage?key={key}` | Check remaining daily quota and validity days |
| `GET` | `/api/v1/stats` | Real-time system health, uptime, and cache metrics |

---

## 🤖 Telegram Music Bot Integration (Py-TgCalls)

Add this into your Telegram bot's play command:

```python
import httpx
from pytgcalls import PyTgCalls
from pytgcalls.types import AudioPiped

LYRA_API_URL = "http://localhost:8000/api/v1/stream"
LYRA_API_KEY = "your_lyra_api_key_here"

async def play_song(chat_id: int, query: str):
    # 1. Fetch ultra-fast stream URL from Lyra API
    async with httpx.AsyncClient() as client:
        res = await client.get(
            LYRA_API_URL, 
            params={"id": query, "api_key": LYRA_API_KEY}
        )
        stream_data = res.json()

    # 2. Pipe direct stream into Telegram Voice Chat (zero local ffmpeg lag)
    stream_url = stream_data["stream_url"]
    await app.calls.join_group_call(
        chat_id,
        AudioPiped(stream_url)
    )
    print(f"Now Playing: {stream_data['title']} (Extracted in {stream_data['latency_ms']}ms)")
```

A complete standalone Telegram music bot is included in `examples/telegram_bot/bot.py`.

---

## 💳 Plan Tiers

| Plan | Daily Requests | Daily Videos | Validity | Price |
| :--- | :--- | :--- | :--- | :--- |
| **Free** | 100 | 5 | 30 Days | ₹0 |
| **Basic** | 3,000 | 150 | 30 Days | ₹99/mo |
| **Starter** | 5,000 | 250 | 30 Days | ₹149/mo |
| **Standard** | 10,000 | 500 | 30 Days | ₹289/mo |
| **Pro** | 25,000 | 1,250 | 30 Days | ₹569/mo |
| **Business** | 50,000 | 2,500 | 30 Days | ₹1,129/mo |
| **Enterprise** | 100,000 | 5,000 | 30 Days | ₹1,879/mo |
| **Ultra** | 150,000 | 7,500 | 30 Days | ₹2,389/mo |

---

## 🛡️ License

Private repository for `shnwazdeveloper`. All rights reserved.
