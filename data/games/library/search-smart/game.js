// Search Smart. Skill W.7.8-1.
// Using search terms effectively and assessing the credibility and accuracy of each source. Using unreliable sources is the known slip.
Sidekick.game(Sidekick.play({
  title: "Search Smart",
  emoji: "🧭",
  premise: "The words you type decide what you find. Specific search terms bring back useful, trustworthy results.",
  outro: "Use precise search terms, then check each source for credibility and accuracy.",
  scene: "desk",
  kind: "sort",
  fs: 4.6,
  hint: "Would this search bring back pages about exactly your question?",
  tag: "vague_search",
  rounds: [
    { say: "You want the causes of the Dust Bowl. Which searches are better?", bins: "Better search|Weaker search", items: ["Dust Bowl causes 1930s farming|Dust Bowl drought soil erosion", "dust|old weather"], trap: ["dust", 0], why: "Dust alone brings up cleaning tips and everything else.", win: "Specific terms find specific answers." },
    { say: "You want to know how vaccines train the body. Sort the searches.", bins: "Better search|Weaker search", items: ["how vaccines trigger immune response|vaccine antibodies memory cells", "shots|medicine stuff"], trap: ["shots", 0], why: "Shots could mean photos, basketball or anything.", win: "Use the key terms of your question." },
    { say: "You want facts on coral bleaching. Which results would you trust? Sort by yourself.", bins: "Trust more|Trust less", items: ["a marine research institute report|a university ocean science page", "an unsigned post with no date|a store selling reef-safe lotion"], trap: ["a store selling reef-safe lotion", 0] },
  ],
}));
