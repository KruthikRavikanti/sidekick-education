// Steps in Order. Skill RI.2.3-1.
// Describing the connection between steps in technical procedures in a text. Listing steps without order or cause is the known slip.
Sidekick.game(Sidekick.play({
  title: "Steps in Order",
  emoji: "🌰",
  premise: "Some texts tell how to do something. The steps only work when they are in the right order.",
  outro: "Steps in a procedure connect: each one gets things ready for the next.",
  scene: "meadow",
  kind: "row",
  hint: "What has to be done before the next step can happen?",
  tag: "steps_without_order",
  rounds: [
    { say: "Put the steps for planting a seed in order.", seq: "Dig a small hole.|Drop in the seed.|Cover it with soil.|Water it well.", trap: "Drop in the seed.|Dig a small hole.|Cover it with soil.|Water it well.", why: "The seed needs a hole to go into first.", win: "Dig, drop, cover, water." },
    { say: "Put the steps for making toast in order.", seq: "Put bread in the toaster.|Push the lever down.|Wait for it to pop up.|Spread on the butter.", trap: "Spread on the butter.|Put bread in the toaster.|Push the lever down.|Wait for it to pop up.", why: "Butter goes on after the bread is toasted.", win: "In, down, pop, spread." },
    { say: "Put these steps in order by yourself.", alt: [{ seq: "Wet your hands.|Rub them with soap.|Rinse off the bubbles.|Dry them on a towel.", trap: "Rub them with soap.|Wet your hands.|Rinse off the bubbles.|Dry them on a towel." }, { seq: "Fill the pot with water.|Heat it until it boils.|Add the pasta.|Drain the water.", trap: "Add the pasta.|Fill the pot with water.|Heat it until it boils.|Drain the water." }] },
  ],
}));
