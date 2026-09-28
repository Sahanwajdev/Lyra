"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Key,
  Copy,
  CheckCircle2,
  Play,
  Search,
  Sparkles,
  Activity,
  Clock,
  Zap,
  LogIn,
  RefreshCw,
  Radio,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import GoogleSignInButton from "@/components/GoogleSignInButton";

interface ApiKeyItem {
  id: number;
  key: string;
  user_email: string;
  user_name: string;
  plan: string;
  daily_requests_limit: number;
  daily_video_limit: number;
  created_at: string;
  expires_at: string;
  is_active: number | boolean;
  requests_today?: number;
  video_requests_today?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();

  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [activeKey, setActiveKey] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Key creation state
  const [keyName, setKeyName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");

  // Live Playground State
  const [testQuery, setTestQuery] = useState("Ed Sheeran Shape of You");
  const [testEndpoint, setTestEndpoint] = useState<"stream" | "search" | "info">("stream");
  const [testResult, setTestResult] = useState<any>(null);
  const [testLatency, setTestLatency] = useState<number | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Load real keys from SQLite database for the logged-in user
  const fetchUserKeys = async (email: string) => {
    setLoadingKeys(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/keys/user?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        const userKeys: ApiKeyItem[] = data.keys || [];
        setKeys(userKeys);
        if (userKeys.length > 0 && !activeKey) {
          setActiveKey(userKeys[0].key);
        }
      }
    } catch {
      // Backend error handler
    } finally {
      setLoadingKeys(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchUserKeys(user.email);
    }
  }, [user]);

  const handleCopy = (keyStr: string) => {
    navigator.clipboard.writeText(keyStr);
    setCopiedKey(keyStr);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    setIsGenerating(true);
    setGenerateError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/keys/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: keyName.trim() || `${user.name}'s Bot Key`,
          plan: "unlimited",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to generate key");
      }

      const newKeyData = await res.json();
      const createdItem: ApiKeyItem = {
        id: Date.now(),
        key: newKeyData.key,
        user_email: newKeyData.user_email,
        user_name: newKeyData.user_name,
        plan: newKeyData.plan,
        daily_requests_limit: newKeyData.daily_requests_limit,
        daily_video_limit: newKeyData.daily_video_limit,
        created_at: new Date().toISOString(),
        expires_at: newKeyData.expires_at,
        is_active: true,
        requests_today: 0,
        video_requests_today: 0,
      };

