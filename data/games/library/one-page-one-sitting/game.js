// One Page, One Sitting. Skill W.4.6-1.
// Using technology to produce and publish writing, with sufficient keyboarding to type a page in a single sitting. Very slow typing is the known slip.
Sidekick.game(Sidekick.play({
  title: "One Page, One Sitting",
  emoji: "⌨️",
  premise: "Good typing habits help you finish a whole page without getting tired: home row, eyes on the screen, steady pace.",
  outro: "Use keyboarding skills and tools to produce and publish a full page.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Which habit or tool does that job?",
  tag: "slow_typing_habits",
  rounds: [
    { say: "Match each typing habit to why it helps.", rows: [["fingers on the home row", "reach every key quickly"], ["eyes on the screen", "catch slips as you type"], ["sit up straight", "type longer without tiring"]], trap: [0, "catch slips as you type"], why: "The home row keeps every key within reach.", win: "Three habits for a full page." },
    { say: "Put the steps in order to publish a page.", kind: "row", seq: "Type the whole draft.|Use spell check.|Format the title and paragraphs.|Save and share it.", trap: "Format the title and paragraphs.|Type the whole draft.|Use spell check.|Save and share it.", why: "Get the words down first. Formatting comes later.", win: "Draft, check, format, share." },
    { say: "Match each tool to its job by yourself.", rows: [["undo", "take back the last change"], ["copy and paste", "move text to a new spot"], ["word count", "see how much you wrote"]], extra: "erase the whole file|", trap: [0, "erase the whole file"] },
  ],
}));
