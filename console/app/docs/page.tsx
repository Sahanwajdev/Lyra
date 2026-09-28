"use client";

import { useState } from "react";
import { Terminal, Copy, CheckCircle2, Bot, Code2, ShieldAlert, Cpu } from "lucide-react";

export default function DocsPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const codeSnippets = [
    {
      title: "1. Python (Py-TgCalls Telegram Music Bot)",
      language: "python",
      code: `import httpx
from pyrogram import Client, filters
from pytgcalls import PyTgCalls
from pytgcalls.types import AudioPiped

app = Client("my_music_bot", api_id=12345, api_hash="your_hash", bot_token="your_bot_token")
call_py = PyTgCalls(app)

LYRA_API_URL = "http://localhost:8000/api/v1/stream"
LYRA_KEY = "your_lyra_api_key_here"

@app.on_message(filters.command("play") & filters.group)
async def play_handler(_, message):
    query = " ".join(message.command[1:])
    if not query:
        return await message.reply_text("Please provide a song name or YouTube link.")

    status_msg = await message.reply_text("⚡ Fetching stream via Lyra API...")

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            LYRA_API_URL,
            params={"id": query, "api_key": LYRA_KEY}
        )
        data = resp.json()

    if data.get("status") != "success":
        return await status_msg.edit_text("❌ Failed to resolve music stream.")

    stream_url = data["stream_url"]
    song_title = data["title"]
    duration = data["duration"]

    # Stream directly into Telegram Voice Chat
    await call_py.join_group_call(
        message.chat.id,
        AudioPiped(stream_url)
    )

    await status_msg.edit_text(
        f"▶️ **Now Playing:** {song_title}\\n⏱ **Duration:** {duration}\\n⚡ **Latency:** {data['latency_ms']}ms"
    )`,
    },
    {
      title: "2. cURL (Direct Audio Stream)",
      language: "bash",
      code: `# Fetch stream URL JSON
curl -X GET "http://localhost:8000/api/v1/stream?id=Starboy+The+Weeknd&api_key=your_lyra_key"

# Download audio file (.m4a)
curl -O -J -X GET "http://localhost:8000/api/v1/download?id=Starboy+The+Weeknd&api_key=your_lyra_key"`,
    },
    {
      title: "3. Node.js / TypeScript",
      language: "typescript",
      code: `import axios from "axios";

async function getStream(songQuery: string, apiKey: string) {
  const response = await axios.get("http://localhost:8000/api/v1/stream", {
    params: {
      id: songQuery,
      api_key: apiKey
    }
  });

  console.log("Track:", response.data.title);
  console.log("Stream URL:", response.data.stream_url);
  console.log("Latency:", response.data.latency_ms + "ms");
  return response.data;
}`,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-3 border border-cyan-500/20">
          <Terminal className="w-3.5 h-3.5" />
          API REFERENCE v1.0
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Lyra API Documentation
        </h1>
        <p className="text-slate-400 text-base mt-2">
          Everything you need to integrate ultra-fast audio streaming into Telegram bots, web apps, and Discord bots.
        </p>
      </div>

      {/* Base URL & Auth */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          Authentication & Base URL
        </h2>
        <p className="text-slate-300 text-sm">
          All endpoints accept your API Key either as a query parameter or an HTTP header:
        </p>

        <div className="space-y-2 font-mono text-xs">
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Base URL:</span>
            <span className="text-cyan-400 font-bold">http://localhost:8000/api/v1</span>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Query Parameter:</span>
            <span className="text-cyan-300 font-bold">?api_key=your_key</span>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">HTTP Header:</span>
            <span className="text-cyan-300 font-bold">x-api-key: your_key</span>
          </div>
        </div>
      </div>

      {/* Endpoints Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white">Endpoint Reference</h2>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase">
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Endpoint</th>
                <th className="py-2.5 px-3 font-sans">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-3 px-3 text-emerald-400 font-bold">GET</td>
                <td className="py-3 px-3 text-cyan-300">/search</td>
                <td className="py-3 px-3 font-sans text-slate-300">Fast music search by query or Spotify link.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-emerald-400 font-bold">GET</td>
                <td className="py-3 px-3 text-cyan-300">/stream</td>
                <td className="py-3 px-3 font-sans text-slate-300">Resolves direct audio stream URL for Py-TgCalls.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-emerald-400 font-bold">GET</td>
                <td className="py-3 px-3 text-cyan-300">/stream/raw</td>
                <td className="py-3 px-3 font-sans text-slate-300">Direct chunked audio streaming pipe.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-emerald-400 font-bold">GET</td>
                <td className="py-3 px-3 text-cyan-300">/download</td>
                <td className="py-3 px-3 font-sans text-slate-300">Streams audio file with download attachment header.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-emerald-400 font-bold">GET</td>
                <td className="py-3 px-3 text-cyan-300">/info</td>
                <td className="py-3 px-3 font-sans text-slate-300">Fetches song duration, thumbnail, and metadata.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-sky-400 font-bold">POST</td>
                <td className="py-3 px-3 text-cyan-300">/keys/generate</td>
                <td className="py-3 px-3 font-sans text-slate-300">Creates a new API key with plan quota.</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-emerald-400 font-bold">GET</td>
                <td className="py-3 px-3 text-cyan-300">/keys/usage</td>
                <td className="py-3 px-3 font-sans text-slate-300">Checks key validity, requests left, and expiry.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Snippets */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-cyan-400" />
          Integration Code Examples
        </h2>

        {codeSnippets.map((snippet, idx) => (
          <div key={idx} className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/60">
              <span className="text-xs font-semibold text-white">{snippet.title}</span>
              <button
                onClick={() => copyCode(snippet.code, idx)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
              >
                {copiedIndex === idx ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-5 bg-[#090d16] font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
              <pre>{snippet.code}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
