import Link from "next/link";
import { Music2, Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/60 py-12 bg-slate-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2.5 font-bold text-lg">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
            <Music2 className="h-4 w-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Lyra Cloud API
          </span>
        </div>

        <p className="text-sm text-slate-400 flex items-center gap-1.5">
          Engineered for Telegram Music Bots with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
        </p>

        <div className="flex items-center gap-6 text-sm text-slate-400">
          <Link href="/docs" className="hover:text-cyan-400 transition-colors">
            Documentation
          </Link>
          <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
            Console
          </Link>
          <a
            href="https://github.com/Sahanwajdev/Lyra"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
