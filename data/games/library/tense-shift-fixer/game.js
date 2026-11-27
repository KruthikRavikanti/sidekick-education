// Tense Shift Fixer. Skill L.5.1-4.
// Recognizing and correcting inappropriate shifts in verb tense. Shifting tense in the middle of a story is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tense Shift Fixer",
  emoji: "🔧",
  premise: "A story should stay in one tense. A verb that jumps to another tense for no reason is a shift.",
  outro: "Keep verbs in the same tense unless the time actually changes.",
  scene: "desk",
  kind: "pick",
  fs: 5.4,
  hint: "What tense is the rest of the sentence in? Which verb does not match?",
  tag: "shifts_tense",
  rounds: [
    { say: "This story is in the past. Tap the verb that shifts tense.", mark: "She walked in and *sits down.", trap: "walked", why: "Walked is in the past, like the story. Which verb jumps to the present?", win: "Sits should be sat." },
    { say: "This story is in the past. Tap the verbs that shift tense.", mark: "He opened the box, *looks inside, and *gasps.", trap: "opened", why: "Opened matches the past. Find the verbs that jump to the present.", win: "Looks and gasps should be looked and gasped." },
    { say: "Tap the verbs that shift tense, by yourself.", alt: [{ mark: "We hiked all day, *reach the lake, and *set up camp.", trap: "hiked" }, { mark: "The dog barked, *runs to the gate, and *wags its tail.", trap: "barked," }] },
  ],
}));
