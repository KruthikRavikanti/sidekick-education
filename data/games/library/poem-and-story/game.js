// Poem and Story. Skill RL.6.9-1.
// Comparing texts in different forms or genres in their approaches to similar themes. Summarizing each one instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Poem and Story",
  emoji: "🪁",
  premise: "A poem and a story can share a theme and treat it in very different ways.",
  outro: "Compare genres by HOW each one handles the same theme: images and sound, or characters and events.",
  scene: "sky",
  kind: "sort",
  fs: 4.8,
  hint: "Is this about how the poem works, how the story works, or what they share?",
  tag: "summarizes_each",
  rounds: [
    { say: "Both are about missing someone. Sort each description.", read: "POEM: The swing still sways / where no one sits. / I count the days / in little bits. / STORY: Each afternoon Eli walked past his best friend’s empty porch. The moving truck had left a week ago.", bins: "The poem|The story|Both", items: ["uses rhyme and short lines|", "follows a character through events|", "shows missing someone|"], trap: ["shows missing someone", 0], why: "The story is about that too. It belongs to both.", win: "Same theme, different tools." },
    { say: "Sort these.", read: "POEM: The swing still sways / where no one sits. / I count the days / in little bits. / STORY: Each afternoon Eli walked past his best friend’s empty porch. The moving truck had left a week ago.", bins: "The poem|The story|Both", items: ["one image carries the feeling|", "names a person and a place|", "never says the word sad|"], trap: ["never says the word sad", 1], why: "Neither one names the feeling. Both show it.", win: "Both show the feeling without naming it." },
    { say: "Both are about courage. Sort these by yourself.", read: "POEM: Small boat, big sea, / still I row. / STORY: Tess gripped the microphone. Her knees shook, and she began to sing anyway.", bins: "The poem|The story|Both", items: ["uses a boat as a symbol|", "shows a girl acting bravely|", "is about going on despite fear|"], trap: ["is about going on despite fear", 0] },
  ],
}));
