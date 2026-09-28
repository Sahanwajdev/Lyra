"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  Key,
  Code2,
  Radio,
  Bot,
  Copy,
  CheckCircle2,
  Music2,
  Terminal,
} from "lucide-react";

export default function Home() {
  const [copiedKey, setCopiedKey] = useState(false);
  const demoApiKey = "8fLyra1d4a";

  const handleCopy = () => {
    navigator.clipboard.writeText(demoApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="relative overflow-hidden animate-fade-in">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Ultra-Fast Song Download & Streaming API
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                Music Bot API <br />
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                  Engineered for Speed.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
                Stream YouTube and Spotify audio into Telegram voice chats in milliseconds. Zero IP bans, high-throughput caching, and 100% native compatibility with Py-TgCalls.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white font-semibold text-base shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Generate Real API Key
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/docs"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-slate-200 hover:text-white font-medium text-base hover:bg-slate-800/80 transition-all duration-200"
                >
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  View Bot Guide
                </Link>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg">
                <div>
                  <div className="text-2xl font-bold text-white">&lt; 15ms</div>
                  <div className="text-xs text-slate-400 font-medium">Cached Latency</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">99.99%</div>
                  <div className="text-xs text-slate-400 font-medium">Uptime SLA</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">Py-TgCalls</div>
                  <div className="text-xs text-slate-400 font-medium">Native Support</div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Terminal & API Demo Card */}
            <div className="lg:col-span-5">
              <div className="glass-card rounded-2xl p-6 shadow-xl relative border border-slate-800 hover:border-cyan-500/40">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="text-xs font-mono text-slate-400 ml-2">Lyra API Console</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    STATUS: 200 OK
                  </span>
                </div>

                {/* API Key Box */}
                <div className="mt-5 space-y-3">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-cyan-400" />
                      Live API Key
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">UNLIMITED MODE</span>
                  </label>
                  <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800 rounded-xl p-3 font-mono text-xs">
                    <span className="text-cyan-300 truncate">{demoApiKey}</span>
                    <button
                      onClick={handleCopy}
                      className="ml-2 p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
                      title="Copy API Key"
                    >
                      {copiedKey ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Stream Simulator */}
                <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                      <Radio className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-white truncate">Starboy - The Weeknd</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <span>03:50</span>
                        <span>•</span>
                        <span className="text-cyan-400">128 kbps m4a</span>
                      </div>
                    </div>
                  </div>

                  {/* Audio Waveform visualization */}
                  <div className="flex items-center justify-between gap-1 h-6 pt-1">
                    {[40, 70, 90, 50, 80, 100, 60, 45, 95, 75, 85, 60, 90, 40, 70, 80, 50, 95, 65, 80].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-full opacity-80"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/60">
                    <span>Response Latency:</span>
                    <span className="text-emerald-400 font-bold">11.8 ms</span>
                  </div>
                </div>

                {/* Daily Usage Indicator */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Daily Request Quota</span>
                    <span className="font-mono text-cyan-400">Unlimited / No Limits</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>

                <div className="mt-5">
                  <Link
                    href="/dashboard"
                    className="w-full inline-flex items-center justify-center py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold tracking-wide transition-all"
                  >
                    Open Developer Console & Generate Key
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-slate-800/60 bg-slate-950/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Telegram Bot Creators Choose Lyra
            </h2>
            <p className="mt-4 text-slate-400 text-lg">
              Designed from the ground up to solve YouTube 429 rate limits, slow extraction, and server memory exhaustion.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card rounded-2xl p-8 border border-slate-800 transition-all hover:border-cyan-500/40 hover:-translate-y-1">
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-fit mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Sub-50ms Response</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Direct InnerTube API protocol integration skips heavy browser rendering. Cached audio streams resolve in single-digit milliseconds.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 border border-slate-800 transition-all hover:border-sky-500/40 hover:-translate-y-1">
              <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 w-fit mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Zero 429 IP Bans</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Stop getting your VPS banned by YouTube. Lyra routes stream requests with automatic session management and proxy failovers.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 border border-slate-800 transition-all hover:border-blue-500/40 hover:-translate-y-1">
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 w-fit mb-6">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Native Py-TgCalls Ready</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Outputs clean audio stream URLs that feed directly into <code className="text-cyan-400 font-mono">AudioPiped(stream_url)</code> without CPU-heavy local ffmpeg transcoding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Integration Preview */}
      <section className="py-20 border-t border-slate-800/60 bg-slate-950/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white">
              Instant Py-TgCalls Integration
            </h2>
            <p className="mt-3 text-slate-400 text-sm">
              Replace slow local yt-dlp calls in your bot with 3 lines of code:
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#090d16] p-6 shadow-xl font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
            <pre>
              {`import httpx
from pytgcalls import PyTgCalls
from pytgcalls.types import AudioPiped

LYRA_API_URL = "https://api.shnwaz.dev/api/v1/stream"
LYRA_API_KEY = "8fLyra1d4a"

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
    print(f"Now Playing: {stream_data['title']} (Latency: {stream_data['latency_ms']}ms)")`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
