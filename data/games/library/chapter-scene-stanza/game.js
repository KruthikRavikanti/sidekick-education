// Chapter, Scene, Stanza. Skill RL.3.5-1.
// Referring to parts of stories, dramas and poems using terms such as chapter, scene and stanza. Mixing up the terms is the known slip.
Sidekick.game(Sidekick.play({
  title: "Chapter, Scene, Stanza",
  emoji: "📚",
  premise: "Books, plays and poems each have their own name for a part. Use the right word for each.",
  outro: "Books have chapters, plays have scenes, and poems have stanzas.",
  scene: "desk",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Is it a book, a play or a poem?",
  tag: "mixes_up_terms",
  rounds: [
    { say: "Name the part.", rows: [["a group of lines in a poem", "stanza"], ["a part of a play", "scene"], ["a part of a long book", "chapter"]], trap: [0, "chapter"], why: "Chapters are in books. A group of lines in a poem is a stanza.", win: "Stanza, scene and chapter." },
    { say: "Drop in the right word.", rows: [["The poem has four ___.", "stanzas"], ["In the first ___ of the play, the king enters.", "scene"], ["I read two ___ of my book.", "chapters"]], trap: [1, "chapters"], why: "A play is divided into scenes.", win: "Stanzas, scene and chapters." },
    { say: "Drop in the words by yourself.", rows: [["The last ___ of the poem rhymes.", "stanza"], ["The play ends with a sad ___.", "scene"], ["___ 3 of the book is the best.", "Chapter"]], extra: "page", trap: [0, "Chapter"] },
  ],
}));
