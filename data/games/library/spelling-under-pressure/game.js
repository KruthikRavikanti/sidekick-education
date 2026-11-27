// Spelling Under Pressure. Skill L.7.2-2.
// Spelling correctly. Relying on spellcheck is the known slip.
Sidekick.game(Sidekick.play({
  title: "Spelling Under Pressure",
  emoji: "🔤",
  premise: "Double letters and silent letters cause most spelling slips. Know which words have them.",
  outro: "Learn the tricky spots: embarrass, occasion, recommend, rhythm.",
  scene: "desk",
  kind: "sort",
  fs: 6,
  hint: "Which letters are doubled? Is anything silent?",
  tag: "relies_on_spellcheck",
  rounds: [
    { say: "Which are spelled correctly?", bins: "Spelled right|Needs fixing", items: ["embarrass|occasion|recommend", "embarass|occassion|reccomend"], trap: ["embarass", 0], why: "Embarrass has two r’s and two s’s.", win: "Embarrass, occasion, recommend." },
    { say: "Sort these.", bins: "Spelled right|Needs fixing", items: ["rhythm|accommodate|privilege", "rythm|acommodate|priviledge"], trap: ["rythm", 0], why: "Rhythm has an h after the r: r-h-y-t-h-m.", win: "Rhythm, accommodate, privilege." },
    { say: "Sort these by yourself.", bins: "Spelled right|Needs fixing", items: ["conscience|necessary|tomorrow", "concience|neccesary|tommorow"], trap: ["tommorow", 0] },
  ],
}));
