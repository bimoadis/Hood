import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hoodfolk — Your pixel companion, running on Robinhood Chain",
  description: "An immersive virtual pet and RPG simulation set in the medieval Robin Hood universe, launched on pump.fun, raised in public on X.",
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
            <span>HOODFOLK DESK <span className="tk-up">▲ SYSTEMS NORMAL</span></span>
            <span>CHAIN <span className="tk-up">▲ ROBINHOOD</span></span>
            <span>LAUNCH <span className="tk-up">▲ PUMP.FUN</span></span>
            <span>MINT PRICE <span className="tk-up">▲ $0.00</span></span>
            <span>FEED COOLDOWN <span className="tk-down">▼ 60:00</span></span>
            <span>NETWORK <span className="tk-up">▲ 𝕏 · LIVE</span></span>
            <span>HOODFOLK DESK <span className="tk-up">▲ SYSTEMS NORMAL</span></span>
            <span>CHAIN <span className="tk-up">▲ ROBINHOOD</span></span>
            <span>LAUNCH <span className="tk-up">▲ PUMP.FUN</span></span>
            <span>FEED COOLDOWN <span className="tk-down">▼ 60:00</span></span>
            <span>NETWORK <span className="tk-up">▲ 𝕏 · LIVE</span></span>
          </div>
        </div>

        {/* Global Navigation Header */}
        <Header />

        {children}

        {/* Footer */}
        <footer className="border-t border-black/10 mt-auto bg-[#FAFAF7]">
          <div className="max-w-6xl mx-auto px-6 py-10 font-mono text-[11px] text-black/40 flex flex-wrap justify-between gap-4">
            <div>© 2026 Hoodfolk · a trading terminal for tiny lives</div>
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
