// Read From the Inside. Skill RL.9-10.6-1.
// Analyzing a point of view or cultural experience reflected in a work of literature from outside the United States. Judging by one’s own culture only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Read From the Inside",
  emoji: "🌏",
  premise: "Literature from another part of the world carries its own customs and values. Read it on its own terms before measuring it against yours.",
  outro: "Analyze a cultural point of view using what the text shows, not your own customs.",
  scene: "forest",
  kind: "sort",
  fs: 4.4,
  hint: "Does the statement use what the passage shows about these people, or the reader’s own habits?",
  tag: "judges_by_own_culture",
  rounds: [
    { say: "Which readings are grounded in the text?", fs: 4.2, read: "At New Year, Aiko pours tea for her grandfather first. The children wait, hands folded, until he lifts his cup.", bins: "Grounded in the text|Judging from outside", items: ["Serving elders first shows respect.|Waiting is part of the ritual.", "Making children wait is unfair.|They should just start eating."], trap: ["Making children wait is unfair.", 0], why: "Unfair measures the scene by another household’s rules. The text shows calm, willing waiting.", win: "Start from what the passage shows." },
    { say: "Sort these readings.", read: "When the rains come late, the elders gather under the baobab. No one speaks before the oldest woman. Her word sets the planting date.", bins: "Grounded in the text|Judging from outside", items: ["Age carries authority here.|The village decides in a set order.", "A weather app would be smarter.|One person should not decide."], trap: ["A weather app would be smarter.", 0], why: "That swaps in a modern habit. The passage shows whose voice this village trusts.", win: "The text’s values first." },
    { say: "Sort these by yourself.", read: "Mateo’s family brings marigolds and his aunt’s favorite bread to her grave. They eat beside it and tell her the year’s news, laughing.", bins: "Grounded in the text|Judging from outside", items: ["The dead stay part of family life.|Remembering is joyful here.", "Laughing at a grave is rude.|A picnic there is strange."], trap: ["Laughing at a grave is rude.", 0] },
  ],
}));
