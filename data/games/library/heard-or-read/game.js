// Heard or Read?. Skill RI.7.7-1.
// Comparing a text to an audio or video version, analyzing each medium’s portrayal of the subject. Listing the differences only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Heard or Read?",
  emoji: "🎧",
  premise: "A speech on the page and the same speech aloud hit differently. Delivery adds things print cannot.",
  outro: "Analyze how each medium portrays the subject: voice and pauses when heard, rereading and layout on the page.",
  scene: "city",
  kind: "sort",
  fs: 4.4,
  hint: "Does this come from the speaker’s delivery, or from the printed words?",
  tag: "lists_differences_only",
  rounds: [
    { say: "Where does each effect come from?", bins: "Hearing it|Reading it|Both", items: ["a pause that makes the crowd wait|a voice that rises with feeling", "rereading a hard line|", "the same words and ideas|"], trap: ["rereading a hard line", 0], why: "A live speech goes by once. On the page you can go back.", win: "Delivery belongs to sound. Rereading belongs to print." },
    { say: "Sort these.", bins: "Hearing it|Reading it|Both", items: ["the crowd cheering|", "seeing the paragraphs|noticing a word in italics", "the main argument|"], trap: ["noticing a word in italics", 0], why: "Italics are a printed feature. A listener hears stress instead.", win: "Each medium has its own signals." },
    { say: "Sort these by yourself.", bins: "Hearing it|Reading it|Both", items: ["the speaker slowing for the key line|", "a footnote that defines a term|", "the evidence given|"], trap: ["a footnote that defines a term", 0] },
  ],
}));
