// Author View, My View. Skill RI.3.6-1.
// Distinguishing the reader’s own point of view from that of the author of a text. Assuming the author agrees with the reader is the known slip.
Sidekick.game(Sidekick.play({
  title: "Author View, My View",
  emoji: "🦓",
  premise: "Authors have opinions about their topics. You can understand what the author thinks and still think something else.",
  outro: "Tell the author’s point of view apart from your own.",
  scene: "sand",
  kind: "sort",
  hint: "Is it what the article says, or what a reader might think instead?",
  tag: "assumes_author_agrees",
  rounds: [
    { say: "Read what the author wrote. Sort each view.", read: "Zoos do important work. They protect animals that are in danger and teach visitors to care about them.", bins: "The author|A reader might think", items: ["Zoos protect animals.|Zoos teach people to care.", "Animals belong in the wild.|Cages seem too small."], trap: ["Animals belong in the wild.", 0], why: "This author supports zoos. That is a different view.", win: "The author’s view and another one." },
    { say: "Read what the author wrote. Sort each view.", read: "Every child should learn to swim. It is a skill that can save a life, and it is good exercise too.", bins: "The author|A reader might think", items: ["Swimming can save a life.|It is good exercise.", "Lessons cost too much.|Some kids fear water."], trap: ["Lessons cost too much.", 0], why: "The author does not say that. It is a reader’s concern.", win: "You kept the views apart." },
    { say: "Sort these by yourself.", read: "Homework is a waste of time. Children learn more by playing outside after school.", bins: "The author|A reader might think", items: ["Homework wastes time.|Play teaches more.", "Practice helps me remember.|Some homework is fun."], trap: ["Some homework is fun.", 0] },
  ],
}));
