import { spawn, spawnSync } from "node:child_process";
import { access } from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixtureMode = process.argv.includes("--fixtures");
const args = process.argv.slice(2);
const python = path.join(root, "backend", ".venv", process.platform === "win32" ? "Scripts/python.exe" : "bin/python");
const next = path.join(root, "node_modules", "next", "dist", "bin", "next");
const children = [];
let stopping = false;

function stopChild(child, signal = "SIGTERM") {
  if (!child.pid || child.exitCode !== null || child.signalCode !== null) return;
  try {
    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", String(child.pid), "/T", ...(signal === "SIGKILL" ? ["/F"] : [])], { stdio: "ignore" });
    } else {
      process.kill(-child.pid, signal);
    }
  } catch (error) {
    if (error.code !== "ESRCH") child.kill(signal);
  }
}

function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  for (const child of children) stopChild(child);
  const timer = setTimeout(() => {
    for (const child of children) stopChild(child, "SIGKILL");
  }, 5000);
  timer.unref();
}

function start(name, command, commandArgs, env) {
  const child = spawn(command, commandArgs, {
    cwd: root,
    env,
    stdio: "inherit",
    detached: process.platform !== "win32",
  });
  children.push(child);
  child.once("error", () => {
    console.error(`${name} could not start. Check the setup instructions in README.md.`);
    shutdown(1);
  });
  child.once("exit", (code, signal) => {
    if (!stopping) {
      console.error(`${name} stopped (${signal || `exit ${code}`}); stopping the other server.`);
      shutdown(1);
    }
  });
}

async function checkPort(port) {
  await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", () => reject(new Error(`Port ${port} is already in use or unavailable. Stop the existing server before starting Sidekick. No ports were changed.`)));
    server.listen({ host: "0.0.0.0", port, exclusive: true }, () => server.close(resolve));
  });
}

async function waitUntilReady(url) {
  const deadline = Date.now() + 60_000;
  while (!stopping && Date.now() < deadline) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1500) });
      await response.body?.cancel();
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!stopping) throw new Error("Sidekick did not become ready within 60 seconds. Check the server output above.");
}

async function main() {
  if (args.includes("--help")) {
    console.log("Start both servers: npm run dev:demo (sample worksheets) or npm run dev:all (configured vision provider). Ctrl+C stops both.");
    return;
  }
  if (args.some(arg => arg !== "--fixtures")) throw new Error("Unknown option. Use npm run dev:demo or npm run dev:all.");
  try { await access(next); } catch { throw new Error("Next.js dependencies are missing. Run npm ci from the repository root first."); }
  try { await access(python); } catch { throw new Error("The backend virtual environment is missing. Run python3 -m venv backend/.venv, then backend/.venv/bin/python -m pip install -r backend/requirements.txt (see README.md for setup)."); }
  const check = spawnSync(python, ["-c", "import fastapi, uvicorn, PIL, pillow_heif, pydantic, httpx, multipart, dotenv, argon2, email_validator, pymupdf"], { cwd: root, stdio: "ignore" });
  if (check.status !== 0) throw new Error("Backend dependencies are missing. Run backend/.venv/bin/python -m pip install -r backend/requirements.txt.");
  const accountCheck = spawnSync(python, ["-c", `
from pathlib import Path
from dotenv import load_dotenv
import sys
load_dotenv(Path('backend/.env'))
try:
    from backend.accounts import SecurityContext
    security = SecurityContext.from_env()
    if security.settings.app_env not in {'development', 'test'}:
        raise ValueError('Set APP_ENV=development in backend/.env for this local launcher; use the documented HTTPS configuration for other environments.')
    security.db.assert_migrated()
except Exception as error:
    print(getattr(error, 'message', str(error)), file=sys.stderr)
    sys.exit(1)
`], { cwd: root, stdio: "inherit" });
  if (accountCheck.status !== 0) throw new Error("Account setup is incomplete. See backend/.env.example and run npm run db:migrate before starting Sidekick.");
  await Promise.all([checkPort(3000), checkPort(8000)]);

  process.once("SIGINT", () => shutdown());
  process.once("SIGTERM", () => shutdown());
  console.log(`Starting Sidekick in ${fixtureMode ? "sample mode (bundled worksheets only)" : "live mode (using backend/.env)"}. Keep this terminal open; Ctrl+C stops both servers.`);
  start("FastAPI", python, ["-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000", "--no-access-log"], {
    ...process.env,
    SIDEKICK_FIXTURE_MODE: fixtureMode ? "true" : "false",
  });
  start("Next.js", process.execPath, [next, "dev", "--hostname", "0.0.0.0", "--port", "3000"], {
    ...process.env,
    BACKEND_URL: "http://127.0.0.1:8000",
  });
  await Promise.all([waitUntilReady("http://127.0.0.1:8000/api/health"), waitUntilReady("http://localhost:3000")]);
  if (!stopping) console.log("Sidekick is ready: http://localhost:3000");
}

main().catch(error => {
  console.error(error.message);
  shutdown(1);
});
