// Dot Lantern. Skill K.CC.C.7-2.
// Connecting numerals to quantities: the child lights dots to picture each number, so the greater numeral is seen as the bigger amount.
Sidekick.game(Sidekick.play({
  title: "Dot Lantern",
  emoji: "🏮",
  premise: "The lantern lights one dot for every number you give it. Light up the greater number to see how much it really is.",
  outro: "A number is an amount. Picture the dots to see which is greater.",
  scene: "night",
  kind: "dial",
  cast: "🏮 🌙 ⭐ ⭐",
  hint: "Try both numbers. Which one lights more dots?",
  tag: "picks_the_smaller_number",
  dials: [["Lights", 0, 10]],
  view: { type: "array", icon: "🟡", per: 5 },
  rounds: [
    { say: "Which is greater, 8 or 5? Light that many dots.", ans: [8], trap: [5], why: "Picture both. 8 dots fill more than 5 dots.", win: "8 lights more dots than 5." },
    { say: "Which is greater, 6 or 9? Light that many dots.", ans: [9], trap: [6], why: "9 lights more dots than 6.", win: "9 is the greater amount." },
    { say: "Light the greater number by yourself.", alt: [{ say: "Which is greater, 7 or 4? Light that many dots.", ans: [7], trap: [4] }, { say: "Which is greater, 10 or 7? Light that many dots.", ans: [10], trap: [7] }, { say: "Which is greater, 3 or 8? Light that many dots.", ans: [8], trap: [3] }] },
  ],
}));
