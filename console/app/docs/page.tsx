"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Terminal,
  Copy,
  CheckCircle2,
  Code2,
  Cpu,
  Search,
  Radio,
  Download,
  Key,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<"pytgcalls" | "python" | "curl" | "node">("pytgcalls");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const API_HOST = "https://api.shnwaz.dev";

  const endpoints = [
    {
      id: "search",
      method: "GET",
      path: "/api/v1/search",
      title: "Search Music & Videos",
      desc: "Fast YouTube / YouTube Music search with titles, durations, video IDs, thumbnails, and channel names.",
      params: [
        { name: "query", type: "string", required: true, desc: "Song name, artist, YouTube URL, or Spotify link" },
        { name: "limit", type: "integer", required: false, desc: "Number of search results to return (default: 10, max: 25)" },
      ],
      response: `{
  "status": "success",
  "query": "Alan Walker Faded",
  "count": 10,
  "results": [
    {
      "id": "60ItHLz5WEA",
      "title": "Alan Walker - Faded",
      "duration": "03:32",
      "channel": "Alan Walker",
      "thumbnail": "https://i.ytimg.com/vi/60ItHLz5WEA/hq720.jpg",
      "views": "3.6B views",
      "url": "https://www.youtube.com/watch?v=60ItHLz5WEA"
    }
  ]
}`,
    },
    {
      id: "stream",
      method: "GET",
      path: "/api/v1/stream",
      title: "Extract Direct Audio Stream (Py-TgCalls)",
      desc: "Resolves direct high-speed audio stream URLs (.m4a / .webm) ready for Telegram Voice Chats without local CPU transcoding.",
      params: [
        { name: "id", type: "string", required: true, desc: "YouTube 11-char Video ID, full YouTube URL, or search query" },
        { name: "quality", type: "string", required: false, desc: "'best', 'high', or 'low' (default: 'best')" },
        { name: "api_key", type: "string", required: true, desc: "Your Lyra API key (e.g. 8fLyra1d4a)" },
      ],
      response: `{
  "status": "success",
  "id": "60ItHLz5WEA",
  "title": "Alan Walker - Faded",
  "channel": "Alan Walker",
  "duration": "03:32",
  "duration_seconds": 212,
  "thumbnail": "https://i.ytimg.com/vi/60ItHLz5WEA/maxresdefault.jpg",
  "stream_url": "https://rr3---sn-gwpa-25ued.googlevideo.com/videoplayback?...",
  "proxy_stream_url": "https://api.shnwaz.dev/api/v1/stream/raw?id=60ItHLz5WEA&api_key=8fLyra1d4a",
  "format": "m4a",
  "bitrate": 128.0,
  "filesize": 3418520,
  "latency_ms": 14.2
}`,
    },
    {
      id: "raw-stream",
      method: "GET",
      path: "/api/v1/stream/raw",
      title: "Raw Chunked Audio Pipe",
      desc: "Direct chunked binary audio stream over HTTP. Use if you want Lyra to proxy and stream the audio data directly to your client.",
      params: [
        { name: "id", type: "string", required: true, desc: "YouTube Video ID or URL" },
        { name: "api_key", type: "string", required: true, desc: "Your Lyra API key" },
      ],
      response: `[Binary Chunked Audio Stream (audio/mp4 / audio/webm)]`,
    },
    {
      id: "download",
      method: "GET",
      path: "/api/v1/download",
      title: "Download Audio Track",
      desc: "Direct file download attachment header with proper song filename, allowing users to save the file instantly.",
      params: [
        { name: "id", type: "string", required: true, desc: "YouTube Video ID or URL" },
        { name: "api_key", type: "string", required: true, desc: "Your Lyra API key" },
      ],
      response: `[Binary Audio File with Content-Disposition: attachment; filename="Song_Name.m4a"]`,
    },
    {
      id: "keys-generate",
      method: "POST",
      path: "/api/v1/keys/generate",
      title: "Generate API Key",
      desc: "Creates a new API key in the format: 8fLyra1d4a with unlimited quota.",
      params: [
        { name: "email", type: "string (body)", required: true, desc: "Developer's email address" },
        { name: "name", type: "string (body)", required: false, desc: "Friendly name / label for the key" },
        { name: "plan", type: "string (body)", required: false, desc: "'unlimited' (default)" },
      ],
      response: `{
  "status": "success",
  "key": "8fLyra1d4a",
  "user_email": "developer@shnwaz.dev",
  "user_name": "My Telegram Music Bot",
  "plan": "unlimited",
  "daily_requests_limit": 999999999,
  "daily_video_limit": 999999999,
  "expires_at": "2027-09-28T18:00:00Z",
  "is_active": true
}`,
    },
    {
      id: "keys-usage",
      method: "GET",
      path: "/api/v1/keys/usage",
      title: "Check API Key Usage & Status",
      desc: "Inspect real-time daily quota consumption and expiry.",
      params: [
        { name: "key", type: "string", required: true, desc: "Your Lyra API Key" },
      ],
      response: `{
  "status": "success",
  "key": "8fLyra1d4a",
  "plan": "unlimited",
  "requests_today": 12,
  "daily_requests_limit": 999999999,
  "video_requests_today": 0,
  "daily_video_limit": 999999999,
  "expires_at": "2027-09-28T18:00:00Z",
  "percent_used": 0.0
}`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      {/* Top Banner */}
      <div className="border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-3 border border-cyan-500/30">
            <Terminal className="w-3.5 h-3.5" />
            LYRA DEVELOPER SPECIFICATION • v1.0
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Lyra API Documentation
          </h1>
          <p className="text-slate-400 text-base mt-2 max-w-2xl leading-relaxed">
            High-speed song search, direct audio streaming URLs, and download endpoints engineered specifically for Py-TgCalls Telegram music bots.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Key className="w-3.5 h-3.5" />
            Get Real API Key
          </Link>
          <a
            href="https://api.shnwaz.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <span>Live Server</span>
            <ExternalLink className="w-3 h-3 text-cyan-400" />
          </a>
        </div>
      </div>

      {/* Quick Setup & Auth Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Production Base URL</h3>
          <p className="text-xs text-slate-400">All requests are served over high-speed HTTPS:</p>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
            <span className="text-cyan-300 font-semibold">{API_HOST}/api/v1</span>
            <button
              onClick={() => copyToClipboard(`${API_HOST}/api/v1`, "base-url")}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              {copiedText === "base-url" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Authentication</h3>
          <p className="text-xs text-slate-400">Pass your API key as a query param or request header:</p>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-300">
              Query: <span className="text-cyan-400">?api_key=8fLyra1d4a</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-300">
              Header: <span className="text-cyan-400">x-api-key: 8fLyra1d4a</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Unlimited Engine</h3>
          <p className="text-xs text-slate-400">Zero rate limits, 999,999,999 requests quota enabled:</p>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 flex items-center justify-between">
            <span>UNLIMITED_MODE</span>
            <span className="text-white font-bold">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Code Examples with Tabs */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70 gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-bold text-white">Full Implementation Examples</span>
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab("pytgcalls")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "pytgcalls"
                  ? "bg-cyan-500 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Py-TgCalls Bot
            </button>
            <button
              onClick={() => setActiveTab("python")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "python"
                  ? "bg-cyan-500 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Python (httpx)
            </button>
            <button
              onClick={() => setActiveTab("curl")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "curl"
                  ? "bg-cyan-500 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              cURL
            </button>
            <button
              onClick={() => setActiveTab("node")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "node"
                  ? "bg-cyan-500 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Node.js
            </button>
          </div>
        </div>

        <div className="p-6 bg-[#060a12] font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto leading-relaxed relative">
          <button
            onClick={() => {
              const codeMap = {
                pytgcalls: `import httpx
from pyrogram import Client, filters
from pytgcalls import PyTgCalls
from pytgcalls.types import AudioPiped

app = Client("my_bot", api_id=12345, api_hash="your_api_hash", bot_token="your_bot_token")
call_py = PyTgCalls(app)

LYRA_STREAM_URL = "${API_HOST}/api/v1/stream"
LYRA_KEY = "8fLyra1d4a"

@app.on_message(filters.command("play") & filters.group)
async def play_handler(_, message):
    query = " ".join(message.command[1:])
    if not query:
        return await message.reply_text("Please provide a song name or YouTube link.")

    status_msg = await message.reply_text("⚡ Fetching audio stream via Lyra API...")

    async with httpx.AsyncClient() as client:
        res = await client.get(
            LYRA_STREAM_URL,
            params={"id": query, "api_key": LYRA_KEY},
            timeout=10.0
        )
        data = res.json()

    if data.get("status") != "success":
        return await status_msg.edit_text("❌ Failed to resolve music stream.")

    stream_url = data["stream_url"]
    song_title = data["title"]
    duration = data["duration"]

    # Direct audio stream into Telegram Voice Chat (zero local ffmpeg load)
    await call_py.join_group_call(
        message.chat.id,
        AudioPiped(stream_url)
    )

    await status_msg.edit_text(
        f"▶️ **Now Playing:** {song_title}\\n⏱ **Duration:** {duration}\\n⚡ **Latency:** {data['latency_ms']}ms"
    )`,
                python: `import httpx

API_BASE = "${API_HOST}/api/v1"
API_KEY = "8fLyra1d4a"

async def main():
    async with httpx.AsyncClient() as client:
        # 1. Search song
        search_res = await client.get(
            f"{API_BASE}/search",
            params={"query": "Alan Walker Faded", "limit": 5}
        )
        tracks = search_res.json()["results"]
        first_video_id = tracks[0]["id"]
        print(f"Top track: {tracks[0]['title']} ({first_video_id})")

        # 2. Extract direct playable stream URL
        stream_res = await client.get(
            f"{API_BASE}/stream",
            params={"id": first_video_id, "api_key": API_KEY}
        )
        stream_info = stream_res.json()
        print(f"Direct stream URL: {stream_info['stream_url']}")
        print(f"Latency: {stream_info['latency_ms']}ms")`,
                curl: `# 1. Search music
curl -X GET "${API_HOST}/api/v1/search?query=Alan+Walker+Faded"

# 2. Extract direct audio stream URL (.m4a / .webm)
curl -X GET "${API_HOST}/api/v1/stream?id=60ItHLz5WEA&api_key=8fLyra1d4a"

# 3. Download audio file directly
curl -O -J "${API_HOST}/api/v1/download?id=60ItHLz5WEA&api_key=8fLyra1d4a"

# 4. Check key usage
curl -X GET "${API_HOST}/api/v1/keys/usage?key=8fLyra1d4a"`,
                node: `import axios from "axios";

const API_BASE = "${API_HOST}/api/v1";
const API_KEY = "8fLyra1d4a";

async function playMusic(query: string) {
  // 1. Fetch stream URL
  const { data } = await axios.get(\`\${API_BASE}/stream\`, {
    params: { id: query, api_key: API_KEY },
  });

  console.log("Track:", data.title);
  console.log("Stream URL:", data.stream_url);
  console.log("Duration:", data.duration);
  console.log("Latency:", data.latency_ms + "ms");
  return data.stream_url;
}`,
              };
              copyToClipboard(codeMap[activeTab], "tab-code");
            }}
            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors z-10"
          >
            {copiedText === "tab-code" ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-sans">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="font-sans">Copy Code</span>
              </>
            )}
          </button>

          {activeTab === "pytgcalls" && (
            <pre className="text-slate-200">
{`import httpx
from pyrogram import Client, filters
from pytgcalls import PyTgCalls
from pytgcalls.types import AudioPiped

app = Client("my_bot", api_id=12345, api_hash="your_api_hash", bot_token="your_bot_token")
call_py = PyTgCalls(app)

LYRA_STREAM_URL = "${API_HOST}/api/v1/stream"
LYRA_KEY = "8fLyra1d4a"

@app.on_message(filters.command("play") & filters.group)
async def play_handler(_, message):
    query = " ".join(message.command[1:])
    if not query:
        return await message.reply_text("Please provide a song name or YouTube link.")

    status_msg = await message.reply_text("⚡ Fetching audio stream via Lyra API...")

    async with httpx.AsyncClient() as client:
        res = await client.get(
            LYRA_STREAM_URL,
            params={"id": query, "api_key": LYRA_KEY},
            timeout=10.0
        )
        data = res.json()

    if data.get("status") != "success":
        return await status_msg.edit_text("❌ Failed to resolve music stream.")

    stream_url = data["stream_url"]
    song_title = data["title"]
    duration = data["duration"]

    # Direct audio stream into Telegram Voice Chat (zero local ffmpeg load)
    await call_py.join_group_call(
        message.chat.id,
        AudioPiped(stream_url)
    )

    await status_msg.edit_text(
        f"▶️ **Now Playing:** {song_title}\\n⏱ **Duration:** {duration}\\n⚡ **Latency:** {data['latency_ms']}ms"
    )`}
            </pre>
          )}

          {activeTab === "python" && (
            <pre className="text-slate-200">
{`import httpx

API_BASE = "${API_HOST}/api/v1"
API_KEY = "8fLyra1d4a"

async def main():
    async with httpx.AsyncClient() as client:
        # 1. Search song
        search_res = await client.get(
            f"{API_BASE}/search",
            params={"query": "Alan Walker Faded", "limit": 5}
        )
        tracks = search_res.json()["results"]
        first_video_id = tracks[0]["id"]
        print(f"Top track: {tracks[0]['title']} ({first_video_id})")

        # 2. Extract direct playable stream URL
        stream_res = await client.get(
            f"{API_BASE}/stream",
            params={"id": first_video_id, "api_key": API_KEY}
        )
        stream_info = stream_res.json()
        print(f"Direct stream URL: {stream_info['stream_url']}")
        print(f"Latency: {stream_info['latency_ms']}ms")`}
            </pre>
          )}

          {activeTab === "curl" && (
            <pre className="text-slate-200">
{`# 1. Search music
curl -X GET "${API_HOST}/api/v1/search?query=Alan+Walker+Faded"

# 2. Extract direct audio stream URL (.m4a / .webm)
curl -X GET "${API_HOST}/api/v1/stream?id=60ItHLz5WEA&api_key=8fLyra1d4a"

# 3. Download audio file directly
curl -O -J "${API_HOST}/api/v1/download?id=60ItHLz5WEA&api_key=8fLyra1d4a"

# 4. Check key usage
curl -X GET "${API_HOST}/api/v1/keys/usage?key=8fLyra1d4a"`}
            </pre>
          )}

          {activeTab === "node" && (
            <pre className="text-slate-200">
{`import axios from "axios";

const API_BASE = "${API_HOST}/api/v1";
const API_KEY = "8fLyra1d4a";

async function playMusic(query: string) {
  // 1. Fetch stream URL
  const { data } = await axios.get(\`\${API_BASE}/stream\`, {
    params: { id: query, api_key: API_KEY },
  });

  console.log("Track:", data.title);
  console.log("Stream URL:", data.stream_url);
  console.log("Duration:", data.duration);
  console.log("Latency:", data.latency_ms + "ms");
  return data.stream_url;
}`}
            </pre>
          )}
        </div>
      </div>

      {/* Endpoints Reference Section */}
      <div className="space-y-8">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">API Endpoints Reference</h2>
          <p className="text-xs text-slate-400 mt-1">Detailed specifications and response structures</p>
        </div>

        <div className="grid gap-6">
          {endpoints.map((ep) => (
            <div key={ep.id} className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
              <div className="p-6 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                      ep.method === "GET"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-white">{ep.path}</span>
                </div>
                <div className="text-xs text-slate-300 font-medium">{ep.title}</div>
              </div>

              <div className="p-6 space-y-5">
                <p className="text-sm text-slate-300">{ep.desc}</p>

                {/* Parameters Table */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                    Parameters
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="py-2.5 px-4 font-semibold">Parameter</th>
                          <th className="py-2.5 px-4 font-semibold">Type</th>
                          <th className="py-2.5 px-4 font-semibold">Required</th>
                          <th className="py-2.5 px-4 font-sans font-semibold">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-950/30">
                        {ep.params.map((p, pIdx) => (
                          <tr key={pIdx}>
                            <td className="py-2.5 px-4 text-cyan-300 font-semibold">{p.name}</td>
                            <td className="py-2.5 px-4 text-slate-400">{p.type}</td>
                            <td className="py-2.5 px-4">
                              {p.required ? (
                                <span className="text-rose-400 font-semibold">Yes</span>
                              ) : (
                                <span className="text-slate-500">No</span>
                              )}
                            </td>
                            <td className="py-2.5 px-4 font-sans text-slate-300">{p.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Example Response */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Example 200 OK Response
                    </h4>
                    <button
                      onClick={() => copyToClipboard(ep.response, `resp-${ep.id}`)}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                    >
                      {copiedText === `resp-${ep.id}` ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Response</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                    <pre>{ep.response}</pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
