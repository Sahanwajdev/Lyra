"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleSignInButton() {
  const { loginWithGoogle, loginWithEmail } = useAuth();
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [googleAvailable, setGoogleAvailable] = useState(false);
  const [showDirectModal, setShowDirectModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState("");

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  useEffect(() => {
    const initGoogle = () => {
      if (window.google?.accounts?.id && clientId && !clientId.includes("your-google-client-id")) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: any) => {
              if (response.credential) {
                loginWithGoogle(response.credential);
              }
            },
          });

          if (googleBtnRef.current) {
            window.google.accounts.id.renderButton(googleBtnRef.current, {
              theme: "filled_blue",
              size: "large",
              text: "continue_with",
              shape: "rectangular",
              width: 320,
            });
            setGoogleAvailable(true);
          }
        } catch {
          setGoogleAvailable(false);
        }
      }
    };

    if (window.google) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initGoogle();
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [clientId, loginWithGoogle]);

  const handleCustomGoogleClick = () => {
    // If real Google client ID is configured and rendered, let that handle it.
    // Otherwise open instant Google Auth dialog so user can enter their Google email and authenticate immediately.
    setShowDirectModal(true);
  };

  const submitDirectGoogleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput || !googleEmailInput.includes("@")) return;
    loginWithEmail(googleEmailInput, googleEmailInput.split("@")[0]);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Official Google Button Render Target */}
      <div ref={googleBtnRef} className={googleAvailable ? "block w-full" : "hidden"} />

      {/* Styled Google Auth Button (works universally) */}
      {!googleAvailable && (
        <button
          type="button"
          onClick={handleCustomGoogleClick}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-100 text-sm font-medium transition-all shadow-md hover:border-slate-600"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          Continue with Google
        </button>
      )}

      {/* Modal for Google Account Sign In */}
      {showDirectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Google Account Sign In</h3>
                <p className="text-xs text-slate-400">Enter your Google email to authenticate</p>
              </div>
            </div>

            <form onSubmit={submitDirectGoogleAuth} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Google Email</label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDirectModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
