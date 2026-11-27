// Trust This Source?. Skill W.6.8-1.
// Gathering relevant information from multiple sources and assessing the credibility of each. Using any site at all is the known slip.
Sidekick.game(Sidekick.play({
  title: "Trust This Source?",
  emoji: "🕵️",
  premise: "Not every website deserves your trust. Ask who wrote it, how they know, and whether they are selling something.",
  outro: "Credible sources name expert authors, give evidence and are not trying to sell or trick you.",
  scene: "desk",
  kind: "sort",
  fs: 4.6,
  hint: "Who wrote it? Are they experts? Is anything being sold?",
  tag: "uses_any_site",
  rounds: [
    { say: "For a science report, which sources are more credible?", bins: "More credible|Less credible", items: ["a university biology department page|a museum’s article with sources listed", "an anonymous blog post|an ad for a miracle vitamin"], trap: ["an anonymous blog post", 0], why: "With no author named, you cannot tell how they know.", win: "Experts and listed sources earn trust." },
    { say: "Sort these.", bins: "More credible|Less credible", items: ["a government weather service|an encyclopedia entry by a named scientist", "a comment under a video|a site selling the product it praises"], trap: ["a site selling the product it praises", 0], why: "A seller has a reason to exaggerate.", win: "Check who gains from the claim." },
    { say: "Sort these by yourself.", bins: "More credible|Less credible", items: ["a hospital’s health guide|a science journal for students", "a meme with no source|a forum post by “catlover99”"], trap: ["a meme with no source", 0] },
  ],
}));
