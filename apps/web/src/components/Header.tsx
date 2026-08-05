"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleOpen = () => {
      setOnboardingStep(0);
      setShowOnboarding(true);
    };
    window.addEventListener("open-onboarding", handleOpen);
    return () => window.removeEventListener("open-onboarding", handleOpen);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // We can synchronize time with localStorage countdown target if the user is on another page
  const [timeLeft, setTimeLeft] = useState<number>(86400);
  useEffect(() => {
    if (typeof window === "undefined" || !showOnboarding) return;
    
    const targetKey = "nest_airdrop_countdown_target";
    
    const getOrSetTarget = () => {
      let targetTime = localStorage.getItem(targetKey);
      if (!targetTime || parseInt(targetTime) <= Date.now()) {
        const newTarget = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem(targetKey, newTarget.toString());
        targetTime = newTarget.toString();
      }
      return parseInt(targetTime);
    };
    
    const calculateTimeLeft = () => {
      const target = getOrSetTarget();
      const now = Date.now();
      const difference = target - now;
      if (difference <= 0) return 0;
      return Math.floor(difference / 1000);
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [showOnboarding]);

  return (
    <>
      <header className="border-b border-black/10 bg-white/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Hoodfolk Logo"
              className="w-7 h-7 rounded-lg object-cover"
            />
            <span className="font-display font-bold text-xl tracking-tight text-black">
              Hoodfolk<span className="text-[#4C6B00]">.</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-black/50">
            <Link href="/" className="hover:text-black transition">Home</Link>
            <Link href="/docs" className="hover:text-black transition">Docs</Link>
            <button
              onClick={() => {
                setOnboardingStep(0);
                setShowOnboarding(true);
              }}
              className="hover:text-black transition uppercase font-mono text-xs tracking-widest focus:outline-none"
            >
              𝕏
            </button>
          </nav>
          <button
            onClick={() => {
              setOnboardingStep(0);
              setShowOnboarding(true);
            }}
            className="bg-[#CCFF00] hover:bg-[#DFFF3D] hover:shadow-[0_0_24px_rgba(140,179,0,0.35)] text-black font-semibold text-xs px-5 py-2.5 rounded-full transition-all duration-200 focus:outline-none"
          >
            Hatch yours →
          </button>
        </div>
      </header>

      {/* Onboarding Pop-up Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white border border-black/10 rounded-2xl max-w-md w-full shadow-2xl p-6 relative flex flex-col gap-4 border-glow animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button 
              onClick={() => setShowOnboarding(false)}
              className="absolute top-4 right-4 text-black/40 hover:text-black transition-colors focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Slide Content */}
            {onboardingStep === 0 && (
              <div className="text-center py-4 flex flex-col items-center gap-3">
                <div className="text-5xl animate-bounce">🥚</div>
                <h3 className="font-display font-extrabold text-2xl text-black">Hey Hoody! 👋</h3>
                <p className="text-black/60 text-sm leading-relaxed max-w-xs">
                  Wanna hatch some eggs to join the empire? Take a little tour around X and let&apos;s start.
                </p>
              </div>
            )}

            {onboardingStep === 1 && (
              <div className="text-center py-4 flex flex-col items-center gap-3">
                <div className="text-5xl animate-pulse">🐣</div>
                <h3 className="font-display font-extrabold text-2xl text-black">Step 1: Go to 𝕏</h3>
                <p className="text-black/60 text-sm leading-relaxed max-w-xs">
                  Click continue at the end of this guide to open our official Twitter profile <span className="font-bold text-[#4C6B00]">@HoodFolkTech</span>.
                </p>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="text-center py-4 flex flex-col items-center gap-3">
                <div className="text-5xl">⚡</div>
                <h3 className="font-display font-extrabold text-2xl text-black">Step 2: Crack Your Egg</h3>
                <p className="text-black/60 text-sm leading-relaxed max-w-xs">
                  Every time you tag <span className="font-bold text-[#4C6B00]">@hoodfolktech</span> on X, your egg cracks and your Hoodling starts growing!
                </p>
              </div>
            )}

            {onboardingStep === 3 && (
              <div className="text-center py-4 flex flex-col items-center gap-3">
                <div className="text-5xl">🍎</div>
                <h3 className="font-display font-extrabold text-2xl text-black">Step 3: Feed & Care</h3>
                <p className="text-black/60 text-sm leading-relaxed max-w-xs">
                  Feed or train your Hoodling on X using natural language! Try replying with: <br />
                  <span className="font-mono text-xs bg-black/5 px-2 py-1 rounded text-neutral-800 inline-block mt-2">
                    &quot;Feed my pet a strawberry&quot;
                  </span>
                </p>
              </div>
            )}

            {onboardingStep === 4 && (
              <div className="text-center py-4 flex flex-col items-center gap-3">
                <div className="text-5xl">🏆</div>
                <h3 className="font-display font-extrabold text-2xl text-black">Step 4: Claim Airdrop</h3>
                <p className="text-black/60 text-sm leading-relaxed max-w-xs">
                  Raise your pet to enter the Top 3 Leaderboard and claim your share of the <span className="font-bold text-[#4C6B00]">10,000 $NEST</span> reward pool!
                </p>
                <div className="font-mono text-sm text-[#4C6B00] font-bold mt-1">
                  Time Remaining: {formatTime(timeLeft)}
                </div>
              </div>
            )}

            {/* Navigation and Indicators */}
            <div className="flex flex-col gap-3 mt-2 border-t border-black/5 pt-4">
              <div className="flex justify-between items-center">
                {/* Back button or placeholder */}
                {onboardingStep > 0 ? (
                  <button 
                    onClick={() => setOnboardingStep(prev => prev - 1)}
                    className="text-xs font-semibold text-black/50 hover:text-black transition focus:outline-none"
                  >
                    ← Back
                  </button>
                ) : (
                  <div className="w-10" />
                )}

                {/* Progress Dots */}
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4].map((step) => (
                    <span 
                      key={step} 
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        step === onboardingStep ? "bg-[#CCFF00] w-4" : "bg-black/10"
                      }`}
                    />
                  ))}
                </div>

                {/* Skip / Next Button */}
                {onboardingStep < 4 ? (
                  <button 
                    onClick={() => setOnboardingStep(prev => prev + 1)}
                    className="text-xs font-bold text-[#4C6B00] hover:text-[#3B5400] transition focus:outline-none"
                  >
                    Next →
                  </button>
                ) : (
                  <div className="w-10" />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-1">
                {onboardingStep < 4 ? (
                  <>
                    <button 
                      onClick={() => setShowOnboarding(false)}
                      className="flex-1 bg-black/5 hover:bg-black/10 text-black font-semibold text-xs py-2.5 rounded-lg transition focus:outline-none"
                    >
                      Skip Guide
                    </button>
                    <button 
                      onClick={() => setOnboardingStep(prev => prev + 1)}
                      className="flex-1 bg-black text-white hover:bg-neutral-800 font-semibold text-xs py-2.5 rounded-lg transition focus:outline-none"
                    >
                      Next Step
                    </button>
                  </>
                ) : (
                  <a
                    href="https://x.com/HoodFolkTech"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowOnboarding(false)}
                    className="w-full text-center bg-[#CCFF00] hover:bg-[#DFFF3D] hover:shadow-[0_0_16px_rgba(140,179,0,0.3)] text-black font-bold text-xs py-3 rounded-lg transition-all duration-200"
                  >
                    Continue to 𝕏 →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
