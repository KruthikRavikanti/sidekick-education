#!/usr/bin/env node
// Sidekick robot player.
//
// Plays one generated game in a real headless browser, inside the same locked
// frame policy the app uses, and reports whether it is safe to put in front of a
// reviewer. It proves the game can be won with its declared solution, cannot be
// won with any declared known mistake, is not already solved or easily guessed,
// makes no network request, throws no error, and fits a phone screen.
//
//   node scripts/game-robot.mjs --file game.html [--csp "<header>"] [--out dir] [--trials 30]
//
// Prints one JSON report on stdout. Exit code 0 means a report was produced
// (read `passed`); any other exit code means the robot itself could not run.
import { chromium } from '@playwright/test';
import { readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, value, index, all) => (value.startsWith('--') ? [...acc, [value.slice(2), all[index + 1] && !all[index + 1].startsWith('--') ? all[index + 1] : 'true']] : acc), []));
if (!args.file) { console.error('usage: game-robot.mjs --file game.html [--out dir]'); process.exit(2); }
const html = readFileSync(args.file, 'utf8');
const outDir = args.out || null;
const TRIALS = Math.max(0, Math.min(200, Number(args.trials ?? 30)));
const BUDGET_MS = Number(args.budget ?? 150000);
const URL_ = 'https://game.sidekick.invalid/frame';
const DEFAULT_CSP = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; media-src data: blob:; connect-src 'none'; frame-src 'none'; child-src 'none'; worker-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; sandbox allow-scripts";
const BANNED = /\b(gap|gaps|behind|grade level|mistake pattern|wrong|incorrect|fail|failed|failure|stupid|dumb|bad job)\b/i;
const started = Date.now();
const report = { passed: false, kit: null, checks: [], manifest: null, stats: {}, screenshots: [] };
const check = (name, ok, detail = '') => { report.checks.push({ name, ok: !!ok, detail: String(detail).slice(0, 400) }); return !!ok; };
const words = (text) => String(text).trim().split(/\s+/).filter(Boolean).length;

const SEEDS = String(args.seeds ?? '101,2024').split(',').map(Number).filter((n) => Number.isInteger(n) && n > 0).slice(0, 4);
const withSeed = (seed) => html.replace(/window\.__SK_INIT=\{"seed": (null|\d+)/, `window.__SK_INIT={"seed": ${seed}`);
const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] });
async function open(width, height, body = html) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, reducedMotion: 'reduce', serviceWorkers: 'block' });
  const page = await context.newPage();
  const trouble = { errors: [], requests: [], loads: 0 };
  await context.route('**/*', (route) => {
    const url = route.request().url();
    if (url === URL_ && trouble.loads === 0) { trouble.loads += 1; return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', headers: { 'Content-Security-Policy': args.csp || DEFAULT_CSP }, body }); }
    trouble.requests.push(url.slice(0, 120)); return route.abort();
  });
  page.on('pageerror', (error) => trouble.errors.push(String(error.message).slice(0, 200)));
  page.on('console', (message) => { if (message.type() === 'error') trouble.errors.push(message.text().slice(0, 200)); });
  await page.addInitScript(() => { window.__msgs = []; window.addEventListener('message', (event) => { if (event.data && event.data.sidekick) window.__msgs.push(event.data); }); });
  await page.goto(URL_, { waitUntil: 'load', timeout: 15000 });
  return { context, page, trouble };
}
const state = (page) => page.evaluate(() => window.__SK.state());
async function fit(page, width) { const h = await page.evaluate(() => Math.ceil(document.getElementById('sk-root').getBoundingClientRect().height)); await page.setViewportSize({ width, height: Math.max(640, Math.min(1600, h + 24)) }); }
async function act(page, step) {
  const actions = await page.evaluate((s) => window.__SK.plan(s), step);
  for (const a of actions) {
    if (a.type === 'wait') await page.waitForTimeout(a.ms);
    else if (a.type === 'click') await page.mouse.click(a.at.x, a.at.y);
    else if (a.type === 'drag') { await page.mouse.move(a.from.x, a.from.y); await page.mouse.down(); await page.mouse.move((a.from.x + a.to.x) / 2, (a.from.y + a.to.y) / 2 - 6, { steps: 3 }); await page.mouse.move(a.to.x, a.to.y, { steps: 4 }); await page.mouse.up(); }
  }
  await page.waitForTimeout(25);
}
async function tap(page, id) { const box = await page.locator(`[data-sk-id="${id}"]`).first().boundingBox(); if (!box) throw new Error(`"${id}" is not on screen`); await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2); await page.waitForTimeout(40); }
async function shot(page, name) { if (!outDir) return; mkdirSync(outDir, { recursive: true }); const file = join(outDir, name + '.jpg'); await page.screenshot({ path: file, type: 'jpeg', quality: 82 }); report.screenshots.push(name + '.jpg'); }

