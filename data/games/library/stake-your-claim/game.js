// Stake Your Claim. Skill W.6.1-1.
// Introducing claims and organizing reasons and evidence clearly. Giving an opinion without a clear claim is the known slip.
Sidekick.game(Sidekick.play({
  title: "Stake Your Claim",
  emoji: "📣",
  premise: "An argument starts with a claim: one clear sentence that takes a side. Reasons come next.",
  outro: "A claim states a position someone could disagree with. A topic or a feeling is not yet a claim.",
  scene: "city",
  kind: "sort",
  fs: 4.8,
  hint: "Does it take a clear side that someone could argue against?",
  tag: "no_clear_claim",
  rounds: [
    { say: "Clear claim, or not a claim yet?", bins: "Clear claim|Not yet", items: ["Phones should stay in lockers during class.|Our school should start an hour later.", "Phones are a thing kids have.|I am going to write about phones."], trap: ["I am going to write about phones.", 0], why: "That announces a topic. It does not take a side.", win: "A claim takes a side." },
    { say: "Build the introduction: hook, then claim, then reasons.", kind: "row", fs: 4.6, seq: "Imagine losing ten minutes of every lesson.|Phones should stay in lockers during class.|They distract, tempt cheating and break focus.", trap: "Phones should stay in lockers during class.|Imagine losing ten minutes of every lesson.|They distract, tempt cheating and break focus.", why: "Catch the reader first. Then state the claim.", win: "Hook, claim, reasons." },
    { say: "Sort these by yourself.", bins: "Clear claim|Not yet", items: ["The town should build a bike path to school.|Students need a longer lunch break.", "Lunch is a time of day.|This essay is about bikes."], trap: ["This essay is about bikes.", 0] },
  ],
}));
