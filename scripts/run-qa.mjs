import { spawn } from "node:child_process";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:4173";
const PREVIEW_HOST = "127.0.0.1";
const PREVIEW_PORT = "4173";

const run = (command, args, env = process.env) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      env,
      shell: process.platform === "win32",
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} failed (${code})`));
    });
  });

const waitForServer = async (retries = 40) => {
  for (let i = 0; i < retries; i += 1) {
    try {
      const res = await fetch(BASE_URL);
      if (res.ok) return;
    } catch {
      // no-op
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("Preview server did not become ready in time.");
};

const preview = spawn(
  "npm",
  ["run", "preview", "--", "--host", PREVIEW_HOST, "--port", PREVIEW_PORT],
  {
    stdio: "inherit",
    shell: process.platform === "win32",
  },
);

let failed = false;

try {
  await waitForServer();
  await run("node", ["scripts/qa-routes.mjs"], { ...process.env, BASE_URL });
  await run("node", ["scripts/qa-metadata.mjs"], { ...process.env, BASE_URL });
  await run("npx", ["playwright", "test", "tests/qa-browser.spec.js", "--reporter=line"], {
    ...process.env,
    BASE_URL,
  });
} catch (error) {
  failed = true;
  console.error(`[qa] ${error.message}`);
} finally {
  if (!preview.killed) {
    preview.kill("SIGTERM");
  }
}

if (failed) process.exit(1);
console.log("[qa] All checks passed.");