try {
  const WIDTH = 390;
  const { page, trouble } = await open(WIDTH, 760);
  const booted = await page.waitForFunction(() => window.__SK && window.__SK.manifest && window.__SK.manifest(), null, { timeout: 6000 }).then(() => true, () => false);
  if (!check('boots', booted, booted ? '' : (trouble.errors[0] || 'The game never called Sidekick.game().'))) throw new Error('boot');
  const manifest = report.manifest = await page.evaluate(() => window.__SK.manifest());
  report.kit = manifest.kit;
  const rounds = manifest.rounds, solo = rounds.length - 1;

  // ---- what the game says about itself
  check('title', manifest.title.length >= 3 && manifest.title.length <= 60, `title has ${manifest.title.length} characters`);
  check('premise', manifest.premise.length >= 10 && manifest.premise.length <= 180, `premise has ${manifest.premise.length} characters`);
  check('round_count', rounds.length >= 3 && rounds.length <= 6, `${rounds.length} rounds; need 2 to 5 guided rounds and one solo round`);
  check('round_order', rounds.length > 0 && rounds[solo].phase === 'solo' && rounds.slice(0, solo).every((r) => r.phase === 'guided'), 'guided rounds first, exactly one solo round last');
  check('round_parts', rounds.every((r) => r.id && r.hasSetup && r.hasCheck && r.hasSolution), 'every round needs id, setup, check and solution');
  check('round_ids_unique', new Set(rounds.map((r) => r.id)).size === rounds.length);
  check('missions_short', rounds.every((r) => r.say.trim() && words(r.say) <= 34), 'each mission line must be 1 to 34 words');
  check('guided_have_hints', rounds.slice(0, solo).every((r) => r.hints.length >= 1 && r.hints.length <= 3 && r.win.trim()), 'guided rounds need 1 to 3 hints and a win line');
  check('solo_has_no_help', rounds.length > 0 && rounds[solo].hints.length === 0 && !rounds[solo].autoCheck, 'the solo round has no hints and no auto-check');
  check('known_mistakes', rounds.length > 0 && rounds[solo].mistakes.length >= 1 && rounds.every((r) => r.mistakes.every((m) => m.tag && m.hasWhen && m.hasSteps)) && rounds.slice(0, solo).every((r) => r.mistakes.every((m) => m.say.trim())), 'the solo round needs at least one known mistake; every mistake needs tag, when and steps, and guided ones need a say line');
  const text = [manifest.title, manifest.premise, manifest.outro, ...rounds.flatMap((r) => [r.say, r.win, r.action, ...r.hints, ...r.mistakes.map((m) => m.say)])];
  const banned = text.find((t) => BANNED.test(t));
  check('kind_language', !banned, banned ? `kid-facing text uses a discouraging word: "${banned.slice(0, 60)}"` : '');
  if (report.checks.some((c) => !c.ok)) throw new Error('manifest');

  // ---- play it the right way, start to finish
  await shot(page, '00-start');
  await tap(page, 'sk-start');
  let s = await state(page);
  check('starts', s.screen === 'round' && s.index === 0, `after Play the screen is ${s.screen}`);
  const layoutIssues = [];
  for (let i = 0; i < rounds.length; i++) {
    await fit(page, WIDTH);
    s = await state(page);
    if (!check(`round_${i + 1}_opens`, s.screen === 'round' && s.index === i && !s.failed, s.failed || `expected round ${i + 1}, got ${s.screen} ${s.index + 1}`)) throw new Error('flow');
    const already = await page.evaluate(() => window.__SK.peek());
    check(`round_${i + 1}_not_already_solved`, !already, 'the round counts as solved before the child does anything');
    layoutIssues.push(...(await page.evaluate(() => window.__SK.layout())).map((issue) => `round ${i + 1}: ${issue}`));
    await shot(page, `${String(i + 1).padStart(2, '0')}-round-open`);
    const steps = await page.evaluate(() => window.__SK.steps('solution'));
    check(`round_${i + 1}_solution_has_steps`, steps.length >= 1 && steps.length <= 40, `${steps.length} solution steps`);
    for (const step of steps) await act(page, step);
    if (!rounds[i].autoCheck) await tap(page, 'sk-check');
    s = await state(page);
    if (!check(`round_${i + 1}_solution_wins`, s.solved && !s.failed, s.failed || `after the declared solution the game said: "${s.feedback}"`)) throw new Error('solution');
    await shot(page, `${String(i + 1).padStart(2, '0')}-round-solved`);
    await tap(page, 'sk-check');
  }
  s = await state(page);
  const finish = await page.evaluate(() => window.__msgs.filter((m) => m.type === 'finish').pop() || null);
  check('finishes', s.screen === 'final' && finish && finish.result && finish.result.solo && finish.result.solo.firstTry === true && finish.result.solo.solved === true, 'a clean run must end on the final screen with the solo round right on the first try');
  await fit(page, WIDTH); await shot(page, '99-finish');
  check('fits_phone', layoutIssues.length === 0, layoutIssues.slice(0, 4).join('; '));

  // ---- play it the known wrong ways: the game must not accept them
  for (let i = 0; i < rounds.length; i++) {
    for (let j = 0; j < rounds[i].mistakes.length; j++) {
      const m = rounds[i].mistakes[j], label = `round_${i + 1}_mistake_${m.tag}`;
      await page.evaluate((index) => window.__SK.goto(index), i); await fit(page, WIDTH);
      let steps;
      try { steps = await page.evaluate((jj) => window.__SK.steps('mistake', jj), j); for (const step of steps) await act(page, step); }
      catch (error) { check(label + '_plays', false, String(error.message).split('\n')[0]); continue; }
      const detected = await page.evaluate((jj) => window.__SK.mistakeMatches(jj), j);
      check(label + '_recognised', detected, 'after playing this mistake its own detector did not match');
      if (!rounds[i].autoCheck) await tap(page, 'sk-check');
      s = await state(page);
      const last = s.log.filter((e) => e.kind === 'check').pop();
      check(label + '_rejected', !s.solved && (rounds[i].autoCheck || (last && last.ok === false)), 'the game accepted a known mistake as a win');
      if (!rounds[i].autoCheck) check(label + '_tagged', last && last.mistake === m.tag, `the check reported "${last && last.mistake}" instead of "${m.tag}"`);
      if (i === 0 && j === 0) await shot(page, '50-mistake-reaction');
    }
  }

  // ---- mash buttons: nothing may break, and luck must not beat the solo round
  let lucky = 0, trials = 0, seed = 1;
  for (let t = 0; t < TRIALS && Date.now() - started < BUDGET_MS * 0.8; t++) {
    const index = t % 3 === 0 ? (t / 3) % rounds.length : solo;
    await page.evaluate((i) => window.__SK.goto(i), index);
    const n = 1 + ((t * 7) % 7);
    for (let k = 0; k < n; k++) {
      const step = await page.evaluate((sd) => window.__SK.randomStep(sd), seed++);
      if (!step) break;
      try { await act(page, step); } catch { /* a random step may target something that just moved */ }
    }
    if (index === solo) { trials += 1; if (await page.evaluate(() => window.__SK.peek())) lucky += 1; }
    if ((await state(page)).failed) break;
  }
  report.stats.randomTrials = trials; report.stats.randomWins = lucky;
  check('not_guessable', trials === 0 || lucky / trials <= 0.34, `random play solved the solo round ${lucky} of ${trials} times`);
  s = await state(page);
  check('survives_random_play', !s.failed, s.failed || '');

  // ---- fresh numbers: a different seed must still be winnable, and must still reject the known mistakes
  for (const seed of SEEDS) {
    const other = await open(WIDTH, 760, withSeed(seed));
    const p = other.page, label = `seed_${seed}`;
    try {
      await p.waitForFunction(() => window.__SK && window.__SK.manifest(), null, { timeout: 6000 });
      const m2 = await p.evaluate(() => window.__SK.manifest());
      check(label + '_same_shape', m2.rounds.length === rounds.length && m2.rounds[solo].mistakes.length >= 1, 'a different seed changed the number of rounds or dropped the solo mistakes');
      await tap(p, 'sk-start');
      for (let i = 0; i < m2.rounds.length; i++) {
        await p.evaluate((index) => window.__SK.goto(index), i); await fit(p, WIDTH);
        const ready = await p.evaluate(() => window.__SK.peek());
        for (const step of await p.evaluate(() => window.__SK.steps('solution'))) await act(p, step);
        if (!m2.rounds[i].autoCheck) await tap(p, 'sk-check');
        const st = await state(p);
        check(`${label}_round_${i + 1}_wins`, !ready && st.solved && !st.failed, st.failed || (ready ? 'solved before any move' : `said "${st.feedback}"`));
      }
      for (let j = 0; j < m2.rounds[solo].mistakes.length; j++) {
        await p.evaluate((index) => window.__SK.goto(index), solo); await fit(p, WIDTH);
        for (const step of await p.evaluate((jj) => window.__SK.steps('mistake', jj), j)) await act(p, step);
        await tap(p, 'sk-check');
        const st = await state(p);
        check(`${label}_mistake_${m2.rounds[solo].mistakes[j].tag}_rejected`, !st.solved && !st.failed, 'with these numbers the known mistake wins');
      }
      const issues = await p.evaluate(() => window.__SK.layout());
      check(label + '_fits_phone', issues.length === 0, issues.slice(0, 3).join('; '));
    } catch (error) { check(label + '_plays', false, String(error.message).split('\n')[0]); }
    trouble.errors.push(...other.trouble.errors); trouble.requests.push(...other.trouble.requests);
    await other.context.close();
  }

  // ---- a wider screen
  const wide = await open(820, 900);
  await wide.page.waitForFunction(() => window.__SK && window.__SK.manifest(), null, { timeout: 6000 });
  await tap(wide.page, 'sk-start'); await fit(wide.page, 820);
  const wideIssues = await wide.page.evaluate(() => window.__SK.layout());
  check('fits_tablet', wideIssues.length === 0, wideIssues.slice(0, 3).join('; '));
  await shot(wide.page, '98-wide');
  trouble.errors.push(...wide.trouble.errors); trouble.requests.push(...wide.trouble.requests);
  await wide.context.close();

  // ---- the box stayed locked
  const kitErrors = await page.evaluate(() => window.__msgs.filter((m) => m.type === 'error').map((m) => m.message));
  check('no_errors', trouble.errors.length === 0 && kitErrors.length === 0, [...trouble.errors, ...kitErrors].slice(0, 3).join(' | '));
  check('no_network', trouble.requests.length === 0, `tried to load: ${trouble.requests.slice(0, 3).join(', ')}`);
  check('no_navigation', page.url() === URL_, `the frame navigated to ${page.url().slice(0, 80)}`);
} catch (error) {
  if (!['boot', 'manifest', 'flow', 'solution'].includes(error.message)) check('robot_run', false, String(error.message).split('\n')[0]);
}
report.stats.ms = Date.now() - started;
report.passed = report.checks.length > 0 && report.checks.every((c) => c.ok);
await browser.close();
process.stdout.write(JSON.stringify(report) + '\n');
