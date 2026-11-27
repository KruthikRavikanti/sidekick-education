// Deep Dive Math. Skill 7.NS.A.3-1.
// Solving real-world problems involving the four operations with rational numbers. Dropping negative signs in multi-step work is the known slip.
Sidekick.game(Sidekick.play({
  title: "Deep Dive Math",
  emoji: "🤿",
  premise: "Real problems mix operations with negative numbers. Keep track of the sign at every step.",
  outro: "Carry the negative sign through each step of a multi-step problem.",
  scene: "ocean",
  kind: "type",
  icon: "🤿",
  hint: "Going down adds a negative. Work out the total change first.",
  tag: "drops_negative_signs",
  rounds: [
    { say: "Key in where the diver ends up.", q: "A diver is at −40 feet and goes down 15 feet 3 more times.", ans: -85, trap: 5, why: "Going down makes it more negative: −40 − 45.", win: "−40 − 45 = −85 feet." },
    { say: "Key in the final temperature.", q: "It is −6 degrees. It drops 4 degrees each hour for 3 hours.", ans: -18, trap: 6, why: "Dropping 12 from −6 goes lower: −6 − 12.", win: "−6 − 12 = −18 degrees." },
    { say: "Solve it by yourself.", alt: [{ q: "A balance is −20 dollars. Then 10 dollars is withdrawn 4 times.", ans: -60, trap: 20 }, { q: "A submarine at −50 meters rises 12 meters twice.", ans: -26, trap: -74 }, { q: "An elevator at floor −2 goes down 1 floor 3 times.", ans: -5, trap: 1 }] },
  ],
}));
