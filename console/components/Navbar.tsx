"use client";

import Link from "next/link";
import { Music2, Terminal, Sparkles, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md group-hover:scale-105 transition-all duration-200">
            <Music2 className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent font-extrabold tracking-tight">
            Lyra Cloud
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
            v1.0
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-sm text-slate-300 hover:text-white transition-colors duration-150 font-medium">
            Features
          </Link>
          <Link href="/docs" className="text-sm text-slate-300 hover:text-white transition-colors duration-150 font-medium flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            API Docs
          </Link>
          <Link href="/dashboard" className="text-sm text-slate-300 hover:text-white transition-colors duration-150 font-medium">
            Console
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 animate-fade-in">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-cyan-500/40 transition-all duration-200"
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
                className="hidden sm:inline-flex text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800/60 transition-colors duration-150"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
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
