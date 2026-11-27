// Watch the Theme Grow. Skill RL.9-10.2-1.
// Determining a theme and analyzing how it emerges and is shaped and refined by specific details. Stating the theme without tracing it is the known slip.
Sidekick.game(Sidekick.play({
  title: "Watch the Theme Grow",
  emoji: "🌱",
  premise: "A theme does not arrive all at once. It is planted early, tested in the middle, and sharpened by the ending.",
  outro: "Trace a theme: where it first appears, how specific details shape it, and how the ending refines it.",
  scene: "forest",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "What does this moment add to the message that was not there before?",
  tag: "states_theme_only",
  rounds: [
    { say: "Theme: pride can cost you what you love. Match each moment to what it adds.", read: "Ines refuses help fixing her late father’s boat. Patched alone, it leaks. At last she hands her brother a brush, and they launch it together.", rows: [["she refuses help", "pride comes first"], ["the boat leaks", "pride has a cost"], ["she hands him a brush", "letting go of pride saves it"]], trap: [0, "pride has a cost"], why: "Refusing help is only the starting point. The cost shows up when the boat leaks.", win: "Planted, tested, refined." },
    { say: "Theme: silence can be a kind of lie. Match each moment.", read: "Dev sees his friend cheat and says nothing. The friend wins, and Dev claps. That night Dev cannot meet his own eyes in the mirror.", rows: [["he says nothing", "silence is the easy choice"], ["he claps", "silence becomes taking part"], ["the mirror", "he feels what he allowed"]], trap: [1, "silence is the easy choice"], why: "By clapping he has gone further than staying quiet. He is now joining in.", win: "Each detail deepens the idea." },
    { say: "Theme: home is people, not a place. Match each stage by yourself.", read: "Lan misses her old apartment and draws its floor plan nightly. A neighbor invites her to dinner. Weeks later she draws a table with six chairs.", rows: [["the floor plan", "home is first pictured as rooms"], ["the six chairs", "home is now pictured as people"]], extra: "home is a place to leave|the neighbor moves away", trap: [0, "home is now pictured as people"] },
  ],
}));
