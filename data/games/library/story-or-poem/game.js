// Story or Poem?. Skill RL.K.5-1.
// Recognizing common types of texts: storybooks and poems are told apart by their features. Not knowing how a poem differs from a story is the known slip.
Sidekick.game(Sidekick.play({
  title: "Story or Poem?",
  emoji: "📜",
  premise: "Stories and poems look and sound different. Poems have short lines, a beat, and often words that rhyme.",
  outro: "A poem has short lines and often rhymes. A story tells what happens to characters.",
  scene: "paper",
  kind: "sort",
  hint: "Are the lines short, with rhyming words at the ends?",
  tag: "cannot_tell_poem_from_story",
  rounds: [
    { say: "Read this. Is it a story or a poem?", kind: "fill", cast: "", read: "A cat sat down / upon a mat. / She saw a mouse / and tipped her hat.", rows: [["This is a", "poem"]], extra: "story|list", trap: [0, "story"], why: "Look at the short lines. Mat and hat rhyme.", win: "Short lines that rhyme make a poem." },
    { say: "Sort each clue.", bins: "Story|Poem", items: ["tells what happens first, next and last|has characters with a problem", "has short lines that rhyme|has a beat like a song"], trap: ["has a beat like a song", 0], why: "A beat like a song belongs to a poem.", win: "Now you can tell them apart." },
    { say: "Sort these by yourself.", bins: "Story|Poem", items: ["is written in long sentences|has a beginning, middle and end", "rhymes at the ends of lines|is written in short lines|can be clapped to a beat"], trap: ["is written in short lines", 0] },
  ],
}));
