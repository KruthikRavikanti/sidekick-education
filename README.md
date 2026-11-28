# Sidekick

Sidekick is a local K–5 family prototype built with Next.js/TypeScript, FastAPI/Pydantic, and SQLite. Parents create profiles, unlock a PIN-protected dashboard, and review uploaded student work. Children upload a photo or PDF of a worksheet, quiz, test, or other Math/ELA work and review the verbatim extraction. When Sidekick reliably identifies the catalog skill a question is about, it offers a **game** for that skill. Every skill in the skill map ships with a game, new games can be written by a model against the Sidekick game kit, and no child sees a game until a person has approved it. The former standalone Practice section, diagnostic quizzes, and the earlier fixed-control activity system are retired. The [Sidekick design kit](https://preview--sidekick-colorway-studio.lovable.app/?__lovable_receipt=mat_6nx4bc71428r69zqdx974t1cnk), colors, components, and locally hosted fonts are retained.

The flow, end to end: **upload work → Sidekick reads it and finds the skill → a game for that skill → the parent sees how play went.** Skill observations come only from uploaded work. Games are practice and never change the skill picture.

## Local setup

Requires Node.js 20.9+ and Python 3.11+.

```sh
npm ci
python3 -m venv backend/.venv
backend/.venv/bin/python -m pip install -r backend/requirements.txt
cp -n .env.example .env.local
cp -n backend/.env.example backend/.env
npm run db:migrate
npm run catalog:seed
npx playwright install chromium                    # the robot that checks each game needs it
npm run games:seed -- --subject math --grades 3    # load one grade of games to start; see Games below for the whole library
npm run dev:all
```

Open **http://localhost:3000** after the launcher prints that Sidekick is ready. Keep the terminal open; Ctrl+C stops both servers. The launcher checks ports 3000/8000 and dependencies without switching ports. `npm run dev` starts only Next.js. To start FastAPI separately:

```sh
backend/.venv/bin/uvicorn backend.main:app --host 127.0.0.1 --port 8000 --no-access-log
```

Retain existing credentials when pulling updates. Add new settings from `backend/.env.example` instead of overwriting `backend/.env`. FastAPI reads that file; Next.js uses `.env.local` only for its server-side `BACKEND_URL` proxy. Restart servers after changing configuration. Never put credentials in `NEXT_PUBLIC_*` variables.

Set **`VISION_API_KEY`** and **`VISION_MODEL`** in `backend/.env` to enable live extraction, skill mapping, supported language grading, and error-pattern observations through the shared adapter. Writing new games uses the same adapter (see Games). The provider must support image input and strict JSON Schema on an OpenAI-compatible `/chat/completions` endpoint. `VISION_BASE_URL` defaults to `https://api.openai.com/v1`; `VISION_TIMEOUT_SECONDS` defaults to 120 (1–180). Existing `.env` files keep their explicit value; use `VISION_TIMEOUT_SECONDS=120` for slower pages. The image UI allows four minutes, and the API rewrite allows fifteen minutes so a multi-page upload is not cut off by Next's default thirty seconds. Provider limits still apply. HTTPS is required except on loopback. No provider/model is silently selected.

For an offline extraction walkthrough:

```sh
APP_ENV=development PASSWORD_POLICY=dev COOKIE_SECURE=false npm run db:seed
npm run dev:demo
```

The optional seed creates `parent@example.com` / `password`, Alex (grade 3), and Maya (grade 1). The PIN starts unset; repeated seeding preserves existing credentials and profiles. Sign in, choose Parent, verify the account password to set a 4–6 digit PIN, and unlock the dashboard. Switch profile to choose a child and tap **Upload work**.

Demo mode accepts the exact bundled worksheet fixtures under `public/samples/` and labels extraction `source: "fixture"`. It creates no fabricated learning evidence. Automated tests inject explicit model stubs for student-work analysis. Demo mode alone does not fabricate the reliable grading and skill mapping needed to offer a game.

## Migrations and catalog seeding

Run these after pulling migrations or catalog/compiler changes:

```sh
npm run db:migrate
npm run catalog:seed
# Optional: save the import report, or import a reviewed catalog revision.
npm run catalog:seed -- --report /tmp/sidekick-catalog-report.json
npm run catalog:seed -- --path /path/to/reviewed-catalog.json
```

Migrations `001`–`004` add accounts, the catalog, learning records, and private student work storage. Migration `005` retires the former check/practice workflow and preserves its historical attempts/evidence. Migrations `006` and `007` created the tables of the earlier activity system (versions, sessions, attempts, private voice recordings, parent reviews). That system is retired: nothing reads or writes those tables, their rows are kept as history, and deleting a child still removes that child's rows and recordings. Migration `008` adds the game tables. None of these restore retired endpoints. Already-applied migrations are skipped. `DATABASE_URL` defaults to `sqlite:///backend/data/sidekick.db`; relative SQLite paths resolve from the repository root. Back up the database and private uploads together before moving this local prototype.

`data/sidekick_skill_map_v2.json` is the supplied, unchanged draft. Its SHA-256 is `7c7b3a98cdf51bb48b53bcef4c4d5e2c0015fc0845e40f6345a4962eeab1be23`. It contains **779 skills, 1,533 subskills, and 3,066 populated seed pairs**: 867 Math, 666 Reading/ELA, and 795 K–5 subskills. K–8 grades have explicit ordering; high-school math courses and ELA bands retain their separate string labels. Profiles remain K–5.

The importer validates before a transaction, upserts stable IDs, preserves every raw source field, and derives subskill order from the numeric suffix. Seed slots have stable logical IDs (`subskill:p1` / `subskill:p2`) and immutable content versions. Reseeding replaces current relationships and retires removed records; attempts and assignment references keep their exact historical item versions. Repeating an unchanged import does not duplicate items.

The checked-in [import report](data/catalog_import_report.json) records all counts and 37 graph warnings: 28 Low-confidence roots, five upward prerequisite directions, and four cycle edges across root/skill graphs. This includes the High-confidence `A-SSE.B.3-1` ↔ `A-REI.B.4-3` cycle and Algebra 1 → Algebra 2 links. Raw links remain stored and unsafe links are marked unusable. The current student work flow does not initiate prerequisite traversal or checks.

The retained catalog compiler records **101 ready, verified item specifications**, **1,941 adult-required specifications**, and **1,024 missing-context specifications**. All 3,066 seed pairs and their immutable versions remain curriculum data. Games use the catalog skill and its misconception; nothing turns this question bank into standalone quizzes. Missing passages, choices, plots, and dependencies are not invented.

## Student work observations

Upload a JPG, PNG, WebP, HEIC/HEIF photo, or bounded PDF from the active child's **Upload work** action. The photo chooser uses the image wildcard so Mac Photos can offer images without the former narrow format filter. HEIC/HEIF photos receive a temporary PNG preview before **Read my work**; the original file is submitted and stored privately when reading starts. Parents may also upload from the dashboard with a selected child. Preview, tap **Read my work**, and review problems in page order. Extraction preserves written mistakes, step order, fractions, shared context, and field-level uncertainty. Blank and unreadable responses remain distinct. Grading and mapping are separate stages; unsupported, blank, ambiguous, or unreadable work stays ungraded and cannot create incorrect skill evidence.

After updating an older checkout, install the updated backend dependencies with `backend/.venv/bin/python -m pip install -r backend/requirements.txt` and restart the app. If a native file chooser is already open, cancel it, refresh Sidekick, and reopen **Choose an image** so it uses the updated format filter.

Candidate retrieval uses the same subject and grades up to one above the child's grade, with at most ten candidates. High-school labels stay outside the K–5 retrieval window. Mapping below 0.6 abstains. A confidently mapped incorrect answer can separately receive a visible-work error-pattern observation. Teacher marks are observations; conflicts with grading are flagged for review. Scores are initial routing estimates, not calibrated assessment probabilities.

Persistent uploads checkpoint extraction, grading, mapping, signatures, and evidence. Request keys, child-scoped file hashes, and problem fingerprints suppress recognized retries and duplicates. A stopped process can resume through **Retry** after its processing lease expires; this prototype uses in-process background tasks rather than a durable job worker. Authorization is rechecked after provider work and before returning profile-scoped results.

## Parent portal

The parent portal is built around a **skill map**: one dot for every skill in the child's grade, grouped into a few plainly named areas (Fractions, Place value, Reading stories, and so on; see [`backend/gap/areas.py`](backend/gap/areas.py)). A dot lights up only when the child's own uploaded work shows that skill. The top bar is the one every child screen has (logo on the left, **Switch profile** on the right, plus a **Parent mode** label), so the frame does not move when a parent comes in. Under it, a side panel (a strip at the top on a phone) switches between children and between four pages:

| Page | What it shows |
| --- | --- |
| **Skill map** | The dots, a count of skills that need support, are on track, or have too little evidence, and a search by skill name or Common Core code. Picking an area lists its skills: what was noticed in the work, something to try at home, the game played for that skill, and the uploaded evidence. |
| **Work** | Questions read, correct answers, and questions not graded yet, followed by every upload in order with its private original. |
| **Games** | Games finished and how the last round went. Reviewers also get a **Review games** link here and in the side panel. |
| **Family and settings** | Child profiles, the parent PIN, the password, and log out. |

The map draws a dot in one of four ways: needs support, on track, seen in uploaded work but not enough to say yet, and not seen yet. The first three come from the statuses below; the last two are both `unassessed`, told apart by whether any uploaded question pointed at the skill.

The skill map summarizes eligible student work evidence:

| Status | Meaning |
| --- | --- |
| `unassessed` | There is not enough reliable student work evidence to summarize the skill. |
| `on_track` | At least one eligible correct response supports progress, with no eligible incorrect responses. |
| `needs_support` | One confidently graded, eligible incorrect response shows where support may help. This is a student work observation, not a confirmed diagnostic result. |

`backend/gap/config.json` contains the application timezone, mapping confidence threshold, and number of distinct incorrect student work responses needed for a support observation.

A repeated upload of the same question does not create a second observation. Ungraded or unmapped outcomes remain available for review without affecting skill states. The dashboard includes the source student work and any observed error pattern, parent explanation, and home tip. It does not initiate diagnostic checks, prerequisite quizzes, practice sessions, or scheduled rechecks. Student work alone does not award mastery.

The top of the parent Work page shows **Questions read**, **Correct answers**, and **Not graded yet** from stored student work problems. Questions are deduplicated by child-scoped problem fingerprint. Each distinct question uses its first usable correct/incorrect grade in chronological order; if it has no usable grade, it stays ungraded. Mapping eligibility determines skill observations separately, so an unmapped but confidently graded problem can still count as a correct answer. Session counts, time spent, and retired practice totals are not presented as progress. Games have their own parent history. Server timestamps and the configured application timezone, **`America/New_York`**, are retained. Conversation history remains empty until a future chat milestone, so the portal has no page for it yet.

The former Practice URL redirects to the child's home. Authenticated calls to retired check/practice/adult-review endpoints return `410 feature_removed` after the existing mode, ownership, and CSRF checks. Old pending work is retired by migration; historical records are retained privately and cannot continue generating evidence through those endpoints.

## From uploaded work to a game

After **Read my work**, the results page asks the server what this child can play for this page. The answer comes from `backend/gap/targets.py`, which only reads:

- A question counts when it was read clearly and confidently matched to an active Math or Reading/ELA catalog skill (confidence at or above `mapping_confidence` in `backend/gap/config.json`).
- Unreadable questions, low-confidence matches, and problems where a teacher's mark conflicts with the grading never count.
- A reliable skill match is enough even when automatic grading abstained. Offering a game does not turn that observation into evidence.
- Work reliably marked incorrect comes first, then correct work, then other reliable matches, in page order. A skill that already has a playable game is preferred, so one unsupported question cannot hide another that can be played.

The child sees a card with the game for that skill and taps **Play**. If the skill's game has not been approved yet, the card says a game is on the way. If nothing on the page was reliably matched, there is no card and the reading is shown as usual. The child does not answer setup questions or select a grade.

Parents open **Games** for a selected child to see what was played, the skill, how the last round went, hints used, and the known slips the child tried. Reviewers also get the link to the review page there.

To try it locally with a configured provider, select a grade-3 child and upload the included [fraction page](public/samples/game-math-work.png) or [plural page](public/samples/game-ela-work.png). Load and approve the games for those skills first (`npm run games:seed -- --only froggys-bridge` and `--only twin-ray-zoo`, then approve them at `/parent/games`).

## Look and feel: Color Blocks

The visual theme lives in `app/color-blocks.css`, a layer imported last in `app/layout.tsx`. It restyles the existing screens into big flat panels in the brand colors (sun, orange, forest, lime, sky) with very large Fredoka headings and no borders or drop shadows. It changes no behavior. Removing that one import returns the app to the earlier look. The only markup added with it is the short "How it goes" list on the kid home page.

The palette is deliberately small: sun, orange, forest and lime on a cream page, with sand as the one quiet neutral. There is no pale green and no light blue. Form cards (log in, sign up, the parent PIN, the upload card) are forest with white fields and a sun button. Where the base styles used pale green tints, the theme maps them to the palette: quiet surfaces and notes are sand, a picked option is sun, and "done, correct, on track" is solid lime. The game frame's own chrome (`backend/games/kit/kit.css`) follows the same swap.

The page around the panels is a small landscape, drawn in CSS behind everything (`body::before` and `body::after`, never in the way of a click). Two soft clouds sit near the top of every screen. On screens made of panels (log in, sign up, the profile picker, the parent PIN, kid home, upload and results) a sun, two hills and the mascots sit along the bottom of the screen. Where words sit straight on the page (the game player, the parent side) only the clouds show, so nothing is ever behind text. The few words that do sit on the bare page on scene screens (the footer line, "Log out" on the picker, the privacy note and the results footnote) have a cream backing.

## Games

Games are the one way Sidekick turns a skill into something to do. A game is a small program written for one skill, either shipped in this repo or written by a model, so the ceiling is imagination and every skill in the catalog is reachable. Because a model can write code here, four layers stand between that code and a child, and none of them depends on trusting the model.

**The brief.** A Sidekick game is play, not a quiz: a little world with a mission, solved by moving or changing things, where the world reacts and the skill is the rule that makes it work. Guided rounds let the child explore; the last round is a fresh version with the help taken away. If it could be printed on paper, it failed. The full brief is in `backend/games/prompts.py`.

**1. The kit.** A game is one JavaScript file written against the Sidekick kit (`backend/games/kit/`, reference in `KIT.md`). The kit owns the brand, the stage, dragging and tapping, keyboard use, the round flow, hints, scoring and the report back to the app. The game supplies the world and the rules, and declares its own winning steps and the known mistakes for each round.

**2. The locked frame.** Game code runs only in an `<iframe sandbox="allow-scripts">` whose document is served with `Content-Security-Policy: default-src 'none'; script-src 'nonce-…'; connect-src 'none'; … sandbox allow-scripts`. That gives it an empty origin: no cookies, no storage, no network, no access to the Sidekick page. The document is self-contained (kit, fonts and game inline) and holds nothing about the child. The page accepts messages only from that frame's window, and only with a per-run token the kit keeps where game code cannot read it. `backend/games/checks.py` also rejects source that reaches for the network, storage, navigation, dynamic code, links or text inputs; that is hygiene, and the frame is the real boundary.

**3. The robot player.** `scripts/game-robot.mjs` plays every game in headless Chromium under the same policy and proves that it starts, that no round is already solved, that the declared solution wins every round, that every declared known mistake is recognised, rejected and tagged, that random play cannot win the last round more than a third of the time, that fresh numbers (other seeds) still work, that nothing is cut off, overlapping or too small on a phone and a tablet, and that there was no network request, navigation or script error. A failed run goes back to the model with the report, at most three times. Then a second model call reviews what a robot cannot judge. It stops a game only for a **blocker**: something a child would read or be taught that is false, a rule that is wrong, the wrong skill, or unkind words. A blocked game goes back to be fixed, at most twice, and the reviewer is handed its earlier blockers so it checks the fix instead of starting over. Everything else it notices (a round that plays like a quiz, a last round that reuses earlier numbers) is a **note**: it never stops a game, and it is shown beside the game to the person who reviews it.

**4. A person.** The pipeline's best outcome is `verified`. A game becomes `approved` only when a reviewer plays it at `/parent/games` (parent PIN required) and approves it. Reviewers are the accounts in `SIDEKICK_GAME_REVIEWERS`; in development and test an empty list lets any parent review. Retired games stay retired.

Games are never generated while a child waits. A build is a background job (one per skill, not retried for a day after a failure) or a CLI run. A child whose homework points at a skill with an approved game sees the game card. Until a game for that skill is approved, the child sees that one is on the way and nothing else to play. The card looks again every few seconds while the page is open, so it changes to the game by itself once the game is ready. If a build for the child's skill did not pass its checks, the card says there is no game this time instead of showing nothing.

Game results are recorded for the parent's Games tab. They come from the child's browser and are practice, so they do not change skill states and are not evidence.

```bash
npm run db:migrate                      # adds the game tables (migration 008)
npm run games:seed -- --workers 4       # loads every shipped game; each must pass the robot here first; they wait for review
npm run games:seed -- --subject math --grades K,1,2      # or one slice at a time: --subject, --grades, --only <folder>, --limit N
npm run games:verify                    # plays every shipped game with the robot; --subject, --grades, --only <folder> narrow it
npm run games:coverage                  # rewrites data/games/COVERAGE.md: which of the 1,533 skills have a game
npm run games:robot -- data/games/examples/froggys-bridge --shots /tmp/frog
npm run games:generate -- --subskill 4.NF.A.1-1        # needs VISION_* (or GAMES_MODEL); blocks until verified or failed
npm run games:generate -- --missing --grades K,1,2,3,4,5 --subject math --limit 50 --workers 3
npm run games:list
```

`--missing` skips any skill that already has a game, shipped or generated, so the same command can be run again and again until the catalog is covered. Each build is one to four model calls plus a robot run, so cost and time scale with `--limit`.

Settings, all in `backend/.env.example`: `SIDEKICK_GAMES_ENABLED` (default `true`; set it to `false` to hide games everywhere), `SIDEKICK_GAMES_REQUIRE_APPROVAL` (default `true`; keep it on for real families), `SIDEKICK_GAMES_AUTOGENERATE` (default `false`; queue a build when homework shows a skill with no game), `SIDEKICK_GAMES_PREMADE` (default `true`; set it to `false` to ignore the shipped games everywhere, as if they were never loaded, so every game comes from the model; they stay stored, so `true` brings them straight back), `SIDEKICK_GAMES_NEW_EVERY_UPLOAD` (default `false`; for testing the writer: every upload gets its own newly written game even when one exists for its skill, the writer is told what already exists so it makes something different, and the same page sent in again counts as a new upload; needs `SIDEKICK_GAMES_AUTOGENERATE` and a model), `SIDEKICK_GAME_REVIEWERS`, `SIDEKICK_GAMES_PLAYGROUND` (default `false`; temporary: gives reviewers a page at `/parent/playground` for trying any stored game), `GAMES_MODEL`, `GAMES_TIMEOUT_SECONDS`. The robot needs Node and Playwright's Chromium (`npx playwright install chromium`).

**Loading the library.** `games:seed` skips games that are already stored, so it can be stopped and run again. The robot takes a few seconds per game, so the whole library is roughly an hour with `--workers 4`; loading one grade at a time (`--subject math --grades 3`) takes a few minutes and is the natural way to feed the review queue. `python -m backend.games verify` is the same robot without the database, for checking the shipped files after a kit change.

**The shipped library.** `data/games/` holds 1,533 games, one for every skill in the skill map, kindergarten through high school:

- `examples/` (5): unit fractions, rectangle area, unit price, irregular plurals, facts within 10. These are the few-shot examples the model is shown.
- `library/` (1,528): 863 math games and 665 reading, writing and language games. `data/games/COVERAGE.md` lists every one and counts them by subject, grade, author and mechanic.

Most are built with **play patterns**: `Sidekick.play` (in `backend/games/kit/play.js`, documented in `KIT.md`) turns a short description into a full game using one of ten tested mechanics (`sort`, `row`, `fill`, `pick`, `build`, `dial`, `line`, `paint`, `plot`, `type`), with views for graphs, shapes, number lines, tables, matrices and more. A pattern supplies the stage, the live reaction, the win rule, the worked solution and the known slips; the game supplies the world, the words, the numbers and the misconception. 77 games are built by hand on the kit, and each `meta.json` records which pattern a game uses.

Read the counts before trusting the breadth. About 1,290 of the games use only the simpler mechanics (matching tiles to blanks, sorting cards, tapping, ordering, a keypad). They react and coach on the known slip, but by the brief's own test ("if it could be printed on paper, it has failed") many of them are closer to interactive practice than to a little world with a mission. About 170 use the richer mechanics (dials driving a graph or a model, number lines, grids, building), and the 77 hand-built games set the bar. Reviewers should expect to retire or rebuild a share of the simpler ones, especially in reading and in high school.

All 1,533 were written by Claude standing in for the model, to the same brief, kit and robot the pipeline uses. Every one passes the robot. None has been approved by a person: they are seeded as `verified`, so none reaches a child until a reviewer approves it. The pipeline has had one small run against a live provider: 12 skills from kindergarten to grade 6 (8 math, 4 reading and language) each produced a `verified` game, 9 on the first draft and 3 after one rewrite the model reviewer asked for, in 50 seconds to 3 minutes each. That is a small sample, not a pass rate. Before that run the model reviewer passed a game only when all six of its answers were yes; measured that way it turned down 14 of 14 shipped games, the five examples the model is shown included, and no live build got through. Sorting what it finds into blockers and notes, it passes 12 of the same 14 and stops two for real content errors. The kit has no sound, so early reading skills use pictures and letters, and open-ended writing skills are represented by a part that can be checked (ordering, choosing, fixing).

**Grades.** Games cover every grade in the skill map. High school courses and bands are stored with a grade number (Algebra 1 and 9-10 as 9, Geometry as 10, Algebra 2 and 11-12 as 11, Precalculus as 12) and can be offered when homework points at those skills. Child profiles are still K to 5, and skill matching looks at most one grade above the child's, so high school games are reachable only once profiles and matching reach those grades.

**What scales and what does not.** The robot checks a game in a few seconds with no person involved. Review is the bottleneck: 1,533 games for a person to play before children see them. The review page (`/parent/games`) is built for that: tabs for waiting, live and retired with counts, filters for subject and grade, search by title or skill id, and pages of 50, ordered by subject, grade and skill so a reviewer can work through one grade at a time. Start with the grades and skills real homework is hitting rather than the whole map. Many skills marked "needs an adult or AI rubric" in the skill map (open writing, read-aloud fluency, discussion) do not fit an auto-checked game well. Their games check a part that can be checked, and a fuller answer for those skills is still open work.

Known limits: a game shares one JavaScript realm with the kit, so a hostile game could fake what the robot sees; the robot and reviews are quality gates, and the frame is the security boundary. A frozen game can freeze its frame; the page watches a heartbeat and offers a restart. Review screenshots are not stored; reviewers play the game instead.

## Privacy, storage, and configuration

Account sessions, parent PINs, ownership checks, sibling isolation, profile switching, CSRF, and route protection remain in force. State-changing API requests require an exact trusted `Origin` and a session-bound `X-CSRF-Token` obtained from `GET /api/auth/csrf`. Parent mode expires after 30 idle minutes; five wrong PINs lock the account gate for five minutes. Passwords and PINs use Argon2id. Keep `PASSWORD_POLICY=strict`, HTTPS, and secure cookies before a pilot; local development explicitly uses `APP_ENV=development`, `PASSWORD_POLICY=dev`, `COOKIE_SECURE=false`, and `TRUSTED_ORIGINS=http://localhost:3000`.

Original uploads and rendered pages are retained privately under the database directory's `uploads/` by default (`backend/data/uploads/`). Opaque filenames, mode 0600 files, and a mode 0700 directory are used. This location is Git-ignored and outside public assets. Override `SIDEKICK_PRIVATE_UPLOAD_DIR` only with another private, ignored directory, preferably outside the repository. Files are retrieved through authorized routes, never public URLs.

Parent deletion removes an upload's original/pages, problems, and linked student work evidence, then recomputes affected states. Historical diagnostic/practice records are retained privately; the retired workflow cannot resume them. A game run keeps its record when its originating upload is deleted; the upload link is cleared. Deleting a child cascades its private learning and game records, removes rows and recordings left from the retired activity system, and cleans its private files. There is no automatic retention deadline; parents delete retained uploads explicitly. Backups need the same privacy controls.

Before model image calls, EXIF metadata is stripped and the top 6% of each page is masked by default. Known names/account identifiers and obvious email addresses are redacted from text model payloads. **This is not complete image de-identification:** names elsewhere in an image can reach the configured provider, and masking can hide a title or question. Model prompts treat uploaded work/catalog content as data. Private audits store internal references, task/model/prompt/catalog versions, outcome/confidence, and short redacted explanations. Ordinary errors/logs exclude uploaded page content, provider bodies, credentials, and filenames.

| Backend setting | Default | Supported range / effect |
| --- | --- | --- |
| `SIDEKICK_PRIVATE_UPLOAD_DIR` | Database sibling `uploads/` | Private storage, outside `public/` |
| `SIDEKICK_MAX_UPLOAD_MB` | `10` | 1–30 MiB for the learning upload API |
| `SIDEKICK_MAX_PDF_PAGES` | `6` | 1–12 pages |
| `SIDEKICK_MAX_PAGE_PIXELS` | `24000000` | 4,096–24,000,000 rendered pixels/page |
| `SIDEKICK_MAX_TOTAL_PIXELS` | `72000000` | 4,096–144,000,000 rendered pixels/PDF |
| `SIDEKICK_PDF_TIMEOUT_SECONDS` | `20` | 2–60 seconds, isolated renderer CPU/wall deadline |
| `SIDEKICK_PDF_MEMORY_MB` | `1024` | 256–2,048 MiB process memory ceiling where supported |
| `SIDEKICK_HEADER_REDACTION_FRACTION` | `0.06` | 0–0.2 of page height; zero disables masking |

The PDF renderer rejects encrypted/invalid/oversized files and caps rendered output at 128 MiB. Photos also pass the reader's JPEG/PNG/WebP/HEIC/HEIF integrity, single-frame, minimum 64-pixel dimension, and 24-megapixel checks. Both upload APIs use the configured size bound. Limits apply before provider calls. The renderer is a bounded local process, not a hardened isolation service.

## API and extraction contract

The product calls uploads **Student work** and explicitly welcomes worksheets, quizzes, tests, and other schoolwork. Existing internal `homework` identifiers, database tables, `/kid/homework` links, and the extraction contract’s `worksheet` field stay unchanged for compatibility. This wording change does not alter stored records or interpretation of printed source text.

`POST /api/extract` retains the authenticated multipart `file` extraction response: `worksheet`, `problems`, and `source`. [Pydantic models](backend/models.py), [JSON Schema](backend/schema.json), [TypeScript types](lib/extraction.ts), and [fixtures](fixtures/README.md) document the contract. Every transcribed field is `{ "text": "legible text or null", "uncertain": false }`; partial text is retained with `uncertain: true`. Completely unreadable final/selected answers normalize answered status to unclear. Extraction never replaces a student's incorrect work with a solution.

`POST /api/images/preview` accepts one multipart `file` from the authenticated active child and returns a validated, metadata-free PNG for HEIC/HEIF previews. It requires CSRF, applies the same file and image limits, rechecks the active profile after conversion, and sets `Cache-Control: no-store`. Preview conversion stays in memory; it creates no upload record and makes no model call.

The student-work API adds:

| Route under `/api/learning` | Purpose |
| --- | --- |
| `POST /kid/uploads` | Store/process active child's multipart `file`; optional `Idempotency-Key` |
| `GET /kid/uploads`, `GET /kid/uploads/{id}` | Resume list and processing/extraction results |
| `POST /kid/uploads/{id}/retry`, `GET /kid/uploads/{id}/file` | Resume processing or authorized original retrieval |
| `/parent/{kidId}/uploads` and `/{id}` variants | Equivalent explicitly selected-child parent operations; `DELETE .../{id}` deletes |
| `GET /parent/{kidId}/dashboard` | Skill observations (each with its parent-facing `area`) and analytics from uploaded student work |
| Former `/kid/next`, `/kid/submit`, `/kid/session/{id}/activity`, and parent adult/extra-practice routes | Retired; authorized requests return `410 feature_removed` |

Kid responses contain extraction; detailed mapping, grading, signatures, and learning states belong to authorized parent routes. API errors retain `{ "error": { "code": "...", "message": "..." } }`, use safe messages, and responses are `Cache-Control: no-store`.


The games API is separate from retired practice routes:

| Route under `/api/games` | Purpose |
| --- | --- |
| `GET /kid/suggestion?uploadId=...` | What the active child can play for a completed upload: `ready`, `in_review`, `building`, `none`, or `off` |
| `POST /kid/request` | Queue a background build when autogeneration is on and the skill has no game |
| `POST /kid/start` | Start or resume an idempotent child-owned run of the approved game |
| `GET /kid/runs/{id}`, `GET /kid/runs/{id}/frame` | The run, and the self-contained locked document the game plays in |
| `POST /kid/runs/{id}/finish` | Save the result once, checked against the run's message token |
| `GET /parent/{kidId}/history` | The selected child's game runs after parent authorization |
| `GET /review/me`, `GET /review`, `GET /review/{id}`, `GET /review/{id}/frame` | Reviewer check, the filtered and paged review list, one game, and its playable frame |
| `POST /review/{id}/decision` | Approve or retire a game (reviewers only, parent PIN required) |

The routes of the retired activity system (`/api/activities/...`) and its page (`/kid/activities/...`) no longer exist.

## Verification and evaluation

```sh
npm run test:backend
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
npm run gap:evaluate
# Explicit provider calls using the same retrieval/grading/mapping/signature pipeline:
npm run gap:evaluate:live
# Include synthetic case IDs and expected/actual decisions, without uploaded page text:
npm run gap:evaluate:live -- --details
# Play every shipped game with the robot (about an hour), or one slice of them:
npm run games:verify
npm run games:verify -- --subject math --grades 3
```

Stop servers on ports 3000/8000 before Playwright; its configuration starts isolated servers. Unit/integration tests stub model calls and use temporary databases. Coverage includes authentication/PIN/CSRF, extraction preservation, invalid images/PDFs, provider failure and retry, child/account isolation and profile changes, catalog reseeding/history, distinct student work observations, retired-workflow enforcement, historical-data preservation, and real dashboard data. Browser journeys verify that the old Practice URL redirects, retired APIs cannot start questions, and private student work upload/retrieval/deletion still works. Game verification covers which skill an upload points at, the approval gate, the locked frame, the robot player, seeding and review at library size, and a browser journey from an uploaded page to a finished game and the parent's history.

`data/evaluation_homework.json` contains 27 synthetic Math/ELA examples with expected mapping or abstention, correctness, and signature labels, including mistakes/slips, equivalent fractions, blanks, unreadable responses, shared context, missing context, and ambiguous multi-skill work. The offline command validates cases and catalog IDs; it does **not** measure model accuracy. The live command creates a temporary database/catalog and reports mapping coverage, accuracy among accepted mappings, grading accuracy, eligible incorrect signature accuracy, and provider failures. Missing credentials exit with setup instructions. No real student data is used.

Verification on the games-only tree, run on a clean clone: **257 backend tests** (plus 1,528 per-game robot tests behind `SIDEKICK_GAMES_VERIFY_LIBRARY=1`), **all 28 browser cases**, TypeScript, and the production build. The browser cases cover accounts and the PIN gate, the worksheet reader (including the slow-reader proxy, retry and HEIC cases), student-work observations, the review page at library size, and three game journeys: a waiting game stays hidden until a parent approves it in the review page and is then played to the end with real taps and drags inside the locked frame; a reading page leads to its own game and a second visit resumes the same run; and a page with no reliable skill match shows the reading and no card. Browser model decisions are explicitly controlled fixtures in isolated databases/private folders; production APIs/auth remain intact. Headless tests cannot exercise the native macOS Photos dialog itself.

The whole library was last replayed by the robot on a fresh database with 1,533 of 1,533 games passing; the game files, the kit and the robot have not changed since. No game has been written by a live provider, none is approved by a person, and none of this establishes real-child learning or broad model reliability.

The earlier activity system (fixed controls composed per request, its library, coverage map and live verification reports) was removed in favor of games. Its last version is in the git history at commit `d6f84a4`.

The earlier [structured-decision evaluation](data/evaluation_report.json) records zero provider failures, 22/27 accepted mappings (all 22 correct), 27/27 grading matches, and 5/7 signature matches. All five expected mapping abstentions were retained. These observations never override correctness.

This is an initial smoke evaluation: the 27 answer/status variants use only 12 unique question texts, with seven positive stems largely taken from the catalog. It measures decisions after transcription, not OCR accuracy or general classroom performance, and does not calibrate confidence scores. The historical [separate live smoke report](data/live_smoke_report.json) covers synthetic Math/ELA photos and the now-retired practice-item generation workflow: three addition items passed deterministic checking, independent solving, and alignment; three fraction items were aligned but correctly retained for adult adjudication. A follow-up Math photo retained the incorrect fraction after an initial exact-string comparison did not match; transcription can vary. Both subjects distinguished blank and unreadable responses. The generation results are retained as historical validation, not an active product feature. Broader transcription accuracy remains unmeasured. Missing contexts, unsupported interactions, unsafe source links, and lexical retrieval remain draft-data limitations.

Automatic progress or mastery rules, tutoring chat, payments, email delivery/recovery, and expanded grade profiles remain separate milestones.
