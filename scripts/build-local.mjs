import { execFile, spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const ROOT = process.cwd();
const DIST_PATH = path.join(ROOT, "dist");

const runCommand = (command, args) =>
  new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: false,
    });
    child.on("exit", (code) => resolve(code ?? 1));
  });

const runBuild = () =>
  process.platform === "win32"
    ? runCommand("cmd.exe", ["/d", "/s", "/c", "npm run build"])
    : runCommand("npm", ["run", "build"]);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const listWindowsPidsByPort = async (port) => {
  try {
    const { stdout } = await execFileAsync("netstat", ["-ano", "-p", "tcp"]);
    return stdout
      .split(/\r?\n/)
      .filter((line) => line.includes(`:${port}`) && line.includes("LISTENING"))
      .map((line) => line.trim().split(/\s+/).at(-1))
      .filter(Boolean)
      .filter((pid) => /^\d+$/.test(pid));
  } catch {
    return [];
  }
};

const killPidWindows = async (pid) => {
  try {
    await execFileAsync("taskkill", ["/PID", String(pid), "/F"]);
  } catch {
    // Process may already be gone.
  }
};

const killLikelyViteProcessesWindows = async () => {
  try {
    const currentPid = process.pid;
    const query = [
      `$currentPid = ${currentPid}`,
      "Get-CimInstance Win32_Process |",
      "Where-Object {",
      "  $_.ProcessId -ne $currentPid -and",
      "  $_.CommandLine -and",
      "  $_.CommandLine -match 'vite|npm\\s+run\\s+(dev|preview)' -and",
      `  $_.CommandLine -like '*${ROOT.replace(/\\/g, "\\\\")}*'`,
      "} |",
      "ForEach-Object { Stop-Process -Id $_.ProcessId -Force }",
    ].join(" ");
    await execFileAsync("powershell", ["-NoProfile", "-Command", query]);
  } catch {
    // No matching process found or PowerShell unavailable.
  }
};

const clearDistWithRetry = async () => {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await fs.rm(DIST_PATH, { recursive: true, force: true });
      return true;
    } catch (error) {
      if (attempt === 3) break;
      console.warn(`[build:local] dist cleanup retry ${attempt}/3 after lock.`);
      await wait(500);
    }
  }
  return false;
};

const cleanupLockProneState = async () => {
  if (process.platform === "win32") {
    const ports = [4173, 4174, 5173, 5174];
    const pids = new Set();
    for (const port of ports) {
      const found = await listWindowsPidsByPort(port);
      for (const pid of found) pids.add(pid);
    }
    if (pids.size > 0) {
      console.log(
        `[build:local] Stopping local preview/dev listeners: ${[...pids].join(", ")}`,
      );
      await Promise.all([...pids].map((pid) => killPidWindows(pid)));
    }

    await killLikelyViteProcessesWindows();
    await wait(500);
  }

  const distCleared = await clearDistWithRetry();
  if (!distCleared) {
    console.warn("[build:local] Could not fully clear dist due to file lock; continuing retry.");
  }
};

console.log("[build:local] Running initial build...");
let exitCode = await runBuild();

if (exitCode === 0) {
  console.log("[build:local] Build succeeded.");
  process.exit(0);
}

console.warn(
  `[build:local] Initial build failed (${exitCode}). Retrying after local cleanup...`,
);
await cleanupLockProneState();

exitCode = await runBuild();
if (exitCode !== 0) {
  console.error(`[build:local] Retry failed (${exitCode}).`);
  process.exit(exitCode);
}

console.log("[build:local] Build succeeded on retry.");