      setKeys((prev) => [createdItem, ...prev]);
      setActiveKey(newKeyData.key);
      setKeyName("");
    } catch (err: any) {
      setGenerateError(err.message || "Failed to communicate with API server");
    } finally {
      setIsGenerating(false);
    }
  };

  const runApiTest = async () => {
    if (!testQuery) return;
    setIsTesting(true);
    setTestResult(null);
    const keyToUse = activeKey || (keys.length > 0 ? keys[0].key : "lyra_live_unlimited_access");
    const startTime = performance.now();

    try {
      const targetUrl =
        testEndpoint === "search"
          ? `${API_BASE_URL}/api/v1/search?query=${encodeURIComponent(testQuery)}&api_key=${keyToUse}`
          : testEndpoint === "stream"
          ? `${API_BASE_URL}/api/v1/stream?id=${encodeURIComponent(testQuery)}&api_key=${keyToUse}`
          : `${API_BASE_URL}/api/v1/info?id=${encodeURIComponent(testQuery)}&api_key=${keyToUse}`;

      const res = await fetch(targetUrl);
      const data = await res.json();
      const latency = Math.round(performance.now() - startTime);
      setTestLatency(latency);
      setTestResult(data);
    } catch (err: any) {
      setTestResult({
        status: "error",
        message: "Failed to connect to API server at " + API_BASE_URL,
      });
    } finally {
      setIsTesting(false);
    }
  };

  // If user is not logged in, show clear authentication prompt
  if (!authLoading && !user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-8 max-w-md w-full border border-slate-800 text-center space-y-6 shadow-2xl">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-fit mx-auto">
            <LogIn className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Sign In Required</h1>
            <p className="text-slate-400 text-sm">
              Please sign in with your Google or developer account to generate your personal API keys and view real-time metrics.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <GoogleSignInButton />
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Sign In with Email
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedKeyObj = keys.find((k) => k.key === activeKey) || keys[0] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Developer Console
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Logged in as <span className="text-cyan-400 font-semibold">{user?.email}</span> • Real database records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Lyra Engine: UNLIMITED (LIVE)
          </div>
        </div>
      </div>

      {/* Top Grid: Generate Key & Active Plan */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Generate API Key Card */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Generate Real API Key</h2>
              <p className="text-[11px] text-slate-400">Format: <code className="text-cyan-400 font-mono">8fLyra1d4a</code></p>
            </div>
          </div>

          <form onSubmit={handleGenerateKey} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Key Label / Bot Name
              </label>
              <input
                type="text"
                placeholder="e.g. My Telegram Music Bot"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Owner Account
              </label>
              <input
                type="text"
                disabled
                value={user?.email || ""}
                className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-400 cursor-not-allowed font-mono text-xs"
              />
            </div>

            {generateError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {generateError}
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? "Generating Key..." : "Generate API Key"}
            </button>
          </form>
        </div>

        {/* Real Active Plan & Usage Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">Active Plan & Usage</h2>
              </div>
              <span className="text-xs uppercase font-mono px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                {selectedKeyObj ? selectedKeyObj.plan.toUpperCase() : "UNLIMITED"} TIER
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-xs text-slate-400">Daily Requests Used</div>
                <div className="text-2xl font-black text-white mt-1">
                  {selectedKeyObj ? (selectedKeyObj.requests_today || 0) : 0}
                  <span className="text-xs font-normal text-slate-400 ml-1">/ Unlimited</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-xs text-slate-400">Active Keys Count</div>
                <div className="text-2xl font-black text-cyan-400 mt-1">
                  {keys.length} {keys.length === 1 ? "Key" : "Keys"}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-xs text-slate-400">Plan Validity</div>
                <div className="text-2xl font-black text-emerald-400 mt-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  365 Days
                </div>
              </div>
            </div>

            {/* Quota Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Daily Limit Rate Limits</span>
                <span className="font-mono text-emerald-400 font-semibold">100% UNRESTRICTED</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500 rounded-full"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real API Keys List (NO REWORK BUTTON) */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            Your Real API Keys ({keys.length})
          </h2>
          <button
            onClick={() => user?.email && fetchUserKeys(user.email)}
            disabled={loadingKeys}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-900 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingKeys ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {keys.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Key className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-white">No API Keys Generated Yet</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven&apos;t generated any keys yet for <span className="text-cyan-400">{user?.email}</span>. Use the form above to generate your first random key in <code className="text-cyan-400 font-mono">8fLyra1d4a</code> format.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Label</th>
                  <th className="py-3 px-4">API Key</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Requests Today</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Selection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {keys.map((k) => (
                  <tr key={k.key} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-medium text-white">
                      {k.user_name}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 font-mono text-cyan-300 font-semibold text-sm">
                        <span>{k.key}</span>
                        <button
                          onClick={() => handleCopy(k.key)}
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                          title="Copy API Key"
                        >
                          {copiedKey === k.key ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase text-[10px]">
                        {k.plan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {k.requests_today || 0} reqs
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-sans font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        ACTIVE
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveKey(k.key)}
                        className={`px-3 py-1 rounded-lg text-xs font-sans font-semibold transition-all ${
                          activeKey === k.key
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {activeKey === k.key ? "Selected" : "Use in Test"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Live Real-Time API Tester */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Live API Tester (Real YouTube Data)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Testing using real API key: <span className="font-mono text-cyan-400">{activeKey || "default"}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(["stream", "search", "info"] as const).map((ep) => (
              <button
                key={ep}
                onClick={() => setTestEndpoint(ep)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  testEndpoint === ep
                    ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/25"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                /api/v1/{ep}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Song title, artist, or YouTube URL"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={runApiTest}
            disabled={isTesting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
            Execute Request
          </button>
        </div>

        {/* Live Result Box */}
        {testResult && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Live Backend Response</span>
              {testLatency !== null && (
                <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Latency: {testLatency} ms
                </span>
              )}
            </div>

            {testResult.stream_url && (
              <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                    <Radio className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white truncate">{testResult.title}</div>
                    <div className="text-xs text-slate-400">
                      Duration: {testResult.duration} • Bitrate: {testResult.bitrate} kbps
                    </div>
                  </div>
                </div>

                <a
                  href={testResult.stream_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 text-xs font-semibold shrink-0"
                >
                  Play Raw Stream ↗
                </a>
              </div>
            )}

            <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-80 overflow-y-auto">
              <pre>{JSON.stringify(testResult, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
