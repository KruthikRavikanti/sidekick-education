# Sidekick

Sidekick is a local K–5 family prototype built with Next.js/TypeScript, FastAPI/Pydantic, and SQLite. Parents create profiles, unlock a PIN-protected dashboard, and review uploaded student work. Children upload a photo or PDF of a worksheet, quiz, test, or other Math/ELA work and review the verbatim extraction. A reliably identified catalog skill can lead to a guided activity and a fresh independent question. When no verified library activity matches, the model composes and reviews a new one. The former standalone Practice section and diagnostic quizzes remain retired. The existing [Sidekick design kit](https://preview--sidekick-colorway-studio.lovable.app/?__lovable_receipt=mat_6nx4bc71428r69zqdx974t1cnk), colors, components, and locally hosted fonts are retained.

Parent accounts and student-work observations are already merged into `main` ([PR #1](https://github.com/KruthikRavikanti/sidekick-education/pull/1), [PR #2](https://github.com/KruthikRavikanti/sidekick-education/pull/2)). The activity milestone branches from that current implementation and keeps its account, PIN, upload, and route-protection behavior.

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
npm run activities:seed
npm run dev:all
```

Open **http://localhost:3000** after the launcher prints that Sidekick is ready. Keep the terminal open; Ctrl+C stops both servers. The launcher checks ports 3000/8000 and dependencies without switching ports. `npm run dev` starts only Next.js. To start FastAPI separately:

```sh
backend/.venv/bin/uvicorn backend.main:app --host 127.0.0.1 --port 8000 --no-access-log
```

Retain existing credentials when pulling updates. Add new settings from `backend/.env.example` instead of overwriting `backend/.env`. FastAPI reads that file; Next.js uses `.env.local` only for its server-side `BACKEND_URL` proxy. Restart servers after changing configuration. Never put credentials in `NEXT_PUBLIC_*` variables.

Set **`VISION_API_KEY`** and **`VISION_MODEL`** in `backend/.env` to enable live extraction, skill mapping, supported language grading, error-pattern observations, and on-demand activity composition through the shared adapter. The provider must support image input and strict JSON Schema on an OpenAI-compatible `/chat/completions` endpoint. `VISION_BASE_URL` defaults to `https://api.openai.com/v1`; `VISION_TIMEOUT_SECONDS` defaults to 60 (1–180). HTTPS is required except on loopback. No provider/model is silently selected.

For an offline extraction walkthrough:

```sh
APP_ENV=development PASSWORD_POLICY=dev COOKIE_SECURE=false npm run db:seed
npm run dev:demo
```

The optional seed creates `parent@example.com` / `password`, Alex (grade 3), and Maya (grade 1). The PIN starts unset; repeated seeding preserves existing credentials and profiles. Sign in, choose Parent, verify the account password to set a 4–6 digit PIN, and unlock the dashboard. Switch profile to choose a child and tap **Upload work**.

Demo mode accepts the exact bundled worksheet fixtures under `public/samples/` and labels extraction `source: "fixture"`. It creates no fabricated learning evidence. Automated tests inject explicit model stubs for student-work analysis and activity generation. Demo mode alone does not fabricate the reliable grading and skill mapping needed to suggest an activity.

## Migrations and library seeding

Run these after pulling migrations, catalog/compiler changes, or reviewed activity-library changes:

```sh
npm run db:migrate
npm run catalog:seed
npm run activities:seed
# Optional: save the import report, or import a reviewed catalog revision.
npm run catalog:seed -- --report /tmp/sidekick-catalog-report.json
npm run catalog:seed -- --path /path/to/reviewed-catalog.json
```

Migrations `001`–`004` add accounts, the catalog, learning records, and private student work storage. Migration `005` retires the former check/practice workflow, archives its skill-state snapshot privately, and closes pending assignments, sessions, and chains without deleting historical attempts or evidence. Migration `006` adds activity source revisions, immutable activity versions, child-owned sessions/attempts, retry reservations, and scene events. It does not change migration `005` or restore retired endpoints. Already-applied migrations are skipped. `DATABASE_URL` defaults to `sqlite:///backend/data/sidekick.db`; relative SQLite paths resolve from the repository root. Back up the database and private uploads together before moving this local prototype.

`data/sidekick_skill_map_v2.json` is the supplied, unchanged draft. Its SHA-256 is `7c7b3a98cdf51bb48b53bcef4c4d5e2c0015fc0845e40f6345a4962eeab1be23`. It contains **779 skills, 1,533 subskills, and 3,066 populated seed pairs**: 867 Math, 666 Reading/ELA, and 795 K–5 subskills. K–8 grades have explicit ordering; high-school math courses and ELA bands retain their separate string labels. Profiles remain K–5.

The importer validates before a transaction, upserts stable IDs, preserves every raw source field, and derives subskill order from the numeric suffix. Seed slots have stable logical IDs (`subskill:p1` / `subskill:p2`) and immutable content versions. Reseeding replaces current relationships and retires removed records; attempts and assignment references keep their exact historical item versions. Repeating an unchanged import does not duplicate items.

The checked-in [import report](data/catalog_import_report.json) records all counts and 37 graph warnings: 28 Low-confidence roots, five upward prerequisite directions, and four cycle edges across root/skill graphs. This includes the High-confidence `A-SSE.B.3-1` ↔ `A-REI.B.4-3` cycle and Algebra 1 → Algebra 2 links. Raw links remain stored and unsafe links are marked unusable. The current student work flow does not initiate prerequisite traversal or checks.

The retained catalog compiler records **101 ready, verified item specifications**, **1,941 adult-required specifications**, and **1,024 missing-context specifications**. All 3,066 seed pairs and their immutable versions remain curriculum data. The new activity composer uses the supported catalog skill and misconception; it does not turn this question bank into standalone quizzes. Missing passages, choices, plots, and dependencies are not invented.

## Student work observations

Upload a JPG, PNG, WebP, HEIC/HEIF photo, or bounded PDF from the active child's **Upload work** action. The photo chooser uses the image wildcard so Mac Photos can offer images without the former narrow format filter. HEIC/HEIF photos receive a temporary PNG preview before **Read my work**; the original file is submitted and stored privately when reading starts. Parents may also upload from the dashboard with a selected child. Preview, tap **Read my work**, and review problems in page order. Extraction preserves written mistakes, step order, fractions, shared context, and field-level uncertainty. Blank and unreadable responses remain distinct. Grading and mapping are separate stages; unsupported, blank, ambiguous, or unreadable work stays ungraded and cannot create incorrect skill evidence.

After updating an older checkout, install the updated backend dependencies with `backend/.venv/bin/python -m pip install -r backend/requirements.txt` and restart the app. If a native file chooser is already open, cancel it, refresh Sidekick, and reopen **Choose an image** so it uses the updated format filter.

Candidate retrieval uses the same subject and grades up to one above the child's grade, with at most ten candidates. High-school labels stay outside the K–5 retrieval window. Mapping below 0.6 abstains. A confidently mapped incorrect answer can separately receive a visible-work error-pattern observation. Teacher marks are observations; conflicts with grading are flagged for review. Scores are initial routing estimates, not calibrated assessment probabilities.

Persistent uploads checkpoint extraction, grading, mapping, signatures, and evidence. Request keys, child-scoped file hashes, and problem fingerprints suppress recognized retries and duplicates. A stopped process can resume through **Retry** after its processing lease expires; this prototype uses in-process background tasks rather than a durable job worker. Authorization is rechecked after provider work and before returning profile-scoped results.

The parent Skills view summarizes eligible student work evidence:

| Status | Meaning |
| --- | --- |
| `unassessed` | There is not enough reliable student work evidence to summarize the skill. |
| `on_track` | At least one eligible correct response supports progress, with no eligible incorrect responses. |
| `needs_support` | One confidently graded, eligible incorrect response shows where support may help. This is a student work observation, not a confirmed diagnostic result. |

`backend/gap/config.json` contains the application timezone, mapping confidence threshold, and number of distinct incorrect student work responses needed for a support observation.

A repeated upload of the same question does not create a second observation. Ungraded or unmapped outcomes remain available for review without affecting skill states. The dashboard includes the source student work and any observed error pattern, parent explanation, and home tip. It does not initiate diagnostic checks, prerequisite quizzes, practice sessions, or scheduled rechecks. Student work alone does not award mastery.

The parent Analytics view currently shows **Questions read**, **Correct answers**, and **Not graded yet** from stored student work problems. Questions are deduplicated by child-scoped problem fingerprint. Each distinct question uses its first usable correct/incorrect grade in chronological order; if it has no usable grade, it stays ungraded. Mapping eligibility determines skill observations separately, so an unmapped but confidently graded problem can still count as a correct answer. Session counts, time spent, and retired practice totals are not presented as activity progress. Activity attempts have their own parent history. Server timestamps and the configured application timezone, **`America/New_York`**, are retained. Conversation history remains empty until a future chat milestone.

The former Practice URL redirects to the child's home. Authenticated calls to retired check/practice/adult-review endpoints return `410 feature_removed` after the existing mode, ownership, and CSRF checks. Old pending work is retired by migration; historical records are retained privately and cannot continue generating evidence through those endpoints.

## First activity flow

After **Read my work**, the results page polls the protected server for processing progress. A clear question confidently mapped to an active K–8 Math or Reading/ELA catalog skill makes **Try an activity** available. Activity availability does not depend on an existing library match, an incorrect answer, or automatic grading being available. The server prioritizes eligible incorrect responses, then correct work, then other reliably mapped questions, preserving page order within each group. Unreadable questions, low-confidence mappings, and teacher conflicts cannot select an activity. The child does not answer setup questions or select a grade.

Activity availability is independent of the parent skill-status label. Correct work can remain `on_track`; an ungraded response can lead to a lesson without becoming incorrect evidence or `needs_support`. Completing an activity does not change those uploaded-work states or award mastery. Misconception tags are curriculum focus metadata, not a claim that the child made that mistake. A page without a reliable skill match asks for a clearer photo; a page with a reliable match and no library activity offers generation.

To try both paths locally with the configured live provider, select a grade-3 child and upload the included [fraction work](public/samples/activity-math-work.png) or [plural-word work](public/samples/activity-ela-work.png). These synthetic pages contain an incorrect response. The [all-correct fraction work](public/samples/activity-math-correct-work.png) and [all-correct plural-word work](public/samples/activity-ela-correct-work.png) demonstrate activities from correct responses. Tap **Read my work**, wait for analysis, then **Try an activity**. The older Fractions/Reading sample buttons remain transcription examples; fixture mode does not fabricate grading or mapping. Browser tests replace only the external decision stage in an isolated test database.

The two original examples retain their specialized interactions; family profiles remain K–5:

| Path | Catalog subskill | Activity and independent check |
| --- | --- | --- |
| Math | `3.NF.A.1-2` — know that a/b is a copies of 1/b | Build a fraction from equal pieces or place it on a number line, then answer a fresh fraction question without the visual. Denominators are restricted to 2, 3, 4, 6, and 8. |
| ELA | `L.3.1-2` — form and use regular and irregular plural nouns | Build a plural with word tiles or choose a word form, receive pattern feedback, then write the plural of a fresh word without tiles, options, or hints. |

Other mapped K–8 skills, including multiplicative comparisons, unit rates, and reading comprehension, use the general generation path. Try the [comparison work](public/samples/activity-math-general-work.png) or [reading-evidence work](public/samples/activity-ela-general-work.png) with a grade-3 child. These are original synthetic pages. The existing profile/candidate grade window remains in force; high-school catalog bands are excluded.

Sidekick first looks for a ready, verified activity matching the exact subskill, misconception, grade, and supported difficulty bounds, preferring an unseen version. When no strong unseen match is available, the shared server-side model adapter composes a new **ActivitySpec**. The model chooses 3–6 scenes, teaching text, prompts, inline passages/data, controls, feedback, and transitions. General activities must pass a separate model review before they are stored as verified or shown. Generation also works with an empty example library and records an empty source revision without inventing references.

The renderer accepts a closed vocabulary: the six original fraction/plural interactions plus `guided_choice`, `guided_response`, and `independent_response`. General guided scenes include a teaching tip and an interaction, with all needed passage or problem data supplied inline. Two to five guided scenes precede exactly one independent scene. The final scene keeps context needed to answer, such as a reading passage, but removes teaching tips, choices, and hints. Its first submitted response is saved separately from guided work. Controls support phones and keyboards.

Before storage or rendering, Pydantic models validate bounded parameters, required context, choice keys, linear transitions, teaching content, and plain text. Schema 1.0 activities retain deterministic fraction/plural validation. Schema 1.1 permits general catalog skills and uses a separate model call to independently solve/review the proposed tasks, answer keys, skill alignment, context, and final-question freshness. Approved numeric responses use exact number/decimal/fraction comparison; short text uses explicit accepted variants. Subjective essays and tasks needing an absent drawing/audio/resource are rejected. The broader content relies on model review; broad generation accuracy and learning efficacy remain unmeasured.

The server excludes recognized originating tasks and previous activity tasks using local fingerprints; the composer receives only catalog fields and previous generated activity prompts, with no original worksheet text or student answers. Composition is bounded to two attempts and uses the shared provider concurrency limit. Rejected content is not saved as verified. A suitable verified fresh activity can be used as fallback; provider or review failures otherwise produce a retry state. Existing schema 1.0/component-v1 definitions and child sessions remain readable alongside schema 1.1/component-v2; the current prompt version is `sidekick-activity-v3`.

Reusable definitions contain catalog and interaction data, not account names, emails, profile/upload IDs, worksheet images, or original student answers. Generated definitions record model, prompt, schema/component versions, source revision, skill, and misconception tags. Child-owned sessions keep their exact activity version separately. Start and submit request keys are idempotent; refresh resumes the unfinished current scene at `/kid/activities/{sessionId}`. The child receives only the current scene's public parameters, never stored grading keys, future prompts, or the complete activity specification.

Parents open **Activities** for a selected child to see the activity, target skill, completion time, final question, submitted answer, final-check outcome, and guided hint usage. These are records of individual attempts. Completing an activity does **not** clear a support observation, claim mastery, or restart the retired check/practice workflow.

## Activity sources, originals, and reseeding

The supplied [Sources CSV](data/activities/sources.csv) has **11 provenance/design-reference rows**, with source title, a provided summary, use notes, and link. It has **zero executable activity-definition rows, zero reusable-component parameter rows, and zero catalog skill links**. Its original BOM and line endings are preserved; SHA-256 is `77abb65b85cdc1a8b18f2e19843f31c2bfb3b829c048c3ec938e59d099f5e3d7`. These notes are imported as source data, not instructions or independently verified research claims.

The [partner workbook](https://claude.ai/artifact/NwhbGKA4BwjaEhcwaa5iAd#sheet-sht_rsb2zebb87.0) could not be inspected: the normal anonymous browser reached security verification and the workbook frame returned 403. No security challenge was bypassed and no partner activity definitions were inferred from the source notes. The [source inventory](data/activities/source_inventory.json) records this limitation.

Following the brief's source-only fallback, [original_examples.json](data/activities/original_examples.json) contains two clearly labeled **original Sidekick examples**, not copied workbook activities:

- `original-equal-pieces`: guided construction of 3/4, placement of 4/6 on a number line, and a fresh independent 3/8 task.
- `original-word-lab`: guided mouse→mice tiles and man→men choices, followed by a fresh foot→feet response.

The [import report](data/activities/import_report.json) records **11 reference rows imported, zero workbook activity definitions imported, and two verified original examples**, with no current row issues. Source references cite the supplied notes; they do not claim those references supplied these exact activity designs.

```sh
npm run db:migrate
npm run catalog:seed
npm run activities:seed
# Equivalent CLI; an explicit database override is available for local tooling.
backend/.venv/bin/python -m backend.activities seed-library --database-url sqlite:///backend/data/sidekick.db
```

The import is transactional and idempotent. Source IDs remain stable when descriptive wording changes, and revisions retain immutable copies of the supplied source rows. Activity IDs are stable; changed content creates a new immutable version. Reseeding a reviewed manifest retires removed or invalid original definitions from future selection while preserving exact versions used in sessions and attempts. Verified model-generated activities are separate and are not retired by reseeding originals. Review reported missing skill links, unsupported interactions, missing context, invalid parameters, and unresolved source references before serving those rows. No arbitrary HTML or executable code is imported from a workbook or generated by the model.

## Privacy, storage, and configuration

Account sessions, parent PINs, ownership checks, sibling isolation, profile switching, CSRF, and route protection remain in force. State-changing API requests require an exact trusted `Origin` and a session-bound `X-CSRF-Token` obtained from `GET /api/auth/csrf`. Parent mode expires after 30 idle minutes; five wrong PINs lock the account gate for five minutes. Passwords and PINs use Argon2id. Keep `PASSWORD_POLICY=strict`, HTTPS, and secure cookies before a pilot; local development explicitly uses `APP_ENV=development`, `PASSWORD_POLICY=dev`, `COOKIE_SECURE=false`, and `TRUSTED_ORIGINS=http://localhost:3000`.

Original uploads and rendered pages are retained privately under the database directory's `uploads/` by default (`backend/data/uploads/`). Opaque filenames, mode 0600 files, and a mode 0700 directory are used. This location is Git-ignored and outside public assets. Override `SIDEKICK_PRIVATE_UPLOAD_DIR` only with another private, ignored directory, preferably outside the repository. Files are retrieved through authorized routes, never public URLs.

Parent deletion removes an upload's original/pages, problems, and linked student work evidence, then recomputes affected states. Historical diagnostic/practice records are retained privately; the retired workflow cannot resume them. An activity session retains its immutable definition and attempt record when its originating upload is deleted; the upload link is cleared. Deleting a child cascades its private learning/activity records and cleans its private files. There is no automatic retention deadline; parents delete retained uploads explicitly. Backups need the same privacy controls.

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
| `GET /parent/{kidId}/dashboard` | Skill observations and analytics from uploaded student work |
| Former `/kid/next`, `/kid/submit`, `/kid/session/{id}/activity`, and parent adult/extra-practice routes | Retired; authorized requests return `410 feature_removed` |

Kid responses contain extraction; detailed mapping, grading, signatures, and learning states belong to authorized parent routes. API errors retain `{ "error": { "code": "...", "message": "..." } }`, use safe messages, and responses are `Cache-Control: no-store`.


The activity API is separate from retired practice routes:

| Route under `/api/activities` | Purpose |
| --- | --- |
| `GET /kid/suggestion?uploadId=...` | Read an authorized suggestion for completed student work |
| `POST /kid/start` | Start or resume an idempotent child-owned activity |
| `GET /kid/sessions/{id}` | Read only the current scene and saved response state |
| `POST /kid/sessions/{id}/submit` | Save an idempotent guided or independent response |
| `POST /kid/sessions/{id}/hint`, `POST /kid/sessions/{id}/next` | Show a guided hint or advance a completed guided scene |
| `GET /parent/{kidId}/history` | Read the selected child's activity attempts after parent authorization |

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
# Real photo -> support observation -> reuse -> live activity composition -> parent history:
npm run activities:verify:live
# Real Math/ELA photos -> general activity composition + independent review:
npm run activities:verify:general:live
```

Stop servers on ports 3000/8000 before Playwright; its configuration starts isolated servers. Unit/integration tests stub model calls and use temporary databases. Coverage includes authentication/PIN/CSRF, extraction preservation, invalid images/PDFs, provider failure and retry, child/account isolation and profile changes, catalog reseeding/history, distinct student work observations, retired-workflow enforcement, historical-data preservation, and real dashboard data. Browser journeys verify that the old Practice URL redirects, retired APIs cannot start questions, and private student work upload/retrieval/deletion still works. Activity verification covers Math and ELA upload-to-activity flows, hints and visual controls, cue-free final checks, strong-match reuse, model composition, invalid output/fallback, refresh/retry behavior, source reseeding/history, and sibling/account isolation.

`data/evaluation_homework.json` contains 27 synthetic Math/ELA examples with expected mapping or abstention, correctness, and signature labels, including mistakes/slips, equivalent fractions, blanks, unreadable responses, shared context, missing context, and ambiguous multi-skill work. The offline command validates cases and catalog IDs; it does **not** measure model accuracy. The live command creates a temporary database/catalog and reports mapping coverage, accuracy among accepted mappings, grading accuracy, eligible incorrect signature accuracy, and provider failures. Missing credentials exit with setup instructions. No real student data is used.

Current verification passed **308 backend tests, 28 browser tests, TypeScript, and the production build**. Browser coverage includes original and generated Math/ELA activities, ungraded-but-mapped work, correct/incorrect uploads, teaching/passage context, cue-free independent responses, protected parent history, keyboard controls, hints, generation retry, dropped-response retry, and refresh. Upload regressions cover the broad picker filter, real HEIC preview decoding, generic MIME fallback, original-byte submission, damaged-photo recovery, delayed preview cancellation, and retaining a photo after a rejected security token. The browser app replaces only external composition/review with explicit synthetic decisions behind strict temporary-test-database guards; production APIs/auth remain unchanged. Headless browser tests cannot exercise the native macOS Photos dialog itself.

The earlier [live activity verification report](data/activities/live_verification.json) records real configured-provider photo extraction, a support observation, verified three-scene original reuse, and a newly composed four-scene fraction activity completed through the normal cookie/CSRF-protected API. Both final answers appeared in PIN-protected parent history and the support observation stayed unchanged. The verifier uses an isolated temporary account/database and only synthetic work; `--live` is mandatory and provider calls may incur charges. It does not modify local family records. This report covers the original Math path.

A separate live all-correct Math smoke test with the configured `gpt-6.1-terra` provider passed real photo extraction, grading/mapping, activity suggestion, three-scene original reuse, completion, refresh/idempotent submit, and PIN-protected parent history. The skill remained `on_track`. It used a disposable database/private upload directory and no model stubs. This run verified reuse after correct work; new composition from correct work is covered with controlled model output in backend tests.

The [general activity live report](data/activities/general_live_verification.json) verifies real Math unit-rate (`6.RP.A.2-1`) and ELA text-evidence (`RI.3.1-1`) photos through extraction, analysis, new four-scene composition with no matching library entry, separate model approval, completion, refresh/idempotency, and protected parent history. Math remained `ungraded`/`unassessed`; ELA remained correct/`on_track`. Both used the configured `gpt-6.1-terra` provider without stubs in disposable storage. Reproduce with `npm run activities:verify:general:live`. These two smoke paths do not measure broad catalog accuracy or educational efficacy.

The earlier [structured-decision evaluation](data/evaluation_report.json) records zero provider failures, 22/27 accepted mappings (all 22 correct), 27/27 grading matches, and 5/7 signature matches. All five expected mapping abstentions were retained. These observations never override correctness.

This is an initial smoke evaluation: the 27 answer/status variants use only 12 unique question texts, with seven positive stems largely taken from the catalog. It measures decisions after transcription, not OCR accuracy or general classroom performance, and does not calibrate confidence scores. The historical [separate live smoke report](data/live_smoke_report.json) covers synthetic Math/ELA photos and the now-retired generation workflow: three addition items passed deterministic checking, independent solving, and alignment; three fraction items were aligned but correctly retained for adult adjudication. A follow-up Math photo retained the incorrect fraction after an initial exact-string comparison did not match; transcription can vary. Both subjects distinguished blank and unreadable responses. The generation results are retained as historical validation, not an active product feature. Broader transcription accuracy remains unmeasured. Missing contexts, unsupported interactions, unsafe source links, and lexical retrieval remain draft-data limitations.

Additional visual interaction types, automatic progress or mastery rules, games, tutoring chat, payments, email delivery/recovery, expanded grade profiles, and a visual redesign remain separate milestones.
