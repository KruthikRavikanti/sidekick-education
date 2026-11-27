// Cite the Line. Skill RL.6.1-1.
// Citing textual evidence to support analysis of what the text says explicitly. Summarizing instead of citing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Cite the Line",
  emoji: "🔦",
  premise: "A claim about a story needs proof from the story itself. Find the exact lines that show it.",
  outro: "Citing evidence means pointing to the exact words in the text that prove your claim.",
  scene: "night",
  kind: "pick",
  fs: 4.6,
  hint: "Which lines SHOW the claim happening?",
  tag: "summarizes_instead_of_citing",
  rounds: [
    { say: "Claim: Mara is generous. Tap the two lines that prove it.", mark: "Mara had saved for the skateboard all summer.|*She handed the money to her brother for his class trip.|The shop window glowed across the street.|*“You need it more than I do,” she said.", trap: "Mara had saved for the skateboard all summer.", why: "That line shows she is patient. Which lines show her giving?", win: "She gives the money away and says why." },
    { say: "Claim: Dev is nervous. Tap the two lines that prove it.", mark: "Dev carried his violin case inside.|*His bow hand would not stop shaking.|The hall smelled of floor polish.|*He kept glancing at the exit sign.", trap: "The hall smelled of floor polish.", why: "That describes the hall, not how Dev feels.", win: "A shaking hand and a look at the exit." },
    { say: "Claim: Mr. Finch is lonely. Tap the two lines that prove it by yourself.", mark: "*He set two cups on the table out of habit.|The kettle was blue with a chipped lid.|*He read the same postcard every evening.|Rain tapped on the roof.|His garden grew beans and squash.", trap: "Rain tapped on the roof." },
  ],
}));
