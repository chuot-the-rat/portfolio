import { execSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:4173";
const PREVIEW_HOST = "127.0.0.1";
const PREVIEW_PORT = "4173";
const DIST_DIR = path.join(process.cwd(), "dist");
const DIST_INDEX = path.join(DIST_DIR, "index.html");
const RECOVERY_MODE =
  process.argv.includes("--recovery") || process.env.QA_RECOVERY === "1";

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

const waitForServer = async (retries = 50) => {
  let lastStatus = "NO_RESPONSE";
  let lastError = "";
  for (let i = 0; i < retries; i += 1) {
    try {
      const res = await fetch(BASE_URL);
      lastStatus = res.status;
      if (res.ok) return { ok: true, status: res.status };
    } catch (error) {
      lastStatus = "NO_RESPONSE";
      lastError = String(error.message || error);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return { ok: false, status: lastStatus, error: lastError };
};

const stopKnownNodeProcesses = async () => {
  if (process.platform !== "win32") return;

  const ports = new Set(["4173", "4174", "4175", "4176", "4177", "4178"]);
  const pids = new Set();

  try {
    const output = execSync("netstat -ano -p tcp", { encoding: "utf8" });
    const lines = output.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("TCP")) continue;
      const parts = trimmed.split(/\s+/);
      const localAddress = parts[1] || "";
      const pid = parts[4] || "";
      const port = localAddress.split(":").pop();
      if (ports.has(port) && pid) {
        pids.add(pid);
      }
    }
  } catch {
    // Best-effort cleanup only.
  }

  for (const pid of pids) {
    await run("taskkill", ["/PID", pid, "/F"]).catch(() => {
      // Best-effort cleanup only.
    });
  }

  await new Promise((r) => setTimeout(r, 250));
};

const classifyPreviewFailure = ({ serverStatus, serverError, output = "" }) => {
  const joined = String(output || "");
  if (/Port 4173 is already in use/i.test(joined)) {
    return {
      likelyCause: "preview port 4173 is occupied by another process",
      nextAction: "Free port 4173 or rerun with `npm run qa -- --recovery` after closing other preview sessions.",
    };
  }

  if (/spawn EPERM|operation not permitted/i.test(joined)) {
    return {
      likelyCause: "esbuild spawn permission issue or locked file in dist",
      nextAction: "Run `npm run qa:lock`, pause OneDrive/AV sync, then rerun with `npm run qa -- --recovery`.",
    };
  }

  if (serverStatus === "NO_RESPONSE") {
    return {
      likelyCause: "preview server never became reachable",
      nextAction: "Check Node process launch permissions and retry in recovery mode.",
    };
  }

  if (Number(serverStatus) === 404) {
    return {
      likelyCause: "server reachable but wrong root or preview bootstrap failed",
      nextAction: "Confirm preview is serving this workspace and dist is not locked.",
    };
  }

  return {
    likelyCause: `preview startup failed with status=${serverStatus} (${serverError || "no error details"})`,
    nextAction: "Re-run with `npm run qa -- --recovery` and inspect preview logs.",
  };
};

const startPreviewWithLogs = async () => {
  const previewLogs = [];
  const preview = spawn(
    "npm",
    ["run", "preview", "--", "--host", PREVIEW_HOST, "--port", PREVIEW_PORT, "--strictPort"],
    {
      stdio: ["ignore", "pipe", "pipe"],
      shell: process.platform === "win32",
    },
  );

  preview.stdout?.on("data", (chunk) => {
    const text = String(chunk);
    process.stdout.write(text);
    previewLogs.push(text);
  });
  preview.stderr?.on("data", (chunk) => {
    const text = String(chunk);
    process.stderr.write(text);
    previewLogs.push(text);
  });

  const server = await waitForServer();
  return { preview, server, previewLogs: previewLogs.join("") };
};

const diagnoseDistLock = () => {
  if (!fs.existsSync(DIST_DIR)) return null;

  const lockCandidates = [
    path.join(DIST_DIR, "projects", "inklink", "images", "Home.svg"),
    path.join(DIST_DIR, "projects", "inklink", "images"),
    DIST_DIR,
  ];

  for (const candidate of lockCandidates) {
    if (!fs.existsSync(candidate)) continue;
    try {
      fs.renameSync(candidate, candidate);
    } catch (error) {
      return `possible lock at ${candidate}: ${String(error.message || error)}`;
    }
  }

  return null;
};

const ensureDistReady = () => {
  if (!fs.existsSync(DIST_DIR)) {
    return "dist folder is missing. Run `npm run build` before QA.";
  }
  if (!fs.existsSync(DIST_INDEX)) {
    return "dist/index.html is missing. Run `npm run build` before QA.";
  }
  return null;
};

let failed = false;
let preview = null;
let failureContext = "";

try {
  if (RECOVERY_MODE) {
    console.log("[qa:preflight] recovery mode enabled: stopping known Node preview/build processes.");
    await stopKnownNodeProcesses();
  }

  const lockDiagnosis = diagnoseDistLock();
  if (lockDiagnosis) {
    console.warn(`[qa:preflight] ${lockDiagnosis}`);
  } else {
    console.log("[qa:preflight] dist lock probe passed.");
  }

  const distStatus = ensureDistReady();
  if (distStatus) {
    throw new Error(distStatus);
  }

  await run("node", ["scripts/qa-media-scan.mjs"], { ...process.env, BASE_URL });
  await run("node", ["scripts/qa-audit-guardrails.mjs"], { ...process.env, BASE_URL });
  let firstAttempt = await startPreviewWithLogs();
  preview = firstAttempt.preview;
  let server = firstAttempt.server;
  let previewLogs = firstAttempt.previewLogs;

  if (!server.ok && RECOVERY_MODE) {
    if (preview && !preview.killed) preview.kill("SIGTERM");
    console.warn("[qa:preflight] first preview attempt failed in recovery mode, retrying once.");
    await stopKnownNodeProcesses();
    const secondAttempt = await startPreviewWithLogs();
    preview = secondAttempt.preview;
    server = secondAttempt.server;
    previewLogs = `${previewLogs}\n${secondAttempt.previewLogs}`;
  }

  if (!server.ok) {
    const diagnostic = classifyPreviewFailure({
      serverStatus: server.status,
      serverError: server.error,
      output: previewLogs,
    });
    failureContext = `preview startup failed (${diagnostic.likelyCause}). Next: ${diagnostic.nextAction}`;
    throw new Error(failureContext);
  }

  console.log(`[qa:preflight] preview ready (${BASE_URL}, status=${server.status}).`);

  await run("node", ["scripts/qa-routes.mjs"], {
    ...process.env,
    BASE_URL,
    QA_REQUIRE_SERVER: "1",
    QA_START_PREVIEW: "0",
  });
  await run("node", ["scripts/qa-sitemap-inventory.mjs"], {
    ...process.env,
    BASE_URL,
  });
  await run("node", ["scripts/qa-metadata.mjs"], {
    ...process.env,
    BASE_URL,
    QA_METADATA_MODE: "served",
  });
  await run("npx", ["playwright", "test", "tests/qa-browser.spec.js", "--reporter=line"], {
    ...process.env,
    BASE_URL,
  });
} catch (error) {
  failed = true;
  console.error(`[qa] ${failureContext || error.message}`);
} finally {
  if (preview && !preview.killed) {
    preview.kill("SIGTERM");
  }
}

if (failed) process.exit(1);
console.log("[qa] All checks passed.");
