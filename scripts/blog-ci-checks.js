#!/usr/bin/env node
/*
Unified blog CI checks.

Goal: catch the weekly breakages early and deterministically.
- Verifies metadata blocks exist and are normalized (check-only)
- Verifies auto-tagging is converged (check-only)
- Validates metadata rules
- Rebuilds blog artifacts (skip translation network)
- Validates blog-data sync
- Validates slug rules + FR alias URL routing
- Runs Next.js build
- Ensures repository stays clean after generating artifacts

Usage:
  node scripts/blog-ci-checks.js
*/

const { spawnSync } = require("child_process");

function run(cmd, args, opts = {}) {
  const pretty = [cmd, ...(args || [])].join(" ");
  console.log(`\n▶ ${pretty}`);

  const res = spawnSync(cmd, args || [], {
    stdio: "inherit",
    shell: false,
    env: opts.env || process.env,
  });

  if (res.error) {
    console.error(`❌ Failed to run: ${pretty}`);
    console.error(res.error);
    process.exit(1);
  }

  if (typeof res.status === "number" && res.status !== 0) {
    process.exit(res.status);
  }
}

function main() {
  // 1) Check-only normalizers
  run("node", ["scripts/fix-missing-metadata.js", "--check"]);
  run("node", ["scripts/auto_tag_blog_posts.js", "--check"]);

  // 2) Validation
  run("node", ["scripts/validate-blog-metadata.js"]);

  // 3) Deterministic artifact generation (no network translation)
  run("node", ["scripts/build-blog.js", "--skip-translation"]);
  run("node", ["scripts/validate-blog-data-sync.js"]);

  // 4) Slug/routing rules
  run("node", ["scripts/validate-blog-slugs.js"]);

  // 5) Build Next (set SKIP_TRANSLATION to keep build-blog deterministic if it runs)
  const env = { ...process.env, SKIP_TRANSLATION: "1" };
  run("node", ["node_modules/next/dist/bin/next", "build"], { env });

  // 6) FR alias URL health
  run("node", ["scripts/verify-fr-alias-urls.js", "--ci"]);

  // 7) Ensure generating artifacts didn't leave unstaged changes
  run("git", ["diff", "--exit-code", "--name-only"]);

  console.log("\n✅ blog-ci-checks: all checks passed");
}

main();
