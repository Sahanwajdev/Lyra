import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Lyra Cloud - Ultra-Fast Music Streaming & Song Download API",
  description: "High-performance song download and audio streaming API engineered for Telegram music bots and developers.",
};

const LAUDA_ART = `/*
========================================================================================

  _        _    _   _ _____            
 | |      / \\  | | | |  __ \\   /\\      
 | |     / _ \\ | | | | |  | | /  \\     
 | |    / ___ \\| |_| | |__| |/ /\\ \\    
 | |___/_/   \\_\\\\___/|_____//_/  \\_\\   

 ██╗      █████╗ ██╗   ██╗██████╗  █████╗ 
 ██║     ██╔══██╗██║   ██║██╔══██╗██╔══██╗
 ██║     ███████║██║   ██║██║  ██║███████║
 ██║     ██╔══██║██║   ██║██║  ██║██╔══██║
 ███████╗██║  ██║╚██████╔╝██████╔╝██║  ██║
 ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝

========================================================================================
*/`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head />
      <body className="min-h-screen flex flex-col bg-[#030712] text-slate-100 antialiased">
        <noscript id="lyra-banner">
          {LAUDA_ART}
        </noscript>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
