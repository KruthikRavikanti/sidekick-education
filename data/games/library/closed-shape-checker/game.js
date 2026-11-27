// Closed Shape Checker. Skill 1.G.A.1-2.
// Shapes with given attributes: the child picks drawings that are closed with the right number of straight sides. An open figure called a triangle is the known slip.
Sidekick.game(Sidekick.play({
  title: "Closed Shape Checker",
  emoji: "🔒",
  premise: "A real shape is closed all the way around, with straight sides that meet. Check every drawing.",
  outro: "A triangle is closed and has 3 straight sides that all meet.",
  scene: "paper",
  kind: "pick",
  hint: "Trace it with your finger. Do you get back to where you started?",
  tag: "accepts_open_figure",
  rounds: [
    { say: "Tap every closed shape with 3 straight sides.", yes: "~tri:e ~tri:r ~tri:s", no: "~open:3 ~quad:sq ~curvy", trap: "~open:3", why: "That one is not closed. All 3 sides of a triangle must meet.", win: "Three closed triangles." },
    { say: "Tap every closed shape with 4 straight sides.", yes: "~quad:sq ~quad:trap ~quad:para", no: "~open:4 ~tri:e ~circle ~curvy", trap: "~open:4", why: "That one is not closed. Its sides do not all meet.", win: "Three closed shapes with 4 sides." },
    { say: "Tap every closed shape with 3 straight sides.", yes: "~tri:o ~tri:i ~tri:t", no: "~open:3 ~quad:rhomb ~oval ~curvy", trap: "~open:3" },
  ],
}));
