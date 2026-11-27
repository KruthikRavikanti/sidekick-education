// Fix the Biggest Thing First. Skill W.11-12.5-1.
// Developing and strengthening writing by planning, revising, editing, rewriting or trying a new approach. Only editing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fix the Biggest Thing First",
  emoji: "🧰",
  premise: "Strong writers revise in order of importance: purpose and argument first, structure next, sentences last.",
  outro: "Strengthen writing by planning, revising, editing and rewriting, addressing what is most significant for purpose and audience.",
  scene: "desk",
  kind: "sort",
  fs: 4.2,
  hint: "Would fixing this change what the piece says, or only how it looks?",
  tag: "only_edits",
  rounds: [
    { say: "A draft is due. Which problems come first?", bins: "Address first|Address last", items: ["the thesis does not match the evidence|the audience would not know two key terms", "one comma is missing|a word is repeated twice"], trap: ["one comma is missing", 0], why: "A comma is quick and small. A thesis that does not fit undermines everything.", win: "Big problems before small ones." },
    { say: "Match each stage to its question.", kind: "fill", fs: 4.4, cast: "", rows: [["planning", "What am I trying to do, and for whom?"], ["revising", "Do the ideas and order work?"], ["editing", "Is every sentence correct and clean?"]], trap: [1, "Is every sentence correct and clean?"], why: "Sentence-level cleanup is editing. Revising asks about ideas and order.", win: "Purpose, ideas, polish." },
    { say: "Sort these by yourself.", bins: "Address first|Address last", items: ["the strongest point is hidden in paragraph four|the conclusion contradicts the opening", "a title is not capitalized|two spaces follow a period"], trap: ["a title is not capitalized", 0] },
  ],
}));
