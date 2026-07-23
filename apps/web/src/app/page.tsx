"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PixelPetRenderer from "@/components/PixelPetRenderer";

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
  intelligence: number;
  luck: number;
  role: string;
  group: string;
  description: string;
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
  intelligence: number;
  luck: number;
  role: string;
  group: string;
  description: string;
  mood: string;
  cardNumber: string;
  userEmail: string;
}

const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    if (window.location.hostname === "localhost") {
      return "http://localhost:3001";
    }
  }
  return "";
};

const API_BASE_URL = getApiBaseUrl();

const CHARACTER_ROLES: Record<string, { characterName: string; role: string; group: string; description: string }> = {
  'Robin Fox': {
    characterName: 'Robin Fox',
    role: 'Ranger',
    group: 'Forest Rangers',
    description: 'Group leader. Expert in archery, strategizing, and leading ambush or rescue missions. Intelligent and quick to make decisions.'
  },
  'Hartley': {
    characterName: 'Hartley',
    role: 'Hunter',
    group: 'Forest Rangers',
    description: 'Master hunter and tracker. Proficient with long-range bows and skilled at identifying enemy and animal tracks in the forest.'
  },
  'Little John': {
    characterName: 'Little John',
    role: 'Guardian',
    group: 'Forest Rangers',
    description: 'Team protector with high physical strength. Stands on the front line to shield allies during combat.'
  },
  'Harelock': {
    characterName: 'Harelock',
    role: 'Scout',
    group: 'Recon Corps',
    description: 'The fastest scout. Responsible for exploring areas, opening maps, sending messages, and providing early warnings.'
  },
  'Nutley': {
    characterName: 'Nutley',
    role: 'Rogue',
    group: 'Shadow Guild',
    description: 'Expert in infiltration and resource gathering. Skilled at lockpicking, retrieving vital items, and moving silently.'
  },
  'Badgerick': {
    characterName: 'Badgerick',
    role: 'Quartermaster',
    group: 'Logistics & Engineering Corps',
    description: 'Manages supplies, builds camps, repairs equipment, and ensures the team\'s needs are always met.'
  },
  'Olliver': {
    characterName: 'Olliver',
    role: 'Sage',
    group: 'Wisdom & Command Council',
    description: 'Advisor and guardian of knowledge. Analyzes situations, reads nature\'s signs, and provides the best strategies.'
  },
  'Willow': {
    characterName: 'Willow',
    role: 'Elite Archer',
    group: 'Forest Rangers',
    description: 'Elite marksman capable of attacking from a distance with high accuracy. Suited for eliminating high-value targets.'
  },
  'Prickle': {
    characterName: 'Prickle',
    role: 'Inventor',
    group: 'Logistics & Engineering Corps',
    description: 'Elite trap designer. Expert in creating traps, simple gadgets, and designing defensive or offensive tactics.'
  },
  'Rook': {
    characterName: 'Rook',
    role: 'Smuggler',
    group: 'Shadow Guild',
    description: 'A spy who gathers information stealthily. Experienced in infiltration and smuggling.'
  },
  'Merry': {
    characterName: 'Merry',
    role: 'Strategist',
    group: 'Wisdom & Command Council',
    description: 'Expert in team formation and coordinating members during battle. Despite being small, their intellect is highly valuable.'
  },
  'Cawthorne': {
    characterName: 'Cawthorne',
    role: 'Courier',
    group: 'Recon Corps',
    description: 'Aerial messenger and intelligence gatherer. Watches the area from above and reports enemy movements.'
  }
};

const getCompanionRoleInfo = (companion: { name: string; species: string; role?: string; group?: string; description?: string } | null | undefined) => {
  if (!companion) return { role: "Ranger", group: "Forest Rangers", description: "A loyal companion." };
  const key = Object.keys(CHARACTER_ROLES).find(k => CHARACTER_ROLES[k].characterName === companion.name) ||
    Object.keys(CHARACTER_ROLES).find(k => CHARACTER_ROLES[k].role === companion.role) ||
    Object.keys(CHARACTER_ROLES).find(k => {
      const speciesMap: Record<string, string> = {
        'Robin Fox': 'Fox',
        'Hartley': 'Deer',
        'Little John': 'Bear',
        'Harelock': 'Hare',
        'Nutley': 'Squirrel',
        'Badgerick': 'Badger',
        'Olliver': 'Owl',
        'Willow': 'Fox',
        'Prickle': 'Hedgehog',
        'Rook': 'Rook',
        'Merry': 'Mouse',
        'Cawthorne': 'Crow'
      };
      return speciesMap[k]?.toLowerCase() === companion.species?.toLowerCase();
    });
  return key ? CHARACTER_ROLES[key] : { role: companion.role || "Ranger", group: companion.group || "Forest Rangers", description: companion.description || "A loyal companion." };
};

