// Lion and Mouse. Skill RL.2.2-1.
// Recounting fables and folktales and determining their central lesson. Retelling without the key events is the known slip.
Sidekick.game(Sidekick.play({
  title: "Lion and Mouse",
  emoji: "🦁",
  premise: "Fables are short tales that teach a lesson. Retell one by putting its key events in order.",
  outro: "Recount a fable by its key events, then say the lesson it teaches.",
  scene: "sand",
  kind: "row",
  hint: "What happened first? What changed after that?",
  tag: "retells_without_key_events",
  rounds: [
    { say: "Put the events of the fable in order.", seq: "A lion caught a little mouse.|The lion let the mouse go.|Later the lion was stuck in a net.|The mouse chewed the net open.", trap: "The mouse chewed the net open.|A lion caught a little mouse.|The lion let the mouse go.|Later the lion was stuck in a net.", why: "The rescue comes at the end. Start when the lion catches the mouse.", win: "Caught, freed, trapped, rescued." },
    { say: "Tap the lesson this fable teaches.", kind: "pick", read: "A lion let a mouse go. Later the mouse chewed a net and set the lion free.", yes: "Even small friends can be a big help.|", no: "Lions are strong.|Nets are made of rope.|Mice like to chew.", trap: "Lions are strong.", why: "That is a fact about lions. The lesson is the big idea.", win: "Kindness comes back to you." },
    { say: "Put the events of this fable in order by yourself.", seq: "A thirsty crow found a jug.|The water was too low to reach.|The crow dropped in pebbles.|The water rose and the crow drank.", trap: "The crow dropped in pebbles.|A thirsty crow found a jug.|The water was too low to reach.|The water rose and the crow drank." },
  ],
}));
