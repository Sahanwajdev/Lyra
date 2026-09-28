"use client";

import Link from "next/link";
import { Music2, Terminal, Sparkles, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Music2 className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent font-extrabold tracking-tight">
            Lyra Cloud
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
            v1.0
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-sm text-slate-300 hover:text-white transition-colors font-medium">
            Features
          </Link>
          <Link href="/#pricing" className="text-sm text-slate-300 hover:text-white transition-colors font-medium">
            Pricing
          </Link>
          <Link href="/docs" className="text-sm text-slate-300 hover:text-white transition-colors font-medium flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            API Docs
          </Link>
          <Link href="/dashboard" className="text-sm text-slate-300 hover:text-white transition-colors font-medium">
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-cyan-500/40 transition-colors"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="max-w-[120px] truncate">{user.name}</span>
              </Link>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Get API Key
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
