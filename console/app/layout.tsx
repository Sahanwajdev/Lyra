import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Lyra Cloud - Ultra-Fast Music Streaming & Song Download API",
  description: "High-performance song download and audio streaming API engineered for Telegram music bots and developers.",
};

const LAUDA_BANNER = `<!--
========================================================================================

  _        _    _   _ _____            
 | |      / \  | | | |  __ \   /\      
 | |     / _ \ | | | | |  | | /  \     
 | |    / ___ \| |_| | |__| |/ /\ \    
 | |___/_/   \_\\___/|_____//_/  \_\   

 ██╗      █████╗ ██╗   ██╗██████╗  █████╗ 
 ██║     ██╔══██╗██║   ██║██╔══██╗██╔══██╗
 ██║     ███████║██║   ██║██║  ██║███████║
 ██║     ██╔══██║██║   ██║██║  ██║██╔══██║
 ███████╗██║  ██║╚██████╔╝██████╔╝██║  ██║
 ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝

========================================================================================
-->`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
        <script
          dangerouslySetInnerHTML={{
            __html: `/*
========================================================================================

  _        _    _   _ _____            
 | |      / \  | | | |  __ \   /\      
 | |     / _ \ | | | | |  | | /  \     
 | |    / ___ \| |_| | |__| |/ /\ \    
 | |___/_/   \_\\___/|_____//_/  \_\   

========================================================================================
*/`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#030712] text-slate-100 antialiased">
        <div dangerouslySetInnerHTML={{ __html: LAUDA_BANNER }} />
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
