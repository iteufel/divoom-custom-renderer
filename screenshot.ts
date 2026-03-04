import puppeteer from "puppeteer";
import { config } from "./config";
import { writeFile } from "node:fs/promises";

export function makeScreenshotPath(): string {
  const id = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  return `/tmp/divoom_${id}.jpg`;
}

export async function captureWebpage(url: string, outPath: string): Promise<void> {
  console.log(`📸 Capturing ${url} at ${config.viewportWidth}×${config.viewportHeight}...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    await page.setViewport({
      width:  config.viewportWidth,
      height: config.viewportHeight,
      deviceScaleFactor: 1,
    });

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30_000 });

    // JPEG is required — Times Frame background must be a JPEG image (800×1280)
    const screenshot = await page.screenshot({
      type:     "jpeg",
      quality:  85,
      clip: {
        x: 0, y: 0,
        width:  config.viewportWidth,
        height: config.viewportHeight,
      },
    });

    await writeFile(outPath, screenshot);
    console.log(`✅ Screenshot saved to ${outPath}`);
  } finally {
    await browser.close();
  }
}

