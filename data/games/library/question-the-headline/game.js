// Question the Headline. Skill S-IC.B.6-1.
// Evaluating reports based on data. Accepting claims without checking the design is the known slip.
Sidekick.game(Sidekick.play({
  title: "Question the Headline",
  emoji: "📰",
  premise: "A number in an ad or a headline is only as good as the study it came from. Ask how it was done before you believe it.",
  outro: "Before trusting a claim, ask: how many, how chosen, who paid, and compared with what?",
  scene: "desk",
  kind: "pick",
  fs: 4.8,
  hint: "Good questions ask about the sample, the method, and who ran the study.",
  tag: "accepts_without_checking",
  rounds: [
    { say: "An ad says 9 out of 10 dentists recommend a toothpaste. Tap the questions worth asking.", yes: "How many dentists were asked?|How were the dentists chosen?|Who paid for the study?", no: "What color is the box?|Is the ad on TV?|Do dentists like mint?", trap: "Is the ad on TV?", why: "Where the ad runs tells you nothing about how the study was done.", win: "Sample size, selection, and funding." },
    { say: "A headline says: Students who eat breakfast get better grades. Sound or shaky?", kind: "sort", bins: "Sound reading|Shaky reading", items: ["Breakfast and grades go together in this group.|Other causes, such as sleep, might explain it.", "Breakfast causes better grades.|Skipping breakfast will lower your grade."], trap: ["Breakfast causes better grades.", 0], why: "Nobody was assigned breakfast. A link is not proof of cause.", win: "A link is not a cause." },
    { say: "A website says 80% of users love the app. Tap the questions worth asking by yourself.", yes: "How many users answered?|Were only happy users asked?|What exactly was the question?", no: "What font is the website?|Is 80 an even number?|Is the app icon blue?", trap: ["-Were only happy users asked?", "Is 80 an even number?"] },
  ],
}));
