# Game coverage

Written by `python -m backend.games coverage`. A skill counts as covered when a game for it ships in this repo
and passes the robot. Every other skill is waiting for `python -m backend.games generate --missing`.

**1533 of 1533 skills have a game** (1533 games).

| Subject | Grade | Skills | With a game |
|---|---|---|---|
| Math | K | 62 | 62 |
| Math | 1 | 62 | 62 |
| Math | 2 | 66 | 66 |
| Math | 3 | 75 | 75 |
| Math | 4 | 70 | 70 |
| Math | 5 | 61 | 61 |
| Math | 6 | 80 | 80 |
| Math | 7 | 64 | 64 |
| Math | 8 | 68 | 68 |
| Math | Algebra 1 | 85 | 85 |
| Math | Geometry | 73 | 73 |
| Math | Algebra 2 | 49 | 49 |
| Math | Precalculus / advanced (+) | 52 | 52 |
| Reading/ELA | K | 64 | 64 |
| Reading/ELA | 1 | 71 | 71 |
| Reading/ELA | 2 | 62 | 62 |
| Reading/ELA | 3 | 71 | 71 |
| Reading/ELA | 4 | 67 | 67 |
| Reading/ELA | 5 | 64 | 64 |
| Reading/ELA | 6 | 59 | 59 |
| Reading/ELA | 7 | 52 | 52 |
| Reading/ELA | 8 | 54 | 54 |
| Reading/ELA | 9-10 | 52 | 52 |
| Reading/ELA | 11-12 | 50 | 50 |

## Who wrote them, and how

Every shipped game still waits for a person in the review page before a child can play it.
`claude-stand-in` means Claude wrote the game while standing in for the model the app will call; no live model run produced it.

| Author | Games |
|---|---|
| claude-stand-in | 1532 |
| claude-stand-in, written through the generation pipeline | 1 |

A game that mixes patterns across its rounds is counted under each one.

| How it is built | Games |
|---|---|
| play pattern: fill | 589 |
| play pattern: sort | 404 |
| play pattern: type | 285 |
| play pattern: pick | 192 |
| play pattern: row | 108 |
| play pattern: dial | 85 |
| built by hand on the kit | 77 |
| play pattern: plot | 37 |
| play pattern: line | 26 |
| play pattern: build | 13 |
| play pattern: paint | 8 |

## Games

