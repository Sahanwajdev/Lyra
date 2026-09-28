# Lyra Music Bot Example

This is a plug-and-play Telegram Music Bot built using **Pyrogram** and **Py-TgCalls**, powered by **Lyra Cloud API**.

### Why use Lyra Cloud for your Telegram Music Bot?
1. **Zero Bot Banning:** Normal bots get 429 blocked by YouTube when extracting audio. Lyra bypasses this with server-side InnerTube endpoints and rotating proxies.
2. **Instant Playback (< 50ms):** Py-TgCalls connects directly to the audio stream URL. No slow local downloads or ffmpeg transcoding.
3. **Low VPS RAM/CPU Usage:** The API server handles the heavy lifting so your bot can run smoothly even on cheap $2/mo VPS or free tiers.

### Setup Instructions
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Configure your environment variables:
   - `API_ID`: From https://my.telegram.org
   - `API_HASH`: From https://my.telegram.org
   - `BOT_TOKEN`: From @BotFather
   - `LYRA_API_KEY`: Generated from your Lyra Console dashboard
   - `LYRA_BASE_URL`: `http://localhost:8000/api/v1` (or your production domain)
3. Run the bot:
   ```bash
   python bot.py
   ```