export default function Home() {
  const [email, setEmail] = useState("mock_user@x.com");
  const [tempEmail, setTempEmail] = useState("@mock_user");
  const [userCompanion, setUserCompanion] = useState<UserCompanion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestCards, setLatestCards] = useState<CardData[]>([]);

  const fetchCompanionData = async (targetEmail: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/companion/user/${targetEmail}`);
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
          intelligence: 10,
          luck: 10,
          role: "Ranger",
          group: "Forest Rangers",
          description: "Group leader. Expert in archery, strategizing, and leading ambush or rescue missions.",
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
        const response = await fetch(`${API_BASE_URL}/api/companion/latest`);
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
    let formattedEmail = tempEmail.trim();
    if (formattedEmail.startsWith("@")) {
      formattedEmail = formattedEmail.slice(1);
    }
    if (!formattedEmail.includes("@")) {
      formattedEmail = `${formattedEmail}@x.com`;
    }
    if (formattedEmail) {
      setEmail(formattedEmail);
    }
  };

  const handleHatchMock = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/companion/hatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        fetchCompanionData(email);
        // Refresh latest cards section too
        const latestResponse = await fetch(`${API_BASE_URL}/api/companion/latest`);
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
          intelligence: 10,
          luck: 10,
          role: "Ranger",
          group: "Forest Rangers",
          description: "Group leader. Expert in archery, strategizing, and leading ambush or rescue missions.",
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
            Hoodnest is the forest virtual pet platform on X — hatch a companion in Sherwood forest today, and train it to be a legendary Robin Hood protector using custom Pixel Art composites.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <a
              href="https://x.com/HoodNestfun"
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
                type="text"
                placeholder="@username or email"
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
            <a
              href={`https://x.com/${email.split("@")[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#4C6B00]/10 text-[#4C6B00] hover:bg-[#4C6B00]/20 px-2 py-0.5 rounded text-[9px] font-bold tracking-normal transition-all duration-200"
            >
              @{email.split("@")[0]}
            </a>
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
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#4C6B00]/10 text-[#4C6B00] border border-[#4C6B00]/20 px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider">
                    {activeCompanion.role || getCompanionRoleInfo(activeCompanion).role}
                  </span>
                  <span className="text-[10px] text-black/40 font-mono">
                    {activeCompanion.group || getCompanionRoleInfo(activeCompanion).group}
                  </span>
                </div>
                <div className="flex flex-col mb-3">
                  <div className="flex justify-between font-mono text-[10px] text-black/40">
                    <span>EXP : {activeCompanion.xp}</span>
                    <span>100</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-black/5 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${Math.min(100, activeCompanion.xp)}%` }}></div>
                    </div>
                  </div>
                </div>

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
                  <div className="flex justify-between">
                    <span className="text-black/40 text-[10px]">🧠 Intelligence</span>
                    <span className="font-bold">{activeCompanion.intelligence || 10}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/40 text-[10px]">🍀 Luck</span>
                    <span className="font-bold">{activeCompanion.luck || 10}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-black/5 text-xs text-black/60 font-mono italic leading-relaxed">
                  {activeCompanion.description || getCompanionRoleInfo(activeCompanion).description}
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
              <div key={card.id} className="bg-white border border-black/10 rounded-xl p-5 border-glow shadow-sm flex flex-col gap-3 relative">
                {/* User email in the top right corner of the card */}
                <div className="font-mono text-[10px] uppercase tracking-widest text-black/40 flex justify-between items-center">
                  <span>{card.cardNumber}</span>
                  <a
                    href={`https://x.com/${card.userEmail.split("@")[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#4C6B00]/10 text-[#4C6B00] hover:bg-[#4C6B00]/20 px-2 py-0.5 rounded text-[9px] font-bold tracking-normal truncate max-w-[120px] transition-all duration-200"
                  >
                    @{card.userEmail.split("@")[0]}
                  </a>
                </div>

                {/* Stacking Pixel Art composite view */}
                <PixelPetRenderer
                  companionName={card.name}
                  species={card.species}
                  evolutionLvl={card.evolutionLvl}
                  className="w-full h-48"
                />

                {/* Companion Stats Grid below the image */}
                <div className="border-t border-black/5 pt-3 mt-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-display font-bold text-base text-black truncate max-w-[120px]">
                      {card.name}
                    </h3>
                    <span className="border border-[#4C6B00]/30 bg-[#4C6B00]/10 text-[#4C6B00] px-2 py-0.5 text-[9px] font-mono rounded-full uppercase tracking-wider">
                      Lvl {card.level}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 mb-2 font-mono text-[9px] text-black/50">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-[#4C6B00]/10 text-[#4C6B00] border border-[#4C6B00]/20 px-1 py-0.2 rounded font-bold uppercase text-[8px]">
                        {card.role || getCompanionRoleInfo(card).role}
                      </span>
                      <span className="truncate max-w-[130px]">{card.group || getCompanionRoleInfo(card).group}</span>
                    </div>
                  </div>

                  {/* Dynamic description directly under the name/role */}
                  <div className="mb-3 text-[9px] text-black/60 font-mono italic leading-relaxed">
                    {card.description || getCompanionRoleInfo(card).description}
                  </div>

                  <div className="flex flex-col mb-3">
                    <div className="flex justify-between font-mono text-[9px] text-black/40">
                      <span>EXP : {card.xp}</span>
                      <span>100</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex-1 bg-black/5 rounded-full h-1 overflow-hidden">
                        <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${Math.min(100, card.xp)}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-black/70 mt-2 pt-2 border-t border-black/5">
                    <div className="flex justify-between">
                      <span className="text-black/40 text-[9px]">Friendship</span>
                      <span className="font-bold">{card.friendship}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/40 text-[9px]">Strength</span>
                      <span className="font-bold">{card.strength || 10}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/40 text-[9px]">Intellect</span>
                      <span className="font-bold">{card.intelligence || 10}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/40 text-[9px]">Luck</span>
                      <span className="font-bold">{card.luck || 10}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-black/40 font-mono text-xs">
              No companion records found in database.
            </div>
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
              href="https://x.com/HoodNestfun"
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
