#!/usr/bin/env node
/*
Verifies that all French blog slugs in public/blog-data/_aliases_fr.json are routable.

- For canonical slugFr entries, expects HTTP 200 at /fr/blog/<slugFr>.
- For legacy alias slugFr entries, expects a redirect to /fr/blog/<canonicalSlugFr>.

By default, this script will spawn `next start` on a random port (requires a prior `next build`).

Usage:
  node scripts/verify-fr-alias-urls.js
  node scripts/verify-fr-alias-urls.js --no-spawn --base http://127.0.0.1:3000
  node scripts/verify-fr-alias-urls.js --concurrency 12
  node scripts/verify-fr-alias-urls.js --max 50

Exit codes:
  0 on success, 1 on any failure.
*/

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const OUTPUT_DIR = path.join(process.cwd(), "public", "blog-data");
const ALIASES_PATH = path.join(OUTPUT_DIR, "_aliases_fr.json");

function parseArgs(argv) {
  const args = {
    spawn: true,
    base: null,
    port: null,
    concurrency: 10,
    max: null,
    timeoutMs: 12_000,
    quiet: false,
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--no-spawn") args.spawn = false;
    else if (a === "--spawn") args.spawn = true;
    else if (a === "--base") args.base = argv[++i];
    else if (a === "--port") args.port = Number(argv[++i]);
    else if (a === "--concurrency") args.concurrency = Math.max(1, Number(argv[++i]));
    else if (a === "--max") args.max = Math.max(1, Number(argv[++i]));
    else if (a === "--timeout-ms") args.timeoutMs = Math.max(1000, Number(argv[++i]));
    else if (a === "--quiet" || a === "--ci") args.quiet = true;
    else if (a === "--help" || a === "-h") {
      console.log("See header comments for usage.");
      process.exit(0);
    }
  }

  return args;
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function isPlainObject(v) {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithTimeout(url, init, timeoutMs) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

function normalizeLocation(loc) {
  if (!loc) return null;
  try {
    // If absolute, drop origin.
    const u = new URL(loc, "http://example.local");
    return u.pathname + (u.search || "");
  } catch {
    return String(loc);
  }
}

function formatStatusLine(status, loc) {
  const l = loc ? ` location=${loc}` : "";
  return `${status}${l}`;
}

async function waitForServer(base, timeoutMs) {
  const start = Date.now();
  const probeUrl = `${base}/blog-data/_aliases_fr.json`;

  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetchWithTimeout(probeUrl, { method: "GET", redirect: "manual" }, 5_000);
      if (res.status >= 200 && res.status < 500) return;
    } catch {
      // ignore
    }
    await sleep(250);
  }

  throw new Error(`Server did not become ready in time (${timeoutMs}ms): ${base}`);
}

function getNextBinPath() {
  const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
  if (!fs.existsSync(nextBin)) {
    throw new Error(`Next binary not found at ${nextBin}. Did you run npm ci/npm install?`);
  }
  return nextBin;
}

function hasBuildOutput() {
  return fs.existsSync(path.join(process.cwd(), ".next")) && fs.existsSync(path.join(process.cwd(), ".next", "BUILD_ID"));
}

async function startNextServer({ port, quiet }) {
  if (!hasBuildOutput()) {
    throw new Error('Missing Next build output (.next). Run: npx next build (or npm run build) before running this script.');
  }

  const nextBin = getNextBinPath();

  const child = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: String(port) },
    stdio: quiet ? ["ignore", "pipe", "pipe"] : ["ignore", "inherit", "inherit"],
  });

  let stdout = "";
  let stderr = "";
  if (quiet) {
    child.stdout.on("data", (d) => (stdout += String(d)));
    child.stderr.on("data", (d) => (stderr += String(d)));
  }

  // If it dies quickly, surface logs.
  await sleep(600);
  if (child.exitCode !== null) {
    const extra = quiet ? `\n--- stdout ---\n${stdout}\n--- stderr ---\n${stderr}` : "";
    throw new Error(`next start exited early with code ${child.exitCode}${extra}`);
  }

  return child;
}

async function stopProcess(child) {
  if (!child || child.exitCode !== null) return;

  child.kill("SIGTERM");
  const start = Date.now();
  while (child.exitCode === null && Date.now() - start < 4_000) {
    await sleep(100);
  }
  if (child.exitCode === null) {
    child.kill("SIGKILL");
  }
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let idx = 0;
  let active = 0;

  return new Promise((resolve, reject) => {
    const next = () => {
      if (idx >= items.length && active === 0) return resolve(results);
      while (active < limit && idx < items.length) {
        const cur = idx++;
        active++;
        Promise.resolve(fn(items[cur], cur))
          .then((r) => {
            results[cur] = r;
            active--;
            next();
          })
          .catch(reject);
      }
    };

    next();
  });
}

