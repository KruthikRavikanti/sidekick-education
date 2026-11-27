// Lights, Camera, Meaning. Skill RL.7.7-1.
// Comparing a written story to its filmed or staged version, analyzing the effects of techniques unique to each medium. Listing differences only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Lights, Camera, Meaning",
  emoji: "🎥",
  premise: "Film tells a story with tools a page does not have: lighting, sound, color and camera angles.",
  outro: "Analyze a film version by naming a technique and its effect on the scene.",
  scene: "night",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "What does that choice make the viewer feel?",
  tag: "lists_differences_only",
  rounds: [
    { say: "What effect does each film technique have?", rows: [["a low camera angle looking up at the villain", "makes him seem powerful"], ["dim blue lighting in the hallway", "makes the scene feel cold and eerie"]], extra: "makes the film longer|", trap: [0, "makes the film longer"], why: "An angle does not change the length. Looking up makes a person loom.", win: "Angle and light shape the feeling." },
    { say: "What effect does each technique have?", rows: [["sudden silence before the door opens", "builds suspense"], ["a close-up on shaking hands", "shows fear without words"]], extra: "adds humor|", trap: [1, "adds humor"], why: "Shaking hands shown up close reveal how scared the character is.", win: "Sound and framing do the telling." },
    { say: "Match these by yourself.", rows: [["fast cuts between two runners", "speeds up the scene"], ["warm golden light at the reunion", "makes it feel joyful"]], extra: "hides the actors|makes it scary", trap: [1, "makes it scary"] },
  ],
}));
