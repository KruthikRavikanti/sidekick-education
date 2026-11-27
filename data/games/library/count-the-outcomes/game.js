// Count the Outcomes. Skill 7.SP.C.8-1.
// Understanding that the probability of a compound event is the fraction of outcomes in the sample space. Adding the separate probabilities is the known slip.
Sidekick.game(Sidekick.play({
  title: "Count the Outcomes",
  emoji: "🪙",
  premise: "For two things happening together, list every combined outcome. The probability is the fraction of the list you want.",
  outro: "Compound probability = outcomes you want ÷ all outcomes in the sample space.",
  scene: "candy",
  kind: "type",
  icon: "🪙",
  hint: "How many combined outcomes are there? How many are the one you want?",
  tag: "adds_probabilities",
  rounds: [
    { say: "Key in P(two heads) as a fraction.", q: "Flip two coins. Outcomes: HH, HT, TH, TT", ans: "1/4", trap: "1/2", trap2: "1", why: "Only 1 of the 4 outcomes is HH.", why2: "Adding one half and one half gives 1, a sure thing. Count the outcomes.", win: "1 outcome out of 4." },
    { say: "Key in P(6 and heads) as a fraction.", q: "Roll a die and flip a coin. There are 12 outcomes.", ans: "1/12", trap: "2/3", why: "Adding one sixth and one half is not it. Only 1 of the 12 outcomes is 6 with heads.", win: "1 outcome out of 12." },
    { say: "Find the probability by yourself, as a fraction.", alt: [{ q: "Spin a 3-color spinner twice. There are 9 outcomes. What is P(red both times)?", ans: "1/9", trap: "2/3" }, { q: "Flip three coins. There are 8 outcomes. What is P(three tails)?", ans: "1/8", trap: "3/2" }, { q: "Roll two dice. There are 36 outcomes. What is P(two sixes)?", ans: "1/36", trap: "1/3" }] },
  ],
}));
