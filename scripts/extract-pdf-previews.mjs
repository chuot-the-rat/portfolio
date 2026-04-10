import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const [, , inputPdfArg, outputDirArg, ...rest] = process.argv;

if (!inputPdfArg || !outputDirArg) {
  console.error(
    "Usage: node scripts/extract-pdf-previews.mjs <input-pdf> <output-dir> [--base name] [--pages 1,2,3]",
  );
  process.exit(1);
}

const getFlagValue = (flag, fallback) => {
  const idx = rest.indexOf(flag);
  if (idx >= 0 && rest[idx + 1]) return rest[idx + 1];
  return fallback;
};

const baseName = getFlagValue("--base", "preview");
const pagesArg = getFlagValue("--pages", "1,2,3");
const pages = pagesArg
  .split(",")
  .map((v) => Number.parseInt(v.trim(), 10))
  .filter((n) => Number.isFinite(n) && n > 0);

const inputPdf = path.resolve(process.cwd(), inputPdfArg);
const outputDir = path.resolve(process.cwd(), outputDirArg);

if (!fs.existsSync(inputPdf)) {
  console.error(`Input PDF not found: ${inputPdf}`);
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

const pdfBytes = fs.readFileSync(inputPdf);
const pdfBase64 = pdfBytes.toString("base64");

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1600, height: 2200 },
  deviceScaleFactor: 1.5,
});

try {
  const page = await context.newPage();
  await page.setContent(
    `<!doctype html>
    <html>
      <head>
        <style>
          body { margin: 0; background: #fff; }
          #wrap { display: flex; justify-content: center; padding: 24px; }
          canvas { box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12); }
        </style>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
      </head>
      <body>
        <div id="wrap"><canvas id="pdf-canvas"></canvas></div>
      </body>
    </html>`,
    { waitUntil: "load" },
  );

  await page.waitForFunction(() => Boolean(globalThis.pdfjsLib), null, {
    timeout: 20_000,
  });

  for (const pageNumber of pages) {
    await page.evaluate(async ({ base64, pageNumber: desiredPage }) => {
      const raw = atob(base64);
      const bytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);

      globalThis.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

      const pdf = await globalThis.pdfjsLib.getDocument({ data: bytes }).promise;
      const safePage = Math.min(Math.max(1, desiredPage), pdf.numPages);
      const pdfPage = await pdf.getPage(safePage);
      const viewport = pdfPage.getViewport({ scale: 2.0 });
      const canvas = document.getElementById("pdf-canvas");
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await pdfPage.render({ canvasContext: context, viewport }).promise;
      globalThis.__renderedPage = safePage;
    }, { base64: pdfBase64, pageNumber });

    const renderedPage = await page.evaluate(() => globalThis.__renderedPage || 1);
    const outPath = path.join(outputDir, `${baseName}-${pageNumber}.png`);
    await page.screenshot({
      path: outPath,
      fullPage: true,
      animations: "disabled",
    });
    console.log(
      `[extract-pdf-previews] wrote ${outPath} (rendered page ${renderedPage})`,
    );
  }
} finally {
  await context.close();
  await browser.close();
}
