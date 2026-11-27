// Link Opinion to Reasons. Skill W.4.1-3.
// Linking opinion and reasons using words and phrases. Using no transitions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Link Opinion to Reasons",
  emoji: "🔗",
  premise: "Linking phrases guide a reader from your opinion to each reason: for instance, in addition, in order to.",
  outro: "Use phrases like for instance, in addition and in order to to connect opinion and reasons.",
  scene: "desk",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Is the next sentence an example, another reason, or a purpose?",
  tag: "no_transitions",
  rounds: [
    { say: "Drop in the linking phrase that fits.", rows: [["Uniforms save time. ___, they cost less.", "In addition"], ["Uniforms are simple. ___, a shirt and pants.", "For instance"]], extra: "However", trap: [0, "However"], why: "However signals a turn. This sentence adds another reason.", win: "In addition adds. For instance gives an example." },
    { say: "Drop in these linking phrases.", rows: [["We need a garden ___ teach science.", "in order to"], ["Gardens help. ___, kids learn where food comes from.", "For example"], ["Gardens are cheap. ___, they are fun.", "Also"]], trap: [0, "For example"], why: "This part gives the purpose. In order to fits.", win: "Purpose, example, addition." },
    { say: "Drop these in by yourself.", rows: [["Reading matters. ___, it builds vocabulary.", "For instance"], ["It teaches facts. ___, it sparks ideas.", "In addition"], ["Read daily ___ grow as a thinker.", "in order to"]], extra: "But", trap: [1, "But"] },
  ],
}));
