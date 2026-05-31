import { spawn } from "node:child_process";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:4173";
const REQUIRE_SERVER = process.env.QA_REQUIRE_SERVER === "1";
const START_PREVIEW = process.env.QA_START_PREVIEW !== "0";
const PREVIEW_HOST = process.env.QA_PREVIEW_HOST || "127.0.0.1";
const PREVIEW_PORT = process.env.QA_PREVIEW_PORT || "4173";
const ROUTES = [
  "/",
  "/about",
  "/case-studies/inklink",
  "/case-studies/prolog",
  "/case-studies/sidequest",
  "/projects/inklink",
  "/projects/prolog",
  "/projects/sidequest",
  "/design/fizzu-soda",
  "/design/sap",
];

const BAD_MARKERS = [
  "Page Not Found",
  "Something went wrong loading this project",
  "404",
];

const toVisibleText = (html = "") =>
  String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const failures = [];
let preview = null;
const stopPreview = () => {
  if (preview && !preview.killed) {
    preview.kill("SIGTERM");
  }
};

const checkServerReachable = async () => {
  try {
    const res = await fetch(BASE_URL);
    return { ok: res.ok, status: res.status };
  } catch (error) {
    return { ok: false, status: "NO_RESPONSE", error: String(error.message || error) };
  }
};

const waitForServer = async (retries = 50) => {
  let lastStatus = "NO_RESPONSE";
  let lastError = "";

  for (let i = 0; i < retries; i += 1) {
    const health = await checkServerReachable();
    if (health.ok) return { ok: true, status: health.status };
    lastStatus = health.status;
    lastError = health.error || "";
    await new Promise((r) => setTimeout(r, 500));
  }

  return { ok: false, status: lastStatus, error: lastError };
};

if (START_PREVIEW) {
  preview = spawn(
    "npm",
    ["run", "preview", "--", "--host", PREVIEW_HOST, "--port", PREVIEW_PORT, "--strictPort"],
    { stdio: "inherit", shell: process.platform === "win32" },
  );

  const server = await waitForServer();
  if (!server.ok) {
    const reason =
      server.status === "NO_RESPONSE"
        ? `preview startup failed: ${server.error || "no response"}`
        : `preview startup failed: status=${server.status}`;
    const nextAction =
      server.status === "NO_RESPONSE"
        ? "likely cause: preview did not boot. next: run `npm run qa:lock` then retry."
        : "likely cause: wrong server root or failed preview bootstrap. next: verify preview serves this workspace.";
    console.error(`[qa:routes] FAIL | environment | ${reason}`);
    console.error(`[qa:routes] ${nextAction}`);
    stopPreview();
    process.exit(1);
  }
}

if (REQUIRE_SERVER) {
  const health = await checkServerReachable();
  if (!health.ok) {
    const reason =
      health.status === "NO_RESPONSE"
        ? `preview server unreachable: ${health.error}`
        : `preview server responded with status ${health.status}`;
    console.error(`[qa:routes] FAIL | environment | ${reason}`);
    console.error("[qa:routes] likely cause: preview is down. next: start preview or run `npm run qa`.");
    stopPreview();
    process.exit(1);
  }
}

for (const route of ROUTES) {
  const url = `${BASE_URL}${route}`;
  try {
    const res = await fetch(url);
    const html = await res.text();
    const visibleText = toVisibleText(html);
    const statusOk = res.status === 200;
    const marker = BAD_MARKERS.find((value) => visibleText.includes(value));
    if (!statusOk || marker) {
      failures.push({
        route,
        status: res.status,
        marker: marker || "",
      });
      continue;
    }
    console.log(`[qa:routes] PASS ${route} -> ${res.status}`);
  } catch (error) {
    failures.push({
      route,
      status: "NO_RESPONSE",
      marker: String(error.message || error),
    });
  }
}

if (failures.length > 0) {
  const noResponseCount = failures.filter((f) => f.status === "NO_RESPONSE").length;
  const full404Count = failures.filter((f) => f.status === 404).length;
  console.error("[qa:routes] FAIL");
  if (noResponseCount === ROUTES.length) {
    console.error(" - diagnosis: server did not respond for any route (environment issue).");
  } else if (full404Count === ROUTES.length) {
    console.error(" - diagnosis: every route returned 404 (likely wrong build/server root).");
  }
  for (const fail of failures) {
    console.error(
      ` - ${fail.route} | status=${fail.status}${fail.marker ? ` | marker=${fail.marker}` : ""}`,
    );
  }
  stopPreview();
  process.exit(1);
}

stopPreview();

console.log("[qa:routes] All route checks passed.");
