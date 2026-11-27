// Trim to the Main Points. Skill RI.5.2-2.
// Summarizing an informational text. Including minor details is the known slip.
Sidekick.game(Sidekick.play({
  title: "Trim to the Main Points",
  emoji: "✂️",
  premise: "A summary keeps the main ideas and drops the minor details, the numbers and the side notes.",
  outro: "Summarize with main ideas only. Leave out minor details.",
  scene: "paper",
  kind: "pick",
  hint: "Is this a main point, or a small detail that supports one?",
  tag: "includes_minor_details",
  rounds: [
    { say: "Read the article. Tap the sentences that belong in a summary.", read: "Volcanoes form where melted rock rises through the crust. One in Hawaii has erupted since 1983. Eruptions can destroy towns, but volcanic soil is rich for farming. The word comes from Vulcan, a Roman god.", yes: "Volcanoes form where melted rock rises.|They can destroy, but they also enrich soil.", no: "One has erupted since 1983.|The word comes from a Roman god.", trap: "The word comes from a Roman god.", why: "That is an interesting side note, not a main point.", win: "How they form, and what they do." },
    { say: "Read this article. Tap the sentences for a summary.", read: "The Amazon rain forest produces much of the world’s oxygen. It is home to a tenth of all known species. A sloth there can sleep fifteen hours a day. Logging is shrinking the forest every year.", yes: "The Amazon is vital for oxygen and wildlife.|Logging is shrinking it.", no: "A sloth sleeps fifteen hours a day.|It has a tenth of all species.", trap: "A sloth sleeps fifteen hours a day.", why: "That is a fun detail, but not a main point.", win: "Why it matters, and what threatens it." },
    { say: "Tap the summary sentences by yourself.", read: "Lighthouses once guided ships past dangerous rocks. Keepers lit oil lamps every night. One lamp in Maine burned whale oil. Today most are automated or replaced by satellites.", yes: "Lighthouses guided ships past danger.|Most are now automated or replaced.", no: "One lamp in Maine burned whale oil.|Keepers lit lamps nightly.", trap: "One lamp in Maine burned whale oil." },
  ],
}));
