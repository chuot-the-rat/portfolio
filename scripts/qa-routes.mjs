const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:4173";
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
  console.error("[qa:routes] FAIL");
  for (const fail of failures) {
    console.error(
      ` - ${fail.route} | status=${fail.status}${fail.marker ? ` | marker=${fail.marker}` : ""}`,
    );
  }
  process.exit(1);
}

console.log("[qa:routes] All route checks passed.");
