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
  Play,
  FileCode,
  Sparkles,
} from "lucide-react";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<"pytgcalls" | "python" | "curl" | "node">("pytgcalls");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [userApiKey, setUserApiKey] = useState<string>("eaLyra31e0");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const API_HOST = "https://api.shnwaz.dev";
  const effectiveKey = userApiKey.trim() || "eaLyra31e0";

  const endpoints = [
    {
      id: "search",
      method: "GET",
      path: "/api/v1/search",
      title: "Search Music & Videos",
      category: "Catalog",
      desc: "Instant search across YouTube and YouTube Music. Returns verified video IDs, high-resolution thumbnails, song titles, channel names, and durations.",
      testUrl: `${API_HOST}/api/v1/search?query=faded&limit=5`,
      params: [
        { name: "query", type: "string", required: true, desc: "Song title, artist name, YouTube URL, or Spotify song name." },
        { name: "limit", type: "integer", required: false, desc: "Number of search results to return (default: 10, max: 25)." },
      ],
      response: `{
  "status": "success",
  "query": "faded",
  "count": 5,
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
      title: "Direct Playable Audio Stream",
      category: "Streaming",
      desc: "Resolves direct high-speed audio stream URLs (.m4a / .webm / 320 kbps CDN). Plug directly into Py-TgCalls without any local ffmpeg download or CPU transcoding.",
      testUrl: `${API_HOST}/api/v1/stream?id=60ItHLz5WEA&api_key=${effectiveKey}`,
      params: [
        { name: "id", type: "string", required: true, desc: "YouTube 11-char Video ID, full YouTube URL, or song query." },
        { name: "quality", type: "string", required: false, desc: "'best', 'high', or 'low' (default: 'best')." },
        { name: "api_key", type: "string", required: true, desc: "Your Lyra API key." },
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
  "proxy_stream_url": "https://api.shnwaz.dev/api/v1/stream/raw?id=60ItHLz5WEA&api_key=${effectiveKey}",
  "format": "m4a",
  "bitrate": 320.0,
  "filesize": 3418520,
  "latency_ms": 12.4
}`,
    },
    {
      id: "raw-stream",
      method: "GET",
      path: "/api/v1/stream/raw",
      title: "Raw Chunked Audio Pipe",
      category: "Streaming",
      desc: "Direct chunked binary audio stream over HTTP. Lyra proxies and streams the audio buffer seamlessly without requiring client direct connections to YouTube CDNs.",
      testUrl: `${API_HOST}/api/v1/stream/raw?id=60ItHLz5WEA&api_key=${effectiveKey}`,
      params: [
        { name: "id", type: "string", required: true, desc: "YouTube Video ID or URL." },
        { name: "api_key", type: "string", required: true, desc: "Your Lyra API key." },
      ],
      response: `HTTP/1.1 200 OK
Content-Type: audio/mp4
Transfer-Encoding: chunked

[Binary chunked audio stream ready for native media players and Py-TgCalls]`,
    },
    {
      id: "download",
      method: "GET",
      path: "/api/v1/download",
      title: "Direct Song File Download",
      category: "Download",
      desc: "Triggers direct file download attachment with automatic sanitized song filename in the Content-Disposition header.",
      testUrl: `${API_HOST}/api/v1/download?id=60ItHLz5WEA&api_key=${effectiveKey}`,
      params: [
        { name: "id", type: "string", required: true, desc: "YouTube Video ID or URL." },
        { name: "api_key", type: "string", required: true, desc: "Your Lyra API key." },
      ],
      response: `HTTP/1.1 200 OK
Content-Disposition: attachment; filename="Alan_Walker_Faded.m4a"
Content-Type: audio/mp4

[Direct Binary Audio Download]`,
    },
    {
      id: "keys-generate",
      method: "POST",
      path: "/api/v1/keys/generate",
      title: "Create Developer API Key",
      category: "Management",
      desc: "Provision a new API key with unlimited throughput and 999,999,999 daily request quota.",
      testUrl: null,
      params: [
        { name: "email", type: "string (body)", required: true, desc: "Developer's email address." },
        { name: "name", type: "string (body)", required: false, desc: "Friendly application label (e.g. 'Telegram Music Bot')." },
        { name: "plan", type: "string (body)", required: false, desc: "Subscription tier ('unlimited')." },
      ],
      response: `{
  "status": "success",
  "key": "${effectiveKey}",
  "user_email": "developer@shnwaz.dev",
  "user_name": "My Telegram Music Bot",
  "plan": "unlimited",
  "daily_requests_limit": 999999999,
  "daily_video_limit": 999999999,
  "expires_at": "2027-10-01T00:00:00Z",
  "is_active": true
}`,
    },
    {
      id: "keys-usage",
      method: "GET",
      path: "/api/v1/keys/usage",
      title: "Inspect Quota & Key Status",
      category: "Management",
      desc: "Query live consumption metrics, daily stream counts, and key validity in real time.",
      testUrl: `${API_HOST}/api/v1/keys/usage?key=${effectiveKey}`,
      params: [
        { name: "key", type: "string", required: true, desc: "Your Lyra API Key." },
      ],
      response: `{
  "status": "success",
  "key": "${effectiveKey}",
  "plan": "unlimited",
  "requests_today": 18,
  "daily_requests_limit": 999999999,
  "video_requests_today": 4,
  "daily_video_limit": 999999999,
  "expires_at": "2027-10-01T00:00:00Z",
  "percent_used": 0.0
}`,
    },
  ];

  const filteredEndpoints = endpoints.filter(
    (ep) =>
      ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const codeSnippets = {
    pytgcalls: `import httpx
from pyrogram import Client, filters
from pytgcalls import PyTgCalls
from pytgcalls.types import AudioPiped

app = Client("my_bot", api_id=12345, api_hash="your_api_hash", bot_token="your_bot_token")
call_py = PyTgCalls(app)

LYRA_STREAM_URL = "${API_HOST}/api/v1/stream"
LYRA_KEY = "${effectiveKey}"

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
API_KEY = "${effectiveKey}"

async def play_song():
    async with httpx.AsyncClient() as client:
        # 1. Search song
        search_res = await client.get(
            f"{API_BASE}/search",
            params={"query": "Alan Walker Faded", "limit": 5}
        )
        tracks = search_res.json()["results"]
        track_id = tracks[0]["id"]
        print(f"Top track: {tracks[0]['title']} ({track_id})")

        # 2. Extract direct playable stream URL
        stream_res = await client.get(
            f"{API_BASE}/stream",
            params={"id": track_id, "api_key": API_KEY}
        )
        stream_info = stream_res.json()
        print(f"Stream URL: {stream_info['stream_url']}")
        print(f"Bitrate: {stream_info.get('bitrate', 320)} kbps | Latency: {stream_info['latency_ms']}ms")`,
    curl: `# 1. Search music catalog
curl -X GET "${API_HOST}/api/v1/search?query=Alan+Walker+Faded"

# 2. Extract direct audio stream URL (.m4a / .webm)
curl -X GET "${API_HOST}/api/v1/stream?id=60ItHLz5WEA&api_key=${effectiveKey}"

# 3. Direct binary audio proxy stream
curl -X GET "${API_HOST}/api/v1/stream/raw?id=60ItHLz5WEA&api_key=${effectiveKey}" --output track.m4a

# 4. Direct song file download
curl -O -J "${API_HOST}/api/v1/download?id=60ItHLz5WEA&api_key=${effectiveKey}"

# 5. Check API key status & quota
curl -X GET "${API_HOST}/api/v1/keys/usage?key=${effectiveKey}"`,
    node: `import axios from "axios";

const API_BASE = "${API_HOST}/api/v1";
const API_KEY = "${effectiveKey}";

async function streamTrack(query: string) {
  // 1. Search and resolve stream in one call
  const { data } = await axios.get(\`\${API_BASE}/stream\`, {
    params: { id: query, api_key: API_KEY },
  });

  if (data.status !== "success") {
    throw new Error("Unable to resolve audio stream");
  }

  console.log("Now Playing:", data.title);
  console.log("Stream URL:", data.stream_url);
  console.log("Duration:", data.duration);
  console.log("Latency:", \`\${data.latency_ms}ms\`);

  return data.stream_url;
}`,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      {/* Header Liquid Glass Section */}
      <div className="relative rounded-3xl p-8 sm:p-10 border border-white/[0.08] bg-slate-900/35 backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-cyan-300 text-xs font-mono backdrop-blur-md">
              <Terminal className="w-3.5 h-3.5" />
              <span>LYRA API SPECIFICATION • v1.0</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Developer Documentation
            </h1>
            <p className="text-slate-300 text-base leading-relaxed">
              Ultra-fast music search, direct 320 kbps stream extraction, and binary chunked audio pipes built specifically for Telegram music bots and audio streaming applications.
            </p>
          </div>

          {/* Action Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.12] hover:bg-white/[0.18] border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all duration-200"
            >
              <Key className="w-3.5 h-3.5 text-cyan-300" />
              <span>Get API Key</span>
            </Link>
            <a
              href="https://api.shnwaz.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white backdrop-blur-md transition-all duration-200"
            >
              <span>Live API Health</span>
              <ExternalLink className="w-3 h-3 text-cyan-400" />
            </a>
          </div>
        </div>

        {/* Live Interactive Key Customizer Banner */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-300 font-medium">Interactive Key Injector:</span>
            <span className="text-xs text-slate-400">Type your key to test snippets dynamically</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={userApiKey}
              onChange={(e) => setUserApiKey(e.target.value)}
              placeholder="e.g. eaLyra31e0"
              className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-white/30 w-44 backdrop-blur-md"
            />
            <button
              onClick={() => copyToClipboard(effectiveKey, "top-key")}
              className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs text-slate-300 hover:text-white transition-colors"
              title="Copy Key"
            >
              {copiedId === "top-key" ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Core Highlights - Liquid Glass Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 border border-white/[0.08] bg-slate-900/35 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-3">
          <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-cyan-300 w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Production Host</h3>
          <p className="text-xs text-slate-400">All queries are routed through encrypted high-speed HTTPS:</p>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/[0.08] font-mono text-xs backdrop-blur-md">
            <span className="text-cyan-300 font-medium">{API_HOST}/api/v1</span>
            <button
              onClick={() => copyToClipboard(`${API_HOST}/api/v1`, "base-url")}
              className="p-1 text-slate-400 hover:text-white rounded transition-colors"
            >
              {copiedId === "base-url" ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        <div className="rounded-2xl p-6 border border-white/[0.08] bg-slate-900/35 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-3">
          <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-emerald-400 w-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Authentication</h3>
          <p className="text-xs text-slate-400">Pass your API key as a query parameter or request header:</p>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="p-2 rounded-lg bg-black/40 border border-white/[0.08] text-slate-300 backdrop-blur-md">
              Query: <span className="text-cyan-300">?api_key={effectiveKey}</span>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/[0.08] text-slate-300 backdrop-blur-md">
              Header: <span className="text-cyan-300">x-api-key: {effectiveKey}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 border border-white/[0.08] bg-slate-900/35 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-3">
          <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-blue-400 w-fit">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">High Throughput</h3>
          <p className="text-xs text-slate-400">Zero rate limits, unlimited quota enabled by default:</p>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs font-mono text-emerald-400 flex items-center justify-between backdrop-blur-md">
            <span>UNLIMITED_QUOTA</span>
            <span className="text-white font-semibold">999,999,999 / day</span>
          </div>
        </div>
      </div>

      {/* Code Implementations - Segmented Glass Container */}
      <div id="sdks" className="rounded-2xl border border-white/[0.08] bg-slate-900/35 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] overflow-hidden">
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02] gap-4">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-5 h-5 text-cyan-300" />
            <span className="text-sm font-bold text-white">Ready-to-Use Client Code</span>
          </div>

          {/* Liquid Segmented Control */}
          <div className="flex items-center bg-black/40 border border-white/[0.08] p-1 rounded-xl text-xs backdrop-blur-md">
            <button
              onClick={() => setActiveTab("pytgcalls")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "pytgcalls"
                  ? "bg-white/[0.15] text-white font-semibold border border-white/20 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Py-TgCalls (Telegram)
            </button>
            <button
              onClick={() => setActiveTab("python")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "python"
                  ? "bg-white/[0.15] text-white font-semibold border border-white/20 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Python (httpx)
            </button>
            <button
              onClick={() => setActiveTab("curl")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "curl"
                  ? "bg-white/[0.15] text-white font-semibold border border-white/20 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              cURL
            </button>
            <button
              onClick={() => setActiveTab("node")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "node"
                  ? "bg-white/[0.15] text-white font-semibold border border-white/20 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Node.js / TS
            </button>
          </div>
        </div>

        <div className="p-6 bg-black/50 font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto leading-relaxed relative">
          <button
            onClick={() => copyToClipboard(codeSnippets[activeTab], "tab-code")}
            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs text-slate-300 hover:text-white transition-colors z-10 backdrop-blur-md"
          >
            {copiedId === "tab-code" ? (
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

          <pre className="text-slate-200 leading-relaxed">
            {codeSnippets[activeTab]}
          </pre>
        </div>
      </div>

      {/* Endpoints Reference Header & Search Filter */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">API Endpoints Reference</h2>
            <p className="text-xs text-slate-400 mt-1">
              Live HTTP routes with parameter descriptions, interactive testing, and response samples
            </p>
          </div>

          {/* Quick Filter */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter endpoints..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:border-white/30 backdrop-blur-md"
            />
          </div>
        </div>

        {/* Quick Jump Bar */}
        <div className="flex flex-wrap gap-2 pt-1">
          {endpoints.map((ep) => (
            <a
              key={ep.id}
              href={`#${ep.id}`}
              className="px-3 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5 backdrop-blur-sm"
            >
              <span className={`text-[10px] font-bold ${ep.method === "GET" ? "text-emerald-400" : "text-sky-400"}`}>
                {ep.method}
              </span>
              <span>{ep.path}</span>
            </a>
          ))}
        </div>

        {/* Endpoints Cards */}
        <div className="grid gap-6">
          {filteredEndpoints.map((ep) => (
            <div
              key={ep.id}
              id={ep.id}
              className="rounded-2xl border border-white/[0.08] bg-slate-900/35 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] overflow-hidden"
            >
              {/* Endpoint Header */}
              <div className="p-6 border-b border-white/[0.08] bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                      ep.method === "GET"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wide">
                    {ep.path}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-400 font-medium">
                    {ep.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {ep.testUrl && (
                    <a
                      href={ep.testUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs text-slate-300 hover:text-white transition-colors backdrop-blur-md"
                    >
                      <Play className="w-3 h-3 text-emerald-400" />
                      <span>Test Live in Browser</span>
                    </a>
                  )}
                  <button
                    onClick={() => copyToClipboard(`${API_HOST}${ep.path}`, `copy-${ep.id}`)}
                    className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-400 hover:text-white transition-colors"
                    title="Copy Path"
                  >
                    {copiedId === `copy-${ep.id}` ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Endpoint Details */}
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">{ep.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{ep.desc}</p>
                </div>

                {/* Parameters Table */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Query & Body Parameters
                    </h4>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-black/30 backdrop-blur-md">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-white/[0.03] text-slate-400 border-b border-white/[0.08]">
                        <tr>
                          <th className="py-2.5 px-4 font-semibold">Field</th>
                          <th className="py-2.5 px-4 font-semibold">Type</th>
                          <th className="py-2.5 px-4 font-semibold">Required</th>
                          <th className="py-2.5 px-4 font-sans font-semibold">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {ep.params.map((p, pIdx) => (
                          <tr key={pIdx} className="hover:bg-white/[0.02] transition-colors">
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

                {/* Response Block */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Example Response
                    </h4>
                    <button
                      onClick={() => copyToClipboard(ep.response, `resp-${ep.id}`)}
                      className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-slate-400 hover:text-white transition-colors"
                    >
                      {copiedId === `resp-${ep.id}` ? (
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
                  <div className="p-4 rounded-xl bg-black/50 border border-white/[0.08] font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed backdrop-blur-md">
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
