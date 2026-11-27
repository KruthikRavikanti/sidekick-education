// Link and Cite. Skill W.7.6-1.
// Using technology to produce and publish writing and to link to and cite sources. Not citing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Link and Cite",
  emoji: "🔗",
  premise: "When you publish online, readers should be able to follow your facts back to where you found them.",
  outro: "Cite sources and link to them so readers can check the information.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Can the reader tell where this fact came from?",
  tag: "does_not_cite",
  rounds: [
    { say: "Which sentences cite their source?", bins: "Cited|Not cited", items: ["According to the National Weather Service, 2023 was the warmest year on record.|Sea levels rose 20 cm last century (Lee, 2021).", "It was the warmest year ever.|Sea levels are going up a lot."], trap: ["It was the warmest year ever.", 0], why: "Says who? There is no source for the reader to check.", win: "Name the source." },
    { say: "Tap everything a helpful online citation includes.", kind: "pick", fs: 5.2, yes: "the author or organization|the title|a working link", no: "your password|a random emoji", trap: "-a working link", why: "A link lets the reader visit the source.", win: "Who, what, and where to find it." },
    { say: "Sort these by yourself.", bins: "Cited|Not cited", items: ["A study in Science found that crows use tools (Roy, 2019).|The city library reports 40,000 visits a year.", "Crows are smart, studies show.|Lots of people visit."], trap: ["Crows are smart, studies show.", 0] },
  ],
}));
