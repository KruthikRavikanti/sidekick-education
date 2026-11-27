// Were They There?. Skill RI.4.6-1.
// Comparing a firsthand and secondhand account of the same event. Not being able to tell which is which is the known slip.
Sidekick.game(Sidekick.play({
  title: "Were They There?",
  emoji: "📔",
  premise: "A firsthand account is by someone who was there. A secondhand account is by someone who learned about it later.",
  outro: "Firsthand accounts come from people who were there. Secondhand accounts retell it.",
  scene: "paper",
  kind: "sort",
  hint: "Did the writer see it happen, or learn about it afterward?",
  tag: "cannot_tell_accounts_apart",
  rounds: [
    { say: "Is each one firsthand or secondhand?", bins: "Firsthand|Secondhand", items: ["a diary by a passenger on the ship|a letter from a soldier at the battle", "a textbook chapter about the ship|a news story written years later"], trap: ["a textbook chapter about the ship", 0], why: "A textbook author was not on the ship. That is secondhand.", win: "There, or not there." },
    { say: "Sort these sentences about a flood.", bins: "Firsthand|Secondhand", items: ["I watched the water climb our stairs.|We carried Grandma to the roof.", "The flood damaged 300 homes, reports say.|Residents described rising water."], trap: ["Residents described rising water.", 0], why: "The writer is reporting what others said.", win: "I and we often signal firsthand." },
    { say: "Sort these by yourself.", bins: "Firsthand|Secondhand", items: ["an interview with an astronaut about her flight|a photo caption by the photographer", "a biography of the astronaut|an encyclopedia entry on the flight"], trap: ["a biography of the astronaut", 0] },
  ],
}));
