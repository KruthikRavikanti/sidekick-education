// Blend Three Sources. Skill RI.5.9-1.
// Integrating information from several texts on the same topic. Reporting the texts one at a time is the known slip.
Sidekick.game(Sidekick.play({
  title: "Blend Three Sources",
  emoji: "🌀",
  premise: "A knowledgeable writer blends several sources into one explanation rather than reporting them one at a time.",
  outro: "Integrate information from several texts into one connected understanding.",
  scene: "sky",
  kind: "pick",
  hint: "Does the statement weave together facts from more than one source?",
  tag: "reports_one_at_a_time",
  rounds: [
    { say: "Read the three sources. Tap the statements that blend them.", read: "A: Hurricanes form over warm ocean water. / B: Their winds can top 150 miles an hour. / C: Storm surge causes the most deaths.", yes: "Born over warm seas, hurricanes bring fierce winds and deadly surges.|Warm water fuels storms whose winds and floods are both dangerous.", no: "Source A says hurricanes form over warm water.|Winds can top 150 miles an hour.", trap: "Source A says hurricanes form over warm water.", why: "That reports one source alone. Blend the facts together.", win: "Three sources, one explanation." },
    { say: "Tap the statements that blend the sources.", read: "A: Wolves were removed from the park in 1926. / B: Elk numbers then exploded. / C: Elk ate the young willows along rivers.", yes: "With no wolves, elk multiplied and stripped the riverbanks of willows.|Removing wolves set off changes that reached even the plants.", no: "Wolves were removed in 1926.|Source C is about willows.", trap: "Wolves were removed in 1926.", why: "That is source A alone.", win: "You integrated the sources." },
    { say: "Tap the blended statements by yourself.", read: "A: Screens give off blue light. / B: Blue light delays sleep hormones. / C: Tired students score lower on tests.", yes: "Late screen time can delay sleep and so hurt school results.|Blue light from screens may lead to tired students and lower scores.", no: "Screens give off blue light.|Source B is about hormones.", trap: "Screens give off blue light." },
  ],
}));
