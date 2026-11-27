// Conclusion That Fits. Skill W.4.1-4.
// Providing a concluding statement related to the opinion presented. Introducing new ideas at the end is the known slip.
Sidekick.game(Sidekick.play({
  title: "Conclusion That Fits",
  emoji: "🎯",
  premise: "A conclusion ties back to your opinion. It is not the place for a brand new idea.",
  outro: "A conclusion restates the opinion and reasons. It introduces nothing new.",
  scene: "field",
  kind: "pick",
  hint: "Does it wrap up what was already said, or start something new?",
  tag: "new_idea_at_the_end",
  rounds: [
    { say: "The essay argues for school uniforms because they save time and money. Tap the best conclusion.", yes: "For these reasons, uniforms are a smart choice for our school.|", no: "Also, schools should start later.|Uniforms come in blue.|Some kids like art.", trap: "Also, schools should start later.", why: "That opens a whole new topic. A conclusion wraps up this one.", win: "It returns to the opinion." },
    { say: "The essay argues that kids need limits on screen time for sleep and health. Tap the best conclusion.", yes: "Clearly, daily limits protect kids’ sleep and health.|", no: "Another issue is homework.|Screens are made of glass.|Phones can ring.", trap: "Another issue is homework.", why: "Another issue is a new idea. Close the argument you made.", win: "A conclusion related to the opinion." },
    { say: "The essay argues for longer recess to improve focus and friendships. Tap the best conclusion by yourself.", yes: "A longer recess would give students sharper minds and stronger friendships.|", no: "Lunch should also be longer.|Recess is outdoors.|Finally, buy new swings.|Some schools have gyms.|Kids like snacks.", trap: "Lunch should also be longer." },
  ],
}));
