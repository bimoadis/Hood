import Link from "next/link";
import PixelPetRenderer from "@/components/PixelPetRenderer";
import CompanionCard from "@/components/CompanionCard";

export default function Home() {
  return (
    <main className="relative z-10 font-sans min-h-screen">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
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
          <div className="flex gap-8 font-mono text-xs text-black/50">
            <div><span className="text-[#4C6B00] font-bold">11</span> sections</div>
            <div><span className="text-[#4C6B00] font-bold">100+</span> species</div>
            <div><span className="text-[#4C6B00] font-bold">$0.00</span> · free, always</div>
          </div>
        </div>

        {/* Dynamic Stacking Card representation */}
        <div className="bg-white border border-black/10 rounded-xl p-5 border-glow shadow-sm max-w-md w-full justify-self-center md:justify-self-end flex flex-col gap-3">
          <div className="font-mono text-[10px] uppercase tracking-widest text-black/40 flex justify-between">
            <span>Hatching card</span><span>#0417</span>
          </div>
          
          {/* Stacking Pixel Art composite view */}
          <PixelPetRenderer companionName="Robin Fox" species="fox" evolutionLvl={1} weaponId="wood_bow" className="w-full h-48" />

          <div className="font-display font-bold text-lg text-black mt-2">Archer — Robin Fox</div>
          <div className="font-mono text-xs text-black/40 mt-1">stage: hatchling · meals: 0</div>
          <div className="mt-4 flex gap-2">
            <span className="border border-[#4C6B00]/30 bg-[#4C6B00]/10 text-[#4C6B00] px-3 py-1 text-[11px] font-mono rounded-full uppercase tracking-wider">level 1</span>
            <span className="border border-black/10 text-black/60 px-3 py-1 text-[11px] font-mono rounded-full uppercase tracking-wider">idle</span>
          </div>
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
