"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PixelPetRenderer from "@/components/PixelPetRenderer";
import CompanionCard from "@/components/CompanionCard";

interface Companion {
  name: string;
  species: string;
  level: number;
  evolutionLvl: number;
  xp: number;
  health: number;
  energy: number;
  hunger: number;
  happiness: number;
  friendship: number;
  strength: number;
  mood: string;
}

interface UserCompanion {
  user: {
    email: string;
    name: string;
  };
  companion: Companion | null;
}

interface CardData {
  id: string;
  cardType: "Hatching card" | "Meal card" | "Status card" | "Adventure card";
  cardNumber: string;
  companionName: string;
  species: string;
  evolutionLvl: number;
  title: string;
  description: string;
  bottomLeft: string;
  bottomRight: string;
}

export default function Home() {
  const [email, setEmail] = useState("mock_user@x.com");
  const [tempEmail, setTempEmail] = useState("mock_user@x.com");
  const [userCompanion, setUserCompanion] = useState<UserCompanion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestCards, setLatestCards] = useState<CardData[]>([]);

  const fetchCompanionData = async (targetEmail: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/companion/user/${targetEmail}`);
      if (!response.ok) {
        throw new Error("User or companion data not found on API");
      }
      const data = await response.json() as UserCompanion;
      setUserCompanion(data);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to fetch";
      console.warn("Failed to fetch from backend API. Using local mock fallback.", errMsg);
      setError(errMsg);
      // Fallback to static mock representation
      setUserCompanion({
        user: { email: targetEmail, name: targetEmail.split("@")[0] },
        companion: {
          name: "Robin Fox",
          species: "Fox",
          level: 1,
          evolutionLvl: 1,
          xp: 45,
          health: 100,
          energy: 90,
          hunger: 15,
          happiness: 65,
          friendship: 12,
          strength: 10,
          mood: "Happy"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanionData(email);
  }, [email]);

  useEffect(() => {
    const fetchLatestCards = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/companion/latest");
        if (response.ok) {
          const data = await response.json() as CardData[];
          setLatestCards(data);
        }
      } catch (err) {
        console.warn("Failed to fetch latest cards from database. Using static fallbacks.", err);
      }
    };
    fetchLatestCards();
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempEmail.trim()) {
      setEmail(tempEmail);
    }
  };

  const handleHatchMock = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/companion/hatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        fetchCompanionData(email);
        // Refresh latest cards section too
        const latestResponse = await fetch("http://localhost:3001/api/companion/latest");
        if (latestResponse.ok) {
          const data = await latestResponse.json() as CardData[];
          setLatestCards(data);
        }
      }
    } catch {
      alert("Hatch backend endpoint not reachable. Simulated hatching locally!");
      setUserCompanion({
        user: { email, name: email.split("@")[0] },
        companion: {
          name: "Hatched Robin",
          species: "Fox",
          level: 1,
          evolutionLvl: 1,
          xp: 0,
          health: 100,
          energy: 100,
          hunger: 0,
          happiness: 50,
          friendship: 0,
          strength: 10,
          mood: "Happy"
        }
      });
    }
  };

  const activeCompanion = userCompanion?.companion;

  return (
    <main className="relative z-10 font-sans min-h-screen">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-12 items-start">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-black/40 flex items-center gap-2 mb-5">
            <span className="live-dot"></span> Live on 𝕏 · systems normal
          </span>
          <h1 className="font-display font-bold text-5xl lg:text-6xl leading-[1.02] tracking-tight mb-5 text-black">
            Your companion,<br />
            <span className="text-[#4C6B00]">running on chain.</span>
          </h1>
          <p className="text-black/60 text-lg max-w-md mb-8 leading-relaxed">
            Hoodlings is the forest virtual pet platform on X — hatch a companion in Sherwood forest today, and train it to be a legendary Robin Hood protector using custom Pixel Art composites.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <a
              href="https://x.com/Hoodchi_rh"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#CCFF00] hover:bg-[#DFFF3D] hover:shadow-[0_0_24px_rgba(140,179,0,0.35)] text-black font-semibold text-sm px-7 py-3 rounded-full transition-all duration-200"
            >
              Hatch on 𝕏 →
            </a>
            <Link
              href="/docs"
              className="bg-transparent border border-black/20 hover:border-[#4C6B00] hover:text-[#4C6B00] text-black font-semibold text-sm px-7 py-3 rounded-full transition-all duration-200 flex items-center"
            >
              Read the docs
            </Link>
          </div>

          {/* User selector input */}
          <div className="bg-white border border-black/10 rounded-xl p-5 max-w-md border-glow">
            <h3 className="font-display font-bold text-sm text-black mb-3">Lookup User Dashboard</h3>
            <form onSubmit={handleEmailSubmit} className="flex gap-2">
              <input
                type="email"
                placeholder="user@x.com"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-black/10 rounded-lg text-sm bg-transparent focus:outline-none focus:border-[#4C6B00] text-black"
              />
              <button type="submit" className="bg-black hover:bg-neutral-800 text-white text-xs px-4 py-2 rounded-lg font-semibold transition">
                Load
              </button>
            </form>
          </div>
        </div>

        {/* Dynamic Stacking Card representation */}
        <div className="bg-white border border-black/10 rounded-xl p-5 border-glow shadow-sm max-w-md w-full justify-self-center md:justify-self-end flex flex-col gap-3 relative">
          
          {/* User email in the top right corner of the card */}
          <div className="font-mono text-[10px] uppercase tracking-widest text-black/40 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>Hatching card</span>
              {loading && <span className="text-[9px] animate-pulse text-black/40">fetching...</span>}
              {error && <span className="text-[9px] text-red-500">offline</span>}
            </div>
            <span className="bg-[#4C6B00]/10 text-[#4C6B00] px-2 py-0.5 rounded text-[9px] font-bold lowercase tracking-normal">
              {email}
            </span>
          </div>

          {activeCompanion ? (
            <>
              {/* Stacking Pixel Art composite view */}
              <PixelPetRenderer
                companionName={activeCompanion.name}
                species={activeCompanion.species}
                evolutionLvl={activeCompanion.evolutionLvl}
                className="w-full h-48"
              />

              {/* Companion Stats Grid below the image */}
              <div className="border-t border-black/5 pt-3 mt-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-display font-bold text-lg text-black">
                    {activeCompanion.name} <span className="text-xs text-black/50 font-normal">({activeCompanion.species})</span>
                  </h3>
                  <span className="border border-[#4C6B00]/30 bg-[#4C6B00]/10 text-[#4C6B00] px-2.5 py-0.5 text-[10px] font-mono rounded-full uppercase tracking-wider">
                    Level {activeCompanion.level}
                  </span>
                </div>
                <p className="font-mono text-[10px] text-black/40 mb-3">
                  Evolution Stage {activeCompanion.evolutionLvl} · EXP: {activeCompanion.xp}
                </p>

                {/* Vitals */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono text-black/70">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-black/40">❤️ Health</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-black/5 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-red-500 h-full" style={{ width: `${activeCompanion.health}%` }}></div>
                      </div>
                      <span className="text-[10px]">{activeCompanion.health}/100</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] text-black/40">⚡ Energy</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-black/5 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-yellow-500 h-full" style={{ width: `${activeCompanion.energy}%` }}></div>
                      </div>
                      <span className="text-[10px]">{activeCompanion.energy}/100</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] text-black/40">🍖 Hunger</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-black/5 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-orange-500 h-full" style={{ width: `${activeCompanion.hunger}%` }}></div>
                      </div>
                      <span className="text-[10px]">{activeCompanion.hunger}/100</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] text-black/40">😊 Happiness</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-black/5 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-green-500 h-full" style={{ width: `${activeCompanion.happiness}%` }}></div>
                      </div>
                      <span className="text-[10px]">{activeCompanion.happiness}/100</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono text-black/70 mt-3 pt-3 border-t border-black/5">
                  <div className="flex justify-between">
                    <span className="text-black/40 text-[10px]">🤝 Friendship</span>
                    <span className="font-bold">{activeCompanion.friendship}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/40 text-[10px]">⚔️ Strength</span>
                    <span className="font-bold">{activeCompanion.strength || 10}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <span className="text-3xl">🥚</span>
              <p className="text-sm font-semibold text-black/70 mt-3">No companion hatched yet for this user.</p>
              <button
                onClick={handleHatchMock}
                className="mt-4 bg-[#CCFF00] hover:bg-[#DFFF3D] text-black font-semibold text-xs px-4 py-2 rounded-lg transition"
              >
                Hatch Mock Companion
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-black/10">
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-black/40">001 · The desk</span>
          <h2 className="font-display font-bold text-3xl mt-2 max-w-xl text-black">A living Pixel companion, raised in public on 𝕏.</h2>
          <p className="text-black/60 max-w-2xl mt-3 leading-relaxed">Tag the desk in any post and the autonomous agent takes over — reads your words, crafts a visual card, and orchestrates encounters between your companion and others. No downloads, no accounts, no friction.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white border border-black/10 rounded-xl p-5 border-glow">
            <div className="font-mono text-[#4C6B00] text-lg mb-2">◆</div>
            <div className="font-display font-bold mb-1 text-black">One exclusive companion</div>
            <p className="text-black/60 text-sm leading-relaxed">Each 𝕏 account gets exactly one Hoodling. Keeps every bond personal.</p>
          </div>
          <div className="bg-white border border-black/10 rounded-xl p-5 border-glow">
            <div className="font-mono text-[#4C6B00] text-lg mb-2">▲</div>
            <div className="font-display font-bold mb-1 text-black">Talk however you talk</div>
            <p className="text-black/60 text-sm leading-relaxed">No rigid syntax. The AI reads intent from ordinary natural language.</p>
          </div>
          <div className="bg-white border border-black/10 rounded-xl p-5 border-glow">
            <div className="font-mono text-[#4C6B00] text-lg mb-2">✦</div>
            <div className="font-display font-bold mb-1 text-black">Feed it anything</div>
            <p className="text-black/60 text-sm leading-relaxed">Antimatter smoothies included. The AI rolls with whatever you offer.</p>
          </div>
          <div className="bg-white border border-black/10 rounded-xl p-5 border-glow">
            <div className="font-mono text-[#4C6B00] text-lg mb-2">↻</div>
            <div className="font-display font-bold mb-1 text-black">Autonomous encounters</div>
            <p className="text-black/60 text-sm leading-relaxed">Companions meet and interact with each other on their own.</p>
          </div>
          <div className="bg-white border border-black/10 rounded-xl p-5 border-glow">
            <div className="font-mono text-[#4C6B00] text-lg mb-2">▣</div>
            <div className="font-display font-bold mb-1 text-black">A card, every time</div>
            <p className="text-black/60 text-sm leading-relaxed">Every reply ships with a hand-rendered, screenshot-worthy card.</p>
          </div>
          <div className="bg-white border border-black/10 rounded-xl p-5 border-glow">
            <div className="font-mono text-[#4C6B00] text-lg mb-2">$</div>
            <div className="font-display font-bold mb-1 text-black">Completely free</div>
            <p className="text-black/60 text-sm leading-relaxed">No hidden tiers, no premium, no sign-up walls.</p>
          </div>
        </div>
      </section>

      {/* 002 CARDS */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-black/10" id="cards">
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-black/40">002 · Cards</span>
          <h2 className="font-display font-bold text-3xl mt-2 max-w-xl text-black">Hand-rendered snapshots.</h2>
          <p className="text-black/60 max-w-2xl mt-3 leading-relaxed">
            Every reply ships as a card. Built to sit perfectly on daylight surfaces with rounded corners and a premium reactive border glow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {latestCards.length > 0 ? (
            latestCards.map((card) => (
              <CompanionCard
                key={card.id}
                cardType={card.cardType}
                cardNumber={card.cardNumber}
                companionName={card.companionName}
                species={card.species}
                evolutionLvl={card.evolutionLvl}
                title={card.title}
                description={card.description}
                bottomLeft={card.bottomLeft}
                bottomRight={card.bottomRight}
              />
            ))
          ) : (
            <>
              <CompanionCard
                cardType="Hatching card"
                cardNumber="#0417"
                companionName="Robin Fox"
                species="fox"
                evolutionLvl={1}
                title="Zephyr — Cosmic Orb"
                description="A new companion opens its eyes for the first time. Species assigned at random from the book."
                bottomLeft="001 hatch"
                bottomRight="stage: hatchling"
              />

              <CompanionCard
                cardType="Meal card"
                cardNumber="#0418"
                companionName="Hartley"
                species="deer"
                evolutionLvl={2}
                title='"served gyoza"'
                description="Carefully dipping each one, savoring every bite! Hunger reset, meal count +1."
                bottomLeft="meals: 7"
                bottomRight="▲ satisfied"
              />

              <CompanionCard
                cardType="Status card"
                cardNumber="#0419"
                companionName="Olliver"
                species="owl"
                evolutionLvl={1}
                title="Current position"
                description="Hunger, mood, evolution stage and current activity, at a glance."
                statusMetadata={{
                  mood: "content",
                  stage: "juvenile"
                }}
              />

              <CompanionCard
                cardType="Adventure card"
                cardNumber="#0420"
                companionName="Harelock"
                species="rabbit"
                evolutionLvl={3}
                weaponId="wood_bow"
                title="Zephyr & Luna"
                description="Building sandcastles on a cloud. Both owners notified, encounter logged."
                bottomLeft="006 adventure"
                bottomRight="owners: 2"
              />
            </>
          )}
        </div>
      </section>

      {/* LIVE LOG */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-black/10">
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-black/40">003 · From the timeline</span>
          <h2 className="font-display font-bold text-3xl mt-2 mb-6 max-w-xl text-black">What a reply actually looks like.</h2>
          <p className="text-black/60 max-w-2xl mt-3 leading-relaxed">
            Real system output and command samples. Watch the autonomous engine translate raw mentions into companion interactions in real-time.
          </p>
        </div>
        <div className="bg-black border border-black/10 rounded-xl overflow-hidden max-w-2xl">
          <div className="flex items-center gap-2 px-4 py-3 bg-[#111310] border-b border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/50"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/50"></span>
            <span className="font-mono text-[10px] text-white/40 ml-2 uppercase tracking-widest">reply-thread.log</span>
          </div>
          <pre className="p-5 font-mono text-xs leading-relaxed overflow-x-auto text-[#CCFF00]">
            <span className="text-white/40">$</span> <span className="text-white">you: &quot;serve my companion forest gyoza&quot;</span><br />
            <span className="text-[#CCFF00]">▲ desk: carefully dipping each one, savoring every bite!</span><br />
            <span className="text-white/50">↳ hunger reset · meal count +1 · card attached</span>
          </pre>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#CCFF00] w-full py-20 text-black mt-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="max-w-xl">
            <h2 className="font-display font-bold text-5xl lg:text-6xl tracking-tight mb-4 text-black leading-none">
              Hatch something<br />alive.
            </h2>
            <p className="text-black/80 text-base md:text-lg max-w-md mt-4 leading-relaxed">
              One mention on 𝕏. No app, no login, no fees. Your companion does the rest on its own.
            </p>
          </div>
          <div>
            <a
              href="https://x.com/Hoodchi_rh"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black hover:bg-neutral-900 text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-200 inline-block whitespace-nowrap"
            >
              Hatch on 𝕏 →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
