// Is the Game Worth It?. Skill S-MD.B.5-1.
// Finding the expected payoff for a game of chance. Ignoring the cost to play is the known slip.
Sidekick.game(Sidekick.play({
  title: "Is the Game Worth It?",
  emoji: "🎟️",
  premise: "A game’s expected payoff is what you win on average, minus what you pay to play.",
  outro: "Expected payoff = prize × probability − cost to play. Negative means you lose money on average.",
  scene: "candy",
  kind: "type",
  icon: "🎟️",
  hint: "Find the average winnings. Then subtract the price of playing.",
  tag: "ignores_cost",
  rounds: [
    { say: "A game costs 2 dollars and pays 10 dollars with probability {1/10}. Key in the expected payoff. Use ± for a loss.", q: "10 × {1/10} − 2", ans: -1, trap: 1, why: "1 dollar is the average prize. You paid 2 to play.", win: "1 − 2 = −1 dollar per game." },
    { say: "A raffle ticket costs 5 dollars. The prize is 100 dollars with probability {1/50}. Key in the expected payoff.", q: "100 × {1/50} − 5", ans: -3, trap: 2, why: "2 is the average prize. Subtract the 5 dollar ticket.", win: "2 − 5 = −3 dollars." },
    { say: "Find the expected payoff by yourself.", alt: [{ q: "Cost 3 dollars. Pays 20 dollars with probability {1/10}.", ans: -1, trap: 2 }, { q: "Cost 1 dollar. Pays 6 dollars with probability {1/6}.", ans: 0, trap: 1 }, { q: "Cost 2 dollars. Pays 12 dollars with probability {1/4}.", ans: 1, trap: 3 }] },
  ],
}));
