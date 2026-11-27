// An Ending That Earns It. Skill W.9-10.1-5.
// Providing a concluding statement that follows from and supports the argument. Repeating the introduction is the known slip.
Sidekick.game(Sidekick.play({
  title: "An Ending That Earns It",
  emoji: "🛬",
  premise: "A conclusion should follow from the evidence and leave the reader with the point. Copying the first paragraph is not landing.",
  outro: "A concluding section follows from and supports the argument, and shows what it adds up to.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Does it pull the evidence together, or just say the first sentence again?",
  tag: "repeats_intro",
  rounds: [
    { say: "The essay argued for later school start times. Strong ending or weak?", bins: "Strong ending|Weak ending", items: ["Sleep, attendance and grades all improve, so a later bell is worth it.|The evidence points one way: start later.", "In this essay I talked about start times.|School should start later, as I said."], trap: ["School should start later, as I said.", 0], why: "That only repeats the claim. A strong ending gathers up the evidence.", win: "Tie it together." },
    { say: "Put this closing paragraph in order.", kind: "row", fs: 4.4, seq: "The three studies agree.|Later starts raise sleep and attendance.|So the board should move the first bell to 8:30.", trap: "So the board should move the first bell to 8:30.|The three studies agree.|Later starts raise sleep and attendance.", why: "So signals a result. It follows the evidence.", win: "Evidence, then the call." },
    { say: "The essay argued for a school garden. Sort these endings by yourself.", bins: "Strong ending|Weak ending", items: ["A garden would feed the cafeteria and teach science at once.|For a small cost, students gain a living classroom.", "That is all I have to say about gardens.|As stated in my first paragraph, gardens are good."], trap: ["As stated in my first paragraph, gardens are good.", 0] },
  ],
}));
