"use client";

import { useEffect, useState } from "react";

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

export default function Docs() {
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => sections.forEach((s) => observer.unobserve(s));
  }, []);

  const navItems = [
    { id: "about", label: "001 The desk" },
    { id: "see", label: "002 What you'll see" },
    { id: "hatch", label: "003 Hatching" },
    { id: "commands", label: "004 Commands" },
    { id: "feed", label: "005 Feeding" },
    { id: "adventure", label: "006 Adventures" },
    { id: "evolution", label: "008 Level Up & Stats" },
    { id: "characters", label: "009 Roster & Factions" },
    { id: "faq", label: "011 FAQ" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[220px_1fr] gap-12 pt-12 font-sans relative z-10">
      {/* SIDEBAR INDEX */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-1 font-mono text-xs">
          <div className="text-black/40 uppercase tracking-widest mb-3">Index</div>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block py-1.5 transition-colors ${
                activeSection === item.id
                  ? "text-[#4C6B00] font-bold"
                  : "text-black/60 hover:text-[#4C6B00]"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </aside>

      <main className="min-w-0 pb-24">
        <div className="mb-14">
          <span className="font-mono text-xs uppercase tracking-widest text-black/40">
            Docs · Owner&apos;s manual · v1.0
          </span>
          <h1 className="font-display font-bold text-4xl lg:text-5xl mt-3 leading-tight text-black">
            Your pixel companion,<br />running on chain.
          </h1>
          <div className="flex gap-6 mt-5 font-mono text-xs text-black/50">
            <span><span className="text-[#4C6B00] font-bold">▲</span> 11 sections</span>
            <span><span className="text-[#4C6B00] font-bold">▲</span> 12 classes</span>
            <span><span className="text-[#4C6B00] font-bold">▲</span> $0.00 · free, always</span>
          </div>
        </div>

        {/* 001 */}
        <section id="about" className="py-10 border-t border-black/10 scroll-mt-[90px]">
          <span className="font-mono text-xs text-black/40">001 / OVERVIEW</span>
          <h2 className="font-display font-bold text-2xl mt-2 mb-3 text-black">The desk.</h2>
          <p className="text-black/70 max-w-2xl mb-4">
            <strong>Hoodlings</strong> is a platform for raising AI-driven digital companions directly through 𝕏 (Twitter) — a living Pixel Art creature that grows, develops personality, and forms bonds with other companions across the network, entirely through ordinary conversation.
          </p>
          <p className="text-black/70 max-w-2xl">
            Tag the desk in any post and the autonomous agent takes over: reads your words, crafts a visual response card, and orchestrates encounters between your companion and others. No downloads, no accounts, no friction.
          </p>
          <div className="mt-6 grid sm:grid-cols-2 gap-3 max-w-2xl font-mono text-xs text-black/60">
            <div className="bg-white border border-black/10 rounded-lg px-4 py-3">One exclusive companion per account</div>
            <div className="bg-white border border-black/10 rounded-lg px-4 py-3">Natural language, no rigid syntax</div>
            <div className="bg-white border border-black/10 rounded-lg px-4 py-3">Feed it any meal imaginable</div>
            <div className="bg-white border border-black/10 rounded-lg px-4 py-3">Companions meet, autonomously</div>
          </div>
        </section>

        {/* 002 */}
        <section id="see" className="py-10 border-t border-black/10 scroll-mt-[90px]">
          <span className="font-mono text-xs text-black/40">002 / INTERFACE</span>
          <h2 className="font-display font-bold text-2xl mt-2 mb-3 text-black">What you&apos;ll see.</h2>
          <p className="text-black/70 max-w-2xl mb-4">
            Everything happens on 𝕏, in the open. Write to the desk the way you&apos;d talk to a friend — within a minute or so, your companion answers in your replies with a custom Pixel Art response card, in character.
          </p>
          <div className="border-l-2 border-[#4C6B00] bg-white p-5 rounded-r-xl max-w-xl">
            <span className="font-mono text-xs text-[#4C6B00] uppercase tracking-widest font-bold">▲ No friction</span>
            <p className="text-black/80 text-sm mt-1">
              Nothing to install. No login, no wallet, no waitlist. Talk to it like any other account on the timeline.
            </p>
          </div>
        </section>

        {/* 003 */}
        <section id="hatch" className="py-10 border-t border-black/10 scroll-mt-[90px]">
          <span className="font-mono text-xs text-black/40">003 / QUICK START</span>
          <h2 className="font-display font-bold text-2xl mt-2 mb-3 text-black">Hatching.</h2>
          <p className="text-black/70 max-w-2xl mb-6">Tag the desk on 𝕏 and request a companion. Here&apos;s the flow end-to-end.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-black/10 rounded-xl p-5 border-glow">
              <div className="font-mono text-xs text-black/40 mb-2">01</div>
              <div className="font-display font-bold mb-2 text-black">Summon a creature</div>
              <div className="font-mono text-xs text-black/60 bg-[#F2F2EC] rounded-lg p-3 mb-2">
                &quot;hatch my hoodling&quot; · &quot;create a companion&quot; · &quot;I need a pet&quot;
              </div>
              <p className="text-black/60 text-sm">The system assigns a unique Pixel Art creature with an AI-crafted name, species, and RPG role.</p>
            </div>
            <div className="bg-white border border-black/10 rounded-xl p-5 border-glow">
              <div className="font-mono text-xs text-black/40 mb-2">02</div>
              <div className="font-display font-bold mb-2 text-black">Feed</div>
              <div className="font-mono text-xs text-black/60 bg-[#F2F2EC] rounded-lg p-3 mb-2">
                &quot;serve my companion ramen&quot; · &quot;toss him a cookie&quot;
              </div>
              <p className="text-black/60 text-sm">Offer any food. The AI identifies it and produces a unique response.</p>
            </div>
            <div className="bg-white border border-black/10 rounded-xl p-5 border-glow">
              <div className="font-mono text-xs text-black/40 mb-2">03</div>
              <div className="font-display font-bold mb-2 text-black">Check Status</div>
              <div className="font-mono text-xs text-black/60 bg-[#F2F2EC] rounded-lg p-3 mb-2">
                &quot;how is my companion?&quot; · &quot;show stats&quot;
              </div>
              <p className="text-black/60 text-sm">View health, energy, hunger, happiness, level, EXP, and current stats.</p>
            </div>
            <div className="bg-white border border-black/10 rounded-xl p-5 border-glow">
              <div className="font-mono text-xs text-black/40 mb-2">04</div>
              <div className="font-display font-bold mb-2 text-black">Adventure</div>
              <div className="font-mono text-xs text-black/60 bg-[#F2F2EC] rounded-lg p-3 mb-2">
                &quot;my hoodchi wants to explore&quot; · &quot;find a friend&quot;
              </div>
              <p className="text-black/60 text-sm">Your companion gets paired with another for a shared experience.</p>
            </div>
          </div>
        </section>

        {/* 004 */}
        <section id="commands" className="py-10 border-t border-black/10 scroll-mt-[90px]">
          <span className="font-mono text-xs text-black/40">004 / REFERENCE</span>
          <h2 className="font-display font-bold text-2xl mt-2 mb-3 text-black">Commands.</h2>
          <p className="text-black/70 max-w-2xl mb-6">Speak naturally — the AI determines your intent.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono border-collapse text-black">
              <thead>
                <tr className="text-left text-black/40 uppercase text-[10px] tracking-widest border-b border-black/15">
                  <th className="py-2 pr-4">Command</th>
                  <th className="py-2 pr-4">Try</th>
                  <th className="py-2 pr-4">Limit</th>
                  <th className="py-2">Response</th>
                </tr>
              </thead>
              <tbody className="text-black/70">
                <tr className="border-b border-black/10">
                  <td className="py-3 pr-4 font-semibold text-black">summon</td>
                  <td className="py-3 pr-4">&quot;hatch my hoodling&quot;</td>
                  <td className="py-3 pr-4">1 per account</td>
                  <td className="py-3">Welcome card</td>
                </tr>
                <tr className="border-b border-black/10">
                  <td className="py-3 pr-4 font-semibold text-black">feed</td>
                  <td className="py-3 pr-4">&quot;give her bubble tea&quot;</td>
                  <td className="py-3 pr-4">60 min cooldown</td>
                  <td className="py-3">Meal card</td>
                </tr>
                <tr className="border-b border-black/10">
                  <td className="py-3 pr-4 font-semibold text-black">check</td>
                  <td className="py-3 pr-4">&quot;what&apos;s my companion doing?&quot;</td>
                  <td className="py-3 pr-4">No limit</td>
                  <td className="py-3">Status card</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-black">adventure</td>
                  <td className="py-3 pr-4">&quot;send my hoodchi out&quot;</td>
                  <td className="py-3 pr-4">—</td>
                  <td className="py-3">Adventure card</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 005 */}
        <section id="feed" className="py-10 border-t border-black/10 scroll-mt-[90px]">
          <span className="font-mono text-xs text-black/40">005 / MECHANICS</span>
          <h2 className="font-display font-bold text-2xl mt-2 mb-3 text-black">Feeding.</h2>
          <p className="text-black/70 max-w-2xl mb-4">Offer your companion anything and watch the AI bring it to life.</p>
          <div className="bg-black border border-black/10 rounded-xl overflow-hidden max-w-2xl mb-6">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#111310] border-b border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/50"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/50"></span>
              <span className="font-mono text-[10px] text-white/40 ml-2 uppercase tracking-widest">sample-meals.log</span>
            </div>
            <pre className="p-5 font-mono text-xs leading-relaxed overflow-x-auto text-[#CCFF00]">
              <span className="text-white/40">$</span> <span className="text-white">&quot;serve her hot chocolate&quot;</span><br />
              <span className="text-[#CCFF00]">▲ wrapping tiny paws around the mug, purring softly!</span><br /><br />
              <span className="text-white/40">$</span> <span className="text-white">&quot;give my hoodling asteroid fragments&quot;</span><br />
              <span className="text-[#CCFF00]">▲ crunching cosmic debris, sparkling from within!</span>
            </pre>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="border border-[#4C6B00]/30 bg-[#4C6B00]/10 text-[#4C6B00] px-3 py-1 text-xs font-mono rounded-full uppercase tracking-wider">
              ▲ Satisfied
            </span>
            <span className="border border-[#8A6600]/30 bg-[#8A6600]/10 text-[#8A6600] px-3 py-1 text-xs font-mono rounded-full uppercase tracking-wider">
              ◆ Peckish
            </span>
            <span className="border border-[#C23B12]/30 bg-[#C23B12]/10 text-[#C23B12] px-3 py-1 text-xs font-mono rounded-full uppercase tracking-wider">
              ▼ Famished
            </span>
          </div>
        </section>

        {/* 006 */}
        <section id="adventure" className="py-10 border-t border-black/10 scroll-mt-[90px]">
          <span className="font-mono text-xs text-black/40">006 / SOCIAL</span>
          <h2 className="font-display font-bold text-2xl mt-2 mb-3 text-black">Adventures.</h2>
          <p className="text-black/70 max-w-2xl mb-4">
            Encourage your companion to venture out and they&apos;ll find a partner to share the moment with. Every adventure is permanently recorded.
          </p>
          <div className="border-l-2 border-[#4C6B00] bg-white p-5 rounded-r-xl max-w-xl">
            <span className="font-mono text-xs text-[#4C6B00] uppercase tracking-widest font-bold">▲ Encounter</span>
            <p className="text-black/80 text-sm mt-1">
              Zephyr and Luna are building sandcastles on a cloud — both owners get notified, card attached.
            </p>
          </div>
        </section>

        {/* 008 */}
        <section id="evolution" className="py-10 border-t border-black/10 scroll-mt-[90px]">
          <span className="font-mono text-xs text-black/40">008 / TRAINING & RPG</span>
          <h2 className="font-display font-bold text-2xl mt-2 mb-3 text-black">Level Up & Stats.</h2>
          <p className="text-black/70 max-w-2xl mb-6">
            Every conversation and training session rewards your companion with EXP. Once their EXP bar fills up to 100, they level up and receive permanent RPG stat increases tailored to their specific class/role!
          </p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl text-black">
            <div className="bg-white border border-black/10 rounded-xl p-4">
              <div className="font-mono text-[10px] text-indigo-500 uppercase">⚔️ Strength</div>
              <p className="text-black/60 text-xs mt-1">Boosts physical defense and combat power. Prime stat for Guardians.</p>
            </div>
            <div className="bg-white border border-black/10 rounded-xl p-4">
              <div className="font-mono text-[10px] text-indigo-500 uppercase">🧠 Intellect</div>
              <p className="text-black/60 text-xs mt-1">Enhances tactical decision-making and wisdom. Prime stat for Sages & Strategists.</p>
            </div>
            <div className="bg-white border border-black/10 rounded-xl p-4">
              <div className="font-mono text-[10px] text-indigo-500 uppercase">🍀 Luck</div>
              <p className="text-black/60 text-xs mt-1">Improves critical encounters and escape rates. Prime stat for Rogues & Smugglers.</p>
            </div>
          </div>
        </section>

        {/* 009 */}
        <section id="characters" className="py-10 border-t border-black/10 scroll-mt-[90px]">
          <span className="font-mono text-xs text-black/40">009 / ROSTER</span>
          <h2 className="font-display font-bold text-2xl mt-2 mb-3 text-black">Roster & Factions.</h2>
          <p className="text-black/70 max-w-2xl mb-6">
            Sherwood Forest is home to 12 unique legendary companions, divided into specialized tactical factions (groups). Each has their own custom role and vital duties.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 max-w-4xl text-black">
            {Object.entries(CHARACTER_ROLES).map(([key, info]) => {
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
              const species = speciesMap[key] || "Companion";
              return (
                <div key={key} className="bg-white border border-black/10 rounded-xl p-5 border-glow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-display font-bold text-base text-black">{info.characterName}</h4>
                      <span className="text-[10px] text-black/40 font-mono">Species: {species}</span>
                    </div>
                    <span className="bg-[#4C6B00]/10 text-[#4C6B00] border border-[#4C6B00]/20 px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider">
                      {info.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-indigo-600 font-mono mb-2 uppercase tracking-wide">
                    {info.group}
                  </div>
                  <p className="text-black/60 text-xs leading-relaxed italic">
                    &ldquo;{info.description}&rdquo;
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 011 FAQ */}
        <section id="faq" className="py-10 border-t border-black/10 scroll-mt-[90px]">
          <span className="font-mono text-xs text-black/40">011 / FAQ</span>
          <h2 className="font-display font-bold text-2xl mt-2 mb-6 text-black">Questions.</h2>
          <div className="space-y-3 max-w-2xl text-black">
            <details className="bg-white border border-black/10 rounded-xl p-4 group">
              <summary className="font-display font-semibold cursor-pointer list-none flex justify-between items-center">
                Can I own multiple companions?
                <span className="font-mono text-black/30 group-open:rotate-45 transition">+</span>
              </summary>
              <p className="text-black/60 text-sm mt-2">No. One per 𝕏 account — keeps each bond personal.</p>
            </details>
            <details className="bg-white border border-black/10 rounded-xl p-4 group">
              <summary className="font-display font-semibold cursor-pointer list-none flex justify-between items-center">
                What if I forget to feed?
                <span className="font-mono text-black/30 group-open:rotate-45 transition">+</span>
              </summary>
              <p className="text-black/60 text-sm mt-2">They get hungry and gloomy, but nothing permanent. Return anytime.</p>
            </details>
            <details className="bg-white border border-black/10 rounded-xl p-4 group">
              <summary className="font-display font-semibold cursor-pointer list-none flex justify-between items-center">
                Does this cost anything?
                <span className="font-mono text-black/30 group-open:rotate-45 transition">+</span>
              </summary>
              <p className="text-black/60 text-sm mt-2">Nothing. Entirely free — no hidden tiers, no premium, no sign-up walls.</p>
            </details>
          </div>
        </section>
      </main>
    </div>
  );
}