| Skill | Grade | Game | What the child does |
|---|---|---|---|
| `GA-K-MDR.7.3-1` Answer questions using a simple graph or sorted objects | K | 📊 Snack Graph | The class made a graph of their favorites. Read one bar at a time to answer each question. |
| `GA-K-NR.1.4-1` Identify pennies, nickels, and dimes by look | K | 🪙 Coin Detective | Three coins, three looks. Study the color and the size of each coin, then name it. |
| `GA-K-NR.1.4-2` Know the name and value of each coin | K | 🐷 Piggy Bank | The piggy bank knows what every coin is worth. Match the coins to their values, then feed the pig. |
| `GA-K-PAR.6.1-1` Find the unit that repeats (AB, ABB, ABC) | K | 🥁 Pattern Parade | The parade marches in a pattern that keeps starting over. Find the part that repeats and build it once. |
| `GA-K-PAR.6.1-2` Extend and create repeating patterns with shapes and numbers | K | 📿 Bead Necklace | Each necklace repeats a little group of beads. Add the beads that come next. |
| `GA-K-PAR.6.2-1` Describe the order of daily events with time words | K | 🌞 Sunrise to Moonrise | A day has an order, and so do the days. Sort what happens when, then line the days up. |
| `K.CC.A.1-1` Say the counting sequence 1 to 20 without skipping | K | 🪨 Stepping Stones | The stones across the pond lost their order. Put the numbers back so the frog can hop across. |
| `K.CC.A.1-2` Count by ones from 20 to 100, crossing each decade | K | 🚂 Caboose Count | The train cars are numbered, but they got unhooked right where the tens change. Hook them up in counting order. |
| `K.CC.A.1-3` Count by tens to 100 | K | 🦕 Dino Stomp | The dinosaur takes giant steps of ten. Lay down its footprints so every step is ten more. |
| `K.CC.A.2-1` Start counting forward from a given number instead of 1 | K | 🐸 Frog Hops On | The frog is already sitting on a lily pad. Count on from there to find where it lands. |
| `K.CC.A.2-2` Count forward across a decade from a given start (e.g. from 37 to 43) | K | 🐌 Snail Trail | The snail is partway down its trail. Slide it on, right past the place where the tens change. |
| `K.CC.A.3-1` Recognize numerals 0 to 20 | K | 📬 Number Mail | The mail carrier has number cards to deliver. Drop each one in the right mailbox. |
| `K.CC.A.3-2` Write numerals 0 to 20 | K | 🖋️ Number Stamps | The owl says a teen number out loud. Stamp its two digits in the right order. |
| `K.CC.A.3-3` Match a numeral to a set of objects, including 0 for an empty set | K | 🧺 Basket Tags | Each basket needs a number tag that tells how many are inside. One basket is empty! |
| `K.CC.B.4-1` Touch each object exactly once while saying one number name | K | ✨ Firefly Count | Little bugs are out in the night garden. Tap each one the mission names, just one time. |
| `K.CC.B.4-2` Know the last number said tells how many are in the set | K | 🫙 Jar Labels | Every jar on the shelf needs a label that tells how many are inside. Count, then set the label. |
| `K.CC.B.4-3` Understand the count stays the same no matter the order or arrangement | K | 🐑 Spread-Out Sheep | Some flocks huddle close and some spread out wide. Sort each flock by how many sheep it really has. |
| `K.CC.B.4-4` Know each next number is one more | K | 🍇 One More Grape | The fruit bowl needs just the right number of grapes. Each one you add makes one more. |
| `K.CC.B.5-1` Count up to 20 objects in a line, array, or circle | K | 🌟 Star Rows | The stargazer drew the stars in rows. Count every star and key in how many. |
| `K.CC.B.5-2` Count up to 10 scattered objects by keeping track of what is counted | K | 🪙 Coin Puddles | Coins spilled all over the sidewalk in messy puddles. Count each puddle and give it a tag. |
| `K.CC.B.5-3` Count out a requested number of objects from a larger group | K | 🏗️ Block Delivery | The builders ask for an exact number of blocks. Load just that many, then stop. |
| `K.CC.C.6-1` Compare groups by matching objects one to one | K | 🎩 Party Hats | Every pup wants a party hat. Match them up to see which group has more. |
| `K.CC.C.6-2` Compare groups by counting each | K | 🐜 Tiny but Many | Big animals and tiny ones are having a picnic. Find the groups with the most by counting, not by size. |
| `K.CC.C.6-3` Use the words more, fewer, and the same | K | 🧁 More, Fewer, Same | The baker lines up treats in two groups. Drop in the words that tell how the groups compare. |
| `K.CC.C.7-1` Use counting order to tell which number is greater | K | 🐦 Higher Perch | Two perches have numbers on them. Fly the bird to the perch with the greater number. |
| `K.CC.C.7-2` Compare numerals by picturing the amounts | K | 🏮 Dot Lantern | The lantern lights one dot for every number you give it. Light up the greater number to see how much it really is. |
| `K.G.A.1-1` Name shapes seen in everyday objects | K | 🏠 Shape Hunt at Home | Shapes are hiding in everyday things around the house. Sort each thing by the shape you see in it. |
| `K.G.A.1-2` Use position words: above, below, beside, in front of, behind, next to | K | 🐝 Where Is the Bee? | The bee wants to rest near the flower. Listen to where, then tap that spot. |
| `K.G.A.2-1` Name a shape regardless of size | K | 🔺 Big and Small Shapes | Some shapes are huge and some are tiny. Sort them by their name, no matter how big they are. |
| `K.G.A.2-2` Name a shape regardless of orientation | K | 🛸 Shape Sorter | Shapes are tumbling off the space belt. Sort each one into its bin, even when it is turned. |
| `K.G.A.3-1` Tell flat shapes from solid shapes | K | 📦 Flat or Solid? | Some shapes are flat like paper. Others are solid and you can hold them. Sort them out. |
| `K.G.A.3-2` Name common solids: cube, cone, cylinder, sphere | K | 🏪 Solid Shop | Everything in this shop is a solid shape. Put the right name tag on each one. |
| `K.G.B.4-1` Count sides and corners of shapes | K | 📐 Corner Count | Count the sides of each shape, touching each side just once. Then drop it in the right box. |
| `K.G.B.4-2` Describe how two shapes are alike and different | K | 🔍 Same and Different | Two shapes sit side by side. Sort the clues: which are true for both, and which are different? |
| `K.G.B.5-1` Build shapes from sticks and clay | K | 🪵 Stick and Clay | Build shapes from sticks, with a ball of clay to join every corner. A shape is only done when it is closed. |
| `K.G.B.5-2` Draw shapes with the right number of sides | K | 🎨 Grid Artist | Draw shapes on the grid with straight sides and square corners. Follow how far across and how far down. |
| `K.G.B.6-1` Combine two shapes to make a new shape | K | 🧩 Shape Mash | Push two shapes together and a new shape appears. Match each pair to the shape it makes. |
| `K.G.B.6-2` Fill an outline with smaller shapes | K | 🔷 Fill the Outline | An empty outline is waiting for blocks. Add blocks until it is full, with none left over. |
| `K.MD.A.1-1` Name attributes like length, height, and weight | K | 📏 Measure Words | Big is not the only measuring word. Give each thing the word that tells what kind of big we mean. |
| `K.MD.A.1-2` Describe several attributes of one object | K | 🧴 Measure It! | One thing can be measured in more than one way. Tap every way you could measure it. |
| `K.MD.A.2-1` Line up ends to compare which is longer or taller | K | 🥕 Longest Carrot | Bunny gives a crown to the longest carrot. Stand them on the table to compare fairly. |
| `K.MD.A.2-2` Compare weights by holding or using a balance | K | ⚖️ Seesaw Sort | Some things push the seesaw down and some barely move it. Sort them by weight, not by size. |
| `K.MD.A.2-3` Use comparison words: longer, shorter, heavier, lighter | K | 🎪 Compare Fair | At the fair, everything gets compared. Drop in the word that tells how the first thing compares to the second. |
| `K.MD.B.3-1` Sort objects into given categories | K | 🧸 Toy Shelf | Tidy the shelf by one rule at a time. Once you pick a rule, keep it for every single thing. |
| `K.MD.B.3-2` Count how many are in each category | K | 🫙 Marble Jars | The marbles are all mixed up. Count how many there are of each color and tag each color. |
| `K.MD.B.3-3` Order categories by count (most to fewest) | K | 🍊 Fruit Stand Tally | The fruit stand counted what it sold today. Line the fruits up from the most sold to the fewest. |
| `K.NBT.A.1-1` Show a teen number as a full ten frame plus extra ones | K | 🥚 Egg Cartons | Hen sells eggs in cartons of ten. Pack each order with full cartons and loose eggs. |
| `K.NBT.A.1-2` Write a teen number as 10 + ones (16 = 10 + 6) | K | 🔟 Ten and Some More | Every teen number is a ten and some more. Drop in the missing piece of each number sentence. |
| `K.NBT.A.1-3` Build a teen number from a ten and ones | K | 🧮 Rod and Cubes | Build teen numbers with one long ten rod and some little ones cubes. |
| `K.OA.A.1-1` Act out putting together and taking apart with objects or fingers | K | 🕊️ Bird Wire | Birds land on the wire and birds fly away. Act out each story so the wire shows who is there now. |
| `K.OA.A.1-2` Show addition and subtraction with drawings | K | 🖍️ Chalk Dots | Draw each little story with chalk dots. Your picture should show what happened, not just the numbers. |
| `K.OA.A.1-3` Connect an action to a simple expression like 3 + 2 | K | 🐠 Fish Tank Math | Fish swim in and fish swim away. Match what happens in each tank to its number sentence. |
| `K.OA.A.2-1` Solve 'add to' and 'take from' problems with objects or drawings | K | 🚌 Bus Stop | Riders get on the bus and riders get off. Slide the bus to show how many are riding now. |
| `K.OA.A.2-2` Solve 'put together' problems (total unknown) | K | 🛍️ Apple Bag | Red apples and green apples go into one bag. Key in how many apples are in the bag in all. |
| `K.OA.A.2-3` Retell what is happening in the story before solving | K | 🦆 Pond Stories | Every little story changes how many there are. Decide what happened: are there more now, or fewer? |
| `K.OA.A.3-1` Find one way to split a number into two parts with objects | K | 🐿️ Two Nests | The squirrel hides its acorns in two nests. Share them out so every acorn has a home. |
| `K.OA.A.3-2` Find several ways to split the same number (5 = 4 + 1 = 3 + 2) | K | 💎 Treasure Pairs | The treasure chest only opens for pairs of numbers that make the secret total. Find them all. |
| `K.OA.A.3-3` Record splits with a drawing or equation | K | 📿 Bead Sentence | Each string has beads in two colors. Build the number sentence that tells the whole string and its two parts. |
| `K.OA.A.4-1` Use a ten frame to find how many more make 10 | K | 🚌 Bus to Ten | The bus only leaves when all 10 seats are full. Call just enough kids. |
| `K.OA.A.4-2` Find the number that makes 10 with any number 1 to 9 | K | 🥚 Egg Carton | The carton holds 10 eggs. Some are already in. Add eggs until every spot is full. |
| `K.OA.A.5-1` Know addition facts within 5 without counting every object | K | 🐝 Fact Hive | Each bee carries a little adding fact. Fly every bee to the hive cell that shows its total. |
| `K.OA.A.5-2` Know subtraction facts within 5 | K | 🐧 Penguin Slide | The penguin slides back down the ice hill to take away. Each slide back is one less. |
| `1.G.A.1-1` Tell defining attributes (3 sides, closed) from non-defining ones (color, size) | 1 | ⛰️ Triangle Club | Only true members get into the club. Size and the way a shape is turned do not matter: the sides do. |
| `1.G.A.1-2` Build and draw shapes with given attributes | 1 | 🔒 Closed Shape Checker | A real shape is closed all the way around, with straight sides that meet. Check every drawing. |
| `1.G.A.2-1` Combine 2D shapes into a composite shape | 1 | ✂️ Shape Split | Big shapes are hiding smaller shapes inside them. Match each big shape to the two pieces that make it. |
| `1.G.A.2-2` Combine 3D shapes into a composite shape | 1 | 🧊 Solid Builders | Everyday things are built from solid shapes stuck together. Name the two solids in each one. |
| `1.G.A.3-1` Split circles and rectangles into 2 and 4 equal shares | 1 | 🍕 Fair Shares | Friends want to share fairly. Find the shapes that are cut into shares of exactly the same size. |
| `1.G.A.3-2` Use words: halves, fourths, quarters, half of | 1 | 🍰 Halves and Fourths | The bakery cuts its cakes into halves and fourths. Sort each cake by how it is cut. |
| `1.G.A.3-3` Know more equal shares means smaller shares | 1 | 🍫 Brownie Plates | Each guest gets one piece that fits their plate. Choose how many equal pieces to cut. |
| `1.MD.A.1-1` Order three objects by length | 1 | 🧵 Line Them Up | Three things, three lengths. Line them up from the shortest to the longest. |
| `1.MD.A.1-2` Compare two lengths using a third object | 1 | 🪢 String Detective | Two things are too far apart to hold side by side. A piece of string helps you compare them anyway. |
| `1.MD.A.2-1` Lay units end to end with no gaps or overlaps | 1 | 🖇️ Clip Line | Measure by laying paper clips end to end, from one end of the thing to the other. No spaces, no extras. |
| `1.MD.A.2-2` Count the units to give a length | 1 | 🐛 Inchworm Measure | The inchworms have lined up under each thing. Count the worms to say how long it is. |
| `1.MD.A.2-3` Use same-size units only | 1 | 📎 Fair Measure | Not every way of measuring is fair. Sort the good measuring from the measuring that needs a fix. |
| `1.MD.B.3-1` Read the hour on an analog clock | 1 | 🦉 Wake the Owl | Owl sleeps all day and needs an alarm. Read the clock and set the right hour. |
| `1.MD.B.3-2` Read half past the hour | 1 | 🕢 Tick Tock Reader | The clock shows a time at half past the hour. Read the hands and set the same time in numbers. |
| `1.MD.B.3-3` Match analog and digital times | 1 | 🕰️ Clock Twins | Every clock with hands has a twin that shows the same time in numbers. Match each pair. |
| `1.MD.C.4-1` Sort data into up to 3 categories | 1 | 🗂️ Three Baskets | Everything gets sorted into one of three baskets. Each thing belongs in just one. |
| `1.MD.C.4-2` Answer how many in each and in all | 1 | 🗳️ Class Vote | The class voted and made a chart. Use it to answer how many in one group and how many in all. |
| `1.MD.C.4-3` Compare categories (how many more or less) | 1 | 📶 How Many More? | Two bars stand side by side. Find how much taller one is than the other. |
| `1.NBT.A.1-1` Count to 120 from any starting number | 1 | 🌉 Hundred Bridge | The bridge crosses right over one hundred. Lay the number planks in counting order so cars can cross. |
| `1.NBT.A.1-2` Read and write numerals to 120 | 1 | 🔢 Number Speller | The parrot says a big number. Spell it with digits, using just the right number of them. |
| `1.NBT.A.1-3` Represent a number of objects with a numeral | 1 | 🎒 Marble Bags | Every bag holds exactly 10 marbles, and a few marbles are loose. Write how many marbles there are. |
| `1.NBT.B.2-1` Think of 10 ones as one ten | 1 | 🔄 Trade for a Ten | Ten little cubes can be traded for one ten rod. Show each number with the fewest blocks you can. |
| `1.NBT.B.2-2` Know 11 to 19 are a ten and some ones | 1 | 🕵️ Teen Spotter | One teen number can show up in many disguises. Tap every card that shows the number. |
| `1.NBT.B.2-3` Know 10, 20, ..., 90 are groups of tens with 0 ones | 1 | 🗼 Tens Tower | Build each number with ten rods standing side by side. These numbers need no loose ones at all. |
| `1.NBT.B.2-4` Name the value of each digit in a two-digit number | 1 | 🔎 Digit Detective | A digit is worth more when it sits in the tens place. Find out what each digit is really worth. |
| `1.NBT.B.3-1` Compare tens first, then ones | 1 | 🥇 Tens Come First | The runners wear two-digit numbers. Line them up from least to greatest by looking at the tens first. |
| `1.NBT.B.3-2` Use the symbols >, =, < correctly | 1 | 🐊 Hungry Gator | The gator always opens its mouth toward the bigger number. Drop the right sign between each pair. |
| `1.NBT.C.4-1` Add a two-digit and a one-digit number | 1 | 🧱 Cube Adder | Add a few ones to a bigger number by building the total with rods and cubes. Ones join ones. |
| `1.NBT.C.4-2` Add a two-digit number and a multiple of 10 | 1 | 🚄 Ten Rod Express | The express train only carries whole tens. Add tens to a number and watch which place changes. |
| `1.NBT.C.4-3` Compose a new ten when ones add to 10 or more | 1 | 🏭 Ten Factory | When the ones pile up past ten, the factory packs ten of them into a new ten. Key in the total. |
| `1.NBT.C.4-4` Explain the strategy with models or drawings | 1 | 📝 Show Your Steps | A good helper can show how the adding was done. Put the steps with the blocks in the order they happen. |
| `1.NBT.C.5-1` Find 10 more than a two-digit number without counting | 1 | 🦘 Chart Hopper | Roo hops ten at a time. Tap the tile where each big hop lands. |
| `1.NBT.C.5-2` Find 10 less than a two-digit number | 1 | 🧃 Take a Ten Away | A number is already built with rods and cubes. Make it exactly ten less. |
| `1.NBT.C.6-1` Subtract tens from tens (70 - 30) | 1 | 🎳 Tens Take Away | The pins stand in packs of ten. Knock down some packs and key in how many pins are still standing. |
| `1.NBT.C.6-2` Relate tens subtraction to single-digit facts | 1 | 📣 Fact Echo | Shout a small fact into the canyon and it echoes back in tens. Use the little fact to find the big one. |
| `1.OA.A.1-1` Solve add-to and take-from problems with the result unknown | 1 | 📒 Sticker Stories | Every story hides a number. Read what really happens before you choose to add or take away. |
| `1.OA.A.1-2` Solve problems with the change or start unknown (5 + ? = 12) | 1 | 🚗 Toy Garage | Some cars are parked and more drive in. Add cars until the garage holds the number in the story. |
| `1.OA.A.1-3` Solve compare problems (how many more, how many fewer) | 1 | 🐚 Shell Lines | Two friends line up their shells side by side. Find how many more one friend has than the other. |
| `1.OA.A.1-4` Write an equation with a symbol for the unknown | 1 | 📦 Mystery Box Math | Each story has a number nobody knows yet. Build a number sentence with a box for the mystery number. |
| `1.OA.A.2-1` Add three numbers with a sum up to 20 | 1 | 🎈 Balloon Bunch | Three colors of balloons are tied into one bunch. Add all three groups to find the whole bunch. |
| `1.OA.A.2-2` Look for a pair that makes 10 first | 1 | 🎯 Ten First | Adding three numbers is quicker when two of them make a ten. Spot the ten, then see what is left. |
| `1.OA.B.3-1` Switch the order of addends (3 + 8 = 8 + 3) | 1 | 🩴 Flip Flop Facts | Flip the two numbers in an adding fact and the total stays the same. Finish each flipped fact. |
| `1.OA.B.3-2` Group addends to make tens (2 + 6 + 4 = 2 + 10) | 1 | 🚋 Ten Train | Hook two cars together to make a ten, and the adding gets easy. Group the numbers that make ten. |
| `1.OA.B.3-3` Know subtraction is not commutative | 1 | 🔀 Switcheroo | Some facts work in any order and some do not. Sort the ones you can switch from the ones you cannot. |
| `1.OA.B.4-1` Solve 10 - 8 by thinking 8 + ? = 10 | 1 | 💭 Think Addition | A taking-away fact is an adding fact in disguise. Use the adding fact to solve its partner. |
| `1.OA.B.4-2` Use fact families to check answers | 1 | 🏡 Fact Family House | Three numbers live together in a fact family. Tap every fact that truly belongs in their house. |
| `1.OA.C.5-1` Count on from the larger addend | 1 | 🦘 Kangaroo Count On | The kangaroo starts on the bigger number and hops on. No need to start way back at zero. |
| `1.OA.C.5-2` Count back to subtract small numbers | 1 | 🐇 Backward Bunny | The bunny hops backward to take away. Each hop back is one less. |
| `1.OA.C.6-1` Add and subtract within 10 fluently | 1 | 🐝 Busy Bee Hive | Bees keep flying in and out of the hive. Help the queen know how many are home. |
| `1.OA.C.6-2` Make ten to add (8 + 6 = 8 + 2 + 4) | 1 | 🚎 Fill the Ten | The tram has 10 seats. Move just enough riders on to fill it, and let the rest wait outside. |
| `1.OA.C.6-3` Use doubles and near doubles (6 + 7 = 6 + 6 + 1) | 1 | 👯 Double Trouble | If you know a double, the fact next door is just one more. Use the doubles to find their neighbors. |
| `1.OA.C.6-4` Use known facts to subtract (13 - 4 = 13 - 3 - 1) | 1 | 🛑 Stop at Ten | Taking away is easier with a rest stop at 10. Slide back to 10 first, then slide the rest of the way. |
| `1.OA.D.7-1` Know = means 'the same amount as' | 1 | 🎠 Equal Seesaw | The seesaw only sits level when both sides hold the same amount. Load the right side to match the left. |
| `1.OA.D.7-2` Judge equations true or false (6 = 6, 5 + 2 = 2 + 5) | 1 | ✅ True or Not? | A number sentence is true when both sides are the same amount, no matter which side the sum is on. |
| `1.OA.D.7-3` Read equations written in different formats | 1 | 🎚️ Both Sides Balance | There is adding on both sides of this balance. Set the box so the two sides weigh the same. |
| `1.OA.D.8-1` Find the unknown in a + ? = c | 1 | 🚀 Missing Number Rocket | The rocket will not launch until the missing number is keyed in. What goes in the box? |
| `1.OA.D.8-2` Find the unknown in ? - b = c | 1 | 🐾 Where Did It Start? | The fox walked back some steps and stopped at the flag. Follow its tracks to find where it started. |
| `GA-1-MDR.6.3-1` Identify the quarter and its value | 1 | 🍬 Gumball Quarter | The gumball machine only takes the right coins. Learn what the quarter is worth, then pay. |
| `GA-1-MDR.6.3-2` Compare values of pennies, nickels, dimes, quarters | 1 | 🪙 Toy Machine | The toy machine counts cents, not coins. Drop in exactly the right amount. |
| `GA-1-PAR.3.1-1` Predict what comes later in a repeating pattern | 1 | 🔮 Pattern Peek Ahead | The pattern keeps going, even past what you can see. Work out what comes later, not just next. |
| `GA-1-PAR.3.2-1` Describe how a pattern grows or shrinks | 1 | 🌱 Grow or Shrink | Some patterns grow, some shrink and some just repeat. Give each number pattern its rule. |
| `GA-1-PAR.3.2-2` Extend skip-counting patterns forward and backward | 1 | 🦗 Cricket Jumps | The cricket always jumps the same distance, forward or backward. Fill in where it lands next. |
| `2.G.A.1-1` Identify triangles, quadrilaterals, pentagons, hexagons, and cubes | 2 | 🐑 Critter Corral | Every critter orders a pen by its shape name. Set the fence posts to build it. |
| `2.G.A.1-2` Draw shapes with a given number of angles or faces | 2 | 🔻 Angle Hunter | Every corner of a shape is an angle. Count carefully and tap the shapes with just the right number. |
| `2.G.A.2-1` Partition a rectangle into rows and columns of same-size squares | 2 | 🍫 Chocolate Bar | Score the chocolate bar into rows and columns of same-size squares, just the way the order says. |
| `2.G.A.2-2` Count to find the total number of squares | 2 | 🪡 Quilt Squares | Grandma sews her quilt in rows of squares. Key in how many squares are in the whole quilt. |
| `2.G.A.3-1` Split circles and rectangles into 2, 3, or 4 equal shares | 2 | 🥧 Thirds Bakery | Three friends want the same amount of pie. Find the shapes that are cut into shares of the same size. |
| `2.G.A.3-2` Describe shares with halves, thirds, fourths, a third of | 2 | 🥮 Name That Share | One share of each cake is shaded. Give the shaded share its proper name. |
| `2.G.A.3-3` Know a whole is 2 halves, 3 thirds, 4 fourths | 2 | 🌕 Full Moon Pie | Shade one share at a time until the whole bar is covered. How many shares make a whole? |
| `2.G.A.3-4` Know equal shares of the same whole can look different | 2 | 🪄 Same Size, New Shape | A square can be cut in half in more than one way. The halves look different but are still the same amount. |
| `2.MD.A.1-1` Choose a ruler, yardstick, meter stick, or tape | 2 | 🧰 Pick the Tool | Short things and long things need different measuring tools. Hand the builder the right tool for each job. |
| `2.MD.A.1-2` Start measuring at 0 | 2 | 🐛 Inchworm | How long is each worm? Measure from 0, or count the spaces if the worm will not move. |
| `2.MD.A.2-1` Measure the same object in two units | 2 | 🪑 Two Rulers | Measure one thing with long sticks, then again with short sticks. The thing stays the same, but the number changes. |
| `2.MD.A.2-2` Explain why a smaller unit gives a bigger number | 2 | 🔬 Small Units, Big Numbers | Measure the same rope with two different units. One unit will always give the bigger number. Which one? |
| `2.MD.A.3-1` Use benchmark lengths (an inch, a foot, a meter) | 2 | 🤔 About How Long? | An inch, a foot and a meter each have things that are just about their size. Sort each thing by its best match. |
| `2.MD.A.3-2` Estimate in inches, feet, centimeters, and meters | 2 | 🧐 Good Guess | A good estimate sounds right when you picture it. Give each thing the length that makes sense. |
| `2.MD.A.4-1` Measure two objects and find the difference | 2 | 🎀 Ribbon Race | Two ribbons lie side by side. Key in how much longer one is than the other. |
| `2.MD.A.4-2` Express the difference in a standard unit | 2 | 🏷️ Name the Unit | A length is not finished until it has its unit. Give each difference its number and its unit. |
| `2.MD.B.5-1` Solve add and subtract length problems with same units | 2 | 🧶 Yarn Shop | The yarn shop cuts and joins lengths all day. Read each order and key in the new length. |
| `2.MD.B.5-2` Use drawings like rulers to solve | 2 | 🪚 Board Walk | The carpenter uses a long ruler line to add and cut boards. Start at the first length and slide to the answer. |
| `2.MD.B.6-1` Place whole numbers on a number line with equal spacing | 2 | 📍 Find the Spot | This number line only has names on its two ends. Count the equal spaces to find where each number lives. |
| `2.MD.B.6-2` Show sums and differences as jumps on a number line | 2 | 🦌 Deer Leaps | The deer leaps forward to add and back to take away. Each leap moves it one whole space. |
| `2.MD.C.7-1` Read the minute hand in 5-minute steps | 2 | ⏱️ Five-Minute Hops | The long hand hops five minutes for every number it passes. Read the clock and set the time in numbers. |
| `2.MD.C.7-2` Use a.m. and p.m. | 2 | 🌗 Morning or Night? | The same time comes twice a day. Sort each thing that happens into a.m. or p.m. |
| `2.MD.C.8-1` Know the value of pennies, nickels, dimes, quarters, and dollar bills | 2 | 💰 Coin Values | Every coin and bill has its own value, and size does not tell you what it is worth. Match each one. |
| `2.MD.C.8-2` Count a mix of coins | 2 | 🏦 Bank Teller | Coins slide across the counter in a mix. Count them up by their values and key in the total. |
| `2.MD.C.8-3` Solve money word problems with $ and cents | 2 | 🛒 Snack Money | You have some money and a story about spending or earning. Put in the purse what you have at the end. |
| `2.MD.D.10-1` Draw a picture graph and a bar graph with up to 4 categories | 2 | 📈 Graph Maker | Turn a list of counts into a bar graph. Raise each bar to just the right height. |
| `2.MD.D.10-2` Solve put-together, take-apart, and compare problems from a graph | 2 | 🐹 Pet Graph Puzzles | The class graphed its pets. Read the bars carefully to answer each puzzle. |
| `2.MD.D.9-1` Measure several objects to the nearest unit | 2 | 🧷 Close Enough Clips | Things do not always end right on a mark. Measure each one to the nearest whole unit. |
| `2.MD.D.9-2` Show the data on a line plot | 2 | ❌ X Marks the Length | Each thing you measured gets one X above its length. Build the line plot from the list. |
| `2.NBT.A.1-1` Think of 10 tens as one hundred | 2 | 💯 Trade for a Hundred | Ten ten-rods can be traded for one hundred flat. Show each number with the fewest blocks. |
| `2.NBT.A.1-2` Know 100, 200, ..., 900 are hundreds with no tens or ones | 2 | 🟨 Hundred Flats | Build numbers like 300 and 600 with big hundred flats. No rods and no cubes needed. |
| `2.NBT.A.1-3` Name the value of each digit in a 3-digit number | 2 | 🔐 Place Value Vault | The vault opens when you know what each digit is really worth. Hundreds, tens and ones all count differently. |
| `2.NBT.A.1-4` Understand zero as a placeholder (406) | 2 | 🕹️ Score Blocks | The arcade board needs each score in digits. Type it and watch the blocks build your number. |
| `2.NBT.A.2-1` Count by ones within 1000 across hundreds | 2 | 🚙 Odometer Roll | The car counter is about to roll over to a new hundred. Put the numbers in order as it rolls. |
| `2.NBT.A.2-2` Skip-count by 5s, 10s, and 100s | 2 | 🏃 Hundred Hurdles | The runner skip counts right over a hundred without breaking stride. Fill in the next two steps. |
| `2.NBT.A.3-1` Read and write numerals to 1000 | 2 | ✍️ Write It in Digits | The owl reads a number out loud. Write it with exactly three digits. |
| `2.NBT.A.3-2` Write numbers in word form | 2 | 🗣️ Say It in Words | Turn each number into words. Every place gets its say, especially the hundreds. |
| `2.NBT.A.3-3` Write numbers in expanded form (352 = 300 + 50 + 2) | 2 | 🪗 Stretch the Number | Pull a number apart to show what each digit is worth. Drop in the piece that is missing. |
| `2.NBT.A.4-1` Compare hundreds, then tens, then ones | 2 | 🏔️ Biggest Place First | To compare big numbers, start at the biggest place. Line the numbers up from least to greatest. |
| `2.NBT.A.4-2` Use >, =, < correctly | 2 | 🦈 Shark Bite Signs | The shark always bites toward the bigger number. Drop the right sign between each pair. |
| `2.NBT.B.5-1` Add two-digit numbers using place value | 2 | 🤖 Robot Fuel | The robot runs on numbers. Key in the right total to fuel it up. |
| `2.NBT.B.5-2` Subtract two-digit numbers using place value | 2 | ⛵ Borrow Bay | Sometimes there are not enough ones to take away. Break a ten into ones first, then key in the answer. |
| `2.NBT.B.5-3` Use the relationship of addition and subtraction to check | 2 | 🔁 Check It Back | Adding undoes taking away. Use that to check each answer: does it really add back to the start? |
| `2.NBT.B.6-1` Add three or four two-digit numbers | 2 | 🥞 Triple Stack | Three or four numbers are stacked up to add. Keep track of every new ten as you go. |
| `2.NBT.B.6-2` Use properties to choose an easy order | 2 | 🤝 Friendly Pairs | You may add in any order you like. Find the two numbers that go together easily and add them first. |
| `2.NBT.B.7-1` Add 3-digit numbers, composing tens and hundreds | 2 | 🚧 Carry Crew | When a place fills up past nine, the crew carries a ten or a hundred to the next place. Key in the total. |
| `2.NBT.B.7-2` Subtract 3-digit numbers, decomposing tens and hundreds | 2 | 🌁 Zero Bridge | There is a zero in the way and nothing to trade from. Reach across to the hundreds, then key in the answer. |
| `2.NBT.B.7-3` Show the work with models and drawings | 2 | 🪜 Trade Up Steps | Show where the new ten and the new hundred come from. Put the steps of the adding in order. |
| `2.NBT.B.8-1` Add or subtract 10 to a 3-digit number | 2 | 🛗 Tens Elevator | A number is already built. Ride the tens up or down by exactly one ten. |
| `2.NBT.B.8-2` Add or subtract 100 to a 3-digit number | 2 | 🦙 Llama Leaps a Hundred | A number is already built. Leap it up or down by exactly one hundred. |
| `2.NBT.B.9-1` Explain a strategy using place value | 2 | 💬 Tens and Ones Talk | Explain how the adding works by putting the steps in order: split, add each place, then put it back together. |
| `2.NBT.B.9-2` Explain a strategy using properties of operations | 2 | 🤲 Give and Take | Slide a little from one number to the other to make a tidy ten. The total stays the same. |
| `2.OA.A.1-1` Solve one-step problems with all unknown positions | 2 | 🍎 Apple Cart Tape | Every story has a missing piece. The two bars must end up the same length. Key in the piece that makes them match. |
| `2.OA.A.1-2` Solve two-step problems | 2 | 👣 Two-Step Trail | These stories take two steps to solve. Follow the trail all the way to the end before you answer. |
| `2.OA.A.1-3` Draw a bar or tape diagram to show the story | 2 | 🟦 Match the Bars | A bar model shows a whole and its parts. Stretch the missing part until the parts match the whole. |
| `2.OA.A.1-4` Write equations with a symbol for the unknown | 2 | ❓ Question Mark Math | Turn each story into a number sentence. The question mark stands where the unknown number is in the story. |
| `2.OA.B.2-1` Recall sums of two one-digit numbers | 2 | 🎆 Fact Fireworks | Each rocket carries an adding fact. Send every rocket to the cloud that shows its sum. |
| `2.OA.B.2-2` Use mental strategies to subtract within 20 | 2 | 🏰 Take-Away Tower | Each brick has a take-away fact. Stack every brick on the tower floor that shows its answer. |
| `2.OA.C.3-1` Pair objects to decide odd or even | 2 | 🧦 Sock Pairs | Laundry day! Pair up the socks and find out which numbers leave one sock alone. |
| `2.OA.C.3-2` Write an even number as a sum of two equal addends | 2 | 🧦 Even Split | Even numbers split into two equal piles with nothing left over. Share the socks so both piles match. |
| `2.OA.C.3-3` Use the ones digit to tell odd or even | 2 | 🎲 Ones Digit Decides | Odd or even? Only one digit gets to decide, and it is not the first one. |
| `2.OA.C.4-1` Find the total in an array up to 5 by 5 | 2 | 🍪 Cookie Tray | The baker lines up cookies in neat rows. Key in how many cookies are on the whole tray. |
| `2.OA.C.4-2` Write the total as a sum of equal addends | 2 | 🚜 Row by Row | The farmer plants in equal rows. Write the adding sentence that adds up one row after another. |
| `GA-2-GSR.7.2-1` Find a line that splits an object into matching halves | 2 | 🦋 Fold Line | Fold a shape on the dashed line. If the two sides land right on each other, you found a matching fold. |
| `GA-2-PAR.4.1-1` Create number patterns that add or subtract the same amount | 2 | 🪷 Lily Pad Hops | Froggy always hops the same distance. Tap the lily pads where the hops land. |
| `GA-2-PAR.4.1-2` Explain the rule of a pattern | 2 | 🧪 Rule Finder | Each number pattern follows one rule from start to finish. Test the rule on every step, not just the last one. |
| `3.G.A.1-1` Know rhombuses, rectangles, and squares are quadrilaterals | 3 | 🏠 Shape Clubs | Each club has one rule. Let in every shape that fits it, whatever the shape is called. |
| `3.G.A.1-2` Draw quadrilaterals that are not in those categories | 3 | 🔶 Other Four-Siders | Not every shape with four sides is a square or a rectangle. Meet the other quadrilaterals. |
| `3.G.A.2-1` Partition a shape into parts with equal area | 3 | 🟧 Equal Area Parts | A shape can be cut into parts that cover the same amount. Sort the cuts that are fair from the ones that are not. |
| `3.G.A.2-2` Name each part as a unit fraction of the whole | 3 | 🎫 Unit Fraction Tags | One equal part of each shape is shaded. Give the shaded part its fraction name. |
| `3.MD.A.1-1` Tell and write time to the nearest minute | 3 | ⌚ To the Minute | Now the long hand stops between the numbers. Count by fives, then count the little marks, to read the exact minute. |
| `3.MD.A.1-2` Find elapsed time in minutes | 3 | ⏳ How Long Was It? | Something starts at one time and ends at another. Work out how many minutes went by. |
| `3.MD.A.1-3` Solve time problems with a number line | 3 | 🕓 Time Line | Time can be a number line. Start at the starting time and jump ahead by how long it lasts. |
| `3.MD.A.2-1` Estimate and measure in grams, kilograms, and liters | 3 | 🏋️ Gram or Kilogram? | Light things are weighed in grams and heavy things in kilograms. Liquids are measured in liters. |
| `3.MD.A.2-2` Solve one-step problems with mass and volume | 3 | ⚗️ Kilos and Liters | The kitchen lab weighs and pours all day. Read each problem and key in the amount. |
| `3.MD.B.3-1` Draw a scaled bar graph (each square = 5) | 3 | 🏟️ Scaled Graph | On this graph, each line going up stands for 5 votes, not 1. Read the bars with the scale in mind. |
| `3.MD.B.3-2` Read a scaled picture graph with half symbols | 3 | 🎟️ Picture Graph Key | In a picture graph, one picture can stand for many. The key tells you how many. A half picture is worth half as much. |
| `3.MD.B.3-3` Answer how many more and how many less from a graph | 3 | 🗳️ More Votes | The graph counts by fives. Compare two bars to find how many more or how many fewer. |
| `3.MD.B.4-1` Read a ruler to the nearest half and quarter inch | 3 | 🔩 Quarter Inch Detective | The ruler has little marks between the inches for halves and quarters. Slide the pointer to where the thing ends. |
| `3.MD.B.4-2` Show measurements on a line plot | 3 | 📌 Fraction Line Plot | Lengths with halves and quarters go on a line plot too. First put the lengths in order, then stack the marks. |
| `3.MD.C.5-1` Know a unit square has one square unit of area | 3 | ⬛ Units or Square Units? | Length is measured along a line. Area is the space something covers. Sort each job by what it measures. |
| `3.MD.C.5-2` Cover a figure with n unit squares with no gaps or overlaps | 3 | 🪟 Cover It Exactly | Cover the outline with unit squares: every spot filled, nothing doubled up. Then you know its area. |
| `3.MD.C.6-1` Count unit squares to find area | 3 | 🟩 Count the Squares | The rectangle is drawn on grid paper. Count every square inside it to find its area. |
| `3.MD.C.6-2` Use square cm, m, in, ft | 3 | 🔖 Label the Area | An area is counted in squares, so its label has to say square. Pick the right label for each area. |
| `3.MD.C.7-1` Tile a rectangle and show area = side x side | 3 | 🍫 Choco Factory | Every chocolate bar is rows of squares. Tell the machine how many squares to pour. |
| `3.MD.C.7-2` Multiply side lengths to find area in word problems | 3 | 🌻 Garden Plots | Each garden is a rectangle. Multiply its length by its width to find how much ground it covers. |
| `3.MD.C.7-3` Use area to show the distributive property | 3 | 🧮 Split the Rectangle | Cut a rectangle into two smaller ones along the orange line. Their areas add up to the whole. |
| `3.MD.C.7-4` Find area of L-shapes by splitting into rectangles | 3 | 🛋️ L-Shaped Rooms | These rooms are shaped like the letter L. Cut each one into two rectangles and add their areas. |
| `3.MD.D.8-1` Find perimeter by adding side lengths | 3 | 🐄 Fence It In | The cows need a fence all the way around their field. Add up every side to find how much fence to buy. |
| `3.MD.D.8-2` Find an unknown side from the perimeter | 3 | 🖼️ Missing Side | You know the distance all the way around the frame, and one side. Work back to find the side that is missing. |
| `3.MD.D.8-3` Show rectangles with the same perimeter can have different areas | 3 | 🌼 Same Fence, New Garden | You have one length of fence. Bend it into different rectangles and watch the space inside change. |
| `3.NBT.A.1-1` Find the two tens or hundreds a number is between | 3 | 🚏 Between the Tens | Every number sits between two tens, and between two hundreds. Plant a flag on each neighbor. |
| `3.NBT.A.1-2` Use the halfway point to decide which is closer | 3 | 🔵 Marble Hill | Each marble rolls to the nearest town. The flag on the hill marks halfway. |
| `3.NBT.A.1-3` Use a number line to show rounding | 3 | ⚽ Roll to the Nearest Ten | The ball sits on a number between two tens. Roll it to the ten it is closer to. |
| `3.NBT.A.2-1` Add 3-digit numbers with regrouping | 3 | 🏎️ Regroup Rally | Adding big numbers means carrying tens and hundreds over to the next lane. Make sure every one of them crosses over. |
| `3.NBT.A.2-2` Subtract 3-digit numbers with regrouping, including across zeros | 3 | 🕳️ Across the Zeros | A zero has nothing to lend. Reach across it to the next place, then finish the subtraction. |
| `3.NBT.A.2-3` Use the relationship of addition and subtraction to check | 3 | 🧾 Proof by Adding | Every subtraction can be proved by adding back. Sort the answers whose proof really lands on the starting number. |
| `3.NBT.A.3-1` Think of 9 x 80 as 9 x 8 tens | 3 | ✖️ Tens Times | Multiplying by 80 is really multiplying by 8 tens. Count in tens and the big fact gets small. |
| `3.NBT.A.3-2` Use place value to explain the product | 3 | 📚 Stack of Tens | A product like 5 × 30 is a pile of ten rods. Build it with blocks to see why it is so big. |
| `3.NF.A.1-1` Know 1/b is one of b equal parts of a whole | 3 | 🧀 One Equal Part | A fraction only counts when all the parts are the same size. Find the pictures that really show the fraction. |
| `3.NF.A.1-2` Know a/b is a copies of 1/b | 3 | 🐸 Froggy's Bridge | Froggy can only hop on planks. Build a bridge that stops right at the berry. |
| `3.NF.A.1-3` Identify the whole for a fraction | 3 | 🎂 Which Whole? | Half of a huge cake and half of a cupcake are both halves, but not the same amount. It depends on the whole. |
| `3.NF.A.2-1` Split 0 to 1 into b equal parts to find 1/b | 3 | 🐞 First Jump | The line from 0 to 1 is cut into equal parts. The ladybug takes one jump from zero to land on a unit fraction. |
| `3.NF.A.2-2` Mark a/b by counting a lengths of 1/b from 0 | 3 | 🦎 Fraction Hops | The lizard hops along the line one equal part at a time. Count the hops from zero to land on the fraction. |
| `3.NF.A.2-3` Place fractions greater than 1 on the number line | 3 | 🪂 Past One | Fractions do not stop at 1. Keep hopping the same size parts and you sail right past it. |
| `3.NF.A.3-1` Know equivalent fractions name the same point or size | 3 | 🪞 Same Amount, New Name | Cut the same amount into smaller pieces and it gets a new name, but it is still the same amount. |
| `3.NF.A.3-2` Generate simple equivalent fractions (1/2 = 2/4) with models | 3 | 🧱 Match the Top Bar | The top bar shows a fraction. The bottom bar is cut into more pieces. Shade it until both bars cover the same amount. |
| `3.NF.A.3-3` Write whole numbers as fractions (3 = 3/1, 4/4 = 1) | 3 | 🥸 Whole in Disguise | Some fractions are whole numbers wearing a costume. Unmask them and sort them by what they are worth. |
| `3.NF.A.3-4` Compare fractions with the same numerator or denominator | 3 | 🧇 Smaller Pieces | Cut a waffle into more pieces and each piece gets smaller. Compare the fractions and drop in the sign. |
| `3.OA.A.1-1` Read 5 x 7 as 5 groups of 7 | 3 | 🌱 Seed Planter | The planter makes equal rows. Read each order as rows of seeds and plant it. |
| `3.OA.A.1-2` Show products with equal groups, arrays, and skip counting | 3 | 🌷 Equal Groups Garden | Plant flowers in equal groups to show a multiplication fact. The first number is how many groups. |
| `3.OA.A.1-3` Write a multiplication equation for a picture | 3 | ⭐ Star Rows Equation | Stars shine in neat rows. Write the multiplication sentence that tells how many stars there are. |
| `3.OA.A.2-1` Read 56 / 8 as sharing 56 into 8 equal groups | 3 | 🍩 Donut Share | Share the donuts so every kid gets the same number. That is what dividing means. |
| `3.OA.A.2-2` Read 56 / 8 as how many groups of 8 are in 56 | 3 | 🥡 Bag It Up | This time you know how many go in each bag. Add bags until all the fruit is packed. |
| `3.OA.A.2-3` Write a division equation for a picture | 3 | ✏️ Pencil Boxes | Things get packed into equal groups. Write the division sentence that tells the story in order. |
| `3.OA.A.3-1` Solve equal-groups problems | 3 | 🍽️ Set the Tables | The party has equal groups everywhere: chairs at tables, apples in bags. Find each total. |
| `3.OA.A.3-2` Solve array and area problems | 3 | 🥬 Garden Rows | The farmer plants in rows. Count the plants inside the garden, not the path around it. |
| `3.OA.A.3-3` Solve measurement-quantity problems | 3 | 🎗️ End to End | Lengths and amounts come in equal pieces. Decide whether to multiply or divide, then key in the answer. |
| `3.OA.A.3-4` Draw a diagram and write an equation with a symbol for the unknown | 3 | 🃏 Deal the Cards | Each story is about equal groups. Build the number sentence, with a ? for what you need to find. |
| `3.OA.A.4-1` Find the unknown factor in 8 x ? = 48 | 3 | 🗝️ Key to the Factor | A number is missing from each multiplication fact. Find the factor that unlocks it. |
| `3.OA.A.4-2` Find the unknown in ? / 3 = 5 and 18 / ? = 3 | 3 | 🔦 Flashlight Find | Part of each division fact is hidden in the dark. Shine the light on the number that belongs there. |
| `3.OA.B.5-1` Use the commutative property (6 x 4 = 4 x 6) | 3 | 🔃 Turn the Array | Turn an array on its side and the rows become columns, but nothing is added or lost. |
| `3.OA.B.5-2` Use the associative property (3 x 5 x 2 = 3 x 10) | 3 | 🫧 Group to Multiply | With three numbers to multiply, you choose which two go first. Look for a pair that makes ten. |
| `3.OA.B.5-3` Use the distributive property (8 x 7 = 8 x 5 + 8 x 2) | 3 | 🪓 Split and Multiply | A hard fact can be chopped into two easy ones. Split one factor, multiply both parts, then add. |
| `3.OA.B.6-1` Solve 32 / 8 by finding 8 x ? = 32 | 3 | 🧠 Think Multiplication | Every division fact has a multiplication fact hiding inside. Use the times fact to solve it. |
| `3.OA.B.6-2` Write related multiplication and division facts | 3 | 🌳 Times Family Tree | Three numbers make a family of multiplication and division facts. Tap every fact that truly belongs. |
| `3.OA.C.7-1` Know multiplication facts for 0, 1, 2, 5, 10 | 3 | 🦸 Zero the Hero | Times zero wipes everything out, and times one changes nothing. Send each fact to its product. |
| `3.OA.C.7-2` Know facts for 3, 4, 6 using known facts (6 x 7 = 5 x 7 + 7) | 3 | ➕ One More Group | A fact you do not know is often one group more than a fact you do know. Build it from there. |
| `3.OA.C.7-3` Know facts for 7, 8, 9 | 3 | 🥊 Tough Facts Arena | The sevens, eights and nines are the champions of tricky. Send each fact to its product. |
| `3.OA.C.7-4` Know division facts by thinking multiplication | 3 | 🏁 Division Dash | Each race car carries a division fact. Park every car in the lane that shows its answer. |
| `3.OA.D.8-1` Choose the operations for each step | 3 | ♟️ Two Moves | These problems take two moves, and each move may need a different operation. Finish both. |
| `3.OA.D.8-2` Write an equation with a letter for the unknown | 3 | 🔤 Letter for the Unknown | A whole two-step story can fit in one equation. Use the letter for the number you want to find. |
| `3.OA.D.8-3` Check answers with mental math and estimation | 3 | 🤨 Does It Make Sense? | A quick estimate tells you whether an answer is even close. Sort the claims that make sense from the ones that are way off. |
| `3.OA.D.9-1` Find patterns in the addition and multiplication tables | 3 | 🕸️ Table Patterns | The times table is full of patterns. Look at one row and tap everything that is true about every number in it. |
| `3.OA.D.9-2` Explain patterns using properties (4 x n is always even) | 3 | 🎭 Always Even? | Some products come out even every single time. Find out which ones, and why. |
| `GA-3-GSR.6.1-1` Find parallel and perpendicular segments in polygons | 3 | 🛤️ Tilted but Parallel | Parallel lines never meet, even when they lean. Perpendicular lines make a square corner, even when turned. |
| `GA-3-GSR.6.1-2` Identify right angles | 3 | 📐 Corner Checker | Check every corner of the shape. Mark only the ones that are square corners. |
| `GA-3-GSR.6.3-1` Draw lines of symmetry in polygons | 3 | ❄️ Mirror Lines | A line of symmetry is a fold that makes two matching halves. Some shapes have several. Some lines only look like one. |
| `GA-3-NR.1.1-1` Read and write 4-digit numbers in standard and expanded form | 3 | 🏛️ Thousands Speller | Four-digit numbers need all four places filled, even when a place is empty. Write each number with digits. |
| `GA-3-NR.1.1-2` Compare 4-digit numbers with >, =, < | 3 | 🦖 Dino Bite Signs | The dinosaur always bites toward the bigger number. Compare from the thousands down. |
| `GA-3-PAR.3.4-1` Decide if two expressions are equal (4 x 3 = 6 + 6) | 3 | 🟰 Both Sides Equal | An equation is true when the two sides are worth the same, even if they look nothing alike. |
| `4.G.A.1-1` Draw points, lines, segments, rays | 4 | ➡️ Point, Line, Segment, Ray | A line goes on forever both ways. A ray starts at a point and goes on forever one way. A segment stops at both ends. |
| `4.G.A.1-2` Draw right, acute, obtuse angles | 4 | 🦈 Acute, Right or Obtuse | A right angle is a square corner, exactly 90 degrees. Acute angles are smaller and obtuse angles are bigger. |
| `4.G.A.1-3` Draw perpendicular and parallel lines | 4 | 🚂 Railroad Tracks | Parallel lines never meet, like railroad tracks. Perpendicular lines cross at square corners. |
| `4.G.A.2-1` Classify 2D figures by parallel or perpendicular lines | 4 | 🕵️ Side Detective | Look closely at the sides of each shape. Parallel sides can hide when the shape is turned. |
| `4.G.A.2-2` Classify by angle size; identify right triangles | 4 | ⛰️ Right Triangle Hunt | A right triangle has one square corner. It is still a right triangle when the square corner is on its roof or its side. |
| `4.G.A.3-1` Identify lines of symmetry | 4 | 📄 Fold Shop | The fold shop only makes folds where both halves match. Find every fold that works. |
| `4.G.A.3-2` Draw lines of symmetry | 4 | 🦋 Every Fold Line | A line of symmetry can be straight up, flat, or slanted. Find every fold that makes the two halves match. |
| `4.MD.A.1-1` Know relationships within metric units (1 m = 100 cm) | 4 | 🔬 Metric Shrink Ray | Zap a measurement into a smaller unit. Smaller units means you need more of them. |
| `4.MD.A.1-2` Know relationships within customary units and time (1 ft = 12 in) | 4 | 🧮 Twelve, Sixty, Sixteen | Feet, hours and pounds do not go by tens. Each one has its own special number. |
| `4.MD.A.1-3` Make conversion tables | 4 | 📋 Conversion Table | A conversion table lists the same lengths in two units. Every pair in it follows the same rule. |
| `4.MD.A.2-1` Solve problems with distance, time, volume, mass, and money | 4 | 🪢 Mixed Unit Mix-Up | These stories mix two different units. Change everything to the same unit before you add or subtract. |
| `4.MD.A.2-2` Solve problems with fractions or decimals of units | 4 | ⏳ Half Hours and Quarters | Measurements often come with halves and decimals. Take care with what half of each unit really is. |
| `4.MD.A.2-3` Show measurements on a number line | 4 | 🧭 Measure on the Line | A number line can show time, liquid or length. Each small step is the same size, so count the steps with care. |
| `4.MD.A.3-1` Apply A = l x w and P = 2l + 2w | 4 | 🐶 Puppy Yard | Build yards for the puppies. Fence goes around the edge and grass covers the inside. |
| `4.MD.A.3-2` Find an unknown side from area or perimeter | 4 | 🚪 Work Back to the Side | You know the area or the distance around, and one side. Work backward to find the side that is missing. |
| `4.MD.B.4-1` Make a line plot with measurements in 1/2, 1/4, 1/8 | 4 | 🐛 Eighths Line Plot | The bug lengths are measured in halves, quarters and eighths. Put them on a line plot, one X each. |
| `4.MD.B.4-2` Solve add and subtract problems using the line plot | 4 | 🐞 Bug Plot Questions | The line plot shows how long each bug is. Read it with care: the tallest stack is not the longest bug. |
| `4.MD.C.5-1` Know an angle is two rays with a shared endpoint | 4 | 🐊 Which Opens Wider? | An angle is two rays that share an endpoint. Its size is how wide it opens, not how long its sides are. |
| `4.MD.C.5-2` Measure an angle as a fraction of a circle | 4 | 🎡 Turn the Arm | An angle is a turn. A full turn goes all the way around the circle, and every other angle is a fraction of that. |
| `4.MD.C.5-3` Know one degree is 1/360 of a circle | 4 | 🧿 One Tiny Degree | Cut a full turn into 360 equal tiny turns. Each one is one degree. Degrees measure turning, not length. |
| `4.MD.C.6-1` Measure angles with a protractor | 4 | 📐 Protractor Reader | A protractor has two rows of numbers. Decide first if the angle is smaller or bigger than a square corner, then pick the number that fits. |
| `4.MD.C.6-2` Sketch angles of a given measure | 4 | 🦾 Angle Maker | Swing the arm open until it points at the right mark on the protractor. No number will help you, so read the marks. |
| `4.MD.C.7-1` Know an angle's measure is the sum of its parts | 4 | 🍕 Angle Wedges | Angles that sit side by side add up, just like slices of pizza make a bigger slice. |
| `4.MD.C.7-2` Find unknown angles in diagrams | 4 | 🔎 Missing Angle | You know the whole angle and one of its parts. Work out the part that is hidden. |
| `4.NBT.A.1-1` Know a digit is worth 10 times as much one place to the left | 4 | 🛗 Digit Elevator | Each floor is a place in a number. Ride digits up or down to change what they are worth. |
| `4.NBT.A.1-2` Use division to compare place values (700 / 70 = 10) | 4 | 🏢 Ten Times the Place | Each floor of the place value building is worth ten times the floor to its right. Use division to see it. |
| `4.NBT.A.2-1` Read and write numbers to 1,000,000 in standard, word, and expanded form | 4 | 🛰️ Million Speller | Mission control reads out a big number. Key it in digit by digit, with a zero for every empty place. |
| `4.NBT.A.2-2` Compare multi-digit numbers using place value | 4 | 🐋 Count the Places | Before comparing big numbers, count how many places each one has. More places means a bigger number. |
| `4.NBT.A.3-1` Round multi-digit numbers to any place | 4 | 🛞 Round It Once | To round, look at just one digit: the one right after the place you are rounding to. Then round one time only. |
| `4.NBT.A.3-2` Use rounding to estimate | 4 | ⚾ Ballpark Sums | You do not always need the exact answer. Round each number, then add or subtract in your head. |
| `4.NBT.B.4-1` Add multi-digit numbers with the standard algorithm | 4 | 🚢 Cargo Ship Sums | Big numbers are loaded place by place. When a place overflows, the extra is carried to the next one. |
| `4.NBT.B.4-2` Subtract with the standard algorithm, including across zeros | 4 | 🏜️ Zero Canyon | A row of zeros stretches across the number like a canyon. Trade your way across it, one place at a time. |
| `4.NBT.B.5-1` Multiply up to 4-digit by 1-digit using place value | 4 | 🧗 Climb the Product | Multiply one place at a time, from the ones up. Carry the extra with you as you climb. |
| `4.NBT.B.5-2` Multiply two 2-digit numbers with an area model | 4 | 🏘️ Four Rooms | Split each number into tens and ones and you get a house with four rooms. Every room is part of the product. |
| `4.NBT.B.5-3` Connect partial products to the area model | 4 | 🗃️ Partial Products | The box is drawn, but its rooms are empty. Fill each room with the product of its row and its column. |
| `4.NBT.B.6-1` Divide up to 4-digit by 1-digit using place value | 4 | 🍱 Share the Hundreds | Share out the hundreds, then the tens, then the ones. When a place has too few to share, a zero keeps its spot. |
| `4.NBT.B.6-2` Use partial quotients or area models | 4 | 🥖 Chunk It Out | Take away big friendly chunks of the divisor, one at a time. Add up the chunks to get the answer. |
| `4.NBT.B.6-3` Write and explain remainders | 4 | 🧆 Leftovers | Sometimes a few are left after sharing equally. The leftover must be too small to make another group. |
| `4.NF.A.1-1` Multiply numerator and denominator by the same number | 4 | 🎀 Ribbon Shop | Cut dyed ribbon into smaller equal parts. The dyed length has to stay exactly the same. |
| `4.NF.A.1-2` Explain with a model why the size stays the same | 4 | 🧈 Cut It Smaller | Cut every piece into smaller pieces and the fraction gets a new name, but the amount of butter has not changed. |
| `4.NF.A.2-1` Compare by finding a common denominator or numerator | 4 | ⛳ Same Size Pieces First | You cannot compare fractions until their pieces are the same size. Rename one, then decide. |
| `4.NF.A.2-2` Compare using a benchmark like 1/2 | 4 | 🚩 Halfway Mark | One half is a handy landmark. Decide whether each fraction falls short of it or goes past it. |
| `4.NF.A.2-3` Know comparisons only work with the same whole | 4 | 🫓 Same Whole Rule | Comparing fractions only makes sense when they are parts of the same size whole. Check the wholes first. |
| `4.NF.B.3-1` Add and subtract as joining and separating parts of the same whole | 4 | 🧩 Fifths Join Up | Adding fractions joins pieces of the same size. The pieces do not change size when you join them. |
| `4.NF.B.3-2` Decompose a fraction into a sum of unit fractions in more than one way | 4 | 🍫 Break It Two Ways | A fraction can be broken into smaller parts in many different ways. Find every way that works. |
| `4.NF.B.3-3` Add and subtract mixed numbers with like denominators | 4 | 🥣 Mixed Number Mixer | Add the wholes and add the parts. When the parts make a whole, trade them in. |
| `4.NF.B.3-4` Solve word problems with like-denominator fractions | 4 | 🥾 Trail Mix Miles | Story problems with fractions work like any other: join or take away pieces of the same whole. |
| `4.NF.B.4-1` Know a/b is a x 1/b | 4 | 🧱 Unit Fraction Stack | Every fraction is built from copies of one small piece. Three fourths is three copies of one fourth. |
| `4.NF.B.4-2` Multiply a fraction by a whole number (3 x 2/5 = 6/5) | 4 | 🖨️ Copy Machine Fractions | The copy machine makes copies of a fraction. More copies means more pieces, but the pieces stay the same size. |
| `4.NF.B.4-3` Solve word problems multiplying a fraction by a whole number | 4 | 🥪 Sandwich Party | Everyone at the party gets the same fraction. Work out how much food that is altogether. |
| `4.NF.C.5-1` Rewrite tenths as hundredths (3/10 = 30/100) | 4 | 🟧 Hundred Tile Floor | A floor of 100 tiles has 10 columns. Each column is one tenth, and each tile is one hundredth. |
| `4.NF.C.5-2` Add tenths and hundredths | 4 | 🪙 Tenths Meet Hundredths | Tenths and hundredths are different size pieces. Rename the tenths as hundredths, then add. |
| `4.NF.C.6-1` Write tenths and hundredths as decimals | 4 | 💧 Decimal Point Drop | A decimal is another way to write tenths and hundredths. The first place after the point is tenths, the second is hundredths. |
| `4.NF.C.6-2` Place decimals on a number line | 4 | ⛵ Decimal Dock | Every decimal has a spot on the number line. Sail the boat to the right dock. |
| `4.NF.C.7-1` Compare decimals to hundredths by size | 4 | 🐧 Decimal Lineup | The penguins line up from least to greatest. A longer decimal is not always a bigger one. |
| `4.NF.C.7-2` Know comparisons need the same whole | 4 | 🥤 Same Cup, Same Amount? | 0.3 of a small cup and 0.3 of a big cup are not the same amount. Check the wholes before you compare. |
| `4.OA.A.1-1` Read 35 = 5 x 7 as '35 is 5 times as many as 7' | 4 | 🐘 Times as Many | A multiplication fact is also a comparison. One amount is so many times as big as another. |
| `4.OA.A.1-2` Write comparison statements as equations | 4 | 🖊️ Say It as an Equation | Turn each comparison in words into an equation. Times as many means multiply. |
| `4.OA.A.2-1` Solve 'times as many' problems with multiplication | 4 | 🪩 Marble Multiplier | One friend has some. The other has several times as many. Key in the bigger amount. |
| `4.OA.A.2-2` Solve 'how many times as many' problems with division | 4 | 🧣 Ribbon Copies | How many copies of the short one fit along the long one? Key in a number and watch the copies line up. |
| `4.OA.A.2-3` Tell multiplicative from additive comparison | 4 | 🆚 More Than or Times As Many? | Five more and five times as many sound alike but are very different. Decide which operation each story needs. |
| `4.OA.A.3-1` Solve multistep problems with all four operations | 4 | 🏫 Supply Room | The school supply room has many-step problems. Keep track of each step until the very end. |
| `4.OA.A.3-2` Interpret remainders in context | 4 | ⛺ Tent Trip | Pack for the camping trip. Work out how many tents and canoes the group really needs. |
| `4.OA.A.3-3` Use estimation to check reasonableness | 4 | 🚦 Traffic Light Check | Before you trust an answer, estimate. Green light for answers that are close, red light for ones that cannot be right. |
| `4.OA.B.4-1` Find all factor pairs of a number 1 to 100 | 4 | 🎣 Factor Pair Fishing | Every number hides pairs of factors that multiply to make it. Catch all of them, and leave the fakes in the water. |
| `4.OA.B.4-2` Know a number is a multiple of each of its factors | 4 | 🧬 Factor or Multiple? | Factors go into a number. Multiples are what you get when you count by it. Sort them out. |
| `4.OA.B.4-3` Tell prime from composite | 4 | 👑 Prime Time | A prime number has exactly two factors: 1 and itself. Everything else bigger than 1 can be broken into smaller factors. |
| `4.OA.C.5-1` Generate a number or shape pattern from a rule | 4 | ⚙️ Rule Machine | Feed the machine a starting number and a rule. It prints the pattern one number at a time. |
| `4.OA.C.5-2` Find features not stated in the rule (odd/even) | 4 | 🎩 Hidden Pattern | A rule makes a pattern, and the pattern has secrets the rule never mentioned. Find what else is true. |
| `4.OA.C.5-3` Use input-output tables | 4 | 📠 In and Out Machine | A number goes in, the rule does its work, and a number comes out. Fill in whichever one is missing. |
| `5.G.A.1-1` Know axes, origin, and ordered pairs | 5 | 🗺️ Across, Then Up | A treasure map uses two numbers for every spot. The first says how far across, the second says how far up. |
| `5.G.A.1-2` Locate points from ordered pairs | 5 | 🌟 Star Chart | Each star has an address made of two numbers. Count the steps from the origin to put each star in its place. |
| `5.G.A.2-1` Graph points in the first quadrant | 5 | 🗺️ Treasure Map | The parrot calls out where X marks the spot. Walk across, climb up, and dig. |
| `5.G.A.2-2` Interpret coordinates in context | 5 | 🌻 What the Point Says | A sunflower is measured every week. Each point on its graph tells two things: which week, and how tall. |
| `5.G.B.3-1` Know subcategories share all attributes of their category | 5 | 👪 Family Rules | Shapes belong to families. Whatever is true for the whole family is true for every member of it. |
| `5.G.B.3-2` Explain with examples (all rectangles have 4 right angles) | 5 | ⚖️ Prove It With a Property | Shapes are sorted by their properties, not by how they look. Give the real reason each time. |
| `5.G.B.4-1` Classify figures in a hierarchy | 5 | 🎟️ Every Name That Fits | One shape can wear many name tags at once. Tap every name that is true for it. |
| `5.G.B.4-2` Draw a hierarchy diagram | 5 | 🌳 Shape Family Tree | The biggest family is at the top of the tree. Each branch below it is a smaller, more special group. |
| `5.MD.A.1-1` Convert within metric units | 5 | 🧪 Metric Slide | Changing metric units means multiplying or dividing by 10, 100 or 1,000. Decide first if the number should grow or shrink. |
| `5.MD.A.1-2` Convert within customary units | 5 | 🧰 Inches, Ounces, Quarts | Customary units each have their own number: 12 inches in a foot, 16 ounces in a pound, 4 quarts in a gallon. |
| `5.MD.A.1-3` Use conversions in multistep problems | 5 | 🪚 Convert, Then Solve | In these jobs the measurements come in two different units. Get everything into one unit, then finish the problem. |
| `5.MD.B.2-1` Make a line plot of fraction measurements | 5 | ⚗️ Beaker Line Plot | The science class measured liquid in beakers. Put each measurement on the line plot, one X each. |
| `5.MD.B.2-2` Use operations to answer questions about the data | 5 | 🧫 Level the Beakers | Pour all the beakers together, then share the liquid out again so every beaker holds the same amount. |
| `5.MD.C.3-1` Know a unit cube has one cubic unit of volume | 5 | 📦 Flat or Filled? | Area covers a flat surface with squares. Volume fills a space with cubes. Decide which one each job needs. |
| `5.MD.C.3-2` Know volume is the number of unit cubes that fill a solid | 5 | 🧊 Hidden Cubes | Some cubes are hiding in the middle and at the back of the box. Count them by layers so none are missed. |
| `5.MD.C.4-1` Count unit cubes to find volume | 5 | 🏗️ Cube Builder | Build a box out of unit cubes, then count how many it took. Count whole cubes, not the little squares on the outside. |
| `5.MD.C.4-2` Use cubic cm, in, ft | 5 | 🏷️ Label the Volume | A measurement needs the right label. Lengths get plain units, areas get square units and volumes get cubic units. |
| `5.MD.C.5-1` Pack a prism and show V = l x w x h | 5 | 📦 Crate Packer | Pack each crate full of cubes, one layer at a time. Order exactly enough. |
| `5.MD.C.5-2` Apply V = l x w x h and V = B x h | 5 | 🐟 Fill the Tank | Volume is length × width × height. If you already know the area of the base, just multiply it by the height. |
| `5.MD.C.5-3` Find volume of figures made of two prisms | 5 | 🏬 Two Box Building | A building made of two boxes has the volume of both boxes together. Find each one, then add. |
| `5.NBT.A.1-1` Know a digit is 10 times the place to its right | 5 | 🪜 Ten Times, Every Step | Each step to the left on the place value ladder is worth ten times more. The ladder keeps going past the decimal point. |
| `5.NBT.A.1-2` Know a digit is 1/10 of the place to its left | 5 | 🏘️ One Tenth of the Neighbor | Move one place to the right and a digit shrinks to one tenth of what it was. |
| `5.NBT.A.2-1` Explain zeros in products when multiplying by powers of 10 | 5 | 🚀 Power of Ten Launch | Multiplying by 10, 100 or 1,000 shifts every digit to a bigger place. It is not just about sticking zeros on the end. |
| `5.NBT.A.2-2` Explain how the decimal point moves when multiplying or dividing by powers of 10 | 5 | 🛝 Slide the Point | Multiply by 10 and the number gets bigger. Divide by 10 and it gets smaller. The decimal point shows which way. |
| `5.NBT.A.2-3` Use whole-number exponents for powers of 10 | 5 | 🎈 Tiny Raised Number | The small raised number tells how many tens are multiplied together. 10³ is three tens multiplied, not 10 times 3. |
| `5.NBT.A.3-1` Read and write decimals in standard, word, and expanded form | 5 | 🔤 Thousandths in Words | Read a decimal by its last place. 0.305 ends in the thousandths place, so it is counted in thousandths. |
| `5.NBT.A.3-2` Compare decimals to thousandths | 5 | 🐌 Critter Race | Three slow critters raced along a one meter track. Hand out the medals by distance. |
| `5.NBT.A.4-1` Round decimals to any place | 5 | 🎳 Round the Decimal | Rounding decimals works like rounding whole numbers. Find the place, look one digit to the right. |
| `5.NBT.A.4-2` Use a number line to justify | 5 | 🚩 Closer To Which End? | Zoom in on the number line. A decimal rounds to whichever end it sits closer to. |
| `5.NBT.B.5-1` Multiply multi-digit numbers fluently | 5 | 🏗️ Second Row Zero | When you multiply by the tens digit, you are multiplying by tens. That row needs a zero to hold the ones place. |
| `5.NBT.B.5-2` Estimate to check products | 5 | 🎈 Ten Times Too Big | One slipped digit makes a product ten times too big or too small. A quick estimate catches it. |
| `5.NBT.B.6-1` Divide up to 4-digit by 2-digit numbers | 5 | 🚚 Divide by Two Digits | Dividing by a two-digit number takes good guesses. Estimate each digit of the answer, then check by multiplying. |
| `5.NBT.B.6-2` Explain with area models or equations | 5 | 🧀 Easy Chunks | Break a hard division into easy chunks. Take away friendly multiples of the divisor, then add up how many you took. |
| `5.NBT.B.7-1` Add and subtract decimals | 5 | 🎯 Line Up the Points | When adding decimals, the decimal points must line up so tenths meet tenths and ones meet ones. |
| `5.NBT.B.7-2` Multiply decimals | 5 | 🧇 Tenths Times Tenths | A waffle of 100 squares shows what happens when tenths multiply tenths: you get hundredths. |
| `5.NBT.B.7-3` Divide decimals | 5 | 🧵 How Many Fit? | Dividing by a decimal asks how many of that small piece fit. Lots of small pieces can fit in a short length. |
| `5.NBT.B.7-4` Explain the strategy with models | 5 | 💡 Why the Point Goes There | Say the decimals as tenths and hundredths, and it is clear where the decimal point has to go. |
| `5.NF.A.1-1` Find a common denominator | 5 | 🤝 Common Ground | Thirds and fourths cannot be added until they are cut into the same size pieces. Find a size that works for both. |
| `5.NF.A.1-2` Add and subtract with unlike denominators | 5 | 🧃 Juice Jug | Pour two juices into one jug, then label exactly how full it is. |
| `5.NF.A.1-3` Add and subtract mixed numbers with unlike denominators | 5 | 🫙 Mixed and Unlike | These mixed numbers have different size pieces. Rename the fraction parts first, then add or subtract. |
| `5.NF.A.2-1` Solve add and subtract fraction word problems | 5 | 🚶 Fraction Stories | Read the story, decide whether the amounts are joined or taken away, then rename the fractions and compute. |
| `5.NF.A.2-2` Use benchmarks to check reasonableness | 5 | 🤔 Benchmark Check | Before you trust a fraction answer, compare it with one half and with one whole. Some answers cannot be right. |
| `5.NF.B.3-1` Know a/b = a / b | 5 | ➗ Fraction Bar Means Divide | A fraction and a division are the same thing written two ways. 3 ÷ 4 is three fourths. |
| `5.NF.B.3-2` Solve sharing problems with fraction answers | 5 | 🍕 Share It All | When things are shared fairly, nothing is left on the table. The leftovers get cut up and shared too. |
| `5.NF.B.4-1` Find a fraction of a whole number or fraction | 5 | 🍓 Fraction of a Bunch | To find a fraction of a bunch, split the bunch into equal groups and take some of the groups. |
| `5.NF.B.4-2` Multiply two fractions | 5 | 🪜 Straight Across | To multiply two fractions, go straight across: top times top, and bottom times bottom. |
| `5.NF.B.4-3` Find area of rectangles with fraction sides | 5 | 🌱 Fraction Garden Plot | A garden plot can be less than one foot on each side. Its area is still length times width. |
| `5.NF.B.5-1` Compare product size to factor size without multiplying | 5 | 🎚️ Bigger or Smaller Than 20? | Multiplying does not always make a number bigger. Look at the fraction: is it more than 1, less than 1, or exactly 1? |
| `5.NF.B.5-2` Know multiplying by a fraction less than 1 makes it smaller | 5 | 🐜 Shrinking Times | Multiply by a fraction smaller than 1 and the number shrinks. Half of 8 is less than 8. |
| `5.NF.B.6-1` Solve problems multiplying fractions and mixed numbers | 5 | 🥞 Half the Recipe | To take a fraction of a mixed number, first turn the mixed number into one fraction. Then multiply. |
| `5.NF.B.6-2` Use models to represent the problem | 5 | 🧁 Part of a Part | Two thirds OF three fourths means: first mark three fourths, then take two thirds of just that part. |
| `5.NF.B.7-1` Divide a unit fraction by a whole number (1/3 / 4) | 5 | 🍰 Slice the Slice | Share one third of a cake among 4 friends. Each piece is a slice of a slice, so it is smaller. |
| `5.NF.B.7-2` Divide a whole number by a unit fraction (4 / 1/5) | 5 | 🧩 How Many Little Pieces? | 4 ÷ one fifth asks: how many fifths are in 4 wholes? Every whole holds 5 of them. |
| `5.NF.B.7-3` Solve word problems with this division | 5 | 🥜 Bag the Nuts | How many small bags can you fill? How big is each share? Division stories with unit fractions come in both kinds. |
| `5.OA.A.1-1` Use parentheses, brackets, and braces | 5 | 🥚 Parentheses First | Parentheses are like an eggshell around part of a problem. Crack that part open and work it out first. |
| `5.OA.A.1-2` Evaluate expressions with grouping symbols | 5 | 🫧 Bubble First | The number machine squishes two numbers at a time. Anything inside the bubble goes first. |
| `5.OA.A.2-1` Write an expression for a calculation in words | 5 | 📝 Words to Expression | Turn a sentence into numbers and symbols. Parentheses keep a sum or difference together. |
| `5.OA.A.2-2` Interpret an expression without evaluating it | 5 | 🔭 No Need to Solve | You can tell a lot about an expression without working it out. Look at what is done to the part in parentheses. |
| `5.OA.B.3-1` Generate two patterns from two rules | 5 | 🐇 Two Rule Race | The rabbit and the turtle each follow their own rule. Write the first numbers of each pattern. |
| `5.OA.B.3-2` Form ordered pairs from corresponding terms and graph them | 5 | 🪁 Pattern Pairs | Take one number from each pattern, in order, and you get a point. Plot the pairs and watch them line up. |
| `5.OA.B.3-3` Describe how the terms are related | 5 | 🧶 How the Patterns Fit | Two patterns grow side by side. Look across, from one to the other, to see how they are tied together. |
| `6.EE.A.1-1` Write repeated multiplication with exponents | 6 | 🦠 Germ Lab | Germs multiply by splitting. Use exponents to say how many will fill the dish. |
| `6.EE.A.1-2` Evaluate expressions with whole-number exponents | 6 | ⚡ Powers Go First | An exponent sticks only to the number it sits on. Work out powers before you multiply or add. |
| `6.EE.A.2-1` Write expressions from words ('5 less than y' = y - 5) | 6 | 🔤 Words Into Algebra | Phrases turn into expressions. Watch the order: 5 less than y starts from y. |
| `6.EE.A.2-2` Name parts of an expression: term, factor, coefficient | 6 | 🧩 Parts of an Expression | Expressions have named parts. A coefficient multiplies a variable. A term is a piece joined by plus or minus. |
| `6.EE.A.2-3` Evaluate expressions and formulas for given values | 6 | 🔌 Plug It In | A letter next to a number means multiply. To evaluate, swap the letter for its value and compute. |
| `6.EE.A.2-4` Use order of operations, including exponents | 6 | 🪜 Order With Letters | Once the letters become numbers, the order of operations still rules. Powers first, then multiply, then add. |
| `6.EE.A.3-1` Apply the distributive property (3(2 + x) = 6 + 3x) | 6 | 🎁 Share With Everyone Inside | The number outside the parentheses multiplies every term inside, not just the first one. |
| `6.EE.A.3-2` Combine like terms (y + y + y = 3y) | 6 | 🍎 Like Terms Only | You can add apples to apples. Terms with the same variable combine. A plain number and an x term do not. |
| `6.EE.A.4-1` Test expressions with values to see if they are equivalent | 6 | 🧪 Test More Than Once | Two expressions are equivalent if they give the same value for EVERY number. One lucky match does not prove it. |
| `6.EE.A.4-2` Explain equivalence with properties | 6 | 📜 Name the Property | You do not have to test numbers to know two expressions are equal. A property guarantees it. |
| `6.EE.B.5-1` Know a solution makes an equation or inequality true | 6 | 🗝️ Make It True | A solution is a value that makes the equation or inequality a true statement. Try each one. |
| `6.EE.B.5-2` Substitute values to check | 6 | 🔍 Substitute and See | To check a possible solution, put it in and compute the WHOLE left side. Then compare. |
| `6.EE.B.6-1` Use a variable for an unknown number | 6 | 🎟️ Letter for a Number | A variable stands for a number you do not know yet. It is not a label for an object. |
| `6.EE.B.6-2` Know a variable can stand for any number in a set | 6 | 🎲 Any Number Will Do | In an expression like n + 5, the letter n can be any number from the set you are working in. |
| `6.EE.B.7-1` Solve x + p = q | 6 | ⚖️ Undo the Adding | An equation is a balanced scale. To find x, undo what was added to it, on both sides. |
| `6.EE.B.7-2` Solve px = q | 6 | 🧮 Undo the Multiplying | 4x means 4 times x. To find x, undo the multiplying by dividing both sides. |
| `6.EE.B.7-3` Write and solve one-step equations from word problems | 6 | 💵 Story to Equation | A word problem hides an equation. Let a letter stand for the unknown, write the equation, then solve it. |
| `6.EE.B.8-1` Write x > c or x < c for a constraint | 6 | 🎢 At Least, At Most | Rules and limits are written as inequalities. At least means that number or more. At most means that number or less. |
| `6.EE.B.8-2` Know an inequality has infinitely many solutions | 6 | ♾️ So Many Solutions | An equation like x + 2 = 7 has one solution. An inequality like x > 5 has more solutions than you could ever list. |
| `6.EE.B.8-3` Graph inequalities on a number line | 6 | ⭕ Open or Closed Circle | An inequality is graphed with a circle and an arrow. The circle is open when the number itself is not included. |
| `6.EE.C.9-1` Name which quantity depends on the other | 6 | ⏱️ Which Depends on Which? | When two quantities are linked, one depends on the other. Pay depends on hours worked, not the other way around. |
| `6.EE.C.9-2` Write an equation relating two variables | 6 | 🧾 Two Variable Equation | An equation with two variables shows how one quantity is found from the other. |
| `6.EE.C.9-3` Connect the equation to a table and graph | 6 | 🔗 Equation, Table, Graph | An equation, a table and a graph are three views of one relationship. Each one can be made from the others. |
| `6.G.A.1-1` Find area of right triangles as half a rectangle | 6 | ⛵ Sail Maker | Cut cloth for triangle sails. Order exactly the squares of cloth each sail covers. |
| `6.G.A.1-2` Find area of any triangle with base and height | 6 | 🔺 Height Not Slant | A triangle is half of a rectangle with the same base and height. The height goes straight up, never along a slanted side. |
| `6.G.A.1-3` Find area of parallelograms, trapezoids, and polygons by decomposing | 6 | ✂️ Split the Shape | Any polygon can be cut into rectangles and triangles. Find each piece once, then add them all. |
| `6.G.A.2-1` Pack a prism with fractional unit cubes | 6 | 🧊 Half-Cube Packing | When a box has fraction edges, pack it with smaller cubes. Half-unit cubes fit along any edge measured in halves. |
| `6.G.A.2-2` Apply V = l x w x h with fractions | 6 | 📦 Fraction Box Volume | Volume is still length times width times height, even when an edge is a fraction. |
| `6.G.A.3-1` Draw polygons from vertex coordinates | 6 | 📍 Connect the Corners | A polygon can be given by the coordinates of its corners. Plot them, then join them in order around the shape. |
| `6.G.A.3-2` Find side lengths with the same x or y coordinate | 6 | 📏 Count the Units Between | When two corners share a coordinate, the side between them runs straight along the grid. Its length is the difference of the other coordinates. |
| `6.G.A.4-1` Draw nets of prisms and pyramids | 6 | 🎲 Will It Fold? | A net is a flat pattern that folds into a solid. A cube needs six squares, but not every six-square pattern folds up. |
| `6.G.A.4-2` Find surface area from nets | 6 | 🎁 Unfold and Add | Surface area is the wrapping paper. Unfold the box into its six faces and add up their areas. |
| `6.NS.A.1-1` Explain fraction division with models (how many 3/4 are in 2/3) | 6 | 🍨 Scoop Shop | A tub holds a few cups of ice cream. Work out how many scoops it will serve. |
| `6.NS.A.1-2` Compute quotients of fractions | 6 | 🔃 Flip the Second One | To divide by a fraction, multiply by its flip. Only the second fraction, the one you divide by, gets flipped. |
| `6.NS.A.1-3` Solve word problems with fraction division | 6 | 🍲 Soup Servings | How many servings fit in the pot? That is a division question, even when the serving is a fraction. |
| `6.NS.B.2-1` Use the standard long division algorithm | 6 | 🧮 Zero Holds the Place | In long division, when the divisor does not fit into a place, that place still needs a digit: zero. |
| `6.NS.B.2-2` Check quotients with multiplication | 6 | ✅ Multiply to Check | Every division can be checked. Multiply the answer by the divisor and you should get back where you started. |
| `6.NS.B.3-1` Add and subtract multi-digit decimals | 6 | 🧾 Decimal Stack | Adding a column of decimals works only when the decimal points sit in one straight line. |
| `6.NS.B.3-2` Multiply decimals with the standard algorithm | 6 | ✖️ Count the Decimal Places | When multiplying decimals, the answer has as many decimal places as both factors put together. |
| `6.NS.B.3-3` Divide decimals, including by a decimal divisor | 6 | ➗ Shift Both Points | To divide by a decimal, slide the point in the divisor until it is a whole number. Slide the other point the same way. |
| `6.NS.B.4-1` Find the greatest common factor of two numbers up to 100 | 6 | 🔑 Greatest Common Factor | A common factor divides both numbers. The greatest one is the biggest number that goes into both. |
| `6.NS.B.4-2` Find the least common multiple of two numbers up to 12 | 6 | 🚌 Least Common Multiple | Two buses leave together, then on their own schedules. The least common multiple is when they next leave together. |
| `6.NS.B.4-3` Use the distributive property to factor out a GCF (36 + 8 = 4(9 + 2)) | 6 | 📦 Factor It Out | A sum of two numbers can be rewritten as their common factor times a smaller sum. Both numbers get divided. |
| `6.NS.C.5-1` Use signed numbers for real situations (temperature, elevation, money) | 6 | 🌊 Above and Below Zero | Negative numbers describe real things: depths below sea level, temperatures below zero, money owed. |
| `6.NS.C.5-2` Explain what 0 means in each situation | 6 | 🌡️ What Zero Means | Zero is not always nothing. On a scale with negatives, zero is a meaningful starting line. |
| `6.NS.C.6-1` Know opposite numbers are on opposite sides of 0; -(-3) = 3 | 6 | 🪞 Mirror Across Zero | Every number has an opposite the same distance from zero on the other side. The opposite of an opposite brings you back. |
| `6.NS.C.6-2` Use signs of coordinates to name quadrants | 6 | 🧭 Quadrant Sorter | The signs of a point tell which quarter of the plane it is in. Count the quadrants from the upper right, going left around. |
| `6.NS.C.6-3` Place integers and rational numbers on horizontal and vertical number lines | 6 | ❄️ Between the Negatives | Negative numbers count leftward from zero. So −3.5 is past −3, not before it. |
| `6.NS.C.6-4` Plot rational-number pairs on the coordinate plane | 6 | 🌌 Four Quadrant Star Map | With negative numbers the plane has four quarters. The first number still goes across, the second still goes up or down. |
| `6.NS.C.7-1` Read inequalities as positions on a number line | 6 | ⬅️ Left Is Less | On a number line, whatever is farther left is less. That is true for negative numbers too. |
| `6.NS.C.7-2` Write and explain order statements in context | 6 | 🥶 Coldest to Warmest | The lower the temperature, the colder it is. A bigger number after the minus sign means colder. |
| `6.NS.C.7-3` Know absolute value is distance from 0 | 6 | 📏 Distance From Zero | Absolute value asks one thing: how far is this number from zero? A distance is never negative. |
| `6.NS.C.7-4` Tell absolute value comparisons from order | 6 | 💳 Debt and Depth | A balance of −30 is LESS than a balance of −10. But a debt of 30 is MORE than a debt of 10. Order and size are different ideas. |
| `6.NS.C.8-1` Graph points in all four quadrants to solve problems | 6 | 📐 Corner Finder | Plot corner points in all four quadrants and a shape appears. Count from the right axis each time. |
| `6.NS.C.8-2` Find distances between points with the same x or y | 6 | ↔️ Across the Axis | When two points share a coordinate, the distance between them is a straight count, even across an axis. |
| `6.RP.A.1-1` Describe a ratio relationship in words (3 to 2, 3 for every 2) | 6 | 🔴 Marble Ratio Words | A ratio compares two amounts. 3 red to 2 blue means for every 3 red marbles there are 2 blue ones. |
| `6.RP.A.1-2` Tell part-to-part from part-to-whole ratios | 6 | 🔵 Part or Whole? | Some ratios compare one part with another part. Others compare a part with the whole group. Read which one is asked. |
| `6.RP.A.1-3` Represent ratios with tape diagrams and double number lines | 6 | 🧃 Juice Tape | A tape diagram shows a ratio with equal-size boxes. Build the recipe one box at a time. |
| `6.RP.A.2-1` Find the unit rate a/b for a ratio a:b | 6 | 🍏 Price Per Pound | A unit rate tells how much for just ONE. Divide the amount by the number of units. |
| `6.RP.A.2-2` Use rate language ('per', 'for each') | 6 | 🥣 Per and For Each | Rate language uses per and for each. It always tells what ONE unit gets. |
| `6.RP.A.3-1` Make tables of equivalent ratios and find missing values | 6 | 🍚 Ratio Table | Every column of a ratio table is the same recipe made bigger. Multiply both amounts by the same number. |
| `6.RP.A.3-2` Plot ratio pairs on the coordinate plane and compare ratios | 6 | 📈 Ratio Line Up | Plot pairs from a ratio table. Equivalent ratios always fall on one straight line through the origin. |
| `6.RP.A.3-3` Solve unit price and constant speed problems | 6 | 🥤 Smoothie Run | You run a smoothie stand. Shop smart: find what ONE fruit costs before you buy. |
| `6.RP.A.3-4` Find a percent of a quantity as a rate per 100 | 6 | 💯 Percent of It | Percent means per hundred. 30% of 50 is 30 for every 100, so it is less than 30. |
| `6.RP.A.3-5` Find the whole given a part and the percent | 6 | 🧩 Find the Whole | Sometimes you know the part and the percent, and the whole is hidden. Work backward to find it. |
| `6.RP.A.3-6` Convert measurement units with ratios | 6 | 📏 Unit Swap | A conversion is a ratio. Decide whether you need more of the new unit or fewer, then multiply or divide. |
| `6.SP.A.1-1` Tell statistical questions from non-statistical ones | 6 | 🚚 Survey Truck | The survey truck collects data. Send it out only for questions whose answers will vary. |
| `6.SP.A.1-2` Know statistical questions expect variability | 6 | 📋 Will the Answers Vary? | A statistical question expects many different answers. You need data to answer it, because the answers vary. |
| `6.SP.A.2-1` Describe a distribution by center, spread, and shape | 6 | 📊 Center, Spread, Shape | A set of data has a center, a spread and a shape. Describing all three tells the whole story. |
| `6.SP.A.2-2` Recognize clusters, gaps, and outliers | 6 | 🔭 Cluster, Break, Outlier | Data often bunches into a cluster. An outlier sits far away from the rest, across an empty stretch. |
| `6.SP.A.3-1` Know a measure of center summarizes with one number | 6 | 🎯 One Number for the Middle | A measure of center sums up a whole data set with one number. The mean is the fair share, not the most common value. |
| `6.SP.A.3-2` Know a measure of variability describes spread | 6 | ↔️ How Spread Out? | A measure of spread tells how stretched out the data is. The range is the greatest value minus the least. |
| `6.SP.A.3-3` Find the mean as a fair share | 6 | 🧱 Level the Towers | The mean is a fair share. Move blocks from tall towers to short ones until every tower is the same height. |
| `6.SP.B.4-1` Make a dot plot | 6 | ✖️ Dot Plot Builder | A dot plot stacks one mark for each data value above an evenly spaced number line. A value with no data keeps its empty space. |
| `6.SP.B.4-2` Make a histogram with equal intervals | 6 | 📶 Histogram Bins | A histogram groups data into bins. Every bin must be the same width, and the bars touch. |
| `6.SP.B.4-3` Make a box plot from the five-number summary | 6 | 🗃️ Build the Box Plot | A box plot shows five numbers. The box holds the middle half of the data: from the first quartile to the third. |
| `6.SP.B.5-1` Report the number of observations | 6 | 🔢 How Many Observations? | Each data value is one observation. The number of observations is how many values there are, not what they add up to. |
| `6.SP.B.5-2` Describe what was measured and how | 6 | 🏷️ What Was Measured? | Numbers alone mean little. A good data report says what was measured, how, and in what unit. |
| `6.SP.B.5-3` Find median, mean, IQR, and mean absolute deviation | 6 | 🪜 Order First, Then Middle | The median is the middle value, but only after the data is put in order. Other measures have their own steps. |
| `6.SP.B.5-4` Choose measures that fit the shape of the data | 6 | 🏠 Mean or Median? | One extreme value drags the mean far from what is typical. The median stays put, so it fits lopsided data better. |
| `7.EE.A.1-1` Combine like terms with rational coefficients | 7 | 📦 Crate Count | Each x is a sealed crate of apples. Tidy the dock by counting crates and loose apples separately. |
| `7.EE.A.1-2` Expand expressions with negative coefficients | 7 | ➖ Negative Outside | A negative in front of a bracket changes the sign of every term inside when you multiply through. |
| `7.EE.A.1-3` Factor linear expressions (6x + 9 = 3(2x + 3)) | 7 | 🧲 Pull Out the Factor | Factoring is distributing in reverse. Find the number that divides every term and pull it out front. |
| `7.EE.A.2-1` Explain what an equivalent form reveals (a + 0.05a = 1.05a) | 7 | 🏷️ One Multiplier | A price plus 5% of itself is the same as 1.05 times the price. Rewriting shows the whole change as one multiplication. |
| `7.EE.A.2-2` Choose a form that answers the question | 7 | 🧰 Best Form for the Job | Two equivalent expressions can tell different stories. Pick the form that shows what the question asks about. |
| `7.EE.B.3-1` Convert between forms to solve (fractions, decimals, percents) | 7 | 💼 Raise and Discount | Problems mix percents, fractions and decimals. Change them into one form you can compute with. |
| `7.EE.B.3-2` Estimate to check reasonableness | 7 | 🚪 Does the Estimate Fit? | Round the numbers and work it out in your head. An exact answer far from your estimate needs another look. |
| `7.EE.B.4-1` Solve px + q = r and p(x + q) = r | 7 | ⚖️ Two-Step Balance | A two-step equation is unwrapped in reverse. Undo the adding or subtracting first, then undo the multiplying. |
| `7.EE.B.4-2` Compare algebraic and arithmetic solutions | 7 | 🏋️ Two Ways to Solve | A story problem can be solved with an equation or by working backward with arithmetic. Both use the same steps in the same order. |
| `7.EE.B.4-3` Solve px + q > r | 7 | 🔀 Flip the Sign | Solving an inequality works like solving an equation, with one twist. Multiply or divide by a negative and the sign flips. |
| `7.EE.B.4-4` Graph and interpret the solution set | 7 | 🎚️ Graph the Solution Set | The solutions of an inequality fill part of the number line. The graph shows where they start and which way they go. |
| `7.G.A.1-1` Find actual lengths from a scale drawing | 7 | 🏗️ Blueprint Builder | The blueprint is small and the building is big. Use the scale to find each real length. |
| `7.G.A.1-2` Find actual areas from a scale drawing | 7 | 🗺️ Scale It Squared | On a scale drawing, each side grows by the scale. So the area grows by the scale twice: once for length, once for width. |
| `7.G.A.1-3` Redraw at a different scale | 7 | 📐 Redraw the Plan | To redraw at a new scale, every length changes by the same factor. Stretch only one side and the shape is no longer the same. |
| `7.G.A.2-1` Draw triangles from given angle or side measures | 7 | 🥢 Can It Close? | Three sticks make a triangle only if the two shorter ones together are longer than the longest. |
| `7.G.A.2-2` Know when conditions give one, many, or no triangle | 7 | 🔺 One, Many or None | Three sides pin down exactly one triangle. Three angles pin down the shape but not the size. Some conditions cannot be met at all. |
| `7.G.A.3-1` Describe 2D shapes from slicing prisms and pyramids | 7 | 🔪 Slice the Solid | Cut straight through a solid and look at the flat face you made. Its shape depends on the solid and on the direction of the cut. |
| `7.G.A.3-2` Describe slices of cylinders, cones, spheres | 7 | 🥫 Slice the Round Ones | Round solids hide surprising shapes. A can cut level gives a circle, cut straight down gives a rectangle, and cut at a tilt gives an oval. |
| `7.G.B.4-1` Relate radius, diameter, and circumference | 7 | ⭕ Around the Circle | The diameter goes all the way across a circle. The radius is half of it. The distance around is about 3.14 diameters. |
| `7.G.B.4-2` Use C = 2(pi)r and A = (pi)r^2 | 7 | 🍕 Circle Formulas | Two formulas, two jobs. C = 2πr measures the edge. A = πr² measures the space inside. |
| `7.G.B.4-3` Derive the area formula informally | 7 | 🧀 Wedges to Rectangle | Cut a circle into thin wedges and line them up, tips up and tips down. They make a shape that is almost a rectangle. |
| `7.G.B.5-1` Use supplementary, complementary, vertical, and adjacent angle facts | 7 | 📐 Angle Partners | Some angles come in pairs. Supplementary angles make a straight line, 180°. Complementary angles make a square corner, 90°. Vertical angles are equal. |
| `7.G.B.5-2` Write and solve equations for unknown angles | 7 | ✏️ Angle Equations | An angle fact turns into an equation. Equal angles go on two sides of the equals sign. Angles on a line add to 180. |
| `7.G.B.6-1` Find area of composite 2D figures | 7 | 🏠 House Shape Area | A complicated shape is simple shapes joined together. Split it so no piece overlaps, find each area, and add. |
| `7.G.B.6-2` Find volume of right prisms | 7 | 🧀 Prism Volume: Base First | A prism is its base shape stacked up along its length. Volume is the area of that base times how far it is stacked. |
| `7.G.B.6-3` Find surface area of prisms and cylinders | 7 | 🎀 Wrap Every Face | Surface area covers every face, including the ones you cannot see from the front. |
| `7.NS.A.1-1` Know opposites combine to 0 | 7 | 🐸 Zero Pairs | A number and its opposite cancel out. Five steps left and five steps right bring you back to zero. |
| `7.NS.A.1-2` Show p + q as moving |q| from p on a number line | 7 | 🚤 Deep Dive | Steer the submarine along the number line. Adding a negative number sends it left. |
| `7.NS.A.1-3` Rewrite subtraction as adding the opposite | 7 | 🔁 Add the Opposite | Subtracting a number is the same as adding its opposite. Change BOTH things: the minus becomes plus, and the number flips sign. |
| `7.NS.A.1-4` Find distance as absolute value of the difference | 7 | 📍 How Far Apart? | The distance between two numbers is how many steps apart they are. Subtract them, then take the absolute value. |
| `7.NS.A.1-5` Add and subtract rational numbers fluently | 7 | 🧾 Signed Decimal Sums | Adding two negatives gives a bigger negative. The rule about two negatives making a positive is only for multiplying and for subtracting a negative. |
| `7.NS.A.2-1` Know the sign rules for multiplication | 7 | ✖️ Sign Rules | When you multiply, matching signs give a positive and different signs give a negative. |
| `7.NS.A.2-2` Divide integers and know the quotient is rational | 7 | ➗ Dividing Negatives | Negative numbers can be divided just like positives. Sharing a debt of 36 among 9 people gives each a debt of 4. |
| `7.NS.A.2-3` Use properties to multiply and divide rational numbers | 7 | 🪢 Keep the Sign | When a negative number multiplies a bracket, it multiplies every term inside, sign and all. |
| `7.NS.A.2-4` Convert fractions to decimals with long division; terminating or repeating | 7 | 🔂 Ends or Repeats? | Divide the upper number by the lower one. Some decimals stop. Others repeat the same digits forever. |
| `7.NS.A.3-1` Solve real problems with all four operations on rational numbers | 7 | 🤿 Deep Dive Math | Real problems mix operations with negative numbers. Keep track of the sign at every step. |
| `7.NS.A.3-2` Use estimation to check | 7 | 🧐 Sign and Size Check | Before trusting an answer, estimate. Is the sign sensible? Is the size about right? |
| `7.RP.A.1-1` Compute unit rates from ratios of fractions | 7 | 🚶 Fraction Speed | A unit rate can come from two fractions. Divide the amount by the time, even when both are fractions. |
| `7.RP.A.1-2` Interpret the unit rate in context | 7 | 🚿 Rate With Units | A rate is not finished until it has units. Say what is being counted per one of what. |
| `7.RP.A.2-1` Decide if a relationship is proportional from a table or graph | 7 | 🔬 Line Lab | Test each graph in the lab. Mark only the ones that show a proportional relationship. |
| `7.RP.A.2-2` Find the constant of proportionality | 7 | 🔑 Find the Constant | In a proportional relationship, y is always the same number times x. That number is k, and k = y ÷ x. |
| `7.RP.A.2-3` Write equations y = kx | 7 | 🎟️ The y = kx Rule | A proportional relationship is always written y = kx. The constant multiplies. It is never added. |
| `7.RP.A.2-4` Explain what (0,0) and (1, r) mean on the graph | 7 | 📈 Read the Rate Graph | On the graph of a proportional relationship, two points are special: (0, 0) and (1, r). The r is the unit rate. |
| `7.RP.A.3-1` Solve percent increase and decrease problems | 7 | 📉 Percent Change | Percent change compares how much something changed with where it STARTED. Always divide by the original amount. |
| `7.RP.A.3-2` Solve tax, tip, discount, interest problems | 7 | 🧥 Tip, Tax, Discount | A percent off is a percent OF the price, not that many dollars. Find the percent amount first, then add or subtract it. |
| `7.RP.A.3-3` Find percent error | 7 | 🎯 Percent Error | Percent error tells how far off an estimate was, compared with the ACTUAL value. |
| `7.SP.A.1-1` Know a sample can represent a population | 7 | 🗳️ Who Did You Ask? | A sample stands in for a whole population only if it looks like that population. Who you ask matters more than how many. |
| `7.SP.A.1-2` Know random sampling gives representative samples | 7 | 🎩 Random Beats Convenient | Random sampling gives every member the same chance of being picked. That is what makes a sample trustworthy. |
| `7.SP.A.2-1` Estimate a population value from a sample | 7 | 🎒 Scale Up the Sample | A random sample is a small copy of the population. The fraction in the sample is your best guess for the fraction in the whole group. |
| `7.SP.A.2-2` Use multiple samples to judge variation | 7 | 🎲 Samples Wobble | Two random samples from the same population rarely match exactly. A little wobble is normal and expected. |
| `7.SP.B.3-1` Judge overlap of two distributions | 7 | 🏀 How Much Overlap? | Two groups can have different averages and still overlap a lot. It depends on how spread out each group is. |
| `7.SP.B.3-2` Express the difference in centers as a multiple of spread | 7 | 📏 How Many Spreads Apart? | To judge how different two groups are, measure the distance between their centers in units of spread. |
| `7.SP.B.4-1` Use measures of center and variability to compare two samples | 7 | 🏫 Compare Two Groups | To compare two groups fairly, use a measure of center and a measure of spread. One standout value proves little. |
| `7.SP.B.4-2` Draw informal conclusions | 7 | ⚖️ Fair Conclusion? | Data supports some conclusions and not others. A tiny difference from a small sample does not prove much. |
| `7.SP.C.5-1` Express probability as a number from 0 to 1 | 7 | 🔴 Marble Bag | Reach into the bag without looking. Say the chance of pulling out a red marble. |
| `7.SP.C.5-2` Interpret near 0, near 1/2, near 1 | 7 | 🌦️ Chance Scale | Probability runs from 0 to 1. Near 0 is unlikely, near 1 is likely. Only exactly 0 is impossible. |
| `7.SP.C.6-1` Estimate probability from long-run frequency | 7 | 🎡 Long Run Chance | Do something many times and count. The fraction of times an outcome happens is a good estimate of its probability. |
| `7.SP.C.6-2` Predict frequencies from probabilities | 7 | 🔮 Expect About How Many? | A probability lets you predict about how often something will happen in many tries. It never says what the very next try will be. |
| `7.SP.C.7-1` Build a uniform model (equally likely outcomes) | 7 | 🎲 Equally Likely | When every outcome is equally likely, probability is a count: outcomes you want over all outcomes. |
| `7.SP.C.7-2` Build a model from observed frequencies | 7 | 🪙 Let the Data Decide | Some things are not fair. For a bent coin or a lopsided spinner, build the probability model from what actually happened. |
| `7.SP.C.7-3` Compare theoretical and experimental results | 7 | 🧪 Chance or Problem? | Experiments never match the theory exactly. Small differences are chance. Huge differences mean the model may not fit. |
| `7.SP.C.8-1` Know a compound probability is the fraction of outcomes in the sample space | 7 | 🪙 Count the Outcomes | For two things happening together, list every combined outcome. The probability is the fraction of the list you want. |
| `7.SP.C.8-2` List sample spaces with tables and tree diagrams | 7 | 📝 List Them All | A sample space lists every possible outcome. Order matters: heads then tails is not the same as tails then heads. |
| `7.SP.C.8-3` Design simulations for compound events | 7 | 🌧️ Design a Simulation | A simulation acts out a chance situation with coins, dice or spinners. Run it many times to estimate a probability. |
| `8.EE.A.1-1` Apply product and quotient rules | 8 | 🗼 Power Towers | Each power is a tower of the same factor. Stack or cut towers and name the new height. |
| `8.EE.A.1-2` Use zero and negative exponents | 8 | 🔻 Zero and Negative Powers | Each step down in the exponent divides by the base. Keep stepping past 1 and you get fractions, never negative numbers. |
| `8.EE.A.2-1` Solve x^2 = p and x^3 = p | 8 | 🟦 Both Square Roots | Two different numbers square to the same thing. Both 7 and −7 give 49, so x² = 49 has two solutions. |
| `8.EE.A.2-2` Know perfect squares and cubes | 8 | 🧱 Root Finder | A square root asks which number times itself makes this. It is not the same as halving. |
| `8.EE.A.3-1` Write very large and small numbers in scientific notation | 8 | 🔬 Scientific Notation | Scientific notation writes huge and tiny numbers as a number from 1 up to 10, times a power of 10. |
| `8.EE.A.3-2` Compare quantities as multiples of powers of 10 | 8 | 🪐 How Many Times as Large? | To compare numbers in scientific notation, divide the first factors and compare the powers of 10. The powers matter most. |
| `8.EE.A.4-1` Multiply and divide in scientific notation | 8 | 🚀 Multiply the Powers | To multiply in scientific notation, multiply the first factors and add the exponents. To divide, divide and subtract. |
| `8.EE.A.4-2` Add and subtract in scientific notation | 8 | 🛰️ Match the Powers First | You can only add numbers in scientific notation when their powers of 10 match. Rewrite one of them first. |
| `8.EE.A.4-3` Read calculator scientific notation (E notation) | 8 | 🖩 Calculator E | A calculator shows scientific notation with an E. The number after E is the power of 10. |
| `8.EE.B.5-1` Graph proportional relationships and read the unit rate as slope | 8 | ⛰️ Unit Rate Is the Slope | On the graph of a proportional relationship, the steepness of the line is the unit rate. Slope is rise over run. |
| `8.EE.B.5-2` Compare proportional relationships given in different forms | 8 | 🏎️ Which Is Faster? | One rate is an equation, the other is a sentence. Turn both into the same kind of unit rate before you compare. |
| `8.EE.B.6-1` Use similar triangles to show slope is constant | 8 | 📐 Same Slope Everywhere | Pick any two points on a line and draw the slope triangle. Big or small, the triangles are similar, so rise over run never changes. |
| `8.EE.B.6-2` Derive y = mx for lines through the origin | 8 | 🎯 Lines Through the Origin | A line through the origin is a proportional relationship. Its equation is y = mx, where m is the slope. |
| `8.EE.B.6-3` Derive y = mx + b for lines with intercept b | 8 | 📈 Slope and Intercept | In y = mx + b, the m is the slope and the b is where the line crosses the y-axis. |
| `8.EE.C.7-1` Know equations can have one, infinitely many, or no solutions | 8 | 🧮 One, None or All | Most equations have one solution. Some have none, and some are true for every number. |
| `8.EE.C.7-2` Solve equations with variables on both sides | 8 | ⚖️ x on Both Sides | When x is on both sides, take the same amount of x off each pan. Whatever you do to one side, do to the other. |
| `8.EE.C.7-3` Solve equations needing distribution and combining like terms | 8 | 🧩 Distribute, Combine, Solve | Longer equations need tidying first. Multiply through the brackets, gather like terms, and then solve. |
| `8.EE.C.7-4` Solve equations with fraction and decimal coefficients | 8 | 🧹 Clear the Fractions | Fractions in an equation can be cleared by multiplying EVERY term by the denominator. Miss a term and the scale tips. |
| `8.EE.C.8-1` Know a solution is where two lines intersect | 8 | ✖️ Where the Lines Meet | A system is two equations at once. Its solution is the one point that sits on both lines. |
| `8.EE.C.8-2` Solve systems by graphing and estimation | 8 | 📉 Graph to Solve | To solve a system by graphing, draw both lines carefully and read where they cross. |
| `8.EE.C.8-3` Solve systems by substitution and elimination | 8 | 🔄 Swap It In | If one equation says what y equals, put that in place of y in the OTHER equation. Then there is only x to solve for. |
| `8.EE.C.8-4` Write and solve systems from word problems | 8 | 🎟️ Ticket Booth System | A story with two unknowns needs two equations: one counts things, the other counts money. |
| `8.F.A.1-1` Know a function gives exactly one output per input | 8 | 🥤 Snack Machine | A good snack machine gives one sure snack for each button. Pick the machines that work. |
| `8.F.A.1-2` Tell functions from non-functions in tables and graphs | 8 | 🎰 One Output Each | A function gives each input exactly one output. Two inputs may share an output, but one input can never have two. |
| `8.F.A.2-1` Compare rates of change across tables, graphs, equations, words | 8 | 🏁 Which Changes Faster? | A rate of change tells how much y grows for each step of x. It can be read from an equation, a table or a sentence. |
| `8.F.A.2-2` Compare initial values | 8 | 🚦 Who Starts Higher? | The initial value is where a function starts: its output when x is 0. Do not mix it up with the rate. |
| `8.F.A.3-1` Know y = mx + b graphs as a line | 8 | 〰️ Line or Curve? | An equation of the form y = mx + b always graphs as a straight line. An x with an exponent bends the graph. |
| `8.F.A.3-2` Give examples of nonlinear functions | 8 | 🎢 Bends in the Path | Not every function is a line. If equal steps across give unequal steps up, the graph bends. |
| `8.F.B.4-1` Find rate of change and initial value from two points or a table | 8 | 🧗 Rate From Two Points | Two points are enough to find a rate of change. Divide the change in y by the change in x. |
| `8.F.B.4-2` Write a linear function from a description | 8 | 🔧 Story to Function | A fee plus a rate makes a linear function. The amount per hour multiplies x. The one-time amount stands alone. |
| `8.F.B.4-3` Interpret rate and initial value in context | 8 | 💬 What the Numbers Mean | Every number in a linear model means something in the story. Say it with its units. |
| `8.F.B.5-1` Describe where a graph increases, decreases, or stays constant | 8 | 🚶 Read the Story Graph | A distance-time graph is not a picture of a hill. Going up means getting farther away. Flat means standing still. |
| `8.F.B.5-2` Sketch a graph from a story | 8 | ✏️ Sketch the Story | Turn a story into a graph. Across is time. Up is distance from home. Mark the moments when something changes. |
| `8.G.A.1-1` Know rigid motions keep lines and lengths | 8 | 🗝️ Move Makers | The key must stay exactly its size to fit the lock. Sort the moves that keep it that way. |
| `8.G.A.1-2` Know rigid motions keep angle measures | 8 | 🪞 Angles Stay Put | Slides, flips and turns move a figure without bending it. Every angle keeps its exact measure. |
| `8.G.A.1-3` Know parallel lines stay parallel | 8 | 🛤️ Still Parallel | Slide, flip or turn a pair of parallel lines and they stay parallel. Test it yourself. |
| `8.G.A.2-1` Show two figures are congruent with a sequence of rigid motions | 8 | 🧩 Same Size, Same Shape | Two figures are congruent if slides, flips and turns can carry one exactly onto the other. |
| `8.G.A.2-2` Describe the sequence precisely | 8 | 🧭 Name the Move | Saying a shape moved is not enough. Name the motion exactly: how far, which way, or over which line. |
| `8.G.A.3-1` Find coordinates after translations and reflections | 8 | 📍 Slide and Flip Points | A translation adds to the coordinates. Left and right change x. Up and down change y. A reflection flips one sign. |
| `8.G.A.3-2` Find coordinates after rotations | 8 | 🔄 Quarter Turns | A quarter turn counterclockwise about the origin sends (x, y) to (−y, x). The point swings to the next quadrant on the left. |
| `8.G.A.3-3` Find coordinates after dilations | 8 | 🔍 Stretch From the Origin | A dilation from the origin multiplies both coordinates by the scale factor. The point moves out along a straight ray. |
| `8.G.A.4-1` Show figures are similar with rigid motions and dilations | 8 | 🔎 Congruent or Just Similar? | Similar figures have the same shape. They may be different sizes. A dilation changes size and keeps shape. |
| `8.G.A.4-2` Describe the sequence of transformations | 8 | 📏 Do Not Skip the Dilation | When two similar figures are different sizes, a dilation has to be part of the story. Then a rigid motion puts it in place. |
| `8.G.A.5-1` Explain the triangle angle sum | 8 | 🔺 Triangle Angle Sum | Tear off the three corners of any triangle and they line up into a straight angle. The total is always 180°. |
| `8.G.A.5-2` Use angles formed by parallel lines and a transversal | 8 | 🛤️ Parallel Line Angles | When a line crosses two parallel lines, it makes the same set of angles at both crossings. Only two sizes appear, and they add to 180°. |
| `8.G.A.5-3` Use AA to show triangles are similar | 8 | 👯 Two Angles Are Enough | If two angles of one triangle match two angles of another, the third angles match as well. The triangles are similar. |
| `8.G.B.6-1` Explain a proof of the Pythagorean Theorem | 8 | 🟧 Squares on the Sides | Build a square on each side of a right triangle. The two smaller squares together cover exactly as much as the big one. |
| `8.G.B.6-2` Explain the converse | 8 | 📐 Is It a Right Triangle? | The theorem works backward too. If the two shorter sides squared add up to the longest side squared, the triangle has a right angle. |
| `8.G.B.7-1` Find a missing side of a right triangle | 8 | 🪜 Find the Missing Side | With two sides of a right triangle you can find the third. Add the squares to find the longest side. Subtract to find a leg. |
| `8.G.B.7-2` Use it in 3D problems | 8 | 📦 Corner to Corner | The longest stick that fits in a box runs corner to opposite corner. Find it with two right triangles: one on the floor, one standing up. |
| `8.G.B.8-1` Draw a right triangle between two points | 8 | 📍 Triangle Between Points | Any two points on the grid are the ends of a slanted line. Draw a right triangle under it and its legs follow the grid. |
| `8.G.B.8-2` Apply the theorem to find distance | 8 | 🧭 Distance on the Grid | The distance between two points is the longest side of the right triangle between them. Square the legs, add, and take the root. |
| `8.G.C.9-1` Use V = (pi)r^2h for cylinders | 8 | 🥫 Fill the Can | A cylinder is a circle stacked up. Its volume is the area of the circle times the height. Use the radius, not the diameter. |
| `8.G.C.9-2` Use V = 1/3(pi)r^2h for cones | 8 | 🍦 Cone Is a Third | A cone holds exactly one third of the cylinder it fits inside. Three cones of water fill the can. |
| `8.G.C.9-3` Use V = 4/3(pi)r^3 for spheres | 8 | 🏀 Volume of a Ball | A sphere fills space in three directions, so its radius is cubed, not squared. |
| `8.NS.A.1-1` Know irrational numbers have non-repeating decimals | 8 | ♾️ Rational or Irrational? | A rational number can be written as a fraction. Its decimal ends or repeats. An irrational number goes on forever with no repeating pattern. |
| `8.NS.A.1-2` Convert repeating decimals to fractions | 8 | 🔁 Repeating to Fraction | Every repeating decimal is a fraction in disguise. One digit repeating forever is that digit over 9. |
| `8.NS.A.2-1` Estimate square roots between whole numbers | 8 | 🌻 Square Garden | Lay a square garden from a pile of tiles. Find the biggest whole side that the pile can cover. |
| `8.NS.A.2-2` Place irrational numbers on a number line | 8 | 🌱 Roots on the Line | An irrational number still has an exact place on the number line. Estimate it to see where it sits. |
| `8.SP.A.1-1` Make scatter plots for two variables | 8 | 🔵 Scatter Plot Maker | A scatter plot shows two measurements for each person as one dot. The dots stay separate. Together they show a pattern. |
| `8.SP.A.1-2` Describe association: positive, negative, none, linear, nonlinear | 8 | 🌱 Scatter Garden | Each dot is a plant: water along the bottom, height up the side. Sort the plots by their trend. |
| `8.SP.A.1-3` Identify clusters and outliers | 8 | 🛸 Spot the Stray Dot | Most dots in a scatter plot follow a pattern. An outlier sits far away from the pattern. |
| `8.SP.A.2-1` Draw a line that fits the data informally | 8 | 📏 Fit the Line | A line of fit runs through the middle of the cloud of dots, with about as many above as below. It does not have to touch any dot. |
| `8.SP.A.2-2` Judge how well the line fits | 8 | 🎯 How Good Is the Fit? | A line fits well when the dots hug it. Forcing the line through the origin, or leaving dots far away, makes a poor fit. |
| `8.SP.A.3-1` Predict with the equation of a linear model | 8 | 🔮 Predict With the Model | A linear model is a rule for predicting. Put the input where it belongs in the equation and work it out. |
| `8.SP.A.3-2` Interpret slope and intercept in context | 8 | 💡 Slope and Start in Context | In a model, the slope tells how much the output changes for each extra unit of input. The intercept is the output at zero. |
| `8.SP.A.4-1` Make two-way frequency tables | 8 | 🧮 Two-Way Table Totals | A two-way table sorts people by two questions at once. Row totals go at the end of rows. Column totals go under columns. |
| `8.SP.A.4-2` Use relative frequencies to find associations | 8 | 📊 Compare the Percents | To see whether two things are linked, compare percents, not counts. A bigger group can have more people and still a smaller share. |
| `A-APR.A.1-1` Add and subtract polynomials | Algebra 1 | ➖ Subtract Every Term | Subtracting a polynomial means subtracting every one of its terms. The minus sign reaches all the way through the bracket. |
| `A-APR.A.1-2` Multiply polynomials | Algebra 1 | 🔳 Multiply Every Pair | To multiply two brackets, every term in the first meets every term in the second. Four products, then combine. |
| `A-APR.A.1-3` Know polynomials are closed under these operations | Algebra 1 | 🔒 Stays a Polynomial | Add, subtract or multiply polynomials and you always get a polynomial. Division is the one that can break out. |
| `A-CED.A.1-1` Write linear equations and inequalities from situations | Algebra 1 | 📱 At Most, At Least Equations | A situation with a limit becomes an inequality. At most means ≤. At least means ≥. Exactly means =. |
| `A-CED.A.1-2` Write quadratic and exponential equations from situations | Algebra 1 | 🦠 Doubling Needs an Exponent | Adding the same amount each step is linear. Multiplying by the same factor each step is exponential. Choose the right kind of equation. |
| `A-CED.A.2-1` Write equations relating two quantities | Algebra 1 | 🚕 Two Quantities, One Equation | An equation in two variables ties two quantities together. Decide which one depends on the other before you write it. |
| `A-CED.A.2-2` Graph them with labeled, scaled axes | Algebra 1 | 🏷️ Label and Scale the Graph | A graph without labels and even scales cannot be read. Name both axes, give units, and count in equal steps. |
| `A-CED.A.3-1` Write constraints as equations or inequalities | Algebra 1 | 🍕 All the Constraints | A real situation has more than one limit. The budget is one. You also cannot buy a negative number of things. |
| `A-CED.A.3-2` Decide whether a solution is viable in context | Algebra 1 | 🤔 Does the Solution Make Sense? | A pair of numbers can satisfy the inequality and still be nonsense. You cannot buy −1 pizzas or half a ticket. |
| `A-CED.A.4-1` Solve a formula for a given variable | Algebra 1 | 🔧 Solve the Formula | A formula can be turned around to give any of its letters. Use the same inverse steps you use on equations with numbers. |
| `A-REI.A.1-1` Explain each step with properties of equality | Algebra 1 | 🪜 Reason for Every Step | Each step in solving an equation is allowed for a reason. Whatever you do to one side, you do to the other. |
| `A-REI.B.3-1` Solve linear equations with letter coefficients | Algebra 1 | 🔡 Letters as Coefficients | An equation with letters for numbers is solved the same way. Just remember you can never divide by zero. |
| `A-REI.B.3-2` Solve linear inequalities | Algebra 1 | 🎚️ Inequality Solver | Solve an inequality like an equation, but flip the sign whenever you multiply or divide by a negative. |
| `A-REI.B.4-1` Complete the square; derive the quadratic formula | Algebra 1 | ⬜ Square Both Sides Fairly | To solve by completing the square, add the same number to both sides so the left becomes a perfect square. |
| `A-REI.B.4-2` Solve by square roots (x^2 = 49) | Algebra 1 | ± Plus or Minus Root | Taking a square root of both sides gives two answers, one positive and one negative. Keep both. |
| `A-REI.B.4-3` Solve by factoring | Algebra 1 | 🅾️ Zero Product Rule | If two things multiply to zero, one of them must be zero. That only works for zero, so get zero on one side first. |
| `A-REI.B.4-4` Solve with the quadratic formula | Algebra 1 | 🧮 Quadratic Formula Steps | The quadratic formula solves any quadratic. The trickiest part is −b: if b is negative, −b is positive. |
| `A-REI.C.5-1` Explain why adding a multiple of one equation keeps the same solutions | Algebra 1 | ♻️ Same Solution, New Equation | Doubling an equation or adding two equations makes a new equation with the same solution, as long as every term is treated the same. |
| `A-REI.C.6-1` Solve exactly by substitution and elimination | Algebra 1 | 🧹 Eliminate and Solve | Line up two equations so that adding them removes one variable. Then solve what is left. |
| `A-REI.C.6-2` Solve approximately by graphing | Algebra 1 | 📍 Cross Point Estimate | Graph both equations and the solution is where they cross. Read the point carefully from the grid. |
| `A-REI.D.10-1` Know every point on the graph is a solution | Algebra 1 | 🧵 On the Line or Off? | A graph is the set of ALL points that make its equation true. Not just the intercepts: every point on it is a solution. |
| `A-REI.D.12-1` Graph a linear inequality as a half-plane | Algebra 1 | 🌗 Shade the Right Side | An inequality in two variables is graphed as half of the plane. Test a point to see which side to shade. |
| `A-REI.D.12-2` Use dashed and solid boundaries correctly | Algebra 1 | 〰️ Solid or Dashed Line? | The boundary line is solid when points on it count as solutions, and dashed when they do not. |
| `A-REI.D.12-3` Graph systems of inequalities | Algebra 1 | 🟪 Where Both Shadings Overlap | A system of inequalities is solved only where every shaded region overlaps. A point must pass all the tests. |
| `A-SSE.A.1-1` Name terms, factors, and coefficients in context | Algebra 1 | 🎉 Parts of a Real Expression | Every piece of an expression means something in the situation. A term is added. A factor multiplies. A coefficient is the number in front. |
| `A-SSE.A.1-2` Interpret parts of complicated expressions (P(1 + r)^n) | Algebra 1 | 📈 Read the Growth Formula | In P(1 + r)^n the bracket is one single thing: the multiplier applied every period. The exponent counts the periods. |
| `A-SSE.A.2-1` See x^4 - y^4 as a difference of squares | Algebra 1 | 🔲 Difference of Squares Spotter | Any square minus another square splits into a sum times a difference. Spot the pattern even when it is in disguise. |
| `A-SSE.A.2-2` Factor using common factors, grouping, and special patterns | Algebra 1 | 🧩 Factor by Pattern | Factoring undoes multiplying. Look for a common factor first, then for a pattern such as a perfect square. |
| `A-SSE.B.3-1` Factor a quadratic to find zeros | Algebra 1 | 0️⃣ Zeros From Factors | Once a quadratic is factored, its zeros are easy: each factor is zero for one value of x. Watch the sign. |
| `A-SSE.B.3-2` Complete the square to find the max or min | Algebra 1 | ⬛ Complete the Square | Rewriting a quadratic as a square plus a number shows its lowest point at a glance. |
| `A-SSE.B.3-3` Rewrite exponential expressions (1.15^t = (1.15^(1/12))^(12t)) | Algebra 1 | 🔁 Same Growth, New Base | An exponential can be rewritten with a different base to show a rate over a different period. The exponent rules do the work. |
| `F-BF.A.1-1` Write explicit and recursive rules from context | Algebra 1 | 🏦 Explicit or Recursive Rule | A pattern can be described two ways. An explicit rule jumps straight to any step. A recursive rule builds each step from the one before. |
| `F-BF.A.1-2` Combine functions with arithmetic operations | Algebra 1 | 🧱 Build a Function From Parts | Functions can be added, subtracted and multiplied like numbers. Profit is revenue minus cost. |
| `F-BF.A.1-3` Compose functions | Algebra 1 | 🪆 Function Inside a Function | f(g(3)) means: put 3 into g first, then put that answer into f. Work from the inside out. |
| `F-BF.A.2-1` Write arithmetic sequences recursively and explicitly | Algebra 1 | ➕ Arithmetic Sequence Rules | An arithmetic sequence adds the same amount each step. To reach term n from term 1 you add that amount n − 1 times. |
| `F-BF.A.2-2` Write geometric sequences recursively and explicitly | Algebra 1 | ✖️ Geometric Sequence Rules | A geometric sequence multiplies by the same ratio each step. The ratio is a base with an exponent, never something you add. |
| `F-BF.B.3-1` Find the effect of f(x) + k and f(x + k) | Algebra 1 | ↔️ Slide the Graph | Adding a number outside the function lifts the graph. Adding it inside, next to x, slides the graph sideways the opposite way. |
| `F-BF.B.3-2` Find the effect of k f(x) and f(kx) | Algebra 1 | 🪗 Stretch and Squeeze | Multiplying outside the function stretches the graph up and down. Multiplying inside, next to x, squeezes it sideways. |
| `F-BF.B.3-3` Recognize even and odd functions | Algebra 1 | 🪞 Even, Odd or Neither | An even function mirrors across the y-axis. An odd function looks the same after a half turn about the origin. Most are neither. |
| `F-IF.A.1-1` Know each input has exactly one output | Algebra 1 | 🎛️ Function Test | A function assigns each input exactly one output. Two inputs can share an output. One input cannot have two. |
| `F-IF.A.1-2` Identify domain and range | Algebra 1 | ↔️ Domain and Range | The domain is the set of inputs. The range is the set of outputs. List each value once. |
| `F-IF.A.2-1` Evaluate f(3) | Algebra 1 | 🔌 Plug Into f | f(3) is not f times 3. It means: put 3 in place of x and work out the result. |
| `F-IF.A.2-2` Interpret f(x) statements in context | Algebra 1 | 🏀 What h(2) = 48 Means | A statement in function notation is a sentence. The number inside the brackets is the input. The other side is the output. |
| `F-IF.A.3-1` Know a sequence is a function on the integers | Algebra 1 | 🔢 Term Number In, Term Out | A sequence is a function. The input is the position: 1st, 2nd, 3rd. The output is the term in that position. |
| `F-IF.A.3-2` Use recursive definitions | Algebra 1 | 🔁 Use the Term Before | A recursive rule builds each term from the ones before it. You must start from the given first term. |
| `F-IF.B.4-1` Find intercepts, intervals of increase or decrease, max and min | Algebra 1 | 🔑 Key Features of a Graph | A graph has landmarks: where it crosses each axis, and where it turns. The x-intercepts sit on the x-axis. |
| `F-IF.B.4-2` Describe end behavior and symmetry | Algebra 1 | 🧭 Where the Graph Is Headed | End behavior describes what a graph does far to the left and far to the right, beyond the part you can see. |
| `F-IF.B.5-1` Relate the domain to the graph and the situation | Algebra 1 | ⏱️ Inputs That Make Sense | A formula may accept any number, but the situation does not. Time cannot be negative. You cannot sell half a ticket. |
| `F-IF.B.6-1` Calculate average rate of change over an interval | Algebra 1 | 📐 Average Rate of Change | The average rate of change between two inputs is the slope of the straight line joining those two points on the graph. |
| `F-IF.B.6-2` Estimate it from a graph | Algebra 1 | 🪜 Rate Between Two Points | On a curve, the rate of change keeps shifting. Between two marked points you can still estimate an average. |
| `F-IF.C.7-1` Graph linear and quadratic functions with intercepts and vertex | Algebra 1 | 🎯 Vertex and Intercepts | A parabola is pinned down by its vertex and its intercepts. The vertex is not simply (b, c) from the equation. |
| `F-IF.C.7-2` Graph square root, cube root, piecewise, step, and absolute value functions | Algebra 1 | 🖼️ Name That Graph Shape | Each family of functions has a signature shape: the V of absolute value, the half-arch of a square root, the stairs of a step function. |
| `F-IF.C.7-3` Graph polynomials from zeros and end behavior | Algebra 1 | 〽️ Zeros and Ends | A factored polynomial shows its zeros directly. A repeated factor makes the graph touch the axis and turn back. |
| `F-IF.C.7-4` Graph rational functions with zeros and asymptotes | Algebra 1 | 🚧 Asymptote Finder | A rational function has lines it approaches and never crosses where its denominator would be zero. |
| `F-IF.C.7-5` Graph exponential and logarithmic functions | Algebra 1 | 🌙 Curves That Hug a Line | An exponential graph flattens toward the x-axis without touching it. A logarithm graph does the same with the y-axis. |
| `F-IF.C.8-1` Use factoring and completing the square to find zeros, extremes, symmetry | Algebra 1 | 🔍 What Each Form Shows | One quadratic can be written three ways. Factored form shows the zeros. Vertex form shows the turning point. |
| `F-IF.C.8-2` Interpret growth or decay rates from exponential forms | Algebra 1 | 📉 Growth or Decay Rate | In y = a·b^t, the base b tells the story. Above 1 it grows. Below 1 it decays. The distance from 1 is the percent rate. |
| `F-IF.C.9-1` Compare properties of functions given as graphs, tables, equations, and words | Algebra 1 | ⚖️ Compare Across Forms | One function is an equation and another is a table. To compare them, find the same feature in each. |
| `F-LE.A.1-1` Show linear functions change by equal differences, exponential by equal factors | Algebra 1 | 📊 Add or Multiply Pattern | Linear patterns change by the same difference each step. Exponential patterns change by the same factor. |
| `F-LE.A.1-2` Recognize constant-rate situations | Algebra 1 | 🕯️ Steady Amount Each Step | When a quantity changes by the same amount in each equal time step, a linear model fits it. |
| `F-LE.A.1-3` Recognize constant-percent growth or decay | Algebra 1 | 🧫 Steady Percent Each Step | When a quantity grows or shrinks by the same percent in each time step, an exponential model fits it. |
| `F-LE.A.2-1` Write linear and exponential functions from graphs, tables, or two points | Algebra 1 | 📌 Two Points, Two Models | Two points can be joined by a line or by an exponential curve. The line adds. The curve multiplies. |
| `F-LE.A.3-1` Show exponential growth overtakes linear and polynomial growth | Algebra 1 | 🚀 Exponential Wins in the End | A steep line can lead for a while. Given enough steps, a quantity that keeps multiplying always overtakes one that keeps adding. |
| `F-LE.B.5-1` Interpret slope and intercept in linear models | Algebra 1 | 📞 Meaning of m and b | In a linear model, the number multiplied by the variable is a rate. The number standing alone is the starting amount. |
| `F-LE.B.5-2` Interpret initial value and growth factor in exponential models | Algebra 1 | 🚙 Start Value and Growth Factor | In an exponential model a·b^t, a is where it starts and b is what it is multiplied by each period. |
| `N-Q.A.1-1` Use units to check that an answer makes sense | Algebra 1 | ⛽ Units Tell the Story | Carry the units through a calculation the way you carry numbers. They tell you whether the answer makes sense. |
| `N-Q.A.1-2` Choose scales and origins for graphs | Algebra 1 | 📏 Pick a Sensible Scale | A graph’s scale should fit its data. Too fine and it runs off the page. Too coarse and the data is squashed flat. |
| `N-Q.A.2-1` Choose which quantities to model | Algebra 1 | 🚗 What Matters in the Model | Modeling starts by choosing which quantities matter for the question. Leave out the ones that do not affect the answer. |
| `N-Q.A.3-1` Choose a sensible level of accuracy for measurements | Algebra 1 | 🎯 How Precise Is Sensible? | An answer cannot be more precise than the tool that measured it. Extra decimal places are just noise. |
| `N-RN.B.3-1` Explain why rational + rational is rational | Algebra 1 | ➕ Rational Plus Rational | Add two fractions and you always get another fraction. The rational numbers never leak out under addition or multiplication. |
| `N-RN.B.3-2` Explain why rational + irrational is irrational | Algebra 1 | 🧪 Rational Meets Irrational | Add a rational number to an irrational one and the result is always irrational. The messy decimal cannot be cancelled. |
| `N-RN.B.3-3` Know nonzero rational x irrational is irrational | Algebra 1 | ✖️ Products With Roots | A nonzero rational times an irrational is irrational. Two irrationals multiplied can go either way. |
| `S-ID.A.1-1` Make dot plots, histograms, box plots | Algebra 1 | 📊 Display the Data | A histogram groups data into equal bins. A box plot shows the middle half. Both start from the same list of numbers. |
| `S-ID.A.2-1` Use statistics suited to the shape (median/IQR vs mean/SD) | Algebra 1 | 🧰 Which Statistics Fit? | For lopsided data with an outlier, the median and IQR describe it best. For balanced data, the mean and standard deviation work well. |
| `S-ID.A.2-2` Compare two or more data sets | Algebra 1 | ⚖️ Center and Spread Together | Two groups can share an average and still be very different. Compare how spread out they are too. |
| `S-ID.A.3-1` Interpret differences in context | Algebra 1 | 💬 Say It in Context | A difference in statistics should be put into words about the real situation, without claiming more than it shows. |
| `S-ID.A.3-2` Account for the effect of outliers | Algebra 1 | 🎈 What an Outlier Does | One extreme value can yank the mean a long way while the median barely moves. Do not throw it out without a reason. |
| `S-ID.B.5-1` Summarize categorical data in two-way tables | Algebra 1 | 🗃️ Fill the Two-Way Table | A two-way table sorts people by two categories. Row totals go across. Column totals go down. They must agree at the corner. |
| `S-ID.B.5-2` Interpret joint, marginal, and conditional relative frequencies | Algebra 1 | 🎯 Out of Which Total? | The same count gives different percents depending on what you divide by: the whole table, or just one row. |
| `S-ID.B.6-1` Fit a function to data and use it to predict | Algebra 1 | 🔭 Predict, But Not Too Far | A fitted line is trustworthy inside the range of the data it came from. Far outside that range, it is a guess. |
| `S-ID.B.6-2` Assess fit with residuals | Algebra 1 | 📉 Read the Residuals | A residual is how far a data point sits above or below the fitted line. Residuals from a good model look like random scatter. |
| `S-ID.B.6-3` Fit a linear function to linear-looking data | Algebra 1 | 〰️ Line or Curve Model? | A line only fits data that looks like a straight band. If the points bend, use a curve. |
| `S-ID.C.7-1` Interpret slope and intercept in context | Algebra 1 | 👶 Slope and Intercept of a Fit | The slope of a fitted line is a rate. Its intercept is the prediction at zero, which only means something if zero makes sense. |
| `S-ID.C.8-1` Compute r with technology and interpret it | Algebra 1 | 📏 Reading r | The correlation coefficient r runs from −1 to 1. Its size tells how tightly points follow a line. Its sign tells the direction. |
| `S-ID.C.9-1` Tell correlation from causation | Algebra 1 | 🍦 Cause or Coincidence? | Two things can rise together without one causing the other. Often a third thing is driving both. |
| `G-C.A.1-1` Prove all circles are similar with transformations | Geometry | ⭕ Every Circle Is Similar | Slide one circle so the centers match, then dilate. It lands exactly on the other. That works for any two circles. |
| `G-C.A.2-1` Relate inscribed and central angles | Geometry | 🎯 Inscribed Is Half | An angle at the center and an angle on the circle can stand on the same arc. The one on the circle is always half as big. |
| `G-C.A.2-2` Know a tangent is perpendicular to the radius | Geometry | 🛞 Tangent Meets Radius | A tangent line just touches a circle at one point. At that point it is always perpendicular to the radius. |
| `G-C.A.2-3` Know angles inscribed in a semicircle are right | Geometry | 🌗 Right Angle in a Semicircle | Pick any point on a circle and join it to the two ends of a diameter. The angle at that point is always a right angle. |
| `G-C.A.3-1` Construct inscribed and circumscribed circles of a triangle | Geometry | 🔺 Two Centers of a Triangle | A triangle has a circle through its corners and a circle touching its sides. Their centers are found in different ways. |
| `G-C.A.3-2` Prove opposite angles of an inscribed quadrilateral are supplementary | Geometry | 🔷 Opposite Angles on a Circle | When all four corners of a quadrilateral sit on a circle, its opposite angles always add to 180°. |
| `G-C.B.5-1` Derive arc length proportional to radius | Geometry | 🌈 Arc Length | An arc is a fraction of the whole circumference. The central angle tells you which fraction. |
| `G-C.B.5-2` Find sector area as a fraction of the circle | Geometry | 🍕 Slice of the Circle | A sector is a slice of the circle. Its area is the same fraction of the whole area as its angle is of 360°. |
| `G-C.B.5-3` Define radian measure from arcs | Geometry | 🧵 Radians From Arcs | Wrap one radius along the edge of its circle. The angle it marks out is one radian, in a circle of any size. |
| `G-CO.A.1-1` Define angle, circle, perpendicular, parallel, segment from undefined terms | Geometry | 📖 Precise Definitions | Geometry builds on exact definitions. “A round shape” is a description. “All points a fixed distance from a center” is a definition. |
| `G-CO.A.2-1` Represent transformations as functions on points | Geometry | 🎯 Rules That Move Points | A transformation is a function. It takes every point of the plane as input and gives a new point as output. |
| `G-CO.A.2-2` Tell rigid motions from stretches | Geometry | 📏 Rigid or Not? | Rigid motions move a figure without changing any length or angle. Dilations and stretches change lengths. |
| `G-CO.A.3-1` Describe rotations and reflections that map a polygon onto itself | Geometry | 🔲 Maps Onto Itself | Some turns and flips leave a shape looking exactly as it started. A square has more of these than most people count. |
| `G-CO.A.4-1` Define each rigid motion with angles, circles, perpendicular and parallel lines | Geometry | 🧭 What Defines Each Motion | Each rigid motion is fixed by a small set of facts. Give those and anyone can perform it exactly. |
| `G-CO.A.5-1` Draw a figure after a given transformation | Geometry | ✏️ Draw the Image | To draw a transformed figure, move each corner by the rule, then join the new corners. |
| `G-CO.A.5-2` Specify a sequence that maps one figure to another | Geometry | 🪜 Motions in Order | Two motions done in a different order can land a figure in a different place. Name the steps and their order. |
| `G-CO.B.6-1` Predict the effect of a rigid motion | Geometry | 🔄 Same Way Round? | Slides and turns keep a figure facing the same way round. A single flip reverses the order of its corners. |
| `G-CO.B.6-2` Decide if two figures are congruent with rigid motions | Geometry | 🧩 Congruent by Motion | Two figures are congruent if some rigid motion carries one exactly onto the other. A mirror image still counts. |
| `G-CO.B.7-1` Show triangles are congruent iff corresponding parts are congruent | Geometry | 🔗 Matching Parts | The order of letters in a congruence statement tells which parts match. First with first, second with second, third with third. |
| `G-CO.B.8-1` Explain ASA, SAS, SSS from rigid motions | Geometry | ✅ Which Shortcuts Work? | You do not need all six parts to prove triangles congruent. Three well-chosen parts will do, but not just any three. |
| `G-CO.C.10-1` Prove the triangle angle sum and base angle theorems | Geometry | 🔺 Angle Sum and Base Angles | Every triangle’s angles add to 180°. In an isosceles triangle, the two base angles are equal. |
| `G-CO.C.10-2` Prove midsegment and median facts | Geometry | ➗ Midsegment Half | A midsegment joins the midpoints of two sides of a triangle. It runs parallel to the third side and is exactly half as long. |
| `G-CO.C.11-1` Prove opposite sides and angles are congruent | Geometry | ▱ Parallelogram Angles | In any parallelogram, opposite angles are equal and neighboring angles add to 180°. It does not have to be a rectangle. |
| `G-CO.C.11-2` Prove diagonals bisect each other | Geometry | ✂️ Diagonals Meet Halfway | The two diagonals of a parallelogram cut each other exactly in half at the point where they cross. |
| `G-CO.C.9-1` Prove vertical angles are congruent | Geometry | ✖️ Prove Vertical Angles | A proof gives a reason for each step. “They look equal” is not a reason, and neither is the thing you are trying to prove. |
| `G-CO.C.9-2` Prove angle relationships with parallel lines | Geometry | 🛤️ Parallel Lines, Solve for x | With parallel lines, some angle pairs are equal and some add to 180°. Pick the right relationship before writing the equation. |
| `G-CO.D.12-1` Copy segments and angles; bisect segments and angles | Geometry | 🧭 Compass and Straightedge | A construction uses only a compass and an unmarked straightedge. Nothing is measured. Everything is built from arcs and lines. |
| `G-CO.D.12-2` Construct perpendicular and parallel lines | Geometry | 📐 Build It, Do Not Measure It | Perpendicular and parallel lines can be constructed exactly. The key is never changing the compass between matching arcs. |
| `G-CO.D.13-1` Construct an equilateral triangle, square, and hexagon in a circle | Geometry | ⭕ Shapes Inside a Circle | Step the radius around a circle and it fits exactly six times. That one fact builds a hexagon, a triangle and more. |
| `G-GMD.A.1-1` Explain circumference and area of a circle formulas | Geometry | 🍕 Why Pi r Squared | Cut a circle into thin wedges and flip every other one. They line up into something very close to a rectangle. |
| `G-GMD.A.1-2` Explain volume formulas with dissection and Cavalieri's principle | Geometry | 🪙 Slanted Stacks | Push a straight stack of coins into a leaning one. Every coin is still there, so the volume is unchanged. |
| `G-GMD.A.3-1` Use volume formulas for cylinders, pyramids, cones, spheres | Geometry | 🔺 The One-Third Solids | A pyramid fills exactly one third of the prism around it. A cone fills one third of its cylinder. |
| `G-GMD.B.4-1` Identify cross sections of 3D objects | Geometry | 🔪 What the Cut Shows | Cut straight through a solid and look at the fresh face. That flat shape is the cross section. |
| `G-GMD.B.4-2` Identify solids made by rotating 2D shapes | Geometry | 🌀 Spin a Shape | Spin a flat shape around a line, like a revolving door, and it sweeps out a solid. |
| `G-GPE.A.1-1` Derive the circle equation from the Pythagorean Theorem | Geometry | ⭕ Circle Equation | Every point on a circle is the same distance from the center. The Pythagorean theorem turns that into an equation. |
| `G-GPE.A.1-2` Complete the square to find center and radius | Geometry | 🎯 Find the Hidden Center | A circle equation can arrive scrambled. Complete the square for x and for y and the center and radius appear. |
| `G-GPE.B.4-1` Prove properties of figures with coordinates | Geometry | 📍 Prove It With Coordinates | Coordinates turn geometry into arithmetic. Slopes prove sides parallel. Distances prove sides equal. |
| `G-GPE.B.5-1` Know parallel lines have equal slopes | Geometry | 🛤️ Parallel Means Same Slope | Parallel lines climb at exactly the same rate, so they never meet. Same slope, different starting point. |
| `G-GPE.B.5-2` Know perpendicular slopes are opposite reciprocals | Geometry | ➕ Flip and Negate | Perpendicular lines meet at a square corner. Their slopes are opposite reciprocals: flip the fraction and change the sign. |
| `G-GPE.B.5-3` Write equations of parallel and perpendicular lines through a point | Geometry | ⭐ Line Through the Star | A slope tells the tilt. A point pins the line down. Together they give exactly one line. |
| `G-GPE.B.6-1` Find a point that divides a segment in a given ratio | Geometry | 🪚 Split the Segment | A ratio of 1 to 2 cuts a segment into 3 equal steps. The point sits 1 step from the start. |
| `G-GPE.B.7-1` Use the distance formula to find perimeters | Geometry | 🧮 Perimeter on the Grid | Flat sides are easy to count. A slanted side needs the distance formula, which is the Pythagorean theorem in disguise. |
| `G-GPE.B.7-2` Find areas of triangles and rectangles on the plane | Geometry | 🟩 Area on the Grid | For a triangle on a grid, the height is the straight-up distance from the base to the far corner, not a slanted side. |
| `G-MG.A.1-1` Describe real objects with geometric shapes | Geometry | 🌳 Model It With a Solid | Engineers treat real things as simple solids so they can estimate size. Pick the solid that keeps the key features. |
| `G-MG.A.2-1` Apply density based on area and volume (people per square mile) | Geometry | 🏙️ How Crowded? | Density tells how much is packed into each unit of space: people per square mile, grams per cubic centimeter. |
| `G-MG.A.3-1` Solve design problems with constraints | Geometry | 🌻 Best Garden for the Fence | A design problem has a goal and a limit. Here the limit is the fence you own, and the goal is the most growing space. |
| `G-SRT.A.1-1` Know a dilation maps a line to a parallel line | Geometry | 🔍 Dilated Lines Stay Parallel | A dilation pushes points away from its center. A line through the center stays put. Any other line moves to a parallel line. |
| `G-SRT.A.1-2` Know segments scale by the scale factor | Geometry | 📏 Scale the Segment | A dilation multiplies every length by the scale factor. It never adds. |
| `G-SRT.A.2-1` Decide if figures are similar using transformations | Geometry | 🔺 Check All Three Ratios | Two triangles are similar only if every pair of matching sides has the same ratio. Two matching pairs are not enough. |
| `G-SRT.A.2-2` Know similar means equal angles and proportional sides | Geometry | 👯 What Similar Really Means | Similar triangles are the same shape at different sizes. Their angles match exactly. Their sides are in proportion. |
| `G-SRT.A.3-1` Establish AA similarity from transformations | Geometry | 📐 AA Makes Them Similar | Two pairs of equal angles force the third pair to match, and that is enough for similarity. |
| `G-SRT.B.4-1` Prove the side-splitter theorem | Geometry | ✂️ Side Splitter | A line drawn parallel to one side of a triangle cuts the other two sides in the same ratio. |
| `G-SRT.B.4-2` Prove the Pythagorean Theorem with similarity | Geometry | 🪜 Altitude to the Hypotenuse | Drop a height onto the hypotenuse of a right triangle and it splits into two smaller triangles, each similar to the whole. |
| `G-SRT.B.5-1` Find unknown lengths with similar triangles | Geometry | 🌳 Shadow Math | At the same moment, every upright object and its shadow make similar triangles. Height over shadow is the same for all of them. |
| `G-SRT.B.5-2` Prove relationships in figures | Geometry | ⚖️ Justify Every Claim | In a proof, a picture that looks right proves nothing. Each claim needs a named reason: a shared side, a criterion, matching parts. |
| `G-SRT.C.6-1` Know trig ratios depend only on the angle | Geometry | 📐 Same Angle, Same Ratio | All right triangles with the same acute angle are similar. So the ratio of two sides depends only on the angle, not on the size. |
| `G-SRT.C.6-2` Define sine, cosine, tangent for acute angles | Geometry | 📏 Sine, Cosine, Tangent | From an acute angle, a right triangle has an opposite side, an adjacent side and the hypotenuse. Three ratios name their relationships. |
| `G-SRT.C.7-1` Use sin(x) = cos(90 - x) | Geometry | 🔁 Complementary Angles Trade | The two acute angles of a right triangle add to 90°. The side opposite one is adjacent to the other, so sine and cosine swap. |
| `G-SRT.C.8-1` Find missing sides with trig ratios | Geometry | 🧗 Find the Side With Trig | Know one side and one acute angle of a right triangle and a trig ratio gives you any other side. |
| `G-SRT.C.8-2` Find missing angles with inverse trig | Geometry | 🧭 Find the Angle With Inverse Trig | When you know two sides and want the angle, work backward: the inverse function turns a ratio into an angle. |
| `G-SRT.C.8-3` Solve applied problems (angle of elevation) | Geometry | 🔭 Angle of Elevation | Looking up at the top of something makes a right triangle: the ground, the height, and your line of sight. |
| `S-CP.A.1-1` Describe events with 'and', 'or', 'not' | Geometry | 🎲 And, Or, Not | Roll a die. "Or" collects every outcome in either event. "And" keeps only the ones in both. |
| `S-CP.A.2-1` Know A and B are independent if P(A and B) = P(A)P(B) | Geometry | 🎰 Independent or Not? | Two events are independent when one happening tells you nothing about the other. There is a quick multiplication test. |
| `S-CP.A.3-1` Interpret P(A given B) as P(A and B)/P(B) | Geometry | 🔦 Given That | Once you know B happened, B becomes your whole world. The chance of A inside that world is a conditional probability. |
| `S-CP.A.4-1` Build two-way tables and use them to judge independence | Geometry | 🎺 Table Test for Independence | A two-way table sorts people by two questions at once. Compare rates, not raw counts, to see if the answers are linked. |
| `S-CP.A.5-1` Explain conditional probability and independence in real situations | Geometry | 🔄 Which Way Is the Condition? | The chance of A given B and the chance of B given A are different questions. The group you start from changes everything. |
| `S-CP.B.6-1` Find P(A|B) as the fraction of B's outcomes that are in A | Geometry | 🔍 Shrink the World | Given B means: ignore everyone outside B. Count how many of B are also in A. |
| `S-CP.B.7-1` Apply P(A or B) = P(A) + P(B) - P(A and B) | Geometry | ♊ Do Not Count the Overlap Twice | Add P(A) and P(B) and anything in both gets counted twice. Subtract the overlap once to fix it. |
| `S-CP.B.8-1` Apply P(A and B) = P(A)P(B|A) | Geometry | 🔴 Draw Without Putting Back | Pull a marble and keep it. The bag has changed, so the chance for the second draw changes too. |
| `S-CP.B.9-1` Use permutations when order matters | Geometry | 🏅 Order Matters | Gold, silver, bronze: the same three runners in a different order is a different result. Count choices spot by spot. |
| `S-CP.B.9-2` Use combinations to compute probabilities | Geometry | 🤝 Choose a Committee | On a committee nobody is first or second. The same people in another order is the same committee, so divide the repeats out. |
| `S-MD.B.6-1` Use random devices to make fair decisions | Geometry | ⚖️ Is It Really Fair? | A fair way to choose gives every person the same chance. Feeling fair is not enough: check the probabilities. |
| `S-MD.B.7-1` Analyze decisions like medical testing and game strategy | Geometry | 🧪 Positive Does Not Mean Certain | When a condition is rare, most positive results can come from people who do not have it. Count both kinds of positives. |
| `A-APR.B.2-1` Know p(a) is the remainder when dividing by (x - a) | Algebra 2 | 🎁 Remainder Shortcut | To find the remainder when p(x) is divided by x − a, skip the division. Just work out p(a). |
| `A-APR.B.2-2` Use it to test factors | Algebra 2 | 🔑 Factor Test | If plugging in a gives zero, then x − a divides the polynomial with nothing left over. It is a factor. |
| `A-APR.B.3-1` Find zeros from factored form | Algebra 2 | 🎯 Three Factors, Three Zeros | A product is zero when one of its factors is zero. Each factor hands you one zero, with the sign flipped. |
| `A-APR.B.3-2` Sketch a rough graph from the zeros | Algebra 2 | 🏀 Cross or Bounce | At a single zero the graph cuts through the axis. At a double zero it touches and turns back, like a ball bouncing. |
| `A-APR.C.4-1` Prove identities like (x^2 + y^2)^2 = (x^2 - y^2)^2 + (2xy)^2 | Algebra 2 | ♾️ True for Every Number | An identity is true for every value. Checking one example cannot prove that. Algebra can. |
| `A-APR.D.6-1` Rewrite a(x)/b(x) as q(x) + r(x)/b(x) | Algebra 2 | ✂️ Cancel Factors, Not Terms | You may cancel something that multiplies the whole numerator and denominator. You may not cancel pieces of a sum. |
| `A-APR.D.6-2` Use long division for polynomials | Algebra 2 | 🗄️ Hold the Place | Long division needs a column for every power of x. If a power is missing, hold its place with a zero term. |
| `A-REI.A.2-1` Solve rational equations | Algebra 2 | 🚧 Mind the Denominator | Clear the fraction to solve a rational equation. Then check that your answer does not make any denominator zero. |
| `A-REI.A.2-2` Solve radical equations and check for extraneous solutions | Algebra 2 | 🕵️ Check for Impostors | Squaring both sides can create answers that do not fit the original equation. Those are extraneous. Always check. |
| `A-REI.C.7-1` Solve a system of a line and a quadratic algebraically | Algebra 2 | 🎢 Line Meets Parabola | Set a line equal to a parabola and you get a quadratic. A quadratic can have two answers, so look for two crossing points. |
| `A-REI.C.7-2` Solve graphically | Algebra 2 | ✖️ Count the Crossings | Graph the line and the parabola together. Every point they share is a solution of the system. |
| `A-REI.D.11-1` Explain intersection x-values as solutions of f(x) = g(x) | Algebra 2 | 🤝 Where f Equals g | Where two graphs cross, both functions give the same output. The x-value of that point solves f(x) = g(x). |
| `A-REI.D.11-2` Find approximate solutions with technology or tables | Algebra 2 | 🔎 Hunt in the Table | Some equations cannot be solved by algebra alone. A table of values shows where the two sides meet. |
| `A-SSE.B.4-1` Derive the sum formula for a finite geometric series | Algebra 2 | 📈 Sum a Doubling Series | In 1 + 2 + 4 + 8 + … each total is one less than the next term. A geometric series has its own shortcut. |
| `A-SSE.B.4-2` Use the formula to solve problems (mortgage payments) | Algebra 2 | 🏦 Count Every Payment | Savings that grow by the same factor each time form a geometric series. The total depends on exactly how many terms there are. |
| `F-BF.B.4-1` Solve f(x) = c to find an inverse | Algebra 2 | ↩️ Undo the Function | An inverse function undoes the original. To find it, swap x and y, then solve for y. |
| `F-BF.B.4-2` Verify inverses by composition | Algebra 2 | 🔄 There and Back Again | Run a number through a function and then through its inverse, and you land right where you started. In both directions. |
| `F-BF.B.4-3` Read inverse values from graphs and tables | Algebra 2 | 🔙 Read the Table Backward | The inverse reads a table backward: find the number in the output row, then report the input above it. |
| `F-BF.B.4-4` Restrict a domain to make a function invertible | Algebra 2 | ✂️ Make It One-to-One | A function has an inverse only if no output is used twice. If one is, trim the domain until each output appears once. |
| `F-BF.B.5-1` Use the inverse relationship to solve problems | Algebra 2 | 🪵 Logs Ask for the Exponent | A logarithm is a question: what exponent turns the base into this number? Log base 2 of 8 asks 2 to the what is 8. |
| `F-LE.A.4-1` Express solutions of ab^(ct) = d as logarithms | Algebra 2 | ⬇️ Bring the Exponent Down | When the unknown is stuck in the exponent, take the log of both sides. The exponent comes down where you can solve for it. |
| `F-LE.A.4-2` Evaluate logs with technology | Algebra 2 | 🧮 Log or ln? | The log key uses base 10. The ln key uses base e, about 2.718. Same idea, different base. |
| `F-TF.A.1-1` Know a radian as arc length over radius | Algebra 2 | 🎡 One Radius Along the Rim | A radian measures an angle by its arc: how many radius-lengths fit along the rim. |
| `F-TF.A.1-2` Convert radians and degrees | Algebra 2 | 🔁 Degrees and Radians | A half turn is 180 degrees, and it is also π radians. That one fact converts everything. |
| `F-TF.A.2-1` Use the unit circle to define sine and cosine for any angle | Algebra 2 | 🧭 Sine and Cosine on the Unit Circle | Walk around a circle of radius 1. At any angle, your x-coordinate is the cosine and your y-coordinate is the sine. |
| `F-TF.A.2-2` Find signs of trig values by quadrant | Algebra 2 | 🧲 Signs by Quadrant | Sine is the height and cosine is the across distance. So their signs follow the signs of y and x in each quadrant. |
| `F-TF.B.5-1` Choose amplitude, frequency, and midline from context | Algebra 2 | 🎡 Shape the Wave | A Ferris wheel, a tide, a swing: each repeats like a sine wave. Amplitude is its height from the middle. The midline is its middle. |
| `F-TF.C.8-1` Prove sin^2 + cos^2 = 1 | Algebra 2 | ⭕ The Pythagorean Identity | Every point on the unit circle is 1 away from the center. Apply the Pythagorean theorem to its coordinates. |
| `F-TF.C.8-2` Find one trig value from another and the quadrant | Algebra 2 | 🧲 Find the Other One | The identity gives the size of the missing trig value. The quadrant decides whether it is positive or negative. |
| `N-CN.A.1-1` Know i^2 = -1 | Algebra 2 | 🌀 The Number i | No real number squares to a negative. So mathematicians named a new one: i, the number whose square is −1. |
| `N-CN.A.1-2` Write complex numbers as a + bi | Algebra 2 | 🧩 Real Part, Imaginary Part | Every complex number has two parts that stay separate: a real part and an imaginary part, written a + bi. |
| `N-CN.A.2-1` Add and subtract complex numbers | Algebra 2 | ➕ Real With Real | Adding complex numbers works like combining like terms. Real parts go together. Imaginary parts go together. |
| `N-CN.A.2-2` Multiply complex numbers using i^2 = -1 | Algebra 2 | ✖️ Multiply, Then Swap i Squared | Multiply complex numbers like binomials. Then finish the job: every i^2 turns into −1. |
| `N-CN.C.7-1` Solve quadratics with negative discriminants | Algebra 2 | 👻 Solutions That Are Not Real | x^2 = −4 has no real answer. In the complex numbers it has two: 2i and −2i. |
| `N-CN.C.7-2` Use the discriminant to predict solution types | Algebra 2 | 🔮 What the Discriminant Says | The number under the root in the quadratic formula, b^2 − 4ac, predicts the kind of solutions before you solve. |
| `N-RN.A.1-1` Explain why 5^(1/3) is the cube root of 5 | Algebra 2 | 🌱 Fraction Exponents Are Roots | Cube 8^(1/3) and the exponents multiply to 1, giving 8. So 8^(1/3) must be the number whose cube is 8. |
| `N-RN.A.1-2` Extend exponent rules to rational exponents | Algebra 2 | 🪜 Root First, Then Power | In 8^(2/3) the bottom number is a root and the upper number is a power. Take the root first to keep the numbers small. |
| `N-RN.A.2-1` Convert between radical and rational exponent form | Algebra 2 | 🔁 Radical or Exponent | A radical and a fraction exponent are two outfits for the same number. The root goes in the bottom of the fraction. |
| `N-RN.A.2-2` Simplify radical expressions | Algebra 2 | 🧰 Pull Out the Perfect Square | A square root splits over multiplication, never over addition. Find a perfect square factor and pull it out. |
| `S-IC.A.1-1` Know samples are used to infer population parameters | Algebra 2 | 🗳️ Sample or Whole Population? | A statistic describes a sample you measured. A parameter describes the whole population, which you usually cannot measure. |
| `S-IC.A.2-1` Use simulation to judge a model | Algebra 2 | 🪙 Is the Model Believable? | To test a claim, simulate it many times and see how often your result shows up. Rare results cast doubt. Common ones do not. |
| `S-IC.B.3-1` Tell the three study types apart | Algebra 2 | 🔬 Survey, Observe or Experiment | A survey asks. An observational study watches. An experiment assigns a treatment and compares. |
| `S-IC.B.3-2` Explain how randomization relates to each | Algebra 2 | 🎲 Two Jobs for Randomness | Randomly choosing who is in a study and randomly assigning treatments are different tools with different powers. |
| `S-IC.B.4-1` Estimate a population mean or proportion from a sample | Algebra 2 | 📋 Estimate From a Sample | A sample proportion is your best single guess for the whole population. Find it, and remember it is an estimate. |
| `S-IC.B.4-2` Develop a margin of error through simulation | Algebra 2 | ↔️ Plus or Minus | A poll result comes with a margin of error. Together they give a range that probably holds the true value. |
| `S-IC.B.5-1` Use simulation to decide if differences are significant | Algebra 2 | 🃏 Real Difference or Shuffle Luck? | Shuffle the group labels many times. If a difference as big as yours shows up often, chance alone could explain it. |
| `S-IC.B.6-1` Critique study design and conclusions in reports | Algebra 2 | 📰 Question the Headline | A number in an ad or a headline is only as good as the study it came from. Ask how it was done before you believe it. |
| `S-ID.A.4-1` Use mean and SD to fit a normal distribution | Algebra 2 | 🔔 Does a Bell Curve Fit? | The normal model is a symmetric bell around the mean. It only describes data that pile up in the middle and thin out evenly. |
| `S-ID.A.4-2` Estimate percents with the Empirical Rule and z-scores | Algebra 2 | 📊 68, 95, 99.7 | In any normal distribution, about 68% of values fall within one standard deviation of the mean, and 95% within two. |
| `A-APR.C.5-1` Expand (x + y)^n with the Binomial Theorem | Precalculus / advanced (+) | 🔺 Pascal Powers | Expanding (x + y)^n gives more than the two end terms. The middle terms get their coefficients from Pascal’s triangle. |
| `A-APR.D.7-1` Add, subtract, multiply, divide rational expressions | Precalculus / advanced (+) | 🧮 Fractions With Letters | Rational expressions follow the same rules as number fractions. To add them you need a common denominator. |
| `A-REI.C.8-1` Write a system as a matrix equation | Precalculus / advanced (+) | 🗃️ System in a Matrix | A system of equations packs into one matrix equation: coefficients in a grid, unknowns in a column, constants in a column. |
| `A-REI.C.9-1` Use an inverse matrix to solve a system | Precalculus / advanced (+) | 🗝️ Solve With the Inverse | If AX = B, multiply both sides by the inverse of A, on the left. What remains is X, the solution. |
| `F-TF.A.3-1` Find sin, cos, tan at pi/6, pi/4, pi/3 | Precalculus / advanced (+) | 📐 Special Angle Values | Two special triangles give exact trig values. In the 30-60-90 triangle, the short leg is half the hypotenuse. |
| `F-TF.A.3-2` Use symmetry for related angles | Precalculus / advanced (+) | 🪞 Mirror Angles | Every angle has a reference angle in the first quadrant. The trig value is the same size. The quadrant gives the sign. |
| `F-TF.A.4-1` Explain odd and even trig functions | Precalculus / advanced (+) | 🌊 Odd and Even Waves | Flip an angle to its negative and the point reflects across the x-axis. Its height changes sign. Its across distance does not. |
| `F-TF.A.4-2` Explain periodicity with the unit circle | Precalculus / advanced (+) | 🎠 Round and Round | Go all the way around the unit circle and you are back where you started. So sine and cosine repeat every full turn. |
| `F-TF.B.6-1` Restrict domains so trig functions are invertible | Precalculus / advanced (+) | 🎚️ One Answer From Arcsin | Many angles share the same sine. For arcsin to be a function it must pick just one, so its outputs are limited to a set range. |
| `F-TF.B.7-1` Solve trig equations in context with inverses | Precalculus / advanced (+) | 🎯 Find Every Angle | A trig equation usually has more than one solution in a full turn. The calculator gives one. Symmetry gives the other. |
| `F-TF.C.9-1` Use sum and difference formulas | Precalculus / advanced (+) | ➕ Sine of a Sum | The sine of a sum is not the sum of the sines. It mixes sines and cosines of both angles. |
| `G-C.A.4-1` Construct a tangent from an outside point | Precalculus / advanced (+) | 🧷 Tangent From Outside | From a point outside a circle you can draw a line that just grazes it. That tangent meets the radius at a right angle. |
| `G-GMD.A.2-1` Argue the sphere volume formula informally | Precalculus / advanced (+) | 🌐 Why Four Thirds | Slice a half sphere and a cylinder with a cone scooped out. At every height the slices have equal area, so the volumes match. |
| `G-GPE.A.2-1` Derive a parabola equation from focus and directrix | Precalculus / advanced (+) | 🛰️ Focus and Directrix | Every point of a parabola is as far from a point, the focus, as from a line, the directrix. The vertex sits exactly halfway. |
| `G-GPE.A.3-1` Derive equations from foci | Precalculus / advanced (+) | 🥚 Ellipse or Hyperbola | An ellipse keeps the sum of its two focus distances constant. A hyperbola keeps the difference constant. One sign tells them apart. |
| `G-SRT.D.10-1` Prove the Law of Sines and Law of Cosines | Precalculus / advanced (+) | ⚖️ Laws for Any Triangle | SOH-CAH-TOA needs a right angle. The Law of Sines and the Law of Cosines work in every triangle. |
| `G-SRT.D.11-1` Solve non-right triangles | Precalculus / advanced (+) | 🔺 Solve Any Triangle | With the two laws you can find missing sides in triangles that have no right angle at all. |
| `G-SRT.D.11-2` Apply to surveying and forces | Precalculus / advanced (+) | 🚤 Boats and Sight Lines | Surveyors and sailors measure two distances and the angle between them. The Law of Cosines gives the distance they cannot reach. |
| `G-SRT.D.9-1` Derive and use A = 1/2 ab sin(C) | Precalculus / advanced (+) | 📐 Area From Two Sides and an Angle | You do not need the height to find a triangle’s area. Two sides and the angle between them are enough. |
| `N-CN.A.3-1` Find conjugates and use them to divide | Precalculus / advanced (+) | 🪞 Conjugate to the Rescue | A conjugate flips the sign of the imaginary part only. Multiply a complex number by its conjugate and the i disappears. |
| `N-CN.A.3-2` Find the modulus | Precalculus / advanced (+) | 📏 How Far From Zero | The modulus of a complex number is its distance from 0 on the complex plane. The two parts are the legs of a right triangle. |
| `N-CN.B.4-1` Plot complex numbers on the complex plane | Precalculus / advanced (+) | 🗺️ Map of Complex Numbers | Every complex number is a point. The real part says how far across. The imaginary part says how far up. |
| `N-CN.B.4-2` Convert between rectangular and polar form | Precalculus / advanced (+) | 🧭 Distance and Direction | Polar form describes a complex number by how far it is from 0 and which way it points. |
| `N-CN.B.5-1` Show addition and multiplication on the complex plane | Precalculus / advanced (+) | 🛷 Slide and Stretch | On the complex plane, adding slides a point. Multiplying by a real number stretches it away from 0. |
| `N-CN.B.5-2` Use rotation to understand multiplication by i | Precalculus / advanced (+) | 🔄 Times i Is a Quarter Turn | Multiply any complex number by i and it swings a quarter turn counterclockwise around 0, keeping its distance. |
| `N-CN.B.6-1` Find distance as the modulus of the difference | Precalculus / advanced (+) | 📡 Distance Between Complex Numbers | To find how far apart two complex numbers are, subtract them. The modulus of the difference is the distance. |
| `N-CN.C.8-1` Factor x^2 + 4 as (x + 2i)(x - 2i) | Precalculus / advanced (+) | 🧩 Factor a Sum of Squares | x^2 + 4 will not factor with real numbers. With i, it splits just like a difference of squares. |
| `N-CN.C.9-1` Know a degree n polynomial has n complex roots (with multiplicity) | Precalculus / advanced (+) | 🌳 Count Every Root | The Fundamental Theorem of Algebra: a polynomial of degree n has exactly n complex roots, when repeats are counted. |
| `N-VM.A.1-1` Recognize vector quantities | Precalculus / advanced (+) | 🧭 Size and Direction | A scalar is just a size. A vector has a size and a direction. Thirty miles per hour is a speed. Thirty miles per hour north is a velocity. |
| `N-VM.A.1-2` Use vector notation | Precalculus / advanced (+) | 🏹 Length of an Arrow | The vector (3, 4) goes 3 across and 4 up. Its magnitude is the length of the arrow, not either of those numbers. |
| `N-VM.A.2-1` Find components by subtracting initial from terminal point | Precalculus / advanced (+) | ➡️ Tip Minus Tail | A vector’s components say how far it moves across and up. Subtract where it starts from where it ends. |
| `N-VM.A.3-1` Solve problems with velocity and forces as vectors | Precalculus / advanced (+) | ⛵ Boat in a Current | A boat heads east while the current pushes north. Its real path is the diagonal, and its real speed is the length of that diagonal. |
| `N-VM.B.4-1` Add vectors end to end, by components, and parallelogram rule | Precalculus / advanced (+) | 🔗 Tip to Tail | To add two vectors, walk along the first, then along the second from where you stopped. Or just add the components. |
| `N-VM.B.4-2` Find magnitude and direction of a sum | Precalculus / advanced (+) | 💪 How Big Is the Sum? | Two forces together make one total force. Its size comes from adding components first, then finding the length. |
| `N-VM.B.4-3` Subtract vectors as adding the opposite | Precalculus / advanced (+) | ↩️ Subtract an Arrow | Subtracting a vector means adding its opposite: turn the second arrow around, then add. |
| `N-VM.B.5-1` Scale vectors graphically | Precalculus / advanced (+) | 🪄 Stretch the Arrow | A positive number stretches or shrinks a vector along the same line. A negative number also turns it around. |
| `N-VM.B.5-2` Compute magnitude of cv | Precalculus / advanced (+) | 📐 Length After Scaling | Scaling a vector by c multiplies its length by the size of c. A length is never negative, even when c is. |
| `N-VM.C.10-1` Use zero and identity matrices | Precalculus / advanced (+) | 🪞 The Do-Nothing Matrices | The zero matrix acts like 0 in addition. The identity matrix acts like 1 in multiplication. It has 1s only on the diagonal. |
| `N-VM.C.10-2` Know a square matrix has an inverse when the determinant is nonzero | Precalculus / advanced (+) | 🔐 Determinant Check | The determinant of a 2 by 2 matrix is one number: ad − bc. If it is zero, the matrix cannot be undone. |
| `N-VM.C.11-1` Multiply a vector by a matrix | Precalculus / advanced (+) | 🎯 Matrix Meets Vector | A matrix can act on a vector and turn it into a new vector. Each row of the matrix makes one entry of the answer. |
| `N-VM.C.12-1` Interpret the determinant as area scaling | Precalculus / advanced (+) | 🟪 How Much Area Grows | A 2 by 2 matrix reshapes the plane. Its determinant tells how many times bigger every area becomes. |
| `N-VM.C.6-1` Use matrices to organize data | Precalculus / advanced (+) | 🗄️ Rows and Columns | A matrix is a grid of numbers. Rows go across. Columns go down. Each position means something. |
| `N-VM.C.7-1` Multiply every entry by a scalar | Precalculus / advanced (+) | 🔆 Scale Every Entry | Multiplying a matrix by a number multiplies every single entry, in every row. |
| `N-VM.C.8-1` Add and subtract matrices of the same size | Precalculus / advanced (+) | 🧮 Match the Positions | To add matrices, add the entries that sit in the same position. That only works when the shapes match. |
| `N-VM.C.8-2` Multiply matrices with matching dimensions | Precalculus / advanced (+) | ✖️ Row Times Column | Matrix multiplication is not entry by entry. Each answer comes from a whole row of the first times a whole column of the second. |
| `N-VM.C.9-1` Know AB may not equal BA | Precalculus / advanced (+) | 🔀 Order Matters for Matrices | With numbers, 3 × 5 and 5 × 3 agree. With matrices, AB and BA can be completely different. |
| `S-MD.A.1-1` Define a random variable and graph its distribution | Precalculus / advanced (+) | 🪙 Give Each Outcome a Number | A random variable turns each outcome into a number. Flip two coins and let X count the heads: X can be 0, 1 or 2. |
| `S-MD.A.2-1` Calculate expected value as the mean of the distribution | Precalculus / advanced (+) | 🎰 The Long-Run Average | Expected value is the average you would get over a huge number of tries. Likely values count more than rare ones. |
| `S-MD.A.3-1` Build distributions from theoretical probabilities | Precalculus / advanced (+) | 🧩 Probabilities Must Total One | Build a distribution from theory: find the probability of every value. Together they must add up to exactly 1. |
| `S-MD.A.4-1` Build distributions from observed frequencies | Precalculus / advanced (+) | 🐾 Distribution From Data | When theory is not available, use data. Each probability is a relative frequency: the count divided by the total. |
| `S-MD.B.5-1` Find expected payoff of a game | Precalculus / advanced (+) | 🎟️ Is the Game Worth It? | A game’s expected payoff is what you win on average, minus what you pay to play. |
| `S-MD.B.5-2` Compare strategies with expected values | Precalculus / advanced (+) | 🤔 Sure Thing or Long Shot | A giant prize can be a poor choice if it rarely comes. Compare options by their expected values, not their biggest numbers. |
| `L.K.1-1` Print many upper- and lowercase letters | K | 🅰️ Big and Small Letters | Every letter comes in two sizes: uppercase and lowercase. A name starts with an uppercase letter. |
| `L.K.1-2` Use common nouns and verbs | K | 🏃 Naming or Doing | Some words name a thing. Other words tell what something does. A sentence needs both. |
| `L.K.1-3` Form regular plurals by adding s or es | K | 🐕 More Than One | One dog, two dogs. To show more than one, add s. Some words need es. |
| `L.K.1-4` Understand question words (who, what, where, when, why, how) | K | 🗝️ Question Word Keys | Each question word opens a different kind of answer. Who is for people, where is for places, when is for time. |
| `L.K.1-5` Use common prepositions (to, from, in, out, on, off) | K | 📦 In, On, To | Little words like in, on, to and off tell where things are and where they go. |
| `L.K.1-6` Speak and write complete sentences in shared language activities | K | ✅ Whole Sentence Check | A whole sentence tells who and what they do. Just a few words are not enough. |
| `L.K.2-1` Capitalize the first word of a sentence and the pronoun I | K | 🚂 Sentence Train | The word train cannot leave until its capital letters are right. Tap a car to fix it. |
| `L.K.2-2` Recognize and name end punctuation | K | ❓ End Mark Machine | Every sentence ends with a mark. Telling gets a period, asking gets a question mark, and shouting gets an exclamation point. |
| `L.K.2-3` Write a letter for most consonant and short vowel sounds | K | 🧩 Missing Middle | Every little word has a vowel sound in the middle. Listen for it and drop in the letter. |
| `L.K.2-4` Spell simple words phonetically | K | 🐖 Spell It by Sound | Say the word slowly and stretch it out. Then put down one letter for each sound you hear. |
| `L.K.4-1` Know new meanings for familiar words (duck as a bird and duck as an action) | K | 🦆 One Word, Two Meanings | Some words mean two different things. The rest of the sentence tells you which one. |
| `L.K.4-2` Use common inflections and affixes (-ed, -s, re-, un-) as clues | K | 🔧 Word Part Clues | Little parts added to a word change what it means. Un means not. Re means again. |
| `L.K.5-1` Sort objects into categories (shapes, foods) | K | 🧺 Sorting Baskets | Things that go together belong in the same basket. Think about what kind of thing each one is. |
| `L.K.5-2` Use opposites for common verbs and adjectives | K | 🔥 Opposite Day | Opposites are as different as can be: hot and cold, up and down, big and small. |
| `L.K.5-3` Connect words to real-life use (places at school that are colorful) | K | 🧸 Word in the World | A describing word fits lots of real things. Find the things around you that it fits. |
| `L.K.5-4` Act out shades of meaning among verbs (walk, march, strut) | K | 🥁 Tiptoe, Walk, March | Some words mean almost the same thing, but not quite. Tiptoe, walk and march are three ways to move. |
| `L.K.6-1` Use words and phrases learned through conversations, reading, and being read to | K | 🐘 Fancy Word Fit | Books teach us big new words. Try them out by putting each one where it fits. |
| `RF.K.1-1` Follow print left to right, top to bottom, page by page | K | 🚗 Reading Road | Words are read like a road: start at the left, drive to the right, then go down to the next line. |
| `RF.K.1-2` Know spoken words match written words | K | 👆 One Touch, One Word | Every word you say matches one word on the page. Touch each word once as you read it. |
| `RF.K.1-3` Know words are separated by spaces | K | 🚀 Space Between | Words on a page have little spaces between them. The spaces show where one word ends and the next begins. |
| `RF.K.1-4` Name all upper- and lowercase letters | K | 🔤 Letter Partners | Every big letter has a small partner. Some small letters look alike, so check which way they face. |
| `RF.K.2-1` Recognize and produce rhyming words | K | 🐸 Rhyme Pond | Each frog can only land on a lily pad that rhymes with its word. |
| `RF.K.2-2` Count, say, blend, and segment syllables | K | 👏 Clap the Beats | Words have beats. Say the word slowly and clap once for each beat you hear. |
| `RF.K.2-3` Blend and segment onsets and rimes (c-at) | K | 🧲 Snap the Word Together | A word has a first sound and a rest. Snap the two parts together to name the picture. |
| `RF.K.2-4` Isolate first, middle, and last sounds in CVC words | K | 👂 Same Sound Hunt | Say each picture word out loud and listen. Which ones start, or end, with the same sound? |
| `RF.K.2-5` Add or change sounds to make new words (cat to bat) | K | 🔁 Swap One Sound | Change just one sound and you get a brand new word. Swap the first letter to match the new picture. |
| `RF.K.3-1` Know the most common sound for each consonant | K | 🎣 First Letter Fishing | Each picture word starts with one sound. Catch the letter that makes that first sound. |
| `RF.K.3-2` Know long and short sounds for the five vowels | K | 🎵 Short or Long Vowel | Vowels have two sounds. The long sound says the letter name, like the a in cake. The short sound is quick, like the a in cat. |
| `RF.K.3-3` Read common high-frequency words by sight (the, of, to, you) | K | 🕶️ Sight Word Spotter | Some little words show up all the time. Spot them fast, just by how they look. |
| `RF.K.3-4` Tell similar words apart by the letters that differ (cat vs cut) | K | 🧐 One Letter Apart | Some words look almost the same. Only one letter is different, so look at every letter. |
| `RF.K.4-1` Read emergent-reader texts with purpose and understanding | K | 🔎 Read and Find | Read the little story, then find the answer. The words on the page tell you everything you need. |
| `RI.K.1-1` Ask and answer questions about key details in an informational text | K | 🐸 Frog Facts | A fact book tells true things. The answers to questions about it are right there in the words. |
| `RI.K.10-1` Engage in group reading of informational texts with purpose | K | 🐋 Stay on the Whale | When we read a fact book together, good listeners think and talk about the topic of the book. |
| `RI.K.2-1` Identify the main topic | K | ☂️ Umbrella Topic | It is raining! Hang the topic sign that opens an umbrella over everyone in the row. |
| `RI.K.2-2` Retell key details | K | 🐝 What the Book Said | After a fact book, tell what you learned. Only tell things the book really said. |
| `RI.K.3-1` Describe the connection between two people, events, or ideas | K | 🦋 How They Connect | Fact books show how things are linked. One thing can grow and change into another. |
| `RI.K.4-1` Ask and answer questions about unknown words | K | 🔦 Fact Word Finder | Fact books use special words. When one is new, the book often tells you what it means. |
| `RI.K.5-1` Identify the front cover, back cover, and title page | K | 📕 Parts of a Book | A book has a front cover, a back cover and a title page. Each one is in its own place. |
| `RI.K.6-1` Name the author and illustrator and their roles | K | 🚚 Fact Book Makers | A book about trucks needs two jobs. The author writes the facts. The illustrator makes the pictures. |
| `RI.K.7-1` Describe how illustrations relate to the text | K | 🕸️ Fact and Picture | In a fact book, the pictures show what the words are teaching. Match each fact to its picture. |
| `RI.K.8-1` Identify the reasons an author gives to support points | K | 🦵 Because Why? | An author says something, then gives a reason for it. The reason tells you why it is true. |
| `RI.K.9-1` Name basic similarities and differences between two texts on the same topic | K | 📚 Two Frog Books | Two books on the same topic share some facts. Each one also tells something the other does not. |
| `RL.K.1-1` Answer who, what, where questions about key details with prompting | K | 🐻 Who, What, Where | After a story, good readers can say who was in it, what happened, and where it took place. |
| `RL.K.1-2` Ask questions about a story | K | 🪁 Question Kite | Good readers wonder about the story. A good question is about what is happening in the book. |
| `RL.K.10-1` Engage in group reading activities with purpose and understanding | K | 🐸 Join In Line | Some books say one line again and again. When you spot it, you can join in and read along. |
| `RL.K.2-1` Retell a story with key details in order | K | 🌱 Tell It Again | Retelling a story means telling the big things that happened, in the same order as the book. |
| `RL.K.2-2` Tell beginning, middle, and end | K | 🚂 Start, Middle, End | A story is like a train with three cars: the beginning, the middle and the end. |
| `RL.K.3-1` Name the characters and setting | K | 🏰 Who and Where | Characters are who the story is about. The setting is where and when the story happens. |
| `RL.K.3-2` Identify major events in a story | K | ⛈️ Big Things That Happened | Stories have big events and tiny details. The big events are the ones the story could not do without. |
| `RL.K.4-1` Ask and answer questions about unknown words in a text | K | 🕵️ New Word Detective | When you meet a word you do not know, stop and be a detective. The words around it give clues. |
| `RL.K.5-1` Recognize storybooks and poems | K | 📜 Story or Poem? | Stories and poems look and sound different. Poems have short lines, a beat, and often words that rhyme. |
| `RL.K.6-1` Name the author and illustrator and what each does | K | 📚 Book Makers | A new book came in pieces. Send each piece back to the person who made it. |
| `RL.K.7-1` Describe how pictures connect to the story | K | 🖼️ Picture Match | The pictures in a book show what the words are telling. Match each picture to its part of the story. |
| `RL.K.9-1` Compare the adventures and experiences of characters in familiar stories | K | 🦊 Two Adventures | Two characters each go on an adventure. Some things are the same in both, and some are different. |
| `W.K.1-1` State an opinion about a topic or book | K | 💭 Think Bubbles | Froggy wants to know what you think. Tap the cards that say what someone thinks or likes. |
| `W.K.1-2` Give a reason for the opinion | K | 🎈 Because Balloon | When you say what you like, tell why. A reason makes other people understand. |
| `W.K.2-1` Name what they are writing about | K | ✏️ What Is It About? | When you write to teach, you start by naming what you are writing about. That is your topic. |
| `W.K.2-2` Supply some information about the topic | K | 🐕 Add a True Fact | One word is only a label. Writers add true facts so the reader learns something. |
| `W.K.3-1` Tell about one or more events in order | K | 🌅 First, Next, Last | When you write about your day, tell things in the order they happened. |
| `W.K.3-2` React to what happened | K | 😊 How Did It Feel? | A good ending tells how you felt about what happened. It lets the reader feel it too. |
| `W.K.5-1` Respond to questions and add details to strengthen writing | K | 🖍️ Add the Detail | A friend asks a question about your writing. Make it stronger by adding the answer. |
| `W.K.6-1` Use digital tools to produce and publish writing with adults | K | ⌨️ Key Finder | Writers can type their words with keys. Find each letter key, in order, to type the word. |
| `W.K.7-1` Take part in shared research and writing projects | K | 🐻 Bear Chart | The class read books about bears. Now we make a chart of what the books taught us. |
| `W.K.8-1` Recall experiences or gather information from sources to answer a question | K | 🧭 Where to Look | To answer a question you have to know where to look: in a book, out the window, or in your own memory. |
| `L.1.1-1` Print all letters correctly | 1 | 🔡 Alphabet Trail | The letters of the alphabet walk in a line, always in the same order. Fill in the ones that wandered off. |
| `L.1.1-10` Write simple and compound sentences, statements, questions, commands, exclamations | 1 | 🎪 Kinds of Sentences | Sentences do different jobs. Some tell, some ask, and some give an order. |
| `L.1.1-2` Use common, proper, and possessive nouns | 1 | 🦴 Whose Is It? | To show that something belongs to someone, add an apostrophe and s. The bone of the dog is the dog’s bone. |
| `L.1.1-3` Match singular and plural nouns with verbs (he hops, we hop) | 1 | 🐸 The Traveling S | Each sentence has one letter S. Give it to the animal word or to the action word. |
| `L.1.1-4` Use personal, possessive, and indefinite pronouns | 1 | 🙋 I or Me? | Little words like I, me, my, she and they stand in for names. Each one has its own job in a sentence. |
| `L.1.1-5` Use verbs for past, present, and future | 1 | 📅 Yesterday, Today, Tomorrow | Verbs change to show when something happens: before now, right now, or later on. |
| `L.1.1-6` Use frequently occurring adjectives | 1 | 🎨 Describing Word Hunt | Describing words tell what kind: big, red, soft, tiny. They paint a picture in your mind. |
| `L.1.1-7` Use conjunctions (and, but, or, so, because) | 1 | 🪢 Joining Words | Joining words link two ideas. And adds, but turns, or gives a choice, so tells what happened next, and because tells why. |
| `L.1.1-8` Use determiners (a, an, this, that) | 1 | 🍎 A or An | Use an before a word that starts with a vowel sound. Use a before all the others. |
| `L.1.1-9` Use common prepositions (during, beyond, toward) | 1 | 🌉 Across the Bridge | Words like across, toward, during and beyond tell where, which way, or when. |
| `L.1.2-1` Capitalize dates and names of people | 1 | 🚓 Capital Letter Patrol | Names of people, days and months get a capital letter. So does the first word of a sentence. |
| `L.1.2-2` Use end punctuation correctly | 1 | ❗ Mark the End | Each sentence needs the right end mark: a period to tell, a question mark to ask, an exclamation point for strong feeling. |
| `L.1.2-3` Use commas in dates and lists | 1 | 🐾 Comma Keeper | Commas go between the things in a list, and between the day and the year in a date. Keep the commas that belong. |
| `L.1.2-4` Spell common spelling patterns and irregular high-frequency words | 1 | 🐝 Spell the Tricky Ones | Some words are not spelled the way they sound. Learn how they look so you can spell them right. |
| `L.1.2-5` Spell untaught words phonetically | 1 | 💦 Stretch and Spell | For a word you have not learned, stretch it out and write the sounds in order. Do not forget the vowel. |
| `L.1.4-1` Use sentence context as a clue | 1 | 🐕 Clue in the Sentence | When a word is new, the rest of the sentence helps. Look for the clue hiding nearby. |
| `L.1.4-2` Use affixes as clues | 1 | 👟 Untie and Retie | A small part stuck on the front of a word changes its meaning. Un means not or undo. Re means again. |
| `L.1.4-3` Find root words and their inflected forms (look, looks, looked) | 1 | 👀 Root Word Family | Look, looks, looked and looking are one family. They all grow from the same root word. |
| `L.1.5-1` Sort words into categories and define them by category | 1 | 🧺 Word Baskets | Words that name the same kind of thing go in one basket. Think about what each word means. |
| `L.1.5-2` Define words by category and key attributes (a duck is a bird that swims) | 1 | 🦆 Define It Well | A good definition says what kind of thing it is, and what makes it special. |
| `L.1.5-3` Connect words to real-life use | 1 | 🛋️ Cozy Spots | A word means more when you link it to real places and things you know. |
| `L.1.5-4` Tell shades of meaning (look, peek, glance, stare) | 1 | 🙈 Peek, Look, Stare | Some words mean almost the same thing, but one is stronger. A peek is quick. A stare goes on and on. |
| `L.1.6-1` Use words learned from reading and conversation, including conjunctions like because | 1 | 🧥 Because Bridge | The word because builds a bridge from what happened to why it happened. |
| `RF.1.1-1` Know a sentence starts with a capital and ends with punctuation | 1 | 🔍 Sentence Spotter | A sentence starts with a capital letter and stops at an end mark. A line on the page is not always one sentence. |
| `RF.1.2-1` Tell long from short vowels in one-syllable words | 1 | ✨ Magic E | A silent e at the end changes a word. Add it or take it away to make the picture. |
| `RF.1.2-2` Blend sounds into words, including consonant blends | 1 | 🐸 Blend Builder | Some words start with two consonants that slide together, like fr in frog. Say both sounds. |
| `RF.1.2-3` Isolate and say initial, medial vowel, and final sounds | 1 | 🚢 First, Middle, Last | Every short word has a first sound, a vowel sound in the middle, and a last sound. |
| `RF.1.2-4` Segment words into each sound | 1 | 🔵 Sound Dots | Break a word into every little sound. Push up one dot for each sound you say. |
| `RF.1.3-1` Know common consonant digraphs (sh, ch, th, wh, ck) | 1 | 🧀 Two Letters, One Sound | Some letter pairs team up to make one new sound: sh, ch, th, wh and ck. |
| `RF.1.3-2` Decode regularly spelled one-syllable words | 1 | 🚩 Read Every Letter | Two words can start the same way. Read all the way to the last letter to be sure. |
| `RF.1.3-3` Know final -e and vowel team patterns for long vowels | 1 | 🦸 Quiet E Changes It | An e at the end of a word stays quiet, but it makes the vowel say its name. Cap becomes cape. |
| `RF.1.3-4` Know every syllable has a vowel sound | 1 | 🐰 Count the Beats | Every beat in a word has a vowel sound in it. Say the word and count how many beats you hear. |
| `RF.1.3-5` Decode two-syllable words by breaking them into syllables | 1 | 🧲 Syllable Snap | A long word is just two short parts snapped together. Read each part, then say them fast. |
| `RF.1.3-6` Read words with inflectional endings (-s, -ed, -ing) | 1 | 🦘 Word Endings | The end of a word tells when it happens. Jumps, jumped and jumping all come from jump. |
| `RF.1.3-7` Read irregularly spelled grade-level words | 1 | 🦉 Tricky Word Spotter | Some words do not follow the rules. You cannot sound them out, so learn how they look. |
| `RF.1.4-1` Read grade-level text with purpose and understanding | 1 | 🐾 Read to Find Out | Reading is more than saying words. Read the story so you can tell what happened. |
| `RF.1.4-2` Read aloud with accuracy, rate, and expression | 1 | 🎭 Voice Coach | Good readers make their voice match the words. End marks tell your voice what to do. |
| `RF.1.4-3` Use context to confirm or self-correct, rereading as needed | 1 | 🐴 Does That Make Sense? | Sometimes a word comes out not quite right. Stop when it does not make sense, look again, and fix it. |
| `RI.1.1-1` Answer questions using key details in a text | 1 | 🐜 Ant Book Answers | A book about ants has the answers inside it. Find each answer in what the book says. |
| `RI.1.10-1` Read informational texts of grade 1 complexity with support | 1 | 🐧 Penguin Page | Read a page from a fact book all by yourself. Then check what you learned from it. |
| `RI.1.2-1` Identify the main topic | 1 | 🏷️ Name the Topic | The main topic is what the whole page is about. One fun fact is only a small part of it. |
| `RI.1.2-2` Retell key details | 1 | 🦉 Tell Two Details | After you name the topic, tell the key details. They are the facts the page gives about the topic. |
| `RI.1.3-1` Describe the connection between two individuals, events, ideas, or pieces of information | 1 | 🔗 This Leads to That | In a fact book, one thing often leads to another. Connect each fact to what it makes happen. |
| `RI.1.4-1` Ask and answer questions to clarify words and phrases | 1 | 🛟 Word Helper | Fact books explain their hard words. The meaning is often right after the word. |
| `RI.1.5-1` Know and use headings, tables of contents, glossaries, menus, icons | 1 | 📑 Find It Fast | You do not have to read a whole fact book to find one thing. The table of contents tells you which page to turn to. |
| `RI.1.6-1` Tell information from pictures apart from information in the words | 1 | 🕵️ Picture or Words | Every clue came from the picture or from the words. File each one where it was found. |
| `RI.1.7-1` Use illustrations and details to describe key ideas | 1 | 🐞 Diagram Detective | A fact book teaches with words and with diagrams. Use both to get the whole idea. |
| `RI.1.8-1` Identify reasons that support points in a text | 1 | 🪱 Reasons Why | An author makes a point, then backs it up with reasons. Find the reasons the book gives. |
| `RI.1.9-1` Identify basic similarities and differences between two texts on the same topic | 1 | 📗 Two Ant Books | Two books about ants say some of the same things. Each one also says something new. |
| `RL.1.1-1` Answer questions using key details from the story | 1 | 🦷 Tooth Story Details | The answers to questions about a story are in its details. Go back and find them. |
| `RL.1.1-2` Ask questions about key details | 1 | 🦊 Why and How Questions | Some questions only get a yes or a no. Why and how questions make you think more about the story. |
| `RL.1.10-1` Read prose and poetry of appropriate complexity for grade 1 with support | 1 | 🪵 Poem on a Log | Read a little poem. Listen for the words that rhyme and think about what the poem is about. |
| `RL.1.2-1` Retell stories with key details | 1 | 🐶 Most Important Parts | A retell is short. It tells only the most important parts of the story, not every little thing. |
| `RL.1.2-2` Show understanding of the central message or lesson | 1 | 🐜 What the Story Teaches | Many stories teach a lesson. The lesson is a big idea you can use in your own life. |
| `RL.1.3-1` Describe characters, settings, and major events using key details | 1 | 🥪 What Are They Like? | You can tell what a character is like from what they do and say, not just from how they look. |
| `RL.1.4-1` Find words and phrases that suggest feelings or appeal to the senses | 1 | ✨ Sense Sparks | Some words wake up your senses. Tap the words in each sentence that give a spark. |
| `RL.1.5-1` Explain differences between books that tell stories and books that give information | 1 | 🍯 Story or Fact Book? | Some books tell a made-up story. Other books teach true information. You can tell by what is inside. |
| `RL.1.6-1` Identify who is telling the story at various points | 1 | 🗣️ Who Is Talking? | In a story, different characters take turns telling what happens. The words said and asked show who is talking. |
| `RL.1.7-1` Use illustrations and details to describe characters, setting, events | 1 | 😢 Picture Plus Words | Use the picture AND the words together. The two of them tell you how a character feels. |
| `RL.1.9-1` Compare and contrast adventures and experiences of characters | 1 | 🐭 Mouse and Bird Trips | Two characters go on trips. Find what is alike about their trips, and what is different. |
| `W.1.1-1` Introduce the topic or book, state an opinion, give a reason | 1 | 🐕 Opinion and Reason | An opinion says what you think. A reason says why. Good opinion writing has both. |
| `W.1.1-2` Provide a sense of closure | 1 | 🎀 Wrap Up Your Opinion | Opinion writing needs an ending. A good ending tells the reader your opinion one more time. |
| `W.1.2-1` Name a topic and supply some facts | 1 | 🐸 Fact Finder | Writing that teaches needs facts. A fact is true for everyone. An opinion is what one person thinks. |
| `W.1.2-2` Provide closure | 1 | 📘 Close the Fact Book | Writing that teaches needs an ending too. The ending tells the reader that you are done. |
| `W.1.3-1` Recount two or more sequenced events with details | 1 | 🎢 Trip in Order | A story about a trip tells what happened in order. Time words like first, then and last help. |
| `W.1.3-2` Use time words to show order (first, next, then) | 1 | 🤖 Robot Chef | Robo follows time words exactly. Label each step so the robot does them in order. |
| `W.1.3-3` Provide closure | 1 | 🌙 Story Endings | A story should not just stop. A good ending tells how things turned out or how someone felt. |
| `W.1.5-1` Respond to feedback and add details | 1 | ❔ Reader Questions | A reader asks questions about your story. Answer each one by adding a detail to your sentence. |
| `W.1.6-1` Use digital tools to produce and publish writing | 1 | 🖥️ Type and Share | Writers use computers to type their work and share it. There are steps to follow, in order. |
| `W.1.7-1` Take part in shared research (read books on a topic and record observations) | 1 | 🌿 Plant Notes | The class read two books about plants. Write down what the books taught, not just anything you think of. |
| `W.1.8-1` Recall or gather information from sources to answer a question | 1 | 🕵️ Answer Hunt | To answer a question, pick the right place to look. Then find the answer there. |
| `L.2.1-1` Use collective nouns (group) | 2 | 🐺 Group Names | Some words name a whole group at once. A team is many players. A flock is many birds. |
| `L.2.1-2` Form irregular plural nouns (feet, children, teeth) | 2 | 🦷 Odd Plurals | Most words add s to mean more than one. A few change in their own special way. |
| `L.2.1-3` Use reflexive pronouns (myself, ourselves) | 2 | 🪞 By Myself | Words like myself and themselves point back to the person doing the action. |
| `L.2.1-4` Form past tense of irregular verbs (sat, hid, told) | 2 | 🕰️ Yesterday Machine | The machine sends action words back to yesterday. Some take -ed. Some change shape. |
| `L.2.1-5` Choose adjectives or adverbs correctly | 2 | 🐆 Quick or Quickly? | Adjectives describe things. Adverbs describe how something is done, and many end in -ly. |
| `L.2.1-6` Write and expand simple and compound sentences | 2 | 🐕 Stretch the Sentence | A short sentence can grow. Add words that tell which one, how, where and when. |
| `L.2.2-1` Capitalize holidays, product names, geographic names | 2 | 🗽 Capital Places and Days | Special names get capital letters: holidays, places on the map, and the names of products. |
| `L.2.2-2` Use commas in greetings and closings of letters | 2 | 💌 Letter Commas | A friendly letter has a comma after the greeting and a comma after the closing. |
| `L.2.2-3` Use apostrophes for contractions and possessives | 2 | ✒️ Apostrophe Spot | An apostrophe does two jobs. It takes the place of missing letters, and it shows who owns something. |
| `L.2.2-4` Generalize spelling patterns (cage to badge, boy to boil) | 2 | 🧩 Spelling Patterns | Spelling follows patterns. After a short vowel the j sound is dge. The oi sound is oy at the end of a word. |
| `L.2.2-5` Check spellings with beginning dictionaries | 2 | 📔 Dictionary Check | When you are not sure how to spell a word, look it up. A dictionary lists words in ABC order. |
| `L.2.3-1` Compare formal and informal uses of English | 2 | 🎩 Formal or Casual? | You talk one way to a friend and another way to a teacher or in a letter. Both are fine in the right place. |
| `L.2.4-1` Use sentence context as a clue | 2 | 🥾 Narrow Path Clues | The words around a new word explain it. Read the whole sentence and look for the clue. |
| `L.2.4-2` Use prefixes to find meaning (happy/unhappy) | 2 | 🔋 Prefix Power | A prefix is a small part at the front of a word. It changes the meaning in the same way every time. |
| `L.2.4-3` Use a known root to find meaning of an unknown word (addition/additional) | 2 | 🌱 Find the Root | A big word often has a smaller word you know hiding inside it. That root word is a clue. |
| `L.2.4-4` Use parts of compound words (birdhouse) | 2 | 🏠 Compound Word Maker | Two small words can join to make one new word. A house for a bird is a birdhouse. |
| `L.2.4-5` Use glossaries and dictionaries | 2 | 📒 Glossary Lookup | A glossary at the back of a book lists special words and what they mean. Look a word up when you are not sure. |
| `L.2.5-1` Connect words to real-life use (foods that are spicy) | 2 | 🌶️ Spicy and Juicy | Describing words fit some things and not others. Link each word to real foods you know. |
| `L.2.5-2` Tell shades of meaning (toss, throw, hurl; thin, slender, skinny) | 2 | ⚾ Toss, Throw, Hurl | Toss, throw and hurl all mean to send something through the air, but each one is stronger than the last. |
| `L.2.6-1` Use words learned from reading, including adjectives and adverbs to describe | 2 | 🎬 Stronger Word Swap | Good and nice are tired words. Swap them for words that say exactly what you mean. |
| `RF.2.3-1` Tell long and short vowels in regularly spelled one-syllable words | 2 | 🌲 Long or Short? | A vowel can be short, like the i in pin, or long, like the i in pine. Spelling gives you the clue. |
| `RF.2.3-2` Know spelling-sound patterns for common vowel teams | 2 | ⛵ Vowel Teams | Two vowels can team up to make one long sound. Drop the right middle into each word. |
| `RF.2.3-3` Decode regularly spelled two-syllable words with long vowels | 2 | 🐯 Open Syllable Snap | In words like tiger, the first part ends with a vowel that says its name. Snap the two parts together. |
| `RF.2.3-4` Decode words with common prefixes and suffixes | 2 | 🧱 Front and Back Parts | Many long words are a base word with a part added to the front or the back. Read every part. |
| `RF.2.3-5` Read words with inconsistent spelling-sound patterns | 2 | 🍞 Same Letters, Two Sounds | The letters ea do not always sound the same. In bread they say eh. In bead they say ee. |
| `RF.2.3-6` Read irregular grade-level words | 2 | 🦹 Rule Breaker Words | Some words break the spelling rules. You have to know them by heart. |
| `RF.2.4-1` Read grade-level text with purpose and understanding | 2 | 🦫 Read, Then Tell | Reading fast is not the goal. Read so that you can tell what the text was mostly about. |
| `RF.2.4-2` Read aloud with accuracy, rate, and expression | 2 | 🍨 Scoop the Phrases | Smooth readers do not read one word at a time. They scoop words into groups that belong together. |
| `RF.2.4-3` Self-correct using context and rereading | 2 | 🐎 Fix-Up Reader | Good readers listen to themselves. When a sentence does not make sense, they go back and fix the word. |
| `RI.2.1-1` Answer questions about key details in a text | 2 | 🐝 Bee Article Answers | An article gives real information. The answers to questions about it are in the text. |
| `RI.2.10-1` Read informational texts in the grades 2-3 band with support | 2 | 🌋 Science Book Section | A section of a science book packs in a lot. Read it with care, then check what it really said. |
| `RI.2.2-1` Identify the main topic of a multi-paragraph text | 2 | 🧭 Main Topic Finder | An article has many sentences but one main topic. The topic is what all the parts are about. |
| `RI.2.2-2` Identify the focus of specific paragraphs | 2 | 🧩 What Is This Paragraph About? | Each paragraph in an article has its own job. Each one is mostly about one thing. |
| `RI.2.3-1` Describe connections among historical events, scientific ideas, or steps in a procedure | 2 | 🌰 Steps in Order | Some texts tell how to do something. The steps only work when they are in the right order. |
| `RI.2.4-1` Determine meanings of words and phrases relevant to a grade 2 topic | 2 | 🌸 Topic Word Meanings | Science and social studies texts use special words. The text itself usually explains them. |
| `RI.2.5-1` Use captions, bold print, subheadings, glossaries, indexes, menus, icons | 2 | 📖 Book Tools | A fact book has tools that find things fast. Send each question to the tool that answers it. |
| `RI.2.6-1` Identify the main purpose of a text: what the author wants to answer, explain, or describe | 2 | ✍️ Why Did the Author Write It? | Every author writes for a reason: to answer a question, to explain how something works, or to describe something. |
| `RI.2.7-1` Explain how images (a diagram of a machine) clarify the text | 2 | ⚙️ What the Diagram Adds | A diagram shows what words alone cannot. It lets you see the parts and where they are. |
| `RI.2.8-1` Describe how reasons support specific points the author makes | 2 | 🧲 Reasons That Fit | An author makes a point and gives reasons for it. A good reason matches the point. |
| `RI.2.9-1` Compare the most important points of two texts on the same topic | 2 | 🍯 Two Bee Texts | Two texts on the same topic share some big points. Each also has a point of its own. |
| `RL.2.1-1` Answer who, what, where, when, why, and how questions about key details | 2 | 🗝️ Six Question Words | Who, what, where, when, why and how each ask for a different kind of answer. A why question needs a reason. |
| `RL.2.10-1` Read literature in the grades 2-3 complexity band with support | 2 | 📖 Chapter Book Page | Chapter books have longer pages with more to think about. Read a page and show you understood it. |
| `RL.2.2-1` Recount fables and folktales from diverse cultures | 2 | 🦁 Lion and Mouse | Fables are short tales that teach a lesson. Retell one by putting its key events in order. |
| `RL.2.2-2` Determine the central message, lesson, or moral | 2 | 🪨 Story Stones | Each old tale ends at a stone. Carve the lesson the story teaches, not just what happened. |
| `RL.2.3-1` Describe how characters respond to major events and challenges | 2 | ⛈️ How Did They React? | When something big happens in a story, watch what the character does next. That shows who they are. |
| `RL.2.4-1` Describe how beats, rhyme, repeated lines, and alliteration add meaning | 2 | 🥁 Sound of a Poem | Poets choose words for how they sound. Rhyme, a steady beat, and repeated sounds make a poem feel like music. |
| `RL.2.5-1` Describe how the beginning introduces and the ending concludes the action | 2 | 🎬 Beginning and Ending Jobs | A story has a shape. The beginning sets things up. The ending wraps things up. |
| `RL.2.6-1` Notice characters' different points of view and use voices when reading dialogue | 2 | 🐺 Two Points of View | Two characters can see the same thing in different ways. Each one has a point of view. |
| `RL.2.7-1` Use information from pictures and words to understand characters, setting, or plot | 2 | 🏕️ Words Plus Picture | The words tell part of the story and the picture tells another part. Put them together. |
| `RL.2.9-1` Compare two or more versions of the same story (Cinderella from different cultures) | 2 | 👠 Two Cinderellas | The same story is told in many lands. Each telling keeps some parts and changes others. |
| `W.2.1-1` Introduce the topic and state an opinion | 2 | 📣 Say What You Think | Opinion writing starts by naming the topic and saying clearly what you think about it. |
| `W.2.1-2` Give reasons and use linking words (because, and, also) | 2 | 🔗 Because and Also | One reason is a start. Two reasons are stronger. Words like because and also link them together. |
| `W.2.1-3` Provide a concluding statement | 2 | 🍔 Opinion Burger | Stack an opinion burger: the opinion first, reasons in the middle, and an ending to hold it together. |
| `W.2.2-1` Introduce a topic and use facts and definitions to develop points | 2 | 🐧 Stay on the Topic | Informative writing introduces a topic, then gives facts about that topic. Facts about other things do not belong. |
| `W.2.2-2` Provide a concluding statement | 2 | 🔚 Closing Sentence | Informative writing ends with a sentence that wraps up the topic. It should not add a brand new fact. |
| `W.2.3-1` Recount a well-elaborated event or short sequence | 2 | 🎁 And Then, And Then | A story that only says and then, and then is flat. Details let the reader see what happened. |
| `W.2.3-2` Include actions, thoughts, and feelings | 2 | 💭 Act, Think, Feel | Strong stories tell what the character did, what they thought, and how they felt. |
| `W.2.3-3` Use time words and provide closure | 2 | ⏰ Time Words and The End | Time words guide the reader through a story. The last one leads to the ending. |
| `W.2.5-1` Strengthen writing by revising and editing with feedback | 2 | 🛠️ Revise and Edit | Revising makes your ideas better. Editing fixes spelling, capitals and end marks. Just copying it neatly does neither. |
| `W.2.6-1` Use digital tools to produce and publish writing with peers | 2 | ⌨️ Typing Tools | A computer has tools that help writers fix and share their work. Know which tool does which job. |
| `W.2.7-1` Take part in shared research (read books on one topic to write a report) | 2 | 🌋 In Your Own Words | A report tells what you learned in your own words. Copying a sentence straight from the book is not your writing. |
| `W.2.8-1` Recall or gather information from sources to answer a question | 2 | 🔎 Source and Answer | A research question needs the right source. Then the answer you write has to match the question. |
| `L.3.1-1` Explain the function of nouns, pronouns, verbs, adjectives, adverbs | 3 | 🧑‍🔧 Word Jobs | Every word in a sentence has a job. Nouns name, verbs do, adjectives describe nouns, and adverbs describe verbs. |
| `L.3.1-2` Form and use regular and irregular plural nouns | 3 | ⚡ Twin Ray Zoo | The twin ray turns one into two! Fix each sign so it names two, then zap. |
| `L.3.1-3` Form and use simple verb tenses (walked, walk, will walk) | 3 | 🕰️ Tense Time Machine | A verb can travel in time. Past tells what already happened, present what happens now, and future what will happen. |
| `L.3.1-4` Ensure subject-verb and pronoun-antecedent agreement | 3 | 🤝 Make Them Agree | A subject and its verb have to match. One dog runs. Two dogs run. |
| `L.3.1-5` Form and use comparative and superlative adjectives and adverbs | 3 | 🦒 Tall, Taller, Tallest | To compare two things add -er. To compare three or more add -est. Long words use more and most instead. |
| `L.3.1-6` Write simple, compound, and complex sentences | 3 | 🧩 Sentence Joiner | Two short sentences can be joined into one. Words like because, when and although do the joining. |
| `L.3.2-1` Capitalize words in titles | 3 | 🎩 Title Capitals | In a title, the first word, the last word and all the important words get capitals. Little words like in, the and of do not. |
| `L.3.2-2` Use commas in addresses | 3 | 📬 Address Commas | In an address, a comma goes after the street and after the city. |
| `L.3.2-3` Use commas and quotation marks in dialogue | 3 | 🗨️ Quotation Marks | The exact words someone says go inside quotation marks. The end mark goes inside too. |
| `L.3.2-4` Form and use possessives | 3 | 🦴 Who Owns It? | An apostrophe shows ownership. One owner gets ’s. More than one owner ending in s gets the apostrophe after the s. |
| `L.3.2-5` Use conventional spelling for high-frequency words and added suffixes (sitting, smiled) | 3 | 🏃 Adding Endings | Adding -ing or -ed can change the base word. Some double the last letter, some drop an e, some change y to i. |
| `L.3.2-6` Consult dictionaries to check spelling | 3 | 📖 Guide Word Check | A dictionary page has two guide words at its head. Every word on that page falls between them in ABC order. |
| `L.3.3-1` Choose words and phrases for effect | 3 | 🐕 Vivid Verb Swap | Went is a tired verb. Dashed, crept and wandered each show a different picture. |
| `L.3.3-2` Recognize spoken vs written standard English | 3 | 🦈 Talking or Writing? | We talk one way with friends and write another way for a school report. A report uses complete, clear sentences. |
| `L.3.4-1` Use sentence context as a clue | 3 | 🏺 Fragile Vase Clues | When you meet a new word, the sentence around it often explains it. Hunt for the clue. |
| `L.3.4-2` Use known affixes (agreeable/disagreeable) | 3 | 🧷 Front and Back Clues | Parts added to the front or back of a word change its meaning. Dis- means not. -less means without. -ful means full of. |
| `L.3.4-3` Use known root words (company/companion) | 3 | 🌳 Shared Roots | Words that share a root are like cousins. Knowing one helps you work out the other. |
| `L.3.4-4` Use glossaries and dictionaries | 3 | 🦉 Dictionary Entry | A dictionary entry tells what a word means. Some words have more than one meaning listed. |
| `L.3.5-1` Tell literal and nonliteral meanings (take steps) | 3 | 🪜 Literal or Not? | Literal words mean exactly what they say. Nonliteral words mean something else. Take steps can mean climb, or it can mean act. |
| `L.3.5-2` Connect words to real-life use (people who are friendly) | 3 | 🧑‍🚒 Helpful People | A describing word fits real people when their actions show it. Link the word to what people do. |
| `L.3.5-3` Tell shades of meaning among related words (knew, believed, suspected) | 3 | 🔮 How Sure Are You? | Suspected, believed and knew all describe a state of mind, but each one is more certain than the last. |
| `L.3.6-1` Use grade-appropriate academic words, including spatial and time relationships (after dinner that night) | 3 | 🌠 When and Where Phrases | Phrases like after dinner that night and across the field tell exactly when or where. They beat vague words like then. |
| `RF.3.3-1` Know meanings of common prefixes and derivational suffixes | 3 | 🤖 Robot Orders | Robo does exactly what the word says. Snap on a word part to make the right order. |
| `RF.3.3-2` Decode words with common Latin suffixes (-able, -ment) | 3 | 🚉 Suffix Station | Endings like -able, -ment, -tion and -ible come from Latin. Read the base word, then add the ending. |
| `RF.3.3-3` Decode multisyllable words | 3 | 🏗️ Long Word Builder | A long word is easy when you take it one syllable at a time. Do not skip the middle. |
| `RF.3.3-4` Read irregularly spelled grade-level words | 3 | 🏝️ Words That Do Not Play Fair | Though, through, enough and island do not sound the way they are spelled. Know them on sight. |
| `RF.3.4-1` Read grade-level text with purpose and understanding | 3 | 🦊 Read and Retell | Reading well means you can tell someone the key points afterward, in your own words. |
| `RF.3.4-2` Read prose and poetry aloud with accuracy, rate, and expression | 3 | 🎙️ Punctuation Voice | Punctuation is a set of signals for your voice. Commas mean a short pause. Dashes and marks change the feeling. |
| `RF.3.4-3` Self-correct using context and rereading | 3 | 🏜️ Desert or Dessert? | Some words look almost alike but mean very different things. If the sentence stops making sense, look again. |
| `RI.3.1-1` Ask and answer questions referring explicitly to the text | 3 | 🌍 Prove It From the Article | When you answer a question about an article, find the exact sentence that gives the answer. |
| `RI.3.10-1` Read informational texts at the high end of the grades 2-3 band independently | 3 | 🐙 Article on Your Own | Read a short article by yourself. Then say its main idea in one sentence. |
| `RI.3.2-1` Determine the main idea | 3 | ⛰️ Main Idea Mountain | The main idea sits on top like a mountain peak. All the details are the slopes that hold it up. |
| `RI.3.2-2` Recount key details and explain how they support the main idea | 3 | 🏛️ Details That Hold It Up | Key details are like pillars under a roof. Each one helps hold up the main idea. |
| `RI.3.3-1` Describe relationships between events, ideas, or steps using time, sequence, cause and effect words | 3 | 🧪 Domino Lab | Line up the event cards so each one makes the next one happen. Then tip the first. |
| `RI.3.4-1` Determine meanings of general academic and domain-specific words | 3 | 🦎 Science Word Meanings | Science words can look like everyday words but mean something special. The text tells you which meaning. |
| `RI.3.5-1` Use text features and search tools (key words, sidebars, hyperlinks) to find information | 3 | 🛰️ Scan, Do Not Read It All | To find one fact quickly, use the tools on the page: headings, sidebars, key words and links. |
| `RI.3.6-1` Distinguish their own point of view from the author's | 3 | 🦓 Author View, My View | Authors have opinions about their topics. You can understand what the author thinks and still think something else. |
| `RI.3.7-1` Use maps, photos, and diagrams along with the words to show understanding | 3 | 🦋 Map and Words Together | An article gives some facts in words and others in a map, photo or diagram. You need both. |
| `RI.3.8-1` Describe connections between sentences and paragraphs (comparison, cause/effect, first/second/third) | 3 | 🔗 How the Sentences Connect | Sentences in a text are linked. Signal words tell you how: in order, by cause, or by comparing. |
| `RI.3.9-1` Compare and contrast the most important points and details of two texts on the same topic | 3 | 🗞️ Big Points in Two Articles | Two articles on one topic share big points. Compare the big points, not the tiny details. |
| `RL.3.1-1` Ask and answer questions, referring explicitly to the text | 3 | 👉 Show Me Where It Says | A good answer comes with proof. Point to the sentence in the story that shows your answer is right. |
| `RL.3.1-2` Tell the difference between what the text says and what they think | 3 | 🚪 Text Says or I Think | Some things are written right in the story. Other things are your own ideas about it. Keep the two apart. |
| `RL.3.10-1` Read literature at the high end of the grades 2-3 band independently | 3 | 🏔️ Chapter Summary | After reading a chapter on your own, sum it up in a sentence or two. A summary is short and covers the whole thing. |
| `RL.3.2-1` Recount fables, folktales, and myths | 3 | ☀️ Myth in Five Sentences | A myth is an old story that explains something. Recount one with just its key events, in order. |
| `RL.3.2-2` Determine the central message and explain how key details convey it | 3 | 🐢 Message and Proof | The central message is the big idea of a story. The key details in the story are what prove it. |
| `RL.3.3-1` Describe characters' traits, motivations, and feelings | 3 | 🎻 Trait, Want, Feeling | To understand a character, ask three things: what are they like, what do they want, and how do they feel? |
| `RL.3.3-2` Explain how characters' actions drive events | 3 | ⛓️ Choice and Chain | What a character chooses to do sets off what happens next, like the first link in a chain. |
| `RL.3.4-1` Determine meanings of words and phrases in a text | 3 | 🍰 Piece of Cake | Stories use phrases that do not mean what the words say. A piece of cake can mean something easy. |
| `RL.3.4-2` Tell literal from nonliteral language | 3 | 🧞 Genie Sayings | The genie takes every word for real. Keep the sayings out of the lamp! |
| `RL.3.5-1` Use terms like chapter, scene, stanza | 3 | 📚 Chapter, Scene, Stanza | Books, plays and poems each have their own name for a part. Use the right word for each. |
| `RL.3.5-2` Describe how each part builds on earlier parts | 3 | 🧗 Parts That Build | Each chapter stands on the one before it. What happened earlier explains what happens later. |
| `RL.3.6-1` Distinguish their own point of view from the narrator's or characters' | 3 | 👓 My View, Their View | The narrator has feelings about what happens. You are allowed to feel differently. Know which view is whose. |
| `RL.3.7-1` Explain how illustrations contribute to mood or emphasize aspects of a character or setting | 3 | 🕯️ Picture Sets the Mood | An illustration adds feeling to a story. Dark colors, bright sun or a tiny figure all change the mood. |
| `RL.3.9-1` Compare themes, settings, and plots of stories by the same author about the same characters | 3 | 🕵️ Same Author, Two Books | An author may write many books about the same characters. The stories share some things and change others. |
| `W.3.1-1` Introduce the topic, state an opinion, organize reasons | 3 | 📐 Opinion Blueprint | An opinion paragraph has a plan: say your opinion, give your reasons in order, then close. |
| `W.3.1-2` Provide reasons that support the opinion | 3 | 🏗️ Reasons That Support | A reason only helps if it backs up your opinion. A fact about something else does not count. |
| `W.3.1-3` Use linking words (because, therefore, since) | 3 | 🌉 Bridge Words | Two ideas stand on two cliffs. Lay down the linking word that joins them. |
| `W.3.1-4` Provide a concluding statement | 3 | 🎁 Wrap Up the Opinion | A concluding statement ties the paragraph together. It reminds the reader of your opinion in fresh words. |
| `W.3.2-1` Introduce a topic and group related information | 3 | 🗂️ Group the Facts | Good informative writing keeps facts that go together in the same paragraph. |
| `W.3.2-2` Develop with facts, definitions, details | 3 | 🧱 Facts, Definitions, Details | Build your topic with facts, definitions and details. Leave your own opinions out of it. |
| `W.3.2-3` Use linking words (also, another, but) | 3 | 🌉 Linking Word Bridge | Linking words join your ideas. Also adds, another adds one more, but shows a difference. |
| `W.3.2-4` Provide a conclusion | 3 | 🏁 Informative Ending | An informative piece should not just stop. End with a sentence that sums up what the reader learned. |
| `W.3.3-1` Establish a situation and narrator or characters; order events naturally | 3 | 🎭 Set the Scene | A story should not start in the middle. First tell the reader who is there, where they are, and what is going on. |
| `W.3.3-2` Use dialogue and descriptions of actions, thoughts, feelings | 3 | 💬 Show It With Talk and Feeling | Stories come alive when characters talk, move, think and feel. |
| `W.3.3-3` Use time words to show order | 3 | ⏳ More Than Then | Then, then, then gets dull fast. Other time words show the order in a fresh way. |
| `W.3.3-4` Provide closure | 3 | 🌅 Better Than The End | Writing The End does not finish a story. A real ending shows how the problem turned out. |
| `W.3.4-1` Produce writing where development and organization fit the task and purpose | 3 | 🥪 Right Shape for the Job | Different jobs need different kinds of writing. Directions are steps. A story has events. An opinion has reasons. |
| `W.3.5-1` Develop and strengthen writing by planning, revising, and editing | 3 | 🧰 Plan, Revise, Edit | Writing happens in stages. Plan before you write. Revise to make the ideas better. Edit to fix the errors. |
| `W.3.6-1` Use technology to produce and publish writing; use keyboarding skills | 3 | ⌨️ Keyboard Skills | Typing your writing lets you fix and share it easily. Learn what the main keys and tools do. |
| `W.3.7-1` Conduct short research projects that build knowledge about a topic | 3 | 🍯 Two Source Research | Research means learning from more than one source and putting the facts together in your own report. |
| `W.3.8-1` Recall or gather information from print and digital sources; take brief notes and sort into categories | 3 | 🗒️ Short Notes, Sorted | Notes are short. Write just the key words, then sort your notes into groups. |
| `L.4.1-1` Use relative pronouns and adverbs (who, whose, where, why) | 4 | 🏅 Who, Whose, Where, Why | Little linking words add detail about a noun. Who is for people, which is for things, where for places, whose for owners. |
| `L.4.1-2` Form and use progressive verb tenses (I was walking) | 4 | 🌧️ Was Walking, Will Be Walking | Progressive verbs show an action that keeps going for a while: I was walking, I am walking, I will be walking. |
| `L.4.1-3` Use modal auxiliaries (can, may, must) | 4 | 🚦 Can, May, Must | Helper verbs change the meaning. Can is about ability. May is about permission. Must is about what is required. |
| `L.4.1-4` Order adjectives conventionally (a small red bag) | 4 | 🎈 Parade Banner | Every parade float needs a banner. Put its describing words in the order people say them. |
| `L.4.1-5` Write complete sentences; fix fragments and run-ons | 4 | 🧱 Fragment, Run-On, Complete | A complete sentence has a subject and a verb and one clear idea. A fragment is missing something. A run-on crams in too much. |
| `L.4.1-6` Use frequently confused words correctly (to, too, two; there, their) | 4 | 🏠 Sound-Alike Words | To, too and two sound the same. So do there, their and they’re. Each one has its own meaning. |
| `L.4.2-1` Use correct capitalization | 4 | 🗽 Capital or Not? | Proper nouns name one particular person, place or thing and get capitals. Common nouns like aunt, city and river do not, unless they are part of a name. |
| `L.4.2-2` Use commas and quotation marks for direct speech and quotations | 4 | 🗨️ Quote It Right | Quotation marks wrap the exact words a person said or a text states. A comma sets the quote apart. |
| `L.4.2-3` Use a comma before a coordinating conjunction in a compound sentence | 4 | 🪢 Comma Before the Joiner | When and, but, or or so joins two complete sentences, a comma goes right before it. |
| `L.4.2-4` Spell grade-appropriate words correctly | 4 | 🐝 Spell It Right | Some common words are easy to misspell if you go by sound. Train your eye to pick the correct one. |
| `L.4.3-1` Choose words and phrases to convey ideas precisely | 4 | 🐆 Say It Precisely | The animal moved quickly could be anything. The cheetah sprinted puts a clear picture in the mind. |
| `L.4.3-2` Choose punctuation for effect | 4 | ❗ Punctuation for Effect | Punctuation changes how a sentence feels. Used with care, each mark has its own effect. Used too often, it loses its power. |
| `L.4.3-3` Tell when formal vs informal English fits | 4 | 🎤 Formal or Informal Moment? | Some moments call for formal English, like a presentation. Others, like chatting in a small group, can be casual. |
| `L.4.4-1` Use context (definitions, examples, restatements) as a clue | 4 | 🦇 Three Kinds of Clues | Writers leave clues to hard words: a definition, an example, or a restatement in simpler words. |
| `L.4.4-2` Use Greek and Latin affixes and roots (telegraph, autograph) | 4 | 📡 Greek and Latin Parts | Many English words are built from Greek and Latin parts. Tele means far. Graph means write. Auto means self. |
| `L.4.4-3` Use print and digital references for meaning and pronunciation | 4 | ⏱️ Pick the Right Entry | A dictionary may list several meanings, and even two ways to say a word. Choose the one that fits your sentence. |
| `L.4.5-1` Explain simple similes and metaphors | 4 | ☀️ Simile and Metaphor | A simile compares with like or as. A metaphor says one thing IS another. Neither one is meant literally. |
| `L.4.5-2` Explain common idioms, adages, proverbs | 4 | 🪙 Wise Old Sayings | Idioms, adages and proverbs are well-known sayings. They pack a piece of advice into a few words. |
| `L.4.5-3` Use antonyms and synonyms to understand words | 4 | 🔁 Same and Opposite | A synonym means nearly the same. An antonym means the opposite. Both help you understand a word. |
| `L.4.6-1` Use grade-appropriate academic words, including precise actions, emotions, states (quizzed, whined) | 4 | 🗯️ Beyond Said and Went | Said and went are plain. Words like quizzed, whined and stammered show exactly how someone spoke or felt. |
| `RF.4.3-1` Use letter-sound patterns, syllables, and morphology to read unfamiliar multisyllable words | 4 | 🚀 Word Rocket | A long word is a three stage rocket. Load the chunks in order to match the mission. |
| `RF.4.4-1` Read grade-level text with purpose and understanding | 4 | 🐢 Summary in a Sentence | If you understood a passage, you can sum it up. A summary is short and covers the whole thing. |
| `RF.4.4-2` Read aloud with accuracy, rate, and expression | 4 | 🚦 Marks Are Voice Signals | Punctuation tells a reader when to pause, stop, rise or add feeling. Skilled readers follow the signals. |
| `RF.4.4-3` Self-correct using context and rereading | 4 | 🔧 Reread and Repair | Every reader slips on a word now and then. What matters is noticing, going back, and fixing it. |
| `RI.4.1-1` Refer to details and examples when explaining and inferring | 4 | 🏘️ Infer With Evidence | In nonfiction too, some conclusions are not stated. Draw them from details in the text. |
| `RI.4.10-1` Read informational texts in the grades 4-5 band with support | 4 | 🧠 Dense Article Main Idea | Some articles pack a lot into each sentence. Slow down, then say the main idea in your own words. |
| `RI.4.2-1` Determine the main idea and explain how key details support it | 4 | 🪑 Table Top | Build a table from fact cards. The main idea is the top and the details are its legs. |
| `RI.4.2-2` Summarize the text | 4 | 🗞️ Own Words Summary | A summary is short, covers the main points and is written in your own words. Copying a sentence is not summarizing. |
| `RI.4.3-1` Explain what happened and why, based on specific information in the text | 4 | 🌪️ What and Why | A good explanation tells what happened and also why. The why is found in the text. |
| `RI.4.4-1` Determine meanings of general academic and domain-specific words | 4 | 🏞️ Technical Words | Do not skip a technical word. The text usually defines it right there, set off by commas or the word or. |
| `RI.4.5-1` Describe the structure: chronology, comparison, cause/effect, problem/solution | 4 | 🏗️ How Is It Built? | Nonfiction is organized in patterns: in time order, by comparing, by cause and effect, or by a problem and its solution. |
| `RI.4.6-1` Compare firsthand and secondhand accounts of the same event | 4 | 📔 Were They There? | A firsthand account is by someone who was there. A secondhand account is by someone who learned about it later. |
| `RI.4.7-1` Interpret information from charts, graphs, diagrams, timelines and explain how it adds to the text | 4 | 📊 Read the Graphic | Charts, graphs and timelines carry facts the paragraphs leave out. Read them as carefully as the words. |
| `RI.4.8-1` Explain how an author uses reasons and evidence to support points | 4 | ♻️ Point and Evidence | Authors back up each point with reasons and evidence. Link each piece of evidence to the point it supports. |
| `RI.4.9-1` Integrate information from two texts on the same topic to write or speak knowledgeably | 4 | 🧩 Combine Two Sources | To know a topic well, put together what two texts say. The best statements use information from both. |
| `RL.4.1-1` Refer to details and examples when explaining what the text says | 4 | 🔍 Detail Detective | When you explain what a story says, back it up with a detail or example from the text. |
| `RL.4.1-2` Make inferences supported by the text | 4 | 📦 Read Between the Lines | Authors do not say everything outright. An inference is a smart conclusion you draw from clues in the text. |
| `RL.4.10-1` Read literature in the grades 4-5 band with support at the high end | 4 | 📘 Novel Chapter | A chapter from a novel has more going on. Track who wants what and what changes by the end. |
| `RL.4.2-1` Determine a theme from details in the text | 4 | 🧵 Topic or Theme? | A topic is one word, like friendship. A theme is a full message about it, like true friends stay loyal in hard times. |
| `RL.4.2-2` Summarize the text | 4 | ✂️ Four Sentence Summary | A summary keeps the main events and leaves out the small stuff. Cut until only the important parts remain. |
| `RL.4.3-1` Describe a character, setting, or event in depth using specific details (thoughts, words, actions) | 4 | 🎨 Describe in Depth | A deep description uses what a character thinks, says and does. A shallow one just says nice or mean. |
| `RL.4.4-1` Determine meanings of words, including those that allude to mythology (Herculean) | 4 | 🏛️ Myth Words | Some words come from old myths. Hercules was famously strong, so a Herculean task is one that takes great strength. |
| `RL.4.5-1` Explain differences between poems, drama, and prose | 4 | 🎭 Poem, Play or Prose | Poems, plays and stories are built differently. Each has its own parts. |
| `RL.4.5-2` Refer to structural elements when writing or speaking about a text | 4 | 🏷️ Use the Right Term | When you talk about a text, use the right word for its parts: stanza, verse, stage directions, scene, chapter. |
| `RL.4.6-1` Compare first- and third-person narrations | 4 | 🎥 Story Camera | Move the story camera inside a character or outside. Tap the words that have to change. |
| `RL.4.7-1` Connect the text of a story to a visual or oral presentation of it | 4 | 🎬 Book and Movie | A movie or play of a story keeps some things from the book and changes others. Notice which is which. |
| `RL.4.9-1` Compare similar themes and patterns of events in stories, myths, and traditional literature from different cultures | 4 | 🌏 Same Theme, Far Apart | Stories from different lands often share the same theme or the same pattern, like a quest or a clever trick. |
| `W.4.1-1` Introduce the topic, state an opinion, and organize ideas | 4 | 👔 Opinion Opening | A strong introduction names the topic, states your opinion, and hints at the reasons to come. |
| `W.4.1-2` Provide reasons supported by facts and details | 4 | 🔍 Proof Please | The inspector stamps only reasons that come with proof. Put a fact under each reason. |
| `W.4.1-3` Link opinion and reasons with words (for instance, in addition) | 4 | 🔗 Link Opinion to Reasons | Linking phrases guide a reader from your opinion to each reason: for instance, in addition, in order to. |
| `W.4.1-4` Provide a related conclusion | 4 | 🎯 Conclusion That Fits | A conclusion ties back to your opinion. It is not the place for a brand new idea. |
| `W.4.2-1` Introduce a topic and group information in paragraphs and sections | 4 | 🗂️ Sections and Paragraphs | Long informative writing is split into paragraphs and sections. Each one holds information on one part of the topic. |
| `W.4.2-2` Develop with facts, definitions, details, quotations, examples | 4 | 🦈 Fill Out the Paragraph | A thin paragraph just names a topic. A full one has a fact, a definition, an example, maybe even a quotation. |
| `W.4.2-3` Link ideas with words (another, for example, because) | 4 | 🧲 Idea Connectors | Words like another, for example, also and because connect one idea to the next within a topic. |
| `W.4.2-4` Use precise language and domain-specific vocabulary | 4 | 🎯 Precise Word Swap | Stuff, things and a lot are vague. Informative writing uses exact words and the special vocabulary of the topic. |
| `W.4.2-5` Provide a conclusion | 4 | 🔚 Informative Conclusion | End an informative piece with a statement that follows from what you explained. |
| `W.4.3-1` Orient the reader with a situation, narrator, and characters | 4 | 🧭 Orient the Reader | The opening of a story orients the reader: who is telling it, who is in it, and what situation they are in. |
| `W.4.3-2` Use dialogue and description to develop events | 4 | 🎥 Show, Do Not Tell | Telling says she was scared. Showing lets the reader see it: her hands shook and she whispered, "Who is there?" |
| `W.4.3-3` Use transitional words to manage sequence | 4 | 🚌 Smooth Transitions | Transition words carry the reader from one moment to the next so the story does not feel choppy. |
| `W.4.3-4` Use concrete words and sensory details | 4 | 🍳 Five Senses Kitchen | Sensory details tell what something looked, sounded, smelled, tasted or felt like. They make writing real. |
| `W.4.3-5` Provide a conclusion that follows from events | 4 | 🏆 Earned Ending | An ending should grow out of what happened in the story. A rushed ending just stops or solves everything by magic. |
| `W.4.4-1` Produce clear and coherent writing appropriate to task, purpose, audience | 4 | 📨 Who Is the Reader? | How you write depends on who will read it. A note to a friend and a letter to the principal sound different. |
| `W.4.5-1` Develop and strengthen writing through planning, revising, and editing | 4 | ✂️ Real Revision | Revising is more than fixing spelling. Add what is missing, cut what does not fit, and move what is out of place. |
| `W.4.6-1` Use technology to produce and publish; type one page in one sitting | 4 | ⌨️ One Page, One Sitting | Good typing habits help you finish a whole page without getting tired: home row, eyes on the screen, steady pace. |
| `W.4.7-1` Conduct short research projects investigating different aspects of a topic | 4 | 🗺️ Many Sides of a Topic | A research project looks at a topic from several sides. One source rarely covers them all. |
| `W.4.8-1` Take notes, categorize information, and list sources | 4 | 📝 Notes and Sources | Researchers take notes, sort them into categories, and write down where each fact came from. |
| `W.4.9-1` Draw evidence from literary or informational texts to support analysis | 4 | ⚖️ Evidence for Your Claim | When you write about a text, back up what you say with evidence from the text itself. |
| `L.5.1-1` Explain conjunctions, prepositions, and interjections | 5 | 🌉 Joiners, Placers, Shouters | Conjunctions join. Prepositions show where or when. Interjections burst out with feeling. |
| `L.5.1-2` Form and use perfect tenses (I had walked) | 5 | 🥾 Had, Have, Will Have | Perfect tenses show an action finished before another time: I had walked, I have walked, I will have walked. |
| `L.5.1-3` Use verb tense to show times, sequences, states | 5 | ⏱️ First This, Then That | Verb tense tells the reader what happened first. Had finished comes before went. |
| `L.5.1-4` Recognize and fix inappropriate shifts in verb tense | 5 | 🔧 Tense Shift Fixer | A story should stay in one tense. A verb that jumps to another tense for no reason is a shift. |
| `L.5.1-5` Use correlative conjunctions (either/or, neither/nor) | 5 | ⚖️ Either Or, Neither Nor | Some joining words come in pairs. Either goes with or. Neither goes with nor. |
| `L.5.2-1` Use punctuation to separate items in a series | 5 | 🛒 Comma Cart | The shopping robot buys exactly what the list says. Tap a word to put a comma after it. |
| `L.5.2-2` Use a comma after an introductory element | 5 | 🍕 Comma After the Intro | When a sentence opens with a phrase that sets the scene, a comma separates it from the main part. |
| `L.5.2-3` Use commas for yes/no, tag questions, direct address | 5 | 🙋 Yes, Friend, Right? | Commas set off yes and no, a name you are speaking to, and a little question tagged on the end. |
| `L.5.2-4` Use underlining, quotation marks, or italics for titles | 5 | 📕 Title Formatting | Long works like books and movies are underlined or put in italics. Short works like poems and songs go in quotation marks. |
| `L.5.2-5` Spell grade-appropriate words correctly | 5 | 👹 Spelling Demons | Necessary, separate, definitely and receive trip up almost everyone. Learn to spot the correct form. |
| `L.5.3-1` Expand, combine, and reduce sentences for meaning, interest, style | 5 | 🐕 Combine and Trim | Three short choppy sentences can become one smooth one. Combine ideas, then cut the words you do not need. |
| `L.5.3-2` Compare varieties of English in stories and poems | 5 | 🗣️ How Characters Talk | Authors sometimes write the way a character really speaks. Dialect and register show where someone is from and who they are. |
| `L.5.4-1` Use context (cause/effect, comparisons) as a clue | 5 | 🧩 Contrast and Cause Clues | Words like unlike, but and because are clues. They show a new word is the opposite of, or the result of, something you know. |
| `L.5.4-2` Use Greek and Latin affixes and roots (photograph, photosynthesis) | 5 | 📸 Root Detectives | Words that share a Greek or Latin root share a piece of meaning. Photo means light, so a photograph is written with light. |
| `L.5.4-3` Use references for meaning and pronunciation | 5 | 🔊 Say It, Mean It | A dictionary shows how to say a word and lists its meanings. Check both, and pick the meaning that fits. |
| `L.5.5-1` Interpret figurative language, including similes and metaphors, in context | 5 | 🐝 Beehive Classroom | Figurative language says one thing and means another. A classroom called a beehive is busy, not full of bees. |
| `L.5.5-2` Explain idioms, adages, proverbs | 5 | 🐣 Chickens Before They Hatch | Proverbs and idioms carry advice passed down for generations. The words are a picture of the real meaning. |
| `L.5.5-3` Use synonyms, antonyms, homographs to understand words | 5 | 🎸 One Spelling, Two Words | Homographs are spelled the same but mean different things, like bass the fish and bass the low sound. |
| `L.5.6-1` Use grade-appropriate academic words, including words for contrast and addition (however, although, moreover) | 5 | 🔀 However, Although, Moreover | And and but are fine, but richer words say more. However and although show contrast. Moreover and in addition add. |
| `RF.5.3-1` Use letter-sound patterns, syllables, and morphology to read unfamiliar multisyllable words | 5 | 🥁 Word Drums | Every long word has a beat. Set the drum to the number of syllables and play it. |
| `RF.5.4-1` Read grade-level text with purpose and understanding | 5 | 🦅 Sum It Up | Understanding a passage means you can boil it down to its main points without losing the meaning. |
| `RF.5.4-2` Read aloud with accuracy, rate, and expression | 5 | 🐇 Right Speed Reader | Racing through the words is not good reading. Change your speed to fit the text so you can still understand it. |
| `RF.5.4-3` Self-correct using context and rereading | 5 | 🎣 Catch and Correct | If a sentence comes out strange, do not shrug and move on. Go back, look again, and make it make sense. |
| `RI.5.1-1` Quote accurately when explaining and inferring | 5 | 🏜️ Quote and Explain | A quote alone is not enough. After you quote the text, explain what it shows. |
| `RI.5.10-1` Read informational texts at the high end of grades 4-5 band independently | 5 | 🧬 Two Ideas From a Dense Text | Dense texts reward slow reading. Read on your own, then name the two big ideas. |
| `RI.5.2-1` Determine two or more main ideas and explain how details support them | 5 | ✌️ Two Main Ideas | A longer article can make more than one big point. Find both, and tell them from the details. |
| `RI.5.2-2` Summarize the text | 5 | ✂️ Trim to the Main Points | A summary keeps the main ideas and drops the minor details, the numbers and the side notes. |
| `RI.5.3-1` Explain relationships or interactions between two or more individuals, events, ideas, or concepts | 5 | 🤝 Linked Lives and Events | Nonfiction is full of relationships: one person builds on another’s work, one event leads to the next. |
| `RI.5.4-1` Determine meanings of general academic and domain-specific words | 5 | 🏛️ Social Studies Words | Subject words in history and science have exact meanings. The text usually gives the meaning right beside the word. |
| `RI.5.5-1` Compare the overall structure of events, ideas, or information in two or more texts | 5 | 🏗️ Compare the Structures | Two texts on the same topic can be organized in different ways. Name how each one is built. |
| `RI.5.6-1` Analyze multiple accounts of the same event, noting similarities and differences in point of view | 5 | 📰 Two Accounts, One Event | Two people can describe the same event very differently. Notice what they agree on and where their views split. |
| `RI.5.7-1` Draw on information from multiple print or digital sources to locate answers or solve problems | 5 | 🌉 Find It in Two Sources | One source may not hold the whole answer. Pull facts from two and put them together. |
| `RI.5.8-1` Explain how an author uses reasons and evidence, identifying which support which points | 5 | ⚖️ Debate Scales | An author made two points. Put each piece of evidence on the point it supports. |
| `RI.5.9-1` Integrate information from several texts on the same topic | 5 | 🌀 Blend Three Sources | A knowledgeable writer blends several sources into one explanation rather than reporting them one at a time. |
| `RL.5.1-1` Quote accurately from the text when explaining and inferring | 5 | ❝ Quote It Exactly | A quote uses the exact words from the text, inside quotation marks. Changing a word makes it a misquote. |
| `RL.5.10-1` Read literature at the high end of grades 4-5 band independently | 5 | 📗 Grade 5 Novel Page | Read a rich passage on your own. Notice what the character wants, what stands in the way, and what the mood is. |
| `RL.5.2-1` Determine a theme from how characters respond to challenges or how a speaker reflects | 5 | 🧗 Theme From the Struggle | How a character responds to a challenge reveals the theme. Watch what they learn or how they change. |
| `RL.5.2-2` Summarize the text | 5 | 📝 Summary, Not Review | A summary reports what happened. It leaves out what you thought of it. I loved it belongs in a review. |
| `RL.5.3-1` Compare and contrast two or more characters, settings, or events using specific details | 5 | ⚖️ Side by Side Characters | Comparing means looking at two characters together: where are they alike, and where do they differ? |
| `RL.5.4-1` Determine meanings of words and phrases, including metaphors and similes | 5 | 🤖 Plain Talk | Beep the robot takes every word for real. Hand Beep what each sentence really means. |
| `RL.5.5-1` Explain how chapters, scenes, or stanzas fit together to provide structure | 5 | 🧩 Why Is This Part Here? | Every chapter, scene or stanza has a job in the whole. Some set things up, some build tension, some resolve. |
| `RL.5.6-1` Describe how a narrator's or speaker's point of view influences how events are described | 5 | 🐺 Who Tells It Changes It | The same event sounds different depending on who tells it. A narrator’s point of view colors every detail. |
| `RL.5.7-1` Analyze how visual and multimedia elements add to meaning, tone, or beauty | 5 | 🖼️ What the Images Add | In a graphic novel or film, color, size and angle add meaning. They set a tone that words alone might not. |
| `RL.5.9-1` Compare how stories in the same genre approach similar themes and topics | 5 | 🔎 Same Genre, Same Theme | Two mysteries can explore the same theme in different ways. Compare how each one handles it. |
| `W.5.1-1` Introduce the topic, state an opinion, create a logical structure | 5 | ⏰ Logical Opening | An opinion essay opens by leading the reader in, stating a clear opinion, and laying out a logical plan. |
| `W.5.1-2` Provide logically ordered reasons supported by facts | 5 | 🧱 Reason Plus Fact | A reason is stronger when a fact backs it up. Match each reason to the fact that supports it. |
| `W.5.1-3` Link with words, phrases, clauses (consequently, specifically) | 5 | 🔗 Consequently, Specifically | Linking words show how ideas relate. Consequently shows a result. Specifically zooms in on an example. |
| `W.5.1-4` Provide a related conclusion | 5 | 🔒 Close the Argument | The conclusion of an opinion piece brings the reader back to your opinion and leaves them convinced. |
| `W.5.2-1` Introduce a topic with a clear focus and group information logically | 5 | 🔭 Clear Focus | Informative writing needs a clear focus. Everything in it should serve that focus and be grouped logically. |
| `W.5.2-2` Develop with facts, definitions, details, quotations, examples | 5 | 🦈 Develop With Evidence | Strong paragraphs are built from different kinds of support: facts, quotations and examples. |
| `W.5.2-3` Link ideas within and across categories (in contrast, especially) | 5 | 🚂 Idea Railway | Linking words are signals on the track. Couple the car that follows each signal. |
| `W.5.2-4` Use precise language and domain vocabulary | 5 | 🌿 Topic Vocabulary | Experts use exact words. Swap the roundabout phrase for the term a scientist or historian would use. |
| `W.5.2-5` Provide a conclusion | 5 | 🏁 Concluding Section | An informative essay ends with a section that follows from the explanation and leaves the reader with the key point. |
| `W.5.3-1` Orient the reader and organize events naturally | 5 | 🚪 Open and Unfold | A story opening orients the reader, then events unfold in an order that feels natural. |
| `W.5.3-2` Use dialogue, description, and pacing | 5 | 🎬 Slow the Big Moment | Pacing means how fast a story moves. Rush through the dull parts and slow down for the moment that matters. |
| `W.5.3-3` Use transitions to manage sequence | 5 | ⌛ Time Passing | Transitions tell the reader how much time has passed or where the scene has moved. |
| `W.5.3-4` Use concrete words and sensory details | 5 | 🕰️ Make the Old Room Real | The room was old tells almost nothing. Dust, creaks and a musty smell let the reader stand inside it. |
| `W.5.3-5` Provide a conclusion | 5 | 🌄 Ending That Follows | The ending should feel like the natural result of everything before it, not a sudden stop. |
| `W.5.4-1` Produce clear writing suited to task, purpose, and audience | 5 | 🎂 Lab Report or Birthday Card | A lab report and a birthday card should not sound alike. Task, purpose and audience shape how you write. |
| `W.5.5-1` Strengthen writing by planning, revising, editing, rewriting, or trying a new approach | 5 | 🔄 Try a New Approach | Sometimes the best fix is to start a part over in a completely different way, not just to polish it. |
| `W.5.6-1` Use technology to produce, publish, and collaborate; type two pages in one sitting | 5 | 💻 Type and Collaborate | Technology lets writers draft long pieces, get comments from others and publish their work. |
| `W.5.7-1` Conduct short research projects using several sources | 5 | 📚 Several Sources | Good research checks several sources. Each one adds something the others leave out. |
| `W.5.8-1` Summarize or paraphrase information in notes and finished work; list sources | 5 | 🔁 Paraphrase, Do Not Copy | Paraphrasing means saying the same idea in your own words and sentence shape. Changing one word is still copying. |
| `W.5.9-1` Draw evidence from texts to support analysis, reflection, research | 5 | 🧾 Evidence for Analysis | When you analyze a text, every claim needs proof from the text. Without evidence it is only an opinion. |
| `L.6.1-1` Use subjective, objective, possessive pronoun case | 6 | 🧍 He and I, Him and Me | Pronouns change form with their job. The doer uses I, he, she, we, they. The receiver uses me, him, her, us, them. |
| `L.6.1-2` Use intensive pronouns (myself, ourselves) | 6 | 🪞 Myself, Ourselves | Words like myself and ourselves add emphasis or point back to the doer. They cannot be the doer on their own. |
| `L.6.1-3` Fix shifts in pronoun number and person | 6 | 🔁 Keep the Same Person | If a sentence starts with you, it should stay with you. Jumping to they halfway through confuses the reader. |
| `L.6.1-4` Fix vague pronouns | 6 | ❓ Who Is He? | A pronoun must point clearly to one person or thing. If the reader has to guess, the sentence needs fixing. |
| `L.6.2-1` Use commas, parentheses, dashes for nonrestrictive elements | 6 | 🚧 Fence Off the Extra | Extra information that could be lifted out of a sentence gets a comma on each side, like a pair of fences. |
| `L.6.2-2` Spell correctly | 6 | 👹 Tricky Spelling Spots | Some words trip everyone up. A spell checker will not catch them all, so learn their tricky spots. |
| `L.6.3-1` Vary sentence patterns for meaning, interest, style | 6 | 🎼 Mix Up the Sentences | Writing where every sentence has the same shape sounds like a drum with one beat. Vary the length and the beginnings. |
| `L.6.3-2` Keep style and tone consistent | 6 | 🎙️ Keep One Voice | A formal report should sound formal all the way through. One slangy sentence breaks the spell. |
| `L.6.4-1` Use context as a clue | 6 | 🧭 Clues Around the Word | When a word is new, the sentence around it often explains it. Look at the words nearby. |
| `L.6.4-2` Use Greek or Latin affixes and roots (audience, auditory) | 6 | 🌿 Root Decoder | Many English words are built from Greek and Latin roots. Learn one root and you unlock a whole family of words. |
| `L.6.4-3` Use references for meaning and part of speech | 6 | 📚 Which Entry Fits? | A dictionary lists several meanings and parts of speech for one word. The sentence tells you which entry you need. |
| `L.6.5-1` Interpret figures of speech (personification) | 6 | 🌬️ When Things Act Human | Personification gives human actions to things that are not human. The wind cannot whisper, but saying so paints a picture. |
| `L.6.5-2` Use relationships between words (cause/effect, part/whole) | 6 | 🌉 Analogy Bridge | An analogy matches two pairs of words that are related in the same way: part to whole, cause to effect, or tool to user. |
| `L.6.5-3` Tell connotations of words with similar meanings (stingy, economical) | 6 | 🎭 Same Meaning, Different Feeling | Thrifty and stingy both mean careful with money. One is a compliment. The other is an insult. |
| `L.6.6-1` Acquire and use grade-appropriate academic and domain-specific words | 6 | 🎓 School Power Words | Some words show up in every subject: analyze, evidence, summarize. Knowing them unlocks directions and questions. |
| `RI.6.1-1` Cite evidence for explicit statements and inferences | 6 | 😴 Show Me the Evidence | In an article, the author makes claims. Good readers point to the exact sentences that back them up. |
| `RI.6.10-1` Read literary nonfiction in the grades 6-8 band with support | 6 | 🗞️ Article Check | A dense article rewards a careful read. Find the idea that every paragraph serves. |
| `RI.6.2-1` Determine a central idea and how details convey it | 6 | 🎯 Central Idea and Its Helpers | The central idea is the big point of an article. The details are the facts that hold it up. |
| `RI.6.2-2` Summarize without opinions | 6 | 📰 Summary, No Opinions | A summary of an article reports its ideas. What you think of them comes later, somewhere else. |
| `RI.6.3-1` Analyze how a key individual, event, or idea is introduced, illustrated, and elaborated | 6 | 🧰 How the Author Builds It | Authors introduce and develop a person or idea with tools: an anecdote, an example, a statistic, a comparison. |
| `RI.6.4-1` Determine figurative, connotative, and technical meanings of words | 6 | 🧫 Science Meanings | A familiar word can mean something new in a science or history article. Let the subject guide you. |
| `RI.6.5-1` Analyze how a sentence, paragraph, chapter, or section contributes to the ideas | 6 | 🗂️ Paragraph Jobs | Each paragraph in an article has a job: to introduce, give an example, show a cause, or wrap things up. |
| `RI.6.6-1` Determine the author's point of view or purpose and how it is conveyed | 6 | ✍️ Why Did They Write It? | The topic is what an article is about. The purpose is why the author wrote it: to inform, to persuade or to entertain. |
| `RI.6.7-1` Integrate information from different media or formats to build understanding | 6 | 📊 Chart Plus Article | Some answers are in the words. Some are in the chart. The full picture needs both. |
| `RI.6.8-1` Trace an argument and its specific claims | 6 | 🧵 Trace the Argument | An argument is built from claims: the statements the author wants you to accept. Find them first. |
| `RI.6.8-2` Tell supported claims from unsupported ones | 6 | 🧱 Backed Up or Bare? | Some claims come with reasons and evidence. Others are just said loudly. Readers should tell them apart. |
| `RI.6.9-1` Compare one author's presentation of events with another's | 6 | 🪞 Memoir or Biography | The same life can be told by the person who lived it or by someone looking in. Each stresses different things. |
| `RL.6.1-1` Cite evidence to support analysis of what the text says explicitly | 6 | 🔦 Cite the Line | A claim about a story needs proof from the story itself. Find the exact lines that show it. |
| `RL.6.1-2` Cite evidence for inferences | 6 | 🧩 Clue Collector | An inference is a smart guess the author never states. It only counts if clues in the text back it up. |
| `RL.6.10-1` Read literature in the grades 6-8 band with support at the high end | 6 | 📖 Chapter Check | Strong readers keep track of a longer passage as they go: who, what they want, what stands in the way. |
| `RL.6.2-1` Determine a theme and how it is conveyed through details | 6 | 💎 Theme in a Sentence | A topic is one word, like courage. A theme is what the story says about it, in a whole sentence. |
| `RL.6.2-2` Write a summary without personal opinions | 6 | ✂️ Just the Facts Summary | A summary retells what happened. It leaves your own opinions out. |
| `RL.6.3-1` Describe how a plot unfolds in episodes | 6 | 🎬 Episodes in Order | A plot unfolds in episodes. Each one pushes the story toward its resolution. |
| `RL.6.3-2` Describe how characters respond or change | 6 | 🦋 How They Change | Characters rarely end a story the way they began. Track who they were, and who they become. |
| `RL.6.4-1` Determine figurative and connotative meanings | 6 | 🏚️ What the Word Suggests | Authors choose words for the feelings they carry. A house that crouches is more than a small house. |
| `RL.6.4-2` Analyze how word choice affects meaning and tone | 6 | 🌫️ Words That Set the Tone | Tone is the feeling in the writing. You can point to the exact words that create it. |
| `RL.6.5-1` Analyze how a sentence, chapter, scene, or stanza fits the structure and develops theme, setting, or plot | 6 | 🧱 What Is This Part For? | Every sentence, scene and stanza has a job in the whole. Ask what the story would lose without it. |
| `RL.6.6-1` Explain how an author develops the narrator's or speaker's point of view | 6 | 👓 Through the Narrator | A narrator does not just report. Word choices reveal how the narrator feels about people and places. |
| `RL.6.7-1` Compare reading a text to listening to or viewing an audio, video, or live version | 6 | 🎞️ Page or Screen | Reading a scene and watching it are different experiences. Each one gives you something the other cannot. |
| `RL.6.9-1` Compare texts in different forms or genres on similar themes and topics | 6 | 🪁 Poem and Story | A poem and a story can share a theme and treat it in very different ways. |
| `W.6.1-1` Introduce claims and organize reasons and evidence clearly | 6 | 📣 Stake Your Claim | An argument starts with a claim: one clear sentence that takes a side. Reasons come next. |
| `W.6.1-2` Support claims with clear reasons and relevant evidence | 6 | 🧲 Evidence That Fits | Evidence has to prove the claim you made, not some other claim. Keep what fits. Cut what drifts. |
| `W.6.1-3` Use transitions to show relationships among claims and reasons | 6 | 🔗 Link the Reasons | Transitions show how ideas connect: this causes that, this is an example, this is the other side. |
| `W.6.1-4` Provide a concluding statement | 6 | 🏁 Land the Argument | A conclusion wraps up the argument. It restates the claim in fresh words and leaves the reader convinced. |
| `W.6.2-1` Introduce a topic and organize ideas (definition, comparison, cause/effect) | 6 | 🗂️ Pick the Structure | Informative writing needs a plan. The topic tells you which structure fits: definition, comparison or cause and effect. |
| `W.6.2-2` Develop with facts, definitions, details, quotations | 6 | 🧱 Fact, Definition, Quotation | Strong informative writing is built from different materials: facts, definitions and the words of experts. |
| `W.6.2-3` Use precise language and domain vocabulary | 6 | 🎯 The Exact Word | Experts use exact terms. Swap a vague phrase for the precise word and your writing sounds like you know the subject. |
| `W.6.2-4` Provide a conclusion | 6 | 🎀 Wrap Up the Report | An informative piece should end by pulling its ideas together, not by stopping or by starting something new. |
| `W.6.3-1` Engage the reader with context and point of view | 6 | 🪝 Hook the Reader | A story opening should drop the reader into a moment, with a voice and a hint of trouble. |
| `W.6.3-2` Use dialogue, pacing, description | 6 | 🎭 Show the Scene | Writers bring events to life with three tools: dialogue, description, and pacing that slows down or speeds up. |
| `W.6.3-3` Use precise words and sensory language | 6 | ⛈️ Sharpen the Storm | It was a bad storm tells the reader almost nothing. Precise words and sensory details let them feel it. |
| `W.6.3-4` Provide a conclusion that follows from events | 6 | 🌅 An Ending That Fits | A good ending grows out of what happened in the story. It should not pop up from nowhere. |
| `W.6.4-1` Produce writing with development, organization, and style suited to task, purpose, audience | 6 | 📱 Who Is Reading? | The same message sounds different in an email to a teacher and a text to a friend. Match the style to the reader. |
| `W.6.5-1` Strengthen writing by planning, revising, editing, rewriting | 6 | 🛠️ Revise or Edit? | Revising changes the ideas: what you say and in what order. Editing fixes the surface: spelling, commas, capitals. |
| `W.6.6-1` Use technology to produce, publish, and collaborate; type three pages in one sitting | 6 | ⌨️ Tools for Writers | Technology helps you draft, share and publish. Good typing habits let your fingers keep up with your ideas. |
| `W.6.7-1` Conduct short research to answer a question, drawing on several sources and refocusing as needed | 6 | 🔍 Narrow the Question | A research question should be small enough to answer and big enough to matter. Adjust it as you learn. |
| `W.6.8-1` Gather relevant information from multiple sources and assess credibility | 6 | 🕵️ Trust This Source? | Not every website deserves your trust. Ask who wrote it, how they know, and whether they are selling something. |
| `W.6.8-2` Quote or paraphrase and give basic bibliographic information | 6 | 🧾 Your Words, Their Credit | Using a source means putting its ideas in your own words, or quoting exactly, and always saying where it came from. |
| `W.6.9-1` Draw evidence from literary or informational texts to support analysis | 6 | 📌 Proof From the Page | When you write about a text, your points need proof from the text. Your own feelings are not evidence. |
| `L.7.1-1` Explain the function of phrases and clauses | 7 | 🧩 Clause or Phrase? | A clause has a subject and a verb. An independent clause can stand alone. A dependent clause leans on another. |
| `L.7.1-2` Choose simple, compound, complex, compound-complex sentences to show relationships | 7 | 🚂 Sentence Types Sorter | Simple, compound and complex sentences link ideas in different ways. Choosing the right one shows how the ideas relate. |
| `L.7.1-3` Place phrases and clauses to avoid misplaced and dangling modifiers | 7 | 🪝 Dangling Modifier Rescue | An opening phrase must describe the very next noun. If it does not, the sentence says something silly. |
| `L.7.2-1` Use a comma to separate coordinate adjectives (a fascinating, enjoyable movie) | 7 | ✒️ Comma Between Adjectives | When adjectives describe a noun equally, a comma separates them. Test it: could you say and between them? |
| `L.7.2-2` Spell correctly | 7 | 🔤 Spelling Under Pressure | Double letters and silent letters cause most spelling slips. Know which words have them. |
| `L.7.3-1` Choose language that expresses ideas precisely and concisely, removing redundancy | 7 | ✂️ Cut the Clutter | Extra words hide your point. Say it once, in the fewest words that keep the meaning. |
| `L.7.4-1` Use context as a clue | 7 | 🕵️ Context Detective | An unknown word is rarely alone. The sentence around it usually hints at its meaning. |
| `L.7.4-2` Use Greek or Latin affixes and roots (belligerent, bellicose) | 7 | 🌳 Roots That Reveal | A Latin or Greek root is a clue hiding inside a long word. Bell means war, so a belligerent person is ready to fight. |
| `L.7.4-3` Use references | 7 | 📖 Noun or Verb Entry? | Many words are both a noun and a verb, with different meanings and even different stress. The sentence tells you which. |
| `L.7.5-1` Interpret figures of speech (literary, biblical, mythological allusions) | 7 | 🏺 Allusion Decoder | An allusion is a quick reference to a famous story or event. Knowing the story unlocks the meaning. |
| `L.7.5-2` Use relationships between words (synonym/antonym, analogy) | 7 | ⚖️ Opposites and Twins | In an analogy, the second pair must match the first. If the first pair are opposites, so are the second. |
| `L.7.5-3` Distinguish connotations (refined, respectful, polite, diplomatic) | 7 | 🪜 Shades of Meaning Ladder | Words that mean almost the same thing differ in strength and feeling. Line them up from mildest to strongest. |
| `L.7.6-1` Acquire and use grade-appropriate academic and domain-specific words | 7 | 🧠 Words for Thinking | Infer, contrast, evaluate: these words name kinds of thinking. Use them and your writing sounds sure of itself. |
| `RI.7.1-1` Cite several pieces of evidence for explicit statements and inferences | 7 | 🧱 Stack the Evidence | An author’s conclusion stands on several pieces of evidence. Find all of them, not just the first. |
| `RI.7.10-1` Read literary nonfiction in the grades 6-8 band proficiently | 7 | 🗞️ Dense Article Check | A challenging article takes a slow, careful read. Look for the points the author keeps returning to. |
| `RI.7.2-1` Determine two or more central ideas and analyze their development | 7 | ✌️ Two Big Ideas | A longer article often makes two main points, not one. Find both, and do not mistake a detail for either. |
| `RI.7.2-2` Write an objective summary | 7 | 🧽 Article Summary, Opinion Free | Summarizing an article means reporting its points fairly, whether or not you agree with them. |
| `RI.7.3-1` Analyze interactions between individuals, events, and ideas | 7 | 🔗 How One Thing Shapes Another | In nonfiction, people, events and ideas push on each other. An invention changes lives. An event changes minds. |
| `RI.7.4-1` Analyze the impact of a specific word choice on meaning and tone | 7 | 🎚️ Loaded Words | Calling a plan bold or reckless describes the same plan with opposite attitudes. One word can set the tone. |
| `RI.7.5-1` Analyze the structure an author uses, including how sections contribute to the whole | 7 | 🗃️ Section Roles | An article is organized on purpose. Each section does a job for the whole: the problem, the causes, the solutions. |
| `RI.7.6-1` Determine the author's point of view and how they distinguish it from others | 7 | 🥊 Author Versus Others | Authors often bring up views they disagree with, then answer them. Watch for signals such as some say and critics argue. |
| `RI.7.7-1` Compare a text to an audio, video, or multimedia version, analyzing each medium's portrayal | 7 | 🎧 Heard or Read? | A speech on the page and the same speech aloud hit differently. Delivery adds things print cannot. |
| `RI.7.8-1` Trace and evaluate an argument and claims; assess whether reasoning is sound and evidence relevant and sufficient | 7 | 🧪 Is the Evidence Enough? | Good arguments use evidence that is on topic and strong enough. One story or a popularity claim does not prove much. |
| `RI.7.9-1` Analyze how two authors shape their presentations of key information differently | 7 | 🔭 Same Topic, Different Angle | Two authors can write about the same topic and stress different facts. What each chooses shapes what you believe. |
| `RL.7.1-1` Cite several pieces of evidence for explicit statements and inferences | 7 | 🧾 Three Pieces of Proof | One clue is a hint. Several clues together make a case. Collect every line that supports the claim. |
| `RL.7.10-1` Read literature in the grades 6-8 band proficiently | 7 | 📘 Novel Chapter Check | Reading a full chapter means holding on to who wants what, and how each scene changes things. |
| `RL.7.2-1` Determine a theme and analyze its development over the text | 7 | 🧵 Trace the Theme | A theme is not dropped in at the end. It grows across the story, from the first scene to the last. |
| `RL.7.2-2` Write an objective summary | 7 | ⚖️ Objective Summary Check | An objective summary tells what the story says, not what you think of it. |
| `RL.7.3-1` Analyze how setting shapes characters or plot | 7 | 🏔️ Setting at Work | A setting is more than a backdrop. It can trap characters, tempt them, or force their choices. |
| `RL.7.4-1` Analyze the effect of rhymes and repetitions of sounds on a section of a story, poem, or drama | 7 | 🥁 Sound Effects in Verse | Poets choose words for their sounds. Repeated sounds can hush a line, speed it up or make it pound. |
| `RL.7.5-1` Analyze how a drama's or poem's form or structure contributes to its meaning | 7 | 📜 Form Carries Meaning | The shape of a poem or play is part of its message. Short lines, a refrain or a sudden break all mean something. |
| `RL.7.6-1` Analyze how an author develops and contrasts points of view of different characters | 7 | 🪟 Two Views, One Event | Two characters can see the same event completely differently. Authors show each view through thoughts and words. |
| `RL.7.7-1` Compare a written story to its audio, filmed, staged, or multimedia version and analyze techniques | 7 | 🎥 Lights, Camera, Meaning | Film tells a story with tools a page does not have: lighting, sound, color and camera angles. |
| `RL.7.9-1` Compare a fictional portrayal of a time, place, or character with a historical account | 7 | 🏛️ History or Invention? | Historical fiction mixes real events with made-up characters and scenes. Readers need to tell which is which. |
| `W.7.1-1` Introduce claims, acknowledge alternate or opposing claims, and organize logically | 7 | 🤝 Claim Meets Counterclaim | A strong argument does not pretend the other side is silent. It names an opposing view, then answers it. |
| `W.7.1-2` Support claims with logical reasoning and credible evidence | 7 | 🏛️ Reasons You Can Trust | Support a claim with sound reasoning and sources a reader can trust. A rumor or a wild leap weakens the whole argument. |
| `W.7.1-3` Provide a conclusion that follows from the argument | 7 | 🔨 Close the Case | A conclusion should grow out of the argument. Copying the first paragraph word for word adds nothing. |
| `W.7.2-1` Introduce a topic clearly and preview what is to follow | 7 | 🗺️ Preview What Is Coming | A good introduction names the topic and gives the reader a map of what the piece will cover. |
| `W.7.2-2` Develop with relevant facts and quotations | 7 | 🧱 Build It With Facts | An explanation grows strong when every fact and quotation is about the topic. A fun fact from elsewhere is just clutter. |
| `W.7.2-3` Use transitions to create cohesion | 7 | 🪡 Smooth the Seams | Transitions stitch ideas together so the reader never trips. Choose the one that shows how the ideas relate. |
| `W.7.2-4` Provide a conclusion | 7 | 🎗️ Tie Up the Explanation | After explaining something, leave the reader with the big picture: what it all adds up to. |
| `W.7.3-1` Engage the reader and establish point of view | 7 | 👁️ Whose Eyes? | Every story is told through someone’s eyes. An opening sets up who is telling it and drops the reader into their world. |
| `W.7.3-2` Use dialogue, pacing, description to develop | 7 | 🧰 Scene Builder Tools | To develop a scene, writers let characters talk, paint what the senses notice, and slow down or skip time. |
| `W.7.3-3` Use transitions to show shifts in time or setting | 7 | ⏭️ Jump in Time and Place | When a story skips ahead or moves somewhere new, a transition tells the reader where and when they have landed. |
| `W.7.3-4` Provide a conclusion | 7 | 🪞 Look Back at the End | The best story endings do more than stop. The narrator looks back and shows what the events meant. |
| `W.7.4-1` Produce writing suited to task, purpose, audience | 7 | 🧪 Fit the Task | A lab report and a personal story need different kinds of writing. Let the task and the reader decide the style. |
| `W.7.5-1` Strengthen writing with planning, revising, editing, focusing on purpose and audience | 7 | 🎯 Revise for the Reader | Revising means asking who will read this and what they need. A good draft for one reader may miss for another. |
| `W.7.6-1` Use technology to produce, publish, link to and cite sources | 7 | 🔗 Link and Cite | When you publish online, readers should be able to follow your facts back to where you found them. |
| `W.7.7-1` Conduct short research drawing on several sources and generating more focused questions | 7 | 🔎 Sharper Questions | Good research breeds better questions. After a first look, ask follow-ups that are narrow enough to investigate. |
| `W.7.8-1` Use search terms effectively and assess credibility and accuracy | 7 | 🧭 Search Smart | The words you type decide what you find. Specific search terms bring back useful, trustworthy results. |
| `W.7.8-2` Quote or paraphrase while avoiding plagiarism and following a citation format | 7 | 🗒️ Quote It, Cite It | Borrowed words need quotation marks. Borrowed ideas need your own wording. Both need a citation. |
| `W.7.9-1` Draw evidence from texts to support analysis | 7 | 📎 Back It With the Text | An analysis paragraph makes a claim about a text and proves it with lines from that text. |
| `L.8.1-1` Explain gerunds, participles, infinitives | 8 | 🏊 Verbal Spotter | A verbal is a verb form doing another job. A gerund acts as a noun, a participle as an adjective, and an infinitive starts with to. |
| `L.8.1-2` Form and use active and passive voice | 8 | ⚾ Active or Passive? | In active voice the subject does the action. In passive voice the subject receives it. Active is usually clearer. |
| `L.8.1-3` Form and use indicative, imperative, interrogative, conditional, subjunctive mood | 8 | 🌠 If I Were | For wishes and things that are not real, English uses were, even with I, he and she. |
| `L.8.1-4` Fix inappropriate shifts in voice and mood | 8 | 🧭 Hold the Mood | A sentence that starts as a command should finish as one. Switching voice or mood halfway feels like a swerve. |
| `L.8.2-1` Use punctuation (comma, ellipsis, dash) to show a pause or break | 8 | ⏸️ Pause and Break Marks | A comma is a short pause. A dash is a sudden break. An ellipsis is a voice trailing off. |
| `L.8.2-2` Use an ellipsis to show an omission | 8 | ✂️ Three Dots, Same Meaning | An ellipsis shows where words were cut from a quotation. A fair cut shortens it without changing what it says. |
| `L.8.2-3` Spell correctly | 8 | 🏅 Spelling Final Round | These are the words that still catch careful writers. Know their hidden letters. |
| `L.8.3-1` Use active and passive voice and conditional and subjunctive mood for effect | 8 | 🎚️ Voice for Effect | Writers choose active or passive voice on purpose. Passive can hide who did something. Active puts the doer up front. |
| `L.8.4-1` Use context as a clue | 8 | 🧷 Built-In Definitions | Writers often define a hard word right in the sentence, after or, that is, or a comma. |
| `L.8.4-2` Use Greek or Latin affixes and roots (precede, recede, secede) | 8 | 🌲 Root Families | Precede, recede and secede all share cede, which means go. One root ties the family together. |
| `L.8.4-3` Use references | 8 | 📚 Two Words in One Spelling | Some spellings hide two different words. REFuse is trash. reFUSE is to say no. A dictionary lists both. |
| `L.8.5-1` Interpret figures of speech (verbal irony, puns) | 8 | ☔ Irony and Puns | Verbal irony says the opposite of what is meant. A pun plays on two meanings of a word. Both ask you to read twice. |
| `L.8.5-2` Use relationships between words | 8 | 🎼 Maker and Made | An analogy is solved by naming the link: maker and thing made, tool and job, part and whole. |
| `L.8.5-3` Distinguish connotations (bullheaded, willful, firm, persistent, resolute) | 8 | 📶 Negative to Positive Scale | Bullheaded, firm and resolute all describe someone who will not budge. They run from insult to praise. |
| `L.8.6-1` Acquire and use grade-appropriate academic and domain-specific words | 8 | 🏦 Academic Word Bank | Words like evaluate and perspective turn up in every subject. Using them precisely shows clear thinking. |
| `RI.8.1-1` Cite the evidence that most strongly supports analysis | 8 | 🥇 Best Evidence Award | Not all evidence is equal. Measured results beat a single story, and a direct fact beats a loose connection. |
| `RI.8.10-1` Read literary nonfiction at the high end of grades 6-8 band independently | 8 | 🧐 Essay Check | A demanding essay makes its point across several sentences. Follow the reasoning to the idea it is built to deliver. |
| `RI.8.2-1` Determine a central idea and analyze its development, including relationships to supporting ideas | 8 | 🕷️ Idea Web | A central idea is held up by supporting ideas, and those are held up by details. See how the levels connect. |
| `RI.8.2-2` Write an objective summary | 8 | 📋 Fair Summary | To summarize an argument fairly, report what the author says, even if you disagree. |
| `RI.8.3-1` Analyze how a text makes connections and distinctions among individuals, ideas, or events (comparisons, analogies, categories) | 8 | 🪢 How Ideas Get Linked | Authors connect ideas by comparing them, by drawing an analogy to something familiar, or by sorting them into categories. |
| `RI.8.4-1` Analyze the impact of word choices, including analogies or allusions, on meaning and tone | 8 | 🌡️ Tone Toward the Subject | An author’s feelings about a subject leak through word choice. The same inventor can be a pioneer or a tinkerer. |
| `RI.8.5-1` Analyze the structure of a specific paragraph, including the role of sentences in developing a key concept | 8 | 🧩 Sentence Roles in a Paragraph | Inside a strong paragraph, each sentence has a role: stating the point, giving evidence, explaining it, wrapping up. |
| `RI.8.6-1` Determine the author's point of view and how they acknowledge and respond to conflicting evidence | 8 | ↩️ Admit and Answer | Careful authors admit evidence against their view, then explain why their position still holds. |
| `RI.8.7-1` Evaluate the advantages and disadvantages of different mediums for presenting a topic | 8 | 📺 Pick the Medium | Print, video and audio each do some jobs well and others badly. Choose by what the topic needs. |
| `RI.8.8-1` Evaluate whether reasoning is sound and evidence relevant and sufficient; recognize irrelevant evidence | 8 | 🚫 Spot the Irrelevant | Some “evidence” has nothing to do with the claim. It may be true and still prove nothing. |
| `RI.8.9-1` Analyze two texts with conflicting information on the same topic and identify where they disagree | 8 | ⚡ Fact Clash or View Clash? | When two texts disagree, ask how. They may report different facts, or read the same facts differently. |
| `RL.8.1-1` Cite the evidence that most strongly supports analysis | 8 | 🏆 Strongest Line Wins | Several lines may relate to a claim. One of them proves it best. Choose the line that leaves the least doubt. |
| `RL.8.10-1` Read literature at the high end of grades 6-8 band independently | 8 | 📗 Read It Solo | Independent readers track a demanding passage on their own: the situation, the turn, the outcome. |
| `RL.8.2-1` Analyze theme development, including its relationship to characters, setting, plot | 8 | 🕸️ Theme Through Every Element | A theme is carried by everything in a story: who the characters are, where they are, and what happens to them. |
| `RL.8.2-2` Write an objective summary | 8 | 🧊 Neutral Retelling | An objective summary is cool and even. It reports the story without cheering or booing. |
| `RL.8.3-1` Analyze how lines of dialogue or incidents propel action, reveal character, or provoke a decision | 8 | 💬 What That Line Does | A single line of dialogue or one small incident can do real work: push the plot, reveal who someone is, or force a choice. |
| `RL.8.4-1` Analyze the impact of word choices on meaning and tone, including analogies and allusions | 8 | 🗝️ Analogy and Allusion Effects | Authors compare things or point to famous stories to add meaning quickly. Ask what the comparison brings with it. |
| `RL.8.5-1` Compare the structure of two or more texts and analyze how structure contributes to meaning and style | 8 | 🏗️ Structure Showdown | Two stories can cover similar ground with different structures. A diary feels close and immediate. A flashback creates mystery. |
| `RL.8.6-1` Analyze how differences in point of view of characters and audience create suspense or humor | 8 | 🙈 Reader Knows Best | Sometimes the reader knows something a character does not. That creates suspense or humor, and it is called dramatic irony. |
| `RL.8.7-1` Analyze how a filmed or live production stays faithful to or departs from the text | 8 | 🎬 Faithful or Changed? | A film version keeps some things and changes others. Each change is a choice the director made for a reason. |
| `RL.8.9-1` Analyze how a modern work draws on themes, events, or character types from myths and traditional stories | 8 | 🏺 Old Stories in New Clothes | Modern stories often rebuild very old ones: the hero’s quest, the trickster, the rise from rags, the one who flew too high. |
| `W.8.1-1` Introduce claims, acknowledge and distinguish them from alternate claims | 8 | 📐 Draw the Line Between Claims | A strong introduction states your claim and shows exactly how it differs from the claim on the other side. |
| `W.8.1-2` Support claims with logical reasoning and credible evidence | 8 | 🧱 Sound or Shaky Reasoning | Evidence only helps if the reasoning from it holds up. Watch for leaps, attacks on people and claims that everyone does it. |
| `W.8.1-3` Use transitions to clarify relationships among claims, counterclaims, reasons, evidence | 8 | 🔀 Argument Connectors | Transitions show the reader whether you are giving a reason, offering proof, or turning to answer the other side. |
| `W.8.1-4` Provide a conclusion | 8 | 🎤 Final Word on the Argument | The last paragraph is your final chance to convince. It should gather the argument, not wander off or fizzle. |
| `W.8.2-1` Introduce a topic and organize ideas into broader categories | 8 | 🗄️ File It Under | Before writing, sort your notes into bigger categories. Each category becomes a section of the piece. |
| `W.8.2-2` Develop with well-chosen facts, definitions, details, quotations | 8 | 💎 Choose the Best Support | Well-chosen support is specific and on topic. A vague or loosely related fact weakens the explanation. |
| `W.8.2-3` Establish and keep a formal style | 8 | 🎩 Make It Formal | Informative writing uses a formal style: precise words, no slang, no chatty asides. |
| `W.8.2-4` Provide a conclusion | 8 | 🔚 Closing the Explanation | An explanation should end by showing the reader what the information adds up to. |
| `W.8.3-1` Engage and orient the reader with context and point of view | 8 | 🎭 Set the Stage | The opening of a story should tell the reader where they are and through whose eyes they are looking, without a lecture. |
| `W.8.3-2` Use dialogue, pacing, description, reflection | 8 | 🧰 Four Narrative Tools | Dialogue, pacing and description build a scene. Reflection adds the narrator’s thoughts about what it meant. |
| `W.8.3-3` Use transitions to show shifts in time or setting and relationships among experiences | 8 | 🧷 Connect the Experiences | Stories jump between times and places. A transition shows the jump and how the two moments connect. |
| `W.8.3-4` Provide a conclusion that reflects on the experiences | 8 | 🌄 What It Meant | A reflective ending steps back from the events to say what they meant to the person who lived them. |
| `W.8.4-1` Produce writing suited to task, purpose, audience | 8 | ✉️ Formal or Casual Call | A cover letter and a group chat have different readers and different goals. Clear writing fits both. |
| `W.8.5-1` Strengthen writing with planning, revising, editing, rewriting | 8 | 🔨 Rewrite, Not Just Polish | Sometimes a draft needs a new approach, not a tidy-up. Rewriting changes the plan. Polishing fixes the surface. |
| `W.8.6-1` Use technology to produce, publish, and present relationships between information and ideas | 8 | 📊 Show the Relationship | Digital tools can show how ideas connect. Pick the visual that matches the relationship you want readers to see. |
| `W.8.7-1` Conduct short research projects using several sources and generating related focused questions | 8 | 🧭 Follow-Up Questions That Fit | Research raises new questions. The useful ones stay tied to the main question and can actually be looked up. |
| `W.8.8-1` Use advanced searches; assess credibility; quote or paraphrase avoiding plagiarism with citations | 8 | 🔬 Advanced Search Lab | Search tools have tricks: exact phrases, excluded words, trusted kinds of sites. Then you still have to judge and cite what you find. |
| `W.8.9-1` Draw evidence from texts to support analysis, reflection, research | 8 | 🧱 Claim, Evidence, Explain | An analysis paragraph has three parts: a claim, evidence from the text, and an explanation of how the evidence proves the claim. |
| `L.9-10.1-1` Use parallel structure | 9-10 | 🛤️ Keep It Parallel | Items in a list should wear the same grammatical uniform: all -ing words, all to-verbs, or all nouns. |
| `L.9-10.1-2` Use various phrases and clauses to add meaning and variety | 9-10 | 🧰 Phrases and Clauses Toolkit | Short, same-shaped sentences get dull. Phrases and clauses let you add detail and vary the rhythm. |
| `L.9-10.2-1` Use a semicolon to link closely related independent clauses | 9-10 | 🔧 Semicolon Fix | Two complete sentences cannot be held together by a comma alone. A semicolon is strong enough. |
| `L.9-10.2-2` Use a colon to introduce a list or quotation | 9-10 | 🚦 Colon Ahead | A colon says: here it comes. It follows a complete sentence and introduces a list, an explanation or a quotation. |
| `L.9-10.2-3` Spell correctly | 9-10 | 🐝 Tough Spellings | Some words trip nearly everyone: doubled letters, silent letters, sneaky vowels. Learn the hard spot in each. |
| `L.9-10.3-1` Write and edit to a style manual (MLA, APA) | 9-10 | 📘 Follow the Style Guide | Style manuals such as MLA and APA set shared rules for citing sources, so any reader can find what you used. |
| `L.9-10.4-1` Use context as a clue | 9-10 | 🔍 The Sentence Explains It | An unfamiliar word rarely travels alone. The sentence around it usually hands you its meaning. |
| `L.9-10.4-2` Use patterns of word changes (analyze, analysis, analytical) | 9-10 | 🧬 One Word, Many Forms | Words come in families. The ending changes with the job: analyze does, analysis names, analytical describes. |
| `L.9-10.4-3` Use references for meaning, part of speech, etymology | 9-10 | 📖 Read the Whole Entry | A dictionary entry holds more than a definition. It gives the part of speech and where the word came from. |
| `L.9-10.5-1` Interpret figures of speech (euphemism, oxymoron) | 9-10 | 🎭 Soft Words and Clashing Words | A euphemism swaps a harsh idea for a gentle phrase. An oxymoron joins two words that seem to contradict each other. |
| `L.9-10.5-2` Analyze nuances of words with similar denotations | 9-10 | 🌡️ Curious or Nosy | Curious and nosy describe the same habit. One is a compliment. The other is a complaint. |
| `L.9-10.6-1` Acquire and use general academic and domain-specific words | 9-10 | 🎓 Academic Words at Work | Certain words show up in every subject: synthesize, implication, evaluate. Knowing them unlocks textbooks and test questions. |
| `RI.9-10.1-1` Cite strong and thorough evidence | 9-10 | 🏋️ Evidence That Holds Weight | Not all support is equal. Specific facts, numbers and named sources carry an argument. Vague feelings do not. |
| `RI.9-10.10-1` Read literary nonfiction in the grades 9-10 band proficiently | 9-10 | 🔁 Read the Essay Twice | Literary nonfiction makes its point through images and reflection. Read once for what happens and once for what it means. |
| `RI.9-10.2-1` Determine a central idea and analyze its development and refinement by details | 9-10 | 🔪 How an Idea Gets Sharper | A central idea is introduced, then narrowed and strengthened by the details that follow. Watch it tighten. |
| `RI.9-10.2-2` Write an objective summary | 9-10 | 📰 Summary Without Spin | Summarizing an article means reporting its ideas fairly, even if you disagree. Your reaction comes later. |
| `RI.9-10.3-1` Analyze how an author unfolds a series of ideas or events, their order, and the connections drawn | 9-10 | 🧱 Why This Order? | Writers arrange their points on purpose: a story to hook you, data to convince you, a solution to send you off. |
| `RI.9-10.4-1` Analyze the cumulative impact of word choices on meaning and tone (language of a court opinion vs a newspaper) | 9-10 | ⚖️ Court Voice, News Voice | A court opinion and a news story can report the same ruling in very different language. The words fit the job. |
| `RI.9-10.5-1` Analyze how an author's ideas or claims are developed by particular sentences, paragraphs, or sections | 9-10 | 🧩 What Is This Paragraph For? | Each paragraph in an argument has a job: state the claim, give an example, answer an objection, or drive it home. |
| `RI.9-10.6-1` Determine an author's point of view or purpose and analyze how rhetoric advances it | 9-10 | 🎤 Purpose and Its Tools | Writers who want to move you reach for rhetoric: questions that need no answer, repeated phrases, appeals to what you value. |
| `RI.9-10.7-1` Analyze various accounts of a subject told in different mediums and what each emphasizes | 9-10 | 🎞️ Page, Screen, Speaker | A life told in a print biography and the same life in a documentary are not the same story. Each medium spotlights different details. |
| `RI.9-10.8-1` Evaluate argument and claims, reasoning validity, evidence relevance; identify false statements and fallacies | 9-10 | 🕳️ Name That Fallacy | A fallacy is reasoning that sounds persuasive but does not hold. Learn their names and they lose their power. |
| `RI.9-10.9-1` Analyze seminal US documents of historical and literary significance and their themes | 9-10 | 📜 Founding Words, Lasting Themes | A few documents shaped how the United States talks about itself. Each one argues for an idea that later writers return to. |
| `RL.9-10.1-1` Cite strong and thorough evidence for explicit and inferred meaning | 9-10 | 🧾 Two Quotes and a Because | A strong reading needs more than one quote dropped on the page. Choose the lines that prove the claim, then say how they prove it. |
| `RL.9-10.10-1` Read literature in the grades 9-10 band proficiently | 9-10 | 🧗 Stay With a Hard Passage | Complex writing rewards patience. Slow down, break long sentences into parts, and track who does what. |
| `RL.9-10.2-1` Analyze how a theme emerges and is shaped by specific details | 9-10 | 🌱 Watch the Theme Grow | A theme does not arrive all at once. It is planted early, tested in the middle, and sharpened by the ending. |
| `RL.9-10.2-2` Write an objective summary | 9-10 | 🧊 Just What Happened | An objective summary gives the main events and the central idea. It leaves out your verdicts and the tiny details. |
| `RL.9-10.3-1` Analyze how complex characters develop, interact, and advance plot or theme | 9-10 | 🪢 Pulled Two Ways | Complex characters want two things that cannot both happen. That inner tug is what moves the plot. |
| `RL.9-10.4-1` Analyze the cumulative impact of word choices on meaning and tone (formal vs informal, sense of time and place) | 9-10 | 🎚️ Words That Pile Up | Tone is built one word at a time. A single cold word is a detail. Five of them in a row are a mood. |
| `RL.9-10.5-1` Analyze how choices about structure, order, and time (pacing, flashbacks) create mystery, tension, surprise | 9-10 | ⏳ Why Tell It in That Order? | Authors choose where to start, when to look back, and how fast to move. Each choice does something to the reader. |
| `RL.9-10.6-1` Analyze a point of view or cultural experience reflected in literature from outside the US | 9-10 | 🌏 Read From the Inside | Literature from another part of the world carries its own customs and values. Read it on its own terms before measuring it against yours. |
| `RL.9-10.7-1` Analyze the representation of a subject in two different artistic mediums | 9-10 | 🖼️ Poem and Painting | A poem and a painting can share a subject and still tell you different things. Each medium has to leave something out. |
| `RL.9-10.9-1` Analyze how an author draws on and transforms source material (Shakespeare and Ovid) | 9-10 | 🪽 Old Story, New Clothes | Writers borrow old stories and remake them. The interesting part is what they keep and what they change. |
| `W.9-10.1-1` Introduce precise claims, distinguish from counterclaims, create organization | 9-10 | 🎯 Sharpen the Claim | A precise claim says exactly what should happen and why. It also stands apart from the view it argues against. |
| `W.9-10.1-2` Develop claims and counterclaims fairly with evidence, noting strengths and limits | 9-10 | ⚖️ Give the Other Side Its Due | A strong argument treats the opposing view fairly. It admits what is true in it, then answers with evidence. |
| `W.9-10.1-3` Use transitions to link sections and clarify relationships | 9-10 | 🔗 Link the Logic | Transitions are road signs. They tell the reader that you are adding, turning, or arriving at a result. |
| `W.9-10.1-4` Establish a formal style and objective tone | 9-10 | 🧊 Cool the Tone | An argument persuades with evidence, not with heat. Formal, objective wording keeps readers listening. |
| `W.9-10.1-5` Provide a conclusion that supports the argument | 9-10 | 🛬 An Ending That Earns It | A conclusion should follow from the evidence and leave the reader with the point. Copying the first paragraph is not landing. |
| `W.9-10.2-1` Introduce a topic and organize complex ideas | 9-10 | 🏗️ Build the Introduction | An introduction to an explanation leads the reader in: something to catch interest, the background, the main idea, then the plan. |
| `W.9-10.2-2` Develop with well-chosen, relevant facts and examples | 9-10 | 🧲 Choose Facts That Fit | An explanation is only as good as its details. Pick facts that are specific, on topic, and enough to make the idea clear. |
| `W.9-10.2-3` Use precise language and domain vocabulary | 9-10 | 🔬 Name It Exactly | Stuff, thing and got are placeholders. In an explanation, the exact term does the explaining for you. |
| `W.9-10.2-4` Provide a conclusion that articulates significance | 9-10 | 💡 So What? | The end of an explanation should answer one last question: why does this matter? |
| `W.9-10.3-1` Engage the reader with a problem, situation, or observation | 9-10 | 🪝 Open With a Hook | A story should start in the middle of something: a problem, a strange situation, a sharp observation. |
| `W.9-10.3-2` Use narrative techniques (dialogue, pacing, description, reflection, multiple plot lines) | 9-10 | 🎬 Show It Happening | Summary says a thing happened. Narrative technique lets the reader live through it: voices, speed, detail, thought. |
| `W.9-10.3-3` Sequence events to build a coherent whole | 9-10 | 🧵 One Thing Leads to Another | In a well-built story each event grows from the one before it, so the whole thing holds together. |
| `W.9-10.3-4` Provide a conclusion that reflects on the narrative | 9-10 | 🪞 End by Looking Back | A strong narrative ending does more than stop. It looks back and shows what the experience came to mean. |
| `W.9-10.4-1` Produce writing suited to task, purpose, audience | 9-10 | 🧥 Fit the Writing to the Job | A college essay and a lab report are both good writing, in completely different clothes. The task and reader decide the style. |
| `W.9-10.5-1` Develop writing through planning, revising, editing, rewriting, focused on purpose and audience | 9-10 | 🛠️ Revise Before You Polish | Fixing commas is the last step. Real revision asks bigger questions first: does this serve the purpose and the reader? |
| `W.9-10.6-1` Use technology to produce, publish, and update individual or shared writing | 9-10 | 💻 Draft, Share, Update | Shared documents let writing keep improving. Feedback comes in, the draft gets updated, and readers always see the latest version. |
| `W.9-10.7-1` Conduct research to answer a question or solve a problem, synthesizing multiple sources | 9-10 | 🧶 Weave the Sources | Research means more than quoting one website. Synthesis puts several sources together to say something none says alone. |
| `W.9-10.8-1` Use advanced searches; assess usefulness; integrate information to maintain flow and avoid plagiarism; cite properly | 9-10 | 🏷️ Credit Where It Is Due | Using someone’s words or ideas is fine when you show whose they are. Without credit, it is plagiarism. |
| `W.9-10.9-1` Draw evidence from texts to support analysis, reflection, research | 9-10 | 🧱 Claim, Evidence, Reasoning | An analysis paragraph stands on three legs: what you think, what in the text shows it, and why that proves it. |
| `L.11-12.1-1` Know usage is a matter of convention that changes over time | 11-12 | 🕰️ Usage Changes | English usage is a set of shared habits, not laws of nature. Habits shift, and what one century scolds the next accepts. |
| `L.11-12.1-2` Resolve contested usage with references (Merriam-Webster's, Garner's) | 11-12 | 📚 Look It Up, Settle It | When writers disagree about usage, they do not guess. They check a usage guide or dictionary and follow its reasoning. |
| `L.11-12.2-1` Observe hyphenation conventions | 11-12 | ➖ Hyphen or No Hyphen | Two words that act as one describer before a noun are joined by a hyphen. After the noun, they usually stand apart. |
| `L.11-12.2-2` Spell correctly | 11-12 | 🏅 Champion Spellings | The hardest spellings hide silent letters and unexpected doubles. Find the trap in each word. |
| `L.11-12.3-1` Vary syntax for effect, consulting references for guidance | 11-12 | 🥁 Sentence Rhythm | Sentences of one length drone. A short one after several long ones hits like a drum. Vary the pattern on purpose. |
| `L.11-12.4-1` Use context as a clue | 11-12 | 🔦 Meaning From the Sentence | Advanced texts are full of words you may not know. The sentence usually explains them, if you look at what surrounds them. |
| `L.11-12.4-2` Use patterns of word changes (conceive, conception, conceivable) | 11-12 | 🧬 Word Families at Work | Know one member of a word family and you can work out the rest. The suffix tells you its job in the sentence. |
| `L.11-12.4-3` Use references for meaning, part of speech, etymology, usage | 11-12 | 🗂️ Read the Usage Note | Good dictionaries add usage notes that explain how a word is properly used. They settle arguments a definition cannot. |
| `L.11-12.5-1` Interpret figures of speech (hyperbole, paradox) | 11-12 | 🎪 Exaggeration and Contradiction | Hyperbole stretches the truth for effect. A paradox seems to contradict itself yet points at something true. |
| `L.11-12.5-2` Analyze nuances of words with similar denotations | 11-12 | 🪙 Frugal or Miserly | Synonyms are never quite equal. Frugal earns a nod. Miserly earns a frown. The dictionary meaning is the same. |
| `L.11-12.6-1` Acquire and use general academic and domain-specific words | 11-12 | 🎓 College-Ready Vocabulary | A handful of academic words carry most scholarly writing. Use them precisely and your own writing gains authority. |
| `RI.11-12.1-1` Cite strong and thorough evidence, including where the text is uncertain | 11-12 | 📏 How Sure Is the Text? | Careful nonfiction signals its own limits with words like may, suggests and preliminary. Do not claim more than the text does. |
| `RI.11-12.10-1` Read literary nonfiction in the grades 11-CCR band proficiently | 11-12 | 🧗 Follow a Demanding Essay | Advanced essays rarely state one neat point. They qualify, concede and turn. Track the turns to find what the writer finally holds. |
| `RI.11-12.2-1` Determine two or more central ideas and analyze how they interact | 11-12 | 🧬 Two Ideas, One Argument | Complex texts develop more than one central idea. The second idea often complicates or limits the first. |
| `RI.11-12.2-2` Write an objective summary | 11-12 | 📋 Fair Summary of a Hard Text | Summarizing a complex argument means keeping every main idea in proportion and leaving your own position at the door. |
| `RI.11-12.3-1` Analyze a complex set of ideas or sequence of events and how they interact and develop | 11-12 | 🕸️ How One Thing Led to Another | In complex texts, events and ideas act on each other. Trace the chain and you understand the argument. |
| `RI.11-12.4-1` Analyze how an author uses and refines the meaning of a key term over a text (faction in Federalist No. 10) | 11-12 | 🧭 A Word That Shifts | Careful writers define a key term, then sharpen it as the argument moves. The word at the end is not quite the word at the start. |
| `RI.11-12.5-1` Evaluate the effectiveness of the structure an author uses in an argument or exposition | 11-12 | 🏛️ Does the Structure Work? | It is not enough to describe how an argument is built. Judge it: does the structure make the points clear and convincing? |
| `RI.11-12.6-1` Determine an author's point of view or purpose in a text where rhetoric is effective, analyzing style and content | 11-12 | 🎻 Style Plus Substance | The most persuasive texts work twice: through what they say, and through how they say it. Analyze both. |
| `RI.11-12.7-1` Integrate and evaluate multiple sources in different media to address a question | 11-12 | 🧩 Many Sources, One Answer | A hard question needs more than one kind of source. Numbers, voices and images each show part of the picture. |
| `RI.11-12.8-1` Evaluate reasoning in seminal US texts, including constitutional principles and legal reasoning | 11-12 | ⚖️ Weigh the Reasoning | Founding texts and court opinions argue from principles. Reading them well means testing whether the reasoning holds. |
| `RI.11-12.9-1` Analyze 17th-, 18th-, and 19th-century foundational US documents for themes, purposes, rhetorical features | 11-12 | 📜 How the Declaration Persuades | The founding documents were written to convince. Their structure and phrasing are as deliberate as their ideas. |
| `RL.11-12.1-1` Cite strong and thorough evidence, including where the text leaves matters uncertain | 11-12 | 🌫️ What the Text Leaves Open | Strong readers cite what a text proves and also admit what it never settles. Ambiguity is part of the meaning. |
| `RL.11-12.10-1` Read literature in the grades 11-CCR band proficiently | 11-12 | 🧶 Untangle the Long Sentence | Older and more complex prose packs a paragraph into one sentence. Find its spine, then hang the rest on it. |
| `RL.11-12.2-1` Determine two or more themes and analyze how they interact and build on one another | 11-12 | 🎭 Two Themes in Conversation | Rich works carry more than one theme. The themes push against each other, and that friction is where the meaning lives. |
| `RL.11-12.2-2` Write an objective summary | 11-12 | 🧾 Plot Without Verdicts | Even with a novel you love or hate, the summary stays neutral. Analysis and judgment come afterward. |
| `RL.11-12.3-1` Analyze the impact of an author's choices about developing and relating elements of a story or drama | 11-12 | ♟️ Choices Have Consequences | Where a story is set, the order events arrive in, how a character first appears: each is a decision with an effect. |
| `RL.11-12.4-1` Analyze the impact of specific word choices on meaning and tone, including words with multiple meanings | 11-12 | 🗝️ A Word Doing Double Duty | Writers choose words that mean two things at once. Catch both meanings and the line opens up. |
| `RL.11-12.5-1` Analyze how choices about structure (where to begin or end, comedic or tragic resolution) contribute to meaning and aesthetic impact | 11-12 | 🎬 Where to Begin, How to End | The first scene and the last scene frame everything between. A wedding ending and a funeral ending make different meanings. |
| `RL.11-12.6-1` Analyze a case where grasping point of view requires distinguishing what is stated from what is meant | 11-12 | 🙃 Said One Thing, Meant Another | Satire and irony say the opposite of what they mean. Read them literally and you miss the whole point. |
| `RL.11-12.7-1` Analyze multiple interpretations of a story, drama, or poem, evaluating how each interprets the source | 11-12 | 🎟️ Same Scene, Two Stagings | Every production of a play is an interpretation. The script is the same. The meaning the audience takes home is not. |
| `RL.11-12.9-1` Show knowledge of 18th-, 19th-, and early 20th-century foundational American works and how they treat similar themes | 11-12 | 🗽 American Voices, Shared Themes | Foundational American writers kept returning to the same questions: the self, freedom, nature. Each answered in a different key. |
| `W.11-12.1-1` Introduce precise, knowledgeable claims and establish their significance | 11-12 | 🎯 A Claim Worth Arguing | An advanced argument opens with a claim that is exact and informed, and shows at once why anyone should care. |
| `W.11-12.1-2` Develop claims and counterclaims thoroughly, anticipating audience knowledge and biases | 11-12 | 👥 Know Your Audience | A thorough argument anticipates its readers: what they already know, what worries them, what they value. |
| `W.11-12.1-3` Use words, phrases, clauses, and varied syntax to link sections | 11-12 | 🪢 Vary and Connect | Linking words are one tool. Sentence shape is another: a clause that leans on the next idea carries the reader forward. |
| `W.11-12.1-4` Provide a conclusion that supports the argument | 11-12 | 🏁 The Last Word of an Argument | The conclusion is the final chance to make the argument stick. It should grow out of the evidence, not circle back to the opening line. |
| `W.11-12.2-1` Introduce a topic and organize complex ideas so each builds on the last | 11-12 | 🧱 Each Idea Builds on the Last | In a strong explanation the order is not arbitrary. Each idea is a step the next one stands on. |
| `W.11-12.2-2` Develop with the most significant and relevant facts | 11-12 | ⚗️ Only the Facts That Matter Most | Research leaves you with more facts than you can use. Choosing the most significant ones is the real skill. |
| `W.11-12.2-3` Use precise language, domain vocabulary, metaphor, simile, analogy | 11-12 | 🌉 Explain It With an Analogy | When an idea is hard, compare it to something the reader already knows. A good analogy does the heavy lifting. |
| `W.11-12.2-4` Provide a conclusion that articulates implications | 11-12 | 🔭 What Follows From This | An advanced conclusion looks past the topic to its implications: what changes, now that the reader understands? |
| `W.11-12.3-1` Engage the reader with a problem and establish point of view | 11-12 | 👁️ Whose Eyes, What Problem | A narrative opening has two jobs: drop the reader into a problem, and settle whose eyes we are looking through. |
| `W.11-12.3-2` Use techniques like dialogue, pacing, reflection, multiple plot lines | 11-12 | 🧵 Braid the Story | Advanced narratives weave techniques together: talk, speed, thought, and more than one storyline running at once. |
| `W.11-12.3-3` Sequence events to build toward a particular tone and outcome | 11-12 | 📈 Build Toward a Feeling | Order creates mood. Arrange events so each one tightens the feeling you want: mystery, suspense, growth or relief. |
| `W.11-12.3-4` Provide a conclusion that reflects on the narrative | 11-12 | 🌅 Close With Meaning | The last lines of a narrative should look back over what was lived through and let its meaning settle. |
| `W.11-12.4-1` Produce writing suited to task, purpose, audience | 11-12 | 🎙️ Right Voice for the Reader | A scholarship committee and a lab instructor want different things from you. Skilled writers switch voice to fit. |
| `W.11-12.5-1` Strengthen writing through planning, revising, editing, rewriting | 11-12 | 🧰 Fix the Biggest Thing First | Strong writers revise in order of importance: purpose and argument first, structure next, sentences last. |
| `W.11-12.6-1` Use technology to produce, publish, and update writing in response to feedback | 11-12 | 🔄 Living Document | Published does not mean finished. Online writing can keep improving as feedback and new information arrive. |
| `W.11-12.7-1` Conduct sustained research to answer a question or solve a problem, synthesizing multiple sources | 11-12 | ⛏️ Narrow It, Then Dig | Sustained research starts with a question you can actually answer. Too broad and you drown. Too narrow and there is nothing to find. |
| `W.11-12.8-1` Assess strengths and limits of sources for the task; integrate information selectively; avoid plagiarism; cite properly | 11-12 | 🧪 Know Your Sources’ Limits | Every source is good for some things and weak for others. Use each for its strength, and never lean on only one. |
| `W.11-12.9-1` Draw evidence from literary or informational texts to support analysis | 11-12 | 🧾 Prove Your Reading | Analysis is a claim about a text that the text itself can back up. Without evidence and reasoning it is only an impression. |

## Skills still waiting

- **Math, grade K** (0): 
- **Math, grade 1** (0): 
- **Math, grade 2** (0): 
- **Math, grade 3** (0): 
- **Math, grade 4** (0): 
- **Math, grade 5** (0): 
- **Math, grade 6** (0): 
- **Math, grade 7** (0): 
- **Math, grade 8** (0): 
- **Math, grade Algebra 1** (0): 
- **Math, grade Geometry** (0): 
- **Math, grade Algebra 2** (0): 
- **Math, grade Precalculus / advanced (+)** (0): 
- **Reading/ELA, grade K** (0): 
- **Reading/ELA, grade 1** (0): 
- **Reading/ELA, grade 2** (0): 
- **Reading/ELA, grade 3** (0): 
- **Reading/ELA, grade 4** (0): 
- **Reading/ELA, grade 5** (0): 
- **Reading/ELA, grade 6** (0): 
- **Reading/ELA, grade 7** (0): 
- **Reading/ELA, grade 8** (0): 
- **Reading/ELA, grade 9-10** (0): 
- **Reading/ELA, grade 11-12** (0): 
