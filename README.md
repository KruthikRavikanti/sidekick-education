# Sidekick

Sidekick is a local K–5 family prototype built with Next.js/TypeScript, FastAPI/Pydantic, and SQLite. Parents create profiles, unlock a PIN-protected dashboard, and review worksheet evidence and practice. Children upload a photo or PDF, review the verbatim extraction, and open their next practice session. The existing [Sidekick design kit](https://preview--sidekick-colorway-studio.lovable.app/?__lovable_receipt=mat_6nx4bc71428r69zqdx974t1cnk), colors, components, and locally hosted fonts are retained.

The gap engine extends the parent-account implementation. Its branch, `feature/gap-engine`, is stacked on `feature/parent-accounts-dashboard` ([PR #1](https://github.com/KruthikRavikanti/sidekick-education/pull/1)); review the gap changes against that parent branch while it remains unmerged.

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
npm run dev:all
```

Open **http://localhost:3000** after the launcher prints that Sidekick is ready. Keep the terminal open; Ctrl+C stops both servers. The launcher checks ports 3000/8000 and dependencies without switching ports. `npm run dev` starts only Next.js. To start FastAPI separately:

```sh
backend/.venv/bin/uvicorn backend.main:app --host 127.0.0.1 --port 8000 --no-access-log
```

Retain existing credentials when pulling updates. Add new settings from `backend/.env.example` instead of overwriting `backend/.env`. FastAPI reads that file; Next.js uses `.env.local` only for its server-side `BACKEND_URL` proxy. Restart servers after changing configuration. Never put credentials in `NEXT_PUBLIC_*` variables.

Set **`VISION_API_KEY`** and **`VISION_MODEL`** in `backend/.env` to enable live extraction, mapping, language grading, generation, and independent verification through the same adapter. The provider must support image input and strict JSON Schema on an OpenAI-compatible `/chat/completions` endpoint. `VISION_BASE_URL` defaults to `https://api.openai.com/v1`; `VISION_TIMEOUT_SECONDS` defaults to 60 (1–180). HTTPS is required except on loopback. No provider/model is silently selected.

For an offline extraction walkthrough:

```sh
APP_ENV=development PASSWORD_POLICY=dev COOKIE_SECURE=false npm run db:seed
npm run dev:demo
```

The optional seed creates `parent@example.com` / `password`, Alex (grade 3), and Maya (grade 1). The PIN starts unset; repeated seeding preserves existing credentials and profiles. Sign in, choose Parent, verify the account password to set a 4–6 digit PIN, and unlock the dashboard. Switch profile to choose a child and open homework or practice.

Demo mode accepts only the two exact images under `public/samples/` and labels extraction `source: "fixture"`. It creates no fabricated learning evidence. New assignments may remain awaiting items without the configured provider; automated tests inject explicit model stubs.

## Migrations and catalog seeding

Run these after pulling migrations or catalog/compiler changes:

```sh
npm run db:migrate
npm run catalog:seed
# Optional: save the import report, or import a reviewed catalog revision.
npm run catalog:seed -- --report /tmp/sidekick-catalog-report.json
npm run catalog:seed -- --path /path/to/reviewed-catalog.json
```

Migrations `001`–`004` add accounts, the catalog, learning records, and private homework storage. Already-applied migrations are skipped. `DATABASE_URL` defaults to `sqlite:///backend/data/sidekick.db`; relative SQLite paths resolve from the repository root. Back up the database and private uploads together before moving this local prototype.

`data/sidekick_skill_map_v2.json` is the supplied, unchanged draft. Its SHA-256 is `7c7b3a98cdf51bb48b53bcef4c4d5e2c0015fc0845e40f6345a4962eeab1be23`. It contains **779 skills, 1,533 subskills, and 3,066 populated seed pairs**: 867 Math, 666 Reading/ELA, and 795 K–5 subskills. K–8 grades have explicit ordering; high-school math courses and ELA bands retain their separate string labels. Profiles remain K–5.

The importer validates before a transaction, upserts stable IDs, preserves every raw source field, and derives subskill order from the numeric suffix. Seed slots have stable logical IDs (`subskill:p1` / `subskill:p2`) and immutable content versions. Reseeding replaces current relationships and retires removed records; attempts and assignment references keep their exact historical item versions. Repeating an unchanged import does not duplicate items.

The checked-in [import report](data/catalog_import_report.json) records all counts and 37 graph warnings: 28 Low-confidence roots, five upward prerequisite directions, and four cycle edges across root/skill graphs. This includes the High-confidence `A-SSE.B.3-1` ↔ `A-REI.B.4-3` cycle and Algebra 1 → Algebra 2 links. Raw links remain stored; unsafe links are excluded from traversal. Runtime traversal also uses visited nodes and a depth limit.

Current conservative compilation yields **101 ready, verified solo items**, **1,941 adult-required items**, and **1,024 missing-context items**. All 3,066 seed pairs are retained. Complete adult tasks await parent adjudication; they are never silently treated as automatically verified. Missing passages, choices, plots, and dependencies are not invented. Compiler changes can produce new item versions without altering the supplied curriculum.

## Homework and practice behavior

Upload a JPG, PNG, WebP, or bounded PDF from the active child's homework area. Parents may also upload from the dashboard with a selected child. Preview, tap **Read worksheet**, and review problems in page order. Extraction preserves written mistakes, step order, fractions, shared context, and field-level uncertainty. Blank and unreadable responses remain distinct. Grading and mapping are separate stages; unsupported, blank, ambiguous, or unreadable work stays ungraded and cannot create incorrect evidence.

Candidate retrieval uses the same subject and grades up to one above the child's grade, with at most ten candidates. High-school labels stay outside the K–5 retrieval window. Mapping below 0.6 abstains. A confidently mapped incorrect answer can separately receive a visible-work error-pattern observation. Teacher marks are observations; conflicts with grading are flagged for review. Scores are initial routing estimates, not calibrated assessment probabilities.

Persistent uploads checkpoint extraction, grading, mapping, signatures, and evidence. Request keys, child-scoped file hashes, and problem fingerprints suppress recognized retries and duplicates. A stopped process can resume through **Retry** after its processing lease expires; this prototype uses in-process background tasks rather than a durable job worker. Authorization is rechecked after provider work and before returning profile-scoped results.

Learning thresholds live in **`backend/gap/config.json`**:

- Two distinct incorrect homework problems initiate one five-item check. One error leaves the current status unchanged. A check with two misses confirms a difficulty; four or five correct establishes a fresh evidence baseline.
- Prerequisite checks follow the first valid High/Medium root in source order, with a default depth limit of eight. The earliest confirmed prerequisite difficulty is practiced first; descendants wait and require their own evidence.
- Mastery requires three consecutive eligible independent practice answers across two dates. Hints, reveals, repeated questions, homework, and diagnostic checks cannot manufacture that streak; reading aloud is allowed accessibility support.
- Rechecks are due after 21 calendar days and contain exactly two items. Both must be correct to retain mastery; an eligible miss returns the skill to practice. Ungraded responses leave assignments pending.

All learning dates, Monday-based weeks, and recheck scheduling use **`America/New_York`** from that configuration and server timestamps. Sessions target 5–8 items while retaining assignment boundaries; a two-item recheck can stand alone. Unfinished sessions resume. Checks precede active-gap practice, followed by due rechecks. An assignment stays awaiting items when enough suitable questions cannot be prepared.

Checks use usable seed items plus verified equivalents generated for the same subskill. Generation is bounded by two retries and concurrency two. Supported generated math must pass deterministic verification and an independent solver that cannot see the proposed answer. Verification also requires subskill/difficulty alignment and preserves positively identifiable arithmetic families, including fraction operands, operations, and place value. A second model's agreement does not verify unsupported content. Child responses use exact rational/decimal checking, form and unit rules, stable choice IDs, or explicit supported interaction validators. Answer keys and grading specifications remain server-side.

Speech, writing, drawing, and unsupported solo tasks appear in the parent's **Try this together** area with their full prompt, expected response/rubric, and home tip. Parents record correct, incorrect, or unclear and whether the response was independent. K/grade-1 items include a read-aloud reminder. **Send extra practice** creates or reuses an assignment without adding learning evidence.

The dashboard uses real records and shows unassessed, on track, checking, gap, practicing, and mastered with supporting evidence and traceback. Skills without evidence stay unassessed. Sessions this week count persisted sessions started since Monday; time sums their recorded active seconds, bounded by server elapsed time and 120 seconds per heartbeat, rounded down to minutes. Attempted/correct/ungraded totals count distinct practice/check/recheck assignment slots across history, using each slot's first accepted final grade. Homework evidence is shown separately. Conversation history remains empty until a future chat milestone.

## Privacy, storage, and configuration

Account sessions, parent PINs, ownership checks, sibling isolation, profile switching, CSRF, and route protection remain in force. State-changing API requests require an exact trusted `Origin` and a session-bound `X-CSRF-Token` obtained from `GET /api/auth/csrf`. Parent mode expires after 30 idle minutes; five wrong PINs lock the account gate for five minutes. Passwords and PINs use Argon2id. Keep `PASSWORD_POLICY=strict`, HTTPS, and secure cookies before a pilot; local development explicitly uses `APP_ENV=development`, `PASSWORD_POLICY=dev`, `COOKIE_SECURE=false`, and `TRUSTED_ORIGINS=http://localhost:3000`.

Original uploads and rendered pages are retained privately under the database directory's `uploads/` by default (`backend/data/uploads/`). Opaque filenames, mode 0600 files, and a mode 0700 directory are used. This location is Git-ignored and outside public assets. Override `SIDEKICK_PRIVATE_UPLOAD_DIR` only with another private, ignored directory, preferably outside the repository. Files are retrieved through authorized routes, never public URLs.

Parent deletion removes an upload's original/pages, problems, and linked homework evidence, then recomputes affected states. Independent diagnostic/practice history remains. Deleting a child cascades its learning records and cleans its private files. There is no automatic retention deadline; parents delete retained uploads explicitly. Backups need the same privacy controls.

Before model image calls, EXIF metadata is stripped and the top 6% of each page is masked by default. Known names/account identifiers and obvious email addresses are redacted from text model payloads. **This is not complete image de-identification:** names elsewhere in an image can reach the configured provider, and masking can hide a title or question. Model prompts treat worksheet/catalog content as data. Private audits store internal references, task/model/prompt/catalog versions, outcome/confidence, and short redacted explanations. Ordinary errors/logs exclude worksheet content, provider bodies, credentials, and filenames.

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

The PDF renderer rejects encrypted/invalid/oversized files and caps rendered output at 128 MiB. Photos also pass the reader's JPEG/PNG/WebP integrity, single-frame, minimum 64-pixel dimension, and 24-megapixel checks. Both upload APIs use the configured size bound. Limits apply before provider calls. The renderer is a bounded local process, not a hardened isolation service.

## API and extraction contract

`POST /api/extract` retains the authenticated multipart `file` extraction response: `worksheet`, `problems`, and `source`. [Pydantic models](backend/models.py), [JSON Schema](backend/schema.json), [TypeScript types](lib/extraction.ts), and [fixtures](fixtures/README.md) document the contract. Every transcribed field is `{ "text": "legible text or null", "uncertain": false }`; partial text is retained with `uncertain: true`. Completely unreadable final/selected answers normalize answered status to unclear. Extraction never replaces a student's incorrect work with a solution.

The learning API adds:

| Route under `/api/learning` | Purpose |
| --- | --- |
| `POST /kid/uploads` | Store/process active child's multipart `file`; optional `Idempotency-Key` |
| `GET /kid/uploads`, `GET /kid/uploads/{id}` | Resume list and processing/extraction results |
| `POST /kid/uploads/{id}/retry`, `GET /kid/uploads/{id}/file` | Resume processing or authorized original retrieval |
| `/parent/{kidId}/uploads` and `/{id}` variants | Equivalent explicitly selected-child parent operations; `DELETE .../{id}` deletes |
| `POST /kid/next`, `POST /kid/submit` | Resume practice and submit an idempotent attempt |
| `POST /kid/session/{id}/activity` | Record bounded active time |
| `GET /parent/{kidId}/dashboard`, `GET /parent/{kidId}/adult` | Real dashboard and adult queue |
| `POST /parent/{kidId}/adult/submit`, `POST /parent/{kidId}/extra-practice` | Parent adjudication and assignment preparation |

Kid responses contain extraction and encouraging practice UI; detailed mapping, grading, signatures, and learning states belong to authorized parent routes. API errors retain `{ "error": { "code": "...", "message": "..." } }`, use safe messages, and responses are `Cache-Control: no-store`.

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
# Include synthetic case IDs and expected/actual decisions, without worksheet text:
npm run gap:evaluate:live -- --details
```

Stop servers on ports 3000/8000 before Playwright; its configuration starts isolated servers. Unit/integration tests stub model calls and use temporary databases. Coverage includes authentication/PIN/CSRF, extraction preservation, invalid images/PDFs, provider failure and retry, child/account isolation and profile changes, catalog reseeding/history, distinct errors, check outcomes, shared-root chains/cycles, independent practice across dates, assistance/repetition exclusions, rechecks, adult adjudication, and real dashboard data.

`data/evaluation_homework.json` contains 27 synthetic Math/ELA examples with expected mapping or abstention, correctness, and signature labels, including mistakes/slips, equivalent fractions, blanks, unreadable responses, shared context, missing context, and ambiguous multi-skill work. The offline command validates cases and catalog IDs; it does **not** measure model accuracy. The live command creates a temporary database/catalog and reports mapping coverage, accuracy among accepted mappings, grading accuracy, eligible incorrect signature accuracy, and provider failures. Missing credentials exit with setup instructions. No real student data is used.

Verification passed: **195 backend tests, 15 browser tests, TypeScript, and the production build**. Candidate retrieval finds the expected ID within ten candidates for all 22 labeled cases. The [live evaluation report](data/evaluation_report.json) records zero provider failures, 22/27 accepted mappings (all 22 correct), 27/27 grading matches, and 5/7 signature matches. The other five examples correctly abstained from mapping. The two signature disagreements concern an arithmetic slip and a reading-evidence pattern; these observations never override correctness.

This is an initial smoke evaluation: the 27 answer/status variants use only 12 unique question texts, with seven positive stems largely taken from the catalog. It measures decisions after transcription, not OCR accuracy or general classroom performance, and does not calibrate confidence scores. The [separate live smoke report](data/live_smoke_report.json) covers synthetic Math/ELA photos and generation: three addition items passed deterministic checking, independent solving, and alignment; three fraction items were aligned but correctly retained for adult adjudication. A follow-up Math photo retained the incorrect fraction after an initial exact-string comparison did not match; transcription can vary. Both subjects distinguished blank and unreadable responses. Broader generation and transcription accuracy remain unmeasured. Missing contexts, unsupported interactions, unsafe source links, and lexical retrieval remain draft-data limitations.

Games, tutoring chat, payments, email delivery/recovery, expanded grade profiles, and a visual redesign remain separate milestones.
