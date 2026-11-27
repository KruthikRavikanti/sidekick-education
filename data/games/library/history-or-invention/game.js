// History or Invention?. Skill RL.7.9-1.
// Comparing a fictional portrayal of a time, place or character with a historical account of the same period. Assuming the fiction is accurate is the known slip.
Sidekick.game(Sidekick.play({
  title: "History or Invention?",
  emoji: "🏛️",
  premise: "Historical fiction mixes real events with made-up characters and scenes. Readers need to tell which is which.",
  outro: "Compare fiction with a historical account: note what the author kept, changed or invented.",
  scene: "paper",
  kind: "sort",
  fs: 4.6,
  hint: "Would a history book record this, or did the novelist imagine it?",
  tag: "assumes_fiction_accurate",
  rounds: [
    { say: "A novel is set during the 1906 San Francisco earthquake. Sort the details.", bins: "Historical fact|Invented for the story", items: ["An earthquake struck the city in April 1906.|Fires burned for days afterward.", "A girl named Posy rescues her neighbor’s parrot.|Posy’s diary records every aftershock."], trap: ["Posy’s diary records every aftershock.", 0], why: "Posy is a made-up character, so her diary is invented too.", win: "Real event, invented people." },
    { say: "A novel is set on the first transcontinental railroad. Sort the details.", bins: "Historical fact|Invented for the story", items: ["The two rail lines met in Utah in 1869.|Thousands of workers laid the track by hand.", "A boy called Wen hides a lucky coin under the last rail.|Wen overhears the bosses arguing."], trap: ["A boy called Wen hides a lucky coin under the last rail.", 0], why: "The meeting of the rails is real. Wen and his coin are imagined.", win: "History frames the invented scenes." },
    { say: "A novel is set during the first Moon landing. Sort by yourself.", bins: "Historical fact|Invented for the story", items: ["Astronauts landed on the Moon in July 1969.|Millions watched it on television.", "A janitor’s son sneaks into mission control.|He spots the error that saves the flight."], trap: ["He spots the error that saves the flight.", 0] },
  ],
}));
