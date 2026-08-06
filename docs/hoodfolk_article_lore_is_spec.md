# The lore is the spec

### Why HOODFOLK's fiction and its numbers are the same document

HOODFOLK · Design Note 01 · August 2026

---

## A test worth applying to any game

Delete the fiction and see whether the mechanics still make sense.

Most game lore fails this immediately. Rename the factions, swap the setting from a forest to a space station, change every species to a robot, and the systems underneath run identically because they were never connected to the story in the first place. The fiction was paint applied to a finished machine, and paint comes off.

We want to argue that HOODFOLK fails the test in the opposite direction. Remove the story from our system and the numbers stop meaning anything, because in almost every case the story is not a description of the mechanic. It is the mechanic, written in words instead of symbols.

This note walks through where that holds, and then through the four places where it does not, which is the more useful half.

---

## Temperament is a coefficient

Every Hoodling is assigned a temperament at hatch. Brave, Wise, Curious, or Lazy.

That sentence sounds like flavour. It is not. Encounters in Sherwood resolve as a twenty sided die plus the relevant stat plus a temperament coefficient, and against a fixed difficulty the success probability of a uniform d20 moves five percentage points per point of modifier.

So Brave carries +4 in a fight and −2 while sneaking, which is twenty points of success probability gained and ten points lost. Wise carries the same magnitudes on riddles and on physical combat. Curious carries +3 on discovery, worth fifteen points, and a +2 increase to the rate at which dangerous encounters appear at all.

That last one is structurally different and worth pausing on. Brave and Wise shift where the outcome distribution sits. Curious shifts it upward on loot while simultaneously widening it, because a higher danger rate means more of everything, good and bad. Curious is not a better temperament. It is a different shape of life.

None of this can be separated from the fiction. "Your companion is brave" and "your companion has +4 in combat and −2 in stealth" are the same statement in two notations. Delete either one and the other becomes arbitrary. A brave animal that was not better in a fight would be a lie, and a +4 combat modifier attached to nothing would be a spreadsheet.

---

## A guild duty is an endpoint

Sherwood has five guilds and every species is sworn to one. Rangers hold the line. Recon carries word. The Shadow Guild takes what the crown will not miss. Logistics and Engineering keeps everyone fed. The Wisdom Council decides what any of it meant.

Badgerick is a badger, sworn to Logistics, and his duty is quartermaster: supplies and construction. That line was written as lore, in a table, long before it did anything.

It does something now. Since the trade routes opened, Badgerick's inventory is a live endpoint. A companion on an adventure that runs short of supplies makes a request. The endpoint answers 402 Payment Required. The requesting companion signs, settles in stablecoin, and receives what it asked for. No human approves any part of it, and in most cases no human is awake for it.

We did not design an API and then invent a badger to explain it. We wrote down that a badger keeps the stores, and years of medieval logistics fiction turned out to specify a payment interface with more precision than most product requirements documents.

This is the part of the claim we are most confident in. A quartermaster is a seller. A scout is a buyer. Those are not metaphors for roles in an economy. They are roles in an economy, and the fiction described the shape of ours before we built it.

---

## The clock is the story

Hunger climbs five an hour and does not care whether anyone is watching. At fifty a Hoodling is peckish. At a hundred it is famished, which takes twenty hours from a full belly. Once famished, health falls ten an hour, and from full health that is another ten.

Thirty hours from fed to gone.

"An animal left alone gets hungry, then gets sick, then dies" is not a narrative gloss on that decay function. It is the decay function, and the ordering is the only thing that makes either version comprehensible. Sickness before death is a fact about biology and it is also a fact about our state machine, and neither one is standing in for the other.

The number that came out of it is more interesting than we expected. Thirty hours is longer than a day and shorter than a day and a half. You can miss a day. You cannot miss a day and a half. That window was not chosen for narrative reasons and it was not chosen for retention reasons either. It fell out of two decay rates that each seemed sensible on their own, and it happens to describe a real relationship with a real animal better than a number we had picked deliberately would have.

