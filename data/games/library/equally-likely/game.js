// Equally Likely. Skill 7.SP.C.7-1.
// Developing a uniform probability model and using it to find probabilities. Assuming outcomes are equally likely when they are not is the known slip.
Sidekick.game(Sidekick.play({
  title: "Equally Likely",
  emoji: "🎲",
  premise: "When every outcome is equally likely, probability is a count: outcomes you want over all outcomes.",
  outro: "P(event) = favorable outcomes ÷ total equally likely outcomes.",
  scene: "candy",
  kind: "type",
  icon: "🎲",
  hint: "Count every single marble or section, not just the colors.",
  tag: "assumes_equally_likely",
  rounds: [
    { say: "Key in the probability as a fraction.", q: "A fair die is rolled. What is P(5)?", ans: "1/6", trap: "1/2", why: "It is not just 5 or not 5. There are 6 equally likely faces.", win: "1 face out of 6." },
    { say: "Key in P(red) as a fraction.", pic: "🔴🔴🔴🔵🔵🔵🔵🔵", q: "One marble is picked without looking.", ans: "3/8", trap: "1/2", why: "Two colors, but not equal amounts. Count the marbles: 3 red out of 8.", win: "3 red out of 8 marbles." },
    { say: "Find the probability by yourself, as a fraction.", alt: [{ q: "A bag has 2 red, 3 blue and 5 green marbles. What is P(blue)?", ans: "3/10", trap: "1/3" }, { q: "A spinner has 8 equal sections. 3 are green. What is P(green)?", ans: "3/8", trap: "1/3" }, { q: "A bag has 1 gold and 4 silver coins. What is P(gold)?", ans: "1/5", trap: "1/2" }] },
  ],
}));