function pickRandomPort() {
  // Prefer a high port range unlikely to be used.
  const min = 3100;
  const max = 3999;
  return Math.floor(min + Math.random() * (max - min + 1));
}

async function main() {
  const args = parseArgs(process.argv);

  if (!fs.existsSync(ALIASES_PATH)) {
    console.error(`❌ Missing ${ALIASES_PATH}. Run: node scripts/build-blog.js`);
    process.exit(1);
  }

  const aliases = readJson(ALIASES_PATH);
  if (!isPlainObject(aliases)) {
    console.error(`❌ Invalid ${ALIASES_PATH} (expected JSON object)`);
    process.exit(1);
  }

  const keys = Object.keys(aliases);
  if (keys.length === 0) {
    console.log("✅ No aliases to verify (empty map)");
    process.exit(0);
  }

  const limitedKeys = args.max ? keys.slice(0, args.max) : keys;

  let base = args.base;
  let child = null;

  try {
    if (args.spawn) {
      const port = Number.isFinite(args.port) && args.port ? args.port : pickRandomPort();
      child = await startNextServer({ port, quiet: args.quiet });
      base = `http://127.0.0.1:${port}`;
    }

    if (!base) {
      console.error('❌ Missing --base when using --no-spawn. Example: --base http://127.0.0.1:3000');
      process.exit(1);
    }

    await waitForServer(base, 25_000);

    const failures = [];
    const startedAt = Date.now();

    const perKey = async (slugFrCandidate) => {
      const slugEn = aliases[slugFrCandidate];
      const postPath = path.join(OUTPUT_DIR, `${slugEn}.json`);

      if (!fs.existsSync(postPath)) {
        return {
          ok: false,
          slugFrCandidate,
          slugEn,
          expectedCanonicalFr: null,
          got: "missing-post-json",
        };
      }

      const post = readJson(postPath);
      const canonicalFr = String(post.slugFr || "").trim();
      if (!canonicalFr) {
        return {
          ok: false,
          slugFrCandidate,
          slugEn,
          expectedCanonicalFr: null,
          got: "missing-canonical-slugFr",
        };
      }

      const url = `${base}/fr/blog/${encodeURIComponent(slugFrCandidate)}`;
      const res = await fetchWithTimeout(url, { method: "GET", redirect: "manual" }, args.timeoutMs);
      const loc = normalizeLocation(res.headers.get("location"));

      const isCanonical = slugFrCandidate === canonicalFr;

      if (isCanonical) {
        if (res.status === 200) {
          return { ok: true, slugFrCandidate, slugEn, expectedCanonicalFr: canonicalFr, got: formatStatusLine(res.status, loc) };
        }
        // If canonical redirects to itself, that's unexpected (but allow 3xx to same canonical to be tolerant).
        if ([301, 302, 307, 308].includes(res.status) && loc === `/fr/blog/${canonicalFr}`) {
          return { ok: true, slugFrCandidate, slugEn, expectedCanonicalFr: canonicalFr, got: formatStatusLine(res.status, loc) };
        }
        return { ok: false, slugFrCandidate, slugEn, expectedCanonicalFr: canonicalFr, got: formatStatusLine(res.status, loc) };
      }

      // Legacy alias: must redirect to canonical.
      if (![301, 302, 307, 308].includes(res.status)) {
        return { ok: false, slugFrCandidate, slugEn, expectedCanonicalFr: canonicalFr, got: formatStatusLine(res.status, loc) };
      }

      if (loc !== `/fr/blog/${canonicalFr}`) {
        return { ok: false, slugFrCandidate, slugEn, expectedCanonicalFr: canonicalFr, got: formatStatusLine(res.status, loc) };
      }

      return { ok: true, slugFrCandidate, slugEn, expectedCanonicalFr: canonicalFr, got: formatStatusLine(res.status, loc) };
    };

    const results = await mapLimit(limitedKeys, args.concurrency, perKey);

    for (const r of results) {
      if (!r.ok) failures.push(r);
    }

    const durationMs = Date.now() - startedAt;

    if (failures.length) {
      console.error(`❌ Alias URL verification failed: ${failures.length}/${limitedKeys.length} failing (took ${durationMs}ms)`);
      for (const f of failures.slice(0, 30)) {
        const exp = f.expectedCanonicalFr ? ` expected=/fr/blog/${f.expectedCanonicalFr}` : "";
        console.error(` - /fr/blog/${f.slugFrCandidate} -> ${f.got}${exp} (slugEn=${f.slugEn})`);
      }
      if (failures.length > 30) {
        console.error(` ... and ${failures.length - 30} more`);
      }
      process.exit(1);
    }

    console.log(`✅ Verified ${limitedKeys.length} FR slug entries (no 404s; redirects correct). (${durationMs}ms)`);
  } finally {
    await stopProcess(child);
  }
}

main().catch((err) => {
  console.error(`❌ ${String(err && err.message ? err.message : err)}`);
  process.exit(1);
});
