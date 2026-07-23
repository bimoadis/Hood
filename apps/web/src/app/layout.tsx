import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hoodnest — Your pixel companion, running on chain",
  description: "An immersive virtual pet and RPG simulation set in the medieval Robin Hood universe, raised in public on X.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/service-worker.js').then(function(reg) {
                    console.log('ServiceWorker registration successful');
                  }).catch(function(err) {
                    console.warn('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className="grain min-h-screen antialiased flex flex-col">
        {/* Ticker marquee header */}
        <div className="ticker-wrap">
          <div className="ticker">
            <span>HOODCHI DESK <span className="tk-up">▲ SYSTEMS NORMAL</span></span>
            <span>SPECIES CATALOG <span className="tk-up">▲ 100+</span></span>
            <span>MINT PRICE <span className="tk-up">▲ $0.00</span></span>
            <span>FEED COOLDOWN <span className="tk-down">▼ 60:00</span></span>
            <span>NETWORK <span className="tk-up">▲ 𝕏 · LIVE</span></span>
            <span>HOODCHI DESK <span className="tk-up">▲ SYSTEMS NORMAL</span></span>
            <span>SPECIES CATALOG <span className="tk-up">▲ 100+</span></span>
            <span>MINT PRICE <span className="tk-up">▲ $0.00</span></span>
            <span>FEED COOLDOWN <span className="tk-down">▼ 60:00</span></span>
            <span>NETWORK <span className="tk-up">▲ 𝕏 · LIVE</span></span>
          </div>
        </div>

        {/* Global Navigation Header */}
        <header className="border-b border-black/10 bg-white/85 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Hoodnest Logo"
                className="w-7 h-7 rounded-lg object-cover"
              />
              <span className="font-display font-bold text-xl tracking-tight text-black">Hoodnest<span className="text-[#4C6B00]">.</span></span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-black/50">
              <Link href="/" className="hover:text-black transition">Home</Link>
              <Link href="/docs" className="hover:text-black transition">Docs</Link>
              <a href="https://x.com/HoodNestfun" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">𝕏</a>
            </nav>
            <a href="https://x.com/HoodNestfun" target="_blank" rel="noopener noreferrer" className="bg-[#CCFF00] hover:bg-[#DFFF3D] hover:shadow-[0_0_24px_rgba(140,179,0,0.35)] text-black font-semibold text-xs px-5 py-2.5 rounded-full transition-all duration-200">Hatch yours →</a>
          </div>
        </header>

        {children}

        {/* Footer */}
        <footer className="border-t border-black/10 mt-auto bg-[#FAFAF7]">
          <div className="max-w-6xl mx-auto px-6 py-10 font-mono text-[11px] text-black/40 flex flex-wrap justify-between gap-4">
            <div>© 2026 Hoodnest · a trading terminal for tiny lives</div>
            <div className="flex items-center gap-2">
              <span className="live-dot"></span>
              <span>Systems <span className="text-[#4C6B00]">▲ Normal</span></span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
