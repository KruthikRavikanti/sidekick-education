// My View, Their View. Skill RL.3.6-1.
// Distinguishing the reader’s own point of view from that of the narrator or the characters. Assuming the narrator thinks like the reader is the known slip.
Sidekick.game(Sidekick.play({
  title: "My View, Their View",
  emoji: "👓",
  premise: "The narrator has feelings about what happens. You are allowed to feel differently. Know which view is whose.",
  outro: "Your point of view can differ from the narrator’s or a character’s.",
  scene: "city",
  kind: "sort",
  hint: "Did the narrator say it in the story, or is it what a reader might think?",
  tag: "assumes_narrator_agrees",
  rounds: [
    { say: "Read what the narrator says. Sort each view.", read: "I could not stand the new kid. He was always showing off his fancy shoes.", bins: "The narrator|A reader might think", items: ["The new kid shows off.|I cannot stand him.", "Maybe he is just nervous.|That seems unfair to him."], trap: ["Maybe he is just nervous.", 0], why: "The narrator never says that. It is a different way to see it.", win: "Two different points of view." },
    { say: "Read what the narrator says. Sort each view.", read: "Rainy days are the worst. There is nothing to do but stare out the window.", bins: "The narrator|A reader might think", items: ["Rainy days are the worst.|There is nothing to do.", "Rain is cozy.|You could read or build a fort."], trap: ["Rain is cozy.", 0], why: "The narrator hates rain. Cozy is someone else’s view.", win: "The narrator and you can disagree." },
    { say: "Sort these by yourself.", read: "My sister’s puppy is a pest. It chews my socks and barks all night.", bins: "The narrator|A reader might think", items: ["The puppy is a pest.|It chews socks.", "Puppies need time to learn.|It sounds cute."], trap: ["It sounds cute.", 0] },
  ],
}));
