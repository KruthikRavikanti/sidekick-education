// Is It Really Fair?. Skill S-MD.B.6-1.
// Using probabilities to make fair decisions. Thinking a choice is fair if it feels fair is the known slip.
Sidekick.game(Sidekick.play({
  title: "Is It Really Fair?",
  emoji: "⚖️",
  premise: "A fair way to choose gives every person the same chance. Feeling fair is not enough: check the probabilities.",
  outro: "A decision is fair when every option has an equal probability.",
  scene: "desk",
  kind: "sort",
  fs: 4.6,
  hint: "Work out each person’s chance. Are they all equal?",
  tag: "feels_fair",
  rounds: [
    { say: "Three friends need to pick one person. Is each method fair?", bins: "Fair|Not fair", items: ["Roll a die: 1 or 2 Ann, 3 or 4 Ben, 5 or 6 Cal|Draw one of three equal name slips from a hat", "Flip a coin: heads Ann, tails Ben, on its edge Cal|Flip two coins: two heads Ann, two tails Ben, one of each Cal"], trap: ["Flip two coins: two heads Ann, two tails Ben, one of each Cal", 0], why: "One of each comes up half of the time. Cal gets double the chance.", win: "Equal chances for all three." },
    { say: "Flip two coins. Key in the probability of one head and one tail, as a fraction.", kind: "type", icon: "🪙", q: "HH · HT · TH · TT", ans: "2/4", trap: "1/3", why: "There are 4 equally likely results, and two of them (HT and TH) are mixed.", win: "2 of 4, which is one half." },
    { say: "Two players need a fair game. Sort these by yourself.", bins: "Fair|Not fair", items: ["Roll a die: even you win, odd I win|Flip a coin: heads you, tails me", "Roll a die: 6 you win, anything else I win|Roll two dice: a sum of 7 you win, any other sum I win"], trap: ["Roll two dice: a sum of 7 you win, any other sum I win", 0] },
  ],
}));
