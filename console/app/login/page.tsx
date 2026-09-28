"use client";

import { useState } from "react";
import Link from "next/link";
import { Music2, ArrowLeft, Mail, Lock, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginWithEmail } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    loginWithEmail(email);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <Link
        href="/"
        className="absolute top-6 left-6 sm:top-10 sm:left-10 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="glass-card rounded-2xl border border-slate-800 p-8 w-full max-w-md shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 mb-1">
            <Music2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Welcome Back</h1>
          <p className="text-xs text-slate-400">
            Sign in to manage your real API keys and view usage analytics
          </p>
        </div>

        {/* Google Auth Button */}
        <div className="space-y-4">
          <GoogleSignInButton />

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-[#0b1220] px-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">
              Or with Email
            </span>
          </div>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/20 transition-all"
          >
            Sign In to Console
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