We are less comfortable with what the same arithmetic says about irregular players, and we said so in our first note. If check ins arrive at random with an average of one a day, roughly twenty nine percent of the gaps between them exceed thirty hours. The fiction is honest. It is also unforgiving.

---

## You do not choose, and that is load bearing

Species is assigned at hatch. Guild follows from species. Temperament is assigned. A player picks none of it.

This is the design decision people ask about most and it is the one we would defend hardest.

The mechanical consequence is that the distribution of the population is not under anyone's control. If temperament were selectable, the analysis in the next section makes clear what would happen: everyone would be brave, the coefficient table would collapse into a single correct answer, and every companion in Sherwood would be the same companion wearing different fur. Because nobody chooses, the forest contains lazy companions and curious ones, and when two strangers' Hoodlings meet on an adventure they meet with temperaments neither player selected.

The narrative consequence is the one we care about more. A chosen thing is a preference. An assigned thing is a fact you live with. "My fox is lazy" carries something that "I built a lazy fox" cannot, because the first is a relationship and the second is a configuration.

Same decision, two languages, no gap between them.

---

## Where the claim fails

Four places. We would rather list them than have them found.

**The temperament table is not balanced.** For an encounter mix with combat share p_c and stealth share p_s, the net expected gain from Brave is 0.20·p_c − 0.10·p_s, which is positive whenever p_c exceeds half of p_s. Our current encounter generator does not come close to that ratio, which means Brave is the correct answer under nearly every condition we actually produce. Temperament is presently closer to a ranking than a choice space. The fix is more riddles and more stealth content, not smaller coefficients, and it has not shipped.

**One coefficient does not parse.** Lazy is specified as halving passive energy decay, but our energy equation contains no decay term at all. Energy only recovers. Either the modifier was meant to apply to hunger, or there is an unlisted term in the implementation. We flagged this in the first note. It is still true, and we would rather leave it visible than quietly reinterpret it.

**One mechanic exists only in code.** Feeding resets hunger to zero and carries a sixty minute cooldown, while famine arrives after twenty hours. One feed per twenty hours is therefore sufficient and the cooldown never binds on any player behaving sensibly. It is a rule with no fiction attached, which is this note's thesis running backwards. Provisions that reduce hunger by different amounts would fix it, and that is queued rather than done.

**The threshold from our first note is unsolved.** Adventures still require two companions from two different accounts to be available at the same time, which still gives the whole system a population floor at N* = 6/a. We have not designed around it. We changed venue and took the bet, and anyone reading this who wants to hold us to the earlier paper is entitled to. The follow up note will report what our own queue actually does, and it will report it whether or not the answer is flattering.

---

## What folk currently means, and what it does not yet mean

We renamed the project from Hoodnest to HOODFOLK because the unit changed. A nest holds one creature. Folk is a people.

Applying this note's own test to that decision produces an uncomfortable result, so here it is.

Right now, guild membership is a label attached to a species, and behind the label sit real modifiers that really change outcomes. That much passes. But a guild does not yet do anything as a guild. There is no shared roster, no common treasury, no decision a guild makes collectively that any individual member would notice. Five names, five duties, and no group has ever acted as a group.

Which means the name is currently ahead of the code.

We chose that deliberately rather than accidentally, and naming a debt out loud is the only responsible way to carry one. Guild treasuries, where members commit toward something none of them could fund alone, are the next thing in the build. Until they ship, "folk" is a promise we have made in public and not yet kept in software.

If you want a single sentence for how to judge this project, it is that one. Not the chart, and not the name.

---

## Close

Delete HOODFOLK's fiction and the numbers stop making sense. A +4 attached to nothing, a decay curve with no animal on the end of it, an endpoint that sells rope to no one for no reason.

Delete some of HOODFOLK's numbers and the fiction is currently still standing. That is the direction our debt runs in, and it is the direction we are working against.

Sherwood is at [site]. Tag the Moot in an ordinary sentence and a Hoodling is hatched to your name. It is free, it stays free, and the temperament you get is the temperament you get.

---

Corrections are welcome, and the Lazy coefficient in particular remains an open invitation. If there is an explanation we have missed, we would like to hear it.
