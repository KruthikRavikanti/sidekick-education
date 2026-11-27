// Tone Toward the Subject. Skill RI.8.4-1.
// Analyzing the impact of specific word choices on meaning and tone, including analogies or allusions to other texts. Naming words only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tone Toward the Subject",
  emoji: "🌡️",
  premise: "An author’s feelings about a subject leak through word choice. The same inventor can be a pioneer or a tinkerer.",
  outro: "Analyze how word choices reveal the author’s tone toward the subject.",
  scene: "city",
  kind: "sort",
  fs: 4.6,
  hint: "Does this phrase make the subject sound impressive or foolish?",
  tag: "names_only",
  rounds: [
    { say: "An author describes an inventor. What tone does each phrase set?", bins: "Admiring|Mocking", items: ["a fearless pioneer|a modern Edison", "a basement tinkerer|a dreamer chasing gadgets"], trap: ["a basement tinkerer", 0], why: "Tinkerer makes the work sound small and unserious.", win: "Word choice shows attitude." },
    { say: "An author describes a new law. Sort the phrases.", bins: "Admiring|Mocking", items: ["a landmark reform|a long-overdue remedy", "a bandage on a broken leg|a paper tiger"], trap: ["a bandage on a broken leg", 0], why: "The comparison says the law is far too weak for the problem.", win: "Analogies carry tone too." },
    { say: "An author describes a city’s new statue. Sort by yourself.", bins: "Admiring|Mocking", items: ["a soaring tribute|a gift to future generations", "an expensive lump of bronze|the mayor’s shiny toy"], trap: ["the mayor’s shiny toy", 0] },
  ],
}));
