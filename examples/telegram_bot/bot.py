"""
Lyra Music Bot - Powered by Lyra Cloud API
Fast, Zero-Buffer Telegram Music Bot using Pyrogram and Py-TgCalls
"""

import os
import asyncio
import httpx
from pyrogram import Client, filters
from pyrogram.types import Message
from pytgcalls import PyTgCalls
from pytgcalls.types import AudioPiped

# Bot Credentials
API_ID = int(os.getenv("API_ID", "123456"))
API_HASH = os.getenv("API_HASH", "your_api_hash_here")
BOT_TOKEN = os.getenv("BOT_TOKEN", "your_bot_token_here")

# Lyra API Configuration
LYRA_BASE_URL = os.getenv("LYRA_BASE_URL", "http://localhost:8000/api/v1")
LYRA_API_KEY = os.getenv("LYRA_API_KEY", "lyra_live_demo_test_key_2026")

app = Client("LyraMusicBot", api_id=API_ID, api_hash=API_HASH, bot_token=BOT_TOKEN)
call_py = PyTgCalls(app)

@app.on_message(filters.command(["start", "help"]))
async def start_handler(client: Client, message: Message):
    await message.reply_text(
        "👋 **Welcome to Lyra Music Bot!**\n\n"
        "⚡ Powered by **Lyra Cloud Ultra-Fast API**\n\n"
        "**Available Commands:**\n"
        "• `/play <song or url>` - Stream music directly in Voice Chat\n"
        "• `/song <song>` - Download and receive MP3 file\n"
        "• `/stop` - Stop streaming and leave voice chat\n"
        "• `/pause` - Pause music stream\n"
        "• `/resume` - Resume music stream\n"
    )

@app.on_message(filters.command("play") & filters.group)
async def play_handler(client: Client, message: Message):
    if len(message.command) < 2:
        return await message.reply_text("❗ **Usage:** `/play <song name or link>`")

    query = " ".join(message.command[1:])
    status = await message.reply_text("⚡ **Resolving stream with Lyra Engine...**")

    try:
        # Request stream resolution from Lyra Cloud API
        async with httpx.AsyncClient(timeout=15.0) as http_client:
            res = await http_client.get(
                f"{LYRA_BASE_URL}/stream",
                params={"id": query, "api_key": LYRA_API_KEY}
            )
            data = res.json()

        if data.get("status") != "success":
            return await status.edit_text(f"❌ **Failed:** {data.get('detail', 'Could not resolve stream.')}")

        stream_url = data["stream_url"]
        title = data["title"]
        duration = data["duration"]
        artist = data["channel"]
        latency = data.get("latency_ms", 0)

        # Pipe audio directly into Telegram Voice Chat via Py-TgCalls
        chat_id = message.chat.id
        await call_py.join_group_call(
            chat_id,
            AudioPiped(stream_url)
        )

        await status.edit_text(
            f"🎵 **Now Playing:** [{title}]({data.get('thumbnail')})\n"
            f"👤 **Artist:** {artist}\n"
            f"⏱ **Duration:** {duration}\n"
            f"⚡ **Extraction Latency:** `{latency}ms` (Lyra Cloud)"
        )

    except Exception as e:
        await status.edit_text(f"❌ **Playback Error:** `{str(e)}`")

@app.on_message(filters.command("song"))
async def song_download_handler(client: Client, message: Message):
    if len(message.command) < 2:
        return await message.reply_text("❗ **Usage:** `/song <song name>`")

    query = " ".join(message.command[1:])
    status = await message.reply_text("📥 **Fetching audio from Lyra Cloud...**")

    try:
        download_url = f"{LYRA_BASE_URL}/download?id={query}&api_key={LYRA_API_KEY}&format=m4a"
        await status.edit_text(f"✅ **Download ready!**\n[Click here to stream/download]({download_url})")
    except Exception as e:
        await status.edit_text(f"❌ **Error:** `{str(e)}`")

@app.on_message(filters.command("stop") & filters.group)
async def stop_handler(client: Client, message: Message):
    try:
        await call_py.leave_group_call(message.chat.id)
        await message.reply_text("⏹ **Stream stopped.**")
    except Exception as e:
        await message.reply_text(f"❌ `{str(e)}`")

async def main():
    await app.start()
    await call_py.start()
    print("Lyra Music Bot is running...")
    await asyncio.Event().wait()

if __name__ == "__main__":
    asyncio.run(main())
