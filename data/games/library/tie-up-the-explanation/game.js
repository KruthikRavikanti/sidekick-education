// Tie Up the Explanation. Skill W.7.2-4.
// Providing a concluding statement that follows from and supports the information presented. Leaving out a conclusion is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tie Up the Explanation",
  emoji: "🎗️",
  premise: "After explaining something, leave the reader with the big picture: what it all adds up to.",
  outro: "A conclusion follows from the explanation and supports it.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Does it sum up the explanation the reader just finished?",
  tag: "no_conclusion",
  rounds: [
    { say: "The piece explained how hurricanes form. Which endings fit?", bins: "Fits|Does not fit", items: ["Warm seas, moist air and spin together build a hurricane.|Knowing how they form helps people prepare in time.", "Tornadoes are different.|I once saw a big wave."], trap: ["Tornadoes are different.", 0], why: "That opens a new subject. A conclusion closes this one.", win: "Sum up the explanation." },
    { say: "The piece explained how the telegraph changed news. Sort the endings.", bins: "Fits|Does not fit", items: ["With one wire, news that took weeks arrived in minutes.|The telegraph made the world feel smaller.", "Phones came later.|My grandpa collects stamps."], trap: ["Phones came later.", 0], why: "True, but it starts a different topic.", win: "End on the main idea." },
    { say: "The piece explained why leaves change color. Sort by yourself.", bins: "Fits|Does not fit", items: ["As green fades, the colors hidden all summer appear.|Autumn color is chemistry on display.", "Pine trees stay green.|Raking is boring."], trap: ["Pine trees stay green.", 0] },
  ],
}));
