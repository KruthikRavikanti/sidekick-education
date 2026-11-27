// Pick the Right Entry. Skill L.4.4-3.
// Consulting reference materials to find the pronunciation and precise meaning of key words. Picking the first definition is the known slip.
Sidekick.game(Sidekick.play({
  title: "Pick the Right Entry",
  emoji: "⏱️",
  premise: "A dictionary may list several meanings, and even two ways to say a word. Choose the one that fits your sentence.",
  outro: "Do not stop at the first definition. Choose the one that fits the context.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Read every entry. Which one makes sense in the sentence?",
  tag: "picks_first_definition",
  rounds: [
    { say: "The word minute has two entries. Which fits each sentence?", fig: { type: "table", rows: [["minute (MIN-it)", "60 seconds"], ["minute (my-NOOT)", "extremely small"]] }, rows: [["Wait one minute.", "60 seconds"], ["A minute speck of dust.", "extremely small"]], extra: "a clock|", trap: [1, "60 seconds"], why: "A speck of dust is not a length of time. Use the second entry.", win: "Two meanings and two pronunciations." },
    { say: "The word wind has two entries. Which fits each sentence?", fig: { type: "table", rows: [["wind (rhymes with pinned)", "moving air"], ["wind (rhymes with find)", "to twist or turn"]] }, rows: [["The wind blew my hat off.", "moving air"], ["Wind the string around it.", "to twist or turn"]], extra: "a storm|", trap: [1, "moving air"], why: "You cannot blow air around a string. Use the second entry.", win: "The sentence tells you which entry." },
    { say: "The word lead has two entries. Match by yourself.", fig: { type: "table", rows: [["lead (rhymes with bed)", "a heavy metal"], ["lead (rhymes with seed)", "to guide"]] }, rows: [["The pipe was made of lead.", "a heavy metal"], ["She will lead the hike.", "to guide"]], extra: "a pencil|to follow", trap: [1, "a heavy metal"] },
  ],
}));
